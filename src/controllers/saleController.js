import '../config/ImportEnv';
import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import sendMessage from '../utils/responses/sendMessage';
import AppError from '../utils/errors/AppError';
import Sale from '../models/Sale';
import SaleOrderProduct from '../models/SaleOrderProduct';
import saleValidator from '../utils/validators/Sale';
import Carrier from '../models/Carrier';
import CustomerPayment from '../models/CustomerPayment';
import OrderProduct from '../models/OrderProduct';
import Product from '../models/Product';
import Staff from '../models/Staff';
import Administrator from '../models/Administrator';
import Customer from '../models/Customer';
import CustomerHistory from '../models/CustomerHistory';

export const createSale = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  // body verification
  const message = saleValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    primaryBill,
    discountAmount,
    taxPercent,
    taxAmount,
    initialPayment,
    totalBill,
    requiresDelivery,
    shippingStatus,
    deliveryCharge,
    deliveryAddress,
    customerName,
    mobileNumber,
    customerType,
    paymentMethod,
    mfsTrxId,
    Items,
    carrierName,
    carrierCell,
    carrierOrg,
  } = req.body;

  let isComplete = false
  if (totalBill === initialPayment) isComplete = true;

  // Items verify
  for (let i = 0; i < Items.length; i++) {
    const { opId, quantity } = Items[i];
    if (!opId) return next(new AppError('Items not found!', 404));
    const opInfo = await OrderProduct.findOne({ _id: opId, quantity: {
      $gte: quantity
    } });
    if (!opInfo) return next(new AppError('Insufficient quantity!', 404));
  }

  // check customer details
  const docCount = await Customer.count({});
  let customerInfo = await Customer.findOne({ mobileNumber });
  if (!customerInfo) {
    customerInfo = await Customer.create({
      customerName,
      mobileNumber,
      customerType,
      cardNum: `Card-${docCount + 1}`,
      cardIssueDate: Date.now(),
      createAt: Date.now(),
    });
  }

  // get sales count
  const TotalSales = await Sale.count({});

  // create Sale
  const saleData = await Sale.create({
    date: Date.now(),
    primaryBill,
    discountAmount,
    taxPercent,
    taxAmount,
    initialPayment,
    totalBill,
    isComplete,
    requiresDelivery,
    shippingStatus,
    deliveryCharge,
    deliveryAddress,
    customer: customerInfo._id,
    InvoiceNum: `Inv-${TotalSales + 1}`,
    paymentMethod,
    mfsTrxId,
    type: true,
    seller: userId,
    createAt: Date.now(),
  });

  if (!saleData) return next(new AppError('Somthing went wrong', 400));

  // create carrier
  if (carrierName && carrierCell) {
    const carrierInfo = await Carrier.create({
      name: carrierName,
      cell: carrierCell,
      organization: carrierOrg,
      sale: saleData._id,
    });
    saleData.carrier = carrierInfo._id;
  }

  // create customerPayment
  let customerPaymentInfo;
  if (initialPayment) {
    customerPaymentInfo = await CustomerPayment.create({
      date: Date.now(),
      amountPaid: initialPayment,
      paymentMethod,
      mfsTrxId,
      sale: saleData._id,
    });
  }

  // Sale Items
  const SaleOrderList = [], opList = [];
  let totalProfit = 0;
  let buyingAmount = 0;
  for (let i = 0; i < Items.length; i++) {
    const { opId, quantity } = Items[i];

    const opInfo = await OrderProduct.findById(opId);
    const productInfo = await Product.findById(opInfo.product);

    const purchasePrice = opInfo.purchasePrice;
    const sellPrice = productInfo.sellPrice;

    // check quantity
    if (quantity > opInfo.quantity) return next(new AppError('Insufficient quantity', 400));

    // sale quantity
    opInfo.quantity -= quantity;
    await opInfo.save();

    const singleProductProfit = (sellPrice - purchasePrice) * quantity;
    totalProfit += singleProductProfit;
    buyingAmount += (sellPrice * quantity);

    const saleOrderInfo = await SaleOrderProduct.create({
      quantity,
      singleProductProfit,
      productName: productInfo.name,
      unitPrice: productInfo.sellPrice,
      purchasePrice,
      orderProduct: opId,
      sale: saleData._id,
      createAt: Date.now(),
    });
    opList.push(opId);
    SaleOrderList.push(saleOrderInfo._id);
  }

  // save customer history
  const customerHistoryInfo = await CustomerHistory.create({
    date: Date.now(),
    amount: buyingAmount,
    customer: customerInfo._id,
  });

  // update buying price
  customerInfo.buyingAmount += buyingAmount;
  customerInfo.history.push(customerHistoryInfo._id);
  await customerInfo.save();

  // update staff sales
  if (req.currentUser.role === process.env.ADMIN) {
    const adminInfo = await Administrator.findOne({ user: userId });
    adminInfo.sales.push(saleData._id);
    await adminInfo.save();
  } else {
    const staffInfo = await Staff.findOne({ user: userId });
    staffInfo.sales.push(saleData._id);
    await staffInfo.save();
  }

  // relation between sale & saleOrder
  saleData.items = SaleOrderList;
  saleData.opList = opList;
  saleData.totalProfit = totalProfit - discountAmount;
  saleData.payments.push(customerPaymentInfo._id);
  await saleData.save();

  return sendData(res, saleData);
});

export const getSale = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const saleData = await Sale.findById(req.params.sid);
  if (!saleData) return next(new AppError('Sale not found', 404));

  return sendData(res, saleData);
});

export const getAllSale = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;
  const { type } = req.query;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 25;
  const skip = (page - 1) * limit;

  const saleData = await Sale.find({ type }).skip(skip).limit(limit);
  if (!saleData) return next(new AppError('somthing wrong', 404));
  
  return sendData(res, saleData);
});

export const modifySale = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const saleId = req.params.sid;
  const {
    shippingStatus,
    date,
    amountPaid,
    paymentMethod,
    mfsTrxId
  } = req.body;

  // sale Info
  const saleInfo = await Sale.findById(saleId);
  if (!saleInfo) return next(new AppError('Sale not found.', 404));

  if (saleInfo.shippingStatus === 'Cancel') return next(new AppError('Already Cancel this sale.', 404));

  // Cancel Sale
  if (shippingStatus) {
    if (shippingStatus === 'Cancel') {
      const { items } = saleInfo;
      for (let i = 0; i < items.length; i++) {
        const { _id, quantity } = items[i];
        const sopInfo = await SaleOrderProduct.findById(_id);
        if (!sopInfo) return next(new AppError('Sale Order not found.', 404));
        const opInfo = await OrderProduct.findById(sopInfo.orderProduct);
        if (!opInfo) return next(new AppError('Order Product not found.', 404));
        opInfo.quantity += quantity;
        await opInfo.save();
      }
      saleInfo.shippingStatus = shippingStatus;
      await saleInfo.save();
      return sendMessage(res, 'Sale cancel successfully.');
    }
    saleInfo.shippingStatus = shippingStatus;
  }
  
  const { totalBill } = saleInfo;

  // check payment history
  const paymentHistory = await CustomerPayment.find({ sale: saleId });
  let payAmounts = 0;
  if (paymentHistory) {
    for (let i = 0; i < paymentHistory.length; i++) {
      payAmounts += paymentHistory[i].amountPaid;
    }
  }

  const dueBill = totalBill - payAmounts;

  let customerPaymentInfo;
  if (payAmounts === totalBill || saleInfo.isComplete) {
    if (shippingStatus) {
      await saleInfo.save();
      return sendMessage(res, 'Sale modify successfully.');
    } else {
      return sendMessage(res, 'Total bill paid already.')
    }
  } else if (amountPaid > dueBill) {
    return sendMessage(res, `Your due amount is ${dueBill} tk.`)
  } else {
    if (date && date.length === 0) return next(new AppError('Provide sale payment date.', 400));
    if (amountPaid && amountPaid === 0) return next(new AppError('Provide amount.', 400));
    if (date && amountPaid) {
      customerPaymentInfo = await CustomerPayment.create({
        date,
        amountPaid,
        paymentMethod,
        mfsTrxId,
        sale: saleId,
      });
    }
    if (customerPaymentInfo && payAmounts + amountPaid === totalBill) {
      saleInfo.isComplete = true;
    }
  }

  if (customerPaymentInfo) {
    saleInfo.payments.push(customerPaymentInfo._id);
  }

  await saleInfo.save();

  return sendMessage(res, 'Sale modify successfully.');
});

export const archiveSale = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const saleId = req.params.sid;

  // sale Info
  const saleInfo = await Sale.findOne({ _id: saleId, type: true });
  if (!saleInfo) return next(new AppError('Sale not found.', 404));

  // refactor store
  for (let i = 0; i < saleInfo.items.length; i++) {
    const el = saleInfo.items[i];
    const opInfo = await OrderProduct.findById(saleInfo.opList[i]);
    opInfo.quantity += el.quantity;
    await opInfo.save();
  }

  // Remove payments
  await CustomerPayment.deleteMany({
    sale: saleId
  });

  // Reduce Total buying from customer
  const customerInfo = await Customer.findById(saleInfo.customer._id);
  customerInfo.buyingAmount -= saleInfo.primaryBill;

  // Remove customer buying history
  const customerHistoryData = await CustomerHistory.findOne({
    customer: saleInfo.customer._id,
    amount: saleInfo.primaryBill
  });
  customerInfo.history = customerInfo.history.filter(el => el._id != String(customerHistoryData._id));
  await CustomerHistory.findByIdAndDelete(customerHistoryData._id);
  await customerInfo.save();

  // Remove carrier
  await Carrier.deleteOne({
    sale: saleId
  });

  // type change
  saleInfo.type = false;
  await saleInfo.save();
  
  return sendMessage(res, 'Sale archive successfully');
});

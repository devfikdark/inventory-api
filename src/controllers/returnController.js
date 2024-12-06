import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import sendMessage from '../utils/responses/sendMessage';
import AppError from '../utils/errors/AppError';
import Return from '../models/Return';
import OrderProduct from '../models/OrderProduct';
import Product from '../models/Product';
import Sale from '../models/Sale';
import ReturnHistory from '../models/ReturnHistory';
import SaleOrderProduct from '../models/SaleOrderProduct';

// Supplier
export const createReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { quantity, reason, amount, orderProduct } = req.body;
  if (!quantity) return next(new AppError('Provide return quantity', 400));
  if (!reason) return next(new AppError('Provide return reason', 400));
  if (!amount) return next(new AppError('Provide return amount', 400));

  // get orderproducts info
  const orderProductInfo = await OrderProduct.findById(orderProduct);
  if (!orderProductInfo) return next(new AppError('Orderproduct not found', 404));

  const productInfo = await Product.findById(orderProductInfo.product);
  if (!productInfo) return next(new AppError('Product not found', 404));

  // create return
  const returnInfo = await Return.create({
    name: `${productInfo.name}_Quantity(${quantity})`,
    quantity,
    reason,
    amount,
    returnAmount: amount,
    order: orderProductInfo.order,
    orderProduct,
    createdBy: userId,
    createAt: Date.now(),
  });

  if (!returnInfo) return next(new AppError('Somthing wrong', 400));
  return sendData(res, returnInfo);
});

export const getReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const returnData = await Return.findById(req.params.rid);
  if (returnData) {
    return sendData(res, returnData);
  }

  return next(new AppError('Return not found', 404));
});

export const getAllReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const returnData = await Return.find();
  if (!returnData) return next(new AppError('somthing wrong', 404));

  for (let i = 0; i < returnData.length; i += 1) {
    returnData[i].products = undefined;
    returnData[i].createdBy = undefined;
  }
  return sendData(res, returnData);
});

export const getAllActiveReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const returnData = await Return.find({ status: true, order: req.params.oid }).select('-orderProduct -createdBy name amount');
  if (!returnData) return next(new AppError('somthing wrong', 404));

  return sendData(res, returnData);
});

export const modifyReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { status } = req.body;
  const body = {
    status,
    modifyBy: userId,
    modifyAt: Date.now(),
  };

  const returnData = await Return.findByIdAndUpdate(
    req.params.rid,
    body, {
      new: true,
      runValidators: true,
    },
  );
  if (returnData) {
    return sendData(res, returnData);
  }

  return next(new AppError('Return not found', 404));
});


// Regular
export const createRegularReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { InvoiceNum, opId, quantity, discount } = req.body;
  if (!InvoiceNum) return next(new AppError('Provide return invoice number', 400));
  if (!opId) return next(new AppError('Provide order Id', 400));
  if (!quantity) return next(new AppError('Provide return quantity', 400));

  // get orderproducts info
  const saleInfo = await Sale.findOne({ InvoiceNum });
  if (!saleInfo) return next(new AppError('Sale not found', 404));

  if (discount > saleInfo.discountAmount) return next(new AppError(`Your previous discount is ${saleInfo.discountAmount} tk`, 404));

  // verify OP
  const opInfo = await OrderProduct.findOne({ opId });
  if (!opInfo) return next(new AppError('Product not found', 404));

  const pos = saleInfo.opList.indexOf(opInfo._id);
  if (pos === -1) return next(new AppError('Product not found', 404));

  // remove qunatity from Invoice
  const saleId = saleInfo.items[pos]._id;
  const opData = saleInfo.opList[pos];
  const previousSaleCount = saleInfo.items[pos].quantity;
  if (quantity > previousSaleCount) return next(new AppError(`Previous sale count is ${previousSaleCount}`, 404));

  const saleOrderProduct = await SaleOrderProduct.findById(saleInfo.items[pos]._id);
  if (!saleOrderProduct) return next(new AppError('Product not found', 404));
  if (quantity > 0 && quantity < previousSaleCount) {
    saleOrderProduct.quantity -= quantity;
  } else {
    saleOrderProduct.quantity = 0;
    saleInfo.items = saleInfo.items.filter(el => el._id !== saleId);
    saleInfo.opList = saleInfo.opList.filter(el => el !== opData);
  }

  // add stock from OP
  opInfo.quantity += quantity;

  // save history
  const returnHistoryInfo = await ReturnHistory.create({
    customerName: saleInfo.customer.customerName,
    mobileNumber: saleInfo.customer.mobileNumber,
    customerType: saleInfo.customer.customerType,
    InvoiceNum,
    productName: saleOrderProduct.productName,
    unitPrice: saleOrderProduct.unitPrice,
    totalReturnPrice: saleOrderProduct.unitPrice * quantity,
    quantity,
    createdBy: userId,
    createAt: Date.now(),
  });
  if (!returnHistoryInfo) return next(new AppError('Something went wrong to create return', 400));

  const reduceProfit = (saleOrderProduct.unitPrice - opInfo.purchasePrice) * quantity;

  const productPrice = (saleOrderProduct.unitPrice * quantity);

  saleInfo.totalProfit += parseFloat(saleInfo.discountAmount);
  saleInfo.totalProfit -= (parseFloat(reduceProfit) + parseFloat(discount));
  saleInfo.primaryBill -= parseFloat(productPrice);

  const taxAmount = parseFloat(saleInfo.primaryBill) * (parseFloat(saleInfo.taxPercent || 0) / 100);
  saleInfo.totalBill = parseFloat(saleInfo.primaryBill + saleInfo.deliveryCharge + taxAmount) - discount;
  saleInfo.taxAmount = taxAmount;
  saleInfo.discountAmount = discount;
  saleInfo.isModify = true;

  saleOrderProduct.singleProductProfit -= reduceProfit;
 
  await saleOrderProduct.save();
  await saleInfo.save();
  await opInfo.save();

  return sendMessage(res, 'Return created successfully');
});

export const getAllRegularReturn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const returnHistoryData = await ReturnHistory.find();
  if (!returnHistoryData) return next(new AppError('somthing wrong', 404));

  return sendData(res, returnHistoryData);
});

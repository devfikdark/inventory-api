import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Product from '../models/Product';
import Customer from '../models/Customer';
import Supplier from '../models/Supplier';
import Sale from '../models/Sale';
import SaleOrderProduct from '../models/SaleOrderProduct';
import Return from '../models/Return';
import Transaction from '../models/Transaction';
import Staff from '../models/Staff';
import Order from '../models/Order';


export const getInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const TotalProduct = await Product.count({});
  const TotalSupplier = await Supplier.count({});
  const TotalSale = await Sale.count({});
  const TotalReturn = await Return.count({});
  const TotalTransaction = await Transaction.count({});
  const TotalStaff = await Staff.count({});

  // last 10 sales
  const last10SalesInfo = await Sale.find({ type: true, shippingStatus: { $ne: 'Cancel' }}).sort('-createAt').limit(10);
  const Last10Sales = [];
  for (let i = 0; i < last10SalesInfo.length; i++) {
    const el = last10SalesInfo[i];
    Last10Sales.push({
      date: el.date,
      totalBill: el.totalBill,
      customer: el.customer.customerName,
      seller: el.seller.fullName,
      totalProfit: el.totalProfit
    });
  }

  // customer type
  const customerInfo = await Customer.find();
  let Regular = 0, Online = 0, Wholesale = 0;
  for (let i = 0; i < customerInfo.length; i++) {
    const el = customerInfo[i];
    if (el.customerType === 'Regular') Regular++;
    else if (el.customerType === 'Online') Online++;
    else Wholesale++;
  }

  // Incomplete order
  const orderInfo = await Order.find();
  let IncompleteOrder = 0;
  for (let i = 0; i < orderInfo.length; i++) {
    const el = orderInfo[i];
    if (!el.orderProduct.length) IncompleteOrder++;
  }

  // top sale products
  const saleInfo = await SaleOrderProduct.find().populate('orderProduct', '-product opId');
  const TopSaleProducts = [];
  for (let i = 0; i < saleInfo.length; i++) {
    let pos = TopSaleProducts.findIndex(el => el._id === saleInfo[i].orderProduct._id && saleInfo[i].orderProduct);
    if (pos !== -1) {
      TopSaleProducts[pos].count += 1;
    } else {
      TopSaleProducts.push({
        _id: saleInfo[i].orderProduct._id,
        opId: saleInfo[i].orderProduct.opId,
        count: 1,
        productName: saleInfo[i].productName
      })
    }
  }

  TopSaleProducts.sort((a, b) => a.count > b.count ? -1 : 1);

  const now = new Date();
  const saleData = await Sale.find({ 
    type: true, 
    shippingStatus: { $ne: 'Cancel' }, 
    createAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())}
  });

  let totalBill = 0, totalProfit = 0;
  for (let i = 0; i < saleData.length; i++) {
    const el = saleData[i];
    totalBill += el.totalBill;
    totalProfit += el.totalProfit;
  }

  const data = {
    TotalProduct,
    TotalCustomer: customerInfo.length,
    TotalSupplier,
    TotalSale,
    TotalReturn,
    TotalTransaction,
    TotalStaff,
    IncompleteOrder,
    CustomerType: {
      Regular,
      Wholesale,
      Online,
    },
    Last10Sales,
    Top10SaleProducts: TopSaleProducts.slice(0, 10),
    totalBill,
    totalProfit,
  };
 
  return sendData(res, data);
});

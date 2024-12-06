import JsBarcode from 'jsbarcode';
import { createCanvas } from 'canvas'
import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import sendMessage from '../utils/responses/sendMessage';
import AppError from '../utils/errors/AppError';
import Order from '../models/Order';
import OrderProduct from '../models/OrderProduct';
import SupplierOrder from '../models/SupplierOrder';
import orderProductValidator from '../utils/validators/OrderProduct';
import Product from '../models/Product';
import cloudinarySetting from '../config/cloudinarySetting';

export const createOrder = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const {
    name,
    supplier,
    date,
  } = req.body;
  if (!name) return next(new AppError('Provide Order name', 400));

  // create order
  const orderData = await Order.create({
    name,
    supplier,
    date,
    createdBy: userId,
    createAt: Date.now(),
  });

  if (!orderData) return next(new AppError('somthing wrong', 404));

  // relation between order & supplier
  await SupplierOrder.create({
    supplier,
    order: orderData._id,
    createAt: Date.now(),
  });

  orderData.orderProduct = undefined;
  orderData.transactions = undefined;

  return sendData(res, orderData);
});

export const getOrder = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const orderData = await Order.findById(req.params.oid);
  if (orderData) {
    return sendData(res, orderData);
  }

  return next(new AppError('Order not found', 404));
});

export const getAllOrder = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const orderData = await Order.find();
  if (!orderData) return next(new AppError('somthing wrong', 404));

  return sendData(res, orderData);
});

export const modifyOrder = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const {
    supplier,
    products,
  } = req.body;

  // Items verify
  for (let i = 0; i < products.length; i++) {
    if (!products[i].pId) return next(new AppError('Items not found!', 404));
    const opInfo = await Product.findById(products[i].pId);
    if (!opInfo) return next(new AppError('Items not found!', 404));
  }

  // modify order
  const body = {
    supplier,
    modifyBy: userId,
    modifyAt: Date.now(),
  };

  const orderData = await Order.findByIdAndUpdate(
    req.params.oid,
    body, {
      new: true,
      runValidators: true,
    },
  );


  if (!orderData) return next(new AppError('Order not found', 404));
  
  // create orderproducts
  let idx = 0, totalBill = 0;
  const orderProductInfo = [];
  while (products.length > idx) {
    const product = products[idx];

    // body verification
    const message = orderProductValidator(product);
    if (message !== 'ok') return next(new AppError(message, 400));

    const {
      pId,
      quantity,
      purchasePrice,
      mfgDate,
      expiryDate,
    } = product;

    totalBill += (quantity * purchasePrice);

    const productInfo = await Product.findById(pId);
    if (!productInfo) return next(new AppError('Product not found', 404));

    const docCount = await OrderProduct.count({});
    const opId = `OP-${docCount + 1}`;
    const orderProductData = await OrderProduct.create({
      opId,
      quantity,
      purchasePrice,
      mfgDate,
      expiryDate,
      order: orderData._id,
      product: pId,
      productName: productInfo.name,
      createAt: Date.now(),
    });
    if (!orderProductData) return next(new AppError('Something went wrong!!!', 404));

    // relation between product & order product
    productInfo.orderProduct.push(orderProductData._id);
    await productInfo.save();

    // Generate BarCode
    const canvas = createCanvas();
    JsBarcode(canvas, opId, {
      width: 2,
      height: 50,
      displayValue: true
    });
    const base64Data = canvas.toDataURL()
    const cloudData = await cloudinarySetting.uploader.upload(base64Data);
    if (cloudData.url) {
      orderProductData.barCodeUrl = cloudData.url;
      await orderProductData.save();
    } else {
      return sendMessage(res, 'Failed to Generate BarCode');
    }

    orderProductInfo.push(orderProductData._id);
    idx += 1;
  }

  // relation between order & order products
  orderData.orderProduct = orderProductInfo;
  orderData.totalBill = totalBill;
  orderData.totalDue = totalBill;
  await orderData.save();

  orderData.orderProduct = undefined;
  orderData.transactions = undefined;

  return sendData(res, orderData);
});

export const getOPInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const opData = await OrderProduct.findOne({ opId: req.params.opid }).select('quantity purchasePrice product');
  if (!opData) return next(new AppError('Order Product not found', 404));

  return sendData(res, opData);
});

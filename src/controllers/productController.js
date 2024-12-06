import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Product from '../models/Product';
import ProductTag from '../models/ProductTag';
import productValidator from '../utils/validators/Product';
import getProductInfo from '../utils/dto/getProductInfo';
import OrderProduct from '../models/OrderProduct';

export const createProduct = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  // body verification
  const message = productValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    name,
    sellPrice,
    image,
    brand,
    size,
    tags,
  } = req.body;

  // create product
  const productData = await Product.create({
    name,
    sellPrice,
    createdBy: userId,
    createAt: Date.now(),
    image,
    brand,
    size,
    tags,
  });

  // create product tags
  let pos = 0;
  const productTags = [];
  while (tags.length > pos) {
    const productTag = await ProductTag.create({
      product: productData._id,
      tag: tags[pos],
      createAt: Date.now(),
    });
    productTags.push(productTag._id);
    pos += 1;
  }

  // add product tags
  productData.productTag = productTags;
  await productData.save();

  if (productData) {
    productData.modifyBy = undefined;
    productData.modifyAt = undefined;
    productData.productTag = undefined;
    productData.orderProduct = undefined;
    productData.tags = undefined;

    return sendData(res, productData);
  }

  return next(new AppError('somthing wrong', 404));
});

export const getProduct = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const productData = await Product.findById(req.params.pid);
  if (!productData) return next(new AppError('Product not found', 404));

  return sendData(res, await getProductInfo([productData]));
});

export const getAllProduct = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 25;
  const skip = (page - 1) * limit;

  const productData = await Product.find().skip(skip).limit(limit);
  
  if (!productData) return next(new AppError('somthing wrong', 404));

  return sendData(res, await getProductInfo(productData));
});

export const modifyProduct = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const {
    name,
    size,
    sellPrice,
    image,
    brand,
    tags,
  } = req.body;

  const body = {};
  if (name) body.name = name;
  if (size) body.size = size;
  if (sellPrice) body.sellPrice = sellPrice;
  if (image) body.image = image;
  if (brand) body.brand = brand;
  if (tags) body.tags = tags;

  const productData = await Product.findByIdAndUpdate(
    req.params.pid,
    body, {
      new: true,
      runValidators: true,
    },
  );

  productData.modifyBy.push(userId);
  productData.modifyAt.push(Date.now());

  // remove previous product tags
  await ProductTag.deleteMany({ product: productData._id });

  // create product tags
  let pos = 0;
  const productTags = [];
  while (tags.length > pos) {
    const productTag = await ProductTag.create({
      product: productData._id,
      tag: tags[pos],
      createAt: Date.now(),
    });
    productTags.push(productTag._id);
    pos += 1;
  }

  // add product tags
  productData.productTag = productTags;
  await productData.save();

  if (productData) {
    productData.modifyBy = undefined;
    productData.modifyAt = undefined;
    productData.productTag = undefined;
    productData.orderProduct = undefined;
    productData.tags = undefined;

    return sendData(res, productData);
  }

  return next(new AppError('Product not found', 404));
});


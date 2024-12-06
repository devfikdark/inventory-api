import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Brand from '../models/Brand';

export const createBrand = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { name } = req.body;
  if (!name) return next(new AppError('Provide brand name', 400));

  const brandData = await Brand.create({
    name,
    createdBy: userId,
    createAt: Date.now(),
  });
  if (brandData) {
    brandData.products = undefined;
    return sendData(res, brandData);
  }

  return next(new AppError('somthing wrong', 404));
});

export const getBrand = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const brandData = await Brand.findById(req.params.bid).populate('createdBy', 'fullName');
  if (brandData) {
    brandData.products = undefined;
    return sendData(res, brandData);
  }

  return next(new AppError('Brand not found', 404));
});

export const getAllBrand = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const brandData = await Brand.find();
  if (!brandData) return next(new AppError('somthing wrong', 404));

  for (let i = 0; i < brandData.length; i += 1) {
    brandData[i].products = undefined;
    brandData[i].createdBy = undefined;
    brandData[i].createAt = undefined;
  }
  return sendData(res, brandData);
});

export const modifyBrand = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { name } = req.body;
  const body = {
    name,
    modifyBy: userId,
    modifyAt: Date.now(),
  };

  const brandData = await Brand.findByIdAndUpdate(
    req.params.bid,
    body, {
      new: true,
      runValidators: true,
    },
  );
  if (brandData) {
    brandData.products = undefined;
    return sendData(res, brandData);
  }

  return next(new AppError('Brand not found', 404));
});

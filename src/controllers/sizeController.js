import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Size from '../models/Size';

export const createSize = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { name } = req.body;
  if (!name) return next(new AppError('Provide size name', 400));

  const sizeData = await Size.create({
    name,
    createdBy: userId,
    createAt: Date.now(),
  });
  if (sizeData) {
    sizeData.products = undefined;
    return sendData(res, sizeData);
  }

  return next(new AppError('somthing wrong', 404));
});

export const getSize = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const sizeData = await Size.findById(req.params.sid).populate('createdBy', 'fullName');
  if (sizeData) {
    sizeData.products = undefined;
    return sendData(res, sizeData);
  }

  return next(new AppError('Size not found', 404));
});

export const getAllSize = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const sizeData = await Size.find();
  if (!sizeData) return next(new AppError('somthing wrong', 404));

  for (let i = 0; i < sizeData.length; i += 1) {
    sizeData[i].products = undefined;
    sizeData[i].createdBy = undefined;
    sizeData[i].createAt = undefined;
  }
  return sendData(res, sizeData);
});

export const modifySize = CatchAsync(async (req, res, next) => {
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

  const sizeData = await Size.findByIdAndUpdate(
    req.params.sid,
    body, {
      new: true,
      runValidators: true,
    },
  );
  if (sizeData) {
    sizeData.products = undefined;
    return sendData(res, sizeData);
  }

  return next(new AppError('Size not found', 404));
});

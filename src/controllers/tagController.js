import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Tag from '../models/Tag';

export const createTag = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { name } = req.body;
  if (!name) return next(new AppError('Provide tag name', 400));

  const tagData = await Tag.create({
    name,
    createdBy: userId,
    createAt: Date.now(),
  });
  if (tagData) {
    tagData.productTag = undefined;
    return sendData(res, tagData);
  }

  return next(new AppError('somthing wrong', 404));
});

export const getTag = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const tagData = await Tag.findById(req.params.tid).populate('createdBy', 'fullName');
  if (tagData) {
    tagData.productTag = undefined;
    return sendData(res, tagData);
  }

  return next(new AppError('Tag not found', 404));
});

export const getAllTag = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const tagData = await Tag.find();
  if (!tagData) return next(new AppError('somthing wrong', 404));

  for (let i = 0; i < tagData.length; i += 1) {
    tagData[i].productTag = undefined;
    tagData[i].createdBy = undefined;
    tagData[i].createAt = undefined;
  }
  return sendData(res, tagData);
});

export const modifyTag = CatchAsync(async (req, res, next) => {
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

  const tagData = await Tag.findByIdAndUpdate(
    req.params.tid,
    body, {
      new: true,
      runValidators: true,
    },
  );
  if (tagData) {
    tagData.productTag = undefined;
    return sendData(res, tagData);
  }

  return next(new AppError('Tag not found', 404));
});

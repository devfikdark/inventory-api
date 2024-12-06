import AppError from '../utils/errors/AppError';
import catchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';

// Create One
export const createOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const modelName = Model.collection.collectionName;
  console.log(modelName);
  switch (modelName) {
    case '': {
      break;
    }
    default: {
      break;
    }
  }

  const body = {
    ...req.body,
    createAt: Date.now(),
  };

  const data = await Model.create(body);
  return sendData(res, data);
});

// Get All
export const getAll = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const docs = await Model.find();
  const modelName = Model.collection.collectionName;

  switch (modelName) {
    case '': {
      return sendData(res, docs);
    }
    default: {
      return sendData(res, docs);
    }
  }
});

// Get One
export const getOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const doc = await Model.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  const modelName = Model.collection.collectionName;
  switch (modelName) {
    case '': {
      return sendData(res, doc);
    }
    default: {
      return sendData(res, doc);
    }
  }
});

// Modify One
export const modifyOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const modelName = Model.collection.collectionName;

  switch (modelName) {
    case '': {
      break;
    }
    default: {
      break;
    }
  }

  const body = {
    ...req.body,
    createAt: Date.now(),
  };

  const doc = await Model.findByIdAndUpdate(
    req.params.id,
    body, {
      new: true,
      runValidators: true,
    },
  );

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return sendData(res, doc);
});

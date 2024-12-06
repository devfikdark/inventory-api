import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Purpose from '../models/Purpose';
import Expenditure from '../models/Expenditure';
import expenditureValidator from '../utils/validators/Expenditure'

export const createExpenditurePurpose = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { name } = req.body;

  const duplicatePurposeInfo = await Purpose.findOne({
    name,
  });
  if (duplicatePurposeInfo) return next(new AppError('Already created this purpose', 400));

  const purposeInfo = await Purpose.create({
    name,
  });
  if (!purposeInfo) return next(new AppError('Something went wrong to create purpose', 404));

  return sendData(res, purposeInfo);
});

export const getExpenditurePurpose = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const ExpenditureInfo = await Purpose.find();
  if (!ExpenditureInfo) return next(new AppError('Expenditure not found', 404));

  return sendData(res, ExpenditureInfo);
});

export const modifyExpenditurePurpose = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { name } = req.body;

  const purposeInfo = await Purpose.findById(req.params.pid);
  if (!purposeInfo) return next(new AppError('Purpose not found', 404));

  const duplicatePurposeInfo = await Purpose.findOne({
    name,
  });
  if (duplicatePurposeInfo) return next(new AppError('Already created this purpose', 400));

  purposeInfo.name = name;
  await purposeInfo.save();

  return sendData(res, purposeInfo);
});

export const createExpenditure = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  // body verification
  const message = expenditureValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    paymentDate,
    amount,
    method,
    mfsTrxnId,
    paidTo,
    description,
    purpose,
    type,
  } = req.body;

  const ExpenditureInfo = await Expenditure.create({
    paymentDate,
    amount,
    method,
    mfsTrxnId,
    paidTo,
    description,
    purpose,
    type,
    createAt: Date.now(),
  });
  if (!ExpenditureInfo) return next(new AppError('Somthing wrong to create Expenditure', 404));

  return sendData(res, ExpenditureInfo);
});

export const getAllExpenditure = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const ExpenditureInfo = await Expenditure.find();
  if (!ExpenditureInfo) return next(new AppError('Expenditure not found', 404));

  return sendData(res, ExpenditureInfo);
});

export const getExpenditure = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const ExpenditureInfo = await Expenditure.findById(req.params.eid);
  if (!ExpenditureInfo) return next(new AppError('Expenditure not found', 404));

  return sendData(res, ExpenditureInfo);
});

export const modifyExpenditure = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { amount, description } = req.body;
  if (!amount) return next(new AppError('Provide expenditure amount', 402));
  if (!description) return next(new AppError('Provide expenditure description', 402));

  const ExpenditureInfo = await Expenditure.findById(req.params.eid);
  if (!ExpenditureInfo) return next(new AppError('Expenditure not found', 404));

  ExpenditureInfo.amount = amount;
  ExpenditureInfo.description = description;

  await ExpenditureInfo.save();

  return sendData(res, ExpenditureInfo);
});

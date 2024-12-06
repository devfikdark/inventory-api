import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import BankTransaction from '../models/BankTransaction';
import bankTransactionValidator from '../utils/validators/BankTransaction';

export const createBankTransaction = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  // body verification
  const message = bankTransactionValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    date,
    transactionType,
    bank,
    account,
    description,
    amount,
  } = req.body;

  const BankTransactionInfo = await BankTransaction.create({
    date,
    transactionType,
    bank,
    account,
    description,
    amount,
    createAt: Date.now(),
  });
  if (!BankTransactionInfo) return next(new AppError('Somthing wrong to create Expenditure', 404));

  return sendData(res, BankTransactionInfo);
});

export const getAllBankTransaction = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const BankTransactionInfo = await BankTransaction.find();
  if (!BankTransactionInfo) return next(new AppError('Bank transaction not found', 404));

  return sendData(res, BankTransactionInfo);
});

export const getBankTransaction = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const BankTransactionInfo = await BankTransaction.findById(req.params.bid);
  if (!BankTransactionInfo) return next(new AppError('Bank transaction not found', 404));

  return sendData(res, BankTransactionInfo);
});
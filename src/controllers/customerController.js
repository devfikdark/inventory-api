import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Customer from '../models/Customer';

export const getCustomer = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const customerData = await Customer.findOne({ mobileNumber: req.params.mobile }).select('-history');
  if (customerData) {
    return sendData(res, customerData);
  }

  return next(new AppError('Customer not found', 404));
});

export const getAllCustomer = CatchAsync(async (req, res, next) => {
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

  const customerData = await Customer.find().skip(skip).limit(limit);
  if (!customerData) return next(new AppError('somthing wrong', 404));

  return sendData(res, customerData);
});

export const modifyCustomer = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { status, customerName } = req.body;
  if (!customerName) return next(new AppError('Provide customer name', 400));

  const mobileNumber = req.params.mobile;

  const customerData = await Customer.findOne({ mobileNumber });
  if (!customerData) return next(new AppError('Customer not found', 404));

  if (customerData.status !== status) {
    customerData.cardIssueDate = Date.now();
  }

  customerData.customerName = customerName;
  customerData.status = status;

  await customerData.save();

  return sendData(res, customerData);
});

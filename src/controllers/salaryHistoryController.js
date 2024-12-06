import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import SalaryHistory from '../models/SalaryHistory';
import salaryHistoryValidator from '../utils/validators/SalaryHistory';
import Staff from '../models/Staff';
import User from '../models/User';
import Purpose from '../models/Purpose';
import Expenditure from '../models/Expenditure';

export const createSalaryHistory = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  // body verification
  const message = salaryHistoryValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    date,
    basicSalary,
    commission,
    method,
    mfsTrxnId,
    description,
    staff,
  } = req.body;

  // verify staff
  const staffInfo = await Staff.findOne({ user: staff });
  if (!staffInfo) return next(new AppError('Staff not found', 400));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dateInfo = new Date(date);

  // last month sales
  let salesAmount = 0;
  staffInfo.sales.forEach((sale) => {
    salesAmount += sale.totalBill;
  });

  // create salaryHistory
  const salaryHistoryData = await SalaryHistory.create({
    date,
    salaryMonth: monthNames[dateInfo.getMonth()],
    salaryYear: dateInfo.getFullYear(),
    amount: basicSalary + commission,
    salesAmount,
    commission,
    method,
    mfsTrxnId,
    description,
    staff,
    createAt: Date.now(),
  });

  const userInfo = await User.findById(staffInfo.user);
  const purposeData = await Purpose.findOne({ name: 'Staff Salary' });
  // create expenditure
  await Expenditure.create({
    paymentDate: date,
    amount: basicSalary + commission,
    method,
    mfsTrxnId,
    paidTo: userInfo.fullName,
    description,
    purpose: purposeData._id,
    createAt: Date.now(),
  });

  // update staff history
  staffInfo.historys.push(salaryHistoryData._id);
  staffInfo.sales = [];
  await staffInfo.save();

  return sendData(res, salaryHistoryData);
});

export const getSalaryHistory = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const salaryHistoryData = await SalaryHistory.findById(req.params.sid);
  if (salaryHistoryData) {
    salaryHistoryData.products = undefined;
    return sendData(res, salaryHistoryData);
  }

  return next(new AppError('SalaryHistory not found', 404));
});

export const getAllSalaryHistory = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const salaryHistoryData = await SalaryHistory.find();
  if (!salaryHistoryData) return next(new AppError('Salary history not found', 404));

  return sendData(res, salaryHistoryData);
});

export const modifySalaryHistory = CatchAsync(async (req, res, next) => {
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

  const salaryHistoryData = await SalaryHistory.findByIdAndUpdate(
    req.params.bid,
    body, {
      new: true,
      runValidators: true,
    },
  );
  if (salaryHistoryData) {
    salaryHistoryData.products = undefined;
    return sendData(res, salaryHistoryData);
  }

  return next(new AppError('SalaryHistory not found', 404));
});

import CatchAsync from '../middlewares/CatchAsync';
import sendMessage from '../utils/responses/sendMessage';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Staff from '../models/Staff';
import Supplier from '../models/Supplier';
import Role from '../models/Role';
import User from '../models/User';
import getStaffInfoDTO from '../utils/dto/getStaffInfo';
import supplierValidator from '../utils/validators/Supplier';

// Staff
export const getAllStaff = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const staffData = await Staff.find();
  const staffInfo = await getStaffInfoDTO(staffData);
  if (staffData) return sendData(res, staffInfo);

  return next(new AppError('staff not found', 404));
});

export const getStaff = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const staffData = await Staff.findById(req.params.sid);
  const staffInfo = await getStaffInfoDTO([staffData]);
  if (staffData) return sendData(res, staffInfo);

  return next(new AppError('staff not found', 404));
});

export const modifyStaff = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const {
    basicSalary,
    isActive,
    role,
    contact,
    presentAddress,
    permanentAddress,
  } = req.body;

  // check role
  if (!role) return next(new AppError('provide your role', 400));
  const roleInfo = await Role.findById(role);
  if (!roleInfo) return next(new AppError('Role not found, contact with administrator', 400));

  // modify staff info
  const staffInfo = await Staff.findById(req.params.sid);
  if (staffInfo) {
    staffInfo.basicSalary = basicSalary;
    await staffInfo.save();
  }

  // modify user info
  const userInfo = await User.findById(staffInfo.user._id);
  if (userInfo) {
    userInfo.isActive = isActive;
    userInfo.role = role;
    userInfo.contact = contact;
    userInfo.presentAddress = presentAddress;
    userInfo.permanentAddress = permanentAddress;
    await userInfo.save();
  }

  staffInfo.user = userInfo;
  const staffData = await getStaffInfoDTO([staffInfo]);
  return sendData(res, staffData);
});

// Role
export const getAllRole = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const roleData = await Role.find();
  if (!roleData) return next(new AppError('role not found', 404));

  for (let i = 0; i < roleData.length; i += 1) {
    roleData[i].roleResources = undefined;
    roleData[i].createAt = undefined;
    roleData[i].role = undefined;
  }

  return sendData(res, roleData);
});

// Supplier
export const getAllSupplier = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const supplierData = await Supplier.find();

  if (!supplierData) return next(new AppError('supplier not found', 404));

  for (let i = 0; i < supplierData.length; i += 1) {
    supplierData[i].orders = undefined;
  }

  return sendData(res, supplierData);
});

export const getSupplier = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const supplierData = await Supplier.findById(req.params.supid);

  if (!supplierData) return next(new AppError('supplier not found', 404));

  supplierData.orders = undefined;
  return sendData(res, supplierData);
});

export const createSupplier = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const message = supplierValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    name,
    contact,
    address,
    email,
  } = req.body;

  const supplierData = await Supplier.create({
    name,
    contact,
    address,
    email,
    createAt: Date.now(),
  });

  if (supplierData) {
    supplierData.orders = undefined;
    return sendData(res, supplierData);
  }

  return next(new AppError('somthing wrong', 404));
});

export const modifySupplier = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const supplierData = await Supplier.findByIdAndUpdate(
    req.params.supid,
    req.body, {
      new: true,
      runValidators: true,
    },
  );

  if (supplierData) {
    supplierData.orders = undefined;
    return sendData(res, supplierData);
  }

  return next(new AppError('Supplier not found', 404));
});

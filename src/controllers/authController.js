import CatchAsync from '../middlewares/CatchAsync';
import sendMessage from '../utils/responses/sendMessage';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import User from '../models/User';
import Staff from '../models/Staff';
import Administrator from '../models/Administrator';
import AuthenticationToken from '../models/AuthenticationToken';
import RoleResources from '../models/RoleResources';
import createJWT from '../middlewares/jwtToken';
import StaffValidator from '../utils/validators/Staff';
import getStaffAccess from '../utils/dto/getStaffAccess';
import Role from '../models/Role';

export const adminSignUp = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    userName,
    fullName,
    password,
  } = req.body;

  if (!userName) return next(new AppError('provide your username', 400));
  if (!password) return next(new AppError('provide your password', 400));

  // check duplicate
  const checkDuplicate = await User.findOne({ userName });
  if (checkDuplicate) return next(new AppError('Already use this username', 400));

  // create user
  const userInfo = await User.create({
    userName,
    fullName,
    role: '6052465d555bcd3659f73fb9',
    createAt: Date.now(),
  });
  userInfo.password = await userInfo.hashPassword(password);
  await userInfo.save();

  // create admin
  await Administrator.create({
    user: userInfo._id,
    createAt: Date.now(),
  });

  return sendMessage(res, 'User create successfully');
});

export const adminSignIn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    userName,
    password,
  } = req.body;

  if (!userName) return next(new AppError('provide your username', 400));
  if (!password) return next(new AppError('provide your password', 400));

  // check auth
  const userInfo = await User.findOne({
    userName,
  }).select('+password');

  if (!userInfo || !(await userInfo.verifyPassword(password, userInfo.password))) {
    return next(new AppError('Incorrect username or password.', 400));
  }

  const jwtData = createJWT(userInfo._id);

  // create authToken list
  const AuthenticationTokenData = await AuthenticationToken.create({
    token: jwtData,
    createAt: Date.now(),
    user: userInfo._id,
  });

  // push tokens
  userInfo.tokens.push(AuthenticationTokenData._id);

  const {
    _id,
    fullName,
    contact,
    address,
    role,
  } = userInfo;

  // get role info
  const roleInfo = await Role.findById(role);

  const data = {
    _id,
    userName: userInfo.userName,
    fullName,
    contact,
    address,
    role,
    roleName: roleInfo.name,
    token: jwtData,
  };

  await userInfo.save();

  return sendData(res, data);
});

export const staffSignUp = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const message = StaffValidator(req.body);
  if (message !== 'ok') return next(new AppError(message, 400));

  const {
    userName,
    fullName,
    contact,
    presentAddress,
    permanentAddress,
    image,
    DoB,
    password,
    role,
    basicSalary,
    nationalId,
  } = req.body;

  // check role
  if (!role) return next(new AppError('provide your role', 400));
  const roleInfo = await Role.findById(role);
  if (!roleInfo) return next(new AppError('Role not found, contact with administrator', 400));
  
  // check duplicate userName
  const checkDuplicate = await User.findOne({
    $or:[
      { userName }, 
      { contact } 
    ]
  });
  if (checkDuplicate) return next(new AppError('Already use this username or contact', 400));

  // create user
  const userInfo = await User.create({
    userName,
    fullName,
    contact,
    presentAddress,
    permanentAddress,
    image,
    DoB,
    role,
    createAt: Date.now(),
  });
  userInfo.password = await userInfo.hashPassword(password);
  await userInfo.save();

  // create staff
  await Staff.create({
    basicSalary,
    nationalId,
    user: userInfo._id,
    createAt: Date.now(),
  });

  return sendMessage(res, 'User create successfully');
});

export const staffSignIn = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    userName,
    password,
  } = req.body;

  if (!userName) return next(new AppError('provide your username', 400));
  if (!password) return next(new AppError('provide your password', 400));

  // check auth
  const userInfo = await User.findOne({
    userName,
  }).select('+password');

  if (!userInfo || !userInfo.isActive) {
    return next(new AppError('You are not authorized, Please contact with admin.', 400));
  }

  if (!(await userInfo.verifyPassword(password, userInfo.password))) {
    return next(new AppError('Incorrect username or password.', 400));
  }

  const jwtData = createJWT(userInfo._id);

  // create authToken list
  const AuthenticationTokenData = await AuthenticationToken.create({
    token: jwtData,
    createAt: Date.now(),
    user: userInfo._id,
  });

  // push tokens
  userInfo.tokens.push(AuthenticationTokenData._id);
  await userInfo.save();

  // send response
  const {
    _id,
    fullName,
    image,
    role,
  } = userInfo;

   // get role info
   const roleInfo = await Role.findById(role);

  // get access matrix
  const accessInfo = await getStaffAccess(role);

  const data = {
    _id,
    userName,
    fullName,
    image,
    role,
    roleName: roleInfo.name,
    accessInfo,
    token: jwtData,
  };

  return sendData(res, data);
});

export const logOut = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const AuthenticationTokenInfo = await AuthenticationToken.findOne({ token: req.Token });
  if (!AuthenticationTokenInfo) return next(new AppError('Invalid token', 402));

  AuthenticationTokenInfo.isValid = false;
  await AuthenticationTokenInfo.save();
  sendMessage(res, 'Logout successfully');
});

export const staffVerifyUserName = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    userName,
  } = req.body;

  // check username
  const userInfo = await User.findOne({ userName });
  if (!userInfo) return next(new AppError('User not found!!!', 400));

  return sendMessage(res, 'User found');
});

export const staffPasswordReplace = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const {
    userName,
    password,
  } = req.body;

  // check username
  const userInfo = await User.findOne({ userName });
  if (!userInfo) return next(new AppError('User not found!!!', 400));

  userInfo.password = await userInfo.hashPassword(password);
  await userInfo.save();

  return sendMessage(res, 'Password replace successfully');
});

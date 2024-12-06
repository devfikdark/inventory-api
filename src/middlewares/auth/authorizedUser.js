import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import CatchAsync from '../CatchAsync';
import AppError from '../../utils/errors/AppError';
import AuthenticationToken from '../../models/AuthenticationToken';
import User from '../../models/User';

const authorizedUser = CatchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  // Verification token
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return next(new AppError('Your session has expired. Please login again.', 400));
    }
  });

  // check JWT status
  const checkTokenValidify = await AuthenticationToken.findOne({ token });
  if (checkTokenValidify && !checkTokenValidify.isValid) {
    return next(new AppError('Your session has expired. Please login again.', 400));
  }

  // Decode token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppError('Your session has expired. Please login again.', 400));
  }

  // Grant access to protect route
  req.currentUser = currentUser;
  req.Token = token;
  return next();
});

export default authorizedUser;

import '../../config/ImportEnv';
import CatchAsync from '../CatchAsync';
import AppError from '../../utils/errors/AppError';
import getStaffAccess from '../../utils/dto/getStaffAccess';

const restrictAccess = CatchAsync(async (req, res, next) => {
  const {
    role,
  } = req.currentUser;

  if (role === process.env.ADMIN) return next();

  // get access matrix
  const accessData = await getStaffAccess(role);
  const reqURL = req.originalUrl;
  const reqMethod = req.method;

  // colect data from request module
  let access = accessData.filter((el) => reqURL.includes(`/${el.module}/`));
  if (access)[access] = access;

  if (!access) return next(new AppError('Access restricted', 403));

  if (
    (reqMethod === 'GET' && access.canRead)
    || (reqMethod === 'POST' && access.canCreate)
    || (reqMethod === 'PATCH' && access.canEdit)
    || (reqMethod === 'DELETE' && access.canDelete)
  ) {
    return next();
  }

  return next(new AppError('Access restricted', 403));
});

export default restrictAccess;

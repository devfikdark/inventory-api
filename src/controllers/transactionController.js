import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import sendMessage from '../utils/responses/sendMessage';
import AppError from '../utils/errors/AppError';
import Transaction from '../models/Transaction';
import Order from '../models/Order';
import OrderProduct from '../models/OrderProduct';
import Return from '../models/Return';

export const createTransaction = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const {
    amount,
    currency,
    method,
    mfsTrxnId,
    isRefund,
    order,
    date,
    returnId,
  } = req.body;
  if (!amount) return next(new AppError('Provide transaction amount', 400));
  if (!order) return next(new AppError('Provide orderId', 400));

  // check order
  const orderInfo = await Order.findById(order);
  if (!orderInfo) return next(new AppError('Order not found', 404));

  let returnInfo, dueAmount;
  // Return check
  if (isRefund) {
    returnInfo = await Return.findById(returnId);
    const TotalReturnAmount = returnInfo.amount;

    let payReturnAmounts = 0;
    const { transaction } = returnInfo;
    for (let i = 0; i < transaction.length; i++) {
      const previousTransaction = await Transaction.findById(transaction[i]._id);
      payReturnAmounts += previousTransaction.amount;
    }

    dueAmount = TotalReturnAmount - payReturnAmounts;

    if (dueAmount === 0 || !returnInfo.status) {
      return next(new AppError('Total bill paid already.', 400));
    }
    if (amount > returnInfo.amount) {
      return next(new AppError(`Your due amount is ${returnInfo.amount}`, 400));
    }
  }

  // create transaction
  const transactionData = await Transaction.create({
    amount,
    currency,
    method,
    mfsTrxnId,
    isRefund,
    order,
    return: returnId,
    date,
    createdBy: userId,
    createAt: Date.now(),
  });

  if (!transactionData) return next(new AppError('Somthing wrong to create transaction', 400));

  if (isRefund) {
    returnInfo.transaction.push(transactionData._id);
    orderInfo.totalRefund += amount;
    returnInfo.amount -= amount;
    if (returnInfo.amount === 0) {
      returnInfo.status = false;
      const orderProductInfo = await OrderProduct.findById(returnInfo.orderProduct);
      orderProductInfo.quantity -= returnInfo.quantity;
      await orderProductInfo.save();
    }
  }

  if (orderInfo.totalDue === 0) {
    orderInfo.expectedRefund += parseFloat(amount);
  } else if (orderInfo.totalDue > 0) {
    if (amount > orderInfo.totalDue) {
      orderInfo.expectedRefund += parseFloat(amount - orderInfo.totalDue);
      orderInfo.totalDue = 0;
    } else {
      orderInfo.totalDue = (orderInfo.totalDue - amount);
    }
  }

  // create relation between order & transaction
  orderInfo.transactions.push(transactionData._id);
  
  await orderInfo.save();
  
  if (isRefund) {
    await returnInfo.save();
  }

  return sendData(res, transactionData);
});

export const getTransaction = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const transactionData = await Transaction.findById(req.params.tid);
  if (transactionData) {
    transactionData.productTransaction = undefined;
    return sendData(res, transactionData);
  }

  return next(new AppError('Transaction not found', 404));
});

export const getAllTransaction = CatchAsync(async (req, res, next) => {
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

  const transactionData = await Transaction.find().skip(skip).limit(limit);
  if (!transactionData) return next(new AppError('somthing wrong', 404));

  for (let i = 0; i < transactionData.length; i += 1) {
    transactionData[i].productTransaction = undefined;
    transactionData[i].createAt = undefined;
  }
  return sendData(res, transactionData);
});

export const modifyTransaction = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const {
    name
  } = req.body;
  const body = {
    name,
    modifyBy: userId,
    modifyAt: Date.now(),
  };

  const transactionData = await Transaction.findByIdAndUpdate(
    req.params.tid,
    body, {
      new: true,
      runValidators: true,
    },
  );
  if (transactionData) {
    transactionData.productTransaction = undefined;
    return sendData(res, transactionData);
  }

  return next(new AppError('Transaction not found', 404));
});

import moment from 'moment';
import CatchAsync from '../middlewares/CatchAsync';
import sendData from '../utils/responses/sendData';
import AppError from '../utils/errors/AppError';
import Sale from '../models/Sale';
import BankTransaction from '../models/BankTransaction';
import Expenditure from '../models/Expenditure';
import SalaryHistory from '../models/SalaryHistory';
import OrderProduct from '../models/OrderProduct';
import CustomerHistory from '../models/CustomerHistory';
import ReportStockInfo from '../utils/dto/Report/ReportStockInfo';
import ReportStaffInfo from '../utils/dto/Report/ReportStaffInfo';
import ReportCustomerInfo from '../utils/dto/Report/ReportCustomerInfo';
import ReportSaleInfo from '../utils/dto/Report/ReportSaleInfo';
import ReportReturnInfo from '../utils/dto/Report/ReportReturnInfo';
import ReportTransactionInfo from '../utils/dto/Report/ReportTransactionInfo';
import ReportExpenditureInfo from '../utils/dto/Report/ReportExpenditureInfo';
import ReportBankTransactionRouterInfo from '../utils/dto/Report/ReportBankTransactionRouterInfo';
import ReportCustomerReturn from '../utils/dto/Report/ReportCustomerReturn';
import Return from '../models/Return';
import Transaction from '../models/Transaction';
import ReturnHistory from '../models/ReturnHistory';

export const getBankTransactionRouterInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end, type } = req.query;

  let docs;
  if (type) {
    docs = await BankTransaction.find({ transactionType: type });
  } else if (type && start && end) {
    docs = await BankTransaction.find({ transactionType: type, createAt: {
      $gte: start,
      $lte: end
    } });
  } else if (start && end) {
    docs = await BankTransaction.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await BankTransaction.find();
  }

  return sendData(res, ReportBankTransactionRouterInfo(docs));
});

export const getExpenditureInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end, purpose } = req.query;

  let docs;
  if (purpose) {
    docs = await Expenditure.find({ purpose });
  } else if (purpose && start && end) {
    docs = await Expenditure.find({ purpose, createAt: {
      $gte: start,
      $lte: end
    } });
  } else if (start && end) {
    docs = await Expenditure.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await Expenditure.find();
  }

  return sendData(res, ReportExpenditureInfo(docs));
});

export const getStaffInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end, sid } = req.query;

  let docs;
  if (sid) {
    docs = await SalaryHistory.find({ staff: sid });
  } else if (sid && start && end) {
    docs = await SalaryHistory.find({ staff: sid, createAt: {
      $gte: start,
      $lte: end
    } });
  } else if (start && end) {
    docs = await SalaryHistory.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await SalaryHistory.find();
  }

  return sendData(res, ReportStaffInfo(docs));
});

export const getStockInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { date } = req.query;

  let docs;
  if (date) {
    docs = await OrderProduct.find({
      quantity: {
        $gt: 0 
      },
      expiryDate: {
        $lt: date
      }
    }).select('opId quantity purchasePrice expiryDate')
    .populate('order', '-orderProduct -transactions');
  } else {
    docs = await OrderProduct.find({
      quantity: {
        $gt: 0 
      }
    }).select('opId quantity purchasePrice expiryDate')
    .populate('order', '-orderProduct -transactions');
  }

  return sendData(res, ReportStockInfo(docs));
});

export const getCustomerInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end } = req.query;

  let docs;
  if (start && end) {
    docs = await CustomerHistory.find({ date: {
      $gte: start,
      $lte: end
    } }).populate('customer', '-history');
  }
  else {
    docs = await CustomerHistory.find().populate('customer', '-history');
  }

  return sendData(res, ReportCustomerInfo(docs));
});

export const getSaleInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end, sid } = req.query;

  let docs;
  if (sid) {
    docs = await Sale.find({ seller: sid });
  } else if (sid && start && end) {
    docs = await Sale.find({ seller: sid, createAt: {
      $gte: start,
      $lte: end
    } });
  } else if (start && end) {
    docs = await Sale.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await Sale.find();
  }

  return sendData(res, ReportSaleInfo(docs));
});

export const getReturnInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end } = req.query;

  let docs;
  if (start && end) {
    docs = await Return.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await Return.find();
  }

  return sendData(res, ReportReturnInfo(docs));
});

export const getTransactionInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end } = req.query;

  let docs;
  if (start && end) {
    docs = await Transaction.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await Transaction.find();
  }

  return sendData(res, ReportTransactionInfo(docs));
});

export const getCustomerReturnInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }

  const { start, end } = req.query;

  let docs;
  if (start && end) {
    docs = await ReturnHistory.find({ createAt: {
      $gte: start,
      $lte: end
    } });
  }
  else {
    docs = await ReturnHistory.find();
  }

  return sendData(res, ReportCustomerReturn(docs));
});

export const getDailySaleInfo = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const userId = req.params.uid;
  const currentUserId = req.currentUser._id;

  // Authorization
  if (userId != currentUserId) {
    return next(new AppError('Unauthorize user', 402));
  }
 
  // const docs = await Sale.aggregate([
  //   {
  //     $group: {
  //       _id: { $dateToString: { format: "%Y-%m-%d", date: "$createAt" } },
  //       totalBill: {
  //         $sum: "$totalBill"
  //       },
  //       totalProfit: {
  //         $sum: "$totalProfit"
  //       }
  //     }
  //   }
  // ]);

  const { start, end } = req.query;
  if (!start) return next(new AppError('Provide start date', 404));
  if (!end) return next(new AppError('Provide end date', 404));

  // Sale
  const saleData = await Sale.find({ type: true, shippingStatus: { $ne: 'Cancel' }, createAt: {
    $gte: start,
    $lte: end
  } });
  
  // Expendature
  const expenditureInfo = await Expenditure.find({ type: { $ne: 'Fixed' }, createAt: {
    $gte: start,
    $lte: end
  } });

  const expenditureData = [];
  for (let i = 0; i < expenditureInfo.length; i++) {
    const el = expenditureInfo[i];
    const date = moment(el.createAt).format('LL');
    const pos = expenditureData.findIndex(el => el.Date === date);
    if (pos === -1) {
      expenditureData.push({
        'Date': date,
        'Amount': el.amount
      })
    } else {
      expenditureData[pos].Amount += el.amount
    }
  }
  
  // Report
  let reportData = [];
  for (let i = 0; i < saleData.length; i++) {
    const el = saleData[i];
    const date = moment(el.date).format('LL');
    const pos = reportData.findIndex(el => el.Date === date);
    let TotalPurchasePrice = 0;
    for (let op = 0; op < el.opList.length; op++) {
      if (el.items[op].purchasePrice) {
        TotalPurchasePrice += parseFloat(el.items[op].purchasePrice * el.items[op].quantity);
      } else {
        const opInfo = await OrderProduct.findById(el.opList[op]);
        TotalPurchasePrice += parseFloat(opInfo.purchasePrice * el.items[op].quantity);
      }
    }

    const TotalRetailSell = el.customer.customerType === 'Regular' || el.customer.customerType === 'Online' ? el.totalBill : 0;
    const TotalWholeSell = el.customer.customerType === 'Wholesale' ? el.totalBill : 0;
    const profitFromSell = (TotalRetailSell + TotalWholeSell) - (el.discountAmount + el.taxAmount + TotalPurchasePrice);
    const expPos = expenditureData.findIndex(el => el.Date === date);
    const TotalExpenditures = expPos === -1 ? 0 : parseFloat(expenditureData[expPos].Amount);
    const Remarks = profitFromSell - TotalExpenditures;

    if (pos === -1) {
      reportData.push({
        'Date': moment(el.date).format('LL'),
        'Total Retail Sell (Regular + Online)': el.customer.customerType === 'Regular' || el.customer.customerType === 'Online' ? el.totalBill : 0,
        'Total Whole Sell': el.customer.customerType === 'Wholesale' ? el.totalBill : 0,
        'Discount Given': el.discountAmount,
        'Total Tax': el.taxAmount,
        'Sold Product Purchase Rate': TotalPurchasePrice,
        'Profit From Product Sell': profitFromSell,
        'Total Administrative and Other Expenditure': TotalExpenditures,
        'Net Profit After Expenditure': parseFloat(profitFromSell - TotalExpenditures),
        'Remarks': Remarks === 0 ? 'Nothing' :  Remarks > 0 ? 'Profit' : 'Loss'
      })
    } else {
      reportData[pos]['Total Retail Sell (Regular + Online)'] += el.customer.customerType === 'Regular' || el.customer.customerType === 'Online' ? el.totalBill : 0;
      reportData[pos]['Total Whole Sell'] += el.customer.customerType === 'Wholesale' ? el.totalBill : 0;
      reportData[pos]['Discount Given'] += el.discountAmount;
      reportData[pos]['Total Tax'] += el.taxAmount;
      reportData[pos]['Sold Product Purchase Rate'] += TotalPurchasePrice;
      reportData[pos]['Profit From Product Sell'] += profitFromSell;
    }
  }

  // toFixed & check Remarks
  for (let rep = 0; rep < reportData.length; rep++) {
    const el = reportData[rep];
    el['Total Retail Sell (Regular + Online)'] = el['Total Retail Sell (Regular + Online)'].toFixed(2);
    el['Total Whole Sell'] = el['Total Whole Sell'].toFixed(2);
    el['Discount Given'] = el['Discount Given'].toFixed(2);
    el['Total Tax'] = el['Total Tax'].toFixed(2);
    el['Sold Product Purchase Rate'] = el['Sold Product Purchase Rate'].toFixed(2);
    el['Profit From Product Sell'] = el['Profit From Product Sell'].toFixed(2);
    el['Total Administrative and Other Expenditure'] = el['Total Administrative and Other Expenditure'].toFixed(2);
    el['Net Profit After Expenditure'] = (el['Profit From Product Sell'] - el['Total Administrative and Other Expenditure']).toFixed(2);
    el['Remarks'] = el['Net Profit After Expenditure'] === 0 ? 'Nothing' :  el['Net Profit After Expenditure'] > 0 ? 'Profit' : 'Loss';
  }

  // push other date expenditure
  for (let ex = 0; ex < expenditureData.length; ex++) {
    const el = expenditureData[ex];
    if (reportData.findIndex(exp => exp.Date === el.Date) === -1) {
      reportData.push({
        'Date': el.Date,
        'Total Retail Sell (Regular + Online)': '0',
        'Total Whole Sell': '0',
        'Discount Given': '0',
        'Total Tax': '0',
        'Sold Product Purchase Rate': '0',
        'Profit From Product Sell': '0',
        'Total Administrative and Other Expenditure': `${el.Amount}`,
        'Net Profit After Expenditure': `${-el.Amount}`,
        'Remarks': 'Loss'
      })
    }
  }

  reportData = reportData.sort((a, b) => new Date(a.Date) - new Date(b.Date))
  return sendData(res, reportData);
});

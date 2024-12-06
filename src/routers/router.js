import express from 'express';
import adminRouter from './adminRouter';
import authRouter from './authRouter';
import bankTransactionRouter from './bankTransactionRouter';
import brandRouter from './brandRouter';
import customerRouter from './customerRouter';
import dashboardRouter from './dashboardRouter';
import expenditureRouter from './expenditureRouter';
import orderRouter from './orderRouter';
import productRouter from './productRouter';
import reportRouter from './reportRouter';
import returnRouter from './returnRouter';
import returnRegularRouter from './returnRegularRouter';
import salaryHistoryRouter from './salaryHistoryRouter';
import saleRouter from './saleRouter';
import sizeRouter from './sizeRouter';
import tagRouter from './tagRouter';
import transactionRouter from './transactionRouter';
import ImportData from '../utils/data/Import';
import RemoveDate from '../utils/data/Remove';

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/bankTransaction', bankTransactionRouter);
router.use('/brand', brandRouter);
router.use('/customer', customerRouter);
router.use('/dashboard', dashboardRouter);
router.use('/expenditure', expenditureRouter);
router.use('/order', orderRouter);
router.use('/product', productRouter);
router.use('/report', reportRouter);
router.use('/return', returnRouter);
router.use('/returnRegular', returnRegularRouter);
router.use('/salary-history', salaryHistoryRouter);
router.use('/sale', saleRouter);
router.use('/size', sizeRouter);
router.use('/tag', tagRouter);
router.use('/transaction', transactionRouter);

// Special End Points
// router.get('/Import', ImportData);
// router.get('/Remove', RemoveDate);

export default router;

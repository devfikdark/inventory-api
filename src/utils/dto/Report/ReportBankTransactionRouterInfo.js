import moment from 'moment';

const ReportBankTransactionRouterInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      Date: moment(el.createAt).format('LL'),
      "Transaction Type": el.transactionType,
      Bank: el.bank,
      Account: el.account,
      Description: el.description,
      Amount: el.amount,
      "Create Date": moment(el.createAt).format('LL'),
    });
  }
  return data;
};

export default ReportBankTransactionRouterInfo;

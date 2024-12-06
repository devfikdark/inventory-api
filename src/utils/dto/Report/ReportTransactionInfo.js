import moment from 'moment';

const ReportTransactionInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      Date: moment(el.createAt).format('LL'),
      Amount: el.amount,
      Currency: el.currency,
      Method: el.method,
      "MFS Trxn Id": el.mfsTrxnId,
      "Order Name": el.order.name,
      "Supplier Name": el.order.supplier.name,
      "Supplier Contact": el.order.supplier.contact,
      "Order Create By": el.order.createdBy.fullName,
      "Return Create By": el.createdBy.fullName,
    });
  }
  return data;
};

export default ReportTransactionInfo;

import moment from 'moment';

const ReportExpenditureInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      "Payment Date": moment(el.paymentDate).format('LL'),
      "Purpose": el.purpose.name,
      "Type": el.type,
      "Amount": el.amount,
      "Method": el.method,
      "Mfs Trxn Id": el.mfsTrxnId,
      "Paid To": el.paidTo,
      "Description": el.description,
      "Create Date": moment(el.createAt).format('LL'),
    });
  }
  return data;
};

export default ReportExpenditureInfo;

import moment from 'moment';

const ReportReturnInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      "Report Name": el.name,
      "Product Name": el.orderProduct.productName,
      Quantity: el.quantity,
      Reason: el.reason,
      "Return Amount": el.returnAmount,
      Status: el.status,
      opId: el.orderProduct.opId,
      "Return Create": el.createdBy.fullName,
      Date: moment(el.createAt).format('LL'),
    });
  }
  return data;
};

export default ReportReturnInfo;

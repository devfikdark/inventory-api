import moment from 'moment';

const ReportCustomerReturn = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      "Invoice Number": el.InvoiceNum,
      "Customer Name": el.customerName,
      "Mobile Number": el.mobileNumber,
      "Customer Type": el.customerType,
      "Product Name": el.productName,
      "Unit Price": el.unitPrice,
      Quantity: el.quantity,
      "Total Return Price": el.totalReturnPrice,
      "Received By": el.createdBy.fullName,
      Date: moment(el.createAt).format('LL'),
    });
  }
  return data;
};

export default ReportCustomerReturn;

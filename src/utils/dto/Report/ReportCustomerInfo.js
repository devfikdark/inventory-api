import moment from 'moment';

const ReportCustomerInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const { date, amount, customer } = report[i];
    data.push({
      "Date": date ? moment(date).format('LL') : '',
      "Amount": amount ? amount : '',
      "Total Amount": customer && customer.buyingAmount ? customer.totalAmount : '',
      "Card Status": customer && customer.status ? customer.status : '',
      "Name": customer && customer.customerName ? customer.customerName : '',
      "Mobile Number": customer && customer.mobileNumber ? customer.mobileNumber : '',
      "Card Number": customer && customer.cardNum ? customer.cardNum : '',
      "Card Issue Date": customer && customer.cardIssueDate ? moment(customer.cardIssueDate).format('LL') : '',
    });
  }
  return data;
};

export default ReportCustomerInfo;

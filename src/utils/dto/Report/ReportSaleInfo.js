import moment from 'moment';

const ReportSaleInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      "Date": moment(el.date).format('LL'),
      "Primary Bill": el.primaryBill,
      "Discount Amount": el.discountAmount,
      "Tax Percent": el.taxPercent,
      "Tax Amount": el.taxAmount,
      "Initial Payment": el.initialPayment,
      "Total Bill": el.totalBill,
      "isComplete": el.isComplete,
      "Requires Delivery": el.requiresDelivery,
      "Shipping Status": el.shippingStatus,
      "Delivery Charge": el.deliveryCharge,
      "Delivery Address": el.deliveryAddress,
      "Customer Name": el.customer.customerName,
      "Mobile Number": el.customer.mobileNumber,
      "Customer Type": el.customer.customerType,
      "Invoice Number": el.InvoiceNum,
      "Payment Method": el.paymentMethod,
      "Seller Name": el.seller.fullName,
      "Sale Type": el.type ? 'Regular' : 'Archive',
      "Total Profit": el.shippingStatus === 'Cancel' || !el.type ? 0 : el.totalProfit,
    });
  }
  return data;
};

export default ReportSaleInfo;

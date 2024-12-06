const saleValidator = (body) => {
  const {
    primaryBill,
    totalBill,
    customerName,
    mobileNumber,
    initialPayment,
  } = body;

  if (!primaryBill) return 'Provide sale primary bill.';
  if (!totalBill) return 'Provide sale total bill.';
  if (!initialPayment) return 'Provide sale total bill.';
  if (!customerName) return 'Provide customer name.';
  if (!mobileNumber) return 'Provide customer mobile number.';
  return 'ok';
};

export default saleValidator;

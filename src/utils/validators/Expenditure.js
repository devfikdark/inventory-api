const expenditureValidator = (body) => {
  const {
    paymentDate,
    amount,
    purpose,
  } = body;

  if (!paymentDate) return 'Provide payment date.';
  if (!amount) return 'Provide expenditure amount.';
  if (!purpose) return 'Provide expenditure purpose.';
  return 'ok';
};

export default expenditureValidator;

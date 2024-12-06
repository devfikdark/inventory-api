const bankTransactionValidator = (body) => {
  const {
    date,
    transactionType,
    bank,
    amount
  } = body;

  if (!date) return 'Provide bank transaction date.';
  if (!transactionType) return 'Provide bank transaction type.';
  if (!bank) return 'Provide bank name.';
  if (!amount) return 'Provide bank transaction amount.';
  return 'ok';
};

export default bankTransactionValidator;

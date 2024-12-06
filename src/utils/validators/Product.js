const productValidator = (body) => {
  const {
    name,
    sellPrice,
  } = body;

  if (!name) return 'Provide product name.';
  if (!sellPrice) return 'Provide sell price.';
  return 'ok';
};

export default productValidator;

const orderProductValidator = (body) => {
  const {
    pId,
    quantity,
    purchasePrice,
  } = body;

  if (!pId) return 'Provide product id.';
  if (!quantity) return 'Provide product quantity.';
  if (!purchasePrice) return 'Provide product purchase price.';
  return 'ok';
};

export default orderProductValidator;

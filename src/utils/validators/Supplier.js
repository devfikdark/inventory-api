const supplierValidator = (body) => {
  const {
    name,
    contact,
    address,
    email,
  } = body;

  if (!name) return 'Provide supplier name.';
  if (!address) return 'Provide supplier address.';
  if (!contact) return 'Provide supplier contact.';
  if (!(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(contact))) return 'Provide a valid Bangladeshi mobile number.';
  if (!email) return 'Provide supplier email.';
  return 'ok';
};

export default supplierValidator;

const staffValidator = (body) => {
  const {
    userName,
    fullName,
    contact,
    presentAddress,
    permanentAddress,
    DoB,
    password,
    basicSalary,
    nationalId,
  } = body;

  if (!userName) return 'Provide user name.';
  if (!fullName) return 'Provide full name.';
  if (!contact) return 'Provide contact.';
  if (!(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(contact))) return 'Provide a valid Bangladeshi mobile number.';
  if (!presentAddress) return 'Provide present address.';
  if (!permanentAddress) return 'Provide permanent address.';
  if (!DoB) return 'Provide permanent address.';
  if (!password) return 'Provide password.';
  if (!basicSalary) return 'Provide basic salary.';
  if (!nationalId) return 'Provide nationalId.';
  return 'ok';
};

export default staffValidator;

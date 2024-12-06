const salaryHistoryValidator = (body) => {
  const {
    date,
    basicSalary,
    staff,
  } = body;

  if (!date) return 'Provide salary date.';
  if (!basicSalary) return 'Provide basic salary.';
  if (!staff) return 'Provide staff Id.';
  return 'ok';
};

export default salaryHistoryValidator;

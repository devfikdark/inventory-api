import Role from '../../models/Role';

const getStaffInfo = async (staffData) => {
  const roleInfo = await Role.find();
  const data = [];
  for (let i = 0; i < staffData.length; i += 1) {
    const el = staffData[i];
    const roleData = roleInfo.find((rl) => rl._id == el.user.role);

    let salesAmount = 0;
    el.sales.forEach((sale) => {
      salesAmount += sale.totalBill;
    });

    data.push({
      _id: el._id,
      basicSalary: el.basicSalary,
      nationalId: el.nationalId,
      salesAmount,
      historys: el.historys,
      user: {
        uid: el.user._id,
        isActive: el.user.isActive,
        roleId: roleData._id,
        role: roleData.name,
        userName: el.user.userName,
        fullName: el.user.fullName,
        contact: el.user.contact,
        image: el.user.image,
        presentAddress: el.user.presentAddress,
        permanentAddress: el.user.permanentAddress,
        DoB: el.user.DoB,
      },
    });
  }
  return data;
};

export default getStaffInfo;

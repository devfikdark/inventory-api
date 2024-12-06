import RoleResources from '../../models/RoleResources';
import Resource from '../../models/Resource';

const getStaffAccess = async (role) => {
  const accessData = await RoleResources.find({ role });

  let resourceCnt = 0;
  const resourceData = [];
  while (resourceCnt < accessData.length) {
    const data = await Resource.findById(accessData[resourceCnt].resource);
    resourceData.push(data.name);
    resourceCnt += 1;
  }

  const data = [];

  accessData.map((el, idx) => data.push({
    module: resourceData[idx],
    canCreate: el.canCreate,
    canRead: el.canRead,
    canEdit: el.canEdit,
    canDelete: el.canDelete,
  }));
  return data;
};

export default getStaffAccess;

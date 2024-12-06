import fs from 'fs';
import Role from '../../models/Role';
import Resource from '../../models/Resource';
import RoleResources from '../../models/RoleResources';
import CatchAsync from '../../middlewares/CatchAsync';

const ImportData = CatchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  // Read JSON file
  const RoleData = JSON.parse(
    fs.readFileSync(`${__dirname}/Role.json`, 'utf-8')
  );

  const ResourceData = JSON.parse(
    fs.readFileSync(`${__dirname}/Resource.json`, 'utf-8')
  );

  const RoleResourcesData = JSON.parse(
    fs.readFileSync(`${__dirname}/RoleResources.json`, 'utf-8')
  );

  try {
    await Role.create(RoleData);
    await Resource.create(ResourceData);
    await RoleResources.create(RoleResourcesData);

    res.json({
      message: 'Ok',
    });
  } catch (err) {
    res.json({
      message: 'Fail',
    });
  }
});

export default ImportData;

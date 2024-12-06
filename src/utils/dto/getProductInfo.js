import OrderProduct from '../../models/OrderProduct';

const getProductInfo = async (productData) => {
  const data = [];
  for (let i = 0; i < productData.length; i += 1) {
    const el = productData[i];
    const {
      _id,
      name,
      sellPrice,
      createdBy,
      brand,
      image,
      size,
      tags,
      orderProduct,
    } = el;

    // get quantity from orderproducts
    let quantity = 0;
    for (let pos = 0; pos < orderProduct.length; pos += 1) {
      const orderProductInfo = await OrderProduct.findById(orderProduct[pos]);
      quantity += orderProductInfo.quantity;
    }

    data.push({
      _id,
      name,
      sellPrice,
      quantity,
      createdBy,
      brand,
      image,
      size,
      tags,
    });
  }
  return data;
};

export default getProductInfo;

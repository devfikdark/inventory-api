import moment from 'moment';

const ReportStockInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];    
    const Tags = el.product.tags ? el.product.tags.map(el => el.name).join() : '';
    const Sizes = el.product.size ? el.product.size.map(el => el.name).join() : '';
    const Brand = el.product.brand ? el.product.brand.name : '';

    data.push({
      opId: el.opId,
      Quantity: el.quantity,
      "Purchase Price": el.purchasePrice,
      "Sell Price": el.product.sellPrice,
      "Expiry Date": moment(el.expiryDate).format('LL'),
      "Product Name": el.product.name,
      "Tags": Tags,
      "Sizes": Sizes,
      "Brand": Brand,
      "Product Create": el.product.createdBy.fullName,
      "Order Name": el.order.name,
      "Order Date": moment(el.order.date).format('LL'),
      "Order Create": el.order.createdBy.fullName,
      "Supplier Name": el.order.supplier.name,
      "Supplier Contact": el.order.supplier.contact,
    });
  }
  return data;
};

export default ReportStockInfo;

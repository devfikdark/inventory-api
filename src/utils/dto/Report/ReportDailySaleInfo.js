const ReportDailySaleInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      Date: el._id,
      "Total Bill": el.totalBill,
      "Total Profit": el.totalProfit,
    });
  }
  return data;
};

export default ReportDailySaleInfo;

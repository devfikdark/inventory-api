import moment from 'moment';

const ReportStaffInfo = (report) => {
  const data = [];
  for (let i = 0; i < report.length; i += 1) {
    const el = report[i];
    data.push({
      "Staff Name": el.staff.fullName,
      "Contact": el.staff.contact,
      "Basic Salary": el.amount - el.commission,
      "Total Salary": el.amount,
      "Sales Amount Of The Month": el.salesAmount,
      "Commission": el.commission,
      "Date": moment(el.date).format('LL'),
      "Salary Month": el.salaryMonth,
      "Salary Year": el.salaryYear,
      "Method": el.method,
      "Mfs Trxn Id": el.mfsTrxnId,
      "Description": el.description,
    });
  }
  return data;
};

export default ReportStaffInfo;

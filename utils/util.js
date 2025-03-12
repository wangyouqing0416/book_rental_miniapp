const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

const formatTime2 = date => {
  if (date == null || date == '' || date == undefined) {
    date = new Date();
  }
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':');
}

const formatDate = date =>{
  if(date == null || date == '' || date == undefined){
    date = new Date();
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-');
}

const getCurrMonth = () => {
  var date = new Date();
  const month = date.getMonth() + 1;

  return formatNumber(month) + '月';
}

const dateAddDay = (date, day) =>{
  let d = new Date(date.replace(/-/g, '/'));
  d.setDate(d.getDate() + day);
  return formatDate(d);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatDate: formatDate,
  dateAddDay: dateAddDay,
  getCurrMonth: getCurrMonth
}
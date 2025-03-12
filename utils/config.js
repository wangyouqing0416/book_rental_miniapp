// 应用名称
const APP_NAME = "租书通";
// 服务器地址
// 如果是直接启动tomcat的方式，则使用下面的地址
//const SERVER = "http://192.168.10.102:8080";
// 如果是通过idea来启动的方式，则使用下面的地址
// const SERVER = "http://192.168.10.102:8080/book_rental_war_exploded";
const SERVER = "http://192.168.10.102:8080";
 //const SERVER = "http://192.168.10.102:8080/book_rental_war_exploded";
// const SERVER = "http://test.hainanpost.cn";

// 主题
const APP_THEME = {
  themeColor: "#64BDAF",
  fontColor: "#ffffff"
};

// 微信用户 
const WXUSER = "wxUser";

// 请求结果码
const RESULT_OK = 200; // 请求成功

// 暴露对象
module.exports = {
  server: SERVER,
  resultOK: RESULT_OK,
  appName: APP_NAME,
  appTheme: APP_THEME,
  
  wxUser: WXUSER,
};
var app = getApp();
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数
var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('授权登录'); // 不填写标题则使用应用名
  },
  success: function(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 缓存到全局变量
      app.globalData.wxUser = e.detail.userInfo;
      app.globalData.getUserInfoResult = e.detail;
      app.globalData.isAuthed = true;
      // 注册用户
      this.register(e.detail.userInfo);
    } else {
      common.showToast('授权失败，请重新授权！');
    }
  },
  // 注册
  register: function(wxUser) {
    var params = {
      'openid': app.globalData.openid,
      'nickName': wxUser.nickName,
      'avatar': wxUser.avatarUrl
    }
    common.showLoading();
    common.request('/api/register', params, 'POST', res => {
      if (res.data.success) {
        // 注册成功
        app.globalData.loginUser = res.data.obj;
      } else {
        // 已经注册了
        app.globalData.loginUser = res.data.obj;
      }
      wx.navigateBack();
    }, res => {
      wx.hideLoading();
    });
  }
})
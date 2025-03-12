var app = getApp();
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数

var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthed: app.globalData.isAuthed,
    asset: 0,
    wxUser: {},
    loginUser: {},
    logisticsOrderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('我的');
    // 读取全局变量
    this.setData({
      wxUser: app.globalData.wxUser,
      loginUser: app.globalData.loginUser
    });

  },
  onShow: function() {
    _this.setData({
      isAuthed: app.globalData.isAuthed,
      wxUser: app.globalData.wxUser
    });
    if (!_this.data.isAuthed) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
    }
    // 设置购物车的数字标号
    common.updateTabBarBadge(app);
    // 获取用户信息
    this.getUserInfo();
    // 加载运输中的订单
    this.loadLogisticsOrders();
  },
  // 获取用户信息
  getUserInfo: function() {
    var params = {
      'openid': app.globalData.openid
    };
    // common.showLoading();
    common.request('/api/getUserInfo', params, 'POST', res => {
      if (res.data.success) {
        app.globalData.loginUser = res.data.obj;
        _this.setData({
          asset: app.globalData.loginUser.asset
        });
      }
    });
  },
  // 加载运输中的订单
  loadLogisticsOrders: function() {
    var params = {
      'userId': app.globalData.loginUser.id
    };
    // common.showLoading();
    common.request('/api/loadLogisticsOrders', params, 'POST', res => {
      if (res.data.success) {
        _this.setData({
          logisticsOrderList: res.data.obj
        });
      }
    });
  },
  // 跳转订单详情
  toOrdersDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ordersDetail/ordersDetail?id=' + id,
    })
  },
  // 跳转页面
  toPage: function(e) {
    common.toPage(e);
  }
})
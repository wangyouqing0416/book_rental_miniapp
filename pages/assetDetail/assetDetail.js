var app = getApp();
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数
var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('资金明细'); // 不填写标题则使用应用名
    // 加载数据
    this.loadData();
  },
  // 加载数据
  loadData: function() {
    var params = {
      'userId': app.globalData.loginUser.id
    }
    common.showLoading();
    common.request('/api/loadAssetDetail', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        // 注册成功
        _this.setData({
          list: res.data.obj
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  }
})
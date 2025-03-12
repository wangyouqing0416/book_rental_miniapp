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
    common.setNavigationBar('支付成功'); // 不填写标题则使用应用名
  },
  backToHome: function(e) {
    // 授权订阅消息
    // oDuBZmcwMYOh6dNmAtqVrr0-oJpIjSQPX-CBRr0ca6M
    wx.requestSubscribeMessage({
      tmplIds: ['TDT4_N0PfAhcKduGEIs0J2bql1jiIgfXiwTj6JswbzU'],
      success(res) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    });
  }
})
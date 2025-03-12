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
    common.setNavigationBar('提交成功'); // 不填写标题则使用应用名
  },
  back: function(e) {
    // 授权订阅消息
    // Zkny2wKSpSZopAS6gCg1uiuXdisN-fY-MBml4NqXOEk
    wx.requestSubscribeMessage({
      tmplIds: ['1C9XIu1SxZzlskyvrtQLdc4KVGTyR9ttJdvdWg52yxc'],
      success(res) {
        wx.navigateBack();
      }
    });
  }
})
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
    common.setNavigationBar('分类');

    _this.loadBookType();
  },
  onShow: function() {
    // 设置购物车的数字标号
    common.updateTabBarBadge(app);
  },
  // 加载分类
  loadBookType: function() {
    var params = {};
    common.showLoading();
    common.request('/api/loadAllBookType', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          list: res.data.obj
        });
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 跳转页面
  toList: function(e) {
    var typeId = e.currentTarget.dataset.typeId;
    var typeName = e.currentTarget.dataset.typeName;
    wx.navigateTo({
      url: '/pages/bookList/bookList?typeId=' + typeId + '&typeName=' + typeName,
    })
  }
})
var app = getApp();
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数

var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: config.server,
    id: '',
    orders: {},
    showAllLogistics: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('订单详情');
    let id = options.id;
    // id = 66;
    this.setData({
      id: id
    });
    // 加载数据
    this.loadData();
  },
  onShow: function() {},
  // 加载数据
  loadData: function() {
    var params = {
      'id': _this.data.id
    };
    common.showLoading();
    common.request('/api/getOrdersDetail', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          orders: res.data.obj
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 显示全部物流
  showAllLogistics: function(e) {
    let showAllLogistics = this.data.showAllLogistics;
    this.setData({
      showAllLogistics: !showAllLogistics
    });
  }
})
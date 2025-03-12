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
    typeId: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;

    var typeId = options.typeId;
    var typeName = options.typeName;
    if (common.isEmpty(typeName)) {
      typeName = '书库';
    }
    _this.setData({
      typeId: typeId
    });
    // 设置标题
    common.setNavigationBar(typeName);

    _this.loadBookByType();
  },
  onShow: function() {

  },
  // 加载指定类别图书
  loadBookByType: function() {
    var params = {
      'typeId': _this.data.typeId || ''
    };
    common.showLoading();
    common.request('/api/loadBookByType', params, 'POST', res => {
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
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/bookDetail/bookDetail?id=' + id,
    })
  }
})
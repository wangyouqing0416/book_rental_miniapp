var app = getApp();
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数

var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;

    common.setNavigationBar('设置手机号');

    let bookId = options.bookId;
    this.setData({
      bookId: bookId
    });
  },
  onShow: function() {

  },
  // 输入
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  // 确认
  confirm: function(e) {
    var params = {
      'book_id': _this.data.bookId,
      'user_id': app.globalData.loginUser.id,
      'phone': _this.data.phone
    };
    common.showLoading();
    common.request('/api/setNotice', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        wx.showToast({
          title: res.data.msg
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 1500);
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  }

})
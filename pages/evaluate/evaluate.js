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
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;

    common.setNavigationBar('发表评论');

    let bookId = options.bookId;
    this.setData({
      bookId: bookId
    });
  },
  onShow: function() {

  },
  // 输入
  formInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },
  // 确认
  confirm: function(e) {
    if (!this.data.content) {
      common.showToast('说点什么吧');
      return;
    }
    var params = {
      'book_id': _this.data.bookId,
      'user_id': app.globalData.loginUser.id,
      'content': _this.data.content
    };
    common.showLoading();
    common.request('/api/saveEvaluate', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        common.showToast('发表成功').then(() => {
          wx.navigateBack();
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  }

})
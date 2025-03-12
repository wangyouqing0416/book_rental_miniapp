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
    dataList: [],
    checkedList: [],
    // 只是作为页面选中效果使用
    checked: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;

    // 设置标题
    common.setNavigationBar('购物车');

    // _this.loadData();
  },
  onShow: function() {
    // 设置购物车的数字标号
    common.updateTabBarBadge(app);
    this.loadData();
    // 清空选择
    this.setData({
      checkedList: []
    });
  },
  loadData: function() {
    var params = {
      'userId': app.globalData.loginUser.id
    };
    common.showLoading();
    common.request('/api/loadShoppingCart', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          dataList: res.data.obj
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  toDetail: function(e) {
    let bookId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/bookDetail/bookDetail?id=' + bookId,
    })
  },
  checkboxChange: function(e) {
    let bookId = e.currentTarget.dataset.bookId;
    let cartId = e.currentTarget.dataset.cartId;
    let tempBookIds = e.detail.value;
    console.log(tempBookIds);
    let checkedList = this.data.checkedList;
    if (tempBookIds.length > 0) {
      let o = {
        bookId: bookId,
        cartId: cartId
      }
      checkedList.push(o);
    } else {
      checkedList = checkedList.filter(item => item.cartId != cartId);
    }
    this.setData({
      checkedList: checkedList
    });
  },
  account: function() {
    let checkedList = this.data.checkedList;
    if (checkedList.length == 0) {
      common.showToast('请选择商品');
      return;
    }
    let bookIds = new Array();
    let cartIds = new Array();
    checkedList.forEach(item => {
      bookIds.push(item.bookId);
      cartIds.push(item.cartId);
    });
    wx.navigateTo({
      url: '/pages/ordersBuy/ordersBuy?ids=' + bookIds.join(',') + '&cartIds=' + cartIds.join(',')
    })
  }
})
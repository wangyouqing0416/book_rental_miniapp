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
    activeIndex: 0,
    allList: [],
    waitList: [],
    doneList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    let title = options.title;
    common.setNavigationBar(title);
    // 加载数据
    this.loadData();
  },
  onShow: function() {},
  // tab点击
  tabClick: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: index
    });
  },
  // swiper滑动
  swiperChange: function(e) {
    this.setData({
      activeIndex: e.detail.current
    });
  },
  // 加载数据
  loadData: function() {
    var params = {
      'userId': app.globalData.loginUser.id
    };
    common.showLoading();
    common.request('/api/loadRevertOrders', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        let resultMap = res.data.obj;
        _this.setData({
          allList: resultMap.allList,
          waitList: resultMap.waitList,
          doneList: resultMap.doneList
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 跳转订单详情
  toDetail: function(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/revertDetail/revertDetail?id=' + id,
    })
  }
})
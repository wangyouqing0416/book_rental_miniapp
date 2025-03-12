// 获取应用实例 
const app = getApp()
var util = require("../../utils/util.js"); // 加载全局js
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数
var _this;
var _auth = false;

Page({
  data: {
    server: config.server,
    userInfo: {},
    bannerData: [{
        imgPath: '/image/banner1.png'
      },
      {
        imgPath: '/image/banner2.png'
      }
    ],
    indicatorDots: true, //小点
    autoplay: true, //是否自动轮播
    interval: 5000, //间隔时间
    duration: 500, //滑动时间
    hotList: [],
    recList: []
  },
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar();

    _this.loadHot();
    _this.loadRecommend();
  },
  onShow: function() {
    // 设置购物车的数字标号
    common.updateTabBarBadge(app);
  },
  // 还书提醒
  revertNotice: function(data) {
    if (data.length > 0) {
      var noticeMsg = '';
      if (data.length > 1) {
        noticeMsg = '您有' + data.length + '本书快到还书日了！';
      } else {
        var revertBook = data[0];
        noticeMsg = '您借阅的「' + revertBook.bookName + '」离还书日还有' + revertBook.lessDays + '天！';
      }
      wx.showModal({
        title: '还书提醒',
        content: noticeMsg,
        showCancel: true,
        cancelText: '我知道了',
        confirmText: '去看看',
        success: res => {
          if (res.confirm) {
            // 跳转到待还图书页面
            wx.navigateTo({
              url: '../borrowHis/borrowHis?title=待还图书&status=10',
            })
          }
        }
      });
    }
  },
  // 加载热门
  loadHot: function() {
    var params = {};
    common.showLoading();
    common.request('/api/loadHot', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          hotList: res.data.obj
        });
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 加载推荐
  loadRecommend: function() {
    var params = {};
    common.showLoading();
    common.request('/api/loadRecommend', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          recList: res.data.obj
        });
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 跳转页面
  toSearch: function(e) {
    common.toPage(e);
  },
  // 书籍详情
  toDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/bookDetail/bookDetail?id=' + id,
    })
  },
  // 查看更多
  viewMore: function(e) {
    wx.navigateTo({
      url: '/pages/bookList/bookList',
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    _this.loadHot();
    _this.loadRecommend();
    wx.stopPullDownRefresh();
  }
})
var app = getApp();
var common = require("../../utils/common.js"); // 加载全局js
var config = require("../../utils/config.js"); // 加载全局参数
var _this;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgUrl: config.server + '/app_resource/launcher_bg.jpg',
    openid: '',
    pageType: -1,
    pageParams: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 获取跳转参数（从分享进来还是打开小程序进来）
    let pageType = options.type;
    let pageParams = options.params;
    // 跳转的页面标识：-1 从小程序进来，0 从图书详情分享进来
    if (!!pageType) {
      this.setData({
        pageType: pageType
      });
    }
    // 跳转携带的参数
    if (!!pageParams) {
      this.setData({
        pageParams: pageParams
      });
    }
    // 初始化openid
    let openid = wx.getStorageSync('openid');
    if (!openid) {
      // 缓存中没有openid，则登录获取
      common.login().then(openid => {
        app.globalData.openid = openid
        // 验证是否授权
        this.checkAuth();
      });
    } else {
      app.globalData.openid = openid
      // 验证是否授权
      this.checkAuth();
    }
  },
  // 验证用户
  checkAuth: function() {
    wx.getSetting({
      success: res => {
        // 登录授权
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              app.globalData.wxUser = res.userInfo;
              _this.getUserInfo();
            }
          });
          // 已经授权
          app.globalData.isAuthed = true;
        } else {
          _this.toNextPage();
        }
      }
    });
  },
  // 获取注册用户信息
  getUserInfo: function() {
    var params = {
      'openid': app.globalData.openid
    }
    // common.showLoading();
    common.request('/api/getUserInfo', params, 'POST', res => {
      if (res.data.success) {
        app.globalData.loginUser = res.data.obj;
      }
      _this.toNextPage();
    });
  },
  // 跳转下一页面
  toNextPage: function() {
    let pageUrl;
    if (0 == this.data.pageType) {
      pageUrl = '/pages/bookDetail/bookDetail';
      let p = JSON.parse(this.data.pageParams);
      // 从分享进入，跳转图书详情
      wx.redirectTo({
        url: pageUrl + '?id=' + p.id,
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})
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
    book: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;

    common.setNavigationBar('详情');

    var id = options.id;
    // id = 20;
    _this.setData({
      id: id
    });
  },
  onShow: function() {
    _this.getBookDetail();
  },
  // 加载书籍详情
  getBookDetail: function() {
    var params = {
      'id': _this.data.id,
      'userId': app.globalData.loginUser.id
    };
    common.showLoading();
    common.request('/api/getBookDetail', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          book: res.data.obj
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 加入购物车
  addIntoCar: function(e) {
    common.checkAuthed(app).then(isAuthed => {
      if (isAuthed) {
        var book = _this.data.book;
        let params = {
          'user_id': app.globalData.loginUser.id,
          'book_id': book.id
        };
        common.showLoading('正在处理');
        common.request('/api/addIntoCart', params, 'POST', res => {
          wx.hideLoading();
          if (res.data.success) {
            // 增加购物车数量
            let carCount = app.globalData.carCount;
            carCount = !!carCount ? parseFloat(carCount) + 1 : 1;
            app.globalData.carCount = carCount + '';
            // 标记为已加入购物车
            _this.setData({
              ['book.isBorrow']: true
            });
            common.showToast('已添加到购物车', 1);
          } else {
            common.showToast(res.data.msg);
          }
        }, res => {
          // wx.hideLoading();
        });
      }
    });
  },
  // 借阅
  borrow: function(e) {
    common.checkAuthed(app).then(isAuthed => {
      if (isAuthed) {
        wx.navigateTo({
          url: '/pages/ordersBuy/ordersBuy?ids=' + _this.data.book.id,
        });
      }
    });
  },
  // 设置到馆提醒
  setNotice: function(e) {
    common.checkAuthed(app).then(isAuthed => {
      if (isAuthed) {
        var params = {
          'book_id': _this.data.id,
          'user_id': app.globalData.loginUser.id,
        };
        common.showLoading();
        common.request('/api/setNotice', params, 'POST', res => {
          wx.hideLoading();
          if (res.data.success) {
            _this.setData({
              ['book.isNotice']: true
            });
            common.showToast(res.data.msg);
          } else {
            if (res.data.code == 601) {
              wx.showModal({
                title: '提示',
                content: '请设置接收短信的手机号',
                confirmText: '前往设置',
                success: res => {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/setPhone/setPhone?bookId=' + _this.data.id,
                    });
                  }
                }
              });
            } else {
              common.showToast(res.data.msg);
            }
          }
        }, res => {
          // wx.hideLoading();
        });
      }
    });
  },
  // 评论
  evaluate: function(e) {
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?bookId=' + this.data.id
    })
  },
  // 分享
  onShareAppMessage: function(res) {
    let params = {
      'id': _this.data.id
    };
    return {
      title: '我发现了一本好书，快来看看吧',
      path: '/pages/splash/splash?type=0&params=' + JSON.stringify(params)
    }
  }

})
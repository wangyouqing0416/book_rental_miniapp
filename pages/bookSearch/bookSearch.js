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
    hotSearch: ['舞蹈家自我修养', '赵丽辉', '计算机技术'],
    param: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('搜索');
  },
  onShow: function() {},
  // 输入框输入
  input: function(e) {
    var param = e.detail.value;
    _this.setData({
      param: param
    });
    if (!common.isEmpty(param)) {
      _this.searchBook();
    } else {
      _this.setData({
        list: []
      });
    }
  },
  // 热门搜索
  search: function(e) {
    var param = e.currentTarget.dataset.param;
    _this.setData({
      param: param
    });
    _this.searchBook();
  },
  // 查询图书
  searchBook: function() {
    var params = {
      'param': _this.data.param
    };
    common.request('/api/searchBook', params, 'POST', res => {
      if (res.data.success) {
        _this.setData({
          list: res.data.obj
        });
      }
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
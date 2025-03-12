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
    cartIds: '',
    bookIds: '',
    books: [],
    price: 0,
    deposit: 0,
    totalPrice: 0,
    receiver: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('填写订单');
    let bookIds = options.ids;
    let cartIds = options.cartIds;
    this.setData({
      bookIds: bookIds,
      cartIds: !!cartIds ? cartIds : ''
    });
    // 从缓存中加载收件人信息
    this.loadReceiverFromStorage();
    // 加载书籍详情
    this.getBookDetail(bookIds);
  },
  onShow: function() {},
  // 从缓存中加载收件人信息
  loadReceiverFromStorage: function() {
    let receiverJson = wx.getStorageSync('receiver');
    if (!!receiverJson) {
      let receiver = JSON.parse(receiverJson);
      this.setData({
        receiver: receiver
      });
    }
  },
  // 保存收件人信息到缓存中
  setReceiverToStorage: function() {
    let receiverJson = JSON.stringify(this.data.receiver);
    wx.setStorageSync('receiver', receiverJson);
  },
  // 加载书籍详情
  getBookDetail: function(bookIds) {
    var params = {
      'ids': _this.data.bookIds
    };
    common.showLoading();
    common.request('/api/getBookByIds', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        let books = res.data.obj;
        // 计算总价
        let price = 0;
        let deposit = 0;
        books.forEach(function(item, index) {
          price += parseFloat(item.price || 0);
          deposit += parseFloat(item.deposit || 0);
        })
        _this.setData({
          books: books,
          price: price,
          deposit: deposit,
          totalPrice: price + deposit
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 表单录入
  formInput: function(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;
    let receiver = this.data.receiver;
    if (0 == type) {
      receiver.name = value;
    } else if (1 == type) {
      receiver.phone = value;
    } else if (2 == type) {
      receiver.address = value;
    }
    this.setData({
      receiver: receiver
    });
  },
  // 提示
  confirm: function(e) {
    if (this.checkForm()) {
      // 模态框
      wx.showModal({
        title: '提示',
        content: '确定提交订单吗？',
        success: res => {
          if (res.confirm) {
            // 保存收件人信息到缓存中
            _this.setReceiverToStorage();
            // 提交订单
            _this.order();
          }
        }
      });
    }

  },
  // 校验收件人信息
  checkForm: function() {
    let check = true;
    let receiver = this.data.receiver;
    if (!receiver.name) {
      common.showToast('请输入收件人姓名')
      check = false;
    } else if (!receiver.phone) {
      common.showToast('请输入收件人联系电话')
      check = false;
    } else if (!receiver.address) {
      common.showToast('请输入收件地址')
      check = false;
    }

    return check;
  },
  // 提交订单
  order: function(e) {
    let receiver = this.data.receiver;
    var params = {
      'cartIds': _this.data.cartIds,
      'openid': app.globalData.openid,
      'user_id': app.globalData.loginUser.id,
      'realname': app.globalData.loginUser.nickName,
      'bookIds': _this.data.bookIds,
      'total_price': _this.data.totalPrice,
      'price': _this.data.price,
      'deposit': _this.data.deposit,
      'receiver': receiver.name,
      'receiver_phone': receiver.phone,
      'receiver_address': receiver.address
    };
    common.showLoading();
    common.request('/api/order', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        wx.redirectTo({
          url: '/pages/paySuccess/paySuccess',
        })
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
})
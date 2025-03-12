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
    borrowId: '',
    borrow: {},
    receiver: {},
    logisticsNo: '',
    deliveryCompany: '',
    deliveryCompanyPlaceholder: '自动识别'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this;
    // 设置标题
    common.setNavigationBar('填写订单');
    let borrowId = options.borrowId;
    // borrowId = '7';
    this.setData({
      borrowId: borrowId
    });
    // 加载租借单详情
    this.getDataDetail();
    // 获取收件人信息
    this.getReceiver();
  },
  onShow: function() {},
  // 加载租借单详情
  getDataDetail: function() {
    var params = {
      'id': _this.data.borrowId
    };
    common.showLoading();
    common.request('/api/getBorrowDetail', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        _this.setData({
          borrow: res.data.obj
        });
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
  // 获取收件人信息
  getReceiver: function() {
    common.request('/api/getReceiver', {}, 'POST', res => {
      if (res.data.success) {
        _this.setData({
          receiver: res.data.obj
        });
      } else {
        common.showToast(res.data.msg);
      }
    });
  },
  // 表单录入
  formInput: function(e) {
    this.setData({
      logisticsNo: e.detail.value
    });
  },
  // 扫一扫
  scan: function(e) {
    // 允许从相机和相册扫码
    wx.scanCode({
      scanType: ['barCode', 'qrCode', "CODE_128"],
      success(res) {
        _this.setData({
          logisticsNo: res.result
        });
        // 获取物流
        _this.getExpress();
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  // 根据物流单号获取物流信息
  getExpress: function(e) {
    this.setData({
      deliveryCompany: '',
      deliveryCompanyPlaceholder: !!_this.data.logisticsNo ? '正在识别...' : '自动识别'
    });
    if (!!this.data.logisticsNo) {
      let params = {
        'logisticsNo': _this.data.logisticsNo
      };
      common.request('/api/getExpressByLogisticsNo', params, 'POST', res => {
        if (res.data.success) {
          _this.setData({
            deliveryCompany: res.data.obj
          });
        } else {
          common.showMsg(res.data.msg);
        }
      }, res => {
        _this.setData({
          deliveryCompanyPlaceholder: '自动识别'
        });
      });
    }
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
            // 提交订单
            _this.revert();
          }
        }
      });
    }

  },
  // 校验信息
  checkForm: function() {
    let check = true;
    let logisticsNo = this.data.logisticsNo;
    let receiver = this.data.receiver;
    if (!logisticsNo) {
      common.showToast('请填写物流单号');
      check = false;
    } else if (!receiver.receiver) {
      common.showToast('缺少收件人姓名')
      check = false;
    } else if (!receiver.phone) {
      common.showToast('缺少收件人联系电话')
      check = false;
    } else if (!receiver.address) {
      common.showToast('缺少收件地址')
      check = false;
    }

    return check;
  },
  // 提交订单
  revert: function(e) {
    let receiver = this.data.receiver;
    let borrow = this.data.borrow;
    var params = {
      'user_id': app.globalData.loginUser.id,
      'realname': app.globalData.loginUser.nickName,
      'book_id': borrow.bookId,
      'book_name': borrow.bookName,
      'book_cover': borrow.bookCover,
      'borrow_id': _this.data.borrowId,
      'deposit': borrow.deposit,
      'revert_money': borrow.depositLess,
      'receiver': receiver.receiver,
      'receiver_phone': receiver.phone,
      'receiver_address': receiver.address,
      'logistics_no': _this.data.logisticsNo,
      'delivery_company_name': _this.data.deliveryCompany.cname
    };
    common.showLoading();
    common.request('/api/revert', params, 'POST', res => {
      wx.hideLoading();
      if (res.data.success) {
        wx.redirectTo({
          url: '/pages/revertSuccess/revertSuccess',
        })
      } else {
        common.showToast(res.data.msg);
      }
    }, res => {
      // wx.hideLoading();
    });
  },
})
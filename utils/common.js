var config = require("config.js"); // 引入全局变量
var app = getApp(); // 获取应用实例

/**
 * request请求封装
 * @param url
 * @param params
 * @param method 请求方式：POST、GET
 * @param sussessCallback
 * @param completeCallback
 * @param failCallback
 */
function request(url, params, method = 'POST', successCallback, completeCallback, failCallback) {
  var _this = this;
  wx.request({
    url: config.server + url,
    data: params,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: res => {
      // console.log('request返回:', res);
      // 校验请求结果
      if (res.statusCode == 404) {
        wx.showModal({
          content: '网络好像没有连接成功,是否重试？',
          confirmText: '重试',
          success: function(res) {
            if (res.confirm) {
              _this.request(url, params, method = 'POST', successCallback, completeCallback, failCallback);
            }
          }
        })
      } else if (res.statusCode == 200) {
        successCallback && successCallback(res);
      } else {
        wx.hideLoading();
        showMsg("网络异常，请退出重试!");
      }
    },
    fail: res => {
      wx.hideLoading();
      showMsg(config.server + url + '连接失败');
      failCallback && failCallback(res);
    },
    complete: res => {
      // wx.hideLoading();
      completeCallback && completeCallback(res);
    }
  });
};

/**
 * 小程序登录，获取openid并缓存到本地
 */
function login() {
  var _this = this;

  return new Promise(function(resolve, reject) {
    wx.login({
      success(res) {
        if (res.code) {
          let param = {
            'code': res.code
          };
          _this.request('/auth/code2session', param, 'POST', res => {
            if (res.data.success) {
              let openid = res.data.obj;
              wx.setStorageSync('openid', openid);
              resolve(openid);
            } else {
              reject(res.data.msg);
            }
          });
        }
      }
    });
  });
}

/**
 * 设置标题
 * title: 指定标题
 * description: 未指定的话使用应用名称
 */
function setNavigationBar(title) {
  if (this.isEmpty(title)) {
    title = config.appName; // 未指定标题，则使用应用名称
  }
  // 设置标题
  wx.setNavigationBarTitle({
    title: title
  });
  // 设置标题栏
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#1890ff'
  });
};

/**
 * 对象是否为空
 * val: 需判断的对象
 * return: true 为空，false 为非空
 */
function isEmpty(val) {
  if (val != null && val != '' && val !== undefined) {
    return false;
  }

  return true;
};

/**
 * 显示提示语
 * data: 提示内容
 */
function showMsg(data) {
  // 模态框
  wx.showModal({
    title: '提示',
    content: data,
    showCancel: false,
    success: res => {}
  });
}

/**
 * 显示提示语
 * data: 提示内容
 */
function showConnectError() {
  // 模态框
  wx.showModal({
    title: '提示',
    content: '系统出现未知错误，请求失败，请重试！',
    showCancel: false,
    success: res => {}
  });
}

/**
 * 显示短暂提示语
 * msg：显示文本
 * tType：提示语类型；空时无图标，1为成功提示
 */
function showToast(msg, tType) {
  var icon = isEmpty(tType) ? 'none' : 'success';
  return new Promise(function(resole, rejecg) {
    wx.showToast({
      title: msg,
      icon: icon,
      duration: 2000,
      // mask: true
    });
    setTimeout(() => {
      resole();
    }, 2000);
  });
}

/**
 * 显示loading
 */
function showLoading(msg) {
  if (this.isEmpty(msg)) {
    msg = '拼命加载中'; // 未指定消息，则使用默认消息
  }
  wx.showLoading({
    title: msg,
    mask: true
  })
}

/**
 * 跳转页面
 */
function toPage(e) {
  var pageUrl = e.currentTarget.dataset.pageUrl;
  var pageTitle = e.currentTarget.dataset.pageTitle;
  wx.navigateTo({
    url: pageUrl + (!!pageTitle ? '?title=' + pageTitle : ''),
  });
}

/**
 * 更新标签栏的角标（购物车）
 */
function updateTabBarBadge(app) {
  let param = {
    'userId': app.globalData.loginUser.id
  };
  this.request('/api/loadShoppingCart', param, 'POST', res => {
    if (res.data.success) {
      let list = res.data.obj
      if (!!list && list.length > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: list.length + ''
        });
      } else {
        wx.removeTabBarBadge({
          index: 2
        });
      }
    }
  });
}

/**
 * 验证是否已经授权了，未授权则询问
 */
function checkAuthed(app) {
  return new Promise(function(resole, reject) {
    let isAuthed = app.globalData.isAuthed;
    if (!isAuthed) {
      wx.showModal({
        title: '提示',
        content: '请先授权登录',
        confirmText: '授权登录',
        cancelText: '稍后再说',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          }
        }
      })
    }
    resole(isAuthed);
  });
}

// 暴露对象
module.exports = {
  request: request,
  login: login,
  setNavigationBar: setNavigationBar,
  isEmpty: isEmpty,
  showMsg: showMsg,
  showConnectError: showConnectError,
  showToast: showToast,
  showLoading: showLoading,
  toPage: toPage,
  updateTabBarBadge: updateTabBarBadge,
  checkAuthed: checkAuthed
}
//app.js
var config = require("utils/config.js");
var common = require("utils/common.js");
var _this;

App({
  onLaunch: function() {
    _this = this;
  },
  globalData: {
    isAuthed: false,
    wxUser: {},
    loginUser: {},
    carCount: '',
    openid: ''
  }
})
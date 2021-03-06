// pages/partProfile/profile/profile.js
const app = getApp();
Page({
  data: {
    avatar: 'http://120.77.212.41/MYHTML/php4Homework/avatar/default.png',
    userName: '默认名字',
    isDisabled: false,
    punchsignTimes: 0,
    items: [
      {
        icon: '../../../assets/images/iconfont-order.png',
        text: '我的帖子',
        path: '/pages/order/list/index'
      },
      {
        icon: '../../../assets/images/iconfont-addr.png',
        text: '我的学校',
        path: '/pages/address/list/index'
      },
      {
        icon: '../../../assets/images/iconfont-kefu.png',
        text: '联系客服',
        path: '15025508295',
      },
      {
        icon: '../../../assets/images/iconfont-help.png',
        text: '常见问题',
        path: '/pages/help/list/index',
      },
    ],
    settings: [
      {
        icon: '../../../assets/images/iconfont-clear.png',
        text: '清除缓存',
        path: '0.0KB'
      },
      {
        icon: '../../../assets/images/iconfont-about.png',
        text: '关于我们',
        path: '/pages/about/index'
      },
    ]
  },
  onLoad(options) {
    this.setData({ avatar: app.globalData.avatar, userName: app.globalData.userName });
    var that = this;
    //检查是否签到了，签过则将按钮不可用
    this.isPunchsigned();
    //获取签到次数
    var token = app.globalData.token;
    this.getPunchsignTimes(token);
  },
  logout() {
    //退出登陆时跳转到登录界面并清除缓存信息
    wx.showToast({
      icon: 'loading',
      title: '正在注销...',
      duration: 1000
    })
    try {
      // wx.removeStorageSync('userInfo');
      wx.clearStorage();
    } catch (e) {
      console('GG');
    }
    setTimeout(function () {
      wx.redirectTo({
        url: '../../partFirst/login/login',
      })
    }, 1000)
  },  /**
   * 签到，签到之后禁用按钮，在这里向服务器发送签到信息
   */
  punchsign() {
    //获取token
    var token = app.globalData.token;
    this.punchsignToServer(token);
  },
  /**
   * 签到所用方法
   */
  punchsignToServer(token) {
    var that = this;
    wx.request({
      url: 'http://120.77.212.41/MYHTML/php4Homework/punchsign/index.php',
      method: 'POST',
      data: {
        "type": 0,
        "content": {
          "token": token
        }
      },
      success: function (res) {
        if (res.data.ErrorCode == 0) {
          that.setData({
            isDisabled: true
          });
          wx.setStorageSync("punchsign", true);
          //获取当前时间戳
          var timeStamp = Date.parse(new Date())
          console.log(new Date());
          //这里是毫秒为单位的
          var expiretime = timeStamp + 72000000;
          //二十小时后过期
          wx.setStorageSync("expiretime", expiretime);
          wx.showToast({
            title: '签到成功',
          });
          that.setData({
            punchsignTimes: res.data.content.data
          })
        } else {
          console.log('请求失败');
        }
      }
    })
  },
  /**
   * 获取已签到次数
   */
  getPunchsignTimes(token) {
    var that = this;
    wx.request({
      url: 'http://120.77.212.41/MYHTML/php4Homework/punchsign/index.php',
      method: 'POST',
      data: {
        "type": 1,
        "content": {
          "token": token
        }
      },
      success: function (res) {
        if (res.data.ErrorCode == 0) {
          that.setData({
            punchsignTimes: res.data.content.data
          })
        } else {
          console.log('请求失败');
        }
      }
    })
  },
  /**
   * 检查今天是否签到过了
   */
  isPunchsigned() {
    //这里查看签到按钮今天是否已经按了
    var expiretime = wx.getStorageSync("expiretime") || 0;
    var isDisabled = wx.getStorageSync("punchsign");
    var timestamp = Date.parse(new Date());
    if (timestamp > expiretime) {
      this.setData({
        isDisabled: false
      });
    } else {
      this.setData({
        isDisabled: true
      });
    }
  }

  
})
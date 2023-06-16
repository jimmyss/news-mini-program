// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    pageNum:1,
    pageSize:10,
    newsList:[],
    bios:0,
    clickId:0,
    num:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadNews();
    this.getUserInfo();
  },
  getUserInfo: function (e) {
    const self = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              console.log(res.userInfo);
              self.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              });
            }
          });
        }
      }
    });
    // 在用户点击按钮并授权后，获取用户信息
    console.log(e)
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }
  },
  loadNews(){//监听界面加载初始新闻列表
    const { newsList, pageNum, bios } = this.data;
    wx.request({
      url: 'http://127.0.0.1:3000/api/favorite/load',
      success: res => {
        const newsData = res.data.news;
        const pNum=res.data.pageNum;
        const b=res.data.bios;
        const n =res.data.num;
        this.setData({
          newsList: newsData,
          pageNum: pNum,
          bios:b,
          num:n,
        });
      },
    });
  },

  navigateToIndex: function(event) {
    const index = event.currentTarget.dataset.index; // 获取点击的新闻序号
    const pageNum=this.data.pageNum;
    const bios=this.data.bios;
    const news = this.data.newsList[index];
    const picPath = news.picPath;
    // 调用后端接口发送新闻序号
    wx.request({
      url: 'http://127.0.0.1:3000/api/detail/favorite',
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      data: {
        index: index,
        pageNum:pageNum,
        bios:bios
      },
      success: (res) => {
        // console.log('点击新闻成功:', res.data);
        const send=res.data;
        const num=index+1
        // const imagPath="../homepage/images/new"+num+".png";
        console.log(send);
        wx.navigateTo({
          url: '/pages/index/index?title=' + encodeURIComponent(send.news.title) +
               '&date=' + encodeURIComponent(send.news.time) +
               '&image=' + encodeURIComponent(picPath) +
               '&author=' + encodeURIComponent(send.news.author) +
               '&url='+ encodeURIComponent(send.news.url) +
               '&content=' + encodeURIComponent(send.content)
        });
      },
      fail: (err) => {
        console.error('点击新闻失败:', err);
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }


})
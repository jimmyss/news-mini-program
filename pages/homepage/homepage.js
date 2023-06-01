// pages/homepage/homepage.js
Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    pageNum:1,
    pageSize:10,
    newsList:[],
    bios:0,
    clickId:0,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    this.loadNews();//调用loadNews函数加载新闻列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 本质是获取首页的数据
  onPullDownRefresh(){
    const {newsList, pageNum, bios}=this.data;
    wx.request({
      url: 'http://127.0.0.1:3000/api/homepage/pull',
      data:{
        pageNum,
        bios
      },
      success: res => {
        const newsData = res.data.news;
        const pNum=res.data.pageNum;
        setTimeout(()=>{
          this.setData({
            newsList:newsData,
            pageNum:pNum,
          });
          wx.stopPullDownRefresh();
        }, 1000);
      },
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const { pageNum, bios } = this.data;
    wx.showLoading({
      title: '加载中...',
    });
    wx.request({
      url: 'http://127.0.0.1:3000/api/homepage/bottom',
      data: {
        pageNum: pageNum,
        bios:bios
      },
      success: res => {
        const newsData = res.data.news;
        const pNum=res.data.pageNum;
        setTimeout(() => {
          this.setData({
            newsList: this.data.newsList.concat(newsData),
            pageNum:pNum,
          });
          wx.hideLoading();
        }, 1000);
      },
    });
  },

  loadNews(){//监听界面加载初始新闻列表
    const { newsList, pageNum, bios } = this.data;
    wx.request({
      url: 'http://127.0.0.1:3000/api/homepage/load',
      success: res => {
        const newsData = res.data.news;
        const pNum=res.data.pageNum;
        const b=res.data.bios;
        this.setData({
          newsList: newsData,
          pageNum: pNum,
          bios:b
        });
      },
    });
  },

  navigateToIndex: function(event) {

    const index = event.currentTarget.dataset.index; // 获取点击的新闻序号
    const pageNum=this.data.pageNum;
    const bios=this.data.bios;
    const news = this.data.newsList[index];
    // 调用后端接口发送新闻序号
    wx.request({
      url: 'http://127.0.0.1:3000/api/detail',
      method: 'POST',
      data: {
        index: index,
        pageNum:pageNum,
        bios:bios
      },
      success: (res) => {
        console.log('点击新闻成功:', res);
        wx.navigateTo({
          // url: '/pages/index/index?title=' + encodeURIComponent(news.title) +
          //      '&date=' + encodeURIComponent(news.time) +
          //      '&image=' + encodeURIComponent(news.picPath) +
          //      '&content=' + encodeURIComponent(news.author)
          url: '/pages/index/index'
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
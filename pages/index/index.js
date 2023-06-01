// index.js
Page({
  onLoad(options) {
    // 获取 URL 参数
    const params = options;
    // 解析 URL 参数并更新页面内容
    this.setData({
      title: params.title || '',
      date: params.time || '',
      // content: params.content || '',\
      content: '',
      imagePath: params.picPath || ''
    });
  },
  navigateToIndex: function(event) {
    const index = event.currentTarget.dataset.index;
    const news = JSON.stringify(this.data.newsList[index]);
    wx.navigateTo({
      url: '/pages/index/index?news=' + encodeURIComponent(news)
    });
  },  
  navigateToPage1: function() {
    // 跳转到页面1的逻辑
  },
  navigateToPage2: function() {
    // 跳转到页面2的逻辑
  },
  navigateToPage3: function() {
    // 跳转到页面3的逻辑
  }
})

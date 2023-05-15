// index.js
Page({
  data: {
    news: {},
    isFavorite: false
  },

  onLoad: function(options) {
    // 获取新闻详情数据，假设从参数中获取
    const newsId = options.id;
    // 调用接口或从本地数据获取新闻详情
    const newsDetail = this.getNewsDetail(newsId);
    // 更新数据
    this.setData({
      news: newsDetail
    });
  },

  // 获取新闻详情的示例函数
  getNewsDetail: function(newsId) {
    // 假设从本地数据获取新闻详情
    const newsData = {
      id: newsId,
      title: "示例新闻标题",
      time: "2023-05-15",
      content: "这是示例新闻的内容。",
      image: "images/collect.png"
    };
    return newsData;
  },

  // 返回按钮点击事件
  goBack: function() {
    wx.navigateBack();
  },

  // 评论按钮点击事件
  goToComment: function() {
    // 跳转到评论页面
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + this.data.news.id
    });
  },

  // 收藏按钮点击事件
  toggleFavorite: function() {
    this.setData({
      isFavorite: !this.data.isFavorite
    });
    // 可在此处调用收藏相关的接口或逻辑进行实际操作
  },

  // 分享按钮点击事件
  shareToWechat: function() {
    // 调用微信分享相关的接口或逻辑进行实际操作
    wx.showToast({
      title: '分享成功',
      icon: 'success'
    });
  }
});

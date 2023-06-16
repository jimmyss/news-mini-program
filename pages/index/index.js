// index.js
Page({
  data: {
    title: '',       // 新闻标题
    date: '',        // 新闻日期
    url: '',         // 新闻链接
    imagePath: '',   // 新闻图片路径
    author: '',      // 新闻作者
    content: [],      // 新闻内容
    isCollected: false,    // 是否已收藏
    isCommented: false,    // 是否已评论
    isShared: false        // 是否已分享
  },
  onLoad: function () {
    // 显示分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: () => {
        console.log('分享菜单显示成功');
      },
      fail: (err) => {
        console.error('分享菜单显示失败:', err);
      }
    });
  },
  
  onLoad(options) {
    // 获取 URL 参数
    const params = options;
    
    wx.request({
      url: 'http://127.0.0.1:3000/api/detail',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        index: params.index,
        pageNum: params.pageNum,
        bios: params.bios
      },
      success: (res) => {
        this.setData({
          title: res.data.news.title || '',
          date: res.data.news.time || '',
          url: res.data.news.url || '',
          imagePath: decodeURIComponent(params.image) || '',
          author: res.data.news.author || '',
          content: res.data.content || ''
        });
      },
      fail: (err) => {
        console.error('点击新闻失败:', err);
      }
    });

    // 显示分享按钮
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: '/pages/index/index', // 分享的页面路径
      imageUrl: this.data.imagePath
    };
  },
  onShareTimeline: function () {
    return {
      title: this.data.title,
      query: 'index=1&pageNum=2&bios=3', // 自定义参数，可根据需要传递参数
      imageUrl: this.data.imagePath
    };
  },
  addFavorite: function () {
    wx.request({
      url: 'http://127.0.0.1:3000/api/favorite/add',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        title: this.data.title,
        time: this.data.date,
        picPath: this.data.imagePath,
        author: this.data.author,
        url: this.data.url,
      }
    });
  },
  toggleCollect: function() {
    this.setData({
      isCollected: !this.data.isCollected
    });
    this.addFavorite();
    wx.showModal({
      title: '提示',
      content: '收藏成功',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定');
        }
      }
    });
  },
  toggleShare: function() {
    this.setData({
      isShared: !this.data.isShared
    });
  },
  toggleComment: function() {
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail',
    });
  }
});

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
  },
  addFavorite: function () {
    wx.request({
      url: 'http://127.0.0.1:8080/api/favorite/add',
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
    })
  },
  toggleCollect: function() {
    this.setData({
      isCollected: !this.data.isCollected
    });
  },
  toggleShare: function() {
    this.setData({
      isShared: !this.data.isShared
    });
  },
  toggleComment:function(){
    // console.log("oooooo")
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail',
    })
  }
})

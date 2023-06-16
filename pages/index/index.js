// index.js
Page({
  data: {
    id: '',
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
    console.log(params.id)
    wx.request({
      url: 'http://127.0.0.1:3000/api/detail',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: params.id,
      },
      success: (res) => {
        this.setData({
          id: res.data.news.id || '',
          title: res.data.news.title || '',
          date: res.data.news.time || '',
          url: res.data.news.url || '',
          imagePath: decodeURIComponent(params.image) || '',
          author: res.data.news.author || '',
          content: res.data.content || ''
        });
        console.log(res.data.news.isCollected)
        if(res.data.news.isCollected==0){
          this.setData({
            isCollected:false
          });
        }else{
          this.setData({
            isCollected:true
          });
        }
      },
      fail: (err) => {
        console.error('点击新闻失败:', err);
      }
    });
  },
  changeFavorite: function () {
    wx.request({
      url: 'http://127.0.0.1:3000/api/favorite/change',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: this.data.id,
      }
    })
  },
  toggleCollect: function() {
    this.setData({
      isCollected: !this.data.isCollected
    });
    wx.request({
      url: 'http://127.0.0.1:3000/api/favorite/change',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: this.data.id,
      }
    })
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

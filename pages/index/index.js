// index.js
Page({
  data: {
    title: '',       // 新闻标题
    date: '',        // 新闻日期
    url: '',         // 新闻链接
    imagePath: '',   // 新闻图片路径
    author: '',      // 新闻作者
    content: ''      // 新闻内容
  },
  onLoad(options) {
    // 获取 URL 参数
    const params = options;
    this.setData({
      title: decodeURIComponent(params.title) || '',
      date: decodeURIComponent(params.date) || '',
      url: decodeURIComponent(params.url) || '',
      imagePath: decodeURIComponent(params.image) || '',
      author: decodeURIComponent(params.author) || '',
      content: decodeURIComponent(params.content) || ''
    });
    // console.log(decodeURIComponent(params.image));
  },
  addFavorite: function() {
    //console.log(12323);
    // 跳转到页面1的逻辑
   // const title=this.data.title;
    //const time=this.data.date;
    //const picPath=this.data.imagePath;
    //const author=this.data.author;
   // const url=this.data.url;
    wx.request({
      url: 'http://127.0.0.1:3000/api/favorite/add',
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      data:{
        title:this.data.title,
        time:this.data.date,
        picPath:this.data.imagePath,
        author:this.data.author,
        url:this.data.url,
      }
    })
  },
  navigateToPage3: function() {
    // 跳转到页面3的逻辑
  },
  toComment:function(){
    console.log("oooooo")
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail',
    })
  }
})

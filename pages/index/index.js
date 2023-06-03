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

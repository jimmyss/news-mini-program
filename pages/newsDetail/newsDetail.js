
Page({
  data: {
    newsDetailPage: true, // 或者 false，表示是否存在 newsDetailPage 属性
    fabulous: 123,//赞的次数
    isFabulous: false,//是否赞
    isCollection: false,//是否收藏
    cmtList: [],
    pageIndex: 1,
    loadding: false,
    pullUpOn: true
  },
  onLoad: function (options) {
    //   // 判断 options 中是否存在 commentList 参数
    //   console.log("进onLoad")
    // if (options.cmtList) {
    //   console.log("进onLoad的if"+options.cmtList)
    //   // 将评论数据设置到页面的 data 中的 cmtList 属性中
    //   this.setData({ cmtList: JSON.parse(options.cmtList) });
    // }
    this.loadComments()
  },
  
  // 总文章的赞
  // btnFabulous: function () {
  //   this.setData({
  //     fabulous: this.data.isFabulous ? 123 : 124,
  //     isFabulous: !this.data.isFabulous
  //   })
  // },
  // 某个评论的赞
  // cmtFabulous: function (e) {
  //   let index = e.currentTarget.id;
  //   let fabulousObj = `cmtList[${index}].fabulous`;
  //   let isFabulousObj = `cmtList[${index}].isFabulous`;
  //   let isFabulous = this.data.cmtList[index].isFabulous;
  //   let fabulous = this.data.cmtList[index].fabulous;
  //   let fabulousNum = isFabulous ? fabulous - 1 : fabulous + 1;
  //   this.setData({
  //     [fabulousObj]: fabulousNum,
  //     [isFabulousObj]: !isFabulous
  //   })
  // },
  // 收藏
  // collection: function () {
  //   this.setData({
  //     isCollection: !this.data.isCollection
  //   }, () => {
  //     if (this.data.isCollection) {
  //       wx.showToast({
  //         title: '收藏成功',
  //         icon: 'success',
  //         duration: 2000
  //       })
  //     }
  //   })
  // },
  btnCmt: function () {
    wx.navigateTo({
      url: '../news-cmt/news-cmt'
    })
  },
  // 所有评论
  // cmtAll: function () {
  //   wx.navigateTo({
  //     url: '../news-cmt-list/news-cmt-list'
  //   })
  // },
  // cmtReply: function () {
  //   wx.navigateTo({
  //     url: '../news-cmt-reply/news-cmt-reply'
  //   })
  // },
  // 页面上拉触底事件的处理函数
  // onReachBottom: function () {
  //   if (!this.data.pullUpOn) return;
  //   this.setData({
  //     loadding: true
  //   }, () => {
  //     if (this.data.pageIndex == 3) {
  //       this.setData({
  //         loadding: false,
  //         pullUpOn: false
  //       })
  //     } else {
  //       let arr = JSON.parse(JSON.stringify(this.data.cmtList));
  //       this.setData({
  //         cmtList: this.data.cmtList.concat(arr),
  //         pageIndex: this.data.pageIndex + 1,
  //         loadding: false
  //       })
  //     }
  //   })
  // },
  // 接收评论内容并添加到cmtList中
  receiveComment: function (comment) {
    // 获取cmtList数据
    var cmtList = this.data.cmtList;
    console.log("cmtList")
    console.log(cmtList)
    // 添加评论内容到cmtList中
    cmtList.push({
      avatar: "../images/4.jpg", // 替换为您的头像路径
      nickname: "xmr", // 替换为您的昵称
      fabulous: 0,
      isFabulous: false,
      content: comment,
      reply: [],
      replayNum: 0,
      time: getCurrentTime() // 自定义获取当前时间的函数，例如使用moment.js库获取格式化的当前时间
    });

    // 更新cmtList数据
    this.setData({
      cmtList: cmtList
    });

    // 其他操作...

    // 将cmtList数据保存到本地或服务器等持久化操作
    // ...

    // 其他操作...
  },
  loadComments(){//监听界面加载初始评论列表
    const { cmtList} = this.data.cmtList;
    this.setData({
      cmtList: []
    });
  
    wx.request({
      url: 'http://127.0.0.1:3000/api/comment',
      success: res => {
        const cmt = res.data.cmtList;
        
        this.setData({
          cmtList:cmt
        });
        console.log('cmtList 元素数量:', this.data.cmtList.length);
      },
    });
  },
})

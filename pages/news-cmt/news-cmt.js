

Page({
  data: {
    comment:'',
    cmtList: [],
    updatedCmtList:[],
  },
  onLoad: function(options) {
    this.loadComments()
  },
  inputComment: function (event) {
    // 获取输入的值
    var commentText = event.detail.value;

    // 将输入的值赋给comment属性
    this.setData({
      comment: commentText
    });
  },
  btnPublish: function (event) {
    // 获取评论内容
    var comment = this.data.comment;
    console.log("读取到："+comment)
    const newComment = {
      avatar: "../images/4.jpg",
      nickname: "xmr",
      fabulous: 0,
      content: comment,
      reply: [],
      replayNum: 0,
      time:getCurrentTime() //
    };
    // 获取当前时间的函数
    function getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = padZero(now.getMonth() + 1);
      const day = padZero(now.getDate());
      const hours = padZero(now.getHours());
      const minutes = padZero(now.getMinutes());
      const seconds = padZero(now.getSeconds());
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 在个位数的时间前补零
    function padZero(num) {
      return num < 10 ? `0${num}` : num;
    }
    function formatTime(time) {
      const currentTime = new Date();
      const targetTime = new Date(time);
    
      // 计算时间差（单位：毫秒）
      const diffTime = currentTime - targetTime;
    
      // 计算时间差（单位：分钟）
      const diffMinutes = Math.floor(diffTime / 1000 / 60);
    
      if (diffMinutes < 60) {
        // 小于一小时，显示分钟数
        return `${diffMinutes}分钟前`;
      } else if (diffMinutes < 24 * 60) {
        // 小于一天，显示小时数
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours}小时前`;
      } else {
        // 大于一天，显示日期和时间
        const year = targetTime.getFullYear();
        const month = targetTime.getMonth() + 1;
        const day = targetTime.getDate();
        const hours = targetTime.getHours();
        const minutes = targetTime.getMinutes();
        return `${month}-${day} ${hours}:${minutes}`;
      }
    }
    
    console.log("前:"+this.data.cmtList)
    console.log("后："+this.cmtList)
    const updatedCmtList = [...this.data.cmtList, newComment];
    console.log("更新为"+updatedCmtList)
    this.updatedCmtList = [...this.data.cmtList, newComment];
    this.updateCommentData()
    
  },
  
  updateCommentData: function() {

    // 向后端发送请求更新评论数据
    wx.request({
      url: 'http://127.0.0.1:8080/api/comment',
      method: 'POST',
      data: {
        cmtList: this.updatedCmtList
      },
      success: (res) => {
        // 请求成功，提示更新成功
        console.log('评论数据更新成功:', res.data);

            // 返回到 newsDetail 页面
        wx.redirectTo({
          url: '../newsDetail/newsDetail',
          success: function(res) {
            // 在跳转成功后执行的逻辑
            const currentPage = getCurrentPages().pop();
            if (currentPage && currentPage.onLoad) {
              currentPage.onLoad(); // 手动执行 onLoad 方法
            }
          },
          fail: function(err) {
            // 跳转失败的处理逻辑
            console.error(err);
          }
        });


      },
      fail: (err) => {
        // 请求失败，处理错误情况
        console.error('更新评论数据失败:', err);
      }
    });
  },
  loadComments(){//监听界面加载初始评论列表
    const { cmtList} = this.data.cmtList;
    this.setData({
      cmtList: [],
      updatedCmtList:[],
    });
    wx.request({
      url: 'http://127.0.0.1:8080/api/comment',
      success: res => {
        const cmt = res.data.cmtList;
        
        this.setData({
          cmtList:cmt
        });
      },
    });
  },
})
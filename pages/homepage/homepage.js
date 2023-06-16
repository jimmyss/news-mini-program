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
		navbarTitleName: [
      { name: '头条', nameID: '201701', newsType: 'top' },
      { name: '军事', nameID: '201702', newsType: 'junshi' },
      { name: '体育', nameID: '201703', newsType: 'tiyu' },
      { name: '科技', nameID: '201704', newsType: 'keji' },
      { name: '财经', nameID: '201705', newsType: 'caijing' },
      { name: '社会', nameID: '201706', newsType: 'shehui' },
      { name: '时尚', nameID: '201707', newsType: 'shishang' },
      { name: '娱乐', nameID: '201708', newsType: 'yule' },
		],
		tapId:'',
		showColumnFlag:false,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
		duration: 1000,
		imgUrls:[
			{id:1, src:'/pages/homepage/images/new19.png'},
			{id:2, src:'/pages/homepage/images/new20.png'},
			{id:3, src:'/pages/homepage/images/new21.png'}
		],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
		this.loadNews();//调用loadNews函数加载新闻列表
		this.setData({
			tapId: this.data.navbarTitleName[0].nameID
		})
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

  expandAllColumns: function() {
		this.setData({
			showColumnFlag: !this.data.showColumnFlag
		})
	},
	
	navbarTitleClick:function(event){
		//选择栏目
		const index = event.currentTarget.dataset.index;
		const nameId = this.data.navbarTitleName[index].nameID;
		this.setData({
			tapId: nameId,
			showColumnFlag: false
		}, () => {
			// 在setData的回调函数中执行滚动逻辑
			this.scrollToCenter(index);
		});
	},
	
	scrollToCenter: function (index) {
		// 创建选择器查询对象
		const query = wx.createSelectorQuery();
		// 选择所有navbar-item元素
		query.selectAll('.navbar-item').boundingClientRect();
		query.exec((rects) => {
			// 获取目标栏目的位置信息
			const targetRect = rects[0][index];
			// 计算滚动距离
			const screenWidth = wx.getSystemInfoSync().windowWidth;
			const scrollLeft = Math.max(targetRect.left - (screenWidth - targetRect.width) / 2, 0);
	
			// 滚动到指定位置
			wx.pageScrollTo({
				scrollLeft: scrollLeft,
				duration: 300
			});
		});
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
    const picPath = news.picPath;
    const id = ((pageNum-1)*10+bios+index)%80
    console.log(id)
    // 调用后端接口发送新闻序号
    wx.request({
      url: 'http://127.0.0.1:3000/api/detail',
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      data: {
        id: id,
      },
      success: (res) => {
        const send=res.data;
        wx.navigateTo({
          url: '/pages/index/index?title=' +
               '&image=' + encodeURIComponent(picPath) +
               '&id=' + encodeURIComponent(id) 
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
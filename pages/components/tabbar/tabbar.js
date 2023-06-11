// pages/components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  // 核心功能代码
  properties: {
      idx:{
          type:Number
        }
  },
  /**
   * 组件的初始数据
   */
  data: {
    tabBar: [
      {
        "pagePath": "/pages/index/index",
        "text": "首页",
        "iconPath": "/pages/index/images/分享 2.png",
        "selectedIconPath": "/pages/index/images/分享 2.png",
        "selected":false
      }
    ]
  },
  observers: {
      // 核心功能代码 
      "idx": function (id) {
        var otabbar = this.data.tabBar;
        otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
        otabbar[id]['selected'] = true;
        console.log(this.data.tabBar)
        this.setData({ tabBar: otabbar});
      }

    },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateDetail: function (e) {
      wx.reLaunch({ // 关闭所有打开过的页面，跳转到相对于的页面
        url: e.currentTarget.dataset.url  // 获取tabbar.wxml中data-url传递的参数
      })
    }
  }
})

//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')


Page({
  data: {
    title: '-月-日',
    tag:'工作日',
    busline: [
      {
        start: '集悦城',
        destination:'科研楼',
        time:'00:00',
        status:'待发车',
        order:0
      }
    ],
    showTips:true
  },

  // 下拉刷新
  onPullDownRefresh(){
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

  // tap 换页，传入新页面 list_index
  bindViewTap: function(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.id.toString()
    })
  },

  onLoad: function () {
    this.getNow()
    
    setTimeout(function () {
      // C字母
      this.showTips = false
      this.setData({
        showTips:this.showTips
      })
      
      }.bind(this), 5000)
      


  },

  // 获取当前时间点班车信息
  getNow(callback){
    wx.request({
      // 工作日对应结果为 0, 休息日对应结果为 1, 节假日对应的结果为 2 
      // 小程序不支持 http 请求，这里用 ssl 代理节点转发。受免费节点限制，所以这里使用 GET 方法
      url: 'https://ssl.shanling.top/free/?url=' + encodeURIComponent('http://api.goseek.cn/Tools/holiday?date=') + util.formatTime(new Date()),
      /*
      data: {
        date: util.formatTime(new Date())  // POST 方法
      },*/
      success: res => {
        this.setData({
          title: util.title(res.data.data),
          busline: util.getStatus(res.data.data),
          tag: (res.data.data? "节假日":"工作日"),
          title: util.formatdate(new Date()),
        })
      },
      complete: () =>{
        callback && callback()
      }
      
    })
  }

})

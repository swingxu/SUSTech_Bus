const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year,month,day].map(formatNumber).join('')
}

// 获得中文日期
var formatdate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return (month.toString() + '月' + day.toString() + '日')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// date -> 分钟数
var countMin = date => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return hours * 60 + minutes
}

// 07:30 -> 分钟数
var _countMin = time => {
  return parseInt(time.split(':')[0] * 60) + parseInt(time.split(':')[1])
}

var title = res => {
  switch(res){
    case 0: return '工作日车表'; break
    case 1: return '周末车表'; break
    case 2: return '节假日车表'; break
  }
}

// 班车时间表
const timeTable=[
  {
    routine: "欣园:科研楼",
    workday: ["07:20", "07:25", "07:30", "07:35", "07:40","08:00", "08:10", "08:20", "08:30", "08:40","08:50", "09:00", "09:20", "09:40", "09:50","09:55", "10:00", "10:05", "10:20", "10:40", "11:00", "11:20", "11:40", "12:00", "12:10","12:20", "12:30", "12:40", "13:00", "13:20","13:30", "13:35", "13:40", "14:00", "14:20","14:40", "15:00", "15:20", "15:40", "15:50","15:55", "16:00", "16:05", "16:20", "16:40","17:00", "17:10", "17:20", "17:30", "17:40","17:50", "18:00", "18:20", "18:40", "19:00","19:30", "20:00", "20:30", "21:00"],
    vacation: ["07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","19:00","20:00","21:00"],
    busy: ["07:20","07:25","07:30","07:35","07:40","09:55","13:35","16:05"]
  },
  
  {
    routine: "科研楼:欣园",
    workday: ["07:40","07:50","08:00","08:10","08:20","08:30","08:40","08:50","09:00","09:20","09:40","09:55","10:00","10:05","10:10","10:20","10:40","11:00","11:20","11:40","12:00","12:10","12:20","12:30","12:40","13:00","13:20","13:40","14:00","14:20","14:40","15:00","15:20","15:40","15:50","15:55","16:00","16:05","16:20","16:40","17:00","17:10","17:20","17:30","17:40","17:50","18:00","18:10","18:20","18:30","18:40","19:00","19:30","20:20","21:20","22:00"],
    vacation:["07:50","08:20","08:50","09:20","09:50","10:20","10:50","11:20","11:50","12:20","12:50","13:20","13:50","14:20","14:50","15:20","15:50","16:20","16:50","17:20","17:50","18:20","19:20","20:20","21:20","21:50","22:00"],
    busy: null
  },
  {
    routine:"集悦城:慧园",
    workday: ["07:20","07:30","09:40","09:50","13:30"],
    vacation: null,
    busy: null
  },
  {
    routine:"荔园:集悦城",
    workday:["12:40","18:40","22:20"],
    vacation: null,
    busy: null
  }
  
]

// 获得班车状态
 var getStatus = vacation => {
   var now = countMin(new Date())
   var check = (vacation?'vacation':'workday')
   var busline = []
    for(var i = 0 ; i < timeTable.length ; i++){
      var temp = {}
      temp.start = timeTable[i].routine.split(':')[0]
      temp.destination = timeTable[i].routine.split(':')[1]
      
      temp.order = i
      if(check === 'vacation' && (i === 2 || i === 3)){
        temp.time = null
        temp.status = '无班车'
        busline.push(temp)
        continue
      }
      
      var std = 0
      var end = timeTable[i][check].length - 1
      var min = 1440
      // 折半查找当前时间点匹配的发车时间，返回最匹配的时间点
      while(std < end){
        var mid = parseInt((std+end)/2)
        if(_countMin(timeTable[i][check][mid])-now <= 0){
          // 班车已过
          std = mid+1
        } else {
          // 班车未到 找最近班次
          end = mid
        }
      }
      if(_countMin(timeTable[i][check][mid])-now <= 0 && _countMin(timeTable[i][check][mid+1])-now > 0 ){
        mid = mid+1;
      }
      if(_countMin(timeTable[i][check][mid])-now <= 0 ) {
        temp.time = null
        temp.status = '无班车'
      } else {
        temp.time = timeTable[i][check][mid]
        temp.status = '待发车'
        mid = mid-1
      }

      // 检查正在途中的车
      // console.log(_countMin(timeTable[i][check][mid])-now)

      
      while(mid >= 0 && _countMin(timeTable[i][check][mid])-now >= -20 && _countMin(timeTable[i][check][mid])-now<=0){
        var onRoad={}
        onRoad.start = timeTable[i].routine.split(':')[0]
        onRoad.destination = timeTable[i].routine.split(':')[1]
        onRoad.order = i
        onRoad.time = timeTable[i][check][mid]
        onRoad.status = '在途中'
        busline.push(onRoad)
        console.log(_countMin(timeTable[i][check][mid])-now)
        mid = mid-1

      }
      
      busline.push(temp)
      
    }
    return busline
 }

module.exports = {
  formatTime: formatTime,
  title: title,
  countMin:countMin,
  getStatus: getStatus,
  formatdate:formatdate
}

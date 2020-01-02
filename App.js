import React from 'react'
import './app.css'

// 提取连续范围
function getRange(selectedState) {
  let rangeResult = []
  let s = 0
  let e = 0

  for (let i = 0 ; i < selectedState.length; i ++) {
    e = i
    if (selectedState[s] != selectedState[e]) {
      if (selectedState[s] == 1) {
        // if (s == e-1) {
        //   rangeResult.push('' + s)
        // } else 
        {
          rangeResult.push(String(s).padStart(2, '0') + '-' + String(e-1).padStart(2, '0'))
        }
      }
      s = e
    }
  }

  if (e >= selectedState.length - 1) {
    if (selectedState[s] == 1) {
      // if (s == e-1) {
      //   rangeResult.push('' + s)
      // } else 
      {
        rangeResult.push(String(s).padStart(2, '0') + '-' + String(e).padStart(2, '0'))
      }
    }
  }

  // console.log(rangeResult)
  return rangeResult
}


class Timerange extends React.Component {

  constructor(props) {
    super(props)

    // 预设小时数据（全不选）
    let data = [
      { week:'星期日',value:0,hours: new Array(24).fill(0) },
      { week:'星期一',value:1,hours: new Array(24).fill(0) },
      { week:'星期二',value:2,hours: new Array(24).fill(0) },
      { week:'星期三',value:3,hours: new Array(24).fill(0) },
      { week:'星期四',value:4,hours: new Array(24).fill(0) },
      { week:'星期五',value:5,hours: new Array(24).fill(0) },
      { week:'星期六',value:6,hours: new Array(24).fill(0) } 
    ]

    // 叠加默认选中小时
    if (this.props.defaultSelectedHours) {
      for (let weekDay in this.props.defaultSelectedHours) {
        let hours = this.props.defaultSelectedHours[weekDay]
        weekDay = weekDay*1
        hours.forEach(hour => {
          data[weekDay]['hours'][hour] = 1
        })
      }
    }

    // console.log(JSON.stringify(data.map(item => item.hours)))

    this.state = {
      data,
      selectedRangeTips: this.getSelectedRangeTips(data),
      selectedHours: this.props.defaultSelectedHours || {},
    }
  }

  getSelectedRangeTips = (newData) => {
    let flags = newData.map(item => item.hours)
    let resultRanges = {}
    flags.forEach((rowFlags, index) => {
      let resultRange = getRange(rowFlags)
      if (resultRange.length > 0) {
        resultRanges[newData[index].week]=resultRange
      }
    })
    return resultRanges
  }

  getValue = (selectedWeekDay, selectedHour) => {
    let newSelectedHours = this.state.data.reduce((result, weekData, weekIndex) => {
      let weekDaySelectedHours = weekData.hours.reduce((weekDayHoursResult, hourState, hourIndex) => {
        // 当前点击的格子需要先处理一下
        if (selectedWeekDay === weekIndex && selectedHour === hourIndex) {
          hourState = Number(!weekData.hours[hourIndex])
        }
        if (hourState === 1) {
          weekDayHoursResult.push(hourIndex)
        }
        // console.log(weekDayHoursResult)
        return weekDayHoursResult
      }, [])
      if (weekDaySelectedHours.length > 0) {
        result[`${weekIndex}`] = weekDaySelectedHours
      }
      return result
    }, {})

    if (this.props.onSelect) {
      this.props.onSelect(newSelectedHours)
    }

    let newData = this.state.data.map((item, index) => {
      if (selectedWeekDay === index) {
        item.hours[selectedHour] = Number(!item.hours[selectedHour])
        return item
      }
      return item
    })

    console.log(newData)
    this.setState({data: newData, selectedRangeTips: this.getSelectedRangeTips(newData), selectedHours: newSelectedHours})
  }

  resetData = () => {
    let newData = this.state.data.map(item => {
      item.hours =  new Array(24).fill(0)
      return item
    })
    if (this.props.onSelect) {
      this.props.onSelect({})
    }
    this.setState({data: newData, selectedRangeTips:{}, selectedHours: {}})
  }

  render() {
    const hoursColLabel = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

    return    <div className='time_range_box'>
      <div className='container'> 
                  <div className='header_container'> <div className='week_hours'> 星期/时间</div> {hoursColLabel.map((label,i) => <span key={i} className='header'> {label}</span>)}</div>
                {this.state.data.map((item,index) => <div key={index} className='body_container'> <div className='week'>{item.week}</div> {item.hours.map((hour,i) => <span key={i} className={hour === 1 ? 'hightLight' : ''} onClick={() => this.getValue(item.value,i)} onm></span>)}</div>)}
              </div>
              <div className='select_time_range'> <span>已选时间段</span> <span onClick={this.resetData} className='tip_reset'>清空</span> </div>
                
                {Object.keys(this.state.selectedRangeTips).map((key, index) => (
                  <div className='tips_contanier' key={index}> <span>{key}：</span>&nbsp;{this.state.selectedRangeTips[key].join('、')}</div>)
                )}
              </div>
  }
}



const App = () => 
{
  // history selected data
  const defaultSelectedHours = {
    "1":[1],
    "5":[21,22,23],
  }

  const onSelect = (selectedHours) => {
    console.log(selectedHours)
  }

  return (
  <div>
    <Timerange defaultSelectedHours={defaultSelectedHours} onSelect={onSelect} />
  </div>
)
}

export default App

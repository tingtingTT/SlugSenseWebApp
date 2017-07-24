/**************************************************************************
** functions using ECharts implementation. Setting the default choice to day option. 
** upon clicking, the day or week option will be called.
** may be improved by reorganizing the code to decrease the duplication.
** All color code are using material design.
********************************************************************************/

import Echarts from 'echarts/lib/echarts'

// the function to be called upon clicking, using day data.
export function returnDefaultOpt(devData){
    return {
  backgroundColor: '#FFFFFF',
        title: {
            text: '',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#FFFFFF'
            },
            left: '6%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#424242'
                }
            }
        },
        legend: {
            // single makes no two graphs can be shown together
            selectedMode: 'single',
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 26,
            data: ['Humidity', 'Light', 'Temperature', 'Moisture'],
            right: '4%',
            textStyle: {
                fontSize: 24,
                color: '#000000'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            // in case of name x-axis
            name: '',
            position: 'bottom',
            nameTextStyle: {
            fontSize: 18,
            color: '#000000'
            },
            nameLocation: 'middle',
            // added to fit in the graph
            nameGap: 23, 
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            },
                // hour array for day option
                data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
                axisLabel: {
                margin: 10,
                textStyle: {
                fontSize: 14
                },
                formatter: function (value) {
                // Function formatter
                return value + 'h'
                }}}],
        yAxis: [
                {
                type: 'value',
                position: 'left', 
                // In case of changing y-axis label
                name: '',
                nameLocation: 'middle',
                nameGap: 50, 
                nameTextStyle: {
                    fontSize: 18,
                    color: '#000000'
                },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            },
            axisLabel: {
              // this changes where the y-axis line is at
                margin: 10,
                textStyle: {
                fontSize: 14
                },
                     formatter: function (value) {
                    // Function formatter
                    return value + ' °C'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            }
        },
                        
            {
            type: 'value',
            position: 'left',
            // in case of y-axis name change
            name: '',
                nameLocation: 'middle',
                nameGap: 23, 
                nameTextStyle: {
                fontSize: 18,
                color: '#000000'
                },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                fontSize: 14
                },
                     formatter: function (value) {
                    // Function formatter
                    return value + ' %'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            }
        }],
        series: [{
            name: 'Humidity',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(234, 128, 252, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(255, 255, 255, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(123, 31, 162)',
                    borderColor: 'rgba(205,220,137,0.27)',
                    borderWidth: 12

                }
            },
            data: devData['humidity']
        }, {
            name: 'Light',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(104, 159, 56, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(255, 255, 255, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(139, 195, 74)',
                    borderColor: 'rgba(0,229,255,0.2)',
                    borderWidth: 12

                }
            },
            data: devData['light']
        }, {
            name: 'Temperature',
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(240, 98, 146, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(255, 255, 255, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {

                    color: 'rgb(224, 67, 54)',
                    borderColor: 'rgba(240, 98, 146, 0.2)',
                    borderWidth: 12
                }
            },
            data: devData['temperature']
        }, {
            name: 'Moisture',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            areaStyle: {
                normal: {
                    color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0, 229, 255, 0.3)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(255, 255, 255, 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(30, 136, 229)',
                    borderColor: 'rgba(0, 229, 255, 0.2)',
                    borderWidth: 12

                }
            },
            data: devData['moisture']
        }]
}
}

// when user clicks on day
export const dayOpt = {
  backgroundColor: '#FFFFFF',
        title: {
            text: '',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#FFFFFF'
            },
            left: '6%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#424242'
                }
            }
        },
        legend: {
            selectedMode: 'single',
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 26,
            data: ['Humidity', 'Light', 'Temperature', 'Moisture'],
            right: '4%',
            textStyle: {
                fontSize: 24,
                color: '#000000'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            // in case of adding x-axis label
            name: '',
            position: 'bottom',
            nameTextStyle: {
                fontSize: 18,
                color: '#000000'
            },
            nameLocation: 'middle',
            // added
            nameGap: 23, 
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            },
            data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            },
            formatter: function (value) {
            // Function formatter
            return value + 'h'
            }}}]
}

// when user clicks on week option
export const weekOpt = {
 backgroundColor: '#FFFFFF',
        title: {
            text: '',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#FFFFFF'
            },
            left: '6%'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#424242'
                }
            }
        },
        legend: {
            // single makes no two graphs can be shown together
            selectedMode: 'single',
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 26,
            data: ['Humidity', 'Light', 'Temperature', 'Moisture'],
            right: '4%',
            textStyle: {
                fontSize: 24,
                color: '#000000'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            // in case of adding value
            name: '',
            position: 'bottom',
            nameTextStyle: {
            fontSize: 18,
            color: '#000000'
            },
            nameLocation: 'middle',
            // added
            nameGap: 23, 
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#BDBDBD'
                }
            },
                data: [1,2,3,4,5,6,7],
                axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                },
                formatter: function (value) {
                // Function formatter
                return 'day ' + value
                }}}]
}

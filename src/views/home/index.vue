<template>
  <div class="container">
    <a-row class="top-row" :gutter="[15, 15]">
      <a-col class="item-col" :xl="6">
        <div class="item">
          <div class="lt">
            <div class="title">今日访客<i class="iconfont iconnav_promoter" /></div>
            <div class="line">会员：<countTo :start-val="0" :end-val="data.memberCount" :duration="3000" /></div>
            <div class="line">散客：<countTo :start-val="0" :end-val="data.visitorCount" :duration="3000" /></div>
          </div>
          <div class="pie-wrap">
            <div id="visitor" class="pie" />
          </div>
        </div>
      </a-col>
      <a-col class="item-col" :xl="6">
        <div class="item">
          <div class="lt">
            <div class="title">今日营业额<i class="iconfont iconqian4" /></div>
            <div class="line">现金：<countTo :start-val="0" :end-val="data.cashIncome" :duration="3000" /></div>
            <div class="line">刷卡：<countTo :start-val="0" :end-val="data.cardIncome" :duration="3000" /></div>
          </div>
          <div class="pie-wrap">
            <div id="turnover" class="pie" />
          </div>
        </div>
      </a-col>
      <!-- <a-col class="item-col" :xl="6">
        <div class="item">
          <div class="lt">
            <div class="title">今日营业额<i class="iconfont iconqian4" /></div>
            <div class="line">现金：<countTo :start-val="0" :end-val="data.cashIncome" :duration="3000" /></div>
            <div class="line">刷卡：<countTo :start-val="0" :end-val="data.cardIncome" :duration="3000" /></div>
          </div>
          <div class="pie-wrap">
            <div id="turnover" class="pie" />
          </div>
        </div>
      </a-col>
      <a-col class="item-col" :xl="6">
        <div class="item">
          <div class="lt">
            <div class="title">今日营业额<i class="iconfont iconqian4" /></div>
            <div class="line">现金：<countTo :start-val="0" :end-val="data.cashIncome" :duration="3000" /></div>
            <div class="line">刷卡：<countTo :start-val="0" :end-val="data.cardIncome" :duration="3000" /></div>
          </div>
          <div class="pie-wrap">
            <div id="turnover" class="pie" />
          </div>
        </div>
      </a-col> -->
    </a-row>
    <div id="myChart" class="myChart" />
  </div>
</template>
<script>
import countTo from 'vue-count-to'
export default {
  components: { countTo },
  data() {
    return {
      data: {
        memberCount: 6,
        visitorCount: 8,
        cashIncome: 3680,
        cardIncome: 19800
      }
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    // 初始化图表
    initEcharts() {
      const echartsOption = this.echartsOption()
      // 柱形图表
      const myChartNode = document.querySelector('#myChart')
      const myChart = this.$echarts.init(myChartNode)
      myChart.setOption(echartsOption['columnar'])

      // 访客图表
      const visitorNode = document.querySelector('#visitor')
      const visitorInit = this.$echarts.init(visitorNode)
      visitorInit.setOption(echartsOption['visitor'])
    },
    echartsOption() {
      return {
        columnar: {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        },
        visitor: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['60%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '12'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 1048, name: '会员' },
                { value: 735, name: '散客' }
              ]
            }
          ]
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.top-row{
  margin-bottom: 1px !important;
  .item{
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-radius: 6px;
    background-color: #fff;
    color: #333;
    .title{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      i{
        font-size: 18px;
        font-weight: normal;
        margin-left: 10px;
      }
    }
    .pie{
      width: 200px;
      height: 120px;
    }
  }
  .item-col:nth-child(1){
    .item{
     border: 1px solid #ff3e46;
    }
  }
  .item-col:nth-child(2){
    .item{
     border: 1px solid #9b5af4;
    }
  }
  .item-col:nth-child(3){
    .item{
     border: 1px solid #59cf71;
    }
  }
  .item-col:nth-child(4){
    .item{
     border: 1px solid #0a8ff4;
    }
  }
}
#myChart{
  width: 100%;
  height: 300px;
  border: 1px solid red;
}
</style>

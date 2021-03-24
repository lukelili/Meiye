<template>
  <div class="wrap">
    <div class="title">{{ title }}</div>
  </div>
</template>
<script>
export default {
  name: 'Vtitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="less" scoped>
  .wrap{
    padding: 10px;
    background-color: #fff;
    .title{
      font-size: 18px;
      line-height: 24px;
      padding-left: 10px;
      position: relative;
      &::after{
        content: '';
        width: 3px;
        height: 18px;
        position: absolute;
        left: 0;
        top: 3px;
        background-color: #1890ff;
      }
    }
  }
</style>

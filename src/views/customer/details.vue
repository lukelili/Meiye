<template>
  <div class="container">
    <v-title title="基本信息" />
    <a-tabs>
      <a-tab-pane key="1" tab="消费记录">
        <vTavle :table-option="tableOption" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="修改记录">
        Content of tab 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import vTavle from '@c/vTable'
import vTitle from '@c/vTitle/'
export default {
  components: { vTitle, vTavle },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableOption: {
        columns: [
          { title: '项目', dataIndex: 'product' },
          { title: '服务技师', dataIndex: 'staff' },
          { title: '原价', dataIndex: 'orig', columnType: 'slot', slotName: 'price', color: '#666' },
          { title: '实际消费', dataIndex: 'sale', columnType: 'slot', slotName: 'price', color: 'red', before: '-' },
          { title: '余额', dataIndex: 'balance', columnType: 'slot', slotName: 'price', color: '#07c160' },
          { title: '日期', columnType: 'slot', slotName: '_date' },
          { title: '备注', dataIndex: 'remarks' }
        ],
        data: []
      }
    }
  },
  mounted() {
    this.getLabels()
  },
  methods: {
    async getLabels() {
      const result = await this.$http.get(`/member/list?_id=${this.id}`)
      this.tableOption.data = result.data.data[0].records
      console.log(result)
    }
  }
}
</script>

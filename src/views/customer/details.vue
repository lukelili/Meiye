<template>
  <div class="container">
    <title-line title="基本信息" />
    <a-tabs>
      <a-tab-pane key="1" tab="消费记录">
        <a-table bordered :columns="columns" :data-source="data" row-key="_id">
          <span slot="create_time" slot-scope="{ create_time }">
            {{ $dateformat(create_time, 'isoDate') }}
          </span>
          <span slot="orig" slot-scope="orig" style="color: #ccc">
            {{ orig | decimal2 }}
          </span>
          <span slot="sale" slot-scope="sale" style="color:red">
            -{{ sale | decimal2 }}
          </span>
          <span slot="balance" slot-scope="balance" style="color: green">
            {{ balance | decimal2 }}
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="修改记录">
        Content of tab 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import titleLine from '@c/titleLine/'
import filters from '@/mixins/filter'
export default {
  components: { titleLine },
  mixins: [filters],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [
        { title: '项目', dataIndex: 'product' },
        { title: '服务技师', dataIndex: 'staff' },
        { title: '原价', dataIndex: 'orig', scopedSlots: { customRender: 'orig' }},
        { title: '折后', dataIndex: 'sale', scopedSlots: { customRender: 'sale' }},
        { title: '余额', dataIndex: 'balance', scopedSlots: { customRender: 'balance' }},
        { title: '日期', scopedSlots: { customRender: 'create_time' }},
        { title: '备注', dataIndex: 'remarks' }
      ],
      data: []
    }
  },
  mounted() {
    this.getLabels()
  },
  methods: {
    async getLabels() {
      const result = await this.$http.get(`/member/list?_id=${this.id}`)
      this.data = result.data.data[0].records
      console.log(result)
    }
  }
}
</script>

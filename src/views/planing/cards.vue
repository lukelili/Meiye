<template>
  <div class="container">
    <div class="search">
      <a-form layout="inline" @submit="handleSearch">
        <a-form-item label="名称">
          <a-input v-model="form.name" placeholder="查询姓名" />
        </a-form-item>
        <a-form-item label="售价">
          <a-input v-model="form.phone" placeholder="查询电话" />
        </a-form-item>
        <a-form-item>
          <a-button type="default" icon="redo" class="mr-16" html-type="reset">重置</a-button>
          <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="my-table">
      <div class="table-operation">
        <a-button type="primary" @click="handleShowDialog()">新增活动</a-button>
      </div>
      <a-table bordered :columns="columns" :data-source="data" row-key="_id">
        <span slot="operation" slot-scope="item" class="operation-btns">
          <a @click="handleShowDialog(item)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDeletes(item)">删除</a>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-form-model ref="modelForm" layout="horizontal" hide-required-mark :model="modelForm" :rules="rulesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="活动名称" prop="name">
          <a-input v-model="modelForm.name" placeholder="填写活动名称" />
        </a-form-model-item>
        <a-form-model-item label="活动售价" prop="price">
          <a-input v-model="modelForm.price" prefix="￥" suffix="RMB" placeholder="填写活动售价" />
        </a-form-model-item>
        <a-form-model-item label="可用次数" prop="count">
          <a-input v-model="modelForm.count" placeholder="填写活动可用次数" />
        </a-form-model-item>
        <a-form-model-item label="活动限额" prop="quota">
          <a-input v-model="modelForm.quota" placeholder="填写活动限额" />
        </a-form-model-item>
        <a-form-model-item label="活动介绍" prop="desc">
          <a-input v-model="modelForm.desc" type="textarea" placeholder="填写活动介绍" />
        </a-form-model-item>
        <a-form-model-item label="活动时间">
          <a-radio-group v-model="modelForm.isDate">
            <a-radio value="infinite">不限时间</a-radio>
            <a-radio value="limited">限制时间</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="modelForm.isDate === 'limited'" label="时间范围" prop="date">
          <a-range-picker v-model="modelForm.date" @change="handleRangeDate" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 搜索
      form: {
        name: '',
        phone: '',
        cardId: ''
      },
      // 表格
      columns: [
        {
          title: '活动名称',
          dataIndex: 'name'
        },
        {
          title: '活动售价',
          dataIndex: 'price'
        },
        {
          title: '可用次数',
          dataIndex: 'count'
        },
        {
          title: '活动限额',
          dataIndex: 'quota'
        },
        {
          title: '活动介绍',
          dataIndex: 'desc'
        },
        {
          title: '活动有效期',
          dataIndex: 'term'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      // 弹窗
      visible: false,
      title: '新增活动',
      confirmLoading: false,
      modelForm: {
        name: '',
        price: '',
        count: '',
        quota: '',
        desc: '',
        isDate: 'infinite',
        date: ''
      },
      rulesForm: {
        name: [
          { required: true, message: '请填写活动名称' }
        ],
        price: [
          { required: true, message: '请填写活动售价' }
        ],
        count: [
          { required: true, message: '请填写可用次数' }
        ],
        quota: [
          { required: true, message: '请填写活动限额' }
        ],
        desc: [
          { required: true, message: '请填写活动介绍' }
        ],
        date: [
          { required: true, message: '请填写活动时间' }
        ]
      }
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      const result = await this.$http.get('/planing/list')
      const { data } = result.data
      this.data = data
    },
    // 显示弹窗
    handleShowDialog(item) {
      // 新增
      if (item) {
        this.title = '编辑活动'
      } else { // 编辑
        this.title = '新增活动'
      }
      this.visible = true
    },
    // 弹窗确认
    handleConfirm() {
      this.$refs.modelForm.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post('/planing/insert', this.modelForm)
        if (!result) return
        this.visible = false
        this.getTableList()
      })
    },
    // 删除
    async handleDeletes(item) {
      console.log(item)
      const result = await this.$http.post('/planing/delete', { _id: item._id })
      if (!result) return
      this.visible = false
      this.getTableList()
    },
    handleCancel() {
      this.visible = false
    },
    handleRangeDate() {},
    handleSearch() {
      console.log(this.form)
    }
  }
}
</script>
<style lang="less" scoped>
.search{
  padding: 10px;
  margin-bottom: 1px;
  background-color: #fff;
}
.my-table{
  padding: 10px;
  background-color: #fff;
  .table-operation{
    text-align: right;
    margin-bottom: 10px;
  }
  .operation-btns .ant-btn:not(:last-child){
    margin-right: 10px;
  }
}
</style>

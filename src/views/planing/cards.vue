<template>
  <div class="container">
    <div class="search">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="活动名称" prop="name">
          <a-input v-model="searchForm.name" placeholder="查询活动名称" />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="default" icon="redo" class="mr-16" @click="handleReset">重置</a-button>
          <a-button type="primary" icon="search" @click="handleSearch">搜索</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="my-table">
      <div class="table-operation">
        <a-button type="primary" @click="handleShowDialog()">新增活动</a-button>
      </div>
      <a-table bordered :columns="columns" :data-source="data" :loading="tableLoading" row-key="_id">
        <span slot="isDate" slot-scope="item">
          {{ item.isDate === 'infinite' ? '不限时间' : item.date }}
        </span>
        <span slot="isEnable" slot-scope="{ isEnable }">
          <a-tag :color="isEnable ? 'green' : 'red'">{{ isEnable ? '已启用' : '已禁用' }}</a-tag>
        </span>
        <span slot="price" slot-scope="{ price }">
          {{ price | decimal2 }}
        </span>
        <span slot="create_time" slot-scope="{ create_time }">
          {{ $dateformat(create_time, 'isoDate') }}
        </span>
        <span slot="operation" slot-scope="item" class="operation-btns">
          <a @click="handleShowDialog(item)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDeletes(item)">删除</a>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="isEdit ? '编辑活动' : '新增活动'"
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
          <a-radio-group v-model="modelForm.isDate" prop="isDate">
            <a-radio value="infinite">不限时间</a-radio>
            <a-radio value="limited">限制时间</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-radio-group v-model="modelForm.isEnable" prop="isEnable">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
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
import filters from '@/mixins/filter'
export default {
  mixins: [filters],
  data() {
    return {
      // 搜索
      searchForm: {
        name: ''
      },
      // 表格
      columns: [
        {
          title: '活动名称',
          dataIndex: 'name'
        },
        {
          title: '活动售价',
          scopedSlots: { customRender: 'price' }
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
          title: '活动时间',
          scopedSlots: { customRender: 'isDate' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'isEnable' }
        },
        {
          title: '创建时间',
          scopedSlots: { customRender: 'create_time' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      tableLoading: false,
      // 弹窗
      visible: false,
      isEdit: 1,
      confirmLoading: false,
      modelForm: {
        name: '',
        price: '',
        count: '',
        quota: '',
        desc: '',
        isDate: 'infinite',
        date: '',
        isEnable: 1
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
    // 搜索
    handleSearch() {
      this.getTableList()
    },
    handleReset() {
      this.$refs.searchForm.resetFields()
      this.getTableList()
    },
    async getTableList() {
      this.tableLoading = true
      const result = await this.$http.get(`/planing/list?${this.$qs.stringify(this.searchForm)}`)
      this.tableLoading = false
      const { data } = result.data
      this.data = data
    },
    // 显示弹窗
    handleShowDialog(item) {
      if (item) {
        this.isEdit = 1
        this.$nextTick(() => {
          this.modelForm = Object.assign({}, this.modelForm, item)
        })
      } else {
        this.isEdit = 0
      }
      this.visible = true
    },
    // 弹窗确认
    handleConfirm() {
      this.$refs.modelForm.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post(`/planing/${this.isEdit ? 'update' : 'insert'}`, this.modelForm)
        if (!result) return
        this.visible = false
        this.getTableList()
      })
    },
    // 删除
    handleDeletes(item) {
      this.$confirm({
        title: '警告',
        content: h => <div>你确定要删除<span style='color:red; font-weight: bold'> { item.name } </span>吗?</div>,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const result = await this.$http.post('/planing/delete', { _id: item._id })
          if (!result) return
          this.visible = false
          this.getTableList()
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    // 取消/关闭弹窗
    handleCancel() {
      this.visible = false
      this.$refs.modelForm.resetFields()
    },
    handleRangeDate() {}
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

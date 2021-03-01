<template>
  <div class="container">
    <div class="search">
      <a-form-model ref="searchForm" :model="searchForm" layout="inline">
        <a-form-model-item label="标签名称" prop="name">
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
        <a-button type="primary" @click="handleShowDialog()">配置折扣</a-button>
      </div>
      <a-table bordered :columns="columns" :data-source="data" :loading="tableLoading" row-key="_id">
        <span slot="discount" slot-scope="{ discount }">
          {{ discount }} 折
        </span>
        <span slot="price" slot-scope="{ price }">
          <span style="color:#52c41a">￥{{ price }}</span> 元
        </span>
        <span slot="isEnable" slot-scope="{ isEnable }">
          <a-tag :color="isEnable ? 'green' : 'red'">{{ isEnable ? '已启用' : '已禁用' }}</a-tag>
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
      :title="isEdit ? '编辑折扣' : '配置折扣'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-form-model ref="modelForm" layout="horizontal" hide-required-mark :model="modelForm" :rules="rulesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="折扣" prop="discount">
          <a-input v-model="modelForm.discount" placeholder="填写折扣" />
        </a-form-model-item>
        <a-form-model-item label="金额" prop="price">
          <a-input v-model="modelForm.price" prefix="￥" suffix="RMB" placeholder="填写金额" />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="isEnable">
          <a-radio-group v-model="modelForm.isEnable">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
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
      searchForm: {
        name: ''
      },
      // 表格
      columns: [
        {
          title: '折扣',
          scopedSlots: { customRender: 'discount' }
        },
        {
          title: '金额',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'isEnable' }
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
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
        discount: '',
        price: '',
        isEnable: 1
      },
      rulesForm: {
        discount: [
          { required: true, message: '请填折扣' }
        ],
        price: [
          { required: true, message: '请填写充值金额' }
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
      const result = await this.$http.get(`/discount/list?${this.$qs.stringify(this.searchForm)}`)
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
        const result = await this.$http.post(`/discount/${this.isEdit ? 'update' : 'insert'}`, this.modelForm)
        if (!result) return
        this.visible = false
        this.getTableList()
      })
    },
    // 删除
    handleDeletes(item) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: h => <div>你确定要删除<span style='color:red; font-weight: bold'> { item.name } </span>吗?</div>,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const result = await _this.$http.post('/discount/delete', { _id: item._id })
          if (!result) return
          _this.visible = false
          _this.getTableList()
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

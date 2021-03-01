<template>
  <div class="container">
    <div class="search">
      <a-form layout="inline" @submit="handleSearch">
        <a-form-item label="姓名">
          <a-input v-model="form.name" placeholder="查询姓名" />
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model="form.phone" placeholder="查询电话" />
        </a-form-item>
        <a-form-item label="卡号">
          <a-input v-model="form.cardId" placeholder="查询卡号" />
        </a-form-item>
        <a-form-item>
          <a-button type="default" icon="redo" class="mr-16" html-type="reset">重置</a-button>
          <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="my-table">
      <div class="table-operation">
        <a-button type="primary" @click="handleShowDialog()">录入会员</a-button>
      </div>
      <a-table bordered :columns="columns" :data-source="data" row-key="_id">
        <span slot="gender" slot-scope="{ gender }" :style="{ color: gender === 'woman' ? '#eb2f96' : '#eb2f96' }">
          <a-icon :type="gender ? 'woman' : 'man'" />
          {{ gender === 'woman' ? '美女' : '帅哥' }}
        </span>
        <span slot="operation" slot-scope="item" class="operation-btns">
          <a>详情</a>
          <a-divider type="vertical" />
          <a>划卡</a>
          <a-divider type="vertical" />
          <a>充值</a>
          <a-divider type="vertical" />
          <a @click="handleShowDialog(item)">编辑</a>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="isEdit ? '编辑会员' : '录入会员'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-form-model ref="modelForm" layout="horizontal" hide-required-mark :model="modelForm" :rules="rulesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="卡号" prop="cardId">
          <a-input-search v-model="modelForm.cardId" placeholder="填写卡号" @search="handleAutoCardId">
            <a-button slot="enterButton">
              自动生成卡号
            </a-button>
          </a-input-search>
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="modelForm.name" placeholder="填写姓名" />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="gender">
          <a-radio-group v-model="modelForm.gender">
            <a-radio value="woman">女</a-radio>
            <a-radio value="male">男</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="phone">
          <a-input v-model="modelForm.phone" placeholder="填写手机号" />
        </a-form-model-item>
        <a-form-model-item label="生日">
          <a-date-picker
            v-model="modelForm.birthday"
            type="date"
            placeholder="填写生日"
            value-format="YYYY.MM.DD"
          />
        </a-form-model-item>
        <a-form-model-item label="折扣">
          <a-select v-model="modelForm.discount" option-label-prop="label" placeholder="选择折扣" @change="handleDiscountChange">
            <span slot="suffixIcon">折</span>
            <a-select-option v-for="item in discounts" :key="item.discount" :value="item._id" :label="item.discount">
              <div class="select-item">
                <span class="discount">{{ item.discount }}折</span>
                <span class="price">{{ item.price }}元</span>
              </div>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="实付金额" prop="payment">
          <a-input v-model="modelForm.payment" prefix="￥" suffix="RMB" placeholder="填写实付金额" />
        </a-form-model-item>
        <a-form-model-item label="标签" prop="labels">
          <a-select v-model="modelForm.labels" mode="multiple" placeholder="选择标签">
            <a-select-option v-for="item in labels" :key="item._id" :value="item._id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="活动套装" prop="labels">
          <a-select v-model="modelForm.planings" mode="multiple" placeholder="添加活动套装">
            <a-select-option v-for="item in planings" :key="item._id" :value="item._id">
              <div class="select-item">
                <span class="discount">{{ item.name }}</span>
                <span class="price">{{ item.count }}次</span>
              </div>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark">
          <a-input v-model="modelForm.remark" type="textarea" placeholder="填写备注信息" />
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
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '性别',
          scopedSlots: { customRender: 'gender' }
        },
        {
          title: '生日',
          dataIndex: 'birthday'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '折扣',
          dataIndex: 'distcount'
        },
        {
          title: '最后消费',
          dataIndex: 'lastConsume'
        },
        {
          title: '账户余额',
          dataIndex: 'balance'
        },
        {
          title: '套卡',
          dataIndex: 'cards'
        },
        {
          title: '标签',
          dataIndex: 'labels'
        },
        {
          title: '入会时间',
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      // 弹窗
      isEdit: 1,
      visible: false,
      confirmLoading: false,
      planings: [],
      discounts: [],
      labels: [],
      modelForm: {
        cardId: '',
        name: '',
        gender: 'woman',
        phone: '',
        birthday: '',
        discount: undefined,
        payment: '',
        labels: [],
        planing: [],
        remark: ''
      },
      rulesForm: {
        cardId: { required: true, message: '请填写卡号' },
        name: { required: true, message: '请填写姓名' },
        phone: { required: true, message: '请填写手机号' },
        discount: { required: true, message: '请选择折扣' }
      }
    }
  },
  mounted() {
    // 折扣列表
    this.getDiscounts()
    // 标签列表
    this.getLabels()
    // 活动套装列表
    this.getPanlings()
    // 获取会员列表
    this.getTableList()
  },
  methods: {
    async getLabels() {
      const result = await this.$http.get('/label/list')
      this.labels = result.data.data
    },
    async getDiscounts() {
      const result = await this.$http.get('/discount/list')
      this.discounts = result.data.data
    },
    async getPanlings() {
      const result = await this.$http.get('/planing/list')
      this.planings = result.data.data
    },
    async getTableList() {
      const result = await this.$http.get('/member/list')
      this.data = result.data.data
    },
    handleSearch() {
      console.log(this.form)
    },
    handleDiscountChange(value) {
      const itemDis = this.discounts.filter(item => item._id === value)
      this.modelForm.payment = itemDis[0].price
      console.log(itemDis)
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
    // 确认
    handleConfirm() {
      this.$refs.modelForm.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post(`/member/${this.isEdit ? 'update' : 'insert'}`, this.modelForm)
        if (!result) return
        this.visible = false
        this.getTableList()
      })
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    // 自动生成卡号
    handleAutoCardId() {

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

.select-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .price{
    color: #999;
  }
}
</style>

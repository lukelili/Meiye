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
      <vTable :table-option="tableOption" />
      <!-- <a-table bordered :columns="columns" :data-source="data" row-key="_id">
        <span slot="gender" slot-scope="{ gender }">
          {{ gender === 'woman' ? '女' : '男' }}
        </span>
        <span slot="distcount" slot-scope="{ discount }">
          {{ discount.discount }} 折
        </span>
        <span slot="labels" slot-scope="{ labels }">
          <a-tag v-for="item in labels" :key="item.name" color="blue">
            {{ item.name }}
          </a-tag>
        </span>
        <span slot="payment" slot-scope="{ payment }">
          {{ payment | decimal2 }}
        </span>
        <span slot="planing" slot-scope="{ planing }">
          <span v-if="planing.length">
            {{ planing }}
          </span>
          <span v-else>暂无</span>
        </span>
        <span slot="create_time" slot-scope="{ create_time }">
          {{ $dateformat(create_time, 'isoDate') }}
        </span>
        <span slot="operation" slot-scope="item" class="operation-btns">
          <a @click="handleJumpDetails(item)">详情</a>
          <a-divider type="vertical" />
          <a @click="handleShowSwiping(item)">划卡</a>
          <a-divider type="vertical" />
          <a>充值</a>
          <a-divider type="vertical" />
          <a @click="handleShowDialog(item)">编辑</a>
        </span>
      </a-table> -->
    </div>
    <!-- 销卡 -->
    <a-modal title="销卡" :visible="cardVisible" :confirm-loading="cardLoading" @ok="handleCardConfirm" @cancel="handleCardCancel">
      <a-form-model ref="modelForm" layout="horizontal" hide-required-mark :model="cardForm" :rules="cardRulesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="会员折扣" prop="discount">
          {{ cardForm.discount.discount }} 折
        </a-form-model-item>
        <a-form-model-item label="消费金额" prop="orig">
          <a-input v-model="cardForm.orig" placeholder="填写消费金额" :suffix="`折后金额：${ cardForm.sale }`" />
        </a-form-model-item>
        <a-form-model-item label="消费项目" prop="product">
          <a-input v-model="cardForm.product" placeholder="填写消费项目" />
        </a-form-model-item>
        <a-form-model-item label="服务技师" prop="staff">
          <a-select v-model="cardForm.staff" option-label-prop="label" placeholder="选择服务技师">
            <a-select-option v-for="item in staffs" :key="item._id" :value="item.name" :label="item.name">
              <div class="select-item">
                <span class="discount">{{ item.name }}</span>
                <span class="price">{{ item.level }}技师</span>
              </div>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remarks">
          <a-input v-model="cardForm.remarks" type="textarea" placeholder="填写备注信息" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- 录入会员/编辑会员 -->
    <a-modal :title="isEdit ? '编辑会员' : '录入会员'" :visible="visible" :confirm-loading="confirmLoading" @ok="handleConfirm" @cancel="handleCancel">
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
import filters from '@/mixins/filter'
import vTable from '@c/vTable'
export default {
  components: { vTable },
  mixins: [filters],
  data() {
    return {
      // 搜索
      form: {
        name: '',
        phone: '',
        cardId: ''
      },
      // 表格
      tableOption: {
        columns: [
          {
            title: '卡号',
            dataIndex: 'cardId'
          },
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
            scopedSlots: { customRender: 'distcount' }
          },
          {
            title: '最后消费',
            dataIndex: 'lastConsume'
          },
          {
            title: '账户余额',
            scopedSlots: { customRender: 'payment' }
          },
          {
            title: '套卡',
            scopedSlots: { customRender: 'planing' }
          },
          {
            title: '标签',
            scopedSlots: { customRender: 'tag' },
            slots: {
              color: 'blue'
            }
          },
          {
            title: '备注',
            dataIndex: 'remark'
          },
          {
            title: '入会时间',
            scopedSlots: { customRender: 'create_time' }
          },
          {
            title: '操作',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        data: [],
        loading: false
      },
      // 弹窗
      isEdit: 1,
      visible: false,
      confirmLoading: false,
      planings: [],
      discounts: [],
      staffs: [],
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
      },
      // 销卡弹窗
      cardVisible: false,
      cardLoading: false,
      cardForm: {
        memberId: '',
        discount: '',
        orig: '',
        sale: '',
        product: '',
        staff: undefined,
        remarks: ''
      },
      cardRulesForm: {}
    }
  },
  watch: {
    'cardForm.orig'(num) {
      this.cardForm.sale = (num * this.cardForm.discount.discount / 10).toFixed(2)
    }
  },
  mounted() {
    // 折扣列表
    this.getDiscounts()
    // 标签列表
    this.getLabels()
    // 活动套装列表
    this.getPanlings()
    // 获取员工列表
    this.getStaffs()
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
    async getStaffs() {
      const result = await this.$http.get('/staff/list')
      this.staffs = result.data.data
    },
    async getTableList() {
      const tableOption = this.tableOption
      tableOption.loading = true
      const result = await this.$http.get('/member/list')
      tableOption.loading = false
      tableOption.data = result.data.data
    },
    handleSearch() {
      console.log(this.getTableList())
    },
    handleJumpDetails(item) {
      this.$router.push({ path: `/details/${item._id}` })
    },
    // ---------------------------------------- 会员编辑/录入会员 ----------------------------------------
    // 显示弹窗
    handleShowDialog(item) {
      if (item) {
        this.isEdit = 1
        this.$nextTick(() => {
          this.modelForm = Object.assign({}, this.modelForm, item)
          this.modelForm.labels = item.labels.map(item => item._id)
          this.modelForm.discount = item.discount._id
        })
      } else {
        this.isEdit = 0
      }
      this.visible = true
    },
    // 自动生成卡号
    handleAutoCardId() {},
    // 折扣选择
    handleDiscountChange(value) {
      const itemDis = this.discounts.filter(item => item._id === value)
      this.modelForm.payment = itemDis[0].price
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
    // ---------------------------------------- 销卡 ----------------------------------------
    // 显示销卡弹窗
    handleShowSwiping(item) {
      this.cardVisible = true
      this.cardForm.memberId = item._id
      this.cardForm.discount = item.discount
    },
    // 确认
    handleCardConfirm() {
      this.$refs.modelForm.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post(`/member/cards`, this.cardForm)
        if (!result) return
        this.cardVisible = false
        this.getTableList()
      })
    },
    // 取消
    handleCardCancel() {
      this.cardVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.search{
  margin-bottom: 1px;
}
.my-table{
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

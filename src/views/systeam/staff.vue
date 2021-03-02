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
        <a-button type="primary" @click="handleShowDialog()">员工录入</a-button>
      </div>
      <a-table bordered :columns="columns" :data-source="data" :loading="tableLoading" row-key="_id">
        <span slot="gender" slot-scope="{ gender }">
          {{ gender === 'woman' ? '女' : '男' }}
        </span>
        <span slot="skill" slot-scope="{ skill }">
          <a-tag v-for="item in skill" :key="item.name" color="blue">
            {{ item }}
          </a-tag>
        </span>
        <span slot="province" slot-scope="{ province }">
          {{ transCity(province) }}
        </span>
        <span slot="working_years" slot-scope="item">
          {{ item.working_years }} {{ item.isYears }}
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
      :title="isEdit ? '编辑员工信息' : '录入员工信息'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-form-model ref="modelForm" layout="horizontal" hide-required-mark :model="modelForm" :rules="rulesForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="modelForm.name" placeholder="填写员工姓名" />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="gender">
          <a-radio-group v-model="modelForm.gender">
            <a-radio value="woman">女</a-radio>
            <a-radio value="man">男</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="职业" prop="job">
          <a-select v-model="modelForm.job" option-label-prop="value" placeholder="选择职业">
            <a-select-option value="美甲师">美甲师</a-select-option>
            <a-select-option value="美睫师">美睫师</a-select-option>
            <a-select-option value="美容师">美容师</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="级别" prop="level">
          <a-select v-model="modelForm.level" option-label-prop="value" placeholder="选择级别">
            <a-select-option value="初级">初级</a-select-option>
            <a-select-option value="中级">中级</a-select-option>
            <a-select-option value="高级">高级</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="擅长技能" prop="skill">
          <a-select v-model="modelForm.skill" mode="multiple" option-label-prop="value" placeholder="选择职业技能">
            <a-select-option value="水晶甲">水晶甲</a-select-option>
            <a-select-option value="彩绘">彩绘</a-select-option>
            <a-select-option value="光疗">光疗</a-select-option>
            <a-select-option value="手部护理">手部护理</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="生日" prop="birthday">
          <a-date-picker
            v-model="modelForm.birthday"
            type="date"
            placeholder="填写生日"
            value-format="YYYY.MM.DD"
          />
        </a-form-model-item>
        <a-form-model-item label="手机号码" prop="phone">
          <a-input v-model="modelForm.phone" placeholder="填写手机号码" />
        </a-form-model-item>
        <a-form-model-item label="工作年限" prop="working_years">
          <a-input v-model="modelForm.working_years" placeholder="填写工作年限">
            <a-select slot="addonAfter" v-model="modelForm.isYears" default-value="年" style="width: 60px">
              <a-select-option value="年">年</a-select-option>
              <a-select-option value="月">月</a-select-option>
            </a-select>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="紧急联系人" prop="concat">
          <a-input v-model="modelForm.concat" placeholder="填写活动限额">
            <a-select slot="addonAfter" v-model="modelForm.relationship" default-value="父母" style="width: 80px">
              <a-select-option v-for="item in concats" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="籍贯" prop="province">
          <a-cascader v-model="modelForm.province" :options="provinces" placeholder="请选择籍贯" />
        </a-form-model-item>
        <a-form-model-item label="身份证号" prop="idCard">
          <a-input v-model="modelForm.idCard" placeholder="填写身份证号" />
        </a-form-model-item>
        <a-form-model-item v-if="modelForm.isDate === 'limited'" label="时间范围" prop="date">
          <a-range-picker v-model="modelForm.date" @change="handleRangeDate" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { citys } from '@/assets/citys'
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
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '性别',
          scopedSlots: { customRender: 'gender' }
        },
        {
          title: '职业',
          dataIndex: 'job'
        },
        {
          title: '级别',
          dataIndex: 'level'
        },
        {
          title: '职业技能',
          scopedSlots: { customRender: 'skill' }
        },
        {
          title: '工作年限',
          scopedSlots: { customRender: 'working_years' }
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '生日',
          dataIndex: 'birthday'
        },
        {
          title: '籍贯',
          scopedSlots: { customRender: 'province' }
        },
        {
          title: '身份证',
          dataIndex: 'idCard'
        },
        {
          title: '紧急联系人',
          dataIndex: 'concat'
        },
        {
          title: '入职时间',
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
      concats: ['配偶', '父母', '兄弟', '姐妹', '同事', '同学'],
      provinces: citys,
      modelForm: {
        name: '',
        gender: 'woman',
        job: undefined,
        level: undefined,
        skill: [],
        birthday: '',
        phone: '',
        province: [],
        concat: '',
        relationship: '父母',
        working_years: '',
        isYears: '年',
        idCard: ''
      },
      rulesForm: {
        name: [
          { required: true, message: '请填写员工姓名' }
        ],
        phone: [
          { required: true, message: '请填写员工手机号' }
        ],
        concat: [
          { required: true, message: '请填写紧急联系人' }
        ],
        working_years: [
          { required: true, message: '请填写工作年限' }
        ],
        province: [
          { required: true, message: '请填写籍贯' }
        ],
        idCard: [
          { required: true, message: '请填写身份证号' }
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
      const result = await this.$http.get(`/staff/list?${this.$qs.stringify(this.searchForm)}`)
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
        const result = await this.$http.post(`/staff/${this.isEdit ? 'update' : 'insert'}`, this.modelForm)
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
          const result = await this.$http.post('/staff/delete', { _id: item._id })
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
    handleRangeDate() {},
    transCity(nums) {
      const province = citys.filter(item => item.value === nums[0])
      let str = ''
      if (nums.length >= 2) {
        const city = province[0].children.filter(item => item.value === nums[1])
        str += nums[2] && city[0].children.filter(item => item.value === nums[2])[0].label + ','
        str += city[0].label + ','
      }
      str += province[0].label
      return str.split(',').reverse().join(' / ')
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


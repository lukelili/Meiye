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
        <a-button type="primary">录入会员</a-button>
      </div>
      <a-table :columns="columns" :data-source="data" row-key="_id">
        <span slot="operation" slot-scope="item" class="operation-btns">
          <a>详情</a>
          <a-divider type="vertical" />
          <a>划卡</a>
          <a-divider type="vertical" />
          <a>充值</a>
          <a-divider type="vertical" />
          <a>编辑</a>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: '',
        phone: '',
        cardId: ''
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '性别',
          dataIndex: 'gender'
        },
        {
          title: '生日',
          dataIndex: 'birthday'
        },
        {
          title: '电话号',
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
          title: '入会时间',
          dataIndex: 'enterTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [
        {
          _id: 'adasdadaq213',
          name: '张娇',
          gender: 'woman',
          birthday: '2019-12-28',
          phone: '18810381734',
          distcount: 7,
          lastConsume: '287',
          balance: '1280',
          cards: [],
          enterTime: '2020-12-01'
        }
      ]
    }
  },
  methods: {
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

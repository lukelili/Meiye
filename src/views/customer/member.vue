<template>
  <div class="container">
    <div class="search">
      <a-form class="ant-advanced-search-form" layout="inline" :label-col="{ span: '4', offset: '12'}" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col>
            <a-form-item label="查询姓名">
              <a-input />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table" />
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleSearch() {}
  }
}
</script>

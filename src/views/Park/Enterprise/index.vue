<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="serchFn">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="firmData">
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout=" ->,prev, pager, next, jumper, total"
          :total="total"
          :page-size="params.pageSize"
          @current-change="handlecurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { getFirmList } from '@/apis/firm'
export default {
  data() {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 2

      },
      firmData: [],
      total: null
    }
  },
  created() {
    this.getFirmData()
  },
  methods: {
    async getFirmData() {
      const res = await getFirmList(this.params)
      this.firmData = res.data.rows
      this.total = res.data.total
    },
    // 切换分页
    handlecurrentChange(val) {
      this.params.page = val
      this.getFirmData()
    },
    // 查询
    serchFn() {
      this.getFirmData()
    }
  }
}
</script>
<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>

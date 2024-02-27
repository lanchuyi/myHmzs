<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="getObj.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="getObj.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="getObj.cardStatus">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="serch">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/cardAdd')">添加月卡</el-button>
      <el-button @click="batchDel">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        ref="multipleTable"
        style="width: 100%"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scoped">
            <el-button size="mini" type="text" @click="renew('renew',scoped.row)">续费</el-button>
            <el-button size="mini" type="text" @click="$router.push(`/viewMonthCard?id=${scoped.row.id}`)">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scoped.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(scoped.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        :current-page.sync="currentPage1"
        :page-sizes="[2,4,6]"
        :page-size="getObj.pageSize"
        layout="total, prev, pager, next,sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      > />
      </el-pagination></div>
  </div>
</template>

<script>
import { getCard, deleteCardAPI } from '@/apis/car'
export default {
  data() {
    return {
      // 获取月卡
      getObj: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        cardStatus: ''
      },
      // 查询月卡
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '过期'
      }, {
        value: '0',
        label: '可用'
      }],
      value: '',
      tableData: [{}],
      total: null,
      currentPage1: 1,
      // 添加月卡
      addObj: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: '',
        cardStartDate: '',
        cardEndDate: '',
        paymentAmount: '',
        paymentMethod: ''
      },
      // 批量删除
      id: []

    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查看月卡详情
    async getList() {
      const res = await getCard(this.getObj)
      this.tableData = res.data.rows
      this.total = res.data.total
    },

    formatStatus(row) {
      const MAP = {
        0: '可用',
        1: '已过期'
      }
      return MAP[row.cardStatus]
    },
    handleSizeChange(val) {
      this.getObj.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.getObj.page = val
      this.getList()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.id = val.map(item => item.id)
    },
    // 批量删除
    batchDel() {
      deleteCardAPI(this.id.join(','))
      this.getList()
    },
    serch() {
      this.getObj.page = 1
      this.getList()
    },
    // 编辑月卡
    edit(id) {
      this.$router.push(`/cardAdd?id=${id}`)
    },
    // 删除月卡
    async del(ids) {
      await deleteCardAPI(ids)
      this.getList()
    },
    // 续费
    renew(type, row) {
      this.$router.push(`/cardAdd?id=${row.id}&type=${type}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>

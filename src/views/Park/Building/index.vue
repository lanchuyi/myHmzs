<template>
  <div class="building-container">
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        />
      </el-header>
      <el-main>
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="name" label="楼宇名称" width="140" />
          <el-table-column prop="floors" label="层数" width="120" />
          <el-table-column prop="area" label="在管面积（m²）" width="140" />
          <el-table-column prop="propertyFeePrice" label="物业费（元/m²）" width="140" />
          <el-table-column prop="status" label="状态" width="220" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="block">
          <el-pagination
            :current-page.sync="currentPage1"
            :page-size="data.pageSize"
            layout="total, prev, pager, next"
            :total="data.pages"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getTenement } from '@/apis/user'
export default {
  data() {
    return {
      currentPage1: 1,
      tableData: [{}],
      data: {
        pages: 1,
        pageSize: 20
      },
      index: 1,
      state: '',
      timeout: null
    }
  },
  async created() {
    const res = await getTenement(this.data)
    this.tableData = res.data.rows
    console.log(res)
  },
  mounted() {
    this.tableData = this.loadAll()
  },
  methods: {
    loadAll() {
      return this.tableData
    },
    querySearchAsync(queryString, cb) {
      var tableData = this.tableData
      var results = queryString ? tableData.filter(this.createStateFilter(queryString)) : tableData

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<template>
  <el-container>
    <el-header>
      一体杆名称： <el-input v-model="params.poleName" placeholder="请输入内容" class="sacehInput" />
      一体杆编号: <el-input v-model="params.poleNumber" placeholder="请输入内容" class="sacehInput" />
      运行状态： <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-row class="saceButton">
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
    </el-header>
    <el-main>
      <template>
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column v-for="(column, index) in tableColumns" :key="index" :label="column.label" :prop="column.prop" :width="column.width">
            <template slot-scope="scope">
              <template v-if="column.label === '序号'">
                <span>{{ scope.$index + 1 }}</span>
              </template>
              <template v-else-if="column.prop === 'handleStatus'">
                <span>{{ handleStatusData[scope.row.handleStatus] }}</span>
              </template>
              <template v-else-if="column.label === '操作'">
                <span><a style="color: blue; margin-right: 10px;" href="#">派单</a></span>
                <span><a style="color: blue; margin-right: 10px;" href="#" @click.prevent="emit(scope.row)">详情</a></span>
                <span><a style="color: blue;" href="#" @click.prevent="del(scope.row)">删除</a></span>
              </template>
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-main>
    <el-footer>
      <!-- 分页 -->
      <el-pagination
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.pageSize"
        layout="->, total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>
<script >
import { getAlarmListAPI } from '@/apis/pole'
export default {

  data() {
    return {
      // 获取数据
      params: {
        page: 1,
        pageSize: 10,
        poleName: '', // 一体杆名称
        poleNumber: '', // 一体杆编号
        handleStatus: ''
      },
      // 下拉选择
      options: [{
        value: '0',
        label: '未派单'
      }, {
        value: '1',
        label: '已派单'
      }, {
        value: '2',
        label: '已接单'
      },
      {
        value: '3',
        label: '已完成'
      }

      ],
      value: '',
      // 表格数据
      tableData: [],
      tableColumns: [
        { label: '序号', prop: '', width: '100' },
        { label: '一体杆名称', prop: 'poleName', width: '160' },
        { label: '一体杆编号', prop: 'poleNumber', width: '160' },
        { label: '故障类型', prop: 'errorType', width: '140' },
        { label: '处置状态', prop: 'handleStatus', width: '120' },
        { label: '告警时间', prop: 'warningTime', width: '160' },
        { label: '操作', prop: '', width: '140' } // 操作列不需要 prop
      ],
      // 总数据条数
      total: null,
      // 收费类型字典对象
      handleStatusData: {
        '0': '未派单',
        '1': '已派单',
        '2': '已接单',
        '3': '已完成'
      }

    }
  },
  created() {
    this.getPolesList()
  },
  methods: {
    // 获取列表
    async getPolesList() {
      const res = await getAlarmListAPI(this.params)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getPolesList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getPolesList()
    },

    // 查询
    search() {
      this.params.handleStatus = this.value
      this.params.page = 1
      this.getPolesList()
    }
  }
}
</script>
<style lang="scss" scoped>
.sacehInput{
  width: 20%;
}
.saceButton{
  display: inline-block;
  margin-left: 40px;
}
</style>


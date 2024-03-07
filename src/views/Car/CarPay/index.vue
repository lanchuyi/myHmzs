<template>
  <el-container>
    <el-header>
      车牌号码： <el-input v-model="params.carNumber" placeholder="请输入内容" class="sacehInput" />
      缴纳状态： <el-select v-model="value" placeholder="请选择">
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
          <el-table-column
            label="序号"
            width="100"
            type="index"
            :index="1"
          />
          <el-table-column
            prop="carNumber"
            label="车牌号码"
            width="120"
          />
          <el-table-column

            label="收费类型	"
            width="120"
          >
            <template #default="{row}">
              {{ chargeTypeData[row.chargeType] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="parkingTime"
            label="停车总时长	"
            width="160"
          />
          <el-table-column
            prop="actualCharge"
            label="缴纳费用（元）"
            width="120"
          />
          <el-table-column
            prop="paymentStatus"
            label="缴纳状态	"
            width="100"
          >
            <template #default="{row}">
              {{ row.paymentStatus=== 1 ?'已缴纳':'未缴纳' }}
            </template>
          </el-table-column>
          <el-table-column
            label="缴纳方式	"
            width="100"
          >
            <template #default="{row}">
              {{ paymentMethodData[row.paymentMethod] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="paymentTime"
            label="缴纳时间	"
            width="160"
          />
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
import { getPaymentListAPI } from '@/apis/car'
export default {

  data() {
    return {
      // 获取数据
      params: {
        page: 1,
        pageSize: 10,
        carNumber: '',
        paymentStatus: ''
      },
      // 下拉选择
      options: [{
        value: '1',
        label: '已缴纳'
      }, {
        value: '0',
        label: '未缴纳'
      }],
      value: null,
      // 表格数据
      tableData: [],
      // 总数据条数
      total: null,
      // 收费类型字典对象
      chargeTypeData: {
        'card': '月卡',
        'temp': '临时停车'
      },
      // 支付类型字典对象
      paymentMethodData: {
        'Alipay': '支付宝',
        'WeChat': '微信',
        'Cash': '线下'
      }
    }
  },
  created() {
    this.getPaymentList()
  },
  methods: {
    // 获取列表
    async getPaymentList() {
      const res = await getPaymentListAPI(this.params)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getPaymentList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getPaymentList()
    },

    // 查询
    search() {
      this.params.paymentStatus = this.value
      this.params.page = 1
      this.getPaymentList()
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

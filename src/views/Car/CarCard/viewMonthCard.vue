<template>
  <div div class="card-viwe">
    <el-container>
      <el-header>
        <el-page-header content="月卡详情" style="line-height: 60px;" @back="$router.back()" />
      </el-header>
      <el-main>
        <div class="top">
          <div class="topH4">
            <h4>车辆信息</h4>
          </div>
          <span style="display: block;background: #000;width: 1100px;height: 1px; margin: 0 auto;" />
          <div class="text">
            <div class="tetx_r">
              <div>
                <p style="display: inline-block;">车主姓名:</p><span>{{ CarData.personName }}</span>
              </div>
              <div>
                <p style="display: inline-block;">联系方式:</p><span>{{ CarData.phoneNumber }}</span>
              </div>
            </div>
            <div class="tetx_l">
              <div>
                <p style="display: inline-block;">车牌号码:</p><span>{{ CarData.carNumber }}</span>
              </div>
              <div>
                <p style="display: inline-block;">车辆品牌:</p><span>{{ CarData.carBrand }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="buttom">
          <div class="topH4">
            <h4>月卡缴费记录</h4>
          </div>
          <span style="display: block;background: #000;width: 1100px;height: 1px; margin: 0 auto;" />
          <template>
            <el-table
              :data="tableData"
              style="width: 100%;color: #000;"
            >
              <el-table-column
                label="序号"
                type="index"
                :index="1"
              />
              <el-table-column
                label="有效时间	"
                width="200"
              >
                <template #default="{row}">
                  {{ row.cardStartDate }}至{{ row.cardEndDate }}
                </template>
              </el-table-column>
              <el-table-column
                prop="paymentAmount"
                label="支付金额	"
                width="180"
              />
              <el-table-column
                label="支付方式	"
              >
                <template #default="{row}">
                  {{ PaymentDictionary[row.paymentMethod] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="办理时间"
              />
              <el-table-column
                prop="createUser"
                label="办理人"
              />
            </el-table>
          </template>
        </div>

      </el-main>
    </el-container>

  </div>
</template>
<script>
import { getCardDetailsAPI } from '@/apis/car'
export default {
  data() {
    return {
      tableData: [],
      CarData: {}, // 车辆信息
      PaymentDictionary: {
        'WeChat': '微信',
        'Alipay': '支付宝',
        'Cash': '现金'
      }
    }
  },
  created() {
    this.getCardDetailsList()
  },
  methods: {
    async getCardDetailsList() {
      const res = await getCardDetailsAPI(this.$route.query.id)
      this.tableData = res.data.rechargeList
      this.CarData = res.data
    }
  }
}
</script>
<style>
body {
    background: #f4f6f8;;
}
.el-header, .el-footer {
    display: flex;
    background-color: #ffffff;
    color: #000000;
    line-height: 10px;
    text-align: left;
  }
  .top {
    background-color: #fff;
    width: 1200px;height: 200px;
    margin: 0 auto;
    padding: 12px 19px 12px 12px;
    margin-bottom: 50px;
  }
.text {
    display: flex;
    margin-left: 100px;
    width: 900px;
    height: 120px;
    margin: 0 auto;
  }
   .text .tetx_r {
    margin-right: 500px;
  }
  .buttom {
    background-color: #ffffff;
    width: 1200px;height: auto;
    margin: 0 auto;
    padding: 12px 19px 12px 12px;
  }
  /* .el-header span {
        color: #2a2b2d;
        font-size: 20px;
        text-align: left;
        line-height: 65px;
        margin-right: 20px;
  } */
</style>

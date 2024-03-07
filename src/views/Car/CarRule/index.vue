<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="addRule">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ chargeType[scope.row.chargeType] }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dilog -->
    <el-dialog title="收货地址" :visible="dialogFormVisible">
      <el-form ref="form" :model="ruleForm" label-width="80px" size="mini">
        <el-form-item label="周边规则编号">
          <el-input v-model="ruleForm.ruleNumber" class="Rulenumber" />
        </el-form-item>
        <el-form-item label="周边规则名称">
          <el-input v-model="ruleForm.ruleName" class="Rulename" />
        </el-form-item>
        <el-form-item label="设备方式（全天收费）">
          <el-radio-group v-model="ruleForm.chargeType" size="medium" @input="change(ruleForm.chargeType)">
            <el-radio border label="duration">按时收费</el-radio>
            <el-radio border label="turn">按次收费</el-radio>
            <el-radio border label="partition">分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自由时长" style="display: inline-block;">
          <el-input-number
            v-model="ruleForm.freeDuration"
            controls-position="right"
            :min="1"
            :max="90"
            label="请输入免费时长"
            placeholder="1"
            @change="((val)=>handleChange(val,ruleForm.chargeType))"
          />分钟
        </el-form-item>

        <el-form-item label="收费上限" style="display: inline-block;">
          <el-input v-model.number="ruleForm.chargeCeiling" />
        </el-form-item>
        <el-form-item v-show="ruleForm.chargeType==='duration'" label="周边规则" style="display: inline-block; ">
          每 <el-input-number
            v-model="ruleForm.durationTime"
            controls-position="right"
            :min="1"
            :max="90"
            label="请输入免费时长"
            placeholder="1"
            @change="handleChange"
          />分钟
          <el-select v-model="durationTypeValue" placeholder="请选择" style="height: 40px;">
            <el-option
              v-for="item in ruleForm.durationType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="height: 40px;"
            />
          </el-select>
          <el-input v-model.number="ruleForm.chargeCeiling" class="ChargeByTimePrice" /><span>元</span>
        </el-form-item>
        <el-form-item v-show="ruleForm.chargeType==='turn'" label="周边规则">
          附<el-input v-model.number="ruleForm.turnPrice" />元
        </el-form-item>
        <el-form-item v-show="ruleForm.chargeType==='partition'" label="周边规则">
          <el-input-number
            v-model="ruleForm.partitionFrameTime"
            controls-position="right"
            :min="1"
            :max="90"
            label="请输入免费时长"
            placeholder="1"
            @change="((val)=>handleChange(val,ruleForm.chargeType))"
          />小时内,每小时收费
          <el-input v-model.number="ruleForm.partitionFramePrice" class="partitionFramePrice" />元
          <span class="OvertimeText">每增加</span><el-input v-model.number="ruleForm.partitionIncreaseTime" class="partitionFramePrice" />小时
          增加<el-input v-model.number="ruleForm.partitionIncreasePrice" class="partitionFramePrice" />元
        </el-form-item>
        <el-form-item />
        <!-- <el-form-item size="large">
         <el-button type="primary">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>  -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRuleListAPI } from '@/apis/car'
import { utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'Building',
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogFormVisible: false,
      chargeType: {
        'duration': '时长收费',
        'turn': '按次收费',
        'partition': '分段收费'
      },
      ruleForm: {
        ruleNumber: 'A005',
        ruleName: '按时长收费',
        freeDuration: 15,
        chargeCeiling: 50.00,
        chargeType: 'duration',
        durationTime: 30,
        durationPrice: 5,
        durationType: [
          { value: 'minute', label: '分钟' },
          { value: 'hour', label: '小时' }
        ],
        turnPrice: null,
        partitionFrameTime: null,
        partitionFramePrice: null,
        partitionIncreaseTime: null,
        partitionIncreasePrice: null
      },
      durationTypeValue: ''
    }
  },
  created() {
    this.getList()
    console.log(this.ruleForm.chargeType)
  },
  methods: {
    async getList() {
      const res = await getRuleListAPI(this.params)
      console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    exportExcel() {
      // 1. 创建一个新的工作簿
      const workbook = utils.book_new()

      // 改写表头
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      // 表头中文字段value（设置表头使用）

      const sheetData = this.ruleList.map((item) => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          if (key === 'chargeType') {
            obj[key] = this.chargeType[item[key]]
          } else {
            obj[key] = item[key]
          }
        })
        return obj
      })
      const keys = {
        'ruleNumber': '计费规则编号',
        'ruleName': '计费规则名称',
        'freeDuration': '免费时长(分钟)',
        'chargeCeiling': '收费上线(元)',
        'chargeType': '计费方式',
        'ruleNameView': '计费规则'
      }
      const newFrom = tableHeaderKeys.map(item => {
        return keys[item]
      })
      // 2. 创建一个工作表 要求一个对象数组格式（可以根据需要创建多个）
      const worksheet = utils.json_to_sheet(sheetData)
      // 3. 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, 'Data')
      utils.sheet_add_aoa(worksheet, [newFrom], { origin: 'A1' })
      // 4. 导出方法进行导出
      writeFileXLSX(workbook, 'SheetJSVue.xlsx')
    },
    // 新增规则
    addRule() {
      this.dialogFormVisible = true
    },
    // 机器类型
    change(value) {
      console.log(value, 'v')
      console.log(this.ruleForm.chargeType)
    },
    // 免费时长
    handleChange(val, chargeType) {
      console.log(val)
      console.log(chargeType)
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.rules .el-form-item {
  padding:0 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
.el-input-number{
  margin-bottom: 30px;
}
::v-deep.el-input--mini .el-input__inner {
    height: 40px;
    line-height: 50px;
    font-size: 14px;
}
::v-deep.el-input-number.is-controls-right .el-input__inner {
    padding-left: 15px;
    padding-right: 50px;
    height: 40px;
    line-height: 50px;
    font-size: 14px;
}
::v-deep.el-input-number.is-controls-right[class*=mini] [class*=increase], .el-input-number.is-controls-right[class*=mini] [class*=decrease] {
    line-height: 18px;
}
::v-deep.el-input-number.is-controls-right[class*=mini] [class*=decrease] {
  line-height: 18px;
}
.el-input--mini .el-input__inner {
    height: 41px;
    line-height: 28px;
}
::v-deep.el-input .el-input__inner{
width: 200px;
}
.Rulenumber::v-deep .el-input__inner{
  display: block;
  width: 400px;
}
.Rulename::v-deep .el-input__inner{
  display: block;
  width: 400px;
}
.ChargeByTimePrice {
  display: inline-block;
  width: 200px;
}
.ChargeByTimePrice .el-input__inner{

  display: inline-block;
  width: 200px;
}
.partitionFramePrice{
  display: inline-block;
  width: 200px;
}
.OvertimeText{
  display: inline-block;
  margin-left: 90px;
}

</style>

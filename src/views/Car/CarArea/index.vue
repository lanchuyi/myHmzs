<template>
  <el-container>

    <el-header>
      <el-row style="display: flex; justify-content: flex-start;">
        <el-button type="primary" @click="addDrive">添加区域</el-button>
      </el-row>
    </el-header>

    <el-table
      :data="tableData"
      style="width: 100%"
    >

      <el-table-column
        prop="areaName"
        label="序号"
        width="180"
        type="index"
      />
      <el-table-column
        prop="areaName"
        label="区域名称"
        width="180"
      />
      <el-table-column
        prop="spaceNumber"
        label="车辆个数"
        width="180"
      />
      <el-table-column
        prop="areaProportion"
        label="面积（㎡）"
      />
      <el-table-column
        prop="ruleName"
        label="计费规则	"
      />
      <el-table-column
        prop="remark"
        label="备注"
      />
      <el-table-column
        prop="address"
        label="操作"
      >
        <template #default="scoped">
          <el-button type="text" @click="edit(scoped)">编辑</el-button>
          <el-button type="text" @click="del(scoped)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 弹窗 -->

    <el-dialog title="添加区域" :visible="dialogFormVisible">
      <el-form ref="addform" :model="addform" :rules="rules">
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="addform.areaName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="车位个数" prop="spaceNumber">
          <el-input v-model.number="addform.spaceNumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="面积（㎡）" prop="areaProportion">
          <el-input v-model.number="addform.areaProportion" autocomplete="off" />
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <el-select v-model="addform.ruleId" placeholder="请选择活动区域" style="width: 200px;">
            <el-option v-for="item in dropList" :key="item.ruleId" :label="item.ruleName" :value="item.ruleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addform.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sunbmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-footer>
      <el-pagination
        :page-sizes="[20, 50, 100, 200]"
        :page-size="params.pageSize"
        layout="->,total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-footer>
  </el-container>
</template>
<script>
import { getDriveListAPI, getDropListAPI, getAddDriveAPI, EditAPI, delAPI } from '@/apis/Drive'
export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10
      },
      total: null,
      tableData: [],
      dropList: [], // 关联的下拉列表
      // 新增弹窗表格
      addform: {
        areaName: '',
        spaceNumber: '',
        areaProportion: '',
        ruleId: ''
      },
      // 弹窗是否出现
      dialogFormVisible: false,
      // 校验规则
      rules: {
        areaName: [
          { required: true, message: '区域名称不能为空', trigger: 'blur' }

        ],
        spaceNumber: [
          { required: true, message: '车辆个数不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入阿拉伯数字' }
        ],
        areaProportion: [
          { required: true, message: '面积（㎡）不能为空', trigger: 'blur' },
          { type: 'number', message: '请输入阿拉伯数字' }
        ],
        ruleId: [
          { required: true, message: '关联计费规则不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDriveList()
    this.getDropList()
  },
  methods: {
    async getDriveList() { // 获取区域列表
      const res = await getDriveListAPI(this.params)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    async getDropList() { // 获取关联区域下拉列表
      const res = await getDropListAPI()
      this.dropList = res.data
    },
    // 切换分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getDriveList()
    },
    // 切换条数
    handleCurrentChange(val) {
      this.params.page = val
      this.getDriveList()
    },
    // 添加区域
    addDrive() {
      this.dialogFormVisible = true
      delete this.addform.id
      this.$nextTick(() => {
        this.$refs.addform.resetFields()
      })
    },
    // 编辑
    edit(scoped) {
      this.dialogFormVisible = true
      this.addform = scoped.row
      this.addform.id = scoped.row.id
    },
    // 删除
    async del(scoped) {
      await delAPI(scoped.row.id)
      this.getDriveList()
    },
    // 确定提交
    async sunbmit() {
      await this.$refs.addform.validate()
      if (this.addform.id) {
        delete this.addform.ruleName
        delete this.addform.hoverRuleName
        await EditAPI(this.addform)
      } else {
        await getAddDriveAPI(this.addform)
      }
      this.dialogFormVisible = true
      this.getDriveList()
    }

  }
}
</script>
<style scoped>
  .el-header, .el-footer {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>

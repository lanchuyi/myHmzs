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
          <el-table-column
            label="序号"
            width="100"
            type="index"
            :index="1"
          />
          <el-table-column
            prop="poleName"
            label="一体杆名称"
            width="160"
          />
          <el-table-column
            prop="poleNumber"
            label="一体杆编号"
            width="120"
          />
          <el-table-column
            prop="poleIp"
            label="一体杆IP		"
            width="160"
          />
          <el-table-column
            prop="areaName"
            label="安装区域"
            width="160"
          />
          <el-table-column
            label="一体杆类型	"
            width="100"
          >
            <template #default="{row}">
              {{ poleTypeData[row.poleType] }}
            </template>
          </el-table-column>
          <el-table-column
            label="运行状态"
            width="100"
          >
            <template #default="{row}">
              {{ row.poleStatus=== 1 ?'异常':'正常' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template #default="{row}">
              <el-button type="text" @click="emit(row)">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="收货地址" :visible="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="一体杆名称" :label-width="formLabelWidth">
              <el-input v-model="form.areaName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="一体杆编号" :label-width="formLabelWidth">
              <el-input v-model="form.poleNumber" autocomplete="off" />
            </el-form-item>
            <el-form-item label="一体杆IP" :label-width="formLabelWidth">
              <el-input v-model="form.poleIp" autocomplete="off" />
            </el-form-item>
            <el-form-item label="关联区域" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="一体杆类型" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
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
import { getPolesAPI, getDropListAPI } from '@/apis/pole'
export default {

  data() {
    return {
      // 获取数据
      params: {
        page: 1,
        pageSize: 10,
        poleName: '', // 一体杆名称
        poleNumber: '', // 一体杆编号
        poleStatus: ''
      },
      // 下拉选择
      options: [{
        value: '1',
        label: '异常'
      }, {
        value: '0',
        label: '正常'
      }],
      value: '',
      // 表格数据
      tableData: [],
      // 总数据条数
      total: null,
      // 收费类型字典对象
      poleTypeData: {
        'entrance': '入口',
        'export': '出口',
        'center': '中心'
      },
      // 弹窗是否关闭
      dialogFormVisible: false,
      form: {

      }

    }
  },
  created() {
    this.getPolesList()
  },
  methods: {
    // 获取列表
    async getPolesList() {
      const res = await getPolesAPI(this.params)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    // 获取关联区域下拉列表
    async getDropList() {
      getDropListAPI()
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
      this.params.poleStatus = this.value
      this.params.page = 1
      this.getPolesList()
    },
    // 编辑
    emit(row) {
      const { areaName, poleNumber, poleIp
      } = row
      this.form = { areaName, poleNumber, poleIp
      }
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

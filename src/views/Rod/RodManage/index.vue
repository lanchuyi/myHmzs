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
              <template v-if="column.prop === 'poleStatus'">
                {{ column.prop === 'poleStatus' ? (scope.row.poleStatus === 1 ? '异常' : '正常') : '' }}
              </template>
              <template v-else-if="column.label === '序号'">
                <span>{{ scope.$index + 1 }}</span>
              </template>
              <template v-else-if="column.prop === 'poleType'">
                <span>{{ poleTypeData[scope.row.poleType] }}</span>
              </template>
              <template v-else-if="column.label === '操作'">
                <span><a style="color: blue; margin-right: 10px;" href="#">删除</a></span>
                <span><a style="color: blue;" href="#" @click.prevent="emit(scope.row)">编辑</a></span>
              </template>
              <template v-else>
                {{ scope.row[column.prop] }}
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="收货地址" :visible="dialogFormVisible">
          <el-form :model="form">
            <el-form-item v-for="(item, index) in formItems" :key="index" :label="item.label">
              <template v-if="item.type === 'input'">
                <el-input v-model="form[item.prop]" autocomplete="off" />
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select v-model="form[item.prop]" :placeholder="item.placeholder">
                  <el-option v-for="(option, optionIndex) in item.options" :key="optionIndex" :label="option.label" :value="value" />
                </el-select>
              </template>
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
      tableColumns: [
        { label: '序号', prop: '', width: '100' },
        { label: '一体杆名称', prop: 'poleName', width: '160' },
        { label: '一体杆编号', prop: 'poleNumber', width: '120' },
        { label: '一体杆IP', prop: 'poleIp', width: '160' },
        { label: '安装区域', prop: 'areaName', width: '160' },
        { label: '一体杆类型', prop: 'poleType', width: '100' },
        { label: '运行状态', prop: 'poleStatus', width: '100' },
        { label: '操作', prop: '', width: '100' } // 操作列不需要 prop
      ],
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
      // 回显表单
      form: {

      },
      formItems: [
        { type: 'input', label: '一体杆名称', prop: 'areaName' },
        { type: 'input', label: '一体杆编号', prop: 'poleNumber' },
        { type: 'input', label: '一体杆IP', prop: 'poleIp' },
        { type: 'select', label: '关联区域', prop: 'region', options: [
          { label: '区域一', value: 'shanghai' },
          { label: '区域二', value: 'beijing' }
        ] },
        { type: 'select', label: '一体杆类型', prop: 'poleType', options: [
          { label: '类型一', value: 'type1' },
          { label: '类型二', value: 'type2' }
        ] }
      ]

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
      console.log(row)
      const { areaName, poleNumber, poleIp
      } = row
      this.form = { areaName, poleNumber, poleIp
      }
      console.log(this.form)
      this.dialogFormVisible = true
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

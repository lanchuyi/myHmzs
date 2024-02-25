<template>
  <div class="building-container">
    <el-container>
      <el-header>
        楼宇名称： <el-input v-model="params.name" placeholder="请输入内容" style="width: 120px; margin-right: 20px;" />
        <el-button type="primary" @click="inquire">查询楼宇</el-button>
      </el-header>
      <el-main>
        <template>
          <el-button type="primary" @click="addU(data)">添加楼宇</el-button>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
              :index="1"
            />
            <el-table-column
              prop="name"
              label="楼宇名称"
              width="180"
            />
            <el-table-column
              prop="floors"
              label="层数"
              width="180"
            />
            <el-table-column
              prop="area"
              label="在管面积（㎡）"
            />
            <el-table-column
              prop="propertyFeePrice"
              label="物业费（元/㎡）"
            />
            <el-table-column
              prop="status"
              label="状态"
              :formatter="formatStatus"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="120"
            >
              <template #default="scoped">
                <el-button
                  type="text"
                  size="small"
                  @click="editUnit(scoped.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            ref="data"
            :label-position="labelPosition"
            label-width="100px"
            :inline="true"
            :model="data"
            class="demo-form-inline"
            :rules="rules"
            status-icon
          >
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model.number="data.name" placeholder="楼宇名称" />
            </el-form-item>
            <el-form-item label="层数" prop="floors">
              <el-input v-model.number="data.floors" placeholder="层数" />
            </el-form-item>
            <el-form-item label="在管面积" prop="area">
              <el-input v-model.number="data.area" placeholder="在管面积" />
            </el-form-item>
            <el-form-item label="物业费单价" prop="propertyFeePrice">
              <el-input v-model.number="data.propertyFeePrice" placeholder="物业费单价" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="verify(data)">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import { getTenement, addUnit } from '@/apis/unit'
// import { validaeNumber } from '@/utils/validate' // 校验添加楼宇
export default {
  data() {
    return {
      params: {
        pages: 1,
        pageSize: 20,
        name: ''
      },
      data: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      input: '',
      tableData: [],
      // 弹框状态
      dialogVisible: false,
      labelPosition: 'left',
      // 添加弹框校验
      rules: {
        name: [
          { required: true, message: '不能为空' }

        ],
        floors: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '请输入阿拉伯数字' }
        ],
        area: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '请输入阿拉伯数字' }
        ],
        propertyFeePrice: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '请输入阿拉伯数字' }
        ]
      }
    }
  },
  async created() {
    this.getData()
  },

  // 查询
  methods: {
    // 转换状态
    formatStatus(row) {
      const MAP = {
        0: '可用',
        1: '已过期'
      }
      return MAP[row.status]
    },
    async getData() {
      const res = await getTenement(this.params)
      this.tableData = res.data.rows
    },
    inquire() {
      this.getData()
    },
    // 提交
    async verify(data) {
      await this.$refs.data.validate()
      if (data.id) {
        console.log('id存在')
      } else {
        const res = await addUnit(data)
        this.editUnitData = res.row
      }
      this.getData()
      this.dialogVisible = false
    },
    // 添加楼宇
    addU(data) {
      if (data.id) {
        this.$refs.data.resetFields()
      } else { console.log(data.id) }
      this.dialogVisible = true
    },
    // 编辑楼宇
    editUnit(row) {
      this.dialogVisible = true
      const { area, floors, name, propertyFeePrice } = row
      this.data = { area, floors, name, propertyFeePrice }
      this.data.id = row.id
      console.log(this.data, 'bian')
    },

    // 弹框关闭确认
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }

}
</script>

<style lang="scss" scoped>
 .el-header {
    background-color: #ffffff;
    color: #030303;
    line-height: 60px;
    display: flex;
    align-items: center;
   p{
    font-size: 16px;
   }

  }

  .el-aside {
    color: #06569c;
  }
</style>

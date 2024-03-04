<template>
  <div class="building-container">
    <el-container>
      <el-header>
        楼宇名称： <el-input v-model="params.name" placeholder="请输入内容" style="width: 120px; margin-right: 20px;" />
        <el-button type="primary" @click="inquire">查询楼宇</el-button>
      </el-header>
      <el-main>
        <template>
          <el-button type="primary" @click="addU('datas')">添加楼宇</el-button>
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
                  @click="del(scoped.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <el-form
            ref="datas"
            :label-position="labelPosition"
            label-width="100px"
            :model="datas"
            class="demo-form-inline"
            :rules="rules"
            status-icon
          >
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model.number="datas.name" placeholder="楼宇名称" />
            </el-form-item>
            <el-form-item label="层数" prop="floors">
              <el-input v-model.number="datas.floors" placeholder="层数" />
            </el-form-item>
            <el-form-item label="在管面积" prop="area">
              <el-input v-model.number="datas.area" placeholder="在管面积" />
            </el-form-item>
            <el-form-item label="物业费单价" prop="propertyFeePrice">
              <el-input v-model.number="datas.propertyFeePrice" placeholder="物业费单价" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="verify(datas)">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
      <el-footer>
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="params.pageSize"
          layout="sizes, prev, pager, next,total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getTenement, addUnit, editUnit, delUnit } from '@/apis/unit'
export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 20,
        name: ''
      },
      datas: {
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
      },
      // 提示框标题
      title: '',
      // 总数据条数
      total: null
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

      this.total = res.data.total
    },
    inquire() {
      this.getData()
    },
    // 提交
    async verify(datas) {
      await this.$refs.datas.validate()
      if (datas.id) {
        await editUnit(datas)
      } else {
        const res = await addUnit(datas)
        this.editUnitData = res.row
      }
      this.getData()
      this.dialogVisible = false
    },
    // 添加楼宇
    addU(datas) {
      this.dialogVisible = true
      this.$nextTick(() => {
        if (datas) {
          this.datas = {}
          this.$refs[datas].resetFields()
        }
      })
      this.title = '添加楼宇'
    },
    // 编辑楼宇
    editUnit(row) {
      this.dialogVisible = true
      this.title = '编辑楼宇'
      const { area, floors, name, propertyFeePrice } = row
      this.datas = { area, floors, name, propertyFeePrice }
      this.datas.id = row.id
    },
    // 删除楼宇
    async  del(id) {
      await delUnit(id)
      this.getData()
    },

    // 弹框关闭确认
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 分页器页码切换
    handleCurrentChange(val) {
      this.params.page = val
      console.log(this.params)
      console.log(val)
      this.getData()
    },
    // 分页器显示条数切换
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getData()
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

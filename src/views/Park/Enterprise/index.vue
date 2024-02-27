<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="serchFn">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/exterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="firmData" @expand-change="expandHandle">
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态" prop="status">
                <template #default="scopes">
                  <el-tag :type="TagDictionary[scopes.row.status]">{{ TagName[scopes.row.status] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">

                <template #default="dis">
                  <el-button size="mini" type="text" :disabled="!(dis.row.status===2) ">续租</el-button>
                  <el-button size="mini" type="text" :disabled="!(dis.row.status===2 || dis.row.status===1)" @click="refund(dis.row.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="(dis.row.status===1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button size="mini" type="text" @click="addRent(scoped.row.id)">添加合同</el-button>
            <el-button size="mini" type="text" @click="$router.push(`/exterpriseDetail?id=${scoped.row.id}`)">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" :disabled="!(scoped.row.rentList.length > 0)" type="text" @click="del(scoped.row) ">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="block">
        <el-pagination
          layout=" ->,prev, pager, next, jumper, total"
          :total="total"
          :page-size="params.pageSize"
          @current-change="handlecurrentChange"
        />
      </div>
      <el-dialog title="添加合同" :visible="rentDialogVisible" width="580px" @close="closeDialog">
        <!-- 表单区域 -->
        <!-- 表单模版 -->
        <div class="form-container">
          <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select v-model="rentForm.buildingId" placeholder="请选择">
                <el-option
                  v-for="item in buildList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁起止日期" prop="rentTime">
              <el-date-picker
                v-model="rentForm.rentTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="租赁合同" prop="contractId">
              <el-upload
                action="#"
                :before-upload="uploadCheck"
                :limit="1"
                :file-list="contractList"
                :http-request="uploadHandle"
              >
                <el-button size="small" type="primary" plain>上传合同文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.doc .pdf, 文件大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="addHandel()">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getFirmList, getRentBuildListAPI, uploadAPI, createRentAPI, getRentListAPI, outRentAPI } from '@/apis/firm'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      TagDictionary: {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      },
      TagName: {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      },
      params: {
        name: '',
        page: 1,
        pageSize: 2

      },
      firmData: [], // 企业列表
      contractList: [], // 合同列表
      total: null,
      rentDialogVisible: false, // 添加楼宇弹窗控制
      buildList: [], // 未租赁楼宇列表,
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      }
    }
  },
  created() {
    this.getFirmData()
    this.getRentBuildData()// 调用租用列表
  },
  methods: {
    async getFirmData() {
      const res = await getFirmList(this.params)
      console.log(res)
      this.firmData = res.data.rows
      this.total = res.data.total
      this.firmData = res.data?.rows.map((item) => {
        return {
          ...item,
          rentList: [] // 每一行补充存放合同的列表
        }
      })
    },
    async getRentBuildData() {
      const res = await getRentBuildListAPI()// 获取租用列表
      this.buildList = res.data
    },
    // 切换分页
    handlecurrentChange(val) {
      this.params.page = val
      this.getFirmData()
    },
    // 查询
    serchFn() {
      this.getFirmData()
    },
    // 添加企业
    addRent(id) {
      this.rentDialogVisible = true
      this.rentForm.enterpriseId = id
    },
    // 关闭
    closeDialog() {
      this.rentDialogVisible = false
    },
    // 上传租赁合同校验
    uploadCheck(file) {
      const lits = ['application/msword', 'application/pdf']
      const isFile = lits.includes(file.type)
      const isSize5m = file.size / 1024 / 1024 < 5
      if (!isFile) {
        Message.error('请上传word或者PDF类型文件')
      }
      if (!isSize5m) {
        Message.error('请上传5M内文件')
      }
      if (isFile && isSize5m) {
        return true
      } else {
        return false
      }
    },
    // 上传
    async uploadHandle(fileData) {
      // 1. 处理FormData
      const { file } = fileData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      // 2. 上传并赋值
      const res = await uploadAPI(formData)
      const { id, url } = res.data
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url
      this.contractList.push({ name: file.name, url: url })
      // 单独校验表单
      this.$refs.addForm.validateField('contractId')
    },
    // 提交新合同
    async addHandel() {
      const startTime = this.rentForm.rentTime[0]
      const endTime = this.rentForm.rentTime[1]
      this.rentForm.startTime = startTime
      this.rentForm.endTime = endTime
      delete this.rentForm.rentTime
      await createRentAPI(this.rentForm)
      this.rentDialogVisible = false
    },

    async expandHandle(row, rows) {
      if (rows.includes(row)) {
        const res = await getRentListAPI(row.id)
        row.rentList = res.data
      }
    },
    // 退租
    async refund(id) {
      await outRentAPI(id)
      this.getFirmData()
    },
    // 删除
    del(row) {
      console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
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
</style>

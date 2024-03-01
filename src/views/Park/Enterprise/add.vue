<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ ($route.query.id) ? '编辑企业':'添加企业' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="addForm" label-width="100px" :model="addForm" :rules="rules">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select
                v-model="addForm.industryCode"
              >
                <el-option v-for="item in ProfessionList " :key="item.industryCode" :value="item.industryCode" :label="item.industryName" />

              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照">
              <el-upload
                class="avatar-uploader"
                action="https://api-hmzs.itheima.net/tj/upload"
                :show-file-list="false"
                :on-success="handleLicenseSuccess"
                :before-upload="beforeLicenseUpload"
                :http-request="UploadLicense"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="reset()">重置</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getProfessionLits, uploadAPI, addFirm, editingFirm, getFirmData } from '@/apis/firm'
import { validaeChineseName } from '@/utils/validate'
import { Message } from 'element-ui'
export default {
  data() {
    // 验证自定义验证
    var verify = (rule, value, callback) => {
      if (validaeChineseName(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的法人信息'))
      }
    }
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 行业编号
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      title: '', // 页面标题
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' },
          { validator: verify, trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '请输入所在行业', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入企业联系人', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        businessLicenseUrl: [
          { required: true, message: '请输入营业执照url', trigger: 'blur' }
        ],
        businessLicenseId: [
          { required: true, message: '请输入营业执照id', trigger: 'blur' }
        ]
      },
      // 行业列表
      ProfessionList: [],
      imageUrl: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getFrimList()
    }
    this.getProfessionData()
  },
  methods: {
    // 获取行业列表
    async getProfessionData() {
      const res = await getProfessionLits()
      this.ProfessionList = res.data
    },
    // 获取企业列表
    async getFrimList() {
      const res = await getFirmData(this.$route.query.id)
      const { name, legalPerson, registeredAddress, industryCode, industryName, businessLicenseUrl, businessLicenseName, businessLicenseId, contact, contactNumber } = res.data
      this.addForm = { name, legalPerson, registeredAddress, industryCode, industryName, businessLicenseUrl, businessLicenseName, businessLicenseId, contact, contactNumber }
      this.imageUrl = businessLicenseUrl
    },
    // 文件上传前
    beforeLicenseUpload(file) {
      const list = ['image/jpeg', 'image/png', 'image/jpg']
      const isJPG = list.includes(file.type)
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        Message.error('请上传jpg或者png图片')
        return false
      }
      if (!isLt3M) {
        Message.error('请上传小于3M的图片')
        return false
      }
      return isJPG && isLt3M
    },
    // 文件上传后
    handleLicenseSuccess() {
    },
    // 文件上传时的行为
    async UploadLicense(files) {
      const flier = new FormData()
      flier.append('file', files.file)
      flier.append('type', 'businessLicense')
      const res = await uploadAPI(flier)
      this.addForm.businessLicenseUrl = res.data.url// 新增文件url
      this.addForm.businessLicenseId = res.data.id
      this.imageUrl = this.addForm.businessLicenseUrl
    },
    // 重置表单
    reset() {
      this.$refs.addForm.resetFields()
      this.imageUrl = ''
    //   this.$refs[addForm].resetFields()
    },
    // 确认提交
    async addSubmit(addForm) {
      if (this.$route.query.id) {
        this.addForm.id = this.$route.query.id
        delete this.addForm.industryName
        delete this.addForm.businessLicenseName
        await editingFirm(this.addForm)
      } else {
        await this.$refs[addForm].validate()
        await addFirm(this.addForm)
      }
      this.$router.back()
    }

  }

}
</script>

  <style scoped lang="scss">
  .add-enterprise {
    background-color: #f4f6f8;
    height: 100vh;

    .add-header {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      height: 64px;
      line-height: 64px;
      font-size: 16px;
      font-weight: bold;
      background-color: #fff;

      .left {
        span {
          margin-right: 4px;
        }
        .arrow{
          cursor: pointer;
        }
      }

      .right {
        text-align: right;
      }
    }

    .add-main {
      background: #f4f6f8;
      padding: 20px 130px;

      .form-container {
        background-color: #fff;
        .title {
          height: 60px;
          line-height: 60px;
          padding-left:20px;
        }
        .form {
          margin-bottom: 20px;
          padding: 20px 65px 24px;
          .el-form{
            display: flex;
            flex-wrap: wrap;
            .el-form-item{
              width: 50%;
            }
          }
        }
      }
    }

    .add-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 24px 50px;
      color: #000000d9;
      font-size: 14px;
      background: #fff;
      text-align: center;
    }
  }
 ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  ::v-deep .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  ::v-deep .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>

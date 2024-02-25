<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>添加企业</span>
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
                <el-option v-for="item in ProfessionList " :key="item.industryCode" :value="item.industryName" />
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
        <el-button>重置</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getProfessionLits, uploadAPI } from '@/apis/firm'
import { validaeChineseName } from '@/utils/validate'
export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' },
          { validator: validaeChineseName, trigger: 'blur' }
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
    this.getProfessionData()
  },
  methods: {
    // 获取行业列表
    async getProfessionData() {
      const res = await getProfessionLits()
      this.ProfessionList = res.data
    },
    // 文件上传前
    beforeLicenseUpload() {

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
      this.imageUrl = res.data.url
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

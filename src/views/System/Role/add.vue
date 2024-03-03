<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>添加角色</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="newActive">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="newActive===0" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="roleForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="newActive===1" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="myTree"
                :data="item.children"
                :props="{ label: 'title',children:'children',disabled:'disabled' }"
                show-checkbox
                :default-expand-all="true"
                :check-strictly="true"
                node-key="id"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="newActive===2" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  :default-expand-all="true"
                  :check-strictly="true"
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled:()=>true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="last">上一步</el-button>
        <el-button type="primary" @click="next">{{ newActive===2 ? '完成':'下一步' }}</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getTreeListAPI, createRoleUserAPI, getRoleDetailAPI, updateRoleAPI } from '@/apis/system'
export default {
  data() {
    return {
      newActive: 0,
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeList: [],
      perms: []
    }
  },
  // 缓存roleId
  computed: {
    roleId() {
      return this.$route.query.id
    }
  },
  created() {
    console.log(this.roleId)
    this.getTreeList()
    if (this.roleId) {
      this.getRoleDetail()
    }
  },
  methods: {
    async last() {
      this.newActive > 0 && this.newActive--
      console.log(this.newActive)
    },
    async next() {
      if (this.newActive === 0) {
        await this.$refs.roleForm.validate()
        this.newActive <= 1 && this.newActive++
        // this.$nextTick(() => {
        //   this.$refs.diabledTree.forEach((item, index) => {
        //     item.setCheckedKeys(this.perms[index])
        //   })
        // })
      } else if (this.newActive === 1) {
        this.perms = []
        this.$refs.myTree.forEach(element => {
          const keys = element.getCheckedKeys()
          this.perms.push(keys)
        })
        if (this.perms.flat().length > 0) {
          this.newActive <= 1 && this.newActive++
          this.$nextTick(() => {
            this.$refs.diabledTree.forEach((item, index) => {
              item.setCheckedKeys(this.perms[index])
            })
          })
        }
      } else {
        this.newActive <= 1 && this.newActive++
        this.roleForm.perms = this.perms
        if (this.roleId) {
          await updateRoleAPI(this.roleForm)
        } else {
          // 添加
          await createRoleUserAPI(
            this.roleForm
          )
        }
        this.$router.back()
      }

      console.log(this.newActive)
    },
    // 树形列表
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      this.setFlagFn(this.treeList)
    },
    // 回填数据
    async getRoleDetail() {
      const res = await getRoleDetailAPI(this.roleId)
      const { perms, remark, roleId, roleName } = res.data
      // 回填基础表单
      this.roleForm = { perms, remark, roleId, roleName }
      this.$refs.diabledTree.forEach((tree, index) => {
        tree.setCheckedKeys(this.perms[index])
      })
    }

  }
}
</script>
  <style scoped lang="scss">
  .add-role {
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

        .arrow {
          cursor: pointer;
        }
      }

      .right {
        text-align: right;
      }
    }

    .add-main {
      position: fixed;
      top: 64px;
      bottom: 88px;
      width: 100%;
      overflow-y: auto;
      background: #f4f6f8;
      padding: 20px 230px;
      display: flex;
      .step-container {
        height: 400px;
        width: 200px;
      }
      .form-container {
        flex:1;
        background-color: #fff;
        overflow-y: auto;
        .title {
          height: 60px;
          line-height: 60px;
          padding-left: 20px;
        }
        .form {
          margin-bottom: 20px;
          padding: 20px 65px 24px;
          .el-form {
            display: flex;
            flex-wrap: wrap;
          }
          .info{
            font-size:14px;
            color:#666;
            .form-item{
              margin-bottom:20px;
            }
          }
        }
        .form-box{
          width: 600px;
          display: flex;
          flex-direction: column;
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
      z-index: 10001;
    }
    .tree-wrapper {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .tree-item {
          flex: 1;
          padding: 0px 4px;
          text-align: center;
          .tree-title {
            background: #f5f7fa;
            text-align: center;
            padding: 10px 0;
            margin-bottom: 12px;
          }
        }
      }
  }
  </style>

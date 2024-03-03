<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="item,index in system"
        :key="item.roleId"
        class="role-item"
        :class="{active:index===action}"
        @click="changeRole(index,item.roleId)"
      >
        <div class="role-info">
          <svg-icon icon-class="user" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <!-- <svg-icon icon-class="more" /> -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push(`/roleAdd?id=${item.roleId}`)">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="del(item.roleId)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/roleAdd')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="功能权限" name="feature">
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
        </el-tab-pane>

        <el-tab-pane :label="`成员(${total})`" name="member">
          <div class="user-wrapper">
            <el-table
              :data="roleUserList"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>

      </el-tabs>

    </div>
  </div>

</template>

<script>
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserListAPI, delRoleUserAPI } from '@/apis/system'
export default {
  name: 'Role',
  data() {
    return {
      system: [],
      action: 0,
      treeList: [], // 权限树形列表
      SelectArr: [], // 角色数组
      activeName: 'feature',
      total: null, // 成员总数
      roleUserList: []
    }
  },
  async created() {
    await this.getList()
    await this.getTreeList()
    this.getRoleDetaiList(this.system[0].roleId)
    this.getRoleUserList(this.system[0].roleId)
  },
  methods: {
    async getList() {
      const res = await getRoleListAPI()
      this.system = res.data
    },
    changeRole(index, roleId) {
      this.action = index
      this.getRoleDetaiList(roleId)// 角色节点集合
      this.getRoleUserList(roleId) // 调用获取角色关联的用户列表
    },
    // 树形列表
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      this.setFlagFn(this.treeList)
    },
    setFlagFn(treeList) {
      treeList.forEach(item => {
        item.disabled = true
        // 递归处理
        if (item.children) {
          this.setFlagFn(item.children)
        }
      })
    },
    // 角色节点集合
    async getRoleDetaiList(roleId) {
      const RoleRes = await getRoleDetailAPI(roleId)
      this.SelectArr = RoleRes.data.perms
      this.$refs.myTree.forEach((treeCompent, index) => {
        treeCompent.setCheckedKeys(this.SelectArr[index])
      })
    },
    handleClick() {

    },
    // 获取角色关联的用户列表
    async getRoleUserList(roleId) {
      const res = await getRoleUserListAPI(roleId)
      this.roleUserList = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    // 删除
    async del(roleId) {
      await delRoleUserAPI(roleId)
      this.getList()
    }
  }

}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>

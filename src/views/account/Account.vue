<template>
  <div class="box">
    <el-form
      ref="formInline"
      :model="formInline"
      :inline="true"
      class="merchantSubAcount"
    >

      <el-form-item class="submit">
        <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
        <el-button type="success" @click="addAdmin">
          <i class="el-icon-plus" />添加管理员
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      show-header
      empty-text="暂无数据"
      highlight-current-row
      element-loading-text="拼命加载中"
    >
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="角色类型" prop="role_Type" />
      <el-table-column label="所属组" prop="groupname" />
      <el-table-column label="销售数量" prop="actual_sell_num" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">修改</el-button>
          <el-button type="text" style="color: #478FCA" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center" style="margin-top:20px;padding-bottom:40px;">
      <el-pagination
        :current-page="pagination.currPage"
        :page-size="pagination.pageSize"
        :total="pagination.tatal"
        layout="total, prev, pager, next, jumper"
        small
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加管理员 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="addForm.username" auto-complete="off" />
        </el-form-item>
        <el-form-item label="选择分组：" prop="group_id">
          <el-select v-model="addForm.group_id" placeholder>
            <el-option v-for="i in groupData" :key="i.id" :label="i.group_name" :value="i.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!iv_dialog.isEdit" label="密码：" prop="password">
          <el-input v-model="addForm.password" :disabled="disabled" show-password auto-complete="off" />
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="addForm.phone" auto-complete="off" />
        </el-form-item>
        <el-form-item style="display:block;text-align:center;" label-width="0px">
          <el-button @click="iv_dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
          <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import request from "@/utils/request";
export default {
  data() {
    return {
      formLabelWidth: "100px",
      formInline: {
        currPage: 1,
        pageSize: 10
      },
      disabled:false,
      addForm: {
        username: "",
        phone: "",
        group_id: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        group_id: [
          { required: true, message: '请选择用户分组', trigger: 'change' }
        ],
        password: [
          { required: true, message: '设置登陆密码', trigger: 'blur' }
        ],
      },
      tableData: [],
      listLoading: true,
      pagination: {
        currPage: 1,
        pageSize: 10,
        tatal: 0
      },
      groupData: null,
      iv_dialog: {
        show: false,
        title: "添加管理员",
        isEdit: false,
        userId: null
      }
    };
  },
  mounted() {
    this.getTableDatas();
    this.getGroupData();
    this.addFormTmp = Object.assign({}, this.addForm)
  },
  methods: {
    // 获取表格数据
    getTableDatas() {
      const that = this;
      that.listLoading = true;
      const formInline = that.formInline;
      request({
        url: "/admin/index/getSysUserList?pageSize="+this.pagination.pageSize+"&currPage="+this.pagination.currPage,
        method: "get",
      }).then(response => {
        if (response.code === 200) {
          const result = response.data.sysUserList;
          // that.pagination.pageSize = response.data.pageSize
          that.pagination.tatal = response.data.totalNum;
          that.tableData = result;
          that.listLoading = false;
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    //获取用户组列表
    getGroupData() {
      request({
        url: "/admin/index/listGroup",
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          this.groupData = response.data;
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    // 查询
    onSubmit() {
      const that = this;
      that.formInline.page = 1;
      that.getTableDatas();
    },
    
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      const that = this;
      that.pagination.currPage = val;
      that.getTableDatas();
    },
    // 添加管理员
    addAdmin() {
      const that = this;
      that.iv_dialog.isEdit = false;
      that.iv_dialog.title = "添加管理员";
      that.iv_dialog.show = true;
      this.resetForm()
      that.addForm = Object.assign({}, this.addFormTmp)
    },
    submitForm(formName) {
      let that = this;
      if (that.iv_dialog.isEdit) {
        this.disabled = true
        this.postForm({ ...that.addForm, ...{ id: this.userId } }, formName);
      } else {
        this.postForm(this.addForm, formName);
      }
      
    },
    resetForm() {
      this.$nextTick(()=>{
        this.$refs['addForm'].resetFields();
      })                
    },
    //表单提交
    postForm(formData, formName) {
      const that = this;
      const addForm = formData;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/index/putSysUser",
            method: "post",
            data: addForm
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              that.resetForm(formName);
              that.iv_dialog.show = false;
              this.getTableDatas();
            } else {
              this.$message({
                message: response.msg,
                type: "warning"
              });
            }
            that.iv_dialog.isEdit = false;
          });
        } else {
          return false;
        }
      });
    },
    del(row) {
      this.$confirm('此操作将删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delPost(row)
      }).catch(() => {

      })
    },
    delPost(row) {
      request({
        url: '/admin/index/delSysUser/' + row.id,
        method: 'post'
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getTableDatas()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleRow(row) {
      let that = this;
      that.iv_dialog.isEdit = true;
      that.iv_dialog.show = true;
      this.resetForm()
      that.addForm.group_id = row.group_id;
      that.addForm.phone = row.phone;
      that.addForm.username = row.username;
      that.userId = row.id;
      that.iv_dialog.title = "修改管理员";
    }
  }
}
</script>

<style lang="scss">
.el-select {
  width: 100%;
}
</style>

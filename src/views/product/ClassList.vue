<template>
  <div class="box">
    <el-form
      ref="formInline"
      :model="formInline"
      :rules="formInline"
      :inline="true"
      class="merchantSubAcount"
    >

      <el-form-item class="submit">
        <el-button type="success" @click="addClass">
          <i class="el-icon-plus" />商品分类
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      fit
      border
      show-header
      empty-text="暂无数据"
      highlight-current-row
      element-loading-text="拼命加载中"
    >
      <el-table-column label="分类名称" prop="category_name" />
      <el-table-column prop="category_img" label="分类图片">
        <template slot-scope="scope">
          <img :src="scope.row.category_img" width="80" >
        </template>
      </el-table-column>
      <el-table-column label="商品类型" prop="regDate" />
      <el-table-column label="销售数量" prop="actual_sell_num" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">修改</el-button>
          <el-button type="text" style="color: #478FCA" @click="del(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 添加修改弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="110px">
        <el-form-item label="商品分类名称:" prop="category_name">
          <el-input v-model="addForm.category_name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序:" prop="sort_order">
          <el-input v-model="addForm.sort_order" type="number" auto-complete="off" />
        </el-form-item>
        <el-form-item label="上传分类图片:" prop="category_img">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="https://lv-uncle-api.ishaohuo.cn/index.php/api/upload/uploadImg"
          >
            <img v-if="addForm.category_img" :src="addForm.category_img" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">添加</el-button>
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
      id: "",
      rules: {
        category_name: [
          { required: true, message: '请编辑分类名称', trigger: 'blur' }
        ],
        category_img: [
          { required: true, message: '请上传分类图片', trigger: 'change' }
        ],
        sort_order: [
          { required: true, message: '请编辑排序', trigger: 'blur' }
        ],
      },
      formInline: {
        currPage: 1,
        pageSize: 10
      },
      tableData: [],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      addForm: {
        sort_order: null,
        category_img: "",
        category_name: ""
      },
      classTop: [],
      iv_dialog: {
        show: false,
        title: "",
        isEdit: false
      }
    };
  },
  mounted() {
    this.getTableDatas();
  },
  methods: {
    // 获取表格数据
    getTableDatas() {
      const that = this;
      that.listLoading = true;
      that.tableData = [];
      that.classTop = [];
      const formInline = that.formInline;
      request({
        url: "/admin/product/listCategory",
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          that.listLoading = false;
          let data = response.data;
          for (let i = 0; i < data.length; i++) {
            that.tableData.push(data[i]);
            let obj = {
              category_name: data[i].category_name,
              id: data[i].id
            };
            that.classTop.push(obj);
            if (data[i].subCategory && data[i].subCategory.length > 0) {
              for (let j = 0; j < data[i].subCategory.length; j++) {
                that.tableData.push(data[i].subCategory[j]);
              }
            }
          }
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    // 打开修改弹窗
    handleRow(row) {
      this.iv_dialog.show = true;
      this.resetForm()
      this.iv_dialog.title = "修改管理员分组";
      this.iv_dialog.isEdit = true;
      this.id = row.id;
      this.addForm.category_name = row.category_name;
      this.addForm.category_img = row.category_img;
      this.addForm.sort_order = row.sort_order;
    },
    // 查询
    onSubmit() {
      const that = this;
      that.formInline.page = 1;
      that.getTableDatas();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      const that = this;
      that.formInline.page = val;
      that.getTableDatas();
    },

    //上传成功
    handleAvatarSuccess(res, file) {
      this.addForm.category_img = file.response.filename;
    },
    //上传完文件验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submitForm(formName) {
      let that = this;
      if (that.iv_dialog.isEdit) {
        this.postForm({ ...that.addForm, ...{ id: this.id } }, formName);
      } else {
        this.postForm(this.addForm, formName);
      }
      this.iv_dialog.isEdit = false;
    },
    //添加商品分类
    addClass() {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "添加管理员分组";
      this.iv_dialog.isEdit = false;
      this.resetForm()
      this.addForm= {
        sort_order: null,
        category_img: "",
        category_name: ""
      }
    },
    postForm(form, formName) {
      // return
      let that = this;
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/putCategory",
            method: "post",
            data: form
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              that.iv_dialog.show = false;
              this.getTableDatas();
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    del(row){
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delPost(row)
        }).catch(() => {
             
        });
    },
    delPost(row){
      request({
        url: "/admin/product/delCategory/"+row.id,
        method: "post",
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getTableDatas();
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    resetForm() {
      this.$nextTick(()=>{
        this.$refs['addForm'].resetFields();
      })                
    },
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

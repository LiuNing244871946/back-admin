<template>
  <div class="box">
    <el-form
      ref="query"
      :model="query"
      :rules="query"
      :inline="true"
      class="merchantSubAcount"
    >
      <el-form-item prop="stockCode">
        <el-input
          v-model="query.exhibit_id"
          type="text"
          placeholder="用户ID"
          clearable
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-form-item prop="stockCode">
        <el-select v-model="query.order_type" placeholder="请选择">
          <el-option label="全部" value="0"/>
          <el-option label="普通订单" value="1"/>
          <el-option label="代理订单" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="stockName">
        <el-input
          v-model="query.keyword"
          type="text"
          placeholder="请输入订单号或手机号"
          clearable
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-date-picker
        v-model="query.time"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="success" @click="exportExcel">导出Excel</el-button>
        
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-tabs v-model="tabs" type="border-card" @tab-click="tabClick($event)">
      <el-tab-pane v-for="(item,index) in paneList" :key="index" :label="item.label" :name="item.name">
        <el-table
          v-loading="listLoading"
          :data="tableData"
          fit
          show-header
          empty-text="暂无数据"
          highlight-current-row
          element-loading-text="拼命加载中"
        >
          <el-table-column label="订单编号" prop="origin_order_number" />
          <el-table-column label="下单用户" prop="nick_name">
            <template slot-scope="scope">
              <div>
                <img :src="scope.row.headimgurl" alt="" style="width:80px">
                <p>{{ scope.row.nick_name }}/{{ scope.row.exhibit_id }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户ID" prop="exhibit_id" />
          <el-table-column label="价格" prop="total_price" />
          <el-table-column label="收货地址" prop="province_name">
            <template slot-scope="scope">
              <span>{{ scope.row.province_name }}{{ scope.row.city_name }}{{ scope.row.district_name }}{{ scope.row.detail_address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系人电话" prop="contact_number" />
          <el-table-column label="联系人姓名" prop="contact_name" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" align="center" style="margin-top:20px;padding-bottom:40px;">
          <el-pagination
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.tatal"
            layout="total, prev, pager, next, jumper"
            small
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-table
      style="display:none"
      :data="tableDataExcel"
      id="out-table"
      show-header
      empty-text="暂无数据"
      highlight-current-row
    >
      <el-table-column label="订单编号" prop="origin_order_number" />
      <el-table-column label="订单编号" prop="origin_order_number" />
      <el-table-column label="用户昵称" prop="nick_name" />
      <el-table-column label="用户ID" prop="exhibit_id" />
      <el-table-column label="价格" prop="total_price" />
      <el-table-column label="收货地址" prop="province_name">
        <template slot-scope="scope">
          <span>{{ scope.row.province_name }}{{ scope.row.city_name }}{{ scope.row.district_name }}{{ scope.row.detail_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" prop="contact_number" />
      <el-table-column label="联系人姓名" prop="contact_name" />
    </el-table>
    <!-- 添加修改弹窗 -->
    <el-dialog :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" status-icon label-width="100px">
        <el-form-item label="商品分类名称:">
          <el-input v-model="addForm.category_name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="addForm.sort_order" type="number" auto-complete="off" />
        </el-form-item>
        <el-form-item label="父级分类选择:">
          <el-select
            v-if="classTop && classTop.length>0"
            v-model="addForm.parent_cat_id"
            placeholder="选择父级分类"
          >
            <el-option label="不选择" value />
            <el-option v-for="i in classTop" :key="i.id" :label="i.category_name" :value="i.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传分类图片:">
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
          <el-button @click="iv_dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import request from "@/utils/request";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      id: "",
      tabs:"00",
      paneList:[
        {"label":"所有", name:"00"},
        {"label":"已付款", name:"01"},
        {"label":"未付款", name:"02"}
      ],
      query: {
        currPage: 1,
        pageSize: 10,
        exhibit_id: "",
        keyword:"",
        payment_status:'00',
        order_type:"",
        time:["",""]
      },
      tableData: [],
      tableDataExcel:[],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        tatal: 0
      },
      addForm: {
        sort_order: null,
        parent_cat_id: "",
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
      let begin_date = this.yymmddFormat(this.query.time[0])
      let end_date = this.yymmddFormat(this.query.time[1])
      request({
        url: "/admin/finance/getAllOriginalOrderList?currPage="+this.pagination.currentPage+"&pageSize="+this.pagination.pageSize+ "&payment_status="+ this.query.payment_status +"&exhibit_id="+this.query.exhibit_id+"&keyword="+this.query.keyword+"&begin_date="+begin_date+"&end_date="+end_date+"&order_type="+this.query.order_type,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          that.listLoading = false;
          let data = response.data;
          that.tableData = data.orderList
          that.pagination.tatal = data.totalNum
          this.getTableDatasExcal()
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    getTableDatasExcal() {
      const that = this;
      that.classTop = [];
      let begin_date = this.yymmddFormat(this.query.time[0])
      let end_date = this.yymmddFormat(this.query.time[1])
      request({
        url: "/admin/finance/getAllOriginalOrderList?currPage=1"+"&pageSize="+this.pagination.tatal+ "&payment_status="+ this.query.payment_status +"&exhibit_id="+this.query.exhibit_id+"&keyword="+this.query.keyword+"&begin_date="+begin_date+"&end_date="+end_date+"&order_type="+this.query.order_type,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          let data = response.data;
          that.tableDataExcel = data.orderList
        }
      });
    },
    // 打开修改弹窗
    handleRow(row) {
      this.$router.push({
        path: '/admin/order/originalOrderDetail',
        query: { orderId: row.id }
      });
    },
    tabClick(el){
      let name = el.name
      this.query.payment_status = name
      this.getTableDatas()
    },
    // 查询
    onSubmit() {
      const that = this;
      that.query.currPage = 1;
      that.getTableDatas();
    },
    
    handleCurrentChange(val) {
      const that = this;
      this.pagination.currentPage = val
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
        console.log(this.id);
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
    },
    postForm(form, formName) {
      // return
      let that = this;
      this.$refs[formName].validate(valid => {
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
              that.resetForm(formName);
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    yymmddFormat(newDate) {
      if(newDate){
        let Month = newDate.getMonth() + 1;
        Month = Month >= 10 ? Month : '0' + Month;
        let d = newDate.getDate();
        d = d >= 10 ? d : '0' + d
        return [
          [newDate.getFullYear(), Month, d].join('-'), [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(':')
        ].join(' ');
      }else{
        return ""
      }
    },
    exportExcel() {
    /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
      });
      try {
          FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "原始订单列表.xlsx"
          );
      } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
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

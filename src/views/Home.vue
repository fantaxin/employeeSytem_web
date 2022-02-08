<template>
  <div style="margin: 0 10px 10px 10px">
    <div style="margin: 10px 0; display: flex">
      <el-form :model="search_form">
        <el-input v-model="search_form.id" clearable style="margin-right: 5px; width:220px" placeholder="请输入工号"></el-input>
        <el-input v-model="search_form.name" clearable style="margin-right: 5px; width:220px" placeholder="请输入姓名"></el-input>
        <el-input v-model="search_form.department" clearable style="margin-right: 5px; width:220px" placeholder="请输入部门名称"></el-input>
        <el-input v-model="search_form.post" clearable style="margin-right: 5px; width:220px" placeholder="请输入职位"></el-input>
      </el-form>
      <el-button type="primary" @click="search" style="width: 150px;"><el-icon class="el-icon--left"><search/></el-icon>查询</el-button>
      <el-button type="primary" @click="add_btn" style="width: 150px; margin-left:115px">新增</el-button>
    </div>
    <div :default-sort="{ prop: 'id', order: 'descending' }">
<!--      max-height="586px"-->
      <el-table :data="tableData" style="width: 100%" border="true" stripe="true">
        <el-table-column prop="id" label="工号" sortable/>
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="department" label="所在部门" sortable/>
        <el-table-column prop="post" label="职位" sortable/>
        <el-table-column prop="salary" label="工资" sortable/>
        <el-table-column prop="entryDate" label="入职日期" sortable/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="edit_btn(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗?" @confirm="del_btn(scope.$index, scope.row)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:10px; display: flex">
        <el-pagination
          v-model:currentPage="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <div>
        <el-dialog v-model="dialogFormVisible" title="新增员工" width="500px" style="padding: 10px 20px">
          <el-form :model="add_form" style="margin: 0px 10px">
            <div style="display: flex">
              <el-form-item label="姓名" style="margin-right: 10px" autocomplete="off">
                <el-input v-model="add_form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" style="margin-right: 10px">
                <el-select v-model="add_form.sex" placeholder="性别">
                  <el-option label="男" value=0></el-option>
                  <el-option label="女" value=1></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年龄" style="width: 150px">
                <el-input-number v-model="add_form.age" :min="18" :max="70"/>
              </el-form-item>
            </div>
            <div style="display: flex">
              <el-form-item label="所属部门" style="margin-right: 10px">
                <el-select v-model="add_form.departmentId" placeholder="部门">
                  <el-option v-for="department in departments" :label="department.name" :value="department.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职位">
                <el-select v-model="add_form.postId" placeholder="职位">
                  <el-option v-for="post in posts" :label="post.name" :value="post.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item label="工资" style="width: 226px">
              <el-input v-model="add_form.salary" type="number" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="submit">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import request from "@/utils/request";
import qs from "qs";

const {ref} = require("@vue/reactivity");

export default {
  name: "Home",
  components: {},
  data() {
    return {
      search_form: {},
      add_form: {},
      total: 10,
      tableData: [],
      departments: [],
      posts: [],
      operate: 0,//默认为add操作
      currentPage: 1,
      pageSize: 13,
      index: 0,
      dialogFormVisible: false,
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.dataInit();
    })
  },
  methods: {
    dataInit(){
      request.get("http://localhost:8081/employee/dataInit-departments").then(res => {
        this.departments=res.data;
        console.log("dataInit-departments",res);
      });
      request.get("http://localhost:8081/employee/dataInit-posts").then(res => {
        this.posts=res.data;
        console.log("dataInit-posts",res);
      });
    },
    handleCurrentChange(){
      this.search();
    },
    edit_btn(index, row){
      this.index = index;
      this.add_form={};
      this.add_form.id = this.tableData[index].id;
      this.add_form.name = row.name;
      this.add_form.sex = row.sex;
      this.add_form.age = row.age;
      this.add_form.departmentId = row.departmentId;
      this.add_form.postId = row.postId;
      this.add_form.salary = row.salary;
      this.operate=1;
      this.dialogFormVisible=true;
    },
    del_btn(index, row){
      console.log(row.id);
      this.index = index;
      let id = this.tableData[index].id;
      request.delete("http://localhost:8081/employee/del"+id).then(res => {
        this.$message({
          type: "success",
          message: "删除成功"
        })
        this.search();
        // this.tableData.splice(index,1);
      })
    },
    add_btn(){
      this.add_form={};
      this.operate=0;
      this.dialogFormVisible=true;
    },
    submit(){
      if(this.operate===0) {
        var d = new Date();
        this.add_form.entryDate = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
        request.post("http://localhost:8081/employee/add", this.add_form).then(res => {
          res.data.department = this.departments[res.data.departmentId - 1].name;
          res.data.post = this.posts[res.data.postId - 1].name;
          this.tableData.unshift(res.data);
          this.tableData.splice(this.pageSize,1);
          this.total+=1;
        })
      } else{
        request.put("http://localhost:8081/employee/edit", this.add_form).then(res => {
          this.tableData[this.index].name = res.data.name;
          this.tableData[this.index].sex = res.data.sex;
          this.tableData[this.index].age = res.data.age;
          this.tableData[this.index].departmentId = res.data.departmentId;
          this.tableData[this.index].postId = res.data.postId;
          this.tableData[this.index].salary = res.data.salary;
      })}
      this.dialogFormVisible=false;
    },
    search(){
      request.get("http://localhost:8081/employee/search", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          id: this.search_form.id,
          name: this.search_form.name,
          departmentName: this.search_form.department,
          postName: this.search_form.post
        }
      }).then(res => {
        for(let i = 0;i<res.data.records.length;i++) {
          res.data.records[i].department = this.departments[res.data.records[i].departmentId - 1].name;
          res.data.records[i].post = this.posts[res.data.records[i].postId - 1].name;
        }
        this.tableData=res.data.records;
        this.total = res.data.total;
      })
    }
  }
};
</script>

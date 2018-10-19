<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" type="primary" plain @click="handleCreate">添加类别</el-button>
      <el-input v-model="listQuery.keyword" clearable size="small" placeholder="请输入名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item" @keyup.enter.native="getList" @clear="getList"/>
      <el-select v-model="listQuery.parentId" clearable size="small" placeholder="请选择" style="width: 200px; margin-left: 10px; margin-bottom:1px;" @clear="getList" @change="getList">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </el-select>
      <!-- <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button> -->
    </div>

    <div style="margin-bottom:1px"/>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="id" prop="id" align="center" width="60px"/>
      <el-table-column label="类别名称" prop="name" align="center"/>
      <el-table-column label="上级类别" prop="praentId" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" circle>编辑</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="margin-bottom:20px"/>
    <div class="block">
      <el-pagination
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        :total="total"
        layout="prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        style="text-align: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 弹出框 -->
    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible" style="width: 1110px; margin-left: auto; margin-right: auto;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="上级类别" prop="praentId">
          <el-select v-model="temp.praentId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="类别名称" prop="name">
          <el-input v-model="temp.name" value="name" placeholder="类别名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='添加类别'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, parent, create } from '@/api/type'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      options: null,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        parentId: ''
      },
      temp: {
        id: '',
        name: '',
        praentId: -1,
        status: '',
        createdAt: ''
      },
      rules: {
        name: [
          { required: true, message: '地区名称不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getList()
    this.getParent()
  },

  methods: {
    // 获取列表
    getList() {
      this.listLoading = true

      list(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.pageSize
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      }).catch(() => {

      })
    },

    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        praentId: ''
      }
    },

    // 查询所有父级学校类别
    getParent() {
      parent().then(data => {
        data.data.unshift({ name: '顶级分类', id: 0 })
        this.options = data.data
        this.temp.praentId = 0
      }).catch(() => {

      })
    },

    // 添加类别
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = '添加类别'
      this.dialogFormVisible = true
      this.getParent()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.praentId === '') {
            this.temp.praentId = 0
          }
          create(this.temp).then(data => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message: data.msg
              })
              this.getList()
              this.getParent()
            } else {
              return false
            }
          })
        }
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }

}
</script>

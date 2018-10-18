<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
      <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain @click="getList">搜索</el-button>
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
      <el-table-column label="id" prop="areaid" align="center" width="60px"/>
      <el-table-column label="地区名称" prop="name" align="center"/>
      <el-table-column label="地区缩拼" prop="initials" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '停用' : '启用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" @click="operatingData(scope.row.areaid)">
              {{ scope.row.status == 1 ? "停用" : "启用" }}
            </el-button>
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

  </div>
</template>

<script>
import { list, operating } from '@/api/area'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      temp: {
        areaid: '',
        name: '',
        initials: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '连接名称不能为空', trigger: 'change' }
        ],
        url: [
          { required: true, message: '连接地址不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getList()
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
      })
    },

    // 操作地区（停用启用）
    operatingData(id) {
      this.$confirm('您确定操作此地区吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        operating(id).then(data => {
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: data.msg
            })
            this.getList()
          } else {
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
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

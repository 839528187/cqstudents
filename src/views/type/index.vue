<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" size="small" placeholder="请输入名称" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
      <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select> -->
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

  </div>
</template>

<script>
import { list } from '@/api/type'
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
        id: '',
        name: '',
        praentId: '',
        status: '',
        createdAt: ''
      },
      rules: {
        name: [
          { required: true, message: '地区名称不能为空', trigger: 'change' }
        ],
        initials: [
          { required: true, message: '地区栏目连接不能为空', trigger: 'change' }
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

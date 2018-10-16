<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" placeholder="请输入手机号" style="width: 200px; margin-left: 10px; margin-bottom:1px;" class="filter-item"/>
      <el-button size="small" type="primary" style="margin-left: 10px; margin-bottom:1px;" plain>搜索</el-button>
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
      <el-table-column label="姓名" prop="name" align="center"/>
      <el-table-column label="手机号" prop="phone" align="center"/>
      <el-table-column label="类型" prop="type" align="center"/>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ scope.row.status == 2 ? '已处理' : '未处理' }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createdAt" align="center"/>
      <el-table-column label="操作" prop="status" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-row>
            <el-button type="text" @click="getView(scope.row.id)">查看</el-button>
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

    <!--详情-->
    <el-dialog :visible.sync="dialogFormVisibles" title="留言详情" style="width: 1110px; margin-left: auto; margin-right: auto;">
      <div class="demo-input-suffix">
        真实姓名: {{ temp.name }}
      </div>
      <div class="demo-input-suffix">
        留言手机号: {{ temp.phone }}
      </div>
      <div class="demo-input-suffix">
        意向专业: {{ temp.specialty }}
      </div>
      <div class="demo-input-suffix">
        qq号码: {{ temp.qq }}
      </div>
      <div class="demo-input-suffix">
        家庭地址: {{ temp.address }}
      </div>
      <div class="demo-input-suffix">
        分数线: {{ temp.score }}
      </div>
      <div class="demo-input-suffix">
        学历: {{ temp.education }}
      </div>
      <div class="demo-input-suffix">
        学校id: {{ temp.school_id }}
      </div>
      <div class="demo-input-suffix">
        备注: {{ temp.remark }}
      </div>
      <div class="demo-input-suffix">
        留言状态: {{ temp.status }}
      </div>
      <div class="demo-input-suffix">
        留言类型: {{ temp.type }}
      </div>
      <div class="demo-input-suffix">
        添加时间: {{ temp.createdAt }}
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, view } from '@/api/leave'
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogFormVisibles: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      temp: {
        id: '',
        name: '',
        phone: '',
        status: '',
        createdAt: '',
        type: '',
        specialty: '',
        qq: '',
        address: '',
        score: '',
        education: '',
        school_id: '',
        remark: '',
        scloolName: ''
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
      list(this.listQuery, this.temp.keyword).then(response => {
        this.list = response.data.data
        this.total = response.data.pageSize

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },

    getView(id) {
      this.listLoading = false
      this.dialogFormVisibles = true
      view(id).then(response => {
        if (response.code === 200) {
          this.temp = response.data
        } else {
          return false
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


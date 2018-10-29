<template>
  <div class="app-container">
    <el-upload
      v-loading="listLoading"
      ref="upload"
      :action="actionUrl"
      :data="datas"
      :headers="uploadHeaders"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="list"
      :limit="limit"
      :on-change="onSuccess"
      :on-exceed="onExceed"
      :auto-upload="false"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="temp.name">
      <img :src="temp.url" width="100%" alt="">
    </el-dialog>

    <!--上传环境图片输入名称-->
    <div v-if="entourageListVisible">
      <el-dialog :visible.sync="entourageListVisible" title="专业介绍" style="width: 50%; margin-left: auto; margin-right: auto;">
        <el-form ref="dataForm" :model="datas" label-position="left" label-width="80px" style="width: 90%; margin-left:50px;">
          <el-form-item label="环境名称" prop="name">
            <el-input v-model="datas.name" value="name" placeholder="环境名称"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ChangeCancel">取消</el-button>
          <el-button type="primary" @click="submitUpload()">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { getToken } from '@/utils/auth'
import { list } from '@/api/entourage'
export default {
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      entourageListVisible: false,
      limit: 6,
      count: 0,
      list: [],
      actionUrl: this.uploadUrl + '/milieus', // 上传图片链接
      listQuery: {
        schoolId: this.$route.params.id
      },
      datas: {
        'name': '',
        'location': 'milieus'
      },
      temp: {
        'url': '',
        'name': '',
        'id': ''
      },
      uploadHeaders: {
        'usertoken': getToken()
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    // 环境图片列表
    async getList() {
      this.listLoading = true
      var data = await list(this.listQuery)
      this.list = data.data
      this.count = data.count
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 200)
    },

    resetTemps() {
      this.mapping = {
        id: '',
        name: '',
        url: ''
      }
    },

    ChangeCancel() {
      this.entourageListVisible = false
      this.resetTemps()
      this.getList()
    },

    submitUpload() {
      this.$refs.upload.submit()
    },

    handleRemove(file, fileList) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.temp = file
      this.dialogVisible = true
    },

    onSuccess() {
      this.entourageListVisible = true
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message({
          message: '上传图片大小不能超过 1MB!',
          type: 'error'
        })
      }
      if (!isJPG && !isPNG) {
        this.$message({
          message: '上传的图片必须是JGP,PNG格式',
          type: 'error'
        })
      }
      return isLt2M && (isJPG || isPNG)
    },

    onExceed() {
      this.$message({
        message: '环境最多上传' + this.limit + '张图片',
        type: 'error'
      })
    }

  }
}
</script>

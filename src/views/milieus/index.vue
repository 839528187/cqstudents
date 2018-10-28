<template>
  <div class="app-container">
    <el-upload
      :action="actionUrl"
      :data="datas"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      actionUrl: this.uploadUrl + '/milieus', // 上传图片链接
      datas: {
        'name': '2323232',
        'www': '233'
      },
      uploadHeaders: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

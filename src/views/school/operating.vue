<template>
  <div class="createPost-container">
    <el-form ref="schoolForm" :rules="rules" :model="temp" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />-->
        <!-- <SourceUrlDropdown v-model="postForm.source_uri" />  -->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success">提交
        </el-button>
        <!-- <el-button v-loading="loading" type="warning">草稿箱</el-button> -->
        <el-button v-loading="loading" type="info" @click="listSchool">返回列表</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-bottom: 40px;" prop="schoolName">
              <MDinput v-model="temp.schoolName" :maxlength="100" value="schoolName" name="name" required>
                学校名称
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="所属地区:" prop="areaId" class="postInfo-container-item">
                    <el-select v-model="temp.areaId" placeholder="请选择分类">
                      <el-option v-for="lo in cateList" :label="lo.cateName" :value="lo.id" :key="lo.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="学校类别:" prop="typeId" class="postInfo-container-item">
                    <el-select v-model="temp.typeId" placeholder="请选择分类">
                      <el-option v-for="lo in cateList" :label="lo.cateName" :value="lo.id" :key="lo.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="18">
                  <el-form-item label="办学层次">
                    <el-radio-group v-model="temp.schoolLevel" size="medium">
                      <el-radio border label="1">国家示范校</el-radio>
                      <el-radio border label="2">国家级重点</el-radio>
                      <el-radio border label="3">省部级重点</el-radio>
                      <el-radio border label="4">合格</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="办学性质">
                    <el-radio-group v-model="temp.schoolNature" size="medium">
                      <el-radio border label="1">公办</el-radio>
                      <el-radio border label="2">民办</el-radio>
                      <el-radio border label="3">企业办</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="是否推荐:" prop="isRecommend" class="postInfo-container-item">
                    <el-radio-group v-model="temp.isRecommend" size="medium">
                      <el-radio border label="1">推荐</el-radio>
                      <el-radio border label="2">不推荐</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="学校状态:" prop="status" class="postInfo-container-item">
                    <el-radio-group v-model="temp.status" size="medium">
                      <el-radio border label="2">待审核</el-radio>
                      <el-radio border label="1">发布</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-form-item label="学校logo:" prop="logo">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
                action="http://api.meishiadd.com/v1/upload">
                <img v-if="temp.logo" :src="temp.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>

            <div class="editor-container">
              <Tinymce ref="editor" :height="400" v-model="temp.content" />
            </div>

          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { create, findone, update } from '@/api/foodNews'
// import { list } from '@/api/category'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  status: '',
  schoolName: '', // 文章题目
  logo: '', // 文章内容
  areaId: '', // 文章摘要
  typeId: '', // 文章外链
  schoolLevel: '', // 文章图片
  schoolNature: '', // 文章图片
  isRecommend: '', // 文章图片
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  components: { MDinput, Sticky, Tinymce },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  // 数据
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogStatus: '',
      temp: {
        areaId: '',
        typeId: '',
        schoolName: '',
        logo: '',
        schoolLevel: '',
        schoolNature: '',
        isRecommend: '1',
        status: '2',
        schoolProfile: ''
      },

      upload: {
        imgUrl: '',
        url: ''
      },

      cateList: {
        id: '',
        cateName: ''
      },

      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        cateName: [
          { required: true, message: '分类必须选择', trigger: 'change' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'change' }
        ],
        keywords: [
          { required: true, message: '关键词不能为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.getCateList()
    if (this.$route.params.id != null) {
      this.getFindOne()
    }
  },

  // 方法
  methods: {
    // handleAvatarSuccess(res, file) {
    //   console.log(res, file)
    //   this.upload.url = res.data.imgUrl
    //   this.temp.imgUrl = res.data.url
    //   this.temp.thumb = res.data.url + res.data.imgUrl
    //   const location = 'school'
    //   // this.upload.imgUrl = URL.createObjectURL(file.raw);
    // },
    // beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg'
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isLt2M) {
    //     this.$msg.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isLt2M
    // },

    listSchool() {
      this.$router.push('/school/list')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

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

.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
        width: 300px;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>


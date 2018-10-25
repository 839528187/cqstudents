<template>
  <div class="createPost-container">
    <el-form ref="newsForm" :rules="rules" :model="temp" class="form-container">
      <sticky :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="caozuo()">提交</el-button>
        <el-button v-loading="loading" type="info" @click="skipNewsList">返回列表</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="temp.title" :maxlength="100" value="title" name="name" required>
                标题
              </MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" prop="keywords">
              <MDinput v-model="temp.keywords" :maxlength="100" placeholder="每个关键词用空格隔开" value="keywords" name="name" required>
                关键词
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="所属学校:" size="small" prop="schoolId" class="postInfo-container-item">
                    <el-select
                      v-model="temp.schoolId"
                      :remote-method="getSchoolSearch"
                      :loading="loading"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入学习名称">
                      <el-option
                        v-for="item in school"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="所属分类:" prop="categoryId" class="postInfo-container-item">
                    <el-cascader :options="category" style="width: 210px; margin-left: 10px; margin-bottom:1px;" size="small" clearable placeholder="分类搜索-可以搜索分类名称" filterable @change="changeCategory"/>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="作者:" prop="author" class="postInfo-container-item">
                    <el-input v-model="temp.author" size="small" placeholder="作者" style="width: 200px"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-form-item label="缩略图:" prop="thumb">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
                action="http://localhost:9528/upload">
                <img v-if="temp.thumb" :src="temp.thumb" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" label-width="60px" label="描述:" prop="description">
              <el-input :rows="1" v-model="temp.description" type="textarea" class="article-textarea" placeholder="输入描述"/>
              <span class="word-counter">{{ temp.description.length }}字符</span>
            </el-form-item>

            <div class="editor-container">
              <Tinymce ref="editor" :height="600" :with="400" v-model="temp.centent" />
            </div>

          </el-col>
        </el-row>
      </div>

    </el-form>
  </div>
</template>

<script>
import { create, findOne } from '@/api/news'
import { schoolSearch } from '@/api/school'
import { newsSearch } from '@/api/category'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'

const defaultForm = {
  status: '',
  title: '',
  schoolId: '',
  categoryId: '',
  keywords: '',
  author: '',
  thumb: '',
  description: '',
  centent: '',
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

  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      school: [],
      category: [],
      schoolSearchName: '',
      temp: {
        id: '',
        schoolId: '',
        categoryId: '',
        title: '',
        keywords: '',
        description: '',
        thumb: '',
        author: '',
        centent: '',
        imgUrl: ''
      },

      upload: {
        imgUrl: '',
        url: ''
      },

      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        categoryId: [{ required: true, message: '所属分类不能为空', trigger: 'change' }],
        author: [{ required: true, message: '作者不能为空', trigger: 'change' }],
        thumb: [{ required: true, message: '缩略图不能为空', trigger: 'change' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'change' }],
        centent: [{ required: true, message: '内容不能为空', trigger: 'change' }]
      }
    }
  },

  created() {
    this.getCategorySearch()
    if (this.$route.params.id != null) {
      this.getFindOne()
    }
  },

  methods: {
    // 查询学校
    getSchoolSearch() {
      schoolSearch(this.schoolSearchName).then(data => {
        this.school = data.data
      })
    },

    skipNewsList() {
      this.$router.push('/news/list')
    },

    // 查询分类
    getCategorySearch() {
      newsSearch().then(data => {
        this.category = data.data
      })
    },

    caozuo() {
      if (this.$route.params.id != null) {
        this.updateData()
      } else {
        this.createData()
      }
    },

    // 添加新闻
    createData() {
      this.dialogStatus = '添加'
      this.$refs['newsForm'].validate(valid => {
        if (valid) {
          this.temp.thumb = this.upload.url
          this.temp.imgUrl = this.upload.url
          create(this.temp).then(data => {
            if (data.code === 200) {
              this.$notify({
                message: data.msg,
                type: 'success'
              })
              this.$router.push('/news/list')
            } else {
              return false
            }
          })
        }
      })
    },

    // 编辑时获取新闻
    getFindOne() {
      this.listLoading = true
      findOne(this.$route.params.id).then(response => {
        this.temp = response.data // copy obj
        // Just to simulate the time of the request
        this.school.unshift({ id: response.data.schoolId, name: response.data.schoolName })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 200)
      })
    },

    changeCategory(val) {
      this.temp.categoryId = val[val.length - 1]
    },

    handleAvatarSuccess(res, file) {
      this.upload.url = res.data.imgUrl
      this.temp.imgUrl = res.data.url
      this.temp.thumb = res.data.url + res.data.imgUrl
      // this.upload.imgUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
    //   const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$msg.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
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
        width: 303px;
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


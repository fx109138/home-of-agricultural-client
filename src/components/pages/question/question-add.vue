<template>
  <transition name="slide">
    <div class="question-add">
      <mt-header fixed title="发起提问">
        <mt-button @click.native="$router.go(-1)" icon="back" slot="left">返回</mt-button>
        <div slot="right" @click="submit">
          提问
        </div>
      </mt-header>
      <mt-field placeholder="在此输入问题标题" :attr="{ maxlength: 20 }" v-model="title"></mt-field>
      <mt-field placeholder="在此输入问题详细描述" type="textarea" rows="6" v-model="content"></mt-field>
      <div class="tag-wrapper">
        <div>问题标签：{{tag}}</div>
        <mt-button @click.native="tagRadio = true" type="primary" size="small">选择问题标签</mt-button>
      </div>
      <uploader @addImage="addImage" @success="uploadSuccess" @empty="clearImage" :src="'/upload/question'"/>
      <mt-popup @click.native="tagRadio = false" v-model="tagRadio" class="tag-radio">
        <mt-radio align="right" v-model="tag" :options="tags"></mt-radio>
      </mt-popup>
    </div>
  </transition>
</template>

<script>
  import { BASE_API_PATH } from '@/common/js/util'
  import Uploader from '@/components/abstract/uploader'
  import { Toast } from 'mint-ui'
  import { accountTestMixin } from '@/common/js/mixin'
  export default {
    mixins: [ accountTestMixin ],
    data () {
      return {
        tag: '',
        tags: [],
        value: '',
        tagRadio: false,
        content: '',
        title: '',
        hasImage: false,
        images: []
      }
    },
    components: {
      Uploader
    },
    mounted () {
      this.getTag()
    },
    methods: {
      submit () {
        if (this.hasImage) {
          Toast({
            message: '有未上传的图片，请上传完毕或取消上传后再继续',
            position: 'bottom',
            duration: 3000
          })
          return
        }
        if (!this.title || !this.content) {
          Toast({
            message: '标题或内容不能为空',
            position: 'bottom',
            duration: 3000
          })
          return
        }
        if (!this.tag) {
          Toast({
            message: '请选择问题标签',
            position: 'bottom',
            duration: 3000
          })
          return
        }
        this.$axios.post(BASE_API_PATH + '/question/addQuestion', {
          title: this.title,
          content: this.content,
          tag: this.tag,
          images: this.images
        }).then(res => {
          if (res.data.code === 200) {
            Toast({
              message: '提问成功',
              position: 'bottom',
              duration: 2000
            })
            this.$router.replace('/question/addQuestion?tag=' + this.tag)
            this.$router.go(-1)
          }
        })
      },
      clearImage () {
        this.hasImage = false
      },
      addImage () {
        this.hasImage = true
      },
      uploadSuccess (images) {
        this.images = images
        Toast({
          message: '上传图片成功',
          position: 'bottom',
          duration: 2000
        })
        this.hasImage = false
      },
      getTag () {
        this.$axios.get(BASE_API_PATH + '/question/getTags').then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach(element => {
              this.tags.push(element.tagName)
            })
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../assets/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .question-add
    position fixed
    overflow-y auto
    top 0
    bottom 0
    left 0
    right 0
    z-index 100
    background $color-article-background
    padding-top 50px
    .tag-wrapper
      display flex
      justify-content space-between
      padding 5px 20px
      align-items: center
    .tag-radio
      width 90%
      overflow-y auto
      height 80%
      background-color $color-article-background
</style>

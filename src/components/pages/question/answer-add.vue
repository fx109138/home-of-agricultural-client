<template>
  <transition name="slide">
    <div class="answer-add">
      <mt-header fixed title="添加回答">
        <mt-button @click.native="$router.go(-1)" icon="back" slot="left">返回</mt-button>
        <div slot="right" @click="submit">
          回答
        </div>
      </mt-header>
      <mt-field placeholder="在此输入答案" type="textarea" rows="6" v-model="content"></mt-field>
      <uploader @addImage="addImage" @success="uploadSuccess" @empty="clearImage" :src="'/upload/answer'"/>
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
        content: '',
        title: '',
        hasImage: false,
        images: []
      }
    },
    components: {
      Uploader
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
        if (!this.content) {
          Toast({
            message: '内容不能为空',
            position: 'bottom',
            duration: 3000
          })
          return
        }
        this.$axios.post(BASE_API_PATH + '/question/addAnswer', {
          questionId: this.$route.params.questionId,
          content: this.content,
          images: this.images
        }).then(res => {
          if (res.data.code === 200) {
            this.$socket.emit('answer', this.token, this.$route.params.questionId)
            this.$router.replace(this.$route.path + '?flag=true')
            this.$router.go(-1)
          }
        })
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
      clearImage () {
        this.hasImage = false
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
  .answer-add
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 100
    padding-top 50px
    background $color-article-background
</style>

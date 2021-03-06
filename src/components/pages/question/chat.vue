<template>
  <transition name="slide">
    <div class="chat">
      <mt-header fixed :title="this.$route.query.userName">
        <mt-button @click.native="$router.go(-1)" icon="back" slot="left">返回</mt-button>
      </mt-header>
      <div class="main-wrapper" ref="main">
        <mt-loadmore :top-method="loadTop" ref="loadmore">
          <ul class="messages">
            <div class="load-hint" v-show="messageList.length >= 30">{{hint}}</div>
            <li  v-for="(item, index) in messageList" :key="index" ref="li">
              <div v-if="item.type==='text'" :class="item.sender!==myId?'message-item':'message-item right'">
                <span>{{item.content}}</span>
              </div>
              <div v-if="item.type==='image'" :class="item.sender!==myId?'message-item':'message-item right'">
                <img @click.stop="showBigImage(`http://39.106.41.253:7001/public/chat/${item.content}`)" :src="`http://39.106.41.253:7001/public/chat/${item.content}`" alt="" width="120px" height="120px">
              </div>
            </li>
          </ul>
        </mt-loadmore>
      </div>
      <div class="input-wrapper">
        <div class="input-area">
          <div class="btn-add" @click="sendImage">+</div>
          <mt-field class="input-text" type="text" v-model="message"></mt-field>
          <mt-button @click.native="sendMessage" class="btn-submit" type="primary" size="small" >发送</mt-button>
        </div>
        <div class="uploader-wrapper" v-show="showUploader">
          <uploader :submitText="'发送图片'" :once="true" @addImage="addImage" @success="uploadSuccess" @empty="clearImage" :src="'/upload/chat'"/>
        </div>
      </div>
      <div @click="hideImage" v-if="showImage" class="image-wrapper">
        <img class="big-image" :src="currentImage" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
  import { BASE_API_PATH } from '@/common/js/util'
  import Uploader from '@/components/abstract/uploader'
  import { showImageMixin, accountTestMixin } from '@/common/js/mixin'
  export default {
    mixins: [ showImageMixin, accountTestMixin ],
    data () {
      return {
        message: '',
        messageList: [],
        hint: '下拉加载更多',
        showUploader: false,
        hasImage: false
      }
    },
    components: {
      Uploader
    },
    mounted () {
      this.userId = this.$route.query.userId
      this.getData()
    },
    beforeDestroy () {
      this.$socket.emit('read', this.token, this.userId)
    },
    methods: {
      getData (callback) {
        let chatId = this.myId < this.$route.query.userId ? this.myId + this.$route.query.userId : this.$route.query.userId + this.myId
        let time = this.messageList.length ? this.messageList[0].time : new Date().toISOString()
        this.$axios.get(BASE_API_PATH + `/question/getChat/${chatId}/${time}`).then(res => {
          if (res.data.code === 200) {
            if (!callback) {
              this.messageList = res.data.data
              this.$nextTick(() => {
                if (this.messageList.length) {
                  this.$refs.li[this.messageList.length - 1].scrollIntoView()
                }
              })
            } else {
              if (res.data.data.length) {
                this.messageList.unshift(...res.data.data)
              } else {
                this.hint = '已无更多消息'
              }
              callback()
            }
          }
        })
      },
      loadTop () {
        this.getData(this.$refs.loadmore.onTopLoaded)
      },
      sendImage () {
        if (this.showUploader) {
          this.showUploader = false
          this.$refs.main.style['bottom'] = '48px'
        } else {
          this.showUploader = true
          this.$refs.main.style['bottom'] = this.hasImage ? '208px' : '154px'
          this.$refs.li[this.messageList.length - 1].scrollIntoView()
        }
      },
      uploadSuccess (images) {
        this.hasImage = false
        this.$refs.main.style['bottom'] = '154px'
        this.$socket.emit('chat', this.token, this.$route.query.userId, images[0], 'image')
        this.messageList.push({type: 'image', sender: this.myId, content: images[0]})
        this.$nextTick(() => {
          this.$refs.li[this.messageList.length - 1].scrollIntoView()
        })
      },
      clearImage () {
        this.hasImage = false
        this.$refs.main.style['bottom'] = '154px'
      },
      addImage () {
        this.hasImage = true
        this.$refs.main.style['bottom'] = '208px'
        this.$refs.li[this.messageList.length - 1].scrollIntoView()
      },
      sendMessage () {
        if (!this.message) {
          return
        }
        this.$socket.emit('chat', this.token, this.$route.query.userId, this.message, 'text')
        this.messageList.push({type: 'text', sender: this.myId, content: this.message})
        this.$nextTick(() => {
          this.$refs.li[this.messageList.length - 1].scrollIntoView()
        })
        this.message = ''
      }
    },
    sockets: {
      chat (message) {
        if (message.sender === this.$route.query.userId) {
          this.messageList.push(message)
          this.$nextTick(() => {
            this.$refs.li[this.messageList.length - 1].scrollIntoView()
          })
        }
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
  .chat
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 100
    background $color-article-background
    .main-wrapper
      top 40px
      bottom 48px
      width 100%
      position fixed
      overflow-y auto
      .load-hint
        text-align center
      .right
        justify-content flex-end
      .left
        justify-content flex-start
      .message-item
        width 100%
        display flex
        span
          background $color-background
          margin 5px
          padding 10px
          max-width 60%
        img
          background $color-article-background
          margin 5px
          padding 10px
          max-width 60%
    .input-wrapper
      position fixed
      bottom 0
      width 100%
      .input-area
        display flex
        height 48px
        .btn-add
          font-weight bolder
          font-size 35px
          text-align center
          line-height 40px
          width 45px
          height 45px
          border solid 1px $color-can-be-click
          border-radius 50%
          color $color-can-be-click
          background-color #fff
        .input-text
          flex 1
          border-radius 10px
          border $color-can-be-click solid 1px
        .btn-submit
          height 100%
          width 60px
      .uploader-wrapper
        background $color-article-background
    .image-wrapper
      display flex
      align-items center
      position fixed
      background rgba(0, 0, 0, 0.8)
      z-index 200
      top 0
      right 0
      left 0
      bottom 0
      .big-image
        width 100%
</style>

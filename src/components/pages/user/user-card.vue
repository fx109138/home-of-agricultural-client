<template>
  <transition name="slide">
    <div class="user-card">
    <mt-header title="用户资料">
      <mt-button @click.native="$router.go(-1)" icon="back" slot="left">返回</mt-button>
    </mt-header>
    <div class="content-wrapper">
      <img :src="`http://localhost:7001/public/headImage/${user.headImage}`" width="120px" height="120px" alt="">
      <div class="nickname">{{user.nickName}}</div>
      <div class="expert-state" v-if="user.certification"><img src="../../../assets/svg/v.svg" width="14px" height="14px" alt=""> {{user.certification}}专家</div>
      <div class="description">{{user.description}}</div>
      <div class="information">
        <span>地区：{{user.location ? user.location : '未知'}}</span>
        <span>性别：{{user.gender ? user.gender : '未知'}}</span>
      </div>
      <div class="information">
        <span>年龄：{{user.age ? user.age : '未知'}}</span>
        <span>职业：{{user.job ? user.job : '未知'}}</span>
      </div>
      <mt-button v-if="!isFollowed" @click.native="followUser" class="btn-follow" type="primary" size="small">关注用户</mt-button>
      <mt-button v-if="isFollowed" @click.native="unFollowUser" class="btn-follow" type="primary" size="small">取消关注</mt-button>
    </div>
    <div class="block-wrapper">
      <div>
        <span>回答问题</span>
        <span>{{user.answerCount}}</span>
      </div>
      <div>
        <span>提出问题</span>
        <span>{{user.questionCount}}</span>
      </div>
      <div>
        <span>关注的人</span>
        <span>{{user.followingCount}}</span>
      </div>
      <div>
        <span>ta的粉丝</span>
        <span>{{user.followerCount}}</span>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
  import { BASE_API_PATH } from '@/common/js/util'
  import {mapGetters, mapActions} from 'vuex'
  import { accountTestMixin } from '@/common/js/mixin'
  export default {
    mixins: [ accountTestMixin ],
    data () {
      return {
        user: {}
      }
    },
    mounted () {
      this.getData()
    },
    computed: {
      ...mapGetters([
        'followings'
      ]),
      isFollowed () {
        let result = false
        this.followings.forEach(item => {
          if (item.userId === this.user._id) {
            result = true
          }
        })
        return result
      }
    },
    methods: {
      getData () {
        this.$axios.get(BASE_API_PATH + `/user/getUserInfo/${this.$route.query.userId}`).then(res => {
          if (res.data.code === 200) {
            this.user = res.data.data.user
          }
        })
      },
      followUser () {
        this.$axios.post(BASE_API_PATH + `/user/giveFollow`, {
          targetId: this.$route.query.userId
        }).then(res => {
          if (res.data.code === 200) {
            this.addFollowing({
              description: this.user.description,
              headImage: this.user.headImage,
              nickName: this.user.nickName,
              userId: this.$route.query.userId
            })
            this.$socket.emit('follow', this.token, this.$route.query.userId)
          }
        })
      },
      unFollowUser () {
        this.$axios.post(BASE_API_PATH + `/user/cancelFollow`, {
          targetId: this.$route.query.userId
        }).then(res => {
          if (res.data.code === 200) {
            console.log(res.data)
            this.deleteFollowing(this.$route.query.userId)
          }
        })
      },
      ...mapActions([
        'addFollowing',
        'deleteFollowing'
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../assets/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .user-card
    position fixed
    overflow-y auto
    top 0
    bottom 0
    left 0
    right 0
    z-index 100
    background $color-article-background
    .content-wrapper
      padding-top 10px
      display flex
      flex-direction column
      align-items center
      .nickname
        font-weight 500
        font-size $font-size-large
        margin 6px 0
      .expert-state
        color $color-expert-font
        font-size $font-size-medium-x
        background $color-expert-background
        padding 5px 15px
        border-radius 5px
      .description
        font-size $font-size-medium-x
        margin 6px 0
      .information
        font-style italic
        font-size $font-size-medium
        margin 3px 0
        span
          margin 0 10px
      .btn-follow
        margin-top 10px
    .block-wrapper
      margin-top 10px
      overflow hidden
      width 100%
      div
        border 1px solid $color-background
        background: $color-article-desc-background
        box-sizing border-box
        padding 10px
        display flex
        flex-direction column
        align-items center
        justify-content center
        float left
        width 50%
        height 80px
        span
          margin 5px 0
    .circle-wrapper
      display flex
      flex-direction column
      align-items center
</style>



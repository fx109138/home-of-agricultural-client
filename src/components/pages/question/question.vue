<template>
  <div class="question">
    <mt-navbar @click.native="getPageContent" v-model="selected">
      <mt-tab-item id="">全部</mt-tab-item>
      <mt-tab-item v-for="(tag,index) in tags" :key="index" :id="tag._id">{{tag.tagName}}</mt-tab-item>
      <mt-tab-item @click.native.stop="selectItem">+</mt-tab-item>
    </mt-navbar>
    <question-list ref="question-list" class="question-list" @refresh="reload" @load="getQuestionList" :questions="questions" :loading="loading" :showLoading="showLoading"/>
    <div @click="addQuestion" class="btn-add">问</div>
  </div>
</template>

<script>
  import { BASE_API_PATH } from '@/common/js/util'
  import { mapGetters } from 'vuex'
  import QuestionList from '@/components/abstract/question-list'
  export default {
    data () {
      return {
        selected: '',
        loading: false,
        showLoading: false,
        questions: []
      }
    },
    mounted () {
      this.getQuestionList()
    },
    computed: {
      ...mapGetters([
        'tags'
      ])
    },
    components: {
      QuestionList
    },
    methods: {
      addQuestion () {
        this.$router.push('/question/addQuestion')
      },
      selectItem () {
        this.$router.push('/question/selectItem')
      },
      getPageContent () {
        this.questions = []
        this.getQuestionList()
      },
      getQuestionList (callback) {
        let url = this.selected ? `/getQuestionList/${this.selected}/` : '/getAllQuestionList/'
        let last = this.questions.length ? this.questions[this.questions.length - 1].time : new Date().toISOString()
        this.showLoading = true
        this.loading = true
        this.$axios.get(BASE_API_PATH + '/question' + url + last).then(res => {
          this.questions.push(...res.data.data.questions)
          if (callback) {
            callback()
          }
          setTimeout(() => {
            this.loading = false
            this.showLoading = false
          }, 2000)
        })
      },
      reload (callback) {
        this.questions = []
        this.getQuestionList(callback)
      }
    },
    watch: {
      selected (newVal, oldVal) {
        if (newVal === undefined) {
          this.selected = oldVal
        }
      },
      '$route' (to, from) {
        if (from.path === '/question/addQuestion' && from.query.tag) {
          this.selected = ''
          this.tags.forEach(item => {
            if (from.query.tag === item.tagName) {
              this.selected = item._id
            }
          })
          this.getPageContent()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "../../../assets/stylus/variable"
  .question
    width: 100%
    .question-list
      padding-top 3px
    .btn-add
      font-weight bold
      font-size 20px
      text-align center
      line-height 50px
      width 50px
      height 50px
      border-radius 50%
      position fixed
      right 10px
      bottom 65px
      color $color-article-background
      background-color $color-can-be-click
</style>

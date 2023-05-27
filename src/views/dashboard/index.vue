<template>
  <div class="dashboard-container">
    <h1>欢迎您</h1>
  </div>
</template>

<script>
// import CountTo from 'vue-count-to'
import homeApi from '@/api/home'

export default {
  name: 'Dashboard',
  components: {
    // CountTo
  },
  data() {
    return {
      activeTab: 'today',
      totalTab: [
        {
          label: '今日',
          name: 'today'
        },
        {
          label: '本月',
          name: 'month'
        },
        {
          label: '本年',
          name: 'year'
        },
        {
          label: '总',
          name: 'total'
        }
      ],
      homeCount: {
        today: {},
        month: {},
        year: {},
        total: {}
      }
    }
  },
  created() {
    homeApi.getHomeCount().then((res) => {
      this.homeCount = res.data
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
span.card-panel-num {
  font-size: 25px;
}

@media (max-width: 650px) {
  .el-tab-pane img {
    display: none;
  }
}
</style>

<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeTab">
      <el-tab-pane
        v-for="tab in totalTab"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
      >
        <el-row :gutter="20">
          <el-col :xs="12" :sm="6" style="padding-top: 10px">
            <el-card shadow class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ tab.label }}页面浏览次数</span>
              </div>
              <el-row type="flex" justify="space-between" align="center">
                <count-to
                  :start-val="0"
                  :end-val="homeCount[tab.name].viewCount"
                  :duration="2200"
                  class="card-panel-num"
                />
              </el-row>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" style="padding-top: 10px">
            <el-card shadow class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ tab.label }}点击注册次数</span>
              </div>
              <el-row type="flex" justify="space-between" align="center">
                <count-to
                  :start-val="0"
                  :decimals="0"
                  :end-val="homeCount[tab.name].clickCount2"
                  :duration="2200"
                  class="card-panel-num"
                />
              </el-row>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="6" style="padding-top: 10px">
            <el-card shadow class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ tab.label }}点击下载次数</span>
              </div>
              <el-row type="flex" justify="space-between" align="center">
                <count-to
                  :start-val="0"
                  :decimals="0"
                  :end-val="homeCount[tab.name].clickCount1"
                  :duration="2200"
                  class="card-panel-num"
                />
              </el-row>
            </el-card>
          </el-col>
          <!-- <el-col :xs="12" :sm="6" style="padding-top: 10px;">
            <el-card shadow class="box-card">
              <div slot="header" class="clearfix">
                <span>库存价值</span>
              </div>
              <el-row type="flex" justify="space-between" align="center">
                <count-to :start-val="0" :decimals="2" :end-val="homeCount.inventoryValue" :duration="2200" class="card-panel-num" />
              </el-row>
            </el-card>
          </el-col> -->
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import homeApi from "@/api/home";

export default {
  name: "Dashboard",
  components: {
    CountTo,
  },
  data() {
    return {
      activeTab: "today",
      totalTab: [
        {
          label: "今日",
          name: "today",
        },
        {
          label: "本月",
          name: "month",
        },
        {
          label: "本年",
          name: "year",
        },
        {
          label: "总",
          name: "total",
        },
      ],
      homeCount: {
        today: {},
        month: {},
        year: {},
        total: {},
      },
    };
  },
  async created() {
    const res = await homeApi.getHomeCount();
    let data1 = res.data;
    const res2 = await homeApi.sysClickcount();
    let data2 = res2.data;
    let keys = ["month", "today", "total", "year"];
    keys.forEach((key) => {
      data1[key].clickCount1 = data2[key].clickCount1;
      data1[key].clickCount2 = data2[key].clickCount2;
    });
    this.homeCount = data1;
  },
};
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

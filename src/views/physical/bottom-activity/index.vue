<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<template>
  <div v-loading="loading" class="app-container">
    <!-- 新增按钮 -->
    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      @click="addOperation"
    >
      <span>新增</span>
    </el-button>
    <!-- 活动列表 -->
    <el-table ref="table" v-loading="loading" :data="data" style="width: 100%">
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="actLogo"
        label="活动图片"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 25px; height: 25px"
            :src="loadLogo(scope.row.actLogo)"
            :preview-src-list="[loadLogo(scope.row.actLogo)]"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        :show-overflow-tooltip="true"
        prop="actBannerTitle"
        label="活动标题"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="actBannerBtnLink"
        label="活动链接"
      />

      <el-table-column label="可见状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.actBannerStatus"
            active-color="#13ce66"
            inactive-color="#999"
            active-text="开"
            inactive-text="关"
            @change="onSwitchChange(scope.row)"
          >
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="isShowDialog"
      :title="title"
    >
      <el-form ref="form" :model="form" size="small" label-width="140px">
        <el-form-item label="可见状态">
          <el-switch
            v-model="form.actBannerStatus"
            active-color="#13ce66"
            inactive-color="#999"
            active-text="开"
            inactive-text="关"
          >
            >
          </el-switch>
        </el-form-item>

        <!-- <el-form-item label="活动图片" prop="actLogo">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="upload"
            :show-file-list="false"
            accept="image/*"
          >
            <img
              v-if="form.actLogo"
              :src="loadLogo(form.actLogo)"
              style="width: 50px; height: 50px"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item> -->
        <el-form-item label="活动标题">
          <el-input
            v-model="form.actBannerTitle"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>
        <el-form-item label="活动链接">
          <el-input
            v-model="form.actBannerBtnLink"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="canncel">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import oss from "@/utils/oss";
import { upload } from "@/api/physical/upload";
import { selectBphy, del, add, edit } from "@/api/physical/bottomActivity";
const initForm = () => ({
  actLogo: null,
  logoFile: null,
  actBannerBtn: "",
  actBannerBtnCount: "",
  actBannerBtnLink: "",
  actBannerId: "",
  actBannerStatus: "",
  actBannerTitle: "",
  actBannerType: "",
  sort: 1,
});
export default {
  data() {
    return {
      loading: false,
      isShowDialog: false,
      data: [],
      status: 1, //1:新增 2:编辑 ,
      form: initForm(),
    };
  },
  computed: {
    title() {
      return this.status === 1 ? "新增" : "编辑";
    },
  },
  created() {
    this.getList();
  },
  methods: {
    upload({ file }) {
      upload(file).then((res) => {
        if (res.code) {
          this.form.actLogo = res.data.data.url;
        } else {
          this.$message({ type: "warning", message: res.message });
        }
      });
    },
    getList() {
      selectBphy().then((res) => {
        if (res.code === 200) {
          let list = res.data.records;
          list.forEach((item) => {
            item.actBannerStatus = Number(item.actBannerStatus) ? true : false;
          });
          this.data = res.data.records;
        }
      });
    },
    verifyParams() {
      let isValid = true;
      const {
        // actLogo,
        actBannerBtnLink,
        actBannerTitle,
      } = this.form;
      if (!actBannerBtnLink) {
        this.$message.warning("请输入活动链接");
        return false;
      }
      if (!actBannerTitle) {
        this.$message.warning("请输入活动标题");
        return false;
      }
      // if (!actLogo) {
      //   this.$message.warning("请上传活动图片");
      //   return false;
      // }

      return isValid;
    },
    onSwitchChange(row) {
      let newRow = {...row}
      newRow.actBannerStatus = newRow.actBannerStatus ? 1 : 0;

      this.doEdit(newRow);
    },
    submit() {
      let data = { ...this.form };
      data.actBannerStatus = data.actBannerStatus ? 1 : 0;
      if (!this.verifyParams()) return;
      if (this.status === 1) {
        this.loading = true;
        add(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "新增成功",
            });
            this.closeDialog();
            this.getList();
          } else {
            this.$message({
              type: "warning",
              message: res.message,
            });
          }
          this.loading = false;
        });
      } else {
        this.doEdit(data);
      }
    },
    doEdit(data) {
      this.loading = true;
      edit(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.closeDialog();
          this.getList();
        } else {
          this.$message({
            type: "warning",
            message: res.message,
          });
        }
        this.loading = false;
      });
    },
    openDialog() {
      this.isShowDialog = true;
    },
    closeDialog() {
      this.isShowDialog = false;
    },
    canncel() {
      this.closeDialog();
    },
    del(row) {
      this.$confirm("确认删除这条数据吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del([row.id]).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            } else {
              this.$message({
                type: "warning",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {});
    },
    // 编辑
    edit(row) {
      this.openDialog();
      this.status = 2;
      this.form = {...row};
      const data = { ...this.form };
      console.log(data);
    },
    // 新增操作
    addOperation() {
      this.status = 1;
      this.form = initForm();
      this.openDialog();
    },
    // 加载logo
    loadLogo(url) {
      return oss.loadImage(url, oss.TYPE.LOCAL);
    },
    // 选择logo预览
    handleLogoSuccess(file) {
      console.log(file);
      this.form.actLogo = URL.createObjectURL(file.raw);
      this.form.logoFile = file.raw;
    },

    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false;
      }
    },
  },
};
</script>

<style lang="scss">
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
  font-size: 24px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
</style>

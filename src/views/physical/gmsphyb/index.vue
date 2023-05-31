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
    <!-- 体育列表 -->
    <el-table ref="table" v-loading="loading" :data="data" style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerTitle"
        label="标题"
      />
      <el-table-column :show-overflow-tooltip="true" prop="logo" label="logo">
        <template slot-scope="scope">
          <el-image
            style="width: 25px; height: 25px"
            :src="loadLogo(scope.row.logo)"
            :preview-src-list="[loadLogo(scope.row.logo)]"
          />
        </template>
      </el-table-column>

      <el-table-column
        :show-overflow-tooltip="true"
        prop="registerHandsel"
        label="注册彩金"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherHandsel"
        label="其他彩金"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn"
        label="注册链接"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtnLink"
        label="IOS下载地址"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn2Link"
        label="Android下载地址"
      />
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn2"
        label="按钮2链接" -->
      />
      <el-table-column label="可见状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.bstatus"
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
            v-model="form.bstatus"
            active-color="#13ce66"
            inactive-color="#999"
            active-text="开"
            inactive-text="关"
          >
            >
          </el-switch>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="form.btype" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="bbannerTitle">
          <el-input
            v-model="form.bbannerTitle"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="logo" prop="logo">
          <el-upload
            class="avatar-uploader"
            :action="action"
            :on-success="handleAvatarSuccess"
            :headers="getHeaders()"
            :show-file-list="false"
            accept="image/*"
          >
            <img
              v-if="form.logo"
              :src="form.logo"
              style="width: 50px; height: 50px"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="注册彩金">
          <el-input
            v-model="form.registerHandsel"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>
        <el-form-item label="其他彩金">
          <el-input
            v-model="form.otherHandsel"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="注册链接" prop="bbannerBtn">
          <el-input
            v-model="form.bbannerBtn"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="IOS下载地址" prop="bbannerBtnLink">
          <el-input
            v-model="form.bbannerBtnLink"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="Android下载地址" prop="bbannerBtn2Link">
          <el-input
            v-model="form.bbannerBtn2Link"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>
        <!-- <el-form-item label="按钮2链接" prop="bbannerBtn2Link">
          <el-input
            v-model="form.bbannerBtn2Link"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item> -->
        <el-form-item label="排序">
          <el-input-number
            v-model="form.sort"
            :min="1"
            :max="999"
            label="描述文字"
          ></el-input-number>
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
import { selectBphy, del, add, edit } from "@/api/physical/gmsphyb";
const initForm = () => ({
  bbannerTitle: "",
  logo: null,
  logoFile: null,
  btype: "",
  registerHandsel: "",
  otherHandsel: "",
  bbannerBtn: "",
  bbannerBtnLink: "",
  bbannerBtn2: "",
  bbannerBtn2Link: "",
  bstatus: 1,
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
      types: [
        {
          value: "1",
          label: "B体育",
        },
        {
          value: "2",
          label: "米乐M6",
        },
        {
          value: "3",
          label: "BB体育",
        },
        {
          value: "4",
          label: "K体育",
        },
      ],
      action:oss.uploadApi
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
    getHeaders: oss.getHeaders,
    handleAvatarSuccess(res, file) {
      this.form.logo = URL.createObjectURL(file.raw);
      if (res.code === 200) {
        this.form.logo = res.data.data.url;
      } else {
        this.$message({ type: "warning", message: res.message });
      }
    },
    getList() {
      selectBphy().then((res) => {
        if (res.code === 200) {
          let list = res.data.records;
          list.forEach((item) => {
            item.bstatus = Number(item.bstatus) ? true : false;
          });
          this.data = res.data.records;
        }
      });
    },
    verifyParams() {
      let isValid = true;
      const {
        btype,
        bbannerTitle,
        logo,
        registerHandsel,
        otherHandsel,
        bbannerBtn,
        bbannerBtnLink,
        bbannerBtn2Link,
      } = this.form;
      if (!btype) {
        this.$message.warning("请选择类型");
        return false;
      }
      if (!bbannerTitle) {
        this.$message.warning("请输入标题");
        return false;
      }

      if (!logo) {
        this.$message.warning("请上传图片");
        return false;
      }

      if (!registerHandsel) {
        this.$message.warning("请输入注册彩金");
        return false;
      }
      if (!otherHandsel) {
        this.$message.warning("请输入其他彩金");
        return false;
      }
      if (!bbannerBtn) {
        this.$message.warning("请输入注册链接");
        return false;
      }
      if (!bbannerBtnLink) {
        this.$message.warning("请输入IOS下载地址");
        return false;
      }
      if (!bbannerBtn2Link) {
        this.$message.warning("请输入Android下载地址");
        return false;
      }
      return isValid;
    },
    onSwitchChange(row) {
      let newRow = {...row}
      newRow.bstatus = newRow.bstatus ? 1 : 0;
      this.doEdit(newRow);
    },
    submit() {
      let data = { ...this.form };
      data.bstatus = data.bstatus ? 1 : 0;
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
      this.form.logo = URL.createObjectURL(file.raw);
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

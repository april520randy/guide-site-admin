<template>
  <div class="app-container">
    <!-- CRUD操作 -->
    <crud-operation v-if="crud.data.length===0" :permission="permission" />
    <!-- 体育Banner列表  -->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="logo"
        label="banner图片"
      >
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
        prop="bannerTopLink"
        label="banner链接"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherTitle"
        label="底部标题1"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherBtn"
        label="底部标题按钮链接1"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherContent"
        label="底部标题2"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherBtnLink"
        label="底部标题按钮链接2"
      />
      <!-- <el-table-column :show-overflow-tooltip="true" prop="type" label="banner类型" /> -->
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template slot-scope="scope">
          <ud-operation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <pagination v-if="false" /> -->
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="140px"
      >
        <el-form-item label="banner图片" prop="logo">
          <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :on-change="handleLogoSuccess"
            :show-file-list="false"
            accept="image/*"
          >
            <img
              v-if="form.logo"
              :src="loadLogo(form.logo)"
              style="width: 50px; height: 50px"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="banner链接" prop="bannerTopLink">
          <el-input
            v-model="form.bannerTopLink"
            style="width: 320px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="底部标题1" prop="otherTitle">
          <el-input
            v-model="form.otherTitle"
            style="width: 320px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>
        <el-form-item label="底部标题按钮链接1" prop="otherBtn">
          <el-input
            v-model="form.otherBtn"
            style="width: 320px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="底部标题2">
          <el-input
            v-model.trim="form.otherContent"
            style="width: 320px"
            maxlength="250"
          />
        </el-form-item>
        <el-form-item label="底部标题按钮链接2" prop="otherBtnLink">
          <el-input
            v-model="form.otherBtnLink"
            style="width: 320px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <!-- <el-form-item label="状态" prop="status">
          <el-input
            v-model="form.status"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import oss from "@/utils/oss";
import crudBanner from "@/api/physical/gmsphy";

import rrOperation from "@/components/Crud/RR.operation.vue";
import udOperation from "@/components/Crud/UD.operation.vue";
import crudOperation from "@/components/Crud/CRUD.operation.vue";
import Pagination from "@/components/Crud/Pagination.vue";
import CRUD, { presenter, header, form, crud } from "@/components/Crud/crud";

export default {
  name: "Bphy",
  components: { Pagination, rrOperation, udOperation, crudOperation },
  cruds() {
    return CRUD({
      // title: "Banner体育",
      url: "/bphyh",
      crudMethod: { ...crudBanner },
    });
  },
  mixins: [
    presenter(),
    header(),
    form({
      // 表单初始值
      bbannerId: null,
      bannerTopImg1: null,
      bannerTopLink: null,
      bannerTopImg2: null,
      bannerTopLink2: null,
      bannerTopImg3: null,
      bannerTopLink3: null,
      predict: null,
      bottomTitle: null,
      bottomBtn: null,
      bottomBtnLink: null,
      // type: null,
      status: 0,
      logo: null,
      logoFile: null,
    }),
    crud(),
  ],
  data() {
    return {
      // 操作权限定义
      permission: {
        add: ["gmsBrand:add"],
        edit: ["gmsBrand:edit"],
        del: ["gmsBrand:del"],
      },
      logoUrl: "",
      // 表单验证规则
      rules: {
        name: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 加载logo
    loadLogo(url) {
      console.log("loadLogopath :: ", url);
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

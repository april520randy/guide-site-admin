<template>
  <div class="app-container">
    <!-- CRUD操作 -->
    <crud-operation :permission="permission" />
    <!-- 体育Banner列表  -->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bannerTopImg1"
        label="轮播图"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bannerTopLink"
        label="轮播图链接"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherContent"
        label="其他内容"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherTitle"
        label="其他标题"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherBtn"
        label="其他按钮"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="otherBtnLink"
        label="其他按钮链接"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="type"
        label="banner类型"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        label="banner状态"
      />
      <el-table-column label="操作" width="115" align="center" fixed="right">
        <template slot-scope="scope">
          <ud-operation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination />
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
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="导航图片" prop="imgIco">
          <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :on-change="handleLogoSuccess"
            :show-file-list="false"
            accept="image/*"
            style="width: 520px"
          >
            <img
              v-if="form.imgIco"
              :src="loadLogo(form.imgIco)"
              style="width: 50px; height: 50px"
            />
            <i v-else class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="图片链接" prop="bannerTopLink">
          <el-input
            v-model="form.bannerTopLink"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="其他标题" prop="otherTitle">
          <el-input
            v-model="form.otherTitle"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="其他内容">
          <el-input
            v-model.trim="form.otherContent"
            style="width: 320px"
            rows="6"
            type="textarea"
            maxlength="250"
          />
        </el-form-item>

        <el-form-item label="其他按钮" prop="otherBtn">
          <el-input
            v-model="form.otherBtn"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="按钮链接" prop="otherBtnLink">
          <el-input
            v-model="form.otherBtnLink"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="状态" prop="type">
          <el-input
            v-model="form.type"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>
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
      title: "Banner体育",
      url: "/bphyh",
      crudMethod: { ...crudBanner },
    });
  },
  mixins: [
    presenter(),
    header(),
    form({
      // 表单初始值
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
      imgIco: null,
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
      this.form.imgIco = URL.createObjectURL(file.raw);
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

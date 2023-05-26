<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/valid-v-bind-sync -->
<template>
  <div class="app-container">
    <!-- CRUD操作 -->
    <crud-operation
      :permission="permission"
    />
    <!-- 体育列表  -->
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
        prop="bbannerId"
        label="体育bannerId"
      />
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
        prop="bbannerContent"
        label="内容"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn"
        label="按钮1"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtnLink"
        label="按钮1链接"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtnCount"
        label="按钮1点击次数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn2"
        label="按钮2"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn2Link"
        label="按钮2链接"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bbannerBtn2Count"
        label="按钮2点击次数"
      />
      <el-table-column :show-overflow-tooltip="true" prop="type" label="类型" />
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
            />
            <i v-else class="el-icon-plus" />
          </el-upload>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-input
            v-model="form.type"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            v-model.trim="form.bbannerContent"
            style="width: 320px"
            rows="6"
            type="textarea"
            maxlength="250"
          />
        </el-form-item>

        <el-form-item label="按钮1" prop="bbannerBtn">
          <el-input
            v-model="form.bbannerBtn"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="按钮1链接" prop="bbannerBtnLink">
          <el-input
            v-model="form.bbannerBtnLink"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="按钮2" prop="bbannerBtn2">
          <el-input
            v-model="form.bbannerBtn2"
            style="width: 220px"
            @keydown.native="keydown($event)"
          />
        </el-form-item>

        <el-form-item label="按钮2链接" prop="bbannerBtn2Link">
          <el-input
            v-model="form.bbannerBtn2Link"
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
import crudgmsphyb from "@/api/physical/gmsphyb";
import rrOperation from "@/components/Crud/RR.operation.vue";
import udOperation from "@/components/Crud/UD.operation.vue";
import crudOperation from "@/components/Crud/CRUD.operation.vue";
import Pagination from "@/components/Crud/Pagination.vue";
import CRUD, { presenter, header, form, crud } from "@/components/Crud/crud";
import {selectBphy,del} from '@/api/physical/gmsphyb'
export default {
  name: "Bphy",
  components: { Pagination, rrOperation, udOperation, crudOperation },
  cruds() {
    return CRUD({
      title: "",
      url: "/bphy",
      crudMethod: { ...crudgmsphyb },
    });
  },
  mixins: [
    presenter(),
    header(),
    form({
      // 表单初始值
      // imgIco: null,
      bBannerTitle: null,
      bBannerContent: null,
      bBannerBtn: null,
      bBannerBtnLink: null,
      bBannerBtnCount: 0,
      bBannerBtn2: null,
      bBannerBtn2Link: null,
      bBannerBtn2Count: 0,
      type: null,
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
        add: ["tenant:add"],
        edit: ["tenant:edit"],
        del: ["tenant:del"],
      },
      // 表单验证规则
      rules: {
        tenantCode: [
          { required: true, message: "请输入租户编码", trigger: "blur" },
        ],
        tenantName: [
          { required: true, message: "请输入租户名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 修改新增成功提示信息
    this.crud.msg.add = "新增成功, 租户默认管理员账号: admin, 密码: admin";
    selectBphy().then(res=>{
      console.log(res)
    })
    del(['123'])
  },
  methods: {
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

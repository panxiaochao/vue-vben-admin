<script setup lang="ts">
import { defineEmits, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';

import { listTree } from '#/api/system/permission/org';
import { selectPosts } from '#/api/system/permission/post';
import { save } from '#/api/system/permission/user';

defineOptions({
  name: 'AddForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const postList = ref([]);
const treeData = ref([]);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const modelRef = reactive({
  realName: undefined,
  nickName: undefined,
  loginName: undefined,
  sex: '1',
  password: undefined,
  address: undefined,
  state: '1',
  email: undefined,
  mobile: undefined,
  tel: undefined,
  fax: undefined,
  postCode: undefined,
  orgId: undefined,
  remark: undefined,
});

const rulesRef = reactive({
  realName: [{ type: 'string', required: true, message: '请输入用户姓名' }],
  loginName: [{ type: 'string', required: true, message: '请输入登录账号' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const openModal = () => {
  open.value = true;
  // 加载岗位数据
  postList.value = [];
  selectPosts().then((res) => {
    postList.value = res;
  });
  // 加载机构数据
  treeData.value = [];
  listTree({}).then((res) => {
    treeData.value = res;
  });
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    save(values).then(() => {
      resetFields();
      open.value = false;
      // 刷新
      $emits('done');
    });
  });
};

const handleCancel = () => {
  resetFields();
  open.value = false;
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-modal
    :body-style="{ padding: '20px' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="新建用户"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="用户姓名"
            name="realName"
            v-bind="validateInfos.realName"
          >
            <a-input v-model:value="modelRef.realName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用户昵称" name="nickName">
            <a-input v-model:value="modelRef.nickName" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="登录账号"
            name="loginName"
            v-bind="validateInfos.loginName"
          >
            <a-input v-model:value="modelRef.loginName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="登录密码" name="password">
            <a-input-password
              v-model:value="modelRef.password"
              allow-clear
              placeholder="若不填写，默认使用系统密码"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="手机号码" name="mobile">
            <a-input v-model:value="modelRef.mobile" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="性别" name="sex">
            <a-radio-group v-model:value="modelRef.sex">
              <a-radio value="1">男</a-radio>
              <a-radio value="0">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="岗位" name="postCode">
            <a-select
              v-model:value="modelRef.postCode"
              :options="postList"
              allow-clear
              placeholder="请选择岗位"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="机构" name="orgId">
            <a-tree-select
              v-model:value="modelRef.orgId"
              :tree-data="treeData"
              allow-clear
              placeholder="请选择机构"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="邮箱" name="email">
            <a-input v-model:value="modelRef.email" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="地址" name="address">
            <a-input v-model:value="modelRef.address" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="人员状态" name="state">
            <a-radio-group v-model:value="modelRef.state">
              <a-radio value="1">正常</a-radio>
              <a-radio value="0">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备注" name="remark">
            <a-textarea v-model:value="modelRef.remark" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

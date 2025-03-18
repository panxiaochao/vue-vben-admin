<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { listTree } from '#/api/system-plus/permission/org';
import { selectPosts } from '#/api/system-plus/permission/post';
import { update } from '#/api/system-plus/permission/user';

defineOptions({
  name: 'EditForm',
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

// 字段对象
interface FormState {
  id: string | undefined;
  realName: string | undefined;
  nickName: string | undefined;
  sex: string;
  address: string | undefined;
  state: string;
  email: string | undefined;
  mobile: string | undefined;
  tel: string | undefined;
  fax: string | undefined;
  postCode: string | undefined;
  orgId: string | undefined;
  remark: string | undefined;
}

const defaultModel = {
  id: undefined,
  realName: undefined,
  nickName: undefined,
  sex: '1',
  address: undefined,
  state: '1',
  email: undefined,
  mobile: undefined,
  tel: undefined,
  fax: undefined,
  postCode: undefined,
  orgId: undefined,
  remark: undefined,
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const rulesRef = reactive({
  realName: [{ type: 'string', required: true, message: '请输入用户姓名' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

// 赋值
const updateForm = (raw: FormState) => {
  const rawValues = toRaw(raw || {});
  if (rawValues) {
    nextTick(() => {
      const fieldNames = Object.keys(defaultModel) ?? [];
      Object.assign(modelRef, pick(rawValues, fieldNames));
    });
  }
};

const openModal = (raw: FormState) => {
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
  updateForm(raw);
};

const handleOk = () => {
  validate().then(() => {
    const values = toRaw(modelRef);
    update(values).then(() => {
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
    title="编辑用户"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="hidden" />
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

<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { selectDataScopes, update } from '#/api/system-plus/permission/role';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const dataScopeList = ref([]);

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
  roleName: string | undefined;
  roleCode: string | undefined;
  dataScope: string | undefined;
  remark: string | undefined;
  sort: number;
  state: string | undefined;
}

const defaultModel = {
  id: undefined,
  roleName: undefined,
  roleCode: undefined,
  dataScope: '1',
  remark: undefined,
  sort: 0,
  state: '1',
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const rulesRef = reactive({
  roleName: [{ type: 'string', required: true, message: '请输入角色名称' }],
  roleCode: [{ type: 'string', required: true, message: '请输入角色编码' }],
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
  dataScopeList.value = [];
  selectDataScopes().then((res) => {
    dataScopeList.value = res;
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
    title="编辑角色"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="hidden" />
      <a-form-item
        label="角色名称"
        name="roleName"
        v-bind="validateInfos.roleName"
      >
        <a-input v-model:value="modelRef.roleName" allow-clear />
      </a-form-item>
      <a-form-item
        label="角色编码"
        name="roleCode"
        v-bind="validateInfos.roleCode"
      >
        <a-input v-model:value="modelRef.roleCode" allow-clear />
      </a-form-item>
      <a-form-item
        label="数据权限"
        name="dataScope"
        v-bind="validateInfos.dataScope"
      >
        <a-select
          v-model:value="modelRef.dataScope"
          :options="dataScopeList"
          allow-clear
          placeholder="请选择数据权限"
        />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          v-model:value="modelRef.sort"
          :max="1000"
          :min="0"
          class="w-full"
        />
      </a-form-item>
      <a-form-item label="状态" name="state">
        <a-radio-group v-model:value="modelRef.state">
          <a-radio value="1">正常</a-radio>
          <a-radio value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="描述" name="remark">
        <a-textarea v-model:value="modelRef.remark" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

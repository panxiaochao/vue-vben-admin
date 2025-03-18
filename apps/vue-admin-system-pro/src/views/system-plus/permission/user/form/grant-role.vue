<script setup lang="ts">
import { nextTick, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { listRole } from '#/api/system-plus/permission/role';
import { save } from '#/api/system-plus/permission/user-role';

defineOptions({
  name: 'GrantRole',
  inheritAttrs: false,
});

const useForm = Form.useForm;

const roleList = ref([]);

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
  roleId: string[];
}

const defaultModel = {
  id: undefined,
  realName: '',
  roleId: [],
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const { resetFields } = useForm(modelRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const userRoleIds = defineModel('userRoleIds', { type: Array, default: [] });

// 赋值
const updateForm = (raw: FormState) => {
  const rawValues = toRaw(raw || {});
  if (rawValues) {
    nextTick(() => {
      const fieldNames = Object.keys(defaultModel) ?? [];
      Object.assign(modelRef, pick(rawValues, fieldNames), {
        roleId: userRoleIds.value,
      });
    });
  }
};

const openModal = (raw: FormState) => {
  open.value = true;
  // 加载角色下拉数据
  roleList.value = [];
  listRole({}).then((res) => {
    roleList.value = res;
    updateForm(raw);
  });
};

const handleOk = () => {
  const values = toRaw(modelRef);
  const params = Object.assign(
    {},
    {
      roleId: values.roleId.join(','),
      userId: modelRef.id,
    },
  );
  save(params).then(() => {
    resetFields();
    open.value = false;
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
    title="授权角色"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="当前用户"> {{ modelRef.realName }} </a-form-item>
      <a-form-item label="角色" name="roleId">
        <a-select
          v-model:value="modelRef.roleId"
          :options="roleList"
          allow-clear
          mode="multiple"
          placeholder="请选择角色"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

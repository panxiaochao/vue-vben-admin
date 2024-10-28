<script setup lang="ts">
import { nextTick, reactive, ref, toRaw } from 'vue';

import { Form, FormItem, Modal, Select } from 'ant-design-vue';

import { listRole } from '#/api/system/permission/role';
import { save } from '#/api/system/permission/user-role';

defineOptions({
  name: 'GrantRole',
  inheritAttrs: false,
});

const useForm = Form.useForm;

const roleList = ref([]);

const realName = ref('');

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
  id: undefined,
  roleId: [],
});

const { resetFields } = useForm(modelRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const userRoleIds = defineModel('userRoleIds', { type: Array, default: [] });

const openModal = (raw) => {
  const rawValues = toRaw(raw || {});
  open.value = true;
  // 加载角色下拉数据
  roleList.value = [];
  listRole().then((res) => {
    roleList.value = res;
    nextTick(() => {
      realName.value = rawValues.realName;
      // 赋值
      modelRef.roleId = userRoleIds.value;
      modelRef.id = rawValues.id;
    });
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
  <Modal
    :body-style="{ padding: '20px' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="授权角色"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <Form v-bind="formItemLayout">
      <FormItem label="当前用户"> {{ realName }} </FormItem>
      <FormItem label="角色" name="roleId">
        <Select
          v-model:value="modelRef.roleId"
          :options="roleList"
          allow-clear
          mode="multiple"
          placeholder="请选择角色"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import type { SystemPlusOrgModuleNs } from '#/views/system-plus/permission/org/config';

import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import {
  listTree,
  save,
  selectOrgCategoryList,
} from '#/api/system-plus/permission/org';
import {
  defaultModel,
  formItemLayout,
  useFormApi,
} from '#/views/system-plus/permission/org/form/form-config';

defineOptions({
  name: 'AddForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);
// 机构类别下拉
const orgCategoryList = ref([]);
// 机构数据
const treeData = ref<any[]>([]);

// 响应式数据 open 控制模态框的显示和隐藏
const open = defineModel('open', { type: Boolean, default: false });

// 响应式数据 width 控制模态框的宽度
const width = defineModel('width', { type: Number, default: 800 });

const modelRef = reactive({ ...defaultModel });

const { resetFields, validate, validateInfos } = useFormApi(modelRef);

const openModal = (raw?: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  open.value = true;
  // 加载机构数据
  treeData.value = [];
  listTree({}).then((res) => {
    treeData.value = [{ title: '根组织', value: '0', children: res }];
  });
  // 加载机构类别下拉
  orgCategoryList.value = [];
  selectOrgCategoryList().then((res) => {
    orgCategoryList.value = res;
  });
  nextTick(() => {
    if (raw) {
      // 设置上级机构ID = 本条数据ID
      modelRef.parentId = raw.id;
    }
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
    title="新建机构"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item
        label="上级机构"
        name="parentId"
        v-bind="validateInfos.parentId"
      >
        <a-tree-select
          v-model:value="modelRef.parentId"
          :tree-data="treeData"
          allow-clear
          placeholder="请选择上级机构"
        />
      </a-form-item>
      <a-form-item
        label="机构名称"
        name="orgName"
        v-bind="validateInfos.orgName"
      >
        <a-input v-model:value="modelRef.orgName" allow-clear />
      </a-form-item>
      <a-form-item
        label="机构编码"
        name="orgCode"
        v-bind="validateInfos.orgCode"
      >
        <a-input v-model:value="modelRef.orgCode" allow-clear />
      </a-form-item>
      <a-form-item
        label="机构类别"
        name="orgCategory"
        v-bind="validateInfos.orgCategory"
      >
        <a-tree-select
          v-model:value="modelRef.orgCategory"
          :tree-data="orgCategoryList"
          allow-clear
          placeholder="请选择机构类别"
        />
      </a-form-item>
      <a-form-item label="传真号码" name="fax">
        <a-input v-model:value="modelRef.fax" allow-clear />
      </a-form-item>
      <a-form-item label="地址" name="address">
        <a-input v-model:value="modelRef.address" allow-clear />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          v-model:value="modelRef.sort"
          :max="1000"
          :min="0"
          class="w-full"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="modelRef.status">
          <a-radio value="1">正常</a-radio>
          <a-radio value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="modelRef.remark" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

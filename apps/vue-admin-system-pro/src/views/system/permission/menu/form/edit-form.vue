<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { listTree, update } from '#/api/system/permission/menu';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

// 下拉菜单
const treeData = ref([]);

const menuNameLabel = ref('菜单名称');

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

// 字段对象
interface FormState {
  id: string | undefined;
  menuName: string | undefined;
  url: string | undefined;
  icon: string | undefined;
  parentId: string | undefined;
  redirectUrl: string | undefined;
  menuType: string | undefined;
  openType: string | undefined;
  keepAlive: string | undefined;
  isHidden: string | undefined;
  component: string | undefined;
  componentName: string | undefined;
  permissionCode: string | undefined;
  state: string | undefined;
  sort: number;
}

const defaultModel = reactive({
  id: undefined,
  menuName: undefined,
  url: undefined,
  icon: undefined,
  parentId: undefined,
  redirectUrl: undefined,
  menuType: '0',
  openType: '0',
  keepAlive: '0',
  isHidden: '0',
  component: undefined,
  componentName: undefined,
  permissionCode: undefined,
  state: '1',
  sort: 0,
});

const modelRef = reactive<FormState>({
  ...defaultModel,
});

const rulesRef = reactive({
  menuName: [{ type: 'string', required: true, message: '请输入菜单名称' }],
  url: [{ type: 'string', required: true, message: '请输入路由地址' }],
  parentId: [{ type: 'string', required: true, message: '请输入上级菜单' }],
  component: [{ type: 'string', required: true, message: '请输入前端组件' }],
  componentName: [
    { type: 'string', required: true, message: '请输入组件名称' },
  ],
  permissionCode: [
    { type: 'string', required: true, message: '请输入授权标识' },
  ],
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
  // 加载下拉菜单数据
  listTree({ isOnlyMenu: true }).then((res) => {
    treeData.value = res;
  });
  updateForm(raw);
};

const handleOk = () => {
  // 对应各自的验证字段
  let validateNames: any[];
  if (modelRef.menuType === '0') {
    validateNames = ['menuName', 'component', 'url', 'componentName'];
  } else if (modelRef.menuType === '1') {
    validateNames = [
      'menuName',
      'component',
      'url',
      'componentName',
      'parentId',
    ];
  } else {
    validateNames = ['menuName', 'parentId', 'permissionCode'];
  }

  validate(validateNames).then(() => {
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

function onChangeMenuType(e: any) {
  menuNameLabel.value = e.target.value === '2' ? '按钮名称' : '菜单名称';
}

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
    title="编辑菜单"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="菜单类型" name="menuType">
        <a-radio-group
          v-model:value="modelRef.menuType"
          @change="onChangeMenuType"
        >
          <a-radio value="0">一级菜单</a-radio>
          <a-radio value="1">子菜单</a-radio>
          <a-radio value="2">按钮权限</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="menuName" v-bind="validateInfos.menuName">
        <template #label>
          {{ menuNameLabel }}
        </template>
        <a-input v-model:value="modelRef.menuName" allow-clear />
      </a-form-item>
      <a-form-item
        v-if="modelRef.menuType !== '0'"
        label="上级菜单"
        name="parentId"
        v-bind="validateInfos.parentId"
      >
        <a-tree-select
          v-model:value="modelRef.parentId"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          allow-clear
          placeholder="请选择"
        />
      </a-form-item>
      <a-form-item
        v-if="modelRef.menuType !== '2'"
        name="component"
        v-bind="validateInfos.component"
      >
        <template #label>
          <a-tooltip class="mr-1">
            <template #title>
              访问的组件路径，如：`system/user/index`，默认在`views`目录下
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          组件地址
        </template>
        <a-input v-model:value="modelRef.component" allow-clear />
      </a-form-item>
      <a-form-item
        v-if="modelRef.menuType !== '2'"
        label="路由名称"
        name="componentName"
        v-bind="validateInfos.componentName"
      >
        <a-input
          v-model:value="modelRef.componentName"
          allow-clear
          placeholder="路由名称, 且不能重名，对应name"
        />
      </a-form-item>
      <a-form-item
        v-if="modelRef.menuType === '2'"
        label="授权标识"
        name="permissionCode"
        v-bind="validateInfos.permissionCode"
      >
        <a-input
          v-model:value="modelRef.permissionCode"
          allow-clear
          placeholder="请输入授权标识，如sys_user_add"
        />
      </a-form-item>
      <a-form-item
        v-if="modelRef.menuType !== '2'"
        label="菜单图标"
        name="icon"
      >
        <a-input v-model:value="modelRef.icon" allow-clear />
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number
          v-model:value="modelRef.sort"
          :max="1000"
          :min="0"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item name="state">
        <template #label>
          <a-tooltip class="mr-1">
            <template #title> 选择禁用则路由将不会显示 </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          显示状态
        </template>
        <a-radio-group v-model:value="modelRef.state">
          <a-radio value="1">正常</a-radio>
          <a-radio value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="modelRef.menuType !== '2'" name="keepAlive">
        <template #label>
          <a-tooltip class="mr-1">
            <template #title> 组件保留状态，避免重新渲染 </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          缓存路由
        </template>
        <a-radio-group v-model:value="modelRef.keepAlive">
          <a-radio value="1">是</a-radio>
          <a-radio value="0">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="modelRef.menuType !== '2'" name="openType">
        <template #label>
          <a-tooltip class="mr-1">
            <template #title>
              选择外链, 则路由地址需要以 http(s):// 开头
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          打开方式
        </template>
        <a-radio-group v-model:value="modelRef.openType">
          <a-radio value="0">内链</a-radio>
          <a-radio value="1">外链</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

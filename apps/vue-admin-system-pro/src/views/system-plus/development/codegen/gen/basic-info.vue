<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, toRaw } from 'vue';

import { Form } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { selectGroupList } from '#/api/system-plus/development/gen-group';
import { get, update } from '#/api/system-plus/development/gen-table';

defineOptions({
  name: 'BasicInfo',
  inheritAttrs: false,
});

const useForm = Form.useForm;

const groupList = ref<
  {
    disabled: boolean;
    key: string;
    label: string;
    title: string;
    value: string;
  }[]
>([]);

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
  tableName: string | undefined;
  className: string | undefined;
  tableComment: string | undefined;
  author: string | undefined;
  email: string | undefined;
  packageName: string | undefined;
  version: string | undefined;
  style: string | undefined;
  generatorType: string | undefined;
  backendPath: string | undefined;
  moduleName: string | undefined;
  functionName: string | undefined;
  formLayout: string | undefined;
  datasourceId: string | undefined;
}

const defaultModel = {
  id: undefined,
  tableName: undefined,
  className: undefined,
  tableComment: undefined,
  author: undefined,
  email: undefined,
  packageName: undefined,
  version: undefined,
  style: undefined,
  generatorType: undefined,
  backendPath: undefined,
  moduleName: undefined,
  functionName: undefined,
  formLayout: undefined,
  datasourceId: undefined,
};

const modelRef = reactive<FormState>({ ...defaultModel });

const tableId = defineModel('tableId', { type: String, default: '' });

const rulesRef = reactive({
  tableName: [{ type: 'string', required: true, message: '请输入表名' }],
  className: [{ type: 'string', required: true, message: '请输入表名' }],
  tableComment: [{ type: 'string', required: true, message: '请输入表名' }],
  author: [{ type: 'string', required: true, message: '请输入表名' }],
  packageName: [{ type: 'string', required: true, message: '请输入表名' }],
  email: [{ type: 'string', required: true, message: '请输入表名' }],
  version: [{ type: 'string', required: true, message: '请输入表名' }],
  style: [{ type: 'string', required: true, message: '请输入表名' }],
  generatorType: [{ type: 'string', required: true, message: '请输入表名' }],
  moduleName: [{ type: 'string', required: true, message: '请输入表名' }],
  functionName: [{ type: 'string', required: true, message: '请输入表名' }],
});

const { validate, validateInfos } = useForm(modelRef, rulesRef);

// 赋值
const updateForm = () => {
  // 加载模版类型
  groupList.value = [];
  selectGroupList().then((res) => {
    groupList.value = res;
    get(tableId.value).then((res) => {
      nextTick(() => {
        const fieldNames = Object.keys(defaultModel) ?? [];
        Object.assign(modelRef, pick(res, fieldNames));
        if (!modelRef.style) {
          modelRef.style = groupList.value[0]?.key;
        }
      });
    });
  });
};

const handleOk = async () => {
  try {
    const valid = await validate();
    if (valid) {
      const values = toRaw(modelRef);
      update(values).then(() => {});
    }
    return !!valid;
  } catch {
    return false;
  }
};

// 暴露方法
defineExpose({
  handleOk,
});

onMounted(() => {
  updateForm();
});
</script>

<template>
  <div class="p-5">
    <a-form v-bind="formItemLayout" class="formCls">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="表名"
            name="tableName"
            v-bind="validateInfos.tableName"
          >
            <a-input v-model:value="modelRef.tableName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="注释"
            name="tableComment"
            v-bind="validateInfos.tableComment"
          >
            <a-input v-model:value="modelRef.tableComment" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="类名"
            name="className"
            v-bind="validateInfos.className"
          >
            <a-input v-model:value="modelRef.className" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="作者" name="author" v-bind="validateInfos.author">
            <a-input v-model:value="modelRef.author" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="邮箱" name="email" v-bind="validateInfos.email">
            <a-input v-model:value="modelRef.email" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="版本号"
            name="version"
            v-bind="validateInfos.version"
          >
            <a-input v-model:value="modelRef.version" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="项目包名"
            name="packageName"
            v-bind="validateInfos.packageName"
          >
            <a-input v-model:value="modelRef.packageName" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="模块名"
            name="moduleName"
            v-bind="validateInfos.moduleName"
          >
            <a-input v-model:value="modelRef.moduleName" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="功能名"
            name="functionName"
            v-bind="validateInfos.functionName"
          >
            <a-input
              v-model:value="modelRef.functionName"
              :rows="4"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="代码风格"
            name="style"
            v-bind="validateInfos.style"
          >
            <a-select
              v-model:value="modelRef.style"
              :options="groupList"
              allow-clear
              placeholder="请选择生成方式"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <!--      <a-col :span="12">-->
        <!--        <a-form-item-->
        <!--          label="表单布局"-->
        <!--          name="formLayout"-->
        <!--          v-bind="validateInfos.formLayout"-->
        <!--        >-->
        <!--          <a-radio-group v-model:value="modelRef.formLayout">-->
        <!--            <a-radio value="1">一列</a-radio>-->
        <!--            <a-radio value="2">两列</a-radio>-->
        <!--          </a-radio-group>-->
        <!--        </a-form-item>-->
        <!--      </a-col>-->
        <a-col :span="12">
          <a-form-item
            label="生成方式"
            name="generatorType"
            v-bind="validateInfos.generatorType"
          >
            <a-radio-group v-model:value="modelRef.generatorType">
              <a-radio value="0">zip压缩包</a-radio>
              <a-radio value="1">自定义目录</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <!--    <a-row :gutter="24">-->
      <!--      <a-col :span="12">-->
      <!--        <a-form-item-->
      <!--          label="后端路径"-->
      <!--          name="backendPath"-->
      <!--          v-bind="validateInfos.backendPath"-->
      <!--        >-->
      <!--          <a-input v-model:value="modelRef.backendPath" allow-clear />-->
      <!--        </a-form-item>-->
      <!--      </a-col>-->
      <!--    </a-row>-->
    </a-form>
  </div>
</template>

<style scoped>
.formCls {
  max-width: 800px;
  margin: 0 auto;
}
</style>

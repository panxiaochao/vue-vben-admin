<script setup lang="ts">
import { defineEmits, nextTick, reactive, ref, toRaw } from 'vue';

import { Form, message } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { testConn, update } from '#/api/system/development/datasource';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

// 提交loading
const submitLoading = ref(false);

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
  dbName: string | undefined;
  dbCode: string | undefined;
  dbHost: string | undefined;
  dbPort: string | undefined;
  dbDriver: string | undefined;
  dbType: string | undefined;
  dbJdbcUrl: string | undefined;
  dbUsername: string | undefined;
  dbPassword: string | undefined;
  remark: string | undefined;
  testConn: string | undefined;
  testConnTime: string | undefined;
}

const defaultModel = {
  id: undefined,
  dbName: undefined,
  dbCode: undefined,
  dbHost: undefined,
  dbPort: undefined,
  dbDriver: undefined,
  dbType: undefined,
  dbJdbcUrl: undefined,
  dbUsername: undefined,
  dbPassword: undefined,
  remark: undefined,
  testConn: undefined,
  testConnTime: undefined,
};

const modelRef = reactive<FormState>({ ...defaultModel });

const rulesRef = reactive({
  dbName: [{ type: 'string', required: true, message: '请输入数据库名称' }],
  dbCode: [{ type: 'string', required: true, message: '请输入数据源编码' }],
  dbHost: [{ type: 'string', required: true, message: '请输入主机' }],
  dbPort: [{ type: 'string', required: true, message: '请输入端口' }],
  dbType: [{ type: 'string', required: true, message: '请输入数据库类型' }],
  dbUsername: [{ type: 'string', required: true, message: '请输入用户名' }],
  dbPassword: [{ type: 'string', required: true, message: '请输入密码' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const dbTypeList = defineModel('dbTypeList', { type: Array, default: [] });

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

// 外放更新接口
const updateConnState = (raw: FormState) => {
  const rawValues = toRaw(raw || {});
  const fieldNames = Object.keys(defaultModel) ?? [];
  Object.assign(modelRef, pick(rawValues, fieldNames));
  const values = toRaw(modelRef);
  update(values).then(() => {
    $emits('done');
  });
};

const handleCancel = () => {
  resetFields();
  open.value = false;
  dbTypeList.value = [];
};

// 数据类型下拉数据变换解析
const handleDbTypeChange = (value: any, option: any) => {
  // 数据库驱动
  modelRef.dbDriver = option.driver;
  validate(['dbName', 'dbHost', 'dbPort']).then(() => {
    // 设置数据源地址
    modelRef.dbJdbcUrl = option.url.replaceAll(
      /\{(\w+)\}/g,
      (match: any, key: string) => {
        return modelRef[key] || undefined;
      },
    );
    // 设置数据库类型
    modelRef.dbType = value;
  });
};

// 测试链接
const testConnSource = () => {
  validate().then(() => {
    submitLoading.value = true;
    testConn(modelRef).then((res) => {
      submitLoading.value = false;
      if (res.testConn === '1') {
        message.success('连接成功');
      } else {
        message.error('连接失败');
      }
      modelRef.testConn = res.testConn;
      modelRef.testConnTime = res.testConnTime;
    });
  });
};

// 暴露方法
defineExpose({
  openModal,
  updateConnState,
});
</script>

<template>
  <a-modal
    :body-style="{ padding: '20px' }"
    style="top: 5%"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="编辑数据源"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-input v-model:value="modelRef.id" allow-clear class="hidden" />
      <a-form-item
        label="数据源编码"
        name="dbCode"
        v-bind="validateInfos.dbCode"
      >
        <a-input v-model:value="modelRef.dbCode" allow-clear />
      </a-form-item>
      <a-form-item
        label="数据库名称"
        name="dbName"
        v-bind="validateInfos.dbName"
      >
        <a-input v-model:value="modelRef.dbName" allow-clear />
      </a-form-item>
      <a-form-item label="主机" name="dbHost" v-bind="validateInfos.dbHost">
        <a-input v-model:value="modelRef.dbHost" allow-clear />
      </a-form-item>
      <a-form-item label="端口" name="dbPort" v-bind="validateInfos.dbPort">
        <a-input v-model:value="modelRef.dbPort" allow-clear />
      </a-form-item>
      <a-form-item
        label="数据库类型"
        name="dbType"
        v-bind="validateInfos.dbType"
      >
        <a-select
          v-model:value="modelRef.dbType"
          :options="dbTypeList"
          allow-clear
          placeholder="请选择数据库类型"
          @change="handleDbTypeChange"
        />
      </a-form-item>
      <a-form-item label="数据源地址" name="dbJdbcUrl">
        <a-textarea v-model:value="modelRef.dbJdbcUrl" :rows="4" allow-clear />
      </a-form-item>
      <a-form-item label="数据库驱动" name="dbDriver">
        <a-input v-model:value="modelRef.dbDriver" />
      </a-form-item>
      <a-form-item
        label="用户名"
        name="dbUsername"
        v-bind="validateInfos.dbUsername"
      >
        <a-input v-model:value="modelRef.dbUsername" allow-clear />
      </a-form-item>
      <a-form-item
        label="密码"
        name="dbPassword"
        v-bind="validateInfos.dbPassword"
      >
        <a-input-password v-model:value="modelRef.dbPassword" allow-clear />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="modelRef.remark" allow-clear />
      </a-form-item>
    </a-form>
    <template #footer>
      <div>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button
          key="conn"
          :loading="submitLoading"
          type="primary"
          @click="testConnSource"
        >
          测试连接
        </a-button>
        <a-button
          key="submit"
          :loading="submitLoading"
          type="primary"
          @click="handleOk"
        >
          保存
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

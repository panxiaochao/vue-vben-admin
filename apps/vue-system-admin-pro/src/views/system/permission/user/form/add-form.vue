<script setup lang="ts">
import { defineEmits, reactive, ref, toRaw } from 'vue';

import {
  Col,
  Form,
  FormItem,
  Input,
  InputPassword,
  Modal,
  Radio,
  RadioGroup,
  Row,
  Select,
  Textarea,
  TreeSelect,
} from 'ant-design-vue';

import { listTree } from '#/api/system/permission/org';
import { selectPosts } from '#/api/system/permission/post';
import { save } from '#/api/system/permission/user';
import { catchFailed } from '#/utils/error-helper';

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
  selectPosts()
    .then((res) => {
      postList.value = res;
    })
    .catch(() => catchFailed({ message: '加载岗位数据异常' }));
  // 加载机构数据
  treeData.value = [];
  listTree({})
    .then((res) => {
      treeData.value = res;
    })
    .catch(() => catchFailed({ message: '加载机构数据异常' }));
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
  <Modal
    :body-style="{ padding: '20px' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="新建用户"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <Form v-bind="formItemLayout">
      <Row :gutter="24">
        <Col :span="12">
          <FormItem
            label="用户姓名"
            name="realName"
            v-bind="validateInfos.realName"
          >
            <Input v-model:value="modelRef.realName" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="用户昵称" name="nickName">
            <Input v-model:value="modelRef.nickName" allow-clear />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem
            label="登录账号"
            name="loginName"
            v-bind="validateInfos.loginName"
          >
            <Input v-model:value="modelRef.loginName" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="登录密码" name="password">
            <InputPassword
              v-model:value="modelRef.password"
              allow-clear
              placeholder="若不填写，默认使用系统密码"
            />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem label="手机号码" name="mobile">
            <Input v-model:value="modelRef.mobile" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="性别" name="sex">
            <RadioGroup v-model:value="modelRef.sex">
              <Radio value="1">男</Radio>
              <Radio value="0">女</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem label="岗位" name="postCode">
            <Select
              v-model:value="modelRef.postCode"
              :options="postList"
              allow-clear
              placeholder="请选择岗位"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="机构" name="orgId">
            <TreeSelect
              v-model:value="modelRef.orgId"
              :tree-data="treeData"
              allow-clear
              placeholder="请选择机构"
            />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem label="邮箱" name="email">
            <Input v-model:value="modelRef.email" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="地址" name="address">
            <Input v-model:value="modelRef.address" allow-clear />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem label="人员状态" name="state">
            <RadioGroup v-model:value="modelRef.state">
              <Radio value="1">正常</Radio>
              <Radio value="0">禁用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="备注" name="remark">
            <Textarea v-model:value="modelRef.remark" allow-clear />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
</template>

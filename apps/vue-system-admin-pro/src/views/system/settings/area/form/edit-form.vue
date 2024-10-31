<script setup lang="ts">
import { defineEmits, nextTick, reactive, toRaw } from 'vue';

import { objectPick } from '@vueuse/core';
import { Col, Form, FormItem, Input, Modal, Row, Select } from 'ant-design-vue';

import { update } from '#/api/system/settings/area';

defineOptions({
  name: 'EditForm',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

const useForm = Form.useForm;

const areaLevelList = defineModel('areaLevelList', {
  type: Array,
  default: [],
});
const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

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
  parentId: undefined,
  areaName: undefined,
  areaCode: undefined,
  cityCode: undefined,
  areaLevel: undefined,
  areaNameEn: undefined,
  areaNameEnAbbr: undefined,
  longitude: undefined,
  latitude: undefined,
});

const rulesRef = reactive({
  areaName: [{ type: 'string', required: true, message: '请输入区域名称' }],
  areaCode: [{ type: 'string', required: true, message: '请输入区域编码' }],
  areaLevel: [{ type: 'number', required: true, message: '请输入区域层级' }],
});

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const openModal = (raw) => {
  const rawValues = toRaw(raw || {});
  open.value = true;
  nextTick(() => {
    // 赋值
    const fieldNames = Object.keys(modelRef) ?? [];
    const filteredFields = objectPick(rawValues, fieldNames);
    Object.assign(modelRef, filteredFields);
  });
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
  <Modal
    :body-style="{ padding: '20px' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    title="编辑区域"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <Form v-bind="formItemLayout">
      <Input v-model:value="modelRef.id" allow-clear class="hidden" />
      <Row :gutter="24">
        <Col :span="12">
          <FormItem
            label="区域名称"
            name="areaName"
            v-bind="validateInfos.areaName"
          >
            <Input v-model:value="modelRef.areaName" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem
            label="区域编码"
            name="areaCode"
            v-bind="validateInfos.areaCode"
          >
            <Input v-model:value="modelRef.areaCode" allow-clear />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem
            label="区域层级"
            name="areaLevel"
            v-bind="validateInfos.areaLevel"
          >
            <Select
              v-model:value="modelRef.areaLevel"
              :options="areaLevelList"
              allow-clear
              placeholder="请选择区域层级"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="行政编码" name="cityCode">
            <Input v-model:value="modelRef.cityCode" allow-clear />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem label="英文名称" name="areaNameEn">
            <Input v-model:value="modelRef.areaNameEn" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="英文简称" name="areaNameEnAbbr">
            <Input v-model:value="modelRef.areaNameEnAbbr" allow-clear />
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="24">
        <Col :span="12">
          <FormItem label="经度" name="longitude">
            <Input v-model:value="modelRef.longitude" allow-clear />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="维度" name="latitude">
            <Input v-model:value="modelRef.latitude" allow-clear />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
</template>

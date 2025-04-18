<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive, ref } from 'vue';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { importTables, queryDsTable } from '#/api/system-plus/development/gen-table';

defineOptions({
  name: 'ImportTable',
  inheritAttrs: false,
});

// 定义组件的事件
const $emits = defineEmits(['done']);

// 提交loading
const submitLoading = ref(false);

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', { type: Number, default: 800 });

const dataSourceList = defineModel('dataSourceList', {
  type: Array,
  default: [],
});

// 查询对象
interface FormState {
  databaseId: string;
  tableName: string;
}

const defaultModel = {
  databaseId: '',
  tableName: '',
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

// 字段对象
interface RowType {
  tableName: string;
  tableComment: string;
}

// 字段定义
const columns = [
  { type: 'checkbox', width: 60 },
  { field: 'tableName', title: '表名' },
  { field: 'tableComment', title: '表注释' },
];

// 搜索表单定义
const formOptions: VbenFormProps = {
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    labelClass: 'w-auto',
    wrapperClass: 'pr-3',
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 重置函数
  handleReset: onReset,
  schema: [
    {
      component: 'Select',
      fieldName: 'databaseId',
      label: '数据源：',
      componentProps: () => {
        return {
          options: dataSourceList,
          placeholder: '请输入数据源',
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'tableName',
      label: '表名：',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表名',
      },
    },
  ],
  showCollapseButton: false,
};

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

// 远程获取数据
function fetchData(params: object) {
  gridApi.setLoading(true);
  queryDsTable(params)
    .then((res) => {
      gridApi.setGridOptions({
        data: res,
      });
    })
    .catch(() => {
      gridApi.setGridOptions({
        data: [],
      });
    })
    .finally(() => {
      gridApi.setLoading(false);
    });
}

const openModal = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
  gridApi.setGridOptions({ data: [] });
  gridApi.formApi.resetForm();
};

function onSubmit(values: Record<string, any>) {
  if ((values.databaseId ?? '') === '') {
    message.error('请选择数据源！');
    gridApi.setGridOptions({
      data: [],
    });
  } else {
    Object.assign(modelRef, values);
    fetchData(modelRef);
  }
}

function onReset() {
  gridApi.formApi.resetForm();
  gridApi.setGridOptions({ data: [] });
}

const handleImport = () => {
  const checkRecords = gridApi.grid?.getCheckboxRecords();
  if (checkRecords.length > 0) {
    if (checkRecords.length > 10) {
      message.error('勾选数量请少于10个！');
    } else {
      const tableNames = checkRecords.map((item) => {
        return item?.tableName;
      });
      // message.info(JSON.stringify(tableNames));
      submitLoading.value = true;
      importTables(modelRef.databaseId, tableNames)
        .then(() => {
          message.info('导入成功');
          onReset();
          open.value = false;
          // 刷新
          $emits('done');
        })
        .finally(() => {
          submitLoading.value = false;
        });
    }
  } else {
    message.error('请勾选需要导入的表数据！');
  }
};

// 暴露方法
defineExpose({
  openModal,
});
</script>

<template>
  <a-drawer
    :body-style="{ backgroundColor: 'hsl(var(216 20.11% 95.47%))' }"
    :mask-closable="false"
    :open="open"
    :width="width"
    placement="right"
    title="导入表"
    @close="onClose"
    :footer-style="{ textAlign: 'right' }"
  >
    <Grid />
    <template #footer>
      <a-space>
        <a-button key="back" @click="onClose">取消</a-button>
        <a-button
          key="submit"
          :loading="submitLoading"
          type="primary"
          @click="handleImport"
        >
          导入
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<style scoped>
:deep() {
  .bg-background-deep {
    background-color: #fff;
  }
}

.footer-bottom-button {
  position: relative;
  bottom: 0;
  right: 0;
}
</style>

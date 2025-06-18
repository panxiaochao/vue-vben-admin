<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, nextTick, onMounted, reactive, toRaw } from 'vue';

import { PlusCircleOutlined } from '@ant-design/icons-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectAttrTypes } from '#/api/system-plus/development/gen-column';
import { FIELD_TABLE_DATA } from '#/views/system-plus/development/onlinetable/form/field-table-data';

defineOptions({
  name: 'FieldTable',
  inheritAttrs: false,
});

// 字段对象
interface RowType {
  columnName: string | undefined;
  columnComment: string | undefined;
  jdbcTypeName: string | undefined;
  columnLength: number | undefined;
  scale: number | undefined;
  columnDefault: string | undefined;
  primaryKey: boolean | undefined;
  nullable: boolean | undefined;
}

// 是否主键 checkbox 组件
const primaryKeyCheckBox = {
  name: 'VxeCheckbox',
};

// 是否可空 checkbox 组件
const nullableCheckBox = {
  name: 'VxeCheckbox',
};

// 字段类型 下拉框组件
const jdbcTypeSelect = reactive({
  name: 'select',
  options: [
    { label: '女', value: 'Women' },
    { label: '男', value: 'Man' },
  ],
  optionProps: {
    label: 'label',
    value: 'value',
  },
});

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'columnName',
      title: '字段名称',
      dragSort: true,
      align: 'left',
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'columnComment',
      title: '注释',
      align: 'left',
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'jdbcTypeName',
      title: '字段类型',
      width: 135,
      editRender: jdbcTypeSelect,
    },
    {
      field: 'columnLength',
      title: '字段长度',
      width: 110,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'scale',
      title: '字段精度',
      width: 110,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'columnDefault',
      title: '默认值',
      width: 120,
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'primaryKey',
      title: '主键',
      cellRender: primaryKeyCheckBox,
      width: 50,
    },
    {
      field: 'nullable',
      title: 'Null',
      cellRender: nullableCheckBox,
      width: 50,
    },
    {
      field: 'action',
      title: '操作',
      width: 80,
      slots: { default: 'action' },
    },
  ],
  data: [],
  keepSource: true,
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  rowConfig: {
    drag: true,
  },
  height: '500px',
  pagerConfig: {
    enabled: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 加载数据
function loadData() {
  // 加载默认数据
  gridApi.setGridOptions({ data: FIELD_TABLE_DATA });
  nextTick(() => {
    // 加载 attrType 数据
    selectAttrTypes().then((res) => {
      Object.assign(jdbcTypeSelect.options, res);
      console.log(jdbcTypeSelect);
    });
  });
}

// 提交数据
const submitHandler = () => {
  const data = gridApi.grid.getFullData();
  console.log(data);
};

// 添加字段
const addColumn = async () => {
  // 以下方法原数据顺序不会改变
  // const newRow = await gridApi.grid.createRow({
  //   columnName: `${Date.now()}`,
  // });
  // // 使用 insertAt 方法插入新行
  // gridApi.grid.insertAt(newRow, 2);
  // await nextTick();
  // gridApi.grid.setEditRow(newRow);
  const fullData = gridApi.grid.getFullData();
  if (fullData.length > 0) {
    const newRow = await gridApi.grid.createRow({
      columnName: `${Date.now()}`,
    });
    const data = toRaw(fullData);
    data?.splice(1, 0, newRow);
    gridApi.setGridOptions({ data });
  } else {
    gridApi.setGridOptions({ data: FIELD_TABLE_DATA });
  }
};

const deleteColumn = (row: RowType) => {
  gridApi.grid.remove(row);
};

// 暴露方法
defineExpose({
  submitHandler,
});

onMounted(() => {
  loadData();
});
</script>

<template>
  <Grid>
    <template #toolbar-actions>
      <a-button
        :icon="h(PlusCircleOutlined)"
        class="mr-2"
        type="primary"
        @click="addColumn"
      >
        添加字段
      </a-button>
    </template>
    <template #action="{ row }">
      <a-button class="px-0" danger type="link" @click="deleteColumn(row)">
        <template #icon>
          <DeleteOutlined />
        </template>
        删除
      </a-button>
    </template>
  </Grid>
</template>

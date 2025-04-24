<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, reactive, ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  queryTableColumnList,
  selectAttrTypes,
  updateBatch,
} from '#/api/system-plus/development/gen-column';

defineOptions({
  name: 'FieldInfo',
  inheritAttrs: false,
});

// attrType下拉
const attrTypeList = reactive([]);

const spinning = ref(false);

const fillList = reactive([
  { label: 'DEFAULT', value: 'DEFAULT' },
  { label: 'INSERT', value: 'INSERT' },
  { label: 'UPDATE', value: 'UPDATE' },
  { label: 'INSERT_UPDATE', value: 'INSERT_UPDATE' },
]);

const tableId = defineModel('tableId', { type: String, default: '' });

// 字段对象
interface RowType {
  id: string;
  tableId: string | undefined;
  tableName: string | undefined;
  fieldName: string | undefined;
  fieldType: string | undefined;
  fieldComment: string | undefined;
  attrName: string | undefined;
  attrType: string | undefined;
  packageName: string | undefined;
  autoIncrement: string | undefined;
  sort: string | undefined;
  autoFill: string | undefined;
  primaryPk: string | undefined;
  checked: boolean;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { type: 'checkbox', title: '主键' },
    {
      field: 'autoIncrement',
      title: '自增',
      width: 70,
      slots: { default: 'autoIncrement' },
    },
    { field: 'fieldName', title: '字段名' },
    { editRender: { name: 'input' }, field: 'fieldComment', title: '说明' },
    {
      field: 'fieldType',
      title: '字段类型',
    },
    {
      editRender: { name: 'input' },
      field: 'attrName',
      title: '属性名',
    },
    {
      editRender: { name: 'select', options: attrTypeList },
      field: 'attrType',
      title: '属性类型',
    },
    {
      editRender: { name: 'select', options: fillList },
      field: 'autoFill',
      title: '自动填充',
    },
  ],
  data: [],
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  checkboxConfig: {
    checkField: 'checked',
  },
  height: '500px',
  pagerConfig: {
    enabled: false,
  },
  // showOverflow: true,
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 加载数据
async function loadData() {
  fetchData(tableId.value);
  selectInit();
}

// 远程获取数据
function fetchData(tableId: string) {
  queryTableColumnList(tableId).then((res) => {
    const modifiedData = res.map((item: RowType) => {
      if (item.primaryPk === '1') {
        return {
          ...item,
          checked: true,
        };
      }
      return item;
    });
    gridApi.setGridOptions({
      data: modifiedData,
    });
  });
}

const formatAutoIncrement = (row: RowType) => {
  return row.autoIncrement === '1' ? '是' : '否';
};

// 提交数据
const submitHandler = () => {
  return new Promise((resolve) => {
    spinning.value = true;
    const data = gridApi.grid.getData();
    updateBatch(data).then(() => {
      spinning.value = false;
      resolve(true);
    });
  });
};

// 下拉初始化
const selectInit = () => {
  // 加载attrType数据
  selectAttrTypes().then((res) => {
    Object.assign(attrTypeList, res);
  });
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
  <a-spin :spinning="spinning">
    <Grid>
      <template #autoIncrement="{ row }">
        <a-tag
          :color="row.autoIncrement === '1' ? 'red' : 'default'"
          class="mr-0"
        >
          {{ formatAutoIncrement(row) }}
        </a-tag>
      </template>
    </Grid>
  </a-spin>
</template>

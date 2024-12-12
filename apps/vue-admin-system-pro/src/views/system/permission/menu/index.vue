<script setup lang="ts">
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { FormOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { deleteById, tableTree } from '#/api/system/permission/menu';

// 自定义组件
import AddForm from './form/add-form.vue';
import EditForm from './form/edit-form.vue';

const addForm = ref();
const editForm = ref();

// 字段对象
interface RowType {
  id: string;
  menuName: null | string;
  menuType: string;
  icon: string;
  componentName: string;
  component: number;
  url: string;
  permissionCode: string;
  sort: string;
  isHidden: string;
  state: string;
  children: RowType[];
}

// 字段定义
const columns = [
  {
    title: '菜单名称',
    field: 'menuName',
    treeNode: true,
    width: 200,
  },
  {
    title: '菜单类型',
    field: 'menuType',
    slots: {
      default: 'menuType',
    },
  },
  {
    title: '图标',
    field: 'icon',
    slots: {
      default: 'icon',
    },
  },
  { title: '路由名称', field: 'componentName' },
  // { title: '前端组件', field: 'component' },
  { title: '路由地址', field: 'url' },
  { title: '授权标识', field: 'permissionCode' },
  { title: '排序', field: 'sort' },
  // {
  //   title: '是否显示',
  //   field: 'isHidden',
  //   slots: {
  //     default: 'isHidden',
  //   },
  // },
  {
    title: '状态',
    field: 'state',
    slots: {
      default: 'state',
    },
  },
  { field: 'action', title: '操作', width: 120, slots: { default: 'action' } },
];

const gridOptions: VxeGridProps<RowType> = {
  columns,
  data: [],
  // loading: false,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    // 对于同一级的节点，每次只能展开一个
    accordion: true,
    parentField: 'parentId',
    rowField: 'id',
    childrenField: 'children',
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 加载远程数据
const loadData = () => {
  gridApi.setLoading(true);
  tableTree({}).then((res) => {
    gridApi.setGridOptions({ data: res });
    gridApi.setLoading(false);
  });
};

const formatState = (row: RowType) => {
  return row.state === '1' ? '正常' : '禁用';
};

const formatHidden = (row: RowType) => {
  return row.isHidden === '0' ? '显示' : '隐藏';
};

// 自定义方法
const deleteRow = (row: RowType) => {
  deleteById(row.id).then(() => {
    message.success('删除成功');
    loadData();
  });
};

// 表单处理完成做刷新处理
const formDone = () => {
  loadData();
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page auto-content-height>
    <AddForm ref="addForm" :width="600" @done="formDone" />
    <EditForm ref="editForm" :width="600" @done="formDone" />
    <Grid>
      <template #toolbar-actions>
        <a-button
          :icon="h(FormOutlined)"
          class="mr-2"
          type="primary"
          @click="addForm.openModal()"
        >
          新建菜单
        </a-button>
      </template>
      <template #menuType="{ row }">
        <a-tag v-if="row.menuType === '0'" color="cyan">一级菜单</a-tag>
        <a-tag v-if="row.menuType === '1'" color="blue">子菜单</a-tag>
        <a-tag v-if="row.menuType === '2'" color="purple">按钮权限</a-tag>
      </template>
      <template #icon="{ row }">
        <div v-if="row.icon != null && row.icon !== ''">
          <component :is="row.icon" />
        </div>
      </template>
      <template #state="{ row }">
        <a-tag :color="row.state === '1' ? 'success' : 'red'" class="mr-0">
          {{ formatState(row) }}
        </a-tag>
      </template>
      <template #isHidden="{ row }">
        <div v-if="row.menuType !== '2'">
          <a-tag :color="row.isHidden === '0' ? 'success' : 'red'" class="mr-0">
            {{ formatHidden(row) }}
          </a-tag>
        </div>
      </template>
      <template #action="{ row }">
        <a-button class="px-0" type="link" @click="editForm.openModal(row)">
          编辑
        </a-button>
        <a-divider type="vertical" />
        <a-popconfirm
          placement="top"
          title="删除本菜单与下级？"
          @confirm="() => deleteRow(row)"
        >
          <a-button class="px-0" danger type="link">删除</a-button>
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid, type VxeGridProps } from '#/adapter/vxe-table';
import { listTree, selectAreaLevels } from '#/api/system/settings/area';

// 自定义组件
import EditForm from './form/edit-form.vue';

const editForm = ref();

// 字段对象
interface RowType {
  id: string;
  parentId: null | string;
  areaName: string;
  areaCode: string;
  cityCode: string;
  areaLevel: number;
  areaNameEn: string;
  areaNameEnAbbr: string;
  longitude: string;
  latitude: string;
  children: RowType[];
}

interface AreaLevel {
  disabled: boolean;
  key: number;
  label: string;
  title: string;
  value: number;
  weight: number;
}

// 区域层级
const areaLevelList = ref<AreaLevel[]>([]);

// 字段定义
const columns = [
  {
    title: '区域名称',
    field: 'areaName',
    width: 350,
    treeNode: true,
    slots: { default: 'areaName' },
  },
  { title: '区域编码', field: 'areaCode' },
  { title: '行政编码', field: 'cityCode' },
  { title: '区域层级', field: 'areaLevel', slots: { default: 'areaLevel' } },
  { title: '英文名称', field: 'areaNameEn' },
  { title: '英文简称', field: 'areaNameEnAbbr' },
  { title: '经度', field: 'longitude' },
  { title: '纬度', field: 'latitude' },
];

const loadChildren = ({ row }: { row: RowType }) => {
  return new Promise<RowType[]>((resolve) => {
    listTree({ areaCode: row.areaCode }).then((res) => {
      resolve(res);
    });
  });
};

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
    lazy: true,
    hasChildField: 'children',
    loadMethod: loadChildren,
  },
};

// 定义表格
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 加载区域层级数据
const loadAreaLevel = () => {
  // 加载区域层级数据
  areaLevelList.value = [];
  selectAreaLevels().then((res) => {
    areaLevelList.value = res;
  });
};

// 加载远程数据
const loadData = () => {
  listTree({}).then((res) => {
    gridApi.setGridOptions({ data: res });
  });
};

// 格式化数据
const formatAreaLevel = (row: RowType) => {
  const areaLevel = areaLevelList.value.find(
    (item) => item.value === row.areaLevel,
  )!;
  return areaLevel.title;
};

// 表单处理完成做刷新处理
const formDone = () => {
  loadData();
};

onMounted(() => {
  loadAreaLevel();
  loadData();
});
</script>

<template>
  <Page auto-content-height>
    <EditForm
      ref="editForm"
      :area-level-list="areaLevelList"
      :width="900"
      @done="formDone"
    />
    <Grid>
      <template #areaLevel="{ row }">
        <span>{{ formatAreaLevel(row) }}</span>
      </template>
      <template #areaName="{ row }">
        <Button class="px-0" type="link" @click="editForm.openModal(row)">
          {{ row.areaName }}
        </Button>
      </template>
      <!--      <template #action="{ row }">-->
      <!--        <Button class="px-0" type="link" @click="editForm.openModal(row)">-->
      <!--          编辑-->
      <!--        </Button>-->
      <!--        <Divider type="vertical" />-->
      <!--        <Popconfirm-->
      <!--          placement="top"-->
      <!--          title="确定要删除吗?"-->
      <!--          @confirm="() => deleteRow(row)"-->
      <!--        >-->
      <!--          <Button class="px-0" danger type="link">删除</Button>-->
      <!--        </Popconfirm>-->
      <!--        <Divider type="vertical" />-->
      <!--        <Dropdown :arrow="{ pointAtCenter: true }" placement="bottomRight">-->
      <!--          <Button class="px-0" type="link">-->
      <!--            更多-->
      <!--            <DownOutlined />-->
      <!--          </Button>-->
      <!--          <template #overlay>-->
      <!--            <Menu>-->
      <!--              <MenuItem>-->
      <!--                <a>密码管理</a>-->
      <!--              </MenuItem>-->
      <!--              <MenuItem>-->
      <!--                <a @click="selectRoles(row)">授权角色</a>-->
      <!--              </MenuItem>-->
      <!--            </Menu>-->
      <!--          </template>-->
      <!--        </Dropdown>-->
      <!--      </template>-->
    </Grid>
  </Page>
</template>

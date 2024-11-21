<script setup lang="ts">
import { nextTick, reactive, ref, toRaw } from 'vue';

import { UpOutlined } from '@ant-design/icons-vue';
import { pick } from 'lodash-es';

import { queryAllTree } from '#/api/system/permission/menu';
import {
  queryPackageMenus,
  savePackageMenus,
} from '#/api/system/tenant/tenant-package-menu';

defineOptions({
  name: 'GrantTenantResource',
  inheritAttrs: false,
});

// 菜单数据
const menuList = ref([]);
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
  packageId: string;
  packageName: string;
  // 是否自动展开父节点
  autoExpandParent: boolean;
  // 层级关联：true 取消关联，false 父子关联
  checkStrictly: boolean;
  // 下拉菜单
  treeData: string[];
  // 展开指定的树节点
  expandedKeys: string[];
  // 设置选中的树节点
  selectedKeys: string[];
  // 所有菜单ID
  allTreeKeys: string[];
  // 选中复选框的树节点
  checkedKeys: string[];
}

const defaultModel = {
  packageId: '',
  packageName: '',
  // 是否自动展开父节点
  autoExpandParent: true,
  // 父子节点选中状态不再关联
  checkStrictly: true,
  // 下拉菜单
  treeData: [],
  // 展开指定的树节点
  expandedKeys: [],
  // 设置选中的树节点
  selectedKeys: [],
  // 所有菜单ID
  allTreeKeys: [],
  // 选中复选框的树节点
  checkedKeys: [],
};

const modelRef = reactive<FormState>({
  ...defaultModel,
});

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
  // 加载角色下拉数据
  menuList.value = [];
  queryAllTree({}).then((res) => {
    menuList.value = res.list;
    modelRef.allTreeKeys = res.ids;
    updateForm(raw);
    // 查询已关联菜单权限数据
    queryPackageMenus({ packageId: raw.packageId }).then((res) => {
      modelRef.checkedKeys = [...res];
      modelRef.expandedKeys = [...res];
    });
  });
};

const handleOk = () => {
  const values = toRaw(modelRef);
  const postBody = {
    packageId: values.packageId,
    menuId: values.checkedKeys.join(','),
  };
  savePackageMenus(postBody).then(() => {
    Object.assign(modelRef, defaultModel);
    open.value = false;
  });
};

const handleCancel = () => {
  open.value = false;
  Object.assign(modelRef, defaultModel);
};

// 切换父子关联
const switchCheckStrictly = (flag: boolean) => {
  modelRef.checkStrictly = flag;
};

// 折叠全部
const closeAll = () => {
  modelRef.expandedKeys = [];
};

// 全部勾选
const checkALL = () => {
  modelRef.checkedKeys = modelRef.allTreeKeys;
};

// 取消勾选
const cancelCheckALL = () => {
  modelRef.checkedKeys = [];
};

// 展开所有
const expandAll = () => {
  modelRef.expandedKeys = modelRef.allTreeKeys;
};

const onExpand = (keys: any) => {
  modelRef.expandedKeys = keys;
  modelRef.autoExpandParent = false;
};

const onCheck = (o: any, e: any) => {
  console.log('onCheck', o, e);
  // checkStrictly: true 取消关联
  if (modelRef.checkStrictly) {
    modelRef.checkedKeys = o.checked;
  } else {
    // false 父子关联
    modelRef.checkedKeys = o;
    // modelRef.checkedKeys = [...new Set([...e.halfCheckedKeys, ...keys])];
    // const keys = getNodeAllKey(e.node);
    // console.log(keys, modelRef.checkedKeys);
    // if (e.checked) {
    //   // 反复操作下可能会有重复的keys，得用new Set去重下
    //   modelRef.checkedKeys = [...new Set([...keys, ...modelRef.checkedKeys])];
    // } else {
    //   modelRef.checkedKeys = removeMatchingItems(modelRef.checkedKeys, keys);
    // }
  }
};

/**
 * 2024-04-26
 * liaozhiyang
 * 删除相匹配数组的项
 */
function removeMatchingItems(arr1, arr2) {
  // 使用哈希表记录 arr2 中的元素
  const hashTable = {};
  for (const item of arr2) {
    hashTable[item] = true;
  }
  // 使用 filter 方法遍历第一个数组，过滤出不在哈希表中存在的项
  return arr1.filter((item) => !hashTable[item]);
}
/**
 * 2024-04-26
 * liaozhiyang
 * 获取当前节点及以下所有子孙级的key
 */
function getNodeAllKey(node: any) {
  const result: any = [];
  result.push(node.key);
  const recursion = (data) => {
    data.forEach((item: any) => {
      result.push(item.key);
      if (item.children?.length) {
        recursion(item.children);
      }
    });
  };
  node.children?.length && recursion(node.children);
  return result;
}

const onSelect = (keys: string[], e: any) => {
  console.log('onSelect', keys, e);
  modelRef.selectedKeys = keys && keys.length > 0 ? keys : [];
};

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
    title="授权套餐资源"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="套餐名称"> {{ modelRef.packageName }} </a-form-item>
      <a-form-item label="菜单权限" name="menuId">
        <a-tree
          v-model:checked-keys="modelRef.checkedKeys"
          v-model:expanded-keys="modelRef.expandedKeys"
          v-model:selected-keys="modelRef.selectedKeys"
          :auto-expand-parent="modelRef.autoExpandParent"
          :check-strictly="modelRef.checkStrictly"
          :height="450"
          :tree-data="menuList"
          checkable
          @check="onCheck"
          @expand="onExpand"
          @select="onSelect"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <div>
        <div class="footer-bottom-button">
          <a-dropdown
            :arrow="{ pointAtCenter: true }"
            :trigger="['click']"
            placement="top"
            style="float: left"
          >
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="switchCheckStrictly(false)">
                  父子关联
                </a-menu-item>
                <a-menu-item key="2" @click="switchCheckStrictly(true)">
                  取消关联
                </a-menu-item>
                <a-menu-item key="3" @click="checkALL">选择全部</a-menu-item>
                <a-menu-item key="4" @click="cancelCheckALL">
                  取消选择
                </a-menu-item>
                <a-menu-item key="5" @click="expandAll">展开全部</a-menu-item>
                <a-menu-item key="6" @click="closeAll">折叠全部</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              <UpOutlined />
              树操作
            </a-button>
          </a-dropdown>
        </div>
        <a-button @click="handleCancel">取消</a-button>
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

<style scoped>
.footer-bottom-button {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px 16px;
}
</style>

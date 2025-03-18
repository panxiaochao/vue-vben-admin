<script setup lang="ts">
import { nextTick, reactive, ref, toRaw } from 'vue';

import { UpOutlined } from '@ant-design/icons-vue';
import { difference, pick } from 'lodash-es';

import { queryAllTree } from '#/api/system-plus/permission/menu';
import {
  queryRoleMenus,
  saveRoleMenus,
} from '#/api/system-plus/permission/role-menu';

defineOptions({
  name: 'GrantRoleResource',
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
  id: string;
  roleName: string;
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
  id: '',
  roleName: '',
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
  menuList.value = [];
  queryAllTree({}).then((res) => {
    menuList.value = res.list;
    modelRef.allTreeKeys = res.ids;
    updateForm(raw);
    // 查询已关联菜单权限数据
    queryRoleMenus({ roleId: raw.id }).then((res) => {
      modelRef.checkedKeys = [...res];
      modelRef.expandedKeys = [...res];
    });
  });
};

const handleOk = () => {
  const values = toRaw(modelRef);
  const postBody = {
    roleId: values.id,
    menuId: values.checkedKeys.join(','),
  };
  saveRoleMenus(postBody).then(() => {
    Object.assign(modelRef, defaultModel);
    open.value = false;
  });
};

const handleCancel = () => {
  open.value = false;
  Object.assign(modelRef, defaultModel);
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

// 删除相匹配数组的项
const removeMatchingItems = (target: string[], source: string[]) => {
  return difference(target, source);
};

// 获取当前节点及以下所有子孙级的key
function getNodeAllKey(node: any) {
  const keys: any = [];
  keys.push(node.key);
  const recursion = (data: any) => {
    data.forEach((item: any) => {
      keys.push(item.key);
      if (item.children?.length) {
        recursion(item.children);
      }
    });
  };
  node.children?.length && recursion(node.children);
  return keys;
}

// 获取当前节点的父节点及所有父节点
const findParentNodeKey = (node: any) => {
  const keys: any = [];
  if (node.parent) {
    keys.push(node.parent.key);
    const recursion = (data: any) => {
      keys.push(data.key);
      data.parent && recursion(data.parent);
    };
    node.parent?.parent && recursion(node.parent.parent);
  }
  return keys;
};

const onCheck = (o: any, e: any) => {
  const keys = getNodeAllKey(e.node);
  const parentKeys = findParentNodeKey(e.node);
  modelRef.checkedKeys = e.checked
    ? [...new Set([...keys, ...o.checked, ...parentKeys])]
    : removeMatchingItems(o.checked, keys);
};

const onSelect = (keys: string[]) => {
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
    title="授权角色资源"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="角色名称"> {{ modelRef.roleName }} </a-form-item>
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
                <a-menu-item key="3" @click="checkALL">选择全部</a-menu-item>
                <a-menu-item key="4" @click="cancelCheckALL">
                  取消选择
                </a-menu-item>
                <a-menu-divider />
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

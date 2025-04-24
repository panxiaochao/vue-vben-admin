<script setup lang="ts">
import type { LanguageType } from '@pxc/codemirror';

import { ref, unref } from 'vue';

import { FileTextOutlined } from '@ant-design/icons-vue';
import { CodeEdit } from '@pxc/codemirror';

import { preview } from '#/api/system-plus/development/gen';

// 自定义组件
defineOptions({
  name: 'CodePreview',
  inheritAttrs: false,
});

const codeEditRef = ref();

const activeKey = ref('');

interface PreviewEntity {
  codeType: LanguageType;
  content: string;
  fileName: string;
  filePath: string;
  id: string;
}

const previewData = ref<PreviewEntity[]>([]);

interface TreeNode {
  key: string;
  children: TreeNode[];
  title: string;
  isFile: boolean;
}

const fileTree = ref<TreeNode[]>([]);
// 展开指定的树节点
const expandedKeys = ref<string[]>([]);
// 所有菜单ID
const allTreeKeys = ref<string[]>([]);
// 是否展开
const expandCheck = ref(false);

const tableId = defineModel('tableId', { type: String, default: '' });

const open = defineModel('open', { type: Boolean, default: false });

const width = defineModel('width', {
  type: [String, Number],
  default: 800 as number | string,
});

const openModal = () => {
  open.value = true;
  const fileOriginal: string[] = [];
  preview(tableId.value).then((res) => {
    previewData.value = res;
    res.forEach((item: PreviewEntity) => fileOriginal.push(item.filePath));
    fileTree.value = handleFileOriginal(fileOriginal);
    // 定义递归函数来获取所有节点的 key
    const getAllKeys = (nodes: TreeNode[]): string[] => {
      let keys: string[] = [];
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children && node.children.length > 0) {
          keys = [...keys, ...getAllKeys(node.children)];
        }
      });
      return keys;
    };
    allTreeKeys.value = getAllKeys(fileTree.value);
    if (res.length > 0) {
      activeKey.value = res[0]?.fileName;
    }
  });
};

const handleFileOriginal = (fileOriginal: string[]): TreeNode[] => {
  const root: TreeNode = {
    key: '',
    children: [] as TreeNode[],
    title: '代码目录',
    isFile: false,
  };

  // 边界条件：输入为空时直接返回根节点
  if (fileOriginal.length === 0) {
    return [root];
  }

  // 缓存子节点以优化查找性能
  const childMap: Map<string, TreeNode> = new Map();

  fileOriginal.forEach((path) => {
    const parts = path.split('/');
    let currentNode: TreeNode = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let childNode: TreeNode | undefined = findChild(
        currentNode,
        part,
        childMap,
      );

      if (!childNode) {
        childNode = {
          key: `${currentNode.key}/${part}`,
          title: part,
          children: [] as TreeNode[],
          isFile,
        };
        currentNode.children.push(childNode);
        // 更新缓存
        childMap.set(`${currentNode.key}/${part}`, childNode);
      }
      currentNode = childNode;
    });
  });

  // 递归排序函数
  const sortTree = (node: TreeNode) => {
    if (node.children.length > 0) {
      // 排序：文件夹优先
      node.children.sort((a, b) => {
        if (a.isFile === b.isFile) return 0;
        return a.isFile ? 1 : -1;
      });
      // 递归排序子节点
      node.children.forEach((node: TreeNode) => {
        sortTree(node);
      });
    }
  };
  sortTree(root);
  return [root];
};

const findChild = (
  node: TreeNode,
  name: string,
  childMap: Map<string, TreeNode>,
): TreeNode | undefined => {
  const cachedKey = `${node.key}/${name}`;
  return (
    childMap.get(cachedKey) ??
    node.children.find((child) => child.title === name)
  );
};

const onSelect = (keys: string[], e: { node: TreeNode }) => {
  const node = e?.node;
  if (node.isFile) {
    activeKey.value = node.title;
  }
};

// 展开
const expandClick = (checked: boolean | number | string) => {
  expandedKeys.value = checked ? allTreeKeys.value : [];
  console.log(unref(fileTree.value));
};

const handleCancel = () => {
  open.value = false;
  fileTree.value = [];
  previewData.value = [];
  expandedKeys.value = [];
  allTreeKeys.value = [];
  expandCheck.value = false;
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
    :destroy-on-close="true"
    title="预览"
    wrap-class-name="full-modal"
    @cancel="handleCancel"
    :footer="null"
  >
    <!--    <a-layout>-->
    <!--      <a-layout>-->
    <!--        <a-layout-sider width="25%">-->
    <!--          <a-tree :tree-data="fileTree" class="compact-tree" @select="onSelect">-->
    <!--            <template #title="{ dataRef }">-->
    <!--              <template v-if="dataRef.isFile">-->
    <!--                <FileTextOutlined class="mr-1" />-->
    <!--              </template>-->
    <!--              <span>{{ dataRef.title }}</span>-->
    <!--            </template>-->
    <!--          </a-tree>-->
    <!--        </a-layout-sider>-->
    <!--        <a-layout>-->
    <!--          <a-layout-content>-->
    <!--            <a-tabs v-model:active-key="activeKey">-->
    <!--              <a-tab-pane-->
    <!--                v-for="item in previewData"-->
    <!--                :key="item.fileName"-->
    <!--                :tab="item.fileName"-->
    <!--              >-->
    <!--                <CodeEdit-->
    <!--                  ref="codeEditRef"-->
    <!--                  :model-value="item.content"-->
    <!--                  :language="item.codeType"-->
    <!--                  :height="650"-->
    <!--                  :options="{-->
    <!--                    disabled: true,-->
    <!--                  }"-->
    <!--                />-->
    <!--              </a-tab-pane>-->
    <!--            </a-tabs>-->
    <!--          </a-layout-content>-->
    <!--        </a-layout>-->
    <!--      </a-layout>-->
    <!--    </a-layout>-->
    <a-row>
      <a-col :span="6">
        <div style="margin-bottom: 16px">
          <div style="margin-bottom: 16px">
            是否展开:
            <a-switch v-model:checked="expandCheck" @click="expandClick" />
          </div>
        </div>
        <a-tree
          :tree-data="fileTree"
          class="compact-tree"
          @select="onSelect"
          v-model:expanded-keys="expandedKeys"
        >
          -->
          <template #title="{ dataRef }">
            <template v-if="dataRef.isFile">
              <FileTextOutlined class="mr-1" />
            </template>
            <span>{{ dataRef.title }}</span>
          </template>
        </a-tree>
      </a-col>
      <a-col :span="18">
        <a-tabs v-model:active-key="activeKey">
          <a-tab-pane
            v-for="item in previewData"
            :key="item.fileName"
            :tab="item.fileName"
          >
            <CodeEdit
              ref="codeEditRef"
              :model-value="item.content"
              :language="item.codeType"
              :height="650"
              :options="{
                disabled: true,
              }"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-modal>
</template>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    height: 100%;
    min-height: calc(100vh - 0px);
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}

// 新增紧凑样式
.compact-tree {
  .ant-tree-node-content-wrapper {
    min-height: 20px;
    line-height: 20px;
    border-radius: 4px;
  }

  .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #8cd6ff;
  }

  .ant-tree-switcher {
    width: 14px;
    height: 14px;
    line-height: 14px;
  }

  .ant-tree-indent-unit {
    width: 12px;
  }

  .ant-tree-treenode {
    margin: 1px 0;
    padding: 0;
  }
}
</style>

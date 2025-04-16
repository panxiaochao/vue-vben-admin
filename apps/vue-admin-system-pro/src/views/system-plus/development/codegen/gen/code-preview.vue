<script setup lang="ts">
import type { LanguageType } from '@pxc/codemirror';

import { ref } from 'vue';

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
    if (res.length > 0) {
      activeKey.value = res[0]?.fileName;
    }
  });
};

const handleFileOriginal = (fileOriginal: string[]): TreeNode[] => {
  const root: TreeNode = {
    key: 'root',
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
          key: part,
          title: part,
          children: [] as TreeNode[],
          isFile,
        };
        currentNode.children.push(childNode ?? []);
        // 更新缓存
        childMap.set(`${currentNode.key}/${part}`, childNode);
      }
      currentNode = childNode;
    });
  });
  return [root];
};

const findChild = (
  node: TreeNode,
  name: string,
  childMap: Map<string, TreeNode>,
): TreeNode | undefined => {
  const cachedKey = `${node.key}/${name}`;
  if (childMap.has(cachedKey)) {
    return childMap.get(cachedKey)!;
  }
  return node.children.find((child) => child.title === name);
};

const onSelect = (keys: string[], e: { node: TreeNode }) => {
  const node = e.node;
  if (node.isFile) {
    activeKey.value = node.title;
  }
};

const handleCancel = () => {
  open.value = false;
  fileTree.value = [];
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
        <a-tree :tree-data="fileTree" class="compact-tree" @select="onSelect">
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

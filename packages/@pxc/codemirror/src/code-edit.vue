<script lang="ts">
import type { EditorView, ViewUpdate } from '@codemirror/view';

import type { PropType } from 'vue';

import { computed, defineComponent, ref, shallowRef, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { autocompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { vue } from '@codemirror/lang-vue';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  syntaxHighlighting,
} from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';

// 基础配置类型
export interface CodeEditorOptions {
  lineWrapping?: boolean;
  readOnly?: boolean;
  tabSize?: number;
}

// 主题类型
export type ThemeType = 'dark' | 'light' | 'none';
export type LanguageType =
  | 'css'
  | 'html'
  | 'java'
  | 'javascript'
  | 'json'
  | 'python'
  | 'typescript'
  | 'vue'
  | 'xml'
  | 'yaml';

export default defineComponent({
  // name: 'CodeEditor',
  components: { Codemirror },
  props: {
    height: {
      default: '400px',
      type: [String, Number],
    },
    language: {
      default: 'javascript',
      type: String as PropType<LanguageType>,
    },
    modelValue: {
      default: '',
      type: String,
    },
    options: {
      default: () => ({}),
      type: Object as PropType<CodeEditorOptions>,
    },
    theme: {
      default: 'dark',
      type: String as PropType<ThemeType>,
    },
  },
  emits: ['update:modelValue', 'change', 'ready'],
  setup(props, { emit }) {
    // 编辑器实例
    const view = shallowRef<EditorView>();
    const codeValue = ref(props.modelValue);

    // 动态计算容器高度
    const containerHeight = computed(() =>
      typeof props.height === 'number' ? `${props.height}px` : props.height,
    );

    // 合并默认配置和传入配置
    const mergedOptions = computed<CodeEditorOptions>(() => ({
      autofocus: true,
      indentUnit: 4,
      indentWithTabs: true,
      lineNumbers: true,
      lineWrapping: false,
      readOnly: false,
      tabSize: 4,
      ...props.options,
    }));

    // 语言支持扩展
    const languageExtensions = computed(() => {
      const lang = props.language.toLowerCase();
      switch (lang) {
        case 'css': {
          return [css()];
        }
        case 'html': {
          return [html()];
        }
        case 'java': {
          return [java()];
        }
        case 'javascript': {
          return [javascript()];
        }
        case 'json': {
          return [json()];
        }
        case 'python': {
          return [python()];
        }
        case 'typescript': {
          return [javascript()];
        }
        case 'vue': {
          return [vue()];
        }
        case 'xml': {
          return [xml()];
        }
        case 'yaml': {
          return [yaml()];
        }
        default: {
          return [javascript()];
        }
      }
    });

    // 主题扩展
    const themeExtensions = computed(() => {
      return props.theme === 'dark' ? [oneDark] : [];
    });

    // 组合所有扩展
    const activeExtensions = computed(() => [
      languageExtensions.value,
      themeExtensions.value,
      keymap.of([indentWithTab]),
      bracketMatching(),
      foldGutter(),
      autocompletion(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    ]);

    // 处理编辑器就绪事件
    const handleReady = (payload: { view: EditorView }) => {
      view.value = payload.view;
      emit('ready', payload.view);
    };

    // 处理代码变化
    const handleUpdate = (value: ViewUpdate) => {
      const newValue = value.state.doc.toString();
      if (newValue !== props.modelValue) {
        codeValue.value = newValue;
        emit('update:modelValue', newValue);
        emit('change', newValue);
      }
    };

    // 监听外部 modelValue 变化
    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== codeValue.value) {
          codeValue.value = newVal;
        }
      },
    );

    return {
      activeExtensions,
      codeValue,
      containerHeight,
      handleReady,
      handleUpdate,
      mergedOptions,
    };
  },
});
</script>

<template>
  <div class="code-editor" :style="{ height: containerHeight }">
    <Codemirror
      v-model="codeValue"
      :extensions="activeExtensions"
      :options="mergedOptions"
      @update="handleUpdate"
      @ready="handleReady"
    />
  </div>
</template>

<style scoped>
.code-editor {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.code-editor:hover {
  border-color: #a0a0a0;
}

:deep(.cm-editor) {
  height: 100%;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 14px;
}

:deep(.cm-gutters) {
  background-color: #f8f8f8;
  border-right: 1px solid #e0e0e0;
}

:deep(.cm-activeLineGutter) {
  background-color: #f0f0f0;
}
</style>

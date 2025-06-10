import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { z } from '#/adapter/form';
import { getDeptList } from '#/api/system/dept';
import { $t } from '#/locales';

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.dept.deptName'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.dept.deptName'), 2]))
        .max(
          20,
          $t('ui.formRules.maxLength', [$t('system.dept.deptName'), 20]),
        ),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getDeptList,
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
      },
      fieldName: 'pid',
      label: $t('system.dept.parentDept'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.dept.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
      },
      fieldName: 'remark',
      label: $t('system.dept.remark'),
      rules: z
        .string()
        .max(50, $t('ui.formRules.maxLength', [$t('system.dept.remark'), 50]))
        .optional(),
    },
  ];
}

export namespace SystemPlusOrgModuleNs {
  export interface SystemPlusOrg {
    [key: string]: any;
    id: string;
    parentId: string | undefined;
    areaId?: string | undefined;
    areaCode?: string | undefined;
    orgName: string | undefined;
    orgNameEn: string | undefined;
    orgNameAbbr: string | undefined;
    orgCode: string | undefined;
    sort: number | undefined;
    orgCategory: number | undefined;
    orgCategoryStr?: string | undefined;
    mobile: string | undefined;
    fax: string | undefined;
    address: string | undefined;
    state: string | undefined;
    remark: string | undefined;
  }
}

/**
 * 字段定义，获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 */
function useColumns(): VxeGridProps<SystemPlusOrgModuleNs.SystemPlusOrg>['columns'] {
  return [
    {
      title: '名称',
      field: 'orgName',
      treeNode: true,
      width: 200,
    },
    {
      title: '状态',
      field: 'state',
      slots: {
        default: 'state',
      },
      width: 100,
    },
    {
      title: '机构类别',
      field: 'orgCategoryStr',
      slots: { default: 'orgCategoryStr' },
      width: 100,
    },
    {
      title: '编码CODE',
      field: 'orgCode',
    },
    {
      title: '地址',
      field: 'address',
    },

    { title: '排序', field: 'sort' },
    {
      field: 'action',
      title: '操作',
      width: 120,
      slots: { default: 'action' },
    },
  ];
}

export const gridOptions: VxeGridProps<SystemPlusOrgModuleNs.SystemPlusOrg> = {
  columns: useColumns(),
  data: [],
  // loading: false,
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  toolbarConfig: {
    custom: true,
    zoom: true,
  },
  treeConfig: {
    // 对于同一级的节点，每次只能展开一个
    accordion: true,
    parentField: 'parentId',
    rowField: 'id',
    childrenField: 'children',
  },
};

export const formatState = (row: SystemPlusOrgModuleNs.SystemPlusOrg) => {
  return row.state === '1' ? '正常' : '禁用';
};

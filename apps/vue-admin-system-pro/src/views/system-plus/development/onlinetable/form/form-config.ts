import type { SystemPlusOnlineTableModuleNs } from '#/views/system-plus/development/onlinetable/config';

import { reactive } from 'vue';

import { Form } from 'ant-design-vue';

export const defaultModel: SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable =
  {
    databaseId: undefined,
    tableName: undefined,
    catalog: undefined,
    schema: undefined,
    tableComment: undefined,
  };

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export const rulesRef = reactive({
  tableName: [{ type: 'string', required: true, message: '请输入表名' }],
  tableComment: [{ type: 'string', required: true, message: '请输入表注释' }],
});

export const useFormApi = (
  modelRef: SystemPlusOnlineTableModuleNs.SystemPlusOnlineTable,
) => {
  return Form.useForm(modelRef, rulesRef);
};

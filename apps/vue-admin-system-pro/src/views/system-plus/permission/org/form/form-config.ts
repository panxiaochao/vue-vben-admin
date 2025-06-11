import type { SystemPlusOrgModuleNs } from '#/views/system-plus/permission/org/config';
import type { FormState } from '#/views/system-plus/permission/role/form/form';

import { reactive } from 'vue';

import { Form } from 'ant-design-vue';

export const defaultModel: SystemPlusOrgModuleNs.SystemPlusOrg = {
  id: undefined,
  parentId: undefined,
  orgName: undefined,
  orgNameEn: undefined,
  orgNameAbbr: undefined,
  orgCode: undefined,
  orgCategory: undefined,
  mobile: undefined,
  fax: undefined,
  address: undefined,
  remark: undefined,
  sort: 0,
  state: '1',
};

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const rulesRef = reactive({
  parentId: [{ type: 'string', required: true, message: '请输入上级机构' }],
  orgName: [{ type: 'string', required: true, message: '请输入机构名称' }],
  orgCode: [{ type: 'string', required: true, message: '请输入机构编码' }],
  orgCategory: [{ type: 'number', required: true, message: '请输入机构类别' }],
});

export const useFormApi = (modelRef: FormState) => {
  return Form.useForm(modelRef, rulesRef);
};

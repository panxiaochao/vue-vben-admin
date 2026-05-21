import { reactive } from 'vue';

import { Form } from 'ant-design-vue';

// 字段对象
export interface FormState {
  dataScope?: string | undefined;
  id?: string | undefined;
  remark?: string | undefined;
  roleCode?: string | undefined;
  roleName?: string | undefined;
  sort?: number;
  status?: string | undefined;
}

export const defaultModel = {
  id: undefined,
  roleName: undefined,
  roleCode: undefined,
  dataScope: '1',
  remark: undefined,
  sort: 0,
  status: '1',
};

export const rulesRef = reactive({
  roleName: [{ type: 'string', required: true, message: '请输入角色名称' }],
  roleCode: [{ type: 'string', required: true, message: '请输入角色编码' }],
});

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

export const useRoleForm = (modelRef: FormState) => {
  return Form.useForm(modelRef, rulesRef);
};

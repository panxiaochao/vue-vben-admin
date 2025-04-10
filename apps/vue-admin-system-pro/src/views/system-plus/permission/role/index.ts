// 字段对象
export interface RowType {
  id: string;
  roleName: string;
  roleCode: string;
  remark: string;
  sort: number;
  state: string;
}

// 字段定义
export const columns = [
  { field: 'roleName', title: '角色名称' },
  { field: 'roleCode', title: '角色编码' },
  { field: 'remark', title: '描述' },
  { field: 'sort', title: '排序' },
  { field: 'state', title: '状态', width: 80, slots: { default: 'state' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];

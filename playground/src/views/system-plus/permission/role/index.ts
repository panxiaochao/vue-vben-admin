// 字段对象
export interface RowType {
  id: number;
  remark: string;
  roleCode: string;
  roleName: string;
  sort: number;
  status: string;
}

// 字段定义
export const columns = [
  { field: 'roleName', title: '角色名称' },
  { field: 'roleCode', title: '角色编码' },
  { field: 'remark', title: '描述' },
  { field: 'sort', title: '排序' },
  { field: 'status', title: '状态', width: 80, slots: { default: 'status' } },
  { field: 'action', title: '操作', width: 200, slots: { default: 'action' } },
];

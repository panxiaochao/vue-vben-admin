import { notification } from 'ant-design-vue';

export function catchFailed(err) {
  notification.error({
    message: '错误',
    description: err.message || '请求出现错误，请稍后再试',
    duration: 2,
  });
}

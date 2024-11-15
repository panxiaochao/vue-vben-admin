<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useVbenVxeGrid, type VxeGridProps } from '@vben/plugins/vxe-table';

import { monitorInfo, networkInterfaces } from '#/api/system/monitor/server';

const spinning = ref(false);
const networkSpinning = ref(false);

interface DiskInfos {
  id: string;
  dirName: string;
  sysTypeName: string;
  typeName: string;
  total: number;
  free: number;
  used: number;
  usage: number;
}

const gridOptions: VxeGridProps<DiskInfos> = {
  columns: [
    { field: 'dirName', title: '盘符路径', width: 500, align: 'left' },
    { field: 'sysTypeName', title: '文件系统' },
    { field: 'typeName', title: '文件类型' },
    { field: 'total', title: '总大小', slots: { default: 'total' } },
    { field: 'free', title: '可用大小', slots: { default: 'free' } },
    { field: 'used', title: '已用大小', slots: { default: 'used' } },
    { field: 'usage', title: '已用百分比', slots: { default: 'usage' } },
  ],
  data: [],
  pagerConfig: {
    enabled: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// CPU信息
const cpuInfo = reactive<object>({});
// 内存信息
const memInfo = reactive<object>({});
// 储存文件信息
const diskInfos = reactive<object>([]);
// 磁盘总体信息
const diskInfo = reactive<object>({});
// 网络信息
const networkInfo = reactive<object>({});
// 服务器数据
const sysInfo = reactive<object>({});
// JVM信息
const jvmInfo = reactive<object>({});

const getPercentageColor = (value: number | string) => {
  const num = Number(value);
  if (num <= 30) {
    return '#49aa19';
  } else if (num > 30 && num <= 80) {
    return '#1890fe';
  } else if (num > 80) {
    return '#e60000';
  }
};

const loadData = () => {
  spinning.value = true;
  monitorInfo()
    .then((res) => {
      Object.assign(jvmInfo, res.jvm);
      Object.assign(sysInfo, res.sys);
      Object.assign(cpuInfo, res.cpu);
      Object.assign(memInfo, res.mem);
      Object.assign(diskInfo, res.diskInfo);
      Object.assign(diskInfos, res.diskInfos);
      gridApi.setGridOptions({ data: res.diskInfos });
    })
    .finally(() => {
      spinning.value = false;
    });
};

const loadNetworkInterfaces = () => {
  networkSpinning.value = true;
  networkInterfaces()
    .then((res) => {
      Object.assign(networkInfo, res);
    })
    .finally(() => {
      networkSpinning.value = false;
    });
};

onMounted(async () => {
  loadData();
  loadNetworkInterfaces();
});
</script>

<template>
  <Page>
    <div class="monitor-server">
      <a-spin :spinning="spinning">
        <a-row :gutter="[24, 8]" class="mb-6">
          <a-col :span="6">
            <a-card
              :body-style="{ height: '200px' }"
              :bordered="false"
              class="monitor-center-row-col-card"
              title="CPU监控"
            >
              <a-tooltip>
                <template #title>
                  <div>CPU系统使用率：{{ cpuInfo.sys }}</div>
                  <div>CPU用户使用率：{{ cpuInfo.user }}</div>
                  <div>CPU当前总使用率：{{ cpuInfo.usage }}%</div>
                  <div>CPU当前等待率：{{ cpuInfo.wait }}</div>
                  <div>CPU当前空闲率：{{ cpuInfo.free }}</div>
                </template>
                <a-progress
                  :percent="cpuInfo.usage"
                  :stroke-color="getPercentageColor(cpuInfo.usage)"
                  type="dashboard"
                />
              </a-tooltip>
              <div>CPU当前总使用率</div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card
              :body-style="{ height: '200px' }"
              :bordered="false"
              class="monitor-center-row-col-card"
              title="内存信息"
            >
              <a-tooltip>
                <template #title>
                  <div>内存总量：{{ memInfo.total }} MB</div>
                  <div>内存已用：{{ memInfo.used }} MB</div>
                  <div>内存剩余：{{ memInfo.free }} MB</div>
                  <div>内存使用率：{{ memInfo.usage }}%</div>
                </template>
                <a-progress
                  :percent="memInfo.usage"
                  :stroke-color="getPercentageColor(memInfo.usage)"
                  type="dashboard"
                />
              </a-tooltip>
              <div>内存使用率</div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card
              :body-style="{ height: '200px' }"
              :bordered="false"
              class="monitor-center-row-col-card"
              title="存储信息"
            >
              <a-tooltip>
                <template #title>
                  <div>存储总量：{{ diskInfo.total }} GB</div>
                  <div>存储已用：{{ diskInfo.used }} GB</div>
                  <div>存储剩余：{{ diskInfo.total - diskInfo.used }} GB</div>
                  <div>存储使用率：{{ diskInfo.usage }}%</div>
                </template>
                <a-progress
                  :percent="diskInfo.usage"
                  :stroke-color="getPercentageColor(diskInfo.usage)"
                  type="dashboard"
                />
              </a-tooltip>
              <div>存储使用率</div>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card
              :body-style="{ height: '200px' }"
              :bordered="false"
              class="monitor-center-row-col-card"
              title="网络信息"
            >
              <a-spin :spinning="networkSpinning">
                <a-statistic
                  :value="networkInfo.up"
                  :value-style="{ color: '#3f8600', marginBottom: '10px' }"
                  suffix="Kb/s"
                  title="上行速率"
                >
                  <template #prefix>
                    <a-icon type="arrow-up" />
                  </template>
                </a-statistic>
                <a-statistic
                  :value="networkInfo.download"
                  :value-style="{ color: '#cf1322' }"
                  suffix="Kb/s"
                  title="下行速率"
                >
                  <template #prefix>
                    <a-icon type="arrow-down" />
                  </template>
                </a-statistic>
              </a-spin>
            </a-card>
          </a-col>
        </a-row>
        <a-card :bordered="false" class="mb-6" title="CPU监控">
          <a-descriptions :column="2" bordered size="middle">
            <a-descriptions-item label="CPU名称">
              {{ cpuInfo.cpuName }}
            </a-descriptions-item>
            <a-descriptions-item label="供应商">
              {{ cpuInfo.vendor }}
            </a-descriptions-item>
            <a-descriptions-item label="CPU物理核心数">
              {{ cpuInfo.physicalProcessorCount }}
            </a-descriptions-item>
            <a-descriptions-item label="CPU逻辑核心数">
              {{ cpuInfo.logicalProcessorCount }}
            </a-descriptions-item>
            <a-descriptions-item label="CPU能效核心数">
              {{ cpuInfo.efficiencyCount }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-row :gutter="[24, 8]" class="mb-6">
          <a-col :span="18">
            <a-card :bordered="false" title="JVM信息">
              <a-descriptions :column="2" bordered size="middle">
                <a-descriptions-item label="JVM名称">
                  {{ jvmInfo.name }}
                </a-descriptions-item>
                <a-descriptions-item label="JVM版本">
                  {{ jvmInfo.jvmVersion }}
                </a-descriptions-item>
                <a-descriptions-item label="JVM启动时间">
                  {{ jvmInfo.startTime }}
                </a-descriptions-item>
                <a-descriptions-item label="JVM运行时长">
                  {{ jvmInfo.runTime }}
                </a-descriptions-item>
                <a-descriptions-item label="Java版本">
                  {{ jvmInfo.javaVersion }}
                </a-descriptions-item>
                <a-descriptions-item label="Java安装路径">
                  {{ jvmInfo.home }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card
              :bordered="false"
              class="monitor-center-row-col-card"
              title="JVM监控"
            >
              <a-tooltip>
                <template #title>
                  <div>JVM总分配内存：{{ jvmInfo.total }}</div>
                  <div>JVM已用内存：{{ jvmInfo.used }}</div>
                  <div>JVM剩余内存：{{ jvmInfo.free }}</div>
                  <div>JVM内存使用率：{{ jvmInfo.usage }}%</div>
                </template>
                <a-progress
                  :percent="jvmInfo.usage"
                  :stroke-color="getPercentageColor(jvmInfo.usage)"
                  type="dashboard"
                />
              </a-tooltip>
              <div>JVM内存使用率</div>
            </a-card>
          </a-col>
        </a-row>

        <a-card :bordered="false" class="mb-6" title="服务器信息">
          <a-descriptions :column="2" bordered size="middle">
            <a-descriptions-item label="服务器名称">
              {{ sysInfo.computerName }}
            </a-descriptions-item>
            <a-descriptions-item label="服务器操作系统">
              {{ sysInfo.osName }}
            </a-descriptions-item>
            <a-descriptions-item label="服务器IP">
              {{ sysInfo.computerIp }}
            </a-descriptions-item>
            <a-descriptions-item label="服务器架构">
              {{ sysInfo.osArch }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card :bordered="false" class="mb-6" title="磁盘状态">
          <Grid>
            <template #total="{ row }"> {{ row.total }} GB </template>
            <template #free="{ row }"> {{ row.free }} GB </template>
            <template #used="{ row }"> {{ row.used }} GB </template>
            <template #usage="{ row }">
              <a-tag :color="getPercentageColor(row.usage)">
                {{ row.usage }}%
              </a-tag>
            </template>
          </Grid>
        </a-card>
      </a-spin>
    </div>
  </Page>
</template>

<style scoped>
.monitor-center-row-col-card {
  text-align: center;
}
/*.vxe-cell {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}*/
</style>

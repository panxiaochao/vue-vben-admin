<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { redisCache } from '#/api/system-plus/monitor/server';

import ChartsCommandStats from './charts-command-stats.vue';

const chartsCommandStats = ref();

const spinning = ref(false);

// 缓存信息
const cache = reactive<object>({});
// 饼图数据
const pieData = ref([]);

const loadData = () => {
  spinning.value = true;
  redisCache()
    .then((res) => {
      Object.assign(cache, res);
      pieData.value = res.commandStats;
    })
    .finally(() => {
      spinning.value = false;
    });
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page>
    <a-spin :spinning="spinning">
      <a-card
        :bordered="false"
        :style="{ marginBottom: '24px' }"
        class="mb-2"
        title="Redis 缓存信息"
      >
        <a-descriptions :column="4" bordered size="middle">
          <a-descriptions-item label="Redis版本">
            <span v-if="cache.info">{{ cache.info.redis_version }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="运行模式">
            <span v-if="cache.info">{{
              cache.info.redis_mode === 'standalone' ? '单机' : '集群'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="端口">
            <span v-if="cache.info">{{ cache.info.tcp_port }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="客户端数量">
            <span v-if="cache.info">{{ cache.info.connected_clients }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="运行时间（天）">
            <span v-if="cache.info">{{ cache.info.uptime_in_days }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="使用内存">
            <span v-if="cache.info">{{ cache.info.used_memory_human }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="使用CPU">
            <span v-if="cache.info">{{
              parseFloat(cache.info.used_cpu_user_children).toFixed(2)
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="内存配置">
            <span v-if="cache.info">{{ cache.info.maxmemory_human }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="AOF是否开启">
            <span v-if="cache.info">{{
              cache.info.aof_enabled === '0' ? '否' : '是'
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="RDB是否成功">
            <span v-if="cache.info">{{
              cache.info.rdb_last_bgsave_status
            }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="Key数量">
            <span v-if="cache.dbSize">{{ cache.dbSize }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="网络入口/出口">
            <span v-if="cache.info">{{ cache.info.instantaneous_input_kbps }}kps/{{
                cache.info.instantaneous_output_kbps
              }}kps</span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-row :gutter="10" :style="{ marginBottom: '24px' }" class="mb-2">
        <a-col :span="24">
          <a-card :bordered="false" title="命令统计">
            <ChartsCommandStats
              ref="chartsCommandStats"
              :chart-data="pieData"
            />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </Page>
</template>

<style scoped></style>

<script setup lang="ts">
import { Page } from '@vben/common-ui';
</script>

<template>
  <Page auto-content-height title="外汇持仓分析">
    <template #description>
      <a-space direction="vertical">
        <a-typography-text>
          <a-badge status="default">
            <template #text><b>L0：</b></template>
          </a-badge>
          1%～5%：小仓（平时玩的仓位）
        </a-typography-text>
        <a-typography-text>
          <a-badge status="default">
            <template #text><b>L1：</b></template>
          </a-badge>
          5%～10%：低仓（可以适当的仓位）
        </a-typography-text>
        <a-typography-text type="success">
          <a-badge status="success">
            <template #text><b>L2：</b></template>
          </a-badge>
          10%～20%：中仓（偏危险，可以搏一把）
        </a-typography-text>
        <a-typography-text type="warning">
          <a-badge status="warning">
            <template #text><b>L3：</b></template>
          </a-badge>
          20%～30%：重仓（博一博，单车🚴变摩托）
        </a-typography-text>
        <a-typography-text type="danger">
          <a-badge status="error">
            <template #text><b>L4：</b></template>
          </a-badge>
          30%～50%：超级重仓（不建议）
        </a-typography-text>
      </a-space>
    </template>
    <a-card :bordered="false" class="mb-6" title="1000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          10（0.02手） ~ 50（0.1手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          50（0.1手） ~ 100（0.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          100（0.1手） ~ 200（0.4手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          200（0.4手） ~ 300（0.6手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          300（0.6手） ~ 500（1手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="2000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          20（0.04手） ~ 100（0.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          100（0.2手） ~ 200（0.4手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          200（0.4手） ~ 400（0.8手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          400（0.8手） ~ 600（1.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          600（1.2手） ~ 1000（2手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="3000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          30（0.06手） ~ 150（0.3手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          150（0.3手） ~ 300（0.6手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          300（0.6手） ~ 600（1.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          600（1.2手） ~ 900（1.8手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          900（1.8手） ~ 1500（3手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="4000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          40（0.08手） ~ 200（0.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          200（0.4手） ~ 400（0.8手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          400（0.8手） ~ 800（1.8手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          800（1.8手） ~ 1200（2.4手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          1200（2.4手） ~ 2000（4手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="5000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          50（0.1手） ~ 250（0.5手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          250（0.5手） ~ 500（1手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          500（1手） ~ 1000（2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          1000（2手） ~ 1500（1.5手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          1500（1.5手） ~ 2500（5手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="8000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          80（0.16手） ~ 400（0.8手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          400（0.8手） ~ 800（1.6手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          800（1.6手） ~ 1600（3.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          1600（3.2手） ~ 2400（4.8手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          2400（4.8手） ~ 4000（8手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="10000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          100（0.2手） ~ 500（1手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          500（1手） ~ 1000（2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          1000（2手） ~ 2000（4手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          2000（4手） ~ 3000（6手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          3000（6手） ~ 5000（10手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="12000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          120（0.12手） ~ 600（0.6手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          600（0.6手） ~ 1200（1.2手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          1200（1.2手） ~ 2400（2.4手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          2400（2.4手） ~ 3600（3.6手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          3600（3.6手） ~ 6000（6手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" class="mb-6" title="15000本金">
      <a-descriptions
        :label-style="{ 'font-weight': 'bold' }"
        bordered
        layout="vertical"
      >
        <a-descriptions-item :span="3" label="L0：1%～5%：小仓">
          150（0.15手） ~ 750（0.75手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L1：5%～10%：低仓">
          750（0.75手） ~ 1500（1.5手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L2：10%～20%：中仓">
          1500（1.5手） ~ 3000（3手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L3：20%～30%：重仓">
          3000（3手） ~ 4500（4.5手）
        </a-descriptions-item>
        <a-descriptions-item :span="3" label="L4：30%～50%：超级重仓">
          4500（4.5手） ~ 7500（7.5手）
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </Page>
</template>

<style scoped></style>

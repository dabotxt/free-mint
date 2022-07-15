<script setup lang="ts">
</script>

<template>
  <el-config-provider :message="{ max: 1 }">
    <div>123</div>
    <router-view></router-view>
  </el-config-provider>
</template>

<style></style>

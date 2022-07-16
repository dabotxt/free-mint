<script setup lang="ts">
</script>

<template>
  <el-config-provider :message="{ max: 1 }">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
body {
  background: #333333;
  color: #FFFFFF;
  font-family: Aldrich!important;
}
</style>

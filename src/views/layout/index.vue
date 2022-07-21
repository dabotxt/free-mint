<script setup lang="ts">
import { useNamespace } from 'src/hooks/useCommon'
import { useLoading } from 'src/hooks/useLoading'
import Header from './Header.vue'
const prefixCls = useNamespace('layout')
const { getLoading } = useLoading()
</script>

<template>
  <div :class="prefixCls.multiPrefixCls" v-loading="getLoading().value">
    <Header></Header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
$moduleName: 'layout';
$prefix-cls: '#{$namespace}-#{$moduleName}';
$mobile-prefix-cls: '#{$namespace}-m-#{$moduleName}';
.#{$prefix-cls} {
  height: 100vh;
  //background: rgba(20, 18, 24, 1) url("src/assets/img/home/header-round.gif") no-repeat center;
  //background-position-y: 0;
  background-image: url("src/assets/img/home/test.gif");
  background-position: center;
  background-size: cover;
  ::v-deep(.el-loading-mask) {
    display: none;
  }
}
@media screen and (max-width: 750px) {
  .#{$prefix-cls} {
    //background-size: 277.5px 240px;
    //background-position-y: 120px;
  }
}
</style>

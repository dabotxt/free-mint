<script setup lang="ts">
import { useNamespace } from 'src/hooks/useCommon'
const prefixCls = useNamespace('header')
</script>

<template>
  <div :class="prefixCls.multiPrefixCls">
    <img class="logo" src="src/assets/img/home/pc-logo.webp" alt="">
    <img class="mobile-logo" src="src/assets/img/home/mobile-logo.webp" alt="">
    <div class="right">
      <img src="src/assets/img/home/social1.webp" alt="">
      <img src="src/assets/img/home/social2.webp" alt="">
      <img src="src/assets/img/home/social3.webp" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
$moduleName: 'header';
$prefix-cls: '#{$namespace}-#{$moduleName}';
$mobile-prefix-cls: '#{$namespace}-m-#{$moduleName}';
.#{$prefix-cls} {
  padding: 60px 54px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .mobile-logo {
    display: none;
  }
  .right {
    display: flex;
    img {
      width: 38px;
      height: 38px;
      cursor: pointer;
      &:nth-of-type(2) {
        margin: 0 70px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .#{$prefix-cls} {
    justify-content: center;
    .mobile-logo {
      display: block;
      width: 186px;
      height: 54px;
    }
    .logo {
      display: none;
    }
    .right {
      width: 100%;
      position: fixed;
      bottom: 50px;
      display: flex;
      justify-content: center;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>

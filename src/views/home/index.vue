<script setup lang="ts">
import { useNamespace } from 'src/hooks/useCommon'
import { useWallet } from 'hooks/web3/useWallet'
import { useTools } from 'hooks/useTools'
import { useUserStore } from 'src/store/modules/user'
import { computed, onMounted } from 'vue'
const User = useUserStore()
const { onConnect } = useWallet()
const { hideSensitive } = useTools()
const prefixCls = useNamespace('home')
const connect = async () => {
  if (!account.value) {
    await onConnect()
  } else {
    alert('mint')
  }
}
const account = computed(() => {
  return User.walletAddress
})
onMounted(() => {
  const account = sessionStorage.getItem('walletAddress')
  if (account) {
    User.setWalletAddress(account)
  }
})
</script>

<template>
  <div :class="prefixCls.multiPrefixCls">
    <div class="context">
      <div class="title">Free mint remains</div>
      <div class="count">12,000</div>
      <div class="button" @click="connect">{{ !account ? 'Connect Wallet' : 'Free Mint' }}</div>
      <div class="account" v-if="account">Wallet：{{ hideSensitive(account, 4, 4) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$moduleName: 'home';
$prefix-cls: '#{$namespace}-#{$moduleName}';
$mobile-prefix-cls: '#{$namespace}-m-#{$moduleName}';
.#{$prefix-cls} {
  .context {
    width: 100%;
    position: absolute;
    bottom: 160px;
    text-align: center;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .count {
      font-size: 40px;
      margin: 30px 0;
      font-weight: bold;
    }
    .button {
      width: 300px;
      height: 70px;
      background: #FCD535;
      box-shadow: 0px 14px 27px 0px rgba(0,0,0,0.3800);
      border-radius: 10px;
      color: #131617;
      font-size: 24px;
      line-height: 70px;
      margin: 0 auto;
      font-weight: bold;
      cursor: pointer;
    }
    .account {
      font-size: 24px;
      margin-top: 20px;
    }
  }
}
</style>

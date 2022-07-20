<script setup lang="ts">
import { useNamespace } from 'src/hooks/useCommon'
import { useWallet } from 'hooks/web3/useWallet'
import { useTools } from 'hooks/useTools'
import { useUserStore } from 'src/store/modules/user'
import { useLoading } from 'src/hooks/useLoading'
import { useMint } from 'hooks/web3/useMint'
import { whiteToLowerCase } from 'hooks/web3/whitelist'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, toRefs } from 'vue'
const { setLoading } = useLoading()
const User = useUserStore()
const { onConnect } = useWallet()
const { getNumberMinted, Mint } = useMint()
const { hideSensitive } = useTools()
const prefixCls = useNamespace('home')
const connect = async () => {
  if (!account.value) {
    await onConnect()
  } else {
    const address = account.value?.toLowerCase()
    if (whiteToLowerCase.value.includes(address)) {
      await setLoading(true)
      const val = await getNumberMinted()
      const count = parseInt(val) + state.countState + 1
      if (count < 4) {
        await Mint(state.countState + 1)
          .then(async (res: any) => {
            console.log(res)
            ElMessage({
              message: 'Mint successfully!',
              type: 'success'
            })
            await setLoading(false)
          })
          .catch(async (error: any) => {
            ElMessage({
              message: error.message,
              type: 'error'
            })
            await setLoading(false)
          })
      } else {
        ElMessage({
          message: 'You can only mint up to 3 NFTs, do not be greedy.',
          type: 'warning'
        })
      }
      await setLoading(false)
    } else {
      ElMessage({
        message: 'Sorry! you are not on the Whitelist, please contact Dune team to acquire.',
        type: 'warning'
      })
    }
  }
}
const state = reactive({
  countList: [
    {
      name: '1 NFT'
    },
    {
      name: '2 NFTs'
    },
    {
      name: '3 NFTs'
    }
  ],
  countState: 0
})
const account = computed(() => {
  return User.walletAddress
})
onMounted(() => {
  const account = sessionStorage.getItem('walletAddress')
  if (account) {
    User.setWalletAddress(account)
  }
})
const { countList, countState } = toRefs(state)
</script>

<template>
  <div :class="prefixCls.multiPrefixCls">
    <div class="context">
      <div class="title">Free mint remains</div>
      <div class="count">12,000</div>
      <div class="count-content" v-if="account">
        <div class="count-item" :class="countState === index ? 'active' : ''" @click="countState = index" v-for="(item, index) in countList" :key="index">{{ item.name }}</div>
      </div>
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
    .count-content {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .count-item {
        width: 80px;
        height: 40px;
        border: 2px solid #B9B6AC;
        border-radius: 6px;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        cursor: pointer;
        &:nth-of-type(2) {
          margin: 0 52px;
        }
      }
      .active {
        color: #FCD535;
        border: 2px solid #FCD535;
      }
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

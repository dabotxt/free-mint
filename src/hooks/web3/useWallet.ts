import Web3Modal, { providers } from 'web3modal'
import { providerOptions } from './config'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useUserStore } from 'src/store/modules/user'
import { ElMessage } from 'element-plus'
import Web3 from 'web3/dist/web3.min.js'
import { reactive, ref, toRefs } from 'vue'

interface WalletInfo {
  web3: typeof Web3 | null
  provider: typeof providers | null
  account: string | null
}
let web3instance: typeof Web3 | null = null
const User = useUserStore()
const web3Modal = ref<typeof Web3Modal>(null)
const walletInfo: WalletInfo = reactive({
  web3: null,
  provider: null,
  account: null
})
export function useWallet() {
  if (!web3Modal.value) {
    initWeb3Modal()
    onEvents()
  }
  function initWeb3Modal () {
    web3Modal.value = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions
    })
    web3instance = new Web3(Web3.givenProvider || 'ws://localhost:8545')
    web3instance.eth.net.getId((error: Error, id: number) => {
      console.log(error)
      if (id !== 4) {
        switchChain('0x4')
      }
    })
  }
  async function onEvents () {
    await window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      const user = useUserStore()
      if (accounts.length > 0) {
        user.setWalletAddress(accounts[0])
        sessionStorage.setItem('walletAddress', accounts[0])
      } else {
        sessionStorage.removeItem('walletAddress')
      }
    });
    window.ethereum.on('message',  () => {
    });
  }
  const switchChain = ((chainId: string) => {
    console.log(chainId)
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    })
      .then(() => {
        ElMessage({
          message: 'success',
          type: 'success'
        })
        console.log('success')
        // location.reload()
      })
      .catch((error: ErrorInfo) => {
        console.log(666)
        console.log(error)
        if (error.code === 4902) {
          // addChain()
        }
      })
  })
  const getAccounts = async () => {
    const [account] = await walletInfo.web3.eth.getAccounts()
    walletInfo.account = account
    User.setWalletAddress(account)
    sessionStorage.setItem('walletAddress', account)
  }

  const subscribeToEvents = (provider: WalletConnectProvider) => {
    if (!provider) return

    provider.on('connect', () => {})
    provider.on('accountsChanged', () => {
      getAccounts()
    })
    provider.on('chainChanged', () => {})
    provider.on('disconnect', () => {})
  }

  const onConnect = async () => {
    const provider = await web3Modal.value.connect()
    subscribeToEvents(provider)
    const web3 = new Web3(provider)
    walletInfo.provider = provider
    walletInfo.web3 = web3
    getAccounts()
  }
  const closeApp = async () => {
    await walletInfo.web3.currentProvider.close()
  }
  const resetWallet = async () => {
    await walletInfo.web3?.currentProvider?.close?.()
    web3Modal.value.clearCachedProvider()
    walletInfo.provider = null
    walletInfo.web3 = null
    walletInfo.account = null
  }

  const checkConnect = async () => {
    !walletInfo.web3 && await onConnect()
  }
  return {
    ...toRefs(walletInfo),
    onConnect,
    resetWallet,
    checkConnect,
    closeApp,
    switchChain
  }
}

import type { UserInfo } from 'types/store'
import { defineStore } from 'pinia'
import { store } from 'src/store'
import { User } from 'src/api'
import { HeroInfo } from 'types/store'
interface UserState {
  userInfo: UserInfo | null,
  heroList: HeroInfo[] | null,
  walletAddress: string | null
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    heroList: [],
    walletAddress: null
  }),
  getters: {
    getUserInfo(): UserInfo | null {
      return this.userInfo
    }
  },
  actions: {
    setHeroList(list: HeroInfo[] | null) {
      this.heroList = list
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
    },
    setWalletAddress(walletAddress: any | null) {
      this.walletAddress = walletAddress
    },
    resetState() {
      this.userInfo = null
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      const userInfo: any = await User.getUserInfo()
      this.setUserInfo(userInfo)
      return userInfo
    }
  }
})

export function useUserStoreWithOut() {
  return useUserStore(store)
}

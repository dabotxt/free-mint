import { useWallet } from "src/hooks/web3/useWallet";
import { contractAbiMap, ContractAbiTypeEnum } from "src/enums/contractAbiEnum";
import { PoolEnum } from 'src/enums/assetsEnum'
import { utils } from 'web3/dist/web3.min.js'
import { computed } from "vue";
import { useNFT } from 'hooks/web3/useNFT'
import { errorHandel, getNFTCardList } from "hooks/web3/utils";
import { ResourceInfo } from 'types/store'
const { getInfo } = useNFT()
const { web3, checkConnect } = useWallet()
const abi = JSON.parse(contractAbiMap.get(ContractAbiTypeEnum.BATTLE) as string)
const contract = import.meta.env.VITE_BATTLE_CONTRACT_ADDRESS as string

export function useBattle () {
  const instance = computed( () => {
    const { Contract } = web3.value.eth
    return  new Contract(abi, contract)
  })
  // 1v1
  const refresh1V1 = async () => {
    // console.log(web3.value.eth.abi.decodeParameters(['uint', 'uint', 'uint', 'bool', 'bool', 'uint[]'], "0x0000000000000000000000000000000000000000000000000000000000000007000000000000000000000000000000000000000000000000000000000000012400000000000000000000000000000000000000000000000000000000628497ce0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000005800000000000000000000000000000000000000000000000000000000000000408000000000000000000000000000000000000000000000000000000000000058000000000000000000000000000000000000000000000000000000000000004080000000000000000000000000000000000000000000000000000000000000580000000000000000000000000000000000000000000000000000000000000040800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"))
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      instance.value.methods
        .refresh1V1()
        .send({ from: account })
        .then((res: any) => {
          console.log(res)
          resolve(res)
        })
        .catch((error: Error) => {
          errorHandel(error, (errorInfo: ErrorInfo) => {
            reject(errorInfo)
          })
        })
    })
  }
  const battle1V1 = async (tokenId: string, enemyTokenId: string) => {
    // console.log(web3.value.eth.abi.decodeParameter('bool', '0x0000000000000000000000000000000000000000000000000000000000000001'))
    const [account] = await web3.value.eth.getAccounts()
    const gas = await instance.value.methods.battle1V1(tokenId, enemyTokenId).estimateGas({ from: account },
      (error: Error, amount: number) => {
        console.log(error, amount)
      }).then((res: any) => {
      return res
    })
    return new Promise((resolve, reject) => {
      console.log(tokenId, enemyTokenId)
      instance.value.methods
        .battle1V1(tokenId, enemyTokenId)
        .send({ from: account, gas: gas * 2 })
        .then((res: any) => {
          console.log(res)
          const result: object[] = []
          const resultLength = Object.keys(res)
          if (resultLength.length > 2) { // 有捕获事件
            for (let i = 0; i < resultLength.length; i++) {
              let value = null
              value = web3.value.eth.abi.decodeParameter('bool', res.events[i].raw.data)
              console.log(value)
              result.push(value)
            }
          } else { // 没有捕获事件
            for (let i = 0; i < resultLength.length; i++) {
              let value = null
              value = web3.value.eth.abi.decodeParameter('bool', res.events[i].raw.data)
              console.log(value)
              result.push(value)
            }
          }
          resolve(result)
          console.log(result)
        })
        .catch((error: Error) => {
          errorHandel(error, (errorInfo: ErrorInfo) => {
            reject(errorInfo)
          })
        })
    })
  }
  const takeReward = async (tokenId: string, enemyTokenId: string) => {
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      instance.value.methods
        .takeReward(tokenId, enemyTokenId)
        .send({ from: account })
        .then((res: any) => {
          resolve(res)
        })
        .catch((error: Error) => {
          errorHandel(error, (errorInfo: ErrorInfo) => {
            reject(errorInfo)
          })
        })
    })
  }
  const getRewardInfo = async () => {
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      instance.value.methods
        .pendingReward(account)
        .call()
        .then((res: any) => {
          const result: any = {}
          res.forEach((item: string, index: number) => {
            result[PoolEnum[index].toLowerCase()] = item
          })
          resolve(result)
        })
        .catch((error: Error) => {
          errorHandel(error, (errorInfo: ErrorInfo) => {
            reject(errorInfo)
          })
        })
    })
  }
  const get1V1Enemies = async () => {
    await checkConnect()
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      instance.value.methods
        .get1V1Enemies(account)
        .call()
        .then(async (res: any) => {
          console.log(res)
          const promiseArray = res.enemies.map((tokenId: string) => getInfo(tokenId))
          const result = await Promise.allSettled(promiseArray)
          resolve(result.filter((item: any) => item.status === 'fulfilled').map((item: any) => item.value))
        })
        .catch((error: Error) => {
          errorHandel(error, (errorInfo: ErrorInfo) => {
            reject(errorInfo)
          })
        })
    })
  }
  const get1V1ForFree = async () => {
    await checkConnect()
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      instance.value.methods
        .refresh1v1ForFree(account)
        .call()
        .then((res: boolean) => {
          resolve(res)
        })
        .catch((error: Error) => {
          errorHandel(error, (errorInfo: ErrorInfo) => {
            reject(errorInfo)
          })
        })
    })
  }
  return {
    refresh1V1,
    battle1V1,
    takeReward,
    getRewardInfo,
    get1V1Enemies,
    get1V1ForFree
  }
}

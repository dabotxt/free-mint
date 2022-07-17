import { useWallet } from 'hooks/web3/useWallet'
import { computed } from 'vue'
import { errorHandel } from 'hooks/web3/utils'
import { contractAbiMap, ContractAbiTypeEnum } from 'src/enums/contractAbiEnum'

const { web3, checkConnect } = useWallet()
const abi = JSON.parse(contractAbiMap.get(ContractAbiTypeEnum.MINT) as string)
const contract = import.meta.env.VITE_MINT_CONTRACT_ADDRESS as string

export function useMint () {
  const MintInstance = computed(() => {
    const { Contract } = web3.value.eth
    return new Contract(abi, contract)
  })
  const getNumberMinted = async (): Promise<any> => {
    await checkConnect()
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      MintInstance.value.methods
        .numberMinted(account)
        .call()
        .then(async (res: any) => {
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
  const Mint = async (amt: number): Promise<any> => {
    const [account] = await web3.value.eth.getAccounts()
    return new Promise((resolve, reject) => {
      MintInstance.value.methods
        .mint(amt)
        .send({ from: account })
        .then(async (res: any) => {
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
    getNumberMinted,
    Mint
  }
}

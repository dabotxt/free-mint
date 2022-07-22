import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Mikko's test key - don't copy as your mileage may vary
      // rpc: {
      //   56: 'https://bsc-dataseed1.binance.org/',
      //   97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
      // },
      infuraId: '774b1e4252de48c3997d66ac5f5078d8'
    }
  }
}

export { providerOptions }

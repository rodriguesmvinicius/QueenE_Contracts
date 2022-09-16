import { HardhatUserConfig, task } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@nomicfoundation/hardhat-toolbox"
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "solidity-coverage"
import "@openzeppelin/hardhat-upgrades"
import "hardhat-contract-sizer"
import * as dotenv from "dotenv"
import "@nomiclabs/hardhat-web3"
dotenv.config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const DEPLOYER_WALLET = process.env.PRIVATE_KEY
const DEPLOYER_WALLET_MAINNET = process.env.PRIVATE_KEY_MAINNET
const ARTIST_WALLET = process.env.ARTIST_SIM_KEY
const DEVELOPER_WALLET = process.env.DEVELOPER_SIM_KEY
const MALICIOUS_WALLET = process.env.MALICIOUS_SIM_KEY

const PROVIDER_PROJECT_ID = process.env.WEB3_INFURA_PROJECT_ID
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        count: 370,
      },
      chainId: 31337,
      mining: {
        auto: true,
        interval: [50, 100, 500, 75, 30],
      },
      verify: false,
      nome: "development",
      blockConfirmations: 0,
      deploy_parameters: {
        bidTimeTolerance: 60, //seconds (1 minute)
        auctionDuration: 300, //seconds (5 minutes)
        initialBid: 0.01 * 10 ** 18, //wei
        percIncrement: 5, //percentage
        executorMinDelay: 272, //1 hour
        executorProposers: [],
        executors: [],
        quorumPercentage: 25, //25%
        votingPeriod: 272, //1 hour
        votingDelay: 272, //1 hour
        vetoUntil: 50,
      },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${PROVIDER_PROJECT_ID}`,
      accounts: [
        DEPLOYER_WALLET_MAINNET,
        ARTIST_WALLET,
        MALICIOUS_WALLET,
        DEVELOPER_WALLET,
      ],
      chainId: 1,
      verify: true,
      nome: "mainnet",
      blockConfirmations: 6,
      deploy_parameters: {
        bidTimeTolerance: 300, //seconds (5 minutes)
        auctionDuration: 43200, //seconds (12 hours)
        initialBid: 0.01 * 10 ** 18, //wei
        percIncrement: 5, //percentage
        executorMinDelay: 86400, //seconds (1 day)
        executorProposers: [],
        executors: [],
        quorumPercentage: 10, //%
        votingPeriod: 45818, //1 week
        votingDelay: 6545, //1 day
        vetoUntil: 180,
      },
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${PROVIDER_PROJECT_ID}`,
      accounts: [
        DEPLOYER_WALLET,
        ARTIST_WALLET,
        MALICIOUS_WALLET,
        DEVELOPER_WALLET,
      ],
      chainId: 4,
      verify: true,
      nome: "rinkeby",
      blockConfirmations: 6,
      deploy_parameters: {
        bidTimeTolerance: 300, //seconds (5 minutes)
        auctionDuration: 900, //seconds (15 hours)
        initialBid: 0.01 * 10 ** 18, //wei
        percIncrement: 5, //percentage
        executorMinDelay: 450, //seconds (15 minutes)
        executorProposers: [],
        executors: [],
        quorumPercentage: 1, //%
        votingPeriod: 45, //blocks (10 minutes)
        votingDelay: 45, //blocks (10 minutes)
        vetoUntil: 180,
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${PROVIDER_PROJECT_ID}`,
      accounts: [
        DEPLOYER_WALLET,
        ARTIST_WALLET,
        MALICIOUS_WALLET,
        DEVELOPER_WALLET,
      ],
      chainId: 3,
      verify: false,
      nome: "ropsten",
      blockConfirmations: 6,
      deploy_parameters: {
        bidTimeTolerance: 300, //seconds (5 minutes)
        auctionDuration: 43200, //seconds (12 hours)
        initialBid: 0.02 * 10 ** 18, //wei
        percIncrement: 5, //percentage
        executorMinDelay: 272, //1 hour
        executorProposers: [],
        executors: [],
        quorumPercentage: 25, //25%
        votingPeriod: 272, //1 hour
        votingDelay: 272, //1 hour
        vetoUntil: 180,
      },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${PROVIDER_PROJECT_ID}`,
      accounts: [
        DEPLOYER_WALLET,
        ARTIST_WALLET,
        MALICIOUS_WALLET,
        DEVELOPER_WALLET,
      ],
      chainId: 42,
      verify: true,
      nome: "kovan",
      blockConfirmations: 6,
      deploy_parameters: {
        bidTimeTolerance: 300, //seconds (5 minutes)
        auctionDuration: 1800, //seconds (30 minutes)
        initialBid: 0.01 * 10 ** 18, //wei
        percIncrement: 5, //percentage
        executorMinDelay: 272, //1 hour
        executorProposers: [],
        executors: [],
        quorumPercentage: 25, //25%
        votingPeriod: 272, //1 hour
        votingDelay: 272, //1 hour
        vetoUntil: 180,
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${PROVIDER_PROJECT_ID}`,
      accounts: [
        DEPLOYER_WALLET,
        ARTIST_WALLET,
        MALICIOUS_WALLET,
        DEVELOPER_WALLET,
      ],
      chainId: 5,
      verify: true,
      nome: "goerli",
      blockConfirmations: 6,
      deploy_parameters: {
        bidTimeTolerance: 300, //seconds (5 minutes)
        auctionDuration: 21600, //seconds (6 hours)
        initialBid: 0.02 * 10 ** 18, //wei
        percIncrement: 5, //percentage
        executorMinDelay: 272, //1 hour
        executorProposers: [],
        executors: [],
        quorumPercentage: 25, //25%
        votingPeriod: 272, //1 hour
        votingDelay: 272, //1 hour
        vetoUntil: 180,
      },
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  contractSizer: {
    runOnCompile: false,
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    token: "ETH",
    //outputFile: "gas-report.txt",
    //noColors: true,
    coinmarketcap: "caa81529-32af-40d1-8fff-887f4fe1865d",
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    artist: {
      default: 1,
    },
    developer: {
      default: 3,
    },
    malicious: {
      default: 2,
    },
  },
  mocha: {
    timeout: 100000000,
  },
  abiExporter: {
    path: "./artifacts/abis",
    runOnCompile: false,
    clear: true,
    flat: true,
    spacing: 2,
    pretty: false,
  },
}

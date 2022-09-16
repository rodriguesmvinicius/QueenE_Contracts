import { HardhatNetworkUserConfig } from "hardhat/types"

export interface CustomNetworkConfig extends HardhatNetworkUserConfig {
  verifyContract: boolean
  nome: string
  deploy_parameters: DeployParameters
  blockConfirmations?: number
}

interface DeployParameters {
  bidTimeTolerance: number
  auctionDuration: number
  initialBid: string
  percIncrement: number
  executorMinDelay: number
  executorProposers: any[]
  executors: any[]
  quorumPercentage: number
  votingPeriod: number
  votingDelay: number
  vetoUntil: number
}

import { verifyContract, isLocalNetwork, verifyContractFile } from "../utils"
import { ethers, network, deployments } from "hardhat"
import {
  QueenPalace,
  RoyalExecutor,
  RoyalExecutor__factory,
} from "../../typechain-types"

export async function verifyRoyalExecutor() {
  const { get } = deployments
  const latestDeploy = await get("RoyalExecutor")

  const networkConfig: any = network.config
  const executorMinDelay = networkConfig.deploy_parameters.executorMinDelay
  const executorProposers = networkConfig.deploy_parameters.executorProposers
  const executors = networkConfig.deploy_parameters.executors

  //send verification request
  console.log("Sending verification request...")
  return await verifyContractFile(
    latestDeploy.address,
    "contracts/governance/RoyalExecutor.sol:RoyalExecutor",
    [executorMinDelay, executorProposers, executors]
  )
}

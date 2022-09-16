import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
  verifyContract,
  isLocalNetwork,
  getAddress,
  getAccount,
  getProxyRegistry,
  burnAddress,
  commonDescriptions,
  rareDescriptions,
  superRareDescriptions,
} from "../scripts/utils"
import { CustomNetworkConfig } from "../types/CustomNetworkConfig"
import {
  QueenPalace,
  RoyalTower,
  QueenLab,
  QueenPalace__factory,
  RoyalTower__factory,
  QueenLab__factory,
  QueenE__factory,
  QueenE,
  QueenTraits__factory,
  QueenTraits,
  RoyalExecutor,
  RoyalGovernor,
  RoyalExecutor__factory,
  RoyalGovernor__factory,
} from "../typechain-types/index"
const deployRoyalDAO: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre
  const { log, save, get } = deployments
  const { artist, developer } = await getNamedAccounts()

  console.log("Starting storage deploy...")

  const deployer = await getAccount("owner")
  const networkConfig: any = network.config
  const executorMinDelay = networkConfig.deploy_parameters.executorMinDelay
  const executorProposers = networkConfig.deploy_parameters.executorProposers
  const executors = networkConfig.deploy_parameters.executors

  const quorumPercentage = networkConfig.deploy_parameters.quorumPercentage
  const votingPeriod = networkConfig.deploy_parameters.votingPeriod
  const votingDelay = networkConfig.deploy_parameters.votingDelay
  const vetoUntil = networkConfig.deploy_parameters.vetoUntil
  const vetoerAddr = await getAddress("vetoer")

  const chainId: number = network.config.chainId!
  const config: CustomNetworkConfig =
    network.config as unknown as CustomNetworkConfig

  const ROYAL_MUSEUM = process.env.SAFE_WALLET

  let royalExecutor: RoyalExecutor
  let royalGovernor: RoyalGovernor

  const queenPalace = await get("QueenPalace")
  const governanceToken = await get("QueenE")
  log("----------------------------------------------------")
  log("Deploying RoyalExecutor and waiting for confirmations...")
  try {
    const contractFactory: RoyalExecutor__factory =
      await ethers.getContractFactory("RoyalExecutor")

    royalExecutor = await contractFactory.deploy(
      executorMinDelay,
      executorProposers,
      executors
    )

    await royalExecutor.deployed()

    log(`RoyalExecutor deployed at ${royalExecutor!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(royalExecutor!.address, [
        executorMinDelay,
        executorProposers,
        executors,
      ])
    }
    const royalExecutorArtifact = await deployments.getArtifact("RoyalExecutor")

    await save("RoyalExecutor", {
      address: royalExecutor!.address,
      ...royalExecutorArtifact,
    })
  } catch (err: any) {
    console.error(`Error deploying QueenTraits! Error: ${err.message}`)
    return
  }

  log("----------------------------------------------------")
  log("Deploying RoyalGovernor and waiting for confirmations...")
  try {
    const royalGovernorFactory: RoyalGovernor__factory =
      await ethers.getContractFactory("RoyalGovernor")

    royalGovernor = await royalGovernorFactory.deploy(
      governanceToken.address,
      royalExecutor.address,
      queenPalace.address,
      vetoerAddr,
      vetoUntil,
      quorumPercentage,
      votingPeriod,
      votingDelay
    )

    await royalGovernor.deployed()

    log(`RoyalGovernor deployed at ${royalGovernor!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(royalGovernor!.address, [
        governanceToken.address,
        royalExecutor.address,
        queenPalace.address,
        vetoerAddr,
        vetoUntil,
        quorumPercentage,
        votingPeriod,
        votingDelay,
      ])
    }
    const royalGovernorArtifact = await deployments.getArtifact("RoyalGovernor")

    await save("RoyalGovernor", {
      address: royalGovernor!.address,
      ...royalGovernorArtifact,
    })
  } catch (err: any) {
    console.error(`Error deploying RoyalGovernor! Error: ${err.message}`)
    return
  }

  const queenPalaceFactory: QueenPalace__factory =
    await ethers.getContractFactory("QueenPalace")

  const queenPalaceContract = await queenPalaceFactory.attach(
    queenPalace.address
  )

  const setRoyalExecutorTx = await queenPalaceContract.setDAOExecutor(
    royalExecutor!.address
  )
  await setRoyalExecutorTx.wait(1)

  const setRoyalGovernorTx = await queenPalaceContract.setDAO(
    royalExecutor!.address
  )
  await setRoyalGovernorTx.wait(1)
}
export default deployRoyalDAO
deployRoyalDAO.tags = ["all", "RoyalDAO"]

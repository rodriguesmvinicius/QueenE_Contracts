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
  encode_function_data,
  getWETHAddress,
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
  QueenAuctionHouse,
  QueenAuctionHouseProxyAdmin,
  QueenAuctionHouseProxy,
  QueenAuctionHouse__factory,
  QueenAuctionHouseProxyAdmin__factory,
  QueenAuctionHouseProxy__factory,
} from "../typechain-types/index"
const deployRoyalAuctionHouse: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre
  const { log, save, get } = deployments
  const { artist, developer } = await getNamedAccounts()

  console.log("Starting Auction House deploy...")

  const chainId: number = network.config.chainId!
  const config: CustomNetworkConfig =
    network.config as unknown as CustomNetworkConfig

  const ROYAL_MUSEUM = process.env.SAFE_WALLET

  let queenAuctionHouse: QueenAuctionHouse
  let queenAuctionHouseProxyAdmin: QueenAuctionHouseProxyAdmin
  let queenAuctionHouseProxy: QueenAuctionHouseProxy
  const queenPalace = await get("QueenPalace")

  const queenAuctionHouseFactory: QueenAuctionHouse__factory =
    await ethers.getContractFactory("QueenAuctionHouse")

  log("----------------------------------------------------")
  log("Deploying QueenAuctionHouse and waiting for confirmations...")
  try {
    queenAuctionHouse = await queenAuctionHouseFactory.deploy()

    await queenAuctionHouse.deployed()

    log(`QueenAuctionHouse deployed at ${queenAuctionHouse!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenAuctionHouse!.address, [])
    }
    const queenAuctionHouseArtifact = await deployments.getArtifact(
      "QueenAuctionHouse"
    )

    await save("QueenAuctionHouse", {
      address: queenAuctionHouse!.address,
      ...queenAuctionHouseArtifact,
    })
  } catch (err: any) {
    console.error(`Error deploying QueenTraits! Error: ${err.message}`)
    return
  }

  log("----------------------------------------------------")
  log("Deploying QueenAuctionHouseProxyAdmin and waiting for confirmations...")
  try {
    const queenAuctionHouseProxyAdminFactory: QueenAuctionHouseProxyAdmin__factory =
      await ethers.getContractFactory("QueenAuctionHouseProxyAdmin")

    queenAuctionHouseProxyAdmin =
      await queenAuctionHouseProxyAdminFactory.deploy(queenPalace.address)

    await queenAuctionHouseProxyAdmin.deployed()

    log(
      `QueenAuctionHouseProxyAdmin deployed at ${
        queenAuctionHouseProxyAdmin!.address
      }`
    )
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenAuctionHouseProxyAdmin!.address, [
        queenPalace.address,
      ])
    }
    const queenAuctionHouseProxyAdminArtifact = await deployments.getArtifact(
      "QueenAuctionHouseProxyAdmin"
    )

    await save("QueenAuctionHouseProxyAdmin", {
      address: queenAuctionHouseProxyAdmin!.address,
      ...queenAuctionHouseProxyAdminArtifact,
    })
  } catch (err: any) {
    console.error(
      `Error deploying QueenAuctionHouseProxyAdmin! Error: ${err.message}`
    )
    return
  }

  log("----------------------------------------------------")
  log("Deploying QueenAuctionHouseProxy and waiting for confirmations...")
  try {
    const queenAuctionHouseProxyFactory: QueenAuctionHouseProxy__factory =
      await ethers.getContractFactory("QueenAuctionHouseProxy")

    queenAuctionHouseProxy = await queenAuctionHouseProxyFactory.deploy(
      queenAuctionHouse.address,
      queenAuctionHouseProxyAdmin.address,
      encode_function_data()
    )

    await queenAuctionHouseProxy.deployed()

    log(`QueenAuctionHouseProxy deployed at ${queenAuctionHouseProxy!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenAuctionHouseProxy!.address, [
        queenAuctionHouse.address,
        queenAuctionHouseProxyAdmin.address,
        encode_function_data(),
      ])
    }
    const queenAuctionHouseProxyArtifact = await deployments.getArtifact(
      "QueenAuctionHouseProxy"
    )

    await save("QueenAuctionHouseProxy", {
      address: queenAuctionHouseProxy!.address,
      ...queenAuctionHouseProxyArtifact,
    })
  } catch (err: any) {
    console.error(
      `Error deploying QueenAuctionHouseProxy! Error: ${err.message}`
    )
    return
  }

  const queenPalaceFactory: QueenPalace__factory =
    await ethers.getContractFactory("QueenPalace")

  const queenPalaceContract = await queenPalaceFactory.attach(
    queenPalace.address
  )

  const setQueenAuctionHouseProxyTx =
    await queenPalaceContract.setQueenAuctionHouseProxy(
      queenAuctionHouseProxy.address,
      queenAuctionHouseProxyAdmin.address
    )
  await setQueenAuctionHouseProxyTx.wait(1)

  //initialize auction house
  const queeneAuctionHouseContract = await queenAuctionHouseFactory.attach(
    queenAuctionHouseProxy.address
  )

  const networkConfig: any = network.config
  console.log(`Initial Bid: ${networkConfig.deploy_parameters.initialBid}`)
  console.log(
    `Bid Time Tolerance: ${networkConfig.deploy_parameters.bidTimeTolerance}`
  )
  console.log(
    `Bid Percentage Increment: ${networkConfig.deploy_parameters.percIncrement}`
  )
  console.log(
    `Auction Duration: ${networkConfig.deploy_parameters.auctionDuration}`
  )

  console.log("Initializing Auction House...")
  const queeneAuctionHouseInitTx = await queeneAuctionHouseContract.initialize(
    queenPalace.address,
    getWETHAddress(),
    networkConfig.deploy_parameters.bidTimeTolerance,
    networkConfig.deploy_parameters.initialBid.toString(),
    networkConfig.deploy_parameters.percIncrement,
    networkConfig.deploy_parameters.auctionDuration
  )

  await queeneAuctionHouseInitTx.wait(1)
  console.log("Auction House Initialized!")
}

export default deployRoyalAuctionHouse
deployRoyalAuctionHouse.tags = ["all", "RoyalAuctionHouse"]

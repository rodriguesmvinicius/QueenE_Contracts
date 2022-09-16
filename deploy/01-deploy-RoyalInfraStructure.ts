import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
  verifyContract,
  isLocalNetwork,
  getAddress,
  getAccount,
} from "../scripts/utils"
import { CustomNetworkConfig } from "../types/CustomNetworkConfig"
import {
  QueenPalace,
  RoyalTower,
  QueenLab,
  QueenPalace__factory,
  RoyalTower__factory,
  QueenLab__factory,
} from "../typechain-types/index"
const deployRoyalInfraStructure: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre
  const { deploy, log, save } = deployments
  const { artist, developer } = await getNamedAccounts()

  console.log("Starting infrastructure deploy...")

  const deployer = await getAccount("owner")
  const _artistAccount = await getAddress("artist")
  const _developerAccount = await getAddress("developer")
  const _royalMuseumAddress = await getAddress("owner")

  const chainId: number = network.config.chainId!
  const config: CustomNetworkConfig =
    network.config as unknown as CustomNetworkConfig

  const ROYAL_MUSEUM = process.env.SAFE_WALLET

  let queenPalace: QueenPalace | null
  let royalTower: RoyalTower | null
  let queenLab: QueenLab | null

  log("----------------------------------------------------")
  log("Deploying QueenPalace and waiting for confirmations...")
  try {
    const contractFactory: QueenPalace__factory =
      await ethers.getContractFactory("QueenPalace")

    queenPalace = await contractFactory
      .connect(deployer)
      .deploy(artist, developer, ROYAL_MUSEUM!)

    await queenPalace.deployed()

    log(`QueenPalace deployed at ${queenPalace!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenPalace!.address, [
        artist,
        developer,
        ROYAL_MUSEUM,
      ])
    }
    const queenPalaceArtifact = await deployments.getArtifact("QueenPalace")

    await save("QueenPalace", {
      address: queenPalace!.address,
      ...queenPalaceArtifact,
    })
  } catch (err: any) {
    console.error(`Error deploying QueenPalace! Error: ${err.message}`)
    return
  }

  log("----------------------------------------------------")
  log("Deploying Royal Tower and waiting for confirmations...")
  try {
    const royalTowerFactory: RoyalTower__factory =
      await ethers.getContractFactory("RoyalTower")

    royalTower = await royalTowerFactory
      .connect(deployer)
      .deploy(queenPalace?.address ?? "")
    log(`RoyalTower deployed at ${royalTower!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(royalTower!.address, [queenPalace?.address ?? ""])
    }
    const royalTowerArtifact = await deployments.getArtifact("RoyalTower")

    await save("RoyalTower", {
      address: royalTower!.address,
      ...royalTowerArtifact,
    })

    //subscribe to queen palace
    const setRoyalTowerTx = await queenPalace.setRoyalTower(royalTower!.address)
    await setRoyalTowerTx.wait(1)
  } catch (err: any) {
    console.error(`Error deploying RoyalTower! Error: ${err.message}`)
    return
  }
  log("----------------------------------------------------")
  log("Deploying QueenLab and waiting for confirmations...")
  try {
    const queenLabFactory: QueenLab__factory = await ethers.getContractFactory(
      "QueenLab"
    )

    queenLab = await queenLabFactory
      .connect(deployer)
      .deploy(queenPalace?.address ?? "")
    log(`QueenLab deployed at ${queenLab!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenLab!.address, [queenPalace?.address ?? ""])
    }
    const queenLabArtifact = await deployments.getArtifact("QueenLab")

    await save("QueenLab", {
      address: queenLab!.address,
      ...queenLabArtifact,
    })

    //subscribe to queen palace
    const setQueenLabTx = await queenPalace.setQueenLab(queenLab!.address)
    await setQueenLabTx.wait(1)
  } catch (err: any) {
    console.error(`Error deploying QueenLab! Error: ${err.message}`)
    return
  }
}
export default deployRoyalInfraStructure
deployRoyalInfraStructure.tags = ["all", "RoyalInfrastructure"]

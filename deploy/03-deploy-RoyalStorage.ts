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
} from "../typechain-types/index"
const deployRoyalStorage: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre
  const { log, save, get } = deployments
  const { artist, developer } = await getNamedAccounts()

  console.log("Starting storage deploy...")

  const deployer = await getAccount("owner")
  const _artistAccount = await getAddress("artist")
  const _developerAccount = await getAddress("developer")
  const _royalMuseumAddress = await getAddress("owner")

  const chainId: number = network.config.chainId!
  const config: CustomNetworkConfig =
    network.config as unknown as CustomNetworkConfig

  const ROYAL_MUSEUM = process.env.SAFE_WALLET

  let queenTraits: QueenTraits | null

  log("----------------------------------------------------")
  log("Deploying QueenTraits and waiting for confirmations...")
  try {
    const contractFactory: QueenTraits__factory =
      await ethers.getContractFactory("QueenTraits")

    const queenPalace = await get("QueenPalace")

    queenTraits = await contractFactory.deploy(
      queenPalace.address,
      commonDescriptions(),
      rareDescriptions(),
      superRareDescriptions()
    )

    await queenTraits.deployed()

    log(`QueenTraits deployed at ${queenTraits!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenTraits!.address, [
        queenPalace.address,
        commonDescriptions(),
        rareDescriptions(),
        superRareDescriptions(),
      ])
    }
    const queenTraitsArtifact = await deployments.getArtifact("QueenTraits")

    await save("QueenTraits", {
      address: queenTraits!.address,
      ...queenTraitsArtifact,
    })

    const queenPalaceFactory: QueenPalace__factory =
      await ethers.getContractFactory("QueenPalace")

    const queenPalaceContract = await queenPalaceFactory.attach(
      queenPalace.address
    )

    const setQueenTraitsTx = await queenPalaceContract.setQueenStorage(
      queenTraits!.address
    )
    await setQueenTraitsTx.wait(1)
  } catch (err: any) {
    console.error(`Error deploying QueenTraits! Error: ${err.message}`)
    return
  }
}
export default deployRoyalStorage
deployRoyalStorage.tags = ["all", "RoyalStorage"]

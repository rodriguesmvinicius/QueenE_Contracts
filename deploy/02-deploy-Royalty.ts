import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
  verifyContract,
  isLocalNetwork,
  getAddress,
  getAccount,
  getProxyRegistry,
  burnAddress,
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
} from "../typechain-types/index"
const deployRoyalty: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network, ethers } = hre
  const { log, save, get } = deployments
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

  let queenE: QueenE | null

  log("----------------------------------------------------")
  log("Deploying QueenE and waiting for confirmations...")
  try {
    const contractFactory: QueenE__factory = await ethers.getContractFactory(
      "QueenE"
    )

    const royalMuseum = await getAddress("museum")

    const queenPalace = await get("QueenPalace")

    queenE = await contractFactory.connect(deployer).deploy(
      queenPalace!!.address,
      await getAddress("founders"),
      getProxyRegistry(),
      "ipfs://",
      "",
      burnAddress, //used in upgrade for inheritance. Not necessary on fresh deploy
      royalMuseum!!
    )

    await queenE.deployed()

    log(`QueenE deployed at ${queenE!.address}`)
    if (
      !isLocalNetwork(network.name) &&
      process.env.ETHERSCAN_API_KEY &&
      config.verifyContract
    ) {
      await verifyContract(queenE!.address, [
        queenPalace!!.address,
        await getAddress("founders"),
        getProxyRegistry(),
        "ipfs://",
        "",
        burnAddress, //used in upgrade for inheritance. Not necessary on fresh deploy
        royalMuseum!!,
      ])
    }
    const queenEArtifact = await deployments.getArtifact("QueenE")

    await save("QueenE", {
      address: queenE!.address,
      ...queenEArtifact,
    })

    const queenPalaceFactory: QueenPalace__factory =
      await ethers.getContractFactory("QueenPalace")

    const queenPalaceContract = await queenPalaceFactory.attach(
      queenPalace.address
    )
    const setQueenETx = await queenPalaceContract.setQueenE(queenE!.address)
    await setQueenETx.wait(1)
  } catch (err: any) {
    console.error(`Error deploying QueenE! Error: ${err.message}`)
    return
  }
}
export default deployRoyalty
deployRoyalty.tags = ["all", "Royalty"]

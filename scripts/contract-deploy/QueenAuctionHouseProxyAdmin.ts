import { verifyContract, isLocalNetwork, verifyContractFile } from "../utils"
import { ethers, network } from "hardhat"
import {
  haveDeploys,
  getLatestDeploy,
  registerDeploy,
} from "../../components/deployController"
import {
  QueenAuctionHouseProxyAdmin,
  QueenAuctionHouseProxyAdmin__factory,
  QueenPalace,
} from "../../typechain-types"

//async main
export async function deployQueenAuctionHouseProxyAdmin(
  forceDeploy: boolean,
  queenPalace?: QueenPalace
): Promise<QueenAuctionHouseProxyAdmin> {
  if (
    haveDeploys("QueenAuctionHouseProxyAdmin") &&
    !forceDeploy &&
    !isLocalNetwork()
  ) {
    const latestContract = (await getLatestDeploy(
      "QueenAuctionHouseProxyAdmin"
    )) as QueenAuctionHouseProxyAdmin
    return latestContract
  }

  if (!queenPalace) {
    queenPalace = (await getLatestDeploy("QueenPalace")) as QueenPalace
  }

  const contractFactory: QueenAuctionHouseProxyAdmin__factory =
    await ethers.getContractFactory("QueenAuctionHouseProxyAdmin")
  console.log("Deploying contract...")
  const queenAuctionHouseProxyAdmin = await contractFactory.deploy(
    queenPalace.address
  )
  await queenAuctionHouseProxyAdmin.deployed()

  console.log(
    `Deployed QueenAuctionHouseProxyAdmin to: ${queenAuctionHouseProxyAdmin.address}`
  )

  const networkConfig: any = network.config
  if (networkConfig.verify && process.env.ETHERSCAN_API_KEY) {
    console.log("Awaiting 6 blocks to send verification request...")
    await queenAuctionHouseProxyAdmin.deployTransaction.wait(6)
    await verifyContractFile(
      queenAuctionHouseProxyAdmin.address,
      "contracts/proxy/QueenAuctionHouseProxyAdmin.sol:QueenAuctionHouseProxyAdmin",
      [queenPalace.address]
    )
  }

  //register deploy
  await registerDeploy(
    "QueenAuctionHouseProxyAdmin",
    queenAuctionHouseProxyAdmin.address
  )

  return queenAuctionHouseProxyAdmin
}

export async function verifyQueenAuctionHouseProxyAdmin() {
  const latestContract = await getLatestDeploy("QueenAuctionHouseProxyAdmin")
  const queenPalace = await getLatestDeploy("QueenPalace")
  //send verification request
  console.log("Sending verification request...")
  return await verifyContractFile(
    latestContract.address,
    "contracts/proxy/QueenAuctionHouseProxyAdmin.sol:QueenAuctionHouseProxyAdmin",
    [queenPalace.address]
  )
}

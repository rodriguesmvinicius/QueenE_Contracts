import { verifyContract, isLocalNetwork } from "../utils"
import { ethers, network } from "hardhat"
import {
  haveDeploys,
  getLatestDeploy,
  registerDeploy,
} from "../../components/deployController"
import {
  QueenAuctionHouse,
  QueenAuctionHouse__factory,
} from "../../typechain-types/index"
//async main
export async function deployQueenAuctionHouse(
  forceDeploy: boolean
): Promise<QueenAuctionHouse> {
  if (haveDeploys("QueenAuctionHouse") && !forceDeploy && !isLocalNetwork()) {
    const latestContract = (await getLatestDeploy(
      "QueenAuctionHouse"
    )) as QueenAuctionHouse
    return latestContract
  }

  const networkConfig: any = network.config

  const contractFactory = (await ethers.getContractFactory(
    "QueenAuctionHouse"
  )) as QueenAuctionHouse__factory
  console.log("Deploying contract...")
  const queenAuctionHouse = await contractFactory.deploy()
  await queenAuctionHouse.deployed()

  console.log(`Deployed QueenAuctionHouse to: ${queenAuctionHouse.address}`)

  if (networkConfig.verify && process.env.ETHERSCAN_API_KEY) {
    console.log("Awaiting 6 blocks to send verification request...")
    await queenAuctionHouse.deployTransaction.wait(6)
    await verifyContract(queenAuctionHouse.address, [])
  }

  //register deploy
  await registerDeploy("QueenAuctionHouse", queenAuctionHouse.address)

  return queenAuctionHouse
}

export async function verifyQueenAuctionHouse() {
  const latestContract = await getLatestDeploy("QueenAuctionHouse")

  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [])
}

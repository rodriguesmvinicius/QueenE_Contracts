import { verifyContract, isLocalNetwork } from "../utils"
import { ethers, network, web3 } from "hardhat"
import {
  haveDeploys,
  getLatestDeploy,
  registerDeploy,
} from "../../components/deployController"
import {
  QueenAuctionHouseV2,
  QueenAuctionHouseV2__factory,
} from "../../typechain-types/index"
import { BigNumber } from "ethers"
//async main
export async function deployQueenAuctionHouseV2(
  forceDeploy: boolean
): Promise<QueenAuctionHouseV2> {
  if (haveDeploys("QueenAuctionHouseV2") && !forceDeploy && !isLocalNetwork()) {
    const latestContract = (await getLatestDeploy(
      "QueenAuctionHouseV2"
    )) as QueenAuctionHouseV2
    return latestContract
  }

  const networkConfig: any = network.config

  const contractFactory = (await ethers.getContractFactory(
    "QueenAuctionHouseV2"
  )) as QueenAuctionHouseV2__factory
  console.log("Deploying contract...")
  const queenAuctionHouse = await contractFactory.deploy()
  await queenAuctionHouse.deployed()
  const deployReceipt = await queenAuctionHouse.deployTransaction.wait(1)

  console.log(
    `Total gas cost for Auction House V2 deploy mint: ${web3.utils.fromWei(
      deployReceipt.cumulativeGasUsed
        .mul(BigNumber.from(web3.utils.toWei("20", "gwei")))
        .toString(),
      "ether"
    )} ether`
  )
  console.log(`Deployed QueenAuctionHouse to: ${queenAuctionHouse.address}`)

  if (networkConfig.verify && process.env.ETHERSCAN_API_KEY) {
    console.log("Awaiting 6 blocks to send verification request...")
    await queenAuctionHouse.deployTransaction.wait(6)
    await verifyContract(queenAuctionHouse.address, [])
  }

  //register deploy
  await registerDeploy("QueenAuctionHouseV2", queenAuctionHouse.address)

  return queenAuctionHouse
}

export async function verifyQueenAuctionHouse() {
  const latestContract = await getLatestDeploy("QueenAuctionHouseV2")

  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [])
}

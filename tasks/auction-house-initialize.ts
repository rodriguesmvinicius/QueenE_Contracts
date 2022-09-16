import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import { getWETHAddress } from "../scripts/utils"
import {
  QueenAuctionHouse,
  QueenAuctionHouseProxy,
  QueenAuctionHouse__factory,
} from "../typechain-types"
export default task(
  "auction-house-initialize",
  "Prints the auction house values trhough proxy"
).setAction(async (_, hre) => {
  const chainId = hre.network.config.chainId

  const queenAuctionHouseProxy = await getLatestDeploy(
    "QueenAuctionHouseProxy",
    hre.ethers,
    chainId
  )
  const queenPalace = await getLatestDeploy("QueenPalace", hre.ethers, chainId)

  //get instance of contract
  const queenAuctionFactory: QueenAuctionHouse__factory =
    await hre.ethers.getContractFactory("QueenAuctionHouse")
  const queenAuctionHouseContract = await queenAuctionFactory.attach(
    queenAuctionHouseProxy.address
  )

  if (await queenAuctionHouseContract.isInitialized()) {
    console.log("Already initialized!")
    return
  }

  const networkConfig: any = hre.network.config
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
  console.log(`WETH address: ${getWETHAddress()}`)

  const tx = await queenAuctionHouseContract.initialize(
    queenPalace.address,
    getWETHAddress(),
    networkConfig.deploy_parameters.bidTimeTolerance,
    networkConfig.deploy_parameters.initialBid.toString(),
    networkConfig.deploy_parameters.percIncrement,
    networkConfig.deploy_parameters.auctionDuration
  )
  await tx.wait(1)
  console.log("Contract Initialized!")

  console.log(`QueenPalace: ${await queenAuctionHouseContract.QueenPalace()}`)
  console.log(`bidRaiseRate: ${await queenAuctionHouseContract.bidRaiseRate()}`)
  console.log(`duration: ${await queenAuctionHouseContract.duration()}`)
  console.log(`initialBid: ${await queenAuctionHouseContract.initialBid()}`)
  console.log(`initialized: ${await queenAuctionHouseContract.isInitialized()}`)
  console.log(`weth: ${await queenAuctionHouseContract.weth()}`)
})

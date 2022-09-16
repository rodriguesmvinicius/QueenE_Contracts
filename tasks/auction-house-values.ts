import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import {
  QueenAuctionHouse,
  QueenAuctionHouseProxy,
  QueenAuctionHouse__factory,
} from "../typechain-types"
export default task(
  "auction-house-values",
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

  console.log(`QueenPalace: ${await queenAuctionHouseContract.QueenPalace()}`)
  console.log(`bidRaiseRate: ${await queenAuctionHouseContract.bidRaiseRate()}`)
  console.log(`duration: ${await queenAuctionHouseContract.duration()}`)
  console.log(`initialBid: ${await queenAuctionHouseContract.initialBid()}`)
  console.log(`initialized: ${await queenAuctionHouseContract.isInitialized()}`)
  console.log(`weth: ${await queenAuctionHouseContract.weth()}`)
})

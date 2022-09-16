import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import { QueenAuctionHouse__factory } from "../typechain-types"

export default task(
  "auction-house-unpause",
  "Unpause Auction House",
  async function (_, hre) {
    const chainId = hre.network.config.chainId
    const queenAuctionHouseProxy = await getLatestDeploy(
      "QueenAuctionHouseProxy",
      hre.ethers,
      chainId
    )

    console.log(`QueenAuctionHouseProxy at: ${queenAuctionHouseProxy.address}`)
    //get instance of contract
    const queenAuctionFactory: QueenAuctionHouse__factory =
      await hre.ethers.getContractFactory("QueenAuctionHouse")

    const queenAuctionHouseContract = await queenAuctionFactory.attach(
      queenAuctionHouseProxy.address
    )

    console.log(queenAuctionHouseContract)
    console.log(`unpausing auction house...`)
    try {
      console.log(`Paused? ${await queenAuctionHouseContract.paused()}`)
      const tx = await queenAuctionHouseContract.unpause()
      await tx.wait(1)

      console.log(`Auction House Unpaused`)
    } catch (err) {
      console.error(`Error unpausing Auction house!`, err)
    }
  }
)

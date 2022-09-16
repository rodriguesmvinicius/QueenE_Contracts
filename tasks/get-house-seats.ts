import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import {
  QueenE,
  QueenAuctionHouseProxy,
  QueenAuctionHouse__factory,
} from "../typechain-types"
export default task(
  "get-house-seats",
  "Show qtty of house seats taken"
).setAction(async (_, hre) => {
  const chainId = hre.network.config.chainId

  const queenE = (await getLatestDeploy(
    "QueenE",
    hre.ethers,
    chainId
  )) as QueenE

  console.log(`House Seats Taken: ${await queenE.getHouseSeats(0)}`)
  console.log(`House of Lords full: ${await queenE.isHouseOfLordsFull()}`)
})

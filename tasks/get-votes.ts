import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"

export default task("get-votes", "Get vote weight of address")
  .addParam("account", "The account's address")
  .setAction(async function (taskArguments, hre) {
    const chainId = hre.network.config.chainId

    //taskArgs.account
    const queenE = await getLatestDeploy("QueenE", hre.ethers, chainId)

    try {
      console.log(`${taskArguments.account} voting power: ${await queenE.getVotes(taskArguments.account)}`)
    } catch (err) {
      console.error(`Error getting votes!`, err)
    }
  })

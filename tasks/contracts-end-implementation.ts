import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"

export default task("contracts-end-implementation", "End QueenE Implementation Phase", async function (_, hre) {
  const chainId = hre.network.config.chainId

  const queenPalace = await getLatestDeploy("QueenPalace", hre.ethers, chainId)

  console.log(`QueenPalaceAddress=${queenPalace?.address ?? ""}`)

  console.log(`ending implementation...`)
  try {
    await queenPalace.implementationEnded()

    const implementationStatus = await queenPalace.isOnImplementation()

    console.log(`On Implementation Status: ${implementationStatus}`)
  } catch (err) {
    console.error(`Error ending implementation!`, err)
  }
})

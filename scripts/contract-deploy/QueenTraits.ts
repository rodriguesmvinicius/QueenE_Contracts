import {
  verifyContract,
  isLocalNetwork,
  commonDescriptions,
  rareDescriptions,
  superRareDescriptions,
} from "../utils"
import { ethers, network, deployments } from "hardhat"

import {
  QueenPalace,
  QueenTraits,
  QueenTraits__factory,
} from "../../typechain-types"

export async function verifyQueenTraits() {
  const { get } = deployments

  const latestContract = await get("QueenTraits")
  const queenPalace = await get("QueenPalace")

  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [
    queenPalace.address,
    commonDescriptions(),
    rareDescriptions(),
    superRareDescriptions(),
  ])
}

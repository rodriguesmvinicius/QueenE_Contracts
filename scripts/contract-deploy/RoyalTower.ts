import { verifyContract, isLocalNetwork } from "../utils"
import { ethers, network, deployments } from "hardhat"

import {
  QueenPalace,
  RoyalTower,
  RoyalTower__factory,
} from "../../typechain-types/index"

export async function verifyRoyalTower() {
  const { get } = deployments

  const latestContract = await get("RoyalTower")
  const queenPalace = await get("QueenPalace")

  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [queenPalace.address])
}

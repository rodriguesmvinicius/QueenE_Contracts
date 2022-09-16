import { verifyContract, isLocalNetwork } from "../utils"
import { ethers, run, network } from "hardhat"
import {
  haveDeploys,
  getLatestDeploy,
  registerDeploy,
} from "../../components/deployController"
import {
  QueenPalace,
  QueenLab,
  QueenLab__factory,
} from "../../typechain-types/index"

export async function verifyQueenLab() {
  const latestContract = await getLatestDeploy("QueenLab")
  const queenPalace = await getLatestDeploy("QueenPalace")

  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [queenPalace.address])
}

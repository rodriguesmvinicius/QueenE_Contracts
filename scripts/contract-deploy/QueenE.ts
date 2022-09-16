import {
  verifyContract,
  isLocalNetwork,
  getAddress,
  getProxyRegistry,
  burnAddress,
} from "../utils"
import { ethers, run, network } from "hardhat"
import {
  haveDeploys,
  getLatestDeploy,
  registerDeploy,
} from "../../components/deployController"
import { CustomNetworkConfig } from "../../types/CustomNetworkConfig"
import { QueenE, QueenE__factory, QueenPalace } from "../../typechain-types"

export async function verifyQueenE() {
  const latestContract = await getLatestDeploy("QueenE")
  const queenPalace = await getLatestDeploy("QueenPalace")
  console.log(queenPalace)
  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [
    queenPalace.address,
    await getAddress("founders"),
    getProxyRegistry(),
    "ipfs://",
    "",
  ])
}

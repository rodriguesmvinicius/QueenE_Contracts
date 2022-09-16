import {
  verifyContract,
  isLocalNetwork,
  getAddress,
  verifyContractFile,
} from "../utils"
import { ethers, network, deployments } from "hardhat"

import {
  QueenE,
  QueenPalace,
  RoyalExecutor,
  RoyalGovernor,
  RoyalGovernor__factory,
} from "../../typechain-types"

export async function verifyRoyalGovernor() {
  const { get } = deployments
  const latestDeploy = await get("RoyalExecutor")

  const royalGovernorFactory = await ethers.getContractFactory("RoyalGovernor")

  const latestContract = await royalGovernorFactory.attach(latestDeploy.address)

  const owner = await getAddress("owner")

  const contractFactory: RoyalGovernor__factory =
    await ethers.getContractFactory("RoyalGovernor", owner)

  console.log(`RoyalGovernor: ${latestContract.address}`)
  console.log(`RoyalGovernor owner: ${await latestContract.owner()}`)
  console.log(`RoyalExecutor: ${await latestContract.timelock()}`)
  console.log(`Voting Period: ${await latestContract.votingPeriod()}`)
  console.log(`Voting Delay: ${await latestContract.votingDelay()}`)
  console.log(`Vetoer: ${await latestContract.vetoer()}`)
  console.log(`vetoPowerUntil: ${await latestContract.vetoPowerUntil()}`)

  const queenPalace = await get("QueenPalace")
  const governanceToken = await get("QueenE")
  const royalExecutor = await get("RoyalExecutor")

  const vetoerAddr = await getAddress("vetoer")

  const networkConfig: any = network.config
  const quorumPercentage = networkConfig.deploy_parameters.quorumPercentage
  const votingPeriod = networkConfig.deploy_parameters.votingPeriod
  const votingDelay = networkConfig.deploy_parameters.votingDelay
  const vetoUntil = networkConfig.deploy_parameters.vetoUntil

  console.log(`QueenPalace: ${queenPalace.address}`)
  console.log(`QueenE: ${governanceToken.address}`)
  console.log(`quorumPercentage: ${quorumPercentage}`)
  console.log(`votingPeriod: ${votingPeriod}`)
  console.log(`votingDelay: ${votingDelay}`)
  console.log(`vetoUntil: ${vetoUntil}`)
  //send verification request
  console.log("Sending verification request...")
  return await verifyContract(latestContract.address, [
    await latestContract.token(), // governanceToken.address,
    await latestContract.timelock(), // royalExecutor.address,
    queenPalace.address,
    await latestContract.vetoer(), // vetoerAddr,
    await latestContract.vetoPowerUntil(), //vetoUntil,
    await latestContract.quorumNumerator(), //quorumPercentage,
    await latestContract.votingPeriod(), //votingPeriod,
    await latestContract.votingDelay(), //votingDelay,
  ])
}

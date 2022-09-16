import { Web3Provider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import {
  QueenE,
  QueenPalace,
  RoyalGovernor,
  RoyalGovernorV2,
} from "../typechain-types"
export default task("proposal-data", "Prints Proposal Data for given id")
  .addParam("proposal", "The Id of the Proposal")
  .setAction(async (taskArgs, hre) => {
    const chainId = hre.network.config.chainId

    const queenPalace = (await getLatestDeploy(
      "QueenPalace",
      hre.ethers,
      chainId
    )) as QueenPalace

    const royalGovernor = (await getLatestDeploy(
      "RoyalGovernorV2",
      hre.ethers,
      chainId
    )) as RoyalGovernorV2

    const queenEOld = (await getLatestDeploy(
      "QueenE",
      hre.ethers,
      chainId
    )) as QueenE
    console.log(await queenEOld.tokenURI(1))
    console.log(`TimeLock: ${await royalGovernor.timelock()}`)
    console.log(`QueenPalace Executor: ${await queenPalace.daoExecutor()}`)

    const argsTokenUri = [
      "ipfs://bafkreidmrfuxtbqpa2nmwioicgydml3l3ft5ruizxicnww7v2jxunvt2ii?",
      "a",
    ]
    const argsUppgrade = [
      "0x37E5Bc89c0EfF9Ce9A4C7BAa8d5f56Baabc13941",
      "0x0913912b8d28B1eAD6b47217A62d1A3f37Cac617",
    ]
    let factory = await hre.ethers.getContractFactory("QueenE")

    const PROPOSAL_SETTOKENURI = factory.interface.encodeFunctionData(
      "setIpfsContractURIHash",
      argsTokenUri
    )

    factory = await hre.ethers.getContractFactory("QueenAuctionHouseProxyAdmin")
    const PROPOSAL_PROXYUPGRADE = factory.interface.encodeFunctionData(
      "upgrade",
      argsUppgrade
    )

    console.log(`disable TokenUri CallData: ${PROPOSAL_SETTOKENURI}`)
    console.log(`upgrade AuctionHouse CallData: ${PROPOSAL_PROXYUPGRADE}`)

    const {
      id,
      proposer,
      eta,
      startBlock,
      endBlock,
      forVotes,
      againstVotes,
      abstainVotes,
      canceled,
      executed,
    } = await royalGovernor.proposals(taskArgs.proposal)

    console.log(`Proposer: ${proposer}`)
    console.log(`In Favor: ${forVotes}`)
    console.log(`Against: ${againstVotes}`)
    console.log(`Abstained: ${abstainVotes}`)
    console.log(
      `State: ${
        proposalStatesEnum[await royalGovernor.state(taskArgs.proposal)]
      }`
    )
    const { targets, values, signatures, calldatas } =
      await royalGovernor.getActions(taskArgs.proposal)

    console.log("Targets:")
    console.log(targets)
    console.log("Values:")
    console.log(values)
    console.log("Signatures:")
    console.log(signatures)
    console.log("CallDatas:")
    console.log(calldatas)
  })

enum proposalStatesEnum {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

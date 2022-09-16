import { Web3Provider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import { QueenPalace, RoyalGovernor, RoyalGovernorV2 } from "../typechain-types"
export default task("execute-proposal", "try to execute proposal for given id")
  .addParam("proposal", "The Id of the Proposal")
  .setAction(async (taskArgs, hre) => {
    const chainId = hre.network.config.chainId

    const royalGovernor = (await getLatestDeploy(
      "RoyalGovernorV2",
      hre.ethers,
      chainId
    )) as RoyalGovernorV2

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

    //execute proposal
    await royalGovernor["execute(uint256)"](taskArgs.proposal)
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

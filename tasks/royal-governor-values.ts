import { Web3Provider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import { QueenPalace, RoyalGovernor } from "../typechain-types"
export default task(
  "royal-governor-values",
  "Prints the RoyalGovernor values"
).setAction(async (_, hre) => {
  const chainId = hre.network.config.chainId

  const royalGovernor = (await getLatestDeploy(
    "RoyalGovernor",
    hre.ethers,
    chainId
  )) as RoyalGovernor

  //console.log(
  //  `RoyalGovernor votes: ${await royalGovernor.getVotes(
  //    "0x172F19C6066441f6806556FCF5a97B1a86042bE2",
  //    15066655
  //  )}`
  //)

  //await royalGovernor.setVotingPeriod(545)
  //await royalGovernor.setVotingDelay(272)
  //const proposalTx = await royalGovernor[
  //  "propose(address[],uint256[],bytes[],string)"
  //]([], [0], [], "teste")

  console.log(`RoyalGovernor owner: ${await royalGovernor.owner()}`)
  console.log(`RoyalExecutor: ${await royalGovernor.timelock()}`)
  console.log(`Voting Period: ${await royalGovernor.votingPeriod()}`)
  console.log(`Voting Delay: ${await royalGovernor.votingDelay()}`)
  console.log(`Vetoer: ${await royalGovernor.vetoer()}`)

  const proposal = await royalGovernor.proposals(
    "50320382925426057450746044995704597596287349804371711034161307359580867039116"
  )

  console.log(`StartBlock: ${proposal.startBlock}`)
  console.log(`EndBlock: ${proposal.endBlock}`)
  console.log(`Proposal: ${JSON.stringify(proposal)}`)
})

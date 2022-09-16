import { task } from "hardhat/config"

const network = process.env.NETWORK

export default task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const provider = hre.ethers.getDefaultProvider(network)
    const account = hre.ethers.utils.getAddress(taskArgs.account)
    const balance = await provider.getBalance(account)

    console.log(hre.ethers.utils.formatEther(balance), "ETH")
  })

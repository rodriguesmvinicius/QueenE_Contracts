import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"
import { getAddress } from "../scripts/utils"
import {
  QueenAuctionHouseProxy,
  QueenAuctionHouseProxyAdmin,
  QueenAuctionHouseProxyAdmin__factory,
} from "../typechain-types/index"
const network = process.env.NETWORK

export default task("get-auction-proxy-admin", "Prints proxy admin").setAction(
  async (_, hre) => {
    const chainId = hre.network.config.chainId
    const proxy: QueenAuctionHouseProxy = await getLatestDeploy(
      "QueenAuctionHouseProxy",
      hre.ethers,
      chainId
    )
    const proxyAdmin: QueenAuctionHouseProxyAdmin = await getLatestDeploy(
      "QueenAuctionHouseProxyAdmin",
      hre.ethers,
      chainId
    )
    const owner = await getAddress("owner")
    console.log(owner)
    console.log(`Proxy ${proxy.address} admin is ${await proxyAdmin.address}`)
    console.log(
      `Proxy admin is ${await proxyAdmin.getProxyAdmin(proxy.address)}`
    )
    console.log(`Proxy admin owner is ${await proxyAdmin.owner()}`)
    const factory: QueenAuctionHouseProxyAdmin__factory =
      (await hre.ethers.getContractFactory(
        "QueenAuctionHouseProxyAdmin"
      )) as QueenAuctionHouseProxyAdmin__factory

    const args = [
      "0xb57B97A1573b7206741D6d6c32Ff8BDa991d6435",
      "0x41A39426b672f938717cB7C3bafe6c4be36dE8E1",
    ]

    const PROPOSAL_FUNCTION = factory.interface.encodeFunctionData(
      "upgrade",
      args
    )

    console.log(PROPOSAL_FUNCTION)
  }
)

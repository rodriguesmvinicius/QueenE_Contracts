import {
  verifyContract,
  isLocalNetwork,
  encode_function_data,
  verifyContractFile,
} from "../utils"
import { ethers, network } from "hardhat"
import {
  haveDeploys,
  getLatestDeploy,
  registerDeploy,
} from "../../components/deployController"
import {
  QueenAuctionHouse,
  QueenAuctionHouseProxy,
  QueenAuctionHouseProxyAdmin,
  QueenAuctionHouseProxy__factory,
  QueenPalace,
} from "../../typechain-types"

//async main
export async function deployQueenAuctionHouseProxy(
  forceDeploy: boolean,
  logicAddr: string,
  proxyAdmin?: QueenAuctionHouseProxyAdmin,
  encoded_initializer?: any,
  queenPalace?: QueenPalace
) {
  if (
    haveDeploys("QueenAuctionHouseProxy") &&
    !forceDeploy &&
    !isLocalNetwork()
  ) {
    const latestContract = (await getLatestDeploy(
      "QueenAuctionHouseProxy"
    )) as QueenAuctionHouseProxy
    return latestContract
  }

  if (!queenPalace) {
    queenPalace = (await getLatestDeploy("QueenPalace")) as QueenPalace
  }

  if (!logicAddr) {
    const logic = (await getLatestDeploy(
      "QueenAuctionHouse"
    )) as QueenAuctionHouse
    logicAddr = logic.address
  }

  if (!proxyAdmin) {
    proxyAdmin = (await getLatestDeploy(
      "QueenAuctionHouseProxyAdmin"
    )) as QueenAuctionHouseProxyAdmin
  }

  if (!encoded_initializer) {
    encoded_initializer = encode_function_data()
  }

  const contractFactory: QueenAuctionHouseProxy__factory =
    await ethers.getContractFactory("QueenAuctionHouseProxy")
  console.log("Deploying contract...")
  const queenAuctionHouseProxy = await contractFactory.deploy(
    logicAddr,
    proxyAdmin.address,
    encoded_initializer
  )
  await queenAuctionHouseProxy.deployed()

  console.log(
    `Deployed QueenAuctionHouseProxy to: ${queenAuctionHouseProxy.address}`
  )

  //subscribe to QueenPalace
  try {
    console.log(
      `Subscribing QueenAuctionHouseProxy as Minter to QueenPalace...`
    )
    const tx = await queenPalace.setMinter(queenAuctionHouseProxy.address)
    await tx.wait(1)

    console.log(`QueenAuctionHouseProxy Subscribed as Minter to QueenPalace!`)
  } catch (err) {
    console.error(
      "Error subscribing QueenAuctionHouseProxy as minter to QueenPalace!"
    )
    console.error(err)
  }
  const networkConfig: any = network.config
  if (networkConfig.verify && process.env.ETHERSCAN_API_KEY) {
    console.log("Awaiting 6 blocks to send verification request...")
    await queenAuctionHouseProxy.deployTransaction.wait(6)
    await verifyContractFile(
      queenAuctionHouseProxy.address,
      "contracts/proxy/QueenAuctionHouseProxy.sol:QueenAuctionHouseProxy",
      [logicAddr, proxyAdmin.address, encoded_initializer]
    )
  }

  //register deploy
  await registerDeploy("QueenAuctionHouseProxy", queenAuctionHouseProxy.address)

  return queenAuctionHouseProxy
}

export async function verifyQueenAuctionHouseProxy() {
  const latestContract = (await getLatestDeploy(
    "QueenAuctionHouseProxy"
  )) as QueenAuctionHouseProxy
  const logic = (await getLatestDeploy(
    "QueenAuctionHouse"
  )) as QueenAuctionHouse
  const logicAddr = logic.address
  const proxyAdmin = (await getLatestDeploy(
    "QueenAuctionHouseProxyAdmin"
  )) as QueenAuctionHouseProxyAdmin
  const encoded_initializer = encode_function_data()

  //send verification request
  console.log("Sending verification request...")
  return await verifyContractFile(
    latestContract.address,
    "contracts/proxy/QueenAuctionHouseProxy.sol:QueenAuctionHouseProxy",
    [logicAddr, proxyAdmin.address, encoded_initializer]
  )
}

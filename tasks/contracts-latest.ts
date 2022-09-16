import { task } from "hardhat/config"
import { getLatestDeploy } from "../components/deployController"

task(
  "contracts-latest",
  "Prints the latest deployed contracts",
  async function (_, hre) {
    const chainId = hre.network.config.chainId

    const queenPalace = await getLatestDeploy(
      "QueenPalace",
      hre.ethers,
      chainId
    )
    const royalTower = await getLatestDeploy("RoyalTower", hre.ethers, chainId)
    const queenLab = await getLatestDeploy("QueenLab", hre.ethers, chainId)

    const queenTraits = await getLatestDeploy(
      "QueenTraits",
      hre.ethers,
      chainId
    )
    const queenE = await getLatestDeploy("QueenE", hre.ethers, chainId)

    const queenAuctionHouseProxy = await getLatestDeploy(
      "QueenAuctionHouseProxy",
      hre.ethers,
      chainId
    )
    const queenAuctionHouseProxyAdmin = await getLatestDeploy(
      "QueenAuctionHouseProxyAdmin",
      hre.ethers,
      chainId
    )
    const queenAuctionHouse = await getLatestDeploy(
      "QueenAuctionHouse",
      hre.ethers,
      chainId
    )

    const royalGovernor = await getLatestDeploy(
      "RoyalGovernor",
      hre.ethers,
      chainId
    )
    const royalExecutor = await getLatestDeploy(
      "RoyalExecutor",
      hre.ethers,
      chainId
    )

    const queenEV2 = await getLatestDeploy("QueenEV2", hre.ethers, chainId)
    const royalGovernorV2 = await getLatestDeploy(
      "RoyalGovernorV2",
      hre.ethers,
      chainId
    )
    const royalExecutorV2 = await getLatestDeploy(
      "RoyalExecutorV2",
      hre.ethers,
      chainId
    )

    const queenAuctionHouseV2 = await getLatestDeploy(
      "QueenAuctionHouseV2",
      hre.ethers,
      chainId
    )

    console.log(`QueenPalaceAddress=${queenPalace?.address ?? ""}`)
    console.log(`QueenTraitsAddress=${queenTraits?.address ?? ""}`)
    console.log(`QueenLabAddress=${queenLab?.address ?? ""}`)
    console.log(`QueenEAddress=${queenE?.address ?? ""}`)
    console.log(
      `QueenAuctionHouseProxyAddress=${queenAuctionHouseProxy?.address ?? ""}`
    )
    console.log(
      `QueenAuctionHouseProxyAdminAddress=${
        queenAuctionHouseProxyAdmin?.address ?? ""
      }`
    )
    console.log(`QueenAuctionHouseAddress=${queenAuctionHouse?.address ?? ""}`)
    console.log(`RoyalTower=${royalTower?.address ?? ""}`)
    console.log(`RoyalGovernor=${royalGovernor?.address ?? ""}`)
    console.log(`RoyalExecutor=${royalExecutor?.address ?? ""}`)
    console.log(`QueenEV2=${queenEV2?.address ?? ""}`)
    console.log(`RoyalGovernorV2=${royalGovernorV2?.address ?? ""}`)
    console.log(`RoyalExecutorV2=${royalExecutorV2?.address ?? ""}`)
    console.log(`QueenAuctionHouseV2=${queenAuctionHouseV2?.address ?? ""}`)
    console.log(
      "***********************************************************************************"
    )
    console.log(`QUEEN_PALACE_ADDRESS="${queenPalace?.address ?? ""}"`)
    console.log(`QUEEN_TRAITS_ADDRESS="${queenTraits?.address ?? ""}"`)
    console.log(`QUEEN_LAB_ADDRESS="${queenLab?.address ?? ""}"`)
    console.log(`QUEEN_E_ADDRESS="${queenE?.address ?? ""}"`)
    console.log(
      `QUEEN_AUCTION_HOUSE_PROXY_ADDRESS="${
        queenAuctionHouseProxy?.address ?? ""
      }"`
    )
    console.log(
      `QUEEN_AUCTION_HOUSE_PROXY_ADMIN_ADDRESS="${
        queenAuctionHouseProxyAdmin?.address ?? ""
      }"`
    )
    console.log(
      `QUEEN_AUCTION_HOUSE_ADDRESS="${queenAuctionHouse?.address ?? ""}"`
    )
    console.log(`ROYAL_TOWER_ADDRESS=${royalTower?.address ?? ""}`)
    console.log(`ROYAL_GOVERNOR_ADDRESS=${royalGovernor?.address ?? ""}`)
    console.log(`ROYAL_EXECUTOR_ADDRESS=${royalExecutor?.address ?? ""}`)
    console.log(`QUEEN_E_V2_ADDRESS=${queenEV2?.address ?? ""}`)
    console.log(`ROYAL_GOVERNOR_V2_ADDRESS=${royalGovernorV2?.address ?? ""}`)
    console.log(`ROYAL_EXECUTOR_V2_ADDRESS=${royalExecutorV2?.address ?? ""}`)
    console.log(
      `QUEEN_AUCTION_HOUSE_V2_ADDRESS=${queenAuctionHouseV2?.address ?? ""}`
    )
  }
)

import {
  QueenPalace,
  RoyalTower,
  QueenLab,
  QueenTraits,
  QueenAuctionHouse,
  QueenAuctionHouseProxyAdmin,
  QueenAuctionHouseProxy,
  RoyalExecutor,
  RoyalGovernor,
  QueenE,
  QueenEV2,
  QueenAuctionHouseV2,
} from "../typechain-types/index"

export interface ContractBundle {
  queenPalace?: QueenPalace
  royalTower?: RoyalTower
  queenLab?: QueenLab
  queenTraits?: QueenTraits
  queenE?: QueenE
  queenAuctionHouse?: QueenAuctionHouse
  queenAuctionHouseProxyAdmin?: QueenAuctionHouseProxyAdmin
  queenAuctionHouseProxy?: QueenAuctionHouseProxy
  queenAuctionHouseContract?: QueenAuctionHouse
  royalExecutor?: RoyalExecutor
  royalGovernor?: RoyalGovernor
  queenEV2?: QueenEV2
  royalExecutorV2?: RoyalExecutor
  royalGovernorV2?: RoyalGovernor
  queenAuctionHouseV2?: QueenAuctionHouseV2
}

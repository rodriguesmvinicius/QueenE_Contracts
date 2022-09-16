import { verifyQueenAuctionHouseProxy } from "../contract-deploy/QueenAuctionHouseProxy"

verifyQueenAuctionHouseProxy()
  .then((result) => {
    if (result) console.log(`QueenAuctionHouseProxy contract verified!`)
    else console.error("Erro verifying QueenAuctionHouseProxy!")
  })
  .catch((err) => {
    console.error(err)
  })

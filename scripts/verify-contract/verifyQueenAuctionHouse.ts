import { verifyQueenAuctionHouse } from "../contract-deploy/QueenAuctionHouse"

verifyQueenAuctionHouse()
  .then((result) => {
    if (result) console.log(`QueenAuctionHouse contract verified!`)
    else console.error("Erro verifying QueenAuctionHouse!")
  })
  .catch((err) => {
    console.error(err)
  })

import { verifyQueenAuctionHouseProxyAdmin } from "../contract-deploy/QueenAuctionHouseProxyAdmin"

verifyQueenAuctionHouseProxyAdmin()
  .then((result) => {
    if (result) console.log(`QueenAuctionHouseProxyAdmin contract verified!`)
    else console.error("Erro verifying QueenAuctionHouseProxyAdmin!")
  })
  .catch((err) => {
    console.error(err)
  })

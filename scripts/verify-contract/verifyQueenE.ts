import { verifyQueenE } from "../contract-deploy/QueenE"

verifyQueenE()
  .then((result) => {
    if (result) console.log(`QueenE contract verified!`)
    else console.error("Erro verifying QueenE!")
  })
  .catch((err) => {
    console.error(err)
  })

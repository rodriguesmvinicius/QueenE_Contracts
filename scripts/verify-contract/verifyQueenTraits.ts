import { verifyQueenTraits } from "../contract-deploy/QueenTraits"

verifyQueenTraits()
  .then((result) => {
    if (result) console.log(`QueenTraits contract verified!`)
    else console.error("Erro verifying QueenTraits!")
  })
  .catch((err) => {
    console.error(err)
  })

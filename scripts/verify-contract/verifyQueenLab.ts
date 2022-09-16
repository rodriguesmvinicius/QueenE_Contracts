import { verifyQueenLab } from "../contract-deploy/QueenLab"

verifyQueenLab()
  .then((result) => {
    if (result) console.log(`QueenLab contract verified!`)
    else console.error("Erro verifying QueenLab!")
  })
  .catch((err) => {
    console.error(err)
  })

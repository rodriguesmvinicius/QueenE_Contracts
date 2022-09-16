import { verifyRoyalExecutor } from "../contract-deploy/RoyalExecutor"

verifyRoyalExecutor()
  .then((result) => {
    if (result) console.log(`RoyalExecutor contract verified!`)
    else console.error("Erro verifying RoyalExecutor!")
  })
  .catch((err) => {
    console.error(err)
  })

import { verifyRoyalGovernor } from "../contract-deploy/RoyalGovernor"

verifyRoyalGovernor()
  .then((result) => {
    if (result) console.log(`RoyalGovernor contract verified!`)
    else console.error("Erro verifying RoyalGovernor!")
  })
  .catch((err) => {
    console.error(err)
  })

import { verifyRoyalTower } from "../contract-deploy/RoyalTower"

verifyRoyalTower()
  .then((result) => {
    if (result) console.log(`RoyalTower contract verified!`)
    else console.error("Erro verifying RoyalTower!")
  })
  .catch((err) => {
    console.error(err)
  })

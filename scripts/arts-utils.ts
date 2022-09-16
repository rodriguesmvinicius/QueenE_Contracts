import { QueenTraits } from "../typechain-types"
import { web3 } from "hardhat"

export async function populate_arts(
  commonQtty: number,
  rareQtty: number,
  superQtty: number,
  queenTraits: QueenTraits
) {
  const artsList: {
    traitId: number
    rarityId: number
    artName: string
    uri: string
  }[] = []

  console.log("Populate Arts...")
  //CANVAS
  for (let idx = 0; idx < commonQtty; idx++) {
    artsList.push({
      traitId: 1,
      rarityId: 1,
      artName: web3.utils.fromAscii(`BACKGROUND COMUM ${idx + 1}`),
      uri: web3.utils.fromAscii(`BACKGROUND COMUM ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    artsList.push({
      traitId: 1,
      rarityId: 2,
      artName: web3.utils.fromAscii(`BACKGROUND RARO ${idx + 1}`),
      uri: web3.utils.fromAscii(`BACKGROUND RARO ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < superQtty; idx++) {
    artsList.push({
      traitId: 1,
      rarityId: 3,
      artName: web3.utils.fromAscii(`BACKGROUND SUPE-RARO ${idx + 1}`),
      uri: web3.utils.fromAscii(`BACKGROUND SUPE-RARO ${idx + 1}`),
    })
  }
  //FACE
  for (let idx = 0; idx < commonQtty; idx++) {
    artsList.push({
      traitId: 2,
      rarityId: 1,
      artName: web3.utils.fromAscii(`ROSTO COMUM ${idx + 1}`),
      uri: web3.utils.fromAscii(`ROSTO COMUM ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    artsList.push({
      traitId: 2,
      rarityId: 2,
      artName: web3.utils.fromAscii(`ROSTO RARO ${idx + 1}`),
      uri: web3.utils.fromAscii(`ROSTO RARO ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < superQtty; idx++) {
    artsList.push({
      traitId: 2,
      rarityId: 3,
      artName: web3.utils.fromAscii(`ROSTO SUPE-RARO ${idx + 1}`),
      uri: web3.utils.fromAscii(`ROSTO SUPE-RARO ${idx + 1}`),
    })
  }
  //OUTFIT
  for (let idx = 0; idx < commonQtty; idx++) {
    artsList.push({
      traitId: 3,
      rarityId: 1,
      artName: web3.utils.fromAscii(`ROUPA COMUM ${idx + 1}`),
      uri: web3.utils.fromAscii(`ROUPA COMUM ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    artsList.push({
      traitId: 3,
      rarityId: 2,
      artName: web3.utils.fromAscii(`ROUPA RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`ROUPA RARA ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < superQtty; idx++) {
    artsList.push({
      traitId: 3,
      rarityId: 3,
      artName: web3.utils.fromAscii(`ROUPA SUPE-RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`ROUPA SUPE-RARA ${idx + 1}`),
    })
  }
  //HEAD
  for (let idx = 0; idx < commonQtty; idx++) {
    artsList.push({
      traitId: 4,
      rarityId: 1,
      artName: web3.utils.fromAscii(`COROA COMUM ${idx + 1}`),
      uri: web3.utils.fromAscii(`COROA COMUM ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    artsList.push({
      traitId: 4,
      rarityId: 2,
      artName: web3.utils.fromAscii(`COROA RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`COROA RARA ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < superQtty; idx++) {
    artsList.push({
      traitId: 4,
      rarityId: 3,
      artName: web3.utils.fromAscii(`COROA SUPE-RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`COROA SUPE-RARA ${idx + 1}`),
    })
  }
  //JEWERY
  for (let idx = 0; idx < commonQtty; idx++) {
    artsList.push({
      traitId: 5,
      rarityId: 1,
      artName: web3.utils.fromAscii(`COLAR COMUM ${idx + 1}`),
      uri: web3.utils.fromAscii(`COLAR COMUM ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    artsList.push({
      traitId: 5,
      rarityId: 2,
      artName: web3.utils.fromAscii(`COLAR RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`COLAR RARA ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < superQtty; idx++) {
    artsList.push({
      traitId: 5,
      rarityId: 3,
      artName: web3.utils.fromAscii(`COLAR SUPE-RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`COLAR SUPE-RARA ${idx + 1}`),
    })
  }
  //FRAME
  for (let idx = 0; idx < commonQtty; idx++) {
    artsList.push({
      traitId: 6,
      rarityId: 1,
      artName: web3.utils.fromAscii(`MOLDURA COMUM ${idx + 1}`),
      uri: web3.utils.fromAscii(`MOLDURA COMUM ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    artsList.push({
      traitId: 6,
      rarityId: 2,
      artName: web3.utils.fromAscii(`MOLDURA RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`MOLDURA RARA ${idx + 1}`),
    })
  }
  for (let idx = 0; idx < superQtty; idx++) {
    artsList.push({
      traitId: 6,
      rarityId: 3,
      artName: web3.utils.fromAscii(`MOLDURA SUPE-RARA ${idx + 1}`),
      uri: web3.utils.fromAscii(`MOLDURA SUPE-RARA ${idx + 1}`),
    })
  }
  const setArtTx = await queenTraits.setArt(artsList)
  await setArtTx.wait(1)
}

export async function clean_arts(
  commonQtty: number,
  rareQtty: number,
  superQtty: number,
  queenTraits: QueenTraits
) {
  const artsList: {
    traitId: number
    rarityId: number
    artName: string
    uri: string
  }[] = []

  console.log("Populate Arts...")
  //CANVAS
  for (let idx = 0; idx < commonQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      1,
      1,
      web3.utils.fromAscii(`BACKGROUND COMUM ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }

  for (let idx = 0; idx < rareQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      1,
      2,
      web3.utils.fromAscii(`BACKGROUND RARO ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < superQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      1,
      3,
      web3.utils.fromAscii(`BACKGROUND SUPE-RARO ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  //FACE
  for (let idx = 0; idx < commonQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      2,
      1,
      web3.utils.fromAscii(`ROSTO COMUM ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      2,
      2,
      web3.utils.fromAscii(`ROSTO RARO ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < superQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      2,
      3,
      web3.utils.fromAscii(`ROSTO SUPE-RARO ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  //OUTFIT
  for (let idx = 0; idx < commonQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      3,
      1,
      web3.utils.fromAscii(`ROUPA COMUM ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      3,
      2,
      web3.utils.fromAscii(`ROUPA RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < superQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      3,
      3,
      web3.utils.fromAscii(`ROUPA SUPE-RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  //HEAD
  for (let idx = 0; idx < commonQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      4,
      1,
      web3.utils.fromAscii(`COROA COMUM ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      4,
      2,
      web3.utils.fromAscii(`COROA RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < superQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      4,
      3,
      web3.utils.fromAscii(`COROA SUPE-RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  //JEWERY
  for (let idx = 0; idx < commonQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      5,
      1,
      web3.utils.fromAscii(`COLAR COMUM ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      5,
      2,
      web3.utils.fromAscii(`COLAR RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < superQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      5,
      3,
      web3.utils.fromAscii(`COLAR SUPE-RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  //FRAME
  for (let idx = 0; idx < commonQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      6,
      1,
      web3.utils.fromAscii(`MOLDURA COMUM ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < rareQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      6,
      2,
      web3.utils.fromAscii(`MOLDURA RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
  for (let idx = 0; idx < superQtty; idx++) {
    const removeArtTx = await queenTraits.removeArt(
      6,
      3,
      web3.utils.fromAscii(`MOLDURA SUPE-RARA ${idx + 1}`)
    )
    await removeArtTx.wait(1)
  }
}

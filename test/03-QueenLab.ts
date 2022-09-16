import { assert } from "chai"
import { network, web3 } from "hardhat"
import deployRoyalInfraStructure from "../deploy/01-deploy-RoyalInfraStructure"
import deployRoyalty from "../deploy/02-deploy-Royalty"
import deployRoyalStorage from "../deploy/03-deploy-RoyalStorage"
import { getAccount, getAddress } from "../scripts/utils"
import {
  QueenE,
  QueenE__factory,
  QueenLab,
  QueenLab__factory,
  QueenPalace,
  QueenPalace__factory,
  QueenTraits,
  QueenTraits__factory,
  RoyalLibrary__factory,
} from "../typechain-types/index"
import { RoyalLibrary } from "../typechain-types/contracts/QueenLab"
import "@typechain/hardhat"
import { BigNumber } from "ethers"
import { populate_arts } from "../scripts/arts-utils"

const hre = require("hardhat")

describe("QueenLab", function () {
  //let contractBundle: ContractBundle
  const { deployments, ethers } = require("hardhat")
  const { get } = deployments

  const newArts = [
    {
      traitId: 1,
      rarityId: 1,
      artName: web3.utils.fromAscii("ALGUM_NOME_AQUI"),
      uri: web3.utils.fromAscii("ALGUMA_URL_AQUI"),
    },
    {
      traitId: 1,
      rarityId: 1,
      artName: web3.utils.fromAscii("ALGUM_NOME_AQUI_2"),
      uri: web3.utils.fromAscii("ALGUMA_URL_AQUI_2"),
    },
    {
      traitId: 1,
      rarityId: 1,
      artName: web3.utils.fromAscii("ALGUM_NOME_AQUI_3"),
      uri: web3.utils.fromAscii("ALGUMA_URL_AQUI_3"),
    },
    {
      traitId: 1,
      rarityId: 2,
      artName: web3.utils.fromAscii("ALGUM_NOME_AQUI_4"),
      uri: web3.utils.fromAscii("ALGUMA_URL_AQUI_4"),
    },
    {
      traitId: 1,
      rarityId: 3,
      artName: web3.utils.fromAscii("ALGUM_NOME_AQUI_5"),
      uri: web3.utils.fromAscii("ALGUMA_URL_AQUI_5"),
    },
  ]

  let queenPalaceFactory: QueenPalace__factory
  let queenTraitsFactory: QueenTraits__factory
  let queenEFactory: QueenE__factory
  let queenLabFactory: QueenLab__factory

  let _artistAccount: any
  let _developerAccount: any
  let _ownerAccount: any
  let _maliciousAccount: any
  let _teamAccounts: any[]
  let _artistTeam: any[] = []
  let _developerTeam: any[] = []
  let _royalMuseumAddress: string

  let queenPalace: QueenPalace
  let queenTraits: QueenTraits
  let queenE: QueenE

  beforeEach(async function () {
    _artistAccount = await getAccount("artist")
    _developerAccount = await getAccount("developer")
    _royalMuseumAddress = await getAddress("owner") //process.env.SAFE_WALLET

    _ownerAccount = await getAccount("owner")
    _maliciousAccount = await getAccount("malicious")
    _teamAccounts = await getAccount("minters", 4)
    _artistTeam = []
    _developerTeam = []

    await deployRoyalInfraStructure(hre)
    await deployRoyalStorage(hre)
    await deployRoyalty(hre)

    queenPalaceFactory = await ethers.getContractFactory("QueenPalace")
    queenTraitsFactory = await ethers.getContractFactory("QueenTraits")
    queenLabFactory = await ethers.getContractFactory("QueenLab")
    queenEFactory = await ethers.getContractFactory("QueenE")

    const queenPalaceDeploy = await get("QueenPalace")
    queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

    const queenTraitsDeploy = await get("QueenTraits")
    queenTraits = await queenTraitsFactory.attach(queenTraitsDeploy.address)

    const queenEDeploy = await get("QueenE")
    queenE = await queenEFactory.attach(queenEDeploy.address)

    //allow artists to contract
    let allowTx = await queenPalace.allowArtist(_teamAccounts[0].address)
    await allowTx.wait(1)
    allowTx = await queenPalace.allowArtist(_teamAccounts[1].address)
    await allowTx.wait(1)

    _artistTeam.push(_teamAccounts[0])
    _artistTeam.push(_teamAccounts[1])

    //allow developers to contract
    let allowDevTx = await queenPalace.allowDeveloper(_teamAccounts[2].address)
    await allowDevTx.wait(1)
    allowDevTx = await queenPalace.allowDeveloper(_teamAccounts[3].address)
    await allowDevTx.wait(1)

    _developerTeam.push(_teamAccounts[2])
    _developerTeam.push(_teamAccounts[3])

    //populate arts
    await populate_arts(5, 5, 5, queenTraits)

    assert(queenPalace, "QueenPalace not deployed :-(")
    assert(queenTraits, "QueenTraits not deployed :-(")
    assert(queenE, "QueenE not deployed :-(")
  })
  describe("DeployQueenLab", function () {
    it("Should finish with a fully deployed QueenLab contract", async function () {
      const queenLabDeploy = await get("QueenLab")
      const queenLab = await queenLabFactory.attach(queenLabDeploy.address)

      assert(queenLab, "QueenLab not deployed :-(")
    })
  })
  describe("labFunctions", function () {
    let queenLab: QueenLab
    beforeEach(async function () {
      const queenLabDeploy = await get("QueenLab")
      queenLab = await queenLabFactory.attach(queenLabDeploy.address)
    })
    describe("BuilDNA", function () {
      it("Check queen dna generation", async function () {
        const iQtty = 100
        const iterations = 3
        let repeatedDna = 0

        let combination: string = ""

        const results: {
          it: number
          repeteadDNA: number
          combinations: any[]
          queenes: any[]
          commonQtd: number
          rareQtd: number
          superRareQtd: number
          legendaryQtd: number
          commonPerc: number
          rarePerc: number
          superRarePerc: number
          legendaryPerc: number
        }[] = []

        for (let idx = 1; idx <= iterations; idx++) {
          const combinations: any[] = []
          const queenes: any[] = []
          repeatedDna = 0
          let result: {
            it: number
            repeteadDNA: number
            combinations: any[]
            queenes: any[]
            commonQtd: number
            rareQtd: number
            superRareQtd: number
            legendaryQtd: number
            commonPerc: number
            rarePerc: number
            superRarePerc: number
            legendaryPerc: number
          } = {
            it: idx,
            repeteadDNA: repeatedDna,
            combinations: combinations,
            queenes: queenes,
            commonQtd: 0,
            rareQtd: 0,
            superRareQtd: 0,
            legendaryQtd: 0,
            commonPerc: 0,
            rarePerc: 0,
            superRarePerc: 0,
            legendaryPerc: 0,
          }

          const dnaList: any[] = []

          console.log(`Building ${iQtty} QueenEs for iteration ${idx}...`)
          for (let queeneId = 1; queeneId <= iQtty; queeneId++) {
            let commonCounter = 0
            let rareCounter = 0
            let superRareCounter = 0

            let tryAgain = true
            let dna: RoyalLibrary.SDNAStructOutput[] = []
            while (tryAgain) {
              dna = await queenLab.buildDna(queeneId, false)
              if (dnaList.includes(dna)) {
                console.log("DNA REPETEAD")
                repeatedDna++
              } else {
                dnaList.push(dna)
                /*let dnaString = `[[${dna[0].traitId},${dna[0].rarityId},${dna[0].trace}]`
                for (let geneIdx = 1; geneIdx < dna.length; geneIdx++) {
                  dnaString += `,[${dna[geneIdx].traitId},${dna[geneIdx].rarityId},${dna[geneIdx].trace}]`
                }
                dnaString += "]"
                console.log(
                  `it: ${idx} queeneId: ${queeneId
                    .toString()
                    .padStart(3, "0")} ${dnaString}`
                )*/
                tryAgain = false
              }
            }

            tryAgain = true
            for (var gene of dna) {
              if (gene.rarityId.eq(1)) commonCounter++
              else if (gene.rarityId.eq(2)) rareCounter++
              else if (gene.rarityId.eq(3)) superRareCounter++
            }

            combination = `${commonCounter}x${rareCounter}x${superRareCounter}`

            if (result.combinations.some((it: any) => it.name == combination)) {
              ;(
                result.combinations.filter(
                  (it: any) => it.name == combination
                )[0] as any
              ).qtd += 1
            } else {
              result.combinations.push({
                name: combination,
                qtd: 1,
              })
            }
            result.queenes.push({
              queeneId: queeneId,
              commonTraits: commonCounter,
              rareTraits: rareCounter,
              superRareTraits: superRareCounter,
            })
          }
          let commonQueenE = 0
          let rareQueenE = 0
          let superRareQueenE = 0
          let legendaryQueenE = 0

          for (let queeneId = 1; queeneId <= iQtty; queeneId++) {
            const dnaTraitsQtd = 6

            const commomQ = result.queenes[queeneId - 1].commonTraits
            const rareTraitsQtty = result.queenes[queeneId - 1].rareTraits
            const superRareTraitsQtty =
              result.queenes[queeneId - 1].superRareTraits

            const rareTraitPerc = (rareTraitsQtty / dnaTraitsQtd) * 100
            const superRareTraitPerc =
              (superRareTraitsQtty / dnaTraitsQtd) * 100

            let traitStat = 1

            for (let idx = 1; idx <= rareTraitsQtty; idx++) {
              traitStat = traitStat * 2
            }
            for (let idx = 1; idx <= superRareTraitsQtty; idx++) {
              traitStat = traitStat * 3
            }

            if (traitStat <= 4) commonQueenE += 1
            else if (traitStat <= 27) rareQueenE += 1
            else if (traitStat < 324) superRareQueenE += 1
            else legendaryQueenE += 1
          }
          result.repeteadDNA = repeatedDna
          result.commonQtd = commonQueenE
          result.rareQtd = rareQueenE
          result.superRareQtd = superRareQueenE
          result.legendaryQtd = legendaryQueenE

          result.commonPerc = (commonQueenE / iQtty) * 100
          result.rarePerc = (rareQueenE / iQtty) * 100
          result.superRarePerc = (superRareQueenE / iQtty) * 100
          result.legendaryPerc = (legendaryQueenE / iQtty) * 100

          results.push(result)
          //console.log(JSON.stringify(result.queenes))
        }

        let commonSum = 0
        let rareSum = 0
        let superRareSum = 0
        let legendarySum = 0

        let commonSumQtty = 0
        let rareSumQtty = 0
        let superRareSumQtty = 0
        let legendarySumQtty = 0

        for (let it = 1; it <= iterations; it++) {
          commonSum += results[it - 1].commonPerc
          rareSum += results[it - 1].rarePerc
          superRareSum += results[it - 1].superRarePerc
          legendarySum += results[it - 1].legendaryPerc

          commonSumQtty += results[it - 1].commonQtd
          rareSumQtty += results[it - 1].rareQtd
          superRareSumQtty += results[it - 1].superRareQtd
          legendarySumQtty += results[it - 1].legendaryQtd

          console.log("*".padEnd(170, "*"))
          console.log(`${`* ITERACTION: ${it}`.padEnd(169, " ")}*`)
          console.log(`${`* QUEENES: ${iQtty}`.padEnd(169, " ")}*`)
          console.log(`${`* REPETEAD: ${repeatedDna}`.padEnd(169, " ")}*`)
          console.log("*".padEnd(170, "*"))
          console.log(
            `${"* RARITY".padEnd(98, " ")} | ${"QTTY".padEnd(
              33,
              " "
            )} | ${"PERC".padEnd(32, " ")}*`
          )
          console.log("*".padEnd(170, "*"))
          console.log(
            `${"* COMMON".padEnd(98, " ")} | ${results[it - 1].commonQtd
              .toString()
              .padEnd(33, " ")} | ${results[it - 1].commonPerc
              .toString()
              .padEnd(32, " ")}*`
          )
          console.log(
            `${"* RARE".padEnd(98, " ")} | ${results[it - 1].rareQtd
              .toString()
              .padEnd(33, " ")} | ${results[it - 1].rarePerc
              .toString()
              .padEnd(32, " ")}*`
          )
          console.log(
            `${"* SUPER-RARE".padEnd(98, " ")} | ${results[it - 1].superRareQtd
              .toString()
              .padEnd(33, " ")} | ${results[it - 1].superRarePerc
              .toString()
              .padEnd(32, " ")}*`
          )
          console.log(
            `${"* LEGENDARY".padEnd(98, " ")} | ${results[it - 1].legendaryQtd
              .toString()
              .padEnd(33, " ")} | ${results[it - 1].legendaryPerc
              .toString()
              .padEnd(32, " ")}*`
          )
          console.log("*".padEnd(170, "*"))
        }
        console.log(
          `${"* COMMON AVERAGE".padEnd(98, " ")} | ${commonSumQtty
            .toString()
            .padEnd(33, " ")} | ${(commonSum / iterations)
            .toString()
            .padEnd(32, " ")}*`
        )
        console.log(
          `${"* RARE AVERAGE".padEnd(98, " ")} | ${rareSumQtty
            .toString()
            .padEnd(33, " ")} | ${(rareSum / iterations)
            .toString()
            .padEnd(32, " ")}*`
        )
        console.log(
          `${"* SUPER-RARE AVERAGE".padEnd(98, " ")} | ${superRareSumQtty
            .toString()
            .padEnd(33, " ")} | ${(superRareSum / iterations)
            .toString()
            .padEnd(32, " ")}*`
        )
        console.log(
          `${"* LEGENDARY AVERAGE".padEnd(98, " ")} | ${legendarySumQtty
            .toString()
            .padEnd(33, " ")} | ${(legendarySum / iterations)
            .toString()
            .padEnd(32, " ")}*`
        )
        console.log("*".padEnd(170, "*"))
        assert(
          commonSum / iterations > 51,
          "Common Percentage out of range (>51)"
        )
        assert(rareSum / iterations < 25, "Rare Percentage out of range (<25)")
        assert(
          superRareSum / iterations <= 5,
          "Super-rare Percentage out of range (<=5)"
        )
        assert(
          legendarySum / iterations <= 1,
          "Legendary Percentage out of range (<=1)"
        )
      })
    })
    describe("produceBlueblood", function () {
      it("Produce blueblood from valid dna. Should end with a valid blueblood flask", async function () {
        let blueblood: RoyalLibrary.SBLOODStructOutput[] = []

        try {
          const dna = await queenLab.buildDna(1, false)
          blueblood = await queenLab.produceBlueBlood(dna)
        } catch (err: any) {
          console.error(err.message)
        }

        assert((blueblood?.length ?? 0) > 0, "Could not produce blueblood :-(")
      })
      it("Produce blueblood from invalid dna. Should revert", async function () {
        let blueblood: RoyalLibrary.SBLOODStructOutput[] = []

        try {
          let dna: RoyalLibrary.SDNAStructOutput[] = []
          blueblood = await queenLab.produceBlueBlood(dna)
        } catch (err: any) {
          console.error(err.message)
        }

        assert(
          (blueblood?.length ?? 0) <= 0,
          "Produced blueblood from invalid DNA :-()"
        )
      })
    })
    describe("generateQueen", function () {
      it("Generate new valid QueenE. Should end with a valid QueenE", async function () {
        let queenE: RoyalLibrary.SQUEENStructOutput

        try {
          queenE = await queenLab.generateQueen(1, false)

          let dnaString = `[[${queenE.dna[0].traitId},${queenE.dna[0].rarityId},${queenE.dna[0].trace}]`
          for (let geneIdx = 1; geneIdx < queenE.dna.length; geneIdx++) {
            dnaString += `,[${queenE.dna[geneIdx].traitId},${queenE.dna[geneIdx].rarityId},${queenE.dna[geneIdx].trace}]`
          }
          dnaString += "]"
          console.log(
            `QueenE: ${queenE.queeneId
              .toString()
              .padStart(3, "0")} ${dnaString}`
          )
        } catch (err: any) {
          console.error(err.message)
        }

        assert(queenE!!?.queeneId.gt(0), "Could not generate QueenE")
      })
    })
    describe("tokenUri", function () {
      it("Construct tokenUri from generated QueenE. Should end with a valid tokenUri", async function () {
        let queenE: RoyalLibrary.SQUEENStructOutput
        let tokenUri: string = ""
        try {
          queenE = await queenLab.generateQueen(1, false)

          let dnaString = `[[${queenE.dna[0].traitId},${queenE.dna[0].rarityId},${queenE.dna[0].trace}]`
          for (let geneIdx = 1; geneIdx < queenE.dna.length; geneIdx++) {
            dnaString += `,[${queenE.dna[geneIdx].traitId},${queenE.dna[geneIdx].rarityId},${queenE.dna[geneIdx].trace}]`
          }
          dnaString += "]"
          console.log(
            `QueenE: ${queenE.queeneId
              .toString()
              .padStart(3, "0")} ${dnaString}`
          )

          tokenUri = await queenLab.constructTokenUri(queenE, "ipfs://")
          console.log(`tokenUri: ${tokenUri}`)
        } catch (err: any) {
          console.error(err.message)
        }

        assert(queenE!!?.queeneId.gt(0), "Could not generate QueenE")
        assert(tokenUri?.trim(), "Could not construct tokenUri")
      })
    })
  })
})

import { assert } from "chai"
import { web3, getUnnamedAccounts } from "hardhat"
import deployRoyalInfraStructure from "../deploy/01-deploy-RoyalInfraStructure"
import deployRoyalty from "../deploy/02-deploy-Royalty"
import deployRoyalStorage from "../deploy/03-deploy-RoyalStorage"
import { commonDescriptions, getAccount, getAddress } from "../scripts/utils"
import {
  QueenPalace,
  QueenPalace__factory,
  QueenTraits,
  QueenTraits__factory,
} from "../typechain-types/index"
import "@typechain/hardhat"
import { BigNumber } from "ethers"

const hre = require("hardhat")

describe("QueenTraits", function () {
  //let contractBundle: ContractBundle
  const { deployments, ethers } = require("hardhat")
  const { get } = deployments

  let _artistAccount: any
  let _developerAccount: any
  let _ownerAccount: any
  let _maliciousAccount: any
  let _teamAccounts: any[]
  let _artistTeam: any[] = []
  let _developerTeam: any[] = []

  let queenPalaceFactory: QueenPalace__factory
  let queenTraitsFactory: QueenTraits__factory

  let newArts: {
    traitId: number
    rarityId: number
    artName: string
    uri: string
  }[]

  beforeEach(async function () {
    _artistAccount = await getAccount("artist")
    _developerAccount = await getAccount("developer")
    _ownerAccount = await getAccount("owner")
    _maliciousAccount = await getAccount("malicious")
    _teamAccounts = await getAccount("minters", 4)
    _artistTeam = []
    _developerTeam = []
    //create new arts object
    newArts = [
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

    await deployRoyalInfraStructure(hre)
    await deployRoyalStorage(hre)

    queenPalaceFactory = await ethers.getContractFactory("QueenPalace")
    queenTraitsFactory = await ethers.getContractFactory("QueenTraits")
  })
  describe("DeployQueenTraits", function () {
    let queenPalace: QueenPalace
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      assert(queenPalace, "QueenPalace not deployed :-(")
    })
    it("Should finish with a fully deployed QueenTraits contract", async function () {
      const queenTraitsDeploy = await get("QueenTraits")
      const queenTraits = await queenTraitsFactory.attach(
        queenTraitsDeploy.address
      )
      //subscribe to queenPalace
      const subscribeTx = await queenPalace.setQueenStorage(queenTraits.address)
      await subscribeTx.wait(1)

      const subscribedContract = await queenPalace.QueenTraits()
      assert(queenTraits, "QueenTraits not deployed :-(")
      assert(
        subscribedContract == queenTraits.address,
        "QueenTraits not subscribe to QueenPalace :-("
      )
    })
  })
  describe("RarityFunctions", function () {
    let queenPalace: QueenPalace
    let queenTraits: QueenTraits
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      const queenTraitsDeploy = await get("QueenTraits")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      queenTraits = await queenTraitsFactory.attach(queenTraitsDeploy.address)
      //allow artists to contract
      let allowTx = await queenPalace.allowArtist(_teamAccounts[0].address)
      await allowTx.wait(1)
      allowTx = await queenPalace.allowArtist(_teamAccounts[1].address)
      await allowTx.wait(1)

      _artistTeam.push(_teamAccounts[0])
      _artistTeam.push(_teamAccounts[1])

      //allow developers to contract
      let allowDevTx = await queenPalace.allowDeveloper(
        _teamAccounts[2].address
      )
      await allowDevTx.wait(1)
      allowDevTx = await queenPalace.allowDeveloper(_teamAccounts[3].address)
      await allowDevTx.wait(1)

      _developerTeam.push(_teamAccounts[2])
      _developerTeam.push(_teamAccounts[3])

      assert(queenPalace, "QueenPalace not deployed :-(")
      assert(queenTraits, "QueenTraits not deployed :-(")
    })
    describe("setRarity_OwnerOrDeveloper", function () {
      it("set new rarity with owner account. Should work no problem", async function () {
        //update common rarity percentage
        const updRarityTx = await queenTraits.updateRarity(1, 80, "COMMON")
        await updRarityTx.wait(1)

        const initialRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length

        try {
          //call setRarity
          const setRarityTx = await queenTraits.setRarity("NEW_RARITY", 5)
          await setRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length
        //get rarity set
        const raritySet = await queenTraits.getRarityByName("NEW_RARITY")

        assert(
          raritySet.rarityName?.replace("0x", "")?.trim(),
          "New rarity not set :-("
        )
        assert(
          initialRaritiesCount < finalRaritiesCount,
          "Wrong rarities count :-("
        )
      })
      it("set new rarity with chief developer account. Should work no problem", async function () {
        //update common rarity percentage
        const updRarityTx = await queenTraits.updateRarity(1, 80, "COMMON")
        await updRarityTx.wait(1)

        queenTraits = await queenTraits.connect(_developerAccount)

        console.log(`Chief Developer Address: ${_developerAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        const initialRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length

        try {
          //call setRarity
          const setRarityTx = await queenTraits.setRarity("NEW_RARITY", 5)
          await setRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length
        //get rarity set
        const raritySet = await queenTraits.getRarityByName("NEW_RARITY")

        assert(
          raritySet.rarityName?.replace("0x", "")?.trim(),
          "New rarity not set :-("
        )
        assert(
          initialRaritiesCount < finalRaritiesCount,
          "Wrong rarities count :-("
        )
      })
    })
    describe("setRarity_Malicious", function () {
      it("try to set new rarity with malicious account. Should revert", async function () {
        //update common rarity percentage
        const updRarityTx = await queenTraits.updateRarity(1, 80, "COMMON")
        await updRarityTx.wait(1)

        queenTraits = await queenTraits.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        const initialRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length

        try {
          //call setRarity
          const setRarityTx = await queenTraits.setRarity("NEW_RARITY", 5)
          await setRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length
        //get rarity set
        const raritySet = await queenTraits.getRarityByName("NEW_RARITY")

        assert(
          !raritySet.rarityName?.replace("0x", "")?.trim(),
          "Malicious set new rarity :-O"
        )
        assert(
          initialRaritiesCount == finalRaritiesCount,
          "Wrong rarities count :-("
        )
      })
    })
    describe("setRarity_Overflow", function () {
      it("try to set a new rarity with percentage that overflows. Should revert", async function () {
        const initialRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length

        try {
          //call setRarity
          const setRarityTx = await queenTraits.setRarity("NEW_RARITY", 5)
          await setRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalRaritiesCount = (await queenTraits.getRarities(false, 0))
          .length
        //get rarity set
        const raritySet = await queenTraits.getRarityByName("NEW_RARITY")

        assert(
          !raritySet.rarityName?.replace("0x", "")?.trim(),
          "Overflow rarity set :-("
        )
        assert(
          initialRaritiesCount == finalRaritiesCount,
          "Wrong rarities count :-("
        )
      })
    })
    describe("updateRarity_OwnerOrDeveloper", function () {
      it("update rarity name with owner account. should work", async function () {
        //queenTraits = await queenTraits.connect(_developerAccount)

        //console.log(`Chief Developer Address: ${_developerAccount.address}`)
        //console.log(
        //  `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        //)
        //get rarity to use
        const rarityToUse = await queenTraits.getRarityByName("COMMON")
        console.log(
          `Rarity to Use: ${rarityToUse.id} - ${rarityToUse.rarityName}`
        )

        try {
          //call updateRarity
          const updateRarityTx = await queenTraits.updateRarity(
            rarityToUse.id,
            rarityToUse.percentage,
            "COMMON 2"
          )
          await updateRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get rarity updated
        const rarityUpdated = await queenTraits.getRarityByName("COMMON 2")

        console.log(
          `New Rarity name: ${rarityUpdated?.id} - ${rarityUpdated?.rarityName}`
        )

        assert(
          rarityUpdated.rarityName?.replace("0x", "")?.trim(),
          "Rarity name not updated :-("
        )
      })
      it("update rarity name with developer account. should work", async function () {
        //connect with developer account
        queenTraits = await queenTraits.connect(_developerAccount)

        console.log(`Chief Developer Address: ${_developerAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        //get rarity to use
        const rarityToUse = await queenTraits.getRarityByName("COMMON")
        console.log(
          `Rarity to Use: ${rarityToUse.id} - ${rarityToUse.rarityName}`
        )

        try {
          //call updateRarity
          const updateRarityTx = await queenTraits.updateRarity(
            rarityToUse.id,
            rarityToUse.percentage,
            "COMMON 2"
          )
          await updateRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get rarity updated
        const rarityUpdated = await queenTraits.getRarityByName("COMMON 2")

        console.log(
          `New Rarity name: ${rarityUpdated?.id} - ${rarityUpdated?.rarityName}`
        )

        assert(
          rarityUpdated.rarityName?.replace("0x", "")?.trim(),
          "Rarity name not updated :-("
        )
      })
    })
    describe("updateRarity_Malicious", function () {
      it("try to rarity name with malicious account. Should revert", async function () {
        queenTraits = await queenTraits.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        try {
          //call updateRarity
          const updateRarityTx = await queenTraits.updateRarity(
            1,
            85,
            "COMMON 2"
          )
          await updateRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get rarity set
        const raritySet = await queenTraits.getRarityByName("COMMON 2")

        assert(
          !raritySet.rarityName?.replace("0x", "")?.trim(),
          "Malicious updated rarity name :-O"
        )
      })
    })
    describe("updateRarity_Overflow", function () {
      it("try to update a rarity with new percentage that overflows. Should revert", async function () {
        try {
          //call updateRarity
          const updateRarityTx = await queenTraits.updateRarity(1, 90, "COMMON")
          await updateRarityTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get rarity updaterd
        const rarityUpdated = await queenTraits.getRarityByName("COMMON")

        assert(rarityUpdated.percentage.eq(85), "Overflow rarity updated :-(")
      })
    })
  })
  describe("TraitFunctions", function () {
    let queenPalace: QueenPalace
    let queenTraits: QueenTraits
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      const queenTraitsDeploy = await get("QueenTraits")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      queenTraits = await queenTraitsFactory.attach(queenTraitsDeploy.address)
      //allow artists to contract
      let allowTx = await queenPalace.allowArtist(_teamAccounts[0].address)
      await allowTx.wait(1)
      allowTx = await queenPalace.allowArtist(_teamAccounts[1].address)
      await allowTx.wait(1)

      _artistTeam.push(_teamAccounts[0])
      _artistTeam.push(_teamAccounts[1])

      //allow developers to contract
      let allowDevTx = await queenPalace.allowDeveloper(
        _teamAccounts[2].address
      )
      await allowDevTx.wait(1)
      allowDevTx = await queenPalace.allowDeveloper(_teamAccounts[3].address)
      await allowDevTx.wait(1)

      _developerTeam.push(_teamAccounts[2])
      _developerTeam.push(_teamAccounts[3])

      assert(queenPalace, "QueenPalace not deployed :-(")
      assert(queenTraits, "QueenTraits not deployed :-(")
    })
    describe("setNewTrait_OwnerOrArtist", function () {
      it("Set new trait with owner account. should work no problem", async function () {
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("FEET", 1)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("FEET")

        assert(
          traitSet?.traitName?.replace("0x", "")?.trim(),
          "New trait not set :-("
        )
        assert(initialTraitQtty < finalTraitQtty, "Wrong traits count :-(")
      })
      it("Set new trait with chief artist account. should work no problem", async function () {
        //connect with chief artist account
        queenTraits = await queenTraits.connect(_artistAccount)

        console.log(`Chief Artist Address: ${_artistAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("FEET", 1)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("FEET")

        assert(
          traitSet?.traitName?.replace("0x", "")?.trim(),
          "New trait not set :-("
        )
        assert(initialTraitQtty < finalTraitQtty, "Wrong traits count :-(")
      })
      it("Set new trait with allowed artist account. should work no problem", async function () {
        //connect with chief artist account
        queenTraits = await queenTraits.connect(_artistTeam[0])

        console.log(`Allowed Artist Address: ${_artistTeam[0].address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("FEET", 1)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("FEET")

        assert(
          traitSet?.traitName?.replace("0x", "")?.trim(),
          "New trait not set :-("
        )
        assert(initialTraitQtty < finalTraitQtty, "Wrong traits count :-(")
      })
    })
    describe("setNewTrait_malicious", function () {
      it("Set new trait with malicious account. should revert", async function () {
        //connect with malicious account
        queenTraits = await queenTraits.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("FEET", 1)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("FEET")

        assert(
          !traitSet?.traitName?.replace("0x", "")?.trim(),
          "New trait not set :-("
        )
        assert(initialTraitQtty == finalTraitQtty, "Wrong traits count :-(")
      })
    })
    describe("updateTrait_OwnerOrArtist", function () {
      it("Update trait enable status with owner account. should work no problem", async function () {
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("BACKGROUND", 0)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("BACKGROUND")

        assert(traitSet?.enabled == 0, "Trait not disabled :-(")
        assert(initialTraitQtty == finalTraitQtty, "Wrong traits count :-(")
      })
      it("Update trait enabled status with chief artist account. should work no problem", async function () {
        //connect with chief artist account
        queenTraits = await queenTraits.connect(_artistAccount)

        console.log(`Chief Artist Address: ${_artistAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("BACKGROUND", 0)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("BACKGROUND")

        assert(traitSet?.enabled == 0, "Trait not disabled :-(")
        assert(initialTraitQtty == finalTraitQtty, "Wrong traits count :-(")
      })
      it("Update trait enabled status with allowed artist account. should work no problem", async function () {
        //connect with chief artist account
        queenTraits = await queenTraits.connect(_artistTeam[0])

        console.log(`Allowed Artist Address: ${_artistTeam[0].address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("BACKGROUND", 0)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length
        //get trait set
        const traitSet = await queenTraits.getTraitByName("BACKGROUND")

        assert(traitSet?.enabled == 0, "Trait not disabled :-(")
        assert(initialTraitQtty == finalTraitQtty, "Wrong traits count :-(")
      })
    })
    describe("getTraits", function () {
      it("Get traits without care to enalbed status. Qtty of traits before and after querying should be the same", async function () {
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(false)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("BACKGROUND", 0)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(false)).length

        console.log(`Initial Trait Count: ${initialTraitQtty}`)
        console.log(`Final Trait Count: ${finalTraitQtty}`)

        assert(initialTraitQtty == finalTraitQtty, "Wrong traits count :-(")
      })
      it("Get only enabled traits. Qtty of traits queried before should be greater than after", async function () {
        //get initial trait count
        const initialTraitQtty = (await queenTraits.getTraits(true)).length
        //call setTrait
        try {
          const setTraitTx = await queenTraits.setTrait("BACKGROUND", 0)
          await setTraitTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get final trait count
        const finalTraitQtty = (await queenTraits.getTraits(true)).length

        console.log(`Initial Trait Count: ${initialTraitQtty}`)
        console.log(`Final Trait Count: ${finalTraitQtty}`)

        //reactivate trait
        const setTraitTx = await queenTraits.setTrait("BACKGROUND", 1)
        await setTraitTx.wait(1)
        //get final trait count
        const getReactivateTraitQtty = (await queenTraits.getTraits(true))
          .length

        assert(initialTraitQtty > finalTraitQtty, "Wrong traits count :-(")
        assert(
          initialTraitQtty == getReactivateTraitQtty,
          "Did not reactivated trait :-("
        )
      })
    })
  })
  describe("ArtsFunctions", function () {
    let queenPalace: QueenPalace
    let queenTraits: QueenTraits
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      const queenTraitsDeploy = await get("QueenTraits")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      queenTraits = await queenTraitsFactory.attach(queenTraitsDeploy.address)

      _artistTeam = []
      _developerTeam = []

      //allow artists to contract
      let allowTx = await queenPalace.allowArtist(_teamAccounts[0].address)
      await allowTx.wait(1)
      allowTx = await queenPalace.allowArtist(_teamAccounts[1].address)
      await allowTx.wait(1)

      _artistTeam.push(_teamAccounts[0])
      _artistTeam.push(_teamAccounts[1])

      //allow developers to contract
      let allowDevTx = await queenPalace.allowDeveloper(
        _teamAccounts[2].address
      )
      await allowDevTx.wait(1)
      allowDevTx = await queenPalace.allowDeveloper(_teamAccounts[3].address)
      await allowDevTx.wait(1)

      _developerTeam.push(_teamAccounts[2])
      _developerTeam.push(_teamAccounts[3])

      assert(queenPalace, "QueenPalace not deployed :-(")
      assert(queenTraits, "QueenTraits not deployed :-(")
    })
    describe("setArt_OwnerOrArtist", async function () {
      it("Set new art with owner account. should work no problem", async function () {
        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI_2")
        )

        assert(artSet?.uri?.replace("0x", "")?.trim(), "New Art not set :-(")
      })
      it("Set new art with chief Artist account. should work no problem", async function () {
        //connect with chief artist account
        queenTraits = queenTraits.connect(_artistAccount)

        console.log(`Chief Artist Address: ${_artistAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI_2")
        )
        assert(artSet?.uri?.replace("0x", "")?.trim(), "New Art not set :-(")
      })
      it("Set new art with allowed Artist account. should work no problem", async function () {
        //connect with allowed artist account
        queenTraits = queenTraits.connect(_artistTeam[0])

        console.log(`Allowed Artist Address: ${_artistTeam[0].address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        //call set art
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI_2")
        )
        assert(artSet?.uri?.replace("0x", "")?.trim(), "New Art not set :-(")
      })
      it("Set repetead art. Should not insert new art", async function () {
        //call set art
        let setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)

        //get arts count
        const initialArtCount = await queenTraits.getArtCount(1, 1)
        //try to insert repetead art
        setArtTx = await queenTraits.setArt([newArts[0]])
        await setArtTx.wait(1)

        //get arts count
        const finalArtCount = await queenTraits.getArtCount(1, 1)

        console.log(`Initial Art Count: ${initialArtCount}`)
        console.log(`Final Art Count: ${finalArtCount}`)

        assert(initialArtCount.eq(finalArtCount), "Repetead art created :-(")
      })
    })
    describe("setArt_Trait", async function () {
      it("Set new art to enabled trait. should work no problem", async function () {
        //get trait
        const traitToUse = await queenTraits.getTrait(1)
        console.log(`Trait used: ${traitToUse.id} - ${traitToUse.traitName}`)
        const art = [
          {
            traitId: 1,
            rarityId: 1,
            artName: web3.utils.fromAscii("ALGUM_NOME_AQUI"),
            uri: web3.utils.fromAscii("ALGUMA_URL_AQUI"),
          },
        ]
        //call setArt
        try {
          const setArtTx = await queenTraits.setArt(art)
          await setArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI")
        )

        assert(artSet?.uri?.replace("0x", "")?.trim(), "New Art not set :-(")
      })
      it("Set new art to disabled trait. should revert", async function () {
        //get trait
        const traitToUse = await queenTraits.getTrait(1)
        console.log(`Trait used: ${traitToUse.id} - ${traitToUse.traitName}`)
        //disable trait
        const disabledTx = await queenTraits.setTrait(traitToUse.traitName, 0)
        await disabledTx.wait(1)

        console.log(
          `trait disabled! (Enabled: ${
            (await queenTraits.getTrait(1)).enabled
          })`
        )
        const art = [
          {
            traitId: 1,
            rarityId: 1,
            artName: web3.utils.fromAscii("ALGUM_NOME_AQUI"),
            uri: web3.utils.fromAscii("ALGUMA_URL_AQUI"),
          },
        ]

        try {
          //call setArt
          const setArtTx = await queenTraits.setArt(art)
          await setArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI")
        )

        assert(
          !artSet?.uri?.replace("0x", "")?.trim(),
          "New Art set to disabled trait :-("
        )
      })
    })
    describe("setArt_OnOffImplementation", async function () {
      it("Set new art on implementation phase. should work no problem", async function () {
        //check implementation status
        console.log(
          `Contract On Implementation: ${await queenPalace.isOnImplementation()}`
        )

        try {
          const setArtTx = await queenTraits.setArt(newArts)
          await setArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii(web3.utils.toAscii(newArts[0].uri))
        )

        assert(artSet.uri?.replace("0x", "")?.trim(), "New Art not set :-(")
      })
      it("Set new art off implementation phase. should revert", async function () {
        //call setArt
        const endImplementationTx = await queenPalace.implementationEnded()
        await endImplementationTx.wait(1)

        console.log(
          `Contract On Implementation: ${await queenPalace.isOnImplementation()}`
        )

        try {
          const setArtTx = await queenTraits.setArt(newArts)
          await setArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii(newArts[0].uri)
        )

        assert(
          !artSet.uri?.replace("0x", "")?.trim(),
          "New Art set off implementation phase :-O"
        )
      })
    })
    describe("setArt_Malicious", async function () {
      it("Set new art with malicious account. should revert", async function () {
        //call setArt
        queenTraits = queenTraits.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )

        try {
          const setArtTx = await queenTraits.setArt(newArts)
          await setArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI_2")
        )

        assert(
          !artSet.uri?.replace("0x", "")?.trim(),
          "Malicious set new arts :-O"
        )
      })
    })
    describe("removeArt_OwnerOrArtist", async function () {
      it("Remove art with owner account. should work no problem", async function () {
        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)

        const initialArtCount = await queenTraits.getArtCount(1, 1)
        //remove art
        try {
          const removeArtTx = await queenTraits.removeArt(1, 1, newArts[0].uri)
          await removeArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalArtCount = await queenTraits.getArtCount(1, 1)
        //get art set
        const artSet = await queenTraits.getArtByUri(1, 1, newArts[0].uri)

        assert(!artSet?.uri?.replace("0x", "")?.trim(), "Art not removed :-(")
        assert(initialArtCount > finalArtCount, "Wrong art count :-(")
      })
      it("Remove art with chief artist account. should work no problem", async function () {
        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)

        queenTraits = await queenTraits.connect(_artistAccount)
        console.log(`Chief Artist Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        const initialArtCount = await queenTraits.getArtCount(1, 1)
        //remote art
        try {
          const removeArtTx = await queenTraits.removeArt(1, 1, newArts[0].uri)
          await removeArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalArtCount = await queenTraits.getArtCount(1, 1)
        //get art set
        const artSet = await queenTraits.getArtByUri(1, 1, newArts[0].uri)

        assert(!artSet?.uri?.replace("0x", "")?.trim(), "Art not removed :-(")
        assert(initialArtCount > finalArtCount, "Wrong art count :-(")
      })
    })
    describe("removeArt_OnOffImplementation", async function () {
      it("Remove art on implementation phase. should work no problem", async function () {
        console.log(
          `Contract On Implementation: ${await queenPalace.isOnImplementation()}`
        )

        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)

        const initialArtCount = await queenTraits.getArtCount(1, 1)

        //remove art
        try {
          const removeArtTx = await queenTraits.removeArt(1, 1, newArts[0].uri)
          await removeArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalArtCount = await queenTraits.getArtCount(1, 1)
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii(web3.utils.toAscii(newArts[0].uri))
        )

        assert(!artSet?.uri?.replace("0x", "")?.trim(), "Art not removed :-(")
        assert(initialArtCount.gt(finalArtCount), "Wrong art count :-(")
      })
      it("Remove art off implementation phase. should revert", async function () {
        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)

        const initialArtCount = await queenTraits.getArtCount(1, 1)
        //call implementation end
        const endImplementationTx = await queenPalace.implementationEnded()
        await endImplementationTx.wait(1)

        console.log(
          `Contract On Implementation: ${await queenPalace.isOnImplementation()}`
        )

        //remove art
        try {
          const removeArtTx = await queenTraits.removeArt(1, 1, newArts[0].uri)
          await removeArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalArtCount = await queenTraits.getArtCount(1, 1)
        //get art set
        const artSet = await queenTraits.getArtByUri(1, 1, newArts[0].uri)

        assert(
          artSet.uri?.replace("0x", "")?.trim(),
          "Art removed off implementation phase :-O"
        )
        assert(initialArtCount.eq(finalArtCount), "Wrong art count :-(")
      })
    })
    describe("removeArt_Malicious", async function () {
      it("Remove art with owner account. should work no problem", async function () {
        //call setArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)

        const initialArtCount = await queenTraits.getArtCount(1, 1)

        queenTraits = await queenTraits.connect(_maliciousAccount)
        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //remote art
        try {
          const removeArtTx = await queenTraits.removeArt(1, 1, newArts[0].uri)
          await removeArtTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const finalArtCount = await queenTraits.getArtCount(1, 1)
        //get art set
        const artSet = await queenTraits.getArtByUri(1, 1, newArts[0].uri)

        assert(
          artSet?.uri?.replace("0x", "")?.trim(),
          "Art removed by Malicious :-O"
        )
        assert(initialArtCount.eq(finalArtCount), "Wrong art count :-(")
      })
    })
    describe("getArts", function () {
      it("Get art by hash. should work no problem", async function () {
        //call getArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI_2")
        )

        assert(
          artSet?.uri?.replace("0x", "")?.trim(),
          "Could not get existing art :-("
        )
      })
      it("Query for non-existing art. should return empty response", async function () {
        //call getArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get art set
        const artSet = await queenTraits.getArtByUri(
          1,
          1,
          web3.utils.fromAscii("ALGUMA_URL_AQUI_8")
        )

        assert(
          !artSet?.uri?.replace("0x", "")?.trim(),
          "Found non-existing art :-()"
        )
      })
      it("Get All arts. Should return the right list of arts", async function () {
        //call getArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get arts
        const artsCount = await queenTraits.getArtCount(1, 0)

        console.log(`Arts Array Count: ${newArts.length}`)
        console.log(`Arts List Count: ${artsCount}`)

        assert(artsCount.eq(newArts.length), "Wrong arts count :-(")
      })
      it("Get arts by index. Should return the art on 0 index equals to the index 0 of the array sent to contract", async function () {
        //call getArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get arts
        const artIndex0 = await queenTraits.getArt(1, 1, 0)

        assert(artIndex0.uri == newArts[0].uri, "Unsync art index :-(")
      })
      it("Get arts count for specific trait independent of rarity. Should return the sum of all rarities", async function () {
        //call getArt
        const setArtTx = await queenTraits.setArt(newArts)
        await setArtTx.wait(1)
        //get arts
        const artCountAllRarities = await queenTraits.getArtCount(1, 0)
        const artCountCommon = await queenTraits.getArtCount(1, 1)

        assert(artCountAllRarities > artCountCommon, "Wrong qtty :-(")
      })
    })
  })
  describe("DescriptionFuncions", function () {
    let queenPalace: QueenPalace
    let queenTraits: QueenTraits
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      const queenTraitsDeploy = await get("QueenTraits")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      queenTraits = await queenTraitsFactory.attach(queenTraitsDeploy.address)

      _artistTeam = []
      _developerTeam = []

      //allow artists to contract
      let allowTx = await queenPalace.allowArtist(_teamAccounts[0].address)
      await allowTx.wait(1)
      allowTx = await queenPalace.allowArtist(_teamAccounts[1].address)
      await allowTx.wait(1)

      _artistTeam.push(_teamAccounts[0])
      _artistTeam.push(_teamAccounts[1])

      //allow developers to contract
      let allowDevTx = await queenPalace.allowDeveloper(
        _teamAccounts[2].address
      )
      await allowDevTx.wait(1)
      allowDevTx = await queenPalace.allowDeveloper(_teamAccounts[3].address)
      await allowDevTx.wait(1)

      _developerTeam.push(_teamAccounts[2])
      _developerTeam.push(_teamAccounts[3])

      assert(queenPalace, "QueenPalace not deployed :-(")
      assert(queenTraits, "QueenTraits not deployed :-(")
    })
    describe("setDescription_OwnerOrDeveloper", function () {
      it("Set new Description to the list with owner account. Should work no problem.", async function () {
        //get description count
        const initialQtty = await queenTraits.getDescriptionsCount(1)
        //call setArt
        try {
          //call setDescription
          const setDescTx = await queenTraits.setDescription(
            1,
            web3.utils.fromAscii("NEW DESCRIPTION")
          )
          await setDescTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get description count
        const finalQtty = await queenTraits.getDescriptionsCount(1)

        assert(initialQtty.lt(finalQtty), "New description not set :-(")
      })
      it("Set new Description to the list with chief developer account. Should work no problem.", async function () {
        //connect with dev account
        queenTraits = await queenTraits.connect(_developerAccount)

        console.log(`Chief Developer Address: ${_developerAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get description count
        const initialQtty = await queenTraits.getDescriptionsCount(1)

        try {
          //call setDescription
          const setDescTx = await queenTraits.setDescription(
            1,
            web3.utils.fromAscii("NEW DESCRIPTION")
          )
          await setDescTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get description count
        const finalQtty = await queenTraits.getDescriptionsCount(1)

        assert(initialQtty.lt(finalQtty), "New description not set :-(")
      })
      it("Set new Description to the list with allowed developer account. Should work no problem.", async function () {
        //connect with dev account
        queenTraits = await queenTraits.connect(_developerTeam[0])

        console.log(`Allowed Developer Address: ${_developerTeam[0].address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get description count
        const initialQtty = await queenTraits.getDescriptionsCount(1)

        try {
          //call setDescription
          const setDescTx = await queenTraits.setDescription(
            1,
            web3.utils.fromAscii("NEW DESCRIPTION")
          )
          await setDescTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get description count
        const finalQtty = await queenTraits.getDescriptionsCount(1)

        assert(initialQtty.lt(finalQtty), "New description not set :-(")
      })
      it("Set repetead Description. Should revert.", async function () {
        //get description count
        const initialQtty = await queenTraits.getDescriptionsCount(0)

        try {
          //call setDescription
          const setDescTx = await queenTraits.setDescription(
            0,
            commonDescriptions()[0]
          )
          await setDescTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get description count
        const finalQtty = await queenTraits.getDescriptionsCount(0)

        console.log(`Initial Desc Count: ${initialQtty}`)
        console.log(`Final Desc Count: ${finalQtty}`)

        assert(initialQtty.eq(finalQtty), "Repeated description set :-(")
      })
    })
    describe("setDescription_Malicious", function () {
      it("Set new Description to the list with malicious account. Should revert.", async function () {
        //connect with dev account
        queenTraits = await queenTraits.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenTraits.signer.getAddress()}`
        )
        //get description count
        const initialQtty = await queenTraits.getDescriptionsCount(0)

        try {
          //call setDescription
          const setDescTx = await queenTraits.setDescription(
            0,
            web3.utils.fromAscii("NEW DESCRIPTION")
          )
          await setDescTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get description count
        const finalQtty = await queenTraits.getDescriptionsCount(0)

        assert(initialQtty.eq(finalQtty), "Malicious set new description :-O")
      })
    })
    describe("setDescription_OwnerOrDeveloper", function () {
      it("Set new Description to the list with owner account. Should work no problem.", async function () {
        //get description count
        const initialQtty = await queenTraits.getDescriptionsCount(1)
        //call setArt
        try {
          //call setDescription
          const setDescTx = await queenTraits.setDescription(
            1,
            web3.utils.fromAscii("NEW DESCRIPTION")
          )
          await setDescTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //get description count
        const finalQtty = await queenTraits.getDescriptionsCount(1)

        assert(initialQtty.lt(finalQtty), "New description not set :-(")
      })
      it("Get Description by index. Should match written list order.", async function () {
        let description: any
        try {
          //call setDescription
          description = await queenTraits.getDescriptionByIdx(0, 0)
        } catch (err: any) {
          console.error(err.message)
        }

        assert(
          description == commonDescriptions()[0],
          "New description not set :-("
        )
      })
    })
  })
})

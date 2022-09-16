import { assert, expect } from "chai"
import deployRoyalInfraStructure from "../deploy/01-deploy-RoyalInfraStructure"
import { getAccount, getAddress } from "../scripts/utils"
import { QueenPalace, QueenPalace__factory } from "../typechain-types/index"
const hre = require("hardhat")
describe("QueenPalace", function () {
  const { deployments, ethers } = require("hardhat")
  const { get } = deployments
  let queenPalaceFactory: QueenPalace__factory

  //let contractBundle: ContractBundle
  let _artistAccount: any
  let _developerAccount: any
  let _royalMuseumAddress: string
  let _ownerAccount: any
  let _maliciousAccount: any
  let _teamAccounts: any[]
  let _artistTeam: any[] = []
  let _developerTeam: any[] = []

  beforeEach(async function () {
    _artistAccount = await getAccount("artist")
    _developerAccount = await getAccount("developer")
    _royalMuseumAddress = await getAddress("owner") //process.env.SAFE_WALLET

    _ownerAccount = await getAccount("owner")
    _maliciousAccount = await getAccount("malicious")
    _teamAccounts = await getAccount("minters", 4)
    _artistTeam = []
    _developerTeam = []

    queenPalaceFactory = await ethers.getContractFactory("QueenPalace")
    await deployRoyalInfraStructure(hre)
  })
  describe("DeployQueenPalace", function () {
    it("Should finish with a fully deployed QueenPalace contract", async function () {
      const queenPalace = await get("QueenPalace")

      assert(queenPalace, "QueenPalace not deployed :-(")
    })
  })
  describe("ArtistFunctions", function () {
    let queenPalace: QueenPalace
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      assert(queenPalace, "QueenPalace not deployed :-(")
    })
    describe("setArtist_InvalidAddress", async function () {
      it("Should revert if try to set artist with a contract address (invalid address)", async function () {
        try {
          const setArtistTx = await queenPalace.setArtist(queenPalace.address)
          await setArtistTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //chekc if artist was set in contract
        const artist = await queenPalace.artist()

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(artist != queenPalace.address, "Invalid artist address set :-(")
      })
    })
    describe("setArtist_Owner", async function () {
      it("Should update artist on contract no problem", async function () {
        try {
          const setArtistTx = await queenPalace.setArtist(
            _developerAccount.address
          )
          await setArtistTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //chekc if artist was set in contract
        const artist = await queenPalace.artist()

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(artist == _developerAccount.address, "New artist not set :-(")
      })
    })
    describe("setArtist_Malicious", async function () {
      it("Should revert if malicious wallet tries to set artist", async function () {
        queenPalace = await queenPalace.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        try {
          const setArtistTx = await queenPalace.setArtist(
            _maliciousAccount.address
          )
          await setArtistTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //chekc if artist was set in contract
        const artist = await queenPalace.artist()

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(
          artist != _maliciousAccount.address,
          "Artist address set by malicious :-0"
        )
      })
    })
    describe("allowArtist_ArtistOrOwner", async function () {
      it("Should allow address as artist no problem", async function () {
        const chiefArtist = await getAccount("artist")
        queenPalace = await queenPalace.connect(chiefArtist)

        console.log(`Chief Artist Address: ${chiefArtist.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        try {
          const allowArtistTx = await queenPalace.allowArtist(
            _developerAccount.address
          )
          await allowArtistTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //check if artist was allowed in contract
        const isArtist = await queenPalace.isArtist(_developerAccount.address)

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(isArtist, "Artist now allowed :-(")
      })
    })
    describe("allowArtist_Malicious", async function () {
      it("Should revert if malicious wallet tries to allow artist", async function () {
        const malicious = await getAccount("malicious")
        queenPalace = await queenPalace.connect(malicious)

        console.log(`Malicious Address: ${malicious.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        try {
          const setArtistTx = await queenPalace.allowArtist(malicious.address)
          await setArtistTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //check if artist was allowed in contract
        const isArtist = await queenPalace.isArtist(malicious.address)

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(
          !isArtist,
          "Malicious got his address on artist allowance!!! :-0"
        )
      })
    })
  })
  describe("DeveloperFunctions", function () {
    let queenPalace: QueenPalace
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

      assert(queenPalace, "QueenPalace not deployed :-(")
    })
    describe("setDeveloper_Owner", async function () {
      it("Should update chief developer on contract no problem", async function () {
        try {
          const setDeveloperTx = await queenPalace.setDeveloper(
            _artistAccount.address
          )
          await setDeveloperTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //check if developer was set in contract
        const developer = await queenPalace.developer()

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(
          developer == _artistAccount.address,
          "New chief developer not set :-("
        )
      })
    })
    describe("setDeveloper_Malicious", async function () {
      it("Should revert if malicious wallet tries to set chief developer", async function () {
        const malicious = await getAccount("malicious")
        queenPalace = await queenPalace.connect(malicious)

        console.log(`Malicious Address: ${malicious.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        try {
          const setDeveloperTx = await queenPalace.setDeveloper(
            malicious.address
          )
          await setDeveloperTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        //check if developer was set in contract
        const developer = await queenPalace.developer()

        assert(queenPalace, "QueenPalace not deployed :-(")
        assert(
          developer != malicious.address,
          "Developer address set by malicious :-0"
        )
      })
      describe("allowDeveloper_DeveloperOrOwner", async function () {
        it("Should allow address as artist no problem", async function () {
          const chiefDeveloper = await getAccount("developer")
          queenPalace = await queenPalace.connect(chiefDeveloper)

          console.log(`Chief Developer Address: ${chiefDeveloper.address}`)
          console.log(
            `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
          )
          try {
            const allowDeveloperTx = await queenPalace.allowDeveloper(
              _artistAccount.address
            )
            await allowDeveloperTx.wait(1)
          } catch (err: any) {
            console.error(err.message)
          }
          //check if developer was allowed in contract
          const isDeveloper = await queenPalace.isDeveloper(
            _artistAccount.address
          )

          assert(queenPalace, "QueenPalace not deployed :-(")
          assert(isDeveloper, "Developer now allowed :-(")
        })
      })
      describe("allowDeveloper_Malicious", async function () {
        it("Should revert if malicious wallet tries to allow developer", async function () {
          const malicious = await getAccount("malicious")
          queenPalace = await queenPalace.connect(malicious)

          console.log(`Malicious Address: ${malicious.address}`)
          console.log(
            `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
          )
          try {
            const allowDeveloperTx = await queenPalace.allowDeveloper(
              malicious.address
            )
            await allowDeveloperTx.wait(1)
          } catch (err: any) {
            console.error(err.message)
          }
          //check if artist was allowed in contract
          const isDeveloper = await queenPalace.isDeveloper(malicious.address)

          assert(queenPalace, "QueenPalace not deployed :-(")
          assert(
            !isDeveloper,
            "Malicious got his address on developer allowance!!! :-0"
          )
        })
      })
    })
  })
  describe("WhiteListFunctions", function () {
    let queenPalace: QueenPalace
    beforeEach(async function () {
      const queenPalaceDeploy = await get("QueenPalace")
      queenPalace = await queenPalaceFactory.attach(queenPalaceDeploy.address)

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
    })
    describe("whiteListAddress_OwnerOrDeveloper", function () {
      it("WhiteList Address with owner account. Should work no problem", async function () {
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(isWhiteListed, "Address not WhiteListed :-(")
      })
      it("WhiteList Address with chief developer account. Should work no problem", async function () {
        //connect with dev account
        queenPalace = await queenPalace.connect(_developerAccount)

        console.log(`Chief Developer Address: ${_developerAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(isWhiteListed, "Address not WhiteListed :-(")
      })
      it("WhiteList Address with allowed developer account. Should work no problem", async function () {
        //connect with dev account
        queenPalace = await queenPalace.connect(_developerTeam[0])

        console.log(`Allowed Developer Address: ${_developerTeam[0].address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(isWhiteListed, "Address not WhiteListed :-(")
      })
    })
    describe("whiteListAddress_Malicious", function () {
      it("WhiteList Address with allowed developer account. Should work no problem", async function () {
        //connect with dev account
        queenPalace = await queenPalace.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(!isWhiteListed, "Malicious Whitelisted address :-O")
      })
    })
    describe("clearWhiteListed_OwnerOrDeveloper", function () {
      it("Clear WhiteList with owner account. Should work no problem", async function () {
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const wasWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        try {
          const clearWhiteListTx = await queenPalace.clearWhiteList()
          await clearWhiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(wasWhiteListed, "Address not WhiteListed :-(")
        assert(!isWhiteListed, "WhiteList not cleared :-(")
      })
      it("Clear WhiteList with chief developer account. Should work no problem", async function () {
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const wasWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        //connect with dev account
        queenPalace = await queenPalace.connect(_developerAccount)

        console.log(`Chief Developer Address: ${_developerAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )

        try {
          const clearWhiteListTx = await queenPalace.clearWhiteList()
          await clearWhiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(wasWhiteListed, "Address not WhiteListed :-(")
        assert(!isWhiteListed, "WhiteList not cleared :-(")
      })
      it("Clear WhiteList with allowed developer account. Should work no problem", async function () {
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const wasWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        //connect with dev account
        queenPalace = await queenPalace.connect(_developerTeam[0])

        console.log(`Chief Developer Address: ${_developerTeam[0].address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )

        try {
          const clearWhiteListTx = await queenPalace.clearWhiteList()
          await clearWhiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(wasWhiteListed, "Address not WhiteListed :-(")
        assert(!isWhiteListed, "WhiteList not cleared :-(")
      })
    })
    describe("clearWhiteListed_Malicious", function () {
      it("Clear WhiteList with malicious account. Should revert", async function () {
        //get account to whitelist
        const addressToWhiteList = await getAddress("minters", 1)

        try {
          console.log(`Address To Whitelist: ${addressToWhiteList}`)

          const whiteListTx = await queenPalace.whiteListAddress(
            addressToWhiteList
          )
          await whiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }

        const wasWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )
        //connect with dev account
        queenPalace = await queenPalace.connect(_maliciousAccount)

        console.log(`Malicious Address: ${_maliciousAccount.address}`)
        console.log(
          `Current Contract Object Signer: ${await queenPalace.signer.getAddress()}`
        )

        try {
          const clearWhiteListTx = await queenPalace.clearWhiteList()
          await clearWhiteListTx.wait(1)
        } catch (err: any) {
          console.error(err.message)
        }
        const isWhiteListed = await queenPalace.whiteListContains(
          addressToWhiteList[0]
        )

        assert(wasWhiteListed, "Address not WhiteListed :-(")
        assert(isWhiteListed, "Malicious cleared Whitelist :-(")
      })
    })
  })
})

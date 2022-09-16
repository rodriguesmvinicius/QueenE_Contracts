# QueenE Contracts

<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

![LICENSE](https://img.shields.io/github/license/rodriguesmvinicius/QueenE_Contracts?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/rodriguesmvinicius/QueenE_Contracts?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/rodriguesmvinicius/QueenE_Contracts?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/rodriguesmvinicius/QueenE_Contracts?style=for-the-badge)
![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FQueenEDAO?style=for-the-badge)

<img src="https://queene.wtf/images/banner.png" alt="Project Banner">

> "Nouns" inspired project with a pioneer link with real world events. In this case, one portrait of "QueenE", a Queen Elizabeth's inspired character, is auctioned every day until he pass away.
> Another innovation to the project is the NFT rarity, not common in "Nouns Like" projects and, most importantly, the owner voting weight variation by rarity on top o token balance. 

## 💻 Prerequisites

Before you start, make sure you have installed in your machine:
* Newest version of `NodeJS`
* Newest version of `Yarn`.

After the above softwares are installed, run the following command in the project's root folder:
```
yarn
```
This will install all dependencies for the project

## 🚀 Deploying QueenE Ecosystem

To deploy the QueenE's full ecosystem, just use the hardhat's deploy tool, running the following command in the project's root folder:
```
yarn hardhat deploy
```
The deploy scripts are split in 4 parts:

1. `01-deploy-RoyalInfraStructure`: This script deploy the following contracts:
  a. `QueenPalace.sol`: QueenPalace contract acts as a Master contract where the latest deployed contracts adresses are stored and all wallets allowed to interact with the contracts functions too.
  b. `RoyalTower.sol`: RoyalTower contract is the contract that receives the funds from auctions. This treasure is governed by the DAO and only DAO's executor can withdrawn from it.
  c. `QueenLab.sol`: RoyalTower is the contract responsible to generate the new QueenE dna and blue-blood. The blue-blood is what defines the final art of the QueenE.
2. `02-deploy-Royalty`: This script deploy the following contract:
  a. `QueenE.sol`: QueenE os the ERC721 contract of QueenE.
3. `03-deploy-RoyalStorage`: This script deploy the following contract:
  a. `QueenTraits.sol`: QueenTraits is the contract where all arts are stored as IPFS hash. It serves as a database of traits, and traits arts with rarity. QueenLab fishes from this contract to produce the blue-blood
4. `04-deploy-RoyalAuctionHouse`: This script deploy the following contracts:
  a. `QueenAuctionHouse.sol`: Logic implementation of the Auction House contract. In the Auction House contract is located the `SettleAuction` function, responsible for finish the current auction, send the NFT to the winner, the winner bid value to the RoyalTower and mint a new QueenE for the next auction.
     The contract initializes paused and the owner must unpause it, always through the proxy, to start the first Auction with the first minted QueenE.
     The Auction House can only be started after the end of implementation phase, that can be ended by the owner calling `implementationEnded()` function at the `QueenPalace` contract.
     ATTENTION: All critical functions can only be execute by DAO Executor after the implementation end.
  b. `QueenAuctionHouseProxyAdmin.sol`: Proxy Admin contract responsible to manage any upgrade maneuvers.      
  c. `QueenAuctionHouseProxy.sol`: Proxy contract used to interact with the implementation. The structue is created in a way that only the DAO can execute an upgrade after the implementation phase.                  
5. `05-deploy-RoyalDAO`: This script deploy the following contracts:
  a. `RoyalExecutor.sol`: Timelock contract. All approved proposal must be queued in the timelock contract and, after the execution delay, executed. All function that can only be executed by proposal approval must check this address, that is subscribed on `QueenPalace` contract.
  b. `RoyalGovernor.sol`: The Governor contract. Handles all proposals, voting and executions.

## 🤖 Testing QueenE Ecosystem

This repo have only 3 test scripts that cover the infrastructure part of the ecosystem.

To run the tests just use the command: 

```
yarn hardhat test
```

All test scripts can be found at the `/test` folder.

You can call specific tests using the `--grep` tag followed by the DeployQueenPalace text.

Example:
```
yarn hardhat test --grep setArtist_InvalidAddress
```
## 🤝 Council of founders

This project was conceived by 4 crazy people working in different areas, bu that fell in love with web3.

<table>
  <tr>
    <td align="center">
      <a href="https://twitter.com/Vinicius_Rod" target="_blank">
        <img src="https://github.com/rodriguesmvinicius/QueenE_Contracts/blob/HEAD/assets/sirZorke.png" width="200px;" alt="QueenE of Sir sir.zorke.eth"/>
        <br>
        <sub>
          <b>Sir.Zorke.eth</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://twitter.com/Mladendra" target="_blank">
        <img src="https://github.com/rodriguesmvinicius/QueenE_Contracts/blob/HEAD/assets/sirMladendra.png" width="200px;" alt="QueenE of Sir Mladen.eth"/>
        <br>
        <sub>
          <b>Sir Mladen.eth</b>
        </sub>
      </a>
    </td>    
    <td align="center">
      <a href="https://twitter.com/ToNMaTsumoto" target="_blank">
        <img src="https://github.com/rodriguesmvinicius/QueenE_Contracts/blob/HEAD/assets/sirTonmat.png" width="200px;" alt="QueenE of Sir tonmat.eth"/>
        <br>
        <sub>
          <b>Sir Tonmat.eth</b>
        </sub>
      </a>
    </td>    
    <td align="center">
      <a href="https://twitter.com/fabioseva" target="_blank">
        <img src="https://github.com/rodriguesmvinicius/QueenE_Contracts/blob/HEAD/assets/sirFabioSeva.png" width="200px;" alt="QueenE of Sir Fabio Seva"/>
        <br>
        <sub>
          <b>Sir Fabio Seva</b>
        </sub>
      </a>
    </td>      
  </tr>
</table>


## 📝 License
This project is under MIT license. See the file [LICENSE](LICENSE.md) for more details.

<table>
  <tr>
    <td align="center">
      <a href="https://queene.wtf" target="_blank">
        <img src="https://github.com/rodriguesmvinicius/QueenE_Contracts/blob/HEAD/assets/queeneWTF.png" width="100px;" alt="Get your QueenE"/>
        <br>
        <sub>
          <b>Get your QueenE at queene.wtf</b>
        </sub>
      </a>
    </td>      
  </tr>
</table>

[⬆ Back to the top](#queenE-contracts)<br>
// SPDX-License-Identifier: MIT

/// @title A base contract with implementation control

/************************************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░██░░░░░░░░░░░░████░░░░░░░░░░░░██░░░░░░░ *
 * ░░░░░████░░░░░░░░░░██░░██░░░░░░░░░░████░░░░░░ *
 * ░░░░██████░░░░░░░░██░░░░██░░░░░░░░██████░░░░░ *
 * ░░░███░░███░░░░░░████░░████░░░░░░███░░███░░░░ *
 * ░░██████████░░░░████████████░░░░██████████░░░ *
 * ░░████░░█████████████░░█████████████░░████░░░ *
 * ░░███░░░░███████████░░░░███████████░░░░███░░░ *
 * ░░████░░█████████████░░█████████████░░████░░░ *
 * ░░████████████████████████████████████████░░░ *
 *************************************************/

pragma solidity ^0.8.9;

//import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {ERC165Storage} from "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

import {RoyalLibrary} from "../lib/RoyalLibrary.sol";
import {IBaseContractController} from "../../interfaces/IBaseContractController.sol";
import {IQueenPalace} from "../../interfaces/IQueenPalace.sol";

contract BaseContractController is
    ERC165Storage,
    IBaseContractController,
    Pausable,
    ReentrancyGuard,
    Ownable
{
    IQueenPalace internal queenPalace;

    /************************** vCONTROLLER REGION *************************************************** */

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function pause() external virtual onlyOwner whenNotPaused {
        _pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() external virtual onlyOwner whenPaused {
        _unpause();
    }

    /**
     *IN
     *_queenPalace: address of queen palace contract
     *OUT
     */
    function setQueenPalace(IQueenPalace _queenPalace)
        external
        nonReentrant
        whenPaused
        onlyOwnerOrDAO
        onlyOnImplementationOrDAO
    {
        _setQueenPalace(_queenPalace);
    }

    /**
     *IN
     *_queenPalace: address of queen palace contract
     *OUT
     */
    function _setQueenPalace(IQueenPalace _queenPalace) internal {
        queenPalace = _queenPalace;
    }

    /************************** ^vCONTROLLER REGION *************************************************** */

    /************************** vMODIFIERS REGION ***************************************************** */

    modifier onlyDAO() {
        isDAO();
        _;
    }
    modifier onlyChiefArtist() {
        isChiefArtist();
        _;
    }
    modifier onlyArtist() {
        isArtist();
        _;
    }

    modifier onlyChiefDeveloper() {
        isChiefDeveloper();
        _;
    }

    modifier onlyDeveloper() {
        isDeveloper();
        _;
    }

    modifier onlyMinter() {
        isMinter();
        _;
    }

    modifier onlyActor() {
        isActor();
        _;
    }

    modifier onlyActorOrDAO() {
        isActorOrDAO();
        _;
    }

    modifier onlyOwnerOrChiefArtist() {
        isOwnerOrChiefArtist();
        _;
    }

    modifier onlyOwnerOrArtist() {
        isOwnerOrArtist();
        _;
    }

    modifier onlyOwnerOrChiefDeveloper() {
        isOwnerOrChiefDeveloper();
        _;
    }

    modifier onlyOwnerOrDeveloper() {
        isOwnerOrDeveloper();
        _;
    }
    modifier onlyOwnerOrChiefDeveloperOrDAO() {
        isOwnerOrChiefDeveloperOrDAO();
        _;
    }

    modifier onlyOwnerOrDeveloperOrDAO() {
        isOwnerOrDeveloperOrDAO();
        _;
    }

    modifier onlyOwnerOrChiefArtistOrDAO() {
        isOwnerOrChiefArtistOrDAO();
        _;
    }

    modifier onlyOwnerOrArtistOrDAO() {
        isOwnerOrArtistOrDAO();
        _;
    }
    modifier onlyOwnerOrDAO() {
        isOwnerOrDAO();
        _;
    }

    modifier onlyOwnerOrMinter() {
        isOwnerOrMinter();
        _;
    }

    modifier onlyOwnerOrAuctionHouse() {
        isOwnerOrAuctionHouse();
        _;
    }

    modifier onlyOwnerOrAuctionHouseProxy() {
        isOwnerOrAuctionHouseProxy();
        _;
    }

    modifier onlyOwnerOrQueenPalace() {
        isOwnerOrQueenPalace();
        _;
    }

    modifier onlyOnImplementation() {
        isOnImplementation();
        _;
    }

    modifier onlyOnImplementationOrDAO() {
        isOnImplementationOrDAO();
        _;
    }

    modifier onlyOnImplementationOrPaused() {
        isOnImplementationOrPaused();
        _;
    }

    /************************** ^MODIFIERS REGION ***************************************************** */

    /**
     *IN
     *OUT
     *if given address is owner
     */
    function isOwner(address _address) external view override returns (bool) {
        return owner() == _address;
    }

    function isOwnerOrChiefArtistOrDAO() internal view {
        require(
            msg.sender == owner() ||
                msg.sender == queenPalace.artist() ||
                msg.sender == queenPalace.daoExecutor(),
            "Not Owner, Artist, DAO"
        );
    }

    function isChiefArtist() internal view {
        require(msg.sender == queenPalace.artist(), "Not Chief Artist");
    }

    function isArtist() internal view {
        require(queenPalace.isArtist(msg.sender), "Not Artist");
    }

    function isChiefDeveloper() internal view {
        require(msg.sender == queenPalace.developer(), "Not Chief Dev");
    }

    function isDeveloper() internal view {
        require(queenPalace.isDeveloper(msg.sender), "Not Dev");
    }

    function isMinter() internal view {
        require(msg.sender == queenPalace.minter(), "Not Minter");
    }

    function isActor() internal view {
        require(
            msg.sender == owner() ||
                queenPalace.isArtist(msg.sender) ||
                queenPalace.isDeveloper(msg.sender),
            "Invalid Actor"
        );
    }

    function isActorOrDAO() internal view {
        require(
            msg.sender == owner() ||
                queenPalace.isArtist(msg.sender) ||
                queenPalace.isDeveloper(msg.sender) ||
                msg.sender == queenPalace.daoExecutor(),
            "Invalid Actor, DAO"
        );
    }

    function isOwnerOrChiefArtist() internal view {
        require(
            msg.sender == owner() || msg.sender == queenPalace.artist(),
            "Not Owner, Chief Artist"
        );
    }

    function isOwnerOrArtist() internal view {
        require(
            msg.sender == owner() || queenPalace.isArtist(msg.sender),
            "Not Owner, Artist"
        );
    }

    function isOwnerOrChiefDeveloper() internal view {
        require(
            msg.sender == owner() || msg.sender == queenPalace.developer(),
            "Not Owner, Chief Developer"
        );
    }

    function isOwnerOrDeveloper() internal view {
        require(
            msg.sender == owner() || queenPalace.isDeveloper(msg.sender),
            "Not Owner, Developer"
        );
    }

    function isOwnerOrChiefDeveloperOrDAO() internal view {
        require(
            msg.sender == owner() ||
                msg.sender == queenPalace.developer() ||
                msg.sender == queenPalace.daoExecutor(),
            "Not Owner, Chief Developer, DAO"
        );
    }

    function isOwnerOrDeveloperOrDAO() internal view {
        require(
            msg.sender == owner() ||
                queenPalace.isDeveloper(msg.sender) ||
                msg.sender == queenPalace.daoExecutor(),
            "Not Owner, Developer, DAO"
        );
    }

    function isOwnerOrArtistOrDAO() internal view {
        require(
            msg.sender == owner() ||
                queenPalace.isArtist(msg.sender) ||
                msg.sender == queenPalace.daoExecutor(),
            "Not Owner, Artist, DAO"
        );
    }

    function isOwnerOrDAO() internal view {
        require(
            msg.sender == owner() || msg.sender == queenPalace.daoExecutor(),
            "Not Owner, DAO"
        );
    }

    function isDAO() internal view {
        require(msg.sender == queenPalace.daoExecutor(), "Not DAO");
    }

    function isOwnerOrMinter() internal view {
        require(
            msg.sender == owner() || msg.sender == queenPalace.minter(),
            "Not Owner, Minter"
        );
    }

    function isOwnerOrAuctionHouse() internal view {
        require(
            msg.sender == owner() ||
                msg.sender == address(queenPalace.QueenAuctionHouse()),
            "Not Owner, Auction House"
        );
    }

    function isOwnerOrAuctionHouseProxy() internal view {
        require(
            msg.sender == owner() ||
                msg.sender == address(queenPalace.QueenAuctionHouseProxyAddr()),
            "Not Owner, Auction House"
        );
    }

    function isOwnerOrQueenPalace() internal view {
        require(
            msg.sender == owner() || msg.sender == address(queenPalace),
            "Not Owner,Queen Palace"
        );
    }

    function isOnImplementation() internal view {
        require(queenPalace.isOnImplementation(), "Not On Implementation");
    }

    function isOnImplementationOrDAO() internal view {
        require(
            queenPalace.isOnImplementation() ||
                msg.sender == queenPalace.daoExecutor(),
            "Not On Implementation sender not DAO"
        );
    }

    function isOnImplementationOrPaused() internal view {
        require(
            queenPalace.isOnImplementation() || paused(),
            "Not On Implementation,Paused"
        );
    }
}

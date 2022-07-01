//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

error Lottery__Failed();

contract Lottery is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint256 public constant MINAMOUNT = 0.1 ether;
    mapping(address => uint256) public playerToAmount;
    address public manager;
    address payable[] public players;
    uint256 public immutable i_subscriptionid;
    bytes32 private immutable i_keyhash;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callBackGasLimit;

    address private s_recentWinner;

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1; // cos we only want one random number

    // EVENTS
    event EnterLottery(address indexed player);
    event RequestRandomWinner(uint256 indexed requestId);
    event Winners(address indexed winner);

    modifier onlyOwner() {
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    constructor(
        address vrfCoordinatorV2,
        bytes32 keyhash,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        manager = msg.sender;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionid = subscriptionId;
        i_keyhash = keyhash;
        i_subscriptionId = subscriptionId;
        i_callBackGasLimit = callbackGasLimit;
    }

    function startLottery() public payable {
        require(msg.value == MINAMOUNT, "You need more ETH");
        playerToAmount[msg.sender] += msg.value;
        players.push(payable(msg.sender));
        emit EnterLottery(msg.sender);
    }

    // request ranadom number
    function requestRandomWords() external onlyOwner {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyhash,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callBackGasLimit,
            NUM_WORDS
        );
        emit RequestRandomWinner(requestId);
    }

    // return random number
    function fulfillRandomWords(
        uint256,
        /* requestId */
        uint256[] memory randomWords
    ) internal override {
        uint256 indexedWinner = randomWords[0] % players.length; // get the modular number
        address payable winner = players[indexedWinner];
        s_recentWinner = winner;
        emit Winners(winner);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = s_recentWinner.call{value: address(this).balance}(
            ""
        );
        // gas efficient, substitute for require validation
        if (!success) {
            revert Lottery__Failed();
        }
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getMinAmount() public pure returns (uint256) {
        return MINAMOUNT;
    }

    function getPlayer(uint64 _index) public view returns (address) {
        return players[_index];
    }

    receive() external payable {
        startLottery();
    }

    fallback() external payable {
        startLottery();
    }
}

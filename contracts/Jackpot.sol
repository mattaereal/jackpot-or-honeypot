// SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity 0.8.17;

contract Jackpot {
    address private jackpotProxy;

    constructor(address _jackpotProxy) payable {
        jackpotProxy = _jackpotProxy;
    }

    modifier onlyJackpotProxy {
        require(msg.sender == jackpotProxy);
        _;
    }

    function claimPrize(uint amount) external payable onlyJackpotProxy {
        console.log("\t called Jackpot.claimPrize(%s)", amount);
        payable(msg.sender).transfer(amount * 2);
    }

    fallback() payable external {
        console.log("\t called fallback() with msg.value: %s", msg.value);
    }
}

contract JackpotProxy {

    function claimPrize(address jackpot) external payable {
        console.log("\t called JackpotProxy.claimPrize(%s)", jackpot);
        uint amount = msg.value;
        require(amount > 0, "zero deposit");
        console.log("\t trying to call jackpot.claimPrize(uint) with msg.value: %s", amount );
        (bool success, ) = jackpot.call{value: amount}(abi.encodeWithSignature("claimPrize(uint)", amount));
        require(success, "failed");
        payable(msg.sender).transfer(address(this).balance);
    }

    function claimPrize256(address jackpot) external payable {
        console.log("\t called JackpotProxy.safe_claimPrize(%s)", jackpot);
        uint amount = msg.value;
        require(amount > 0, "zero deposit");
        console.log("\t trying to call jackpot.claimPrize(uint256) with msg.value: %s", amount );
        (bool success, ) = jackpot.call{value: amount}(abi.encodeWithSignature("claimPrize(uint256)", amount));
        require(success, "failed");
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() payable external {}

}
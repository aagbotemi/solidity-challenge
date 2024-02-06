// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/utils/Create2.sol";

contract SmartAccount is IAccount {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256)
    external view returns (uint256 validationData) {
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
        return owner == recovered ? 0 : 1;
    }

    function withdraw(address payable recipient, uint256 amount) external {
        require(recipient != address(0), "Invalid recipient address");
        require(amount <= address(this).balance, "Insufficient smart account balance");

        recipient.transfer(amount);
    }

    function getAccBalance() external view returns (uint256) {
        return address(this).balance;
    }
}


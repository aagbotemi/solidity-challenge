// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract StorageVictim {
    address public owner;

    struct Storage {
        address user;
        uint amount;
    }

    mapping(address => Storage) storages;

    constructor() {
        owner = msg.sender;
    }

    function store(uint _amount) public {
        Storage memory str = Storage(msg.sender, _amount);

        storages[msg.sender] = str;
    }

    function getStore() public view returns (address, uint) {
        Storage memory str = storages[msg.sender];

        return (str.user, str.amount);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/StorageVictim.sol";

contract StorageVictimTest is Test {
    StorageVictim public storageVictim;

    function setUp() public {
        storageVictim = new StorageVictim();
    }

    function testStoreAndGet() public {
        // Test storing and retrieving values
        uint amount = 100;
        storageVictim.store(amount);

        (address storedUser, uint storedAmount) = storageVictim.getStore();

        assertEq(storedUser, address(this));
        assertEq(storedAmount, amount);
    }

    function testGetOwner() public {
        // Test getting the owner of the contract
        address contractOwner = storageVictim.getOwner();

        assertEq(contractOwner, address(this));
    }

    function testEmptyStorage() public {
        // Test retrieving values when storage is empty
        (address storedUser, uint storedAmount) = storageVictim.getStore();

        assertEq(storedUser, address(0));
        assertEq(storedAmount, 0);
    }
}

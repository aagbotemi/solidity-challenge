// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VestryToken is ERC20 {
    address owner;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        address minter = msg.sender;
        owner = minter;
        _mint(minter, 2000000e18);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "no permission!");
        _;
    }

    function transferFromContract(
        address _to,
        uint256 amount
    ) external onlyOwner {
        uint bal = balanceOf(address(this));
        // require(bal >= amount, "You are transferring more than the amount available!");
        assert(bal >= amount);
        _transfer(address(this), _to, amount);
    }

    function mint(address _beneficiary, uint _amount) external onlyOwner {
        _mint(_beneficiary, _amount);
    }
}

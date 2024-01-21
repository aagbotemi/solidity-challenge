// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoWalletInsurance {
    address public owner;
    uint256 public premiumAmount;
    uint256 public coverageAmount;
    uint256 public lastPaymentTimestamp;
    bool public isClaimed;

    constructor(
        uint256 _premiumAmount,
        uint256 _coverageAmount,
        address _owner
    ) {
        owner = _owner;
        premiumAmount = _premiumAmount;
        coverageAmount = _coverageAmount;
        lastPaymentTimestamp = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function payPremium() external payable onlyOwner {
        require(msg.value == premiumAmount, "Incorrect premium amount");
        lastPaymentTimestamp = block.timestamp;
    }

    function claimInsurance() external onlyOwner {
        require(
            block.timestamp - lastPaymentTimestamp >= 30 days,
            "Premium not paid for a month"
        );
        // Perform additional checks if needed
        require(!isClaimed, "Insurance already claimed");

        // and disbursing the coverage amount if applicable
        isClaimed = true;
        // Transfer coverage amount to the owner
        payable(owner).transfer(coverageAmount);
    }
}

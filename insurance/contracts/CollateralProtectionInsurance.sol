// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollateralProtectionInsurance {
    address public owner;
    uint256 public coveragePercentage;

    constructor(uint256 _coveragePercentage, address _owner) {
        owner = _owner;
        coveragePercentage = _coveragePercentage;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function setCoveragePercentage(
        uint256 _newCoveragePercentage
    ) external onlyOwner {
        coveragePercentage = _newCoveragePercentage;
    }

    receive() external payable {}

    function claimLoanProtection(uint256 collateralValue) external onlyOwner {
        require(collateralValue > 0, "Collateral value cannot be zero");

        uint256 protectedLoanAmount = (collateralValue * coveragePercentage) /
            100;

        payable(owner).transfer(protectedLoanAmount);
    }
}

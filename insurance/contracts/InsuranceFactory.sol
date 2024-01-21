// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CryptoWalletInsurance.sol";
import "./CollateralProtectionInsurance.sol";

contract InsuranceFactory {
    enum InsuranceType {
        CryptoWallet,
        CollateralProtection
    }

    mapping(address => address[]) public userInsuranceContracts;

    event InsuranceContractCreated(address _contractAddress);

    function createInsuranceContract(
        InsuranceType _type,
        uint256 _premiumAmount,
        uint256 _coverageAmount,
        uint256 _coveragePercentage
    ) external {
        address newContract;

        if (_type == InsuranceType.CryptoWallet) {
            require(
                _premiumAmount > 0,
                "Premium amount must be greater than 0"
            );
            require(
                _coverageAmount > 0,
                "Coverage amount must be greater than 0"
            );

            newContract = address(
                new CryptoWalletInsurance(
                    _premiumAmount,
                    _coverageAmount,
                    msg.sender
                )
            );
        } else if (_type == InsuranceType.CollateralProtection) {
            require(
                _coveragePercentage > 0,
                "Coverage percentage must be greater than 0"
            );

            newContract = address(
                new CollateralProtectionInsurance(
                    _coveragePercentage,
                    msg.sender
                )
            );
        }

        userInsuranceContracts[msg.sender].push(newContract);
        emit InsuranceContractCreated(newContract);
    }
}

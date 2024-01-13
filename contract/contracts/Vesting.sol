// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vesting {
    address public owner;

    struct Organization {
        string name;
        address tokenAddress;
        address adminAddress;
    }

    struct Stakeholder {
        IERC20 tokenAddress;
        address stakeholderAddress;
        string stakeholderType;
        uint40 vestingPeriod;
        uint256 startTime;
        bool whitelisted;
        uint256 vestedAmount;
        string orgName;
    }

    mapping(address => Stakeholder) public stakeholders;
    mapping(address => Organization) public organizations;
    mapping(string => mapping(string => uint40)) stakeholderTypeVestingPeriod;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    function registerOrganization(
        string memory name,
        address tokenAddress
    ) external onlyOwner {
        require(
            organizations[msg.sender].adminAddress == address(0),
            "Organization already registered"
        );
        organizations[msg.sender] = Organization(
            name,
            tokenAddress,
            msg.sender
        );
    }

    function setVestingPeriod(
        string memory _orgName,
        string memory _stakeholderType,
        uint40 _vestingPeriod
    ) external onlyOwner {
        Organization memory organization = organizations[msg.sender];

        require(
            keccak256(abi.encodePacked(_orgName)) ==
                keccak256(abi.encodePacked(organization.name)),
            "This is not your Organization"
        );
        require(
            bytes(organization.name).length > 0,
            "Organization is not resgistered"
        );
        require(_vestingPeriod > 0, "Vesting period must be greater than zero");

        stakeholderTypeVestingPeriod[_orgName][
            _stakeholderType
        ] = _vestingPeriod;
    }

    function whitelistStakeHolderAddress(
        string memory _orgName,
        address _stakeholderAddress,
        string memory _stakeholderType,
        bool whitelist,
        uint256 vestedAmount
    ) external onlyOwner {
        Organization memory organization = organizations[msg.sender];
        uint40 vestingPeriod_ = stakeholderTypeVestingPeriod[_orgName][
            _stakeholderType
        ];

        require(
            organization.adminAddress == msg.sender,
            "Only organization admin can whitelist addresses"
        );

        require(
            keccak256(abi.encodePacked(_orgName)) ==
                keccak256(abi.encodePacked(organization.name)),
            "This is not your Organization"
        );
        require(
            bytes(_stakeholderType).length > 0,
            "Stakeholder type cannot be empty"
        );
        require(
            vestingPeriod_ > 0 || vestingPeriod_ < block.timestamp,
            "Not in Vesting Period"
        );

        stakeholders[_stakeholderAddress] = Stakeholder({
            tokenAddress: IERC20(organization.tokenAddress),
            stakeholderAddress: _stakeholderAddress,
            stakeholderType: _stakeholderType,
            vestingPeriod: vestingPeriod_,
            startTime: block.timestamp, // Set start time to current block timestamp
            whitelisted: whitelist, // Initially set whitelisted to false
            vestedAmount: vestedAmount, // Initially set vested amount to zero
            orgName: _orgName
        });
    }

    function isWhitelisted(address _beneficiary) external view returns (bool) {
        return stakeholders[_beneficiary].whitelisted;
    }

    function claimTokens(address _stakeholderAddress) public {
        Stakeholder memory stakeholder = stakeholders[_stakeholderAddress];

        address whitelistedStakeholder = stakeholder.stakeholderAddress;

        require(stakeholder.whitelisted == true, "Stakeholder not whitelisted");

        require(stakeholder.vestedAmount > 0, "You have no token to claim");

        IERC20 tokenContractAddress = stakeholder.tokenAddress;
        uint256 vestedAmount = stakeholder.vestedAmount;

        tokenContractAddress.transfer(whitelistedStakeholder, vestedAmount);

        stakeholder.vestedAmount = 0;
    }

    function transferFromContract(address tokenAddress) external onlyOwner {
        uint bal = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transferFrom(address(this), msg.sender, bal);
    }

    function getContractERC20Balance(
        IERC20 tokenAddress
    ) external view returns (uint256) {
        return tokenAddress.balanceOf(address(this));
    }
}

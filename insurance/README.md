# Project Title
Insure.

# Description
This is an insurance decentralized application.

# Getting Started
Installing
# Clone this repository:
```
https://github.com/aagbotemi/solidity-challenge
```
## Executing program
### Smart Contract
1. Change directory into the contract folder
```
cd insurance
```
2. To install packages, run;
```
yarn install
```
3. Create env file and add your variables, example is in the `.env.example` file.
4. To deploy the contract run;
```
npx hardhat run ./scripts/deploy.ts --network sepolia
```
The contract was deployed on sepolia, to deploy on another network, add the network into the `hardhat.config.ts`
5. To verify the contract;
```
npx hardhat verify --network sepolia <address> <args>
```

## Author
[aagbotemi](https://github.com/aagbotemi)

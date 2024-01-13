# Project Title
Vestory.

# Description
This is a a vesting decentralized application for organisations and stakeholders.

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
cd contract
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
### Frontend
1. Change directory into the frontend folder
```
cd frontend
```
2. To install packages, run;
```
yarn install
```
3. Update the contract address you deploy in `/config/address.ts` file.
4. To run the frontend;
```
yarn run dev
```

## Author
[aagbotemi](https://github.com/aagbotemi)

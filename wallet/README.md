# Project Title
Smart Account Wallet.

# Description
This is a smart account wallet following EIP-4337.

# Getting Started
Installing
# Clone this repository:
```
https://github.com/aagbotemi/solidity-challenge
```
## Executing program
Change directory into this project
```
cd wallet
```

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
npx hardhat run ./scripts/deploy.js
```
5. To deposit into Paymaster address, run;
```
npx hardhat run ./scripts/deposit.js
```
6. To deposit into the smart contract, and execute appropriate functions;
```
npx hardhat run ./scripts/execute.js
```
7. To check the balance of the smart contract;
```
npx hardhat run ./scripts/test.js
```

The contract was deployed on sepolia, to deploy on another network, add the network into the `hardhat.config.js`

8. To verify the contract;
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
3. Update the contract address of the smart contract you deploy in `/config/address.ts` file.
4. To run the frontend;
```
yarn run dev
```

## Author
[aagbotemi](https://github.com/aagbotemi)

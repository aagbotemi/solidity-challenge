// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const ACCOUNT_ADDRESS = "0xc4499ba1866186def5fceab00d0ea04d5808d64f"

async function main() {
  const account = await hre.ethers.getContractAt("SmartAccount", ACCOUNT_ADDRESS);
  const balanceOfAccAddress = await account.getAccBalance();
  console.log({ balanceOfAccAddress });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// const balanceOfAccAf = await entryPoint.balanceOf(ACCOUNT_ADDRESS);
// console.log({ balanceOfAccAf });
// const balanceOfSignerAf = await hre.ethers.provider.getBalance(signer0.address)
// console.log({ balanceOfSignerAf });
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xE693Ec7c1b9cB0A4a8e56217d2680C2C27F1a254";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const balanceOfPMBe = await entryPoint.balanceOf(PAYMASTER_ADDRESS);
  console.log({ balanceOfPMBe });

  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: hre.ethers.parseEther("0.3")
  })
  console.log("deposit was successful!");

  const balanceOfPMAf = await entryPoint.balanceOf(PAYMASTER_ADDRESS);
  console.log({ balanceOfPMAf });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { ethers, run } from "hardhat";
// import { run } from "@nomicfoundation/hardhat-verify";

// npx hardhat verify --network sepolia <address> <unlock time>
// Vestry Token deployed to 0x02BF790272Ea6d2819e5d487888FCf0745e96719
// Vesting deployed to 0x5EadD47Ef27F1587E3604e526F0034f237BdCA88

async function main() {
  const name = "Vesting Token";
  const symbol = "VST";

  const vestryToken = await ethers.deployContract("VestryToken", [name, symbol]);

  await vestryToken.waitForDeployment();

  console.log(
    `Vestry Token deployed to ${vestryToken.target}`
  );

  const vesting = await ethers.deployContract("Vesting");

  await vesting.waitForDeployment();

  console.log(
    `Vesting deployed to ${vesting.target}`
  );

  await run("verify:verify", {
    address: vestryToken?.target,
    constructorArguments: [
      name, symbol
    ],
  });
  await run("verify:verify", {
    address: vesting?.target,
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const FACTORY_ADDRESS = "0x852720faA73700775C1de858b85040cCE45A7DD2";
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xE693Ec7c1b9cB0A4a8e56217d2680C2C27F1a254";

async function main() {
  const [signer0, signer1] = await hre.ethers.getSigners();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  const AccountFactory = await hre.ethers.getContractFactory("SmartAccountFactory");
  let initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [signer0.address]).slice(2);

  let SMART_ACCOUNT_ADDRESS;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (ex) {
    SMART_ACCOUNT_ADDRESS = "0x" + ex.data.slice(-40);
  }

  const code = await ethers.provider.getCode(SMART_ACCOUNT_ADDRESS);

  const balanceOfAccBe = await entryPoint.balanceOf(SMART_ACCOUNT_ADDRESS);
  console.log({ balanceOfAccBe });

  if (code !== "0x") {
    initCode = "0x"
  }

  // await signer0.sendTransaction({
  //   to: SMART_ACCOUNT_ADDRESS,
  //   value: hre.ethers.parseEther("0.01")
  // });
  // console.log("deposit was successful!");

  console.log({ SMART_ACCOUNT_ADDRESS });

  const bal = await entryPoint.balanceOf(SMART_ACCOUNT_ADDRESS)
  console.log({ bal });


  const balanceOfSignerBe = await hre.ethers.provider.getBalance(signer0.address)
  console.log({ balanceOfSignerBe });

  const Account = await hre.ethers.getContractFactory("SmartAccount");

  const userOp = {
    sender: SMART_ACCOUNT_ADDRESS, // smart account address
    nonce: "0x" + (await entryPoint.getNonce(SMART_ACCOUNT_ADDRESS, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("withdraw", [signer0.address, hre.ethers.parseEther("0.0004")]),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  }

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await ethers.provider.send("eth_estimateUserOperationGas", [
    userOp,
    EP_ADDRESS,
  ])

  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;

  const { maxFeePerGas } = await ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas")
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash))

  const opHash = await ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS])
  console.log({ opHash });

  const balanceOfAccAf = await entryPoint.balanceOf(SMART_ACCOUNT_ADDRESS);
  console.log({ balanceOfAccAf });

  const balanceOfSignerAf = await hre.ethers.provider.getBalance(signer0.address)
  console.log({ balanceOfSignerAf });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

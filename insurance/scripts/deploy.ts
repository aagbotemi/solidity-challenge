import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const InsuranceType = {
  CryptoWallet: 0,
  CollateralProtection: 1,
};

// Insurance Factory deployed to 0xE2f68f8BD06356D75CA915EC556076C4ae4B57dA
// createInsuranceContractEvent: undefined
// Create Insurance Wallet Contract: 0xe005FA4220afEd0bFDe069700eDe2D6C65e05F10
// Create Wallet Insurance Contract: [object Object]
// Owner Wallet Insurance Contract: 0x8D5b0F873c00F8e8EA7FEF0C24DBdC5Ac2758D26
// Create Insurance Protection Contract: 0x609E4D9E19AC727D82A5d774b6D47FfFDDC6d208
// Create Wallet Insurance Contract: [object Object]
// set coverage percentage successful
// Current coverage percentage: 23


async function main() {
  const AMOUNT = ethers.parseEther("0.002")
  const [owner, otherAccount] = await ethers.getSigners();

  const insuranceFactory = await ethers.deployContract("InsuranceFactory");
  await insuranceFactory.waitForDeployment();

  console.log(
    `Insurance Factory deployed to ${insuranceFactory.target}`
  );

  // createInsuranceContract 
  const createInsuranceContractTxn = await insuranceFactory.createInsuranceContract(InsuranceType.CryptoWallet, AMOUNT, 200, 250);
  const createInsuranceContractTxnReceipt = await createInsuranceContractTxn.wait();

  // Get the transaction logs
  const createInsuranceContractTxnEvents = (createInsuranceContractTxnReceipt as any)?.events;
  const createInsuranceContractEvent = createInsuranceContractTxnEvents && createInsuranceContractTxnEvents.find(
    (event: { event: string; }) => event.event === "InsuranceContractCreated"
  );
  console.log(`createInsuranceContractEvent: ${createInsuranceContractEvent?.toString()}`);

  // Retrieve the contract addresses
  const insuranceContractAddress = await insuranceFactory.userInsuranceContracts(owner.address, 0);
  console.log(`Create Insurance Wallet Contract Address: ${insuranceContractAddress?.toString()}`);

  // create instance of the crypto wallet
  const cryptoWalletInsurance = await ethers.getContractAt("CryptoWalletInsurance", insuranceContractAddress?.toString());
  console.log(`Create Wallet Insurance Contract: ${cryptoWalletInsurance}`);

  // get owner of contract
  const ownerAddress = await cryptoWalletInsurance.owner();
  console.log(`Owner Wallet Insurance Contract: ${ownerAddress}`);

  // pay premium
  const payPremium = await cryptoWalletInsurance.payPremium({ value: AMOUNT });
  await payPremium.wait()

  await time.increase(2678400);

  // claim insurance
  const claimInsurance = await cryptoWalletInsurance.claimInsurance();
  await claimInsurance.wait()

  // -------------------------------- //
  // -------------------------------- //
  // -------------------------------- //

  // createInsuranceContract 
  const createInsuranceContractTxn2 = await insuranceFactory.createInsuranceContract(InsuranceType.CollateralProtection, 300, 200, 250);
  const createInsuranceContractTxnReceipt2 = await createInsuranceContractTxn2.wait();

  // Get the transaction logs
  const createInsuranceContractTxnEvents2 = (createInsuranceContractTxnReceipt2 as any)?.events;
  const createInsuranceContractEvent2 = createInsuranceContractTxnEvents2 && createInsuranceContractTxnEvents2.find(
    (event: { event: string; }) => event.event === "InsuranceContractCreated"
  );

  // Retrieve the contract addresses
  const insuranceContractAddress2 = await insuranceFactory.userInsuranceContracts(owner.address, 1);
  console.log(`Create Insurance Protection Contract Address: ${insuranceContractAddress2?.toString()}`);

  // create instance of the crypto wallet
  const collateralProtectionInsurance = await ethers.getContractAt("CollateralProtectionInsurance", insuranceContractAddress2?.toString());
  console.log(`Create Wallet Insurance Contract: ${collateralProtectionInsurance}`);

  // set coverage percentage
  const coveragePercentage = await collateralProtectionInsurance.setCoveragePercentage(23);
  await coveragePercentage.wait()
  console.log("set coverage percentage successful");

  // get the updated coverage percentage
  const currentCoveragePercentage = await collateralProtectionInsurance.coveragePercentage();
  console.log("Current coverage percentage:", currentCoveragePercentage.toString());

  const fundContract = await owner.sendTransaction({
    to: insuranceContractAddress2?.toString(),
    value: AMOUNT,
  });
  await fundContract.wait()

  // claim loan protection
  const claimLoanProtection = await collateralProtectionInsurance.claimLoanProtection(AMOUNT);
  await claimLoanProtection.wait()
  console.log('claim loan protection');

  // claim insurance
  const claimInsurance2 = await cryptoWalletInsurance.claimInsurance();
  await claimInsurance2.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

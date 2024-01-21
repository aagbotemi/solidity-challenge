import type { NextPage } from 'next';
import { useContractWrite, useContractRead, useAccount, useWaitForTransaction } from 'wagmi'
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { SyntheticEvent, useState } from 'react';
import { VESTORY_ADDRESS } from '../config/address';
import VESTORY_ABI from "../config/vestory.json"
import { parseEther } from 'viem'

const Home: NextPage = () => {
  const { address, isConnected } = useAccount()
  const [orgName, setOrgName] = useState<string>("")
  const [orgToken, setOrgToken] = useState<string>("")
  const [vestingPeriod, setVestingPeriod] = useState<string>("")
  const [vestedAmount, setVestedAmount] = useState<number>(0)
  const [stakeholderAddress, setStakeholderAddress] = useState<string>("")
  const [stakeholderType, setStakeholderType] = useState<string>("")
  const [isWhitelistAddress, setIsWhitelistAddress] = useState<string>("false")

  function connectWalletAlert() {
    if (!isConnected) {
      alert("Connect Your Wallet");
      return
    }
  }

  const {
    data: registerOrganisationData,
    isError: registerOrganisationError,
    isLoading: registerOrganisationLoading,
    write: writeRegisterOrganisation,
  } = useContractWrite({
    address: VESTORY_ADDRESS,
    abi: VESTORY_ABI,
    functionName: "registerOrganization",
    args: [orgName.toLowerCase(), orgToken],
    onError(error) {
      alert(error?.message);
    },
  });

  const { isLoading: registerOrganisationWaitLoading } = useWaitForTransaction({
    hash: registerOrganisationData?.hash,
    onSuccess(data) {

      setOrgName("");
      setOrgToken("");
      alert("Successfully registered organisation!");

    },
    onError(error) {
      alert("Failed!");
    },
  });


  const handleRegisterOrganisation = (e: SyntheticEvent) => {
    e.preventDefault()
    connectWalletAlert()
    writeRegisterOrganisation?.();
  }


  const {
    data: vestingPeriodData,
    isError: vestingPeriodError,
    isLoading: vestingPeriodLoading,
    write: writeVestingPeriod,
  } = useContractWrite({
    // mode: "recklesslyUnprepared",
    address: VESTORY_ADDRESS,
    abi: VESTORY_ABI,
    functionName: "setVestingPeriod",
    args: [orgName.toLowerCase(), stakeholderType, new Date(vestingPeriod).getTime() / 1000],
    onError(error) {
      alert(error?.message);
    },
  });

  const { isLoading: vestingPeriodWaitLoading } = useWaitForTransaction({
    hash: vestingPeriodData?.hash,
    onSuccess(data) {
      setOrgName("");
      setStakeholderAddress("");
      setVestingPeriod("");
      alert("Successfully set vesting period!");
    },
    onError(error) {
      alert("Failed!");
    },
  });

  const handleSetVestingPeriod = (e: SyntheticEvent) => {
    e.preventDefault()
    connectWalletAlert()
    writeVestingPeriod?.()
  }

  const {
    data: whitelistedAddressData,
    isError: whitelistedAddressError,
    isLoading: whitelistedAddressLoading,
    write: writeWhitelistedAddress,
  } = useContractWrite({
    // mode: "recklesslyUnprepared",
    address: VESTORY_ADDRESS,
    abi: VESTORY_ABI,
    functionName: "whitelistStakeHolderAddress",
    args: [
      orgName.toLowerCase(), stakeholderAddress, stakeholderType,
      isWhitelistAddress == 'true' ? true : false,
      parseEther(vestedAmount.toString())],
    onError(error) {
      alert(error?.message);
    },
  });

  const { isLoading: whitelistedAddressWaitLoading } = useWaitForTransaction({
    hash: whitelistedAddressData?.hash,
    onSuccess(data) {
      setOrgName("");
      setStakeholderAddress("");
      setStakeholderType("");
      setIsWhitelistAddress("");
      setVestedAmount(0);
      alert("Address whitelisted successfully!");
    },
    onError(error) {
      alert("Failed!");
    },
  });
  const handleWhitelistAddress = (e: SyntheticEvent) => {
    e.preventDefault()

    connectWalletAlert();

    writeWhitelistedAddress?.()
  }

  const {
    data: claimTokenData,
    isError: claimTokenError,
    isLoading: claimTokenLoading,
    write: writeClaimToken,
  } = useContractWrite({
    // mode: "recklesslyUnprepared",
    address: VESTORY_ADDRESS,
    abi: VESTORY_ABI,
    functionName: "claimTokens",
    args: [address],
    onError(error) {
      alert(error?.message);
    },
  });

  const { isLoading: claimTokenWaitLoading } = useWaitForTransaction({
    hash: claimTokenData?.hash,
    onSuccess(data) {
      alert("Token claimed successfully!");
    },
    onError(error) {
      alert("Failed!");
    },
  });


  const handleClaimVesting = async (e: SyntheticEvent) => {
    e.preventDefault()
    connectWalletAlert();

    writeClaimToken?.();
  }

  const handleAdminWithdrawal = (e: SyntheticEvent) => {
    e.preventDefault()
  }

  const { data: whitelistStatus } = useContractRead({
    address: VESTORY_ADDRESS,
    abi: VESTORY_ABI,
    functionName: "isWhitelisted",
    args: [address]
  }) as any;

  const { data: owner } = useContractRead({
    address: VESTORY_ADDRESS,
    abi: VESTORY_ABI,
    functionName: "owner",
  }) as any;

  return (
    <div className={""}>
      <Head>
        <title>Vestry</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className="bg-[#2D4258]">

        <Navbar />
        <main className={"px-6 md:px-14 py-4 max-w-[1440px] mx-auto"}>


          <div className="grid grid-cols-2 gap-10">
            <div className="flex-1 w-full p-6 border border-[#1E293B] rounded-lg">
              <div className="mb-16">
                <h2 className='text-[#e8e8e8] text-xl mb-3 underline font-bold text-[24px]'>Claim Vesting Token</h2>
                <form onSubmit={handleClaimVesting}>

                  <button type='submit' className='bg-[#0E76FD] text-white font-[600] rounded-lg px-6 py-2.5'>{claimTokenLoading || claimTokenWaitLoading ? "Loading" : "Claim"}</button>
                </form>
              </div>

              <div className="">
                <h2 className='text-[#e8e8e8] text-xl mb-3 underline font-bold text-[24px]'>Check Whitelist Status</h2>

                <div className="text-white">{!isConnected && "Connect your wallet to check eligibility status"}</div>
                <div className="text-white">{whitelistStatus ? "Your address has been whitelisted to claim vesting token" : "Your address has not been whitelisted. Your are not eligible."}</div>

              </div>
            </div>
            <div className="flex-1 w-full p-6 border border-[#1E293B] rounded-lg">
              <h2 className='text-[#e8e8e8] text-xl mb-3 underline font-bold text-[24px]'>Add Organisation</h2>
              <form onSubmit={handleRegisterOrganisation}>
                <div className="mb-3">
                  <label className="block mb-1 text-[#c8c8c8]">Organisation Name</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='Transcorp Hilton Inc.' onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Organisation Token</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='0x0' onChange={(e) => setOrgToken(e.target.value)} />
                </div>
                <button type='submit' className='bg-[#0E76FD] text-white font-[600] rounded-lg px-6 py-2.5'>{registerOrganisationLoading || registerOrganisationWaitLoading ? "Loading" : "Submit"}</button>
              </form>
            </div>
            <div className="flex-1 w-full p-6 border border-[#1E293B] rounded-lg">
              <h2 className='text-[#e8e8e8] text-xl mb-3 underline font-bold text-[24px]'>Add Vesting Details</h2>
              <form onSubmit={handleSetVestingPeriod}>
                <div className="mb-3">
                  <label className="block mb-1 text-[#c8c8c8]">Organisation Name</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='Transcorp Hilton Inc.' onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Stakeholder Type</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='Founder, Investor, Developer etc' onChange={(e) => setOrgToken(e.target.value)} />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Vesting Period</label>
                  <input type="date" className='h-[48px] w-full px-3 rounded-lg' placeholder='0x0' onChange={(e) => setVestingPeriod(e.target.value)} />
                </div>
                <button type='submit' className='bg-[#0E76FD] text-white font-[600] rounded-lg px-6 py-2.5'>
                  {vestingPeriodLoading || vestingPeriodWaitLoading ? "Loading" : "Submit"}
                </button>
              </form>
            </div>
            <div className="flex-1 w-full p-6 border border-[#1E293B] rounded-lg">
              <h2 className='text-[#e8e8e8] text-xl mb-3 underline font-bold text-[24px]'>Whitelist Stakeholder</h2>
              <form onSubmit={handleWhitelistAddress}>
                <div className="mb-3">
                  <label className="block mb-1 text-[#c8c8c8]">Organisation Name</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='Transcorp Hilton Inc.' onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Stakeholder Address</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='0x0' onChange={(e) => setStakeholderAddress(e.target.value)} />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Stakeholder Type</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='Founder, Investor, Developer etc' onChange={(e) => setStakeholderType(e.target.value)} />
                </div>
                <div className="flex mb-4 gap-8 text-[#c8c8c8]">

                  <label>
                    <input
                      type="radio"
                      value="true"
                      checked={isWhitelistAddress === "true"}
                      onChange={(e) => setIsWhitelistAddress(e.target.value)}
                    />
                    True
                  </label>

                  <label>
                    <input
                      type="radio"
                      value="false"
                      checked={isWhitelistAddress === "false"}
                      onChange={(e) => setIsWhitelistAddress(e.target.value)}
                    />
                    False
                  </label>
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Vesting Amount</label>
                  <input type="number" className='h-[48px] w-full px-3 rounded-lg' placeholder='200' onChange={(e) => setVestedAmount(+e.target.value)} />
                </div>
                <button type='submit' className='bg-[#0E76FD] text-white font-[600] rounded-lg px-6 py-2.5'>
                  {whitelistedAddressLoading || whitelistedAddressWaitLoading ? "Loading" : "Submit"}
                </button>
              </form>
            </div>


            <div className="flex-1 w-full p-6 border border-[#1E293B] rounded-lg">
              <h2 className='text-[#e8e8e8] text-xl mb-3 underline font-bold text-[24px]'>Admin Withdrawal</h2>
              <form onSubmit={handleAdminWithdrawal}>
                <div className="mb-6">
                  <label className="block mb-1 text-[#c8c8c8]">Token Address</label>
                  <input type="text" className='h-[48px] w-full px-3 rounded-lg' placeholder='0x0' onChange={(e) => setOrgToken(e.target.value)} />
                </div>
                <button type='submit' className='bg-[#0E76FD] text-white font-[600] rounded-lg px-6 py-2.5'>Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

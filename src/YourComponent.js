import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSigner,  // For write logic 2
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

import usdtContractABI from "./USDT.json";

export const YourComponent = () => {

  const CONTRACT_ADDRESS = "0x4e2BC5a34d364bbEA11CaaE53C18534AA2A401E1";

  ////////////////////////////
  // Write Contract Logic 1 //
  ////////////////////////////

  //Mint Token Function
  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: usdtContractABI,
    functionName: "mint",
  });

  const mintFreeTokens = async () => {
    await mint({ args: ["0x3ED87449591524deF3A2f9aeA247dcD3BD38687f", ethers.utils.parseEther("9")] })
  }

   // Check TX for mint function
   const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    confirmations: 1,
    hash: mintData?.hash,
  });


  ////////////////////////////
  // Write Contract Logic 2 //
  ////////////////////////////

  const { data: signerData } = useSigner();


  //Using useContract only (instead of useContractWrite)
  const transferTokens = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: usdtContractABI,
    signerOrProvider: signerData,
  });

  const transferSomeTokens = async () => {
    await transferTokens.transfer("0xf922e3223567AeB66e6986cb09068B1B879B6ccc",ethers.utils.parseEther("1"));
    //  await buyTokens.transfer("0xf922e3223567AeB66e6986cb09068B1B879B6ccc", {value: ethers.utils.parseEther(".01")});
  }


  /////////////////////////
  // Read Contract Logic //
  /////////////////////////

  const [supplyData, setSupplyData] = useState("");
  const [balances, setBalances] = useState("");


  const { data: totalSupplyData } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: usdtContractABI,
    functionName: "name",
    watch: false,
  });

  const { data: balance } = useContractRead({
    contractInterface: usdtContractABI,
    addressOrName: CONTRACT_ADDRESS,
    method: 'totalSupply',
    // args: ['0x3ED87449591524deF3A2f9aeA247dcD3BD38687f'],
    watch: false,
  })

  

  useEffect(() => {
    if (totalSupplyData) {
      console.log("Supply = ", totalSupplyData);
      // let temp = totalSupplyData / 10 ** 18;
      setSupplyData(totalSupplyData);
    }
    if (balance) {
      console.log("Supply2 = ", balance);
      // let temp = totalSupplyData / 10 ** 18;
      setBalances(balance);
    }
  }, [totalSupplyData,balance]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("balance = ",balance);
      // const data = await wagmi.getData("<your-contract-function>");
      // setContractData(data);
    };
    fetchData();
  }, []);



  const { address } = useAccount();
  const { chains } = useNetwork();

  useEffect(() => {
    console.log("address:", address);
    console.log("network", chains);
    console.log("___________");
  }, [address, chains]);



  // useEffect(() => {
  //   console.log("mintData:", mintData);
  //   console.log("isMintLoading:", isMintLoading);
  //   console.log("isMintStarted", isMintStarted);
  //   console.log("mintError:", mintError);
  //   console.log("___________");
  // }, [mintData, isMintLoading, isMintStarted]);


  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <ConnectButton />
        {/* <ConnectButton showBalance={false}  /> */}

      </div>
      <div
        style={{
          width: "100vw",
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <button
          onClick={mintFreeTokens}
          disabled={isMintLoading}
        >
          Mint Tokens
        </button>
        <button
          onClick={transferSomeTokens}
        >
          Transfer Tokens
        </button>

        {txSuccess && <p>Success</p>}

        <div>
        <h3 >Total minted</h3>
        <h3 >{supplyData}{balances}</h3>
        
      </div>

      </div>
    </>
  );
};

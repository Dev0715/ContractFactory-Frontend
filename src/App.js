import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contract from './contracts/contract.json';

const contractAddress = "0xa511C70C76Eb23d2586fa061c99E8D6CdcC700c3";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentContract, setCurrentContract] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamast installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found!");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address:", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const createContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await factoryContract.createContract("Mintdropz", "MD", ethers.utils.parseEther("0.03"), 10);
        // params: name, symbol, tokenPrice, royaltyPercent

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, transaction hash: ${nftTxn.hash}`);
      } else {
        console.log("Ethereum object does not exit");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getContractAddress = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const factoryContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await factoryContract.getMyContract();
        setCurrentContract(nftTxn);
      } else {
        console.log("Ethereum object does not exit");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='btn btn-wallet-connect'>
        Connect Wallet
      </button>
    )
  }

  const createContractButton = () => {
    return (
      <button onClick={createContract} className='btn btn-mint-nft'>
        Create Factory
      </button>
    )
  }

  const getContractAddresButton = () => {
    return (
      <button onClick={getContractAddress} className='btn btn-mint-nft'>
        Get My Contract address
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="div-wallet-address">
        Wallet Address: {currentAccount ? currentAccount : "No Wallet Connected"}
      </div>
      <div className="div-wallet-button">
        {currentAccount ? createContractButton() : connectWalletButton()}
      </div>
      {currentAccount &&
        <div className="div-wallet-button">
          {getContractAddresButton()}
        </div>
      }
      {currentContract &&
        <div className="div-wallet-address">
          Contract Address: {currentContract}
        </div>
      }
    </div>
  );
}

export default App;

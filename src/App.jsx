import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import ProgressBar from './progressbar.component';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    let [totalWaves] = useState("");

    // contract variables
    const contractAddress = "0xf52378b5690529d54D7967EfE8A7c3DAA29bb210";
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            // check if checkIfWalletIsConnected
            if(!ethereum) {
                console.log("Connect your Metamask firts!");
                return;
            }
            else {
                console.log("We have the ethereum object", ethereum);
            }

            // check if authorized to access the wallet
            const accounts = await ethereum.request({method:'eth_accounts'});

            if(accounts.length !== 0) {
                const account = accounts[0];
                console.log("There's a connected wallet %s that we are authorized to use", account);
                setCurrentAccount(account);
            }
            else {
                console.log("Didn't find any authorized account to use!");
            }

        }
        catch(error) {
            console.log(error);
        }
    }

    // request metamask to allow our website to connect
    const connectWallet = async () => {
        try{
            const { ethereum } = window;
            if(!ethereum) {
                console.log("Connect Metamask first!");
                return
            }
            alert("Connecting your wallet...")
            const accounts = await ethereum.request({method:'eth_requestAccounts'});
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        }
        catch(error){
            console.log(error);
        }
    }
    const wave = async () => {
        try {
            const { ethereum } = window;
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                // get total waves
                totalWaves = await wavePortalContract.getTotalWaves();
                console.log("People waved %d times", totalWaves.toNumber());

                // write to the chain
                const waveTxn = await wavePortalContract.wave();
                console.log('Mining... ', waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined transaction ...", waveTxn.hash);

                // check total waves
                totalWaves = await wavePortalContract.getTotalWaves();
                console.log("People waved %d times", totalWaves.toNumber());
            }
            else {
                console.log("We don't have access to the window object!");
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋   Holla!
        </div>

        <div className="bio">
        <p>I like it when people wave at me. </p><p>I'd feel bad if you passed without waving.</p>
        <p>It's just a button away</p>
        <ProgressBar waves={+totalWaves} />
        </div>

        {currentAccount && (
            <button className="waveButton" onClick={wave}>
                Wave at Me
            </button>
        )}

        {!currentAccount && (
            <button className="connectButton" onClick={connectWallet}>Connect Wallet To Wave</button>
        )}
      </div>
    </div>
  );
}

export default App;
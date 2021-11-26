import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';
import ProgressBar from './progressbar.component';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    let [totalWaves, setTotalWaves] = useState(0);
    const [allWaves, setAllWaves] = useState([]);
    const [message, setMessage] = useState("");

    // contract variables
    const contractAddress = "0xEF1aD63E729F657585003D6F255a6A9cEA772E41";
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
                setTotalWaves(totalWaves.toNumber());
                // write to the chain
                const waveTxn = await wavePortalContract.wave(message);
                console.log('Mining... ', waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined transaction ...", waveTxn.hash);

                // check total waves
                totalWaves = await wavePortalContract.getTotalWaves();
                console.log("People waved %d times", totalWaves.toNumber());
                setTotalWaves(totalWaves.toNumber());
            }
            else {
                console.log("We don't have access to the window object!");
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    // get all waves data
    const getAllWaves = async () => {
        try {
            const { ethereum } = window;

            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let waves = await wavePortalContract.getAllWaves();

                // iterate over all waves and return
                let result = [];
                waves.forEach(wave => {
                    result.push({
                        address: wave.senderAddress,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    });
                });

                // update allwaves state
                setAllWaves(waves);
                console.log(waves)
            }
            else {
                console.log("We have no access to the ethereum object!")
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
            Topic Review
        </div>

        <div className="bio">
        <h5>Mind Leaving a review on Web3?</h5>
        <p>We are trying to get reviews on how you feel about web3.</p>
        </div>

        {currentAccount && (
            <form onSubmit.preventDefault={wave}>
                <div>
                    <textarea
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    cols="60"
                    rows="10"
                    >
                    </textarea>
                </div>
                <button className="waveButton" type="submit">
                    Wave to review 👋
                </button>
            </form>
        )}

        {!currentAccount && (
            <button className="connectButton" onClick={connectWallet}>Connect Wallet To Wave</button>
        )}

        <div className="progress"><ProgressBar waves={totalWaves} /></div>
      </div>
    </div>
  );
}

export default App;
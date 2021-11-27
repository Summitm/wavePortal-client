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
    const contractAddress = "0xc8fE31F9B04d612E2f79A1F0874d5eb9AaC7b9EA";
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
    const wave = async (event) => {
        event.preventDefault();
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
                const waveTxn = await wavePortalContract.wave(message,{gasLimit: 300000});
                console.log('Mining... ', waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined transaction ...", waveTxn.hash);

                // check total waves
                totalWaves = await wavePortalContract.getTotalWaves();
                console.log("People waved %d times", totalWaves.toNumber());
                setTotalWaves(totalWaves.toNumber());

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

                setAllWaves(result);
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
                // console.log(result);
                setAllWaves(result);
            }
            else {
                console.log("We have no access to the ethereum object!");
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    
    const getWavesCount = async () => {
        try {
            const { ethereum } = window;

            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const webPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let count = await webPortalContract.getTotalWaves();
                setTotalWaves(count.toNumber());
            }
            else {
                console.log("No wave data available!")
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        checkIfWalletIsConnected();
        getAllWaves();
        getWavesCount();
    },[])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
            Topic Review
        </div>

        <div className="bio">
        <h3>Mind Leaving a review on Web3?</h3>
        <p>We are trying to get reviews on how you feel about web3.</p>
        </div>

        {currentAccount && (
            <form onSubmit={wave}>
                <div>
                    <textarea
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    cols="70"
                    rows="10"
                    required
                    placeholder="Type your review here!"
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

        {allWaves.map((wave, index) => {
            return(
                <div key={index} className="message-box">
                    <p className="from"><small>{wave.address.slice(0, 10)}...{wave.address.slice(-4)}</small></p>
                    <p className="message">{wave.message}</p>
                    <p className="time-stamp"><small>{wave.timestamp.toString()}</small></p>
                </div>
            )
        })}
      </div>
    </div>
  );
}

export default App;
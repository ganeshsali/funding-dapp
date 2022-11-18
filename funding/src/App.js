import './App.css';
import { useEffect, useState } from 'react';
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from './utils/load-contract'

function App() {

  const [web3api, setweb3api] = useState({
    provider : null,
    web3 : null,
    contract : null 
  });

  const [account, setaccount] = useState(null);
  const [balance, setbalance] = useState(null);
  const [reload, setreload] = useState(false);
  const [mybalance, setmybalance] = useState(null);

  const reloadEffect = () => setreload(!reload)

  useEffect(() => {

    const loadProvider = async () => {

      const provider = await detectEthereumProvider();
      const contract = await loadContract("Funder",provider);

      if (provider){
        provider.request({
          method:"eth_chainId"
        });

        setweb3api({
          web3: new Web3(provider),
          provider,
          contract: contract
        });

      }
      else{
          console.error('Please install MetaMask!')
      }

      // let provider = null;
      // if (window.ethereum) {
      //   provider = window.ethereum;
      //   try{
      //     await provider.enable();
      //   }
      //   catch{
      //     console.error("User not allowed")
      //   }
      // }
      // else if(window.web3){
      //   provider = window.web3.currentProvider;
      // }
      // else if(!process.send.production){
      //   provider = new Web3.providers.HttpProvider("http://localhost:8545")
      // }

      
    };
    loadProvider();
  }, [])


  useEffect(() => {
    const loadBalance = async()=>{
      const {contract,web3} = web3api;
      const balance = await web3.eth.getBalance(contract.address);
      setbalance(web3.utils.fromWei(balance,"ether"));
    }

    web3api.contract && loadBalance();
  }, [web3api,reload])


  useEffect(() => {
    const getAccount = async()=>{
      const accounts = await web3api.web3.eth.getAccounts();
      setaccount(accounts[0]);
      const mybalance = await web3api.web3.eth.getBalance(accounts[0]);
      setmybalance(web3api.web3.utils.fromWei(mybalance,"ether"));
    }
    web3api.web3 && getAccount();
  }, [web3api.web3,reload])
  

  const transferFunds = async () => {
    const {contract,web3} = web3api;
    await contract.transfer({
      from : account,
      value : web3.utils.toWei("2","ether")
    });
    reloadEffect();
  }

  const withdrawFunds = async () => {
    const {contract,web3} = web3api;
    const withdrawAmount = web3.utils.toWei("2","ether");
    await contract.withdraw(withdrawAmount,{
      from : account
    });
    reloadEffect();
  }

  return (
    <>
      <div className="card text-center">
        <div className="card-header">Funding</div>
        <div className="card-body">
          <h5 className="card-title">Balance: {balance} ETH </h5>
          <h5 className="card-title">My Balance: {mybalance} ETH </h5>
          <p className="card-text">
            Account : {account ? account : "Not Connected"}
          </p>
          {/* <button type="button" className="btn btn-success"
            onClick={async () => {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
              });
              console.log(accounts);
            }}
          >
            Connect to metamask
          </button> */}
          &nbsp;
          <button type="button" className="btn btn-success "
          onClick={transferFunds}
          >
            Transfer
          </button>
          &nbsp;
          <button type="button" className="btn btn-primary " 
          onClick={withdrawFunds}
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

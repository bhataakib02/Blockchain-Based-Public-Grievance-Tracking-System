import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContractInstances, CONTRACT_ADDRESSES } from '../services/blockchain/contractService';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to interact with the blockchain.');
      // Set simulated demo wallet for environment testing
      setAccount('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
      setChainId(31337);
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const network = await browserProvider.getNetwork();
      const web3Signer = await browserProvider.getSigner();

      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setProvider(browserProvider);
      setSigner(web3Signer);

      const instances = getContractInstances(web3Signer);
      setContracts(instances);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect MetaMask wallet.');
      // Demo fallback
      setAccount('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
      setChainId(31337);
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
        else setAccount(null);
      });
      window.ethereum.on('chainChanged', (cId) => {
        setChainId(parseInt(cId, 16));
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{
      account, chainId, provider, signer, contracts, connecting, error,
      connectWallet, contractAddresses: CONTRACT_ADDRESSES
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

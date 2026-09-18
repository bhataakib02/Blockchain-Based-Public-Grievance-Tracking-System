import { ethers } from 'ethers';

/**
 * Encodes a string into a bytes32 hex string suitable for Solidity input.
 */
export const stringToBytes32 = (text) => {
  if (!text) return '0x0000000000000000000000000000000000000000000000000000000000000000';
  // If already a valid 66-character bytes32 hex
  if (text.startsWith('0x') && text.length === 66) return text;
  
  // Use keccak256 or utf8 bytes padded to 32 bytes
  try {
    const bytes = ethers.toUtf8Bytes(text.slice(0, 32));
    return ethers.zeroPadBytes(bytes, 32);
  } catch (err) {
    return ethers.id(text);
  }
};

/**
 * Computes deterministic SHA-256 / Keccak-256 hash of text.
 */
export const hashText = (text) => {
  if (!text) return '0x0000000000000000000000000000000000000000000000000000000000000000';
  return ethers.id(text);
};

/**
 * Truncates an Ethereum address (0x1234...5678).
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Formats a transaction hash.
 */
export const formatTxHash = (hash) => {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

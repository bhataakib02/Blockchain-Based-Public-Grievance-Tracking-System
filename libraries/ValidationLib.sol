// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ValidationLib {
    error EmptyValue();
    error ZeroAddress();

    function requireHash(bytes32 value) internal pure {
        if (value == bytes32(0)) revert EmptyValue();
    }

    function requireAddress(address value) internal pure {
        if (value == address(0)) revert ZeroAddress();
    }
}

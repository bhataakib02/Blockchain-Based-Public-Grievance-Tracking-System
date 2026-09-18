// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GrievanceTypes} from "./GrievanceTypes.sol";

/// @notice Append-only audit log. Authorized writers can be added but never removed, preserving system continuity.
contract AuditTrail {
    address public immutable owner;
    mapping(address => bool) public writer;
    GrievanceTypes.AuditRecord[] private records;
    mapping(uint256 => uint256[]) private grievanceRecordIndexes;

    event WriterAuthorized(address indexed writer);
    event AuditAppended(uint256 indexed recordIndex, uint256 indexed grievanceId, address indexed actor, bytes32 action, bytes32 dataHash, uint64 timestamp);

    constructor(address initialOwner) {
        require(initialOwner != address(0), "zero owner");
        owner = initialOwner;
        writer[initialOwner] = true;
        emit WriterAuthorized(initialOwner);
    }

    function authorizeWriter(address account) external {
        require(msg.sender == owner, "owner only");
        require(account != address(0), "zero writer");
        require(!writer[account], "already writer");
        writer[account] = true;
        emit WriterAuthorized(account);
    }

    function append(uint256 grievanceId, address actor, bytes32 action, bytes32 dataHash) external returns (uint256 index) {
        require(writer[msg.sender], "writer only");
        require(actor != address(0) && action != bytes32(0), "invalid record");
        index = records.length;
        uint64 timestamp = uint64(block.timestamp);
        records.push(GrievanceTypes.AuditRecord(grievanceId, actor, action, dataHash, timestamp));
        grievanceRecordIndexes[grievanceId].push(index);
        emit AuditAppended(index, grievanceId, actor, action, dataHash, timestamp);
    }

    function recordCount() external view returns (uint256) { return records.length; }
    function getRecord(uint256 index) external view returns (GrievanceTypes.AuditRecord memory) { return records[index]; }
    function getGrievanceRecordIndexes(uint256 id) external view returns (uint256[] memory) { return grievanceRecordIndexes[id]; }
}

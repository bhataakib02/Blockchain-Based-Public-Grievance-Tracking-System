// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GrievanceTypes} from "../contracts/GrievanceTypes.sol";

interface IGrievanceSystem {
    function createGrievance(bytes32 title, bytes32 descriptionHash, bytes32 category, bytes32 department, GrievanceTypes.Priority priority) external returns (uint256);
    function assignGrievance(uint256 id, address officer) external;
    function updateStatus(uint256 id, GrievanceTypes.Status newStatus, bytes32 evidenceHash) external;
    function submitResolution(uint256 id, bytes32 resolutionHash) external;
    function verifyResolution(uint256 id, bytes32 feedbackHash) external;
    function rejectResolution(uint256 id, bytes32 reasonHash) external;
    function reopenGrievance(uint256 id, bytes32 reasonHash) external;
    function escalateGrievance(uint256 id, bytes32 reasonHash) external;
    function getGrievance(uint256 id) external view returns (GrievanceTypes.Grievance memory);
}

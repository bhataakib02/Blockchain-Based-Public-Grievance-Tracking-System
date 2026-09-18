// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRoleManager} from "../interfaces/IRoleManager.sol";
import {GrievanceTypes} from "./GrievanceTypes.sol";
import {ValidationLib} from "../libraries/ValidationLib.sol";

/// @notice Stores SLA policy and deadline/escalation metadata, not grievance records.
contract EscalationManager {
    IRoleManager public immutable roles;
    address public grievanceSystem;
    mapping(GrievanceTypes.Priority => uint64) public slaSeconds;
    mapping(uint256 => uint64) public deadline;
    mapping(uint256 => uint32) public escalationLevel;

    event GrievanceSystemBound(address indexed system);
    event SLAConfigured(GrievanceTypes.Priority indexed priority, uint64 secondsAllowed);
    event DeadlineStarted(uint256 indexed grievanceId, uint64 deadline);
    event EscalationRecorded(uint256 indexed grievanceId, uint32 level, uint64 nextDeadline);

    modifier onlySuperAdmin() { require(roles.isSuperAdmin(msg.sender), "super admin only"); _; }
    modifier onlySystem() { require(msg.sender == grievanceSystem, "system only"); _; }

    constructor(IRoleManager roleManager) {
        ValidationLib.requireAddress(address(roleManager));
        roles = roleManager;
        slaSeconds[GrievanceTypes.Priority.LOW] = 14 days;
        slaSeconds[GrievanceTypes.Priority.MEDIUM] = 7 days;
        slaSeconds[GrievanceTypes.Priority.HIGH] = 3 days;
        slaSeconds[GrievanceTypes.Priority.CRITICAL] = 1 days;
    }

    /// @dev One-time binding avoids mutable trust and constructor circularity.
    function bindGrievanceSystem(address system) external onlySuperAdmin {
        require(grievanceSystem == address(0), "already bound");
        ValidationLib.requireAddress(system);
        grievanceSystem = system;
        emit GrievanceSystemBound(system);
    }

    function configureSLA(GrievanceTypes.Priority priority, uint64 secondsAllowed) external onlySuperAdmin {
        require(secondsAllowed > 0, "zero SLA");
        slaSeconds[priority] = secondsAllowed;
        emit SLAConfigured(priority, secondsAllowed);
    }

    function startDeadline(uint256 id, GrievanceTypes.Priority priority) external onlySystem {
        require(deadline[id] == 0, "deadline exists");
        deadline[id] = uint64(block.timestamp) + slaSeconds[priority];
        emit DeadlineStarted(id, deadline[id]);
    }

    function recordEscalation(uint256 id, GrievanceTypes.Priority priority, bool force) external onlySystem {
        require(deadline[id] != 0, "no deadline");
        require(force || block.timestamp > deadline[id], "SLA active");
        escalationLevel[id] += 1;
        deadline[id] = uint64(block.timestamp) + slaSeconds[priority];
        emit EscalationRecorded(id, escalationLevel[id], deadline[id]);
    }

    function isOverdue(uint256 id) external view returns (bool) {
        return deadline[id] != 0 && block.timestamp > deadline[id];
    }
}

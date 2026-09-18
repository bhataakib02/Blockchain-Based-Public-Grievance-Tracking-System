// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IGrievanceSystem} from "../interfaces/IGrievanceSystem.sol";
import {IRoleManager} from "../interfaces/IRoleManager.sol";
import {GrievanceTypes} from "./GrievanceTypes.sol";
import {DepartmentManager} from "./DepartmentManager.sol";
import {EscalationManager} from "./EscalationManager.sol";
import {AuditTrail} from "./AuditTrail.sol";
import {GrievanceLib} from "../libraries/GrievanceLib.sol";
import {ValidationLib} from "../libraries/ValidationLib.sol";

/// @notice Frontend/API entrypoint. It is the sole owner of grievance state; supporting modules store only their domain data.
contract GrievanceSystem is IGrievanceSystem {
    IRoleManager public immutable roles;
    DepartmentManager public immutable departments;
    EscalationManager public immutable escalations;
    AuditTrail public immutable auditTrail;

    uint256 private nextGrievanceId = 1;
    mapping(uint256 => GrievanceTypes.Grievance) private grievances;

    bytes32 private constant ACTION_CREATED = keccak256("CREATED");
    bytes32 private constant ACTION_ASSIGNED = keccak256("ASSIGNED");
    bytes32 private constant ACTION_STATUS = keccak256("STATUS_UPDATED");
    bytes32 private constant ACTION_RESOLUTION = keccak256("RESOLUTION_SUBMITTED");
    bytes32 private constant ACTION_VERIFIED = keccak256("CITIZEN_VERIFIED");
    bytes32 private constant ACTION_RESOLUTION_REJECTED = keccak256("RESOLUTION_REJECTED");
    bytes32 private constant ACTION_REOPENED = keccak256("REOPENED");
    bytes32 private constant ACTION_ESCALATED = keccak256("ESCALATED");

    event GrievanceCreated(uint256 indexed id, address indexed citizen, bytes32 indexed department, bytes32 title, bytes32 category, GrievanceTypes.Priority priority);
    event GrievanceAssigned(uint256 indexed id, address indexed officer, address indexed actor);
    event StatusUpdated(uint256 indexed id, GrievanceTypes.Status previousStatus, GrievanceTypes.Status newStatus, address indexed actor, bytes32 evidenceHash);
    event ResolutionSubmitted(uint256 indexed id, address indexed officer, bytes32 resolutionHash);
    event ResolutionVerified(uint256 indexed id, address indexed citizen, bytes32 feedbackHash);
    event ResolutionRejected(uint256 indexed id, address indexed citizen, bytes32 reasonHash);
    event GrievanceReopened(uint256 indexed id, address indexed actor, bytes32 reasonHash, uint32 reopenCount);
    event GrievanceEscalated(uint256 indexed id, address indexed actor, bytes32 reasonHash, uint32 level);

    constructor(IRoleManager roleManager, DepartmentManager departmentManager, EscalationManager escalationManager, AuditTrail trail) {
        ValidationLib.requireAddress(address(roleManager));
        ValidationLib.requireAddress(address(departmentManager));
        ValidationLib.requireAddress(address(escalationManager));
        ValidationLib.requireAddress(address(trail));
        require(address(departmentManager.roles()) == address(roleManager), "department role mismatch");
        require(address(escalationManager.roles()) == address(roleManager), "escalation role mismatch");
        roles = roleManager;
        departments = departmentManager;
        escalations = escalationManager;
        auditTrail = trail;
    }

    modifier existing(uint256 id) { require(grievances[id].id != 0, "unknown grievance"); _; }

    function createGrievance(bytes32 title, bytes32 descriptionHash, bytes32 category, bytes32 department, GrievanceTypes.Priority priority) external returns (uint256 id) {
        require(roles.isCitizen(msg.sender), "citizen only");
        ValidationLib.requireHash(title);
        ValidationLib.requireHash(descriptionHash);
        ValidationLib.requireHash(category);
        ValidationLib.requireHash(department);
        require(departments.isActive(department), "inactive department");

        id = nextGrievanceId++;
        grievances[id] = GrievanceTypes.Grievance({
            id: id,
            title: title,
            descriptionHash: descriptionHash,
            category: category,
            department: department,
            priority: priority,
            citizen: msg.sender,
            timestamp: uint64(block.timestamp),
            status: GrievanceTypes.Status.SUBMITTED,
            assignedOfficer: address(0),
            resolutionHash: bytes32(0),
            reopenCount: 0
        });
        escalations.startDeadline(id, priority);
        auditTrail.append(id, msg.sender, ACTION_CREATED, keccak256(abi.encode(title, descriptionHash, category, department, priority)));
        emit GrievanceCreated(id, msg.sender, department, title, category, priority);
    }

    function assignGrievance(uint256 id, address officer) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        require(departments.canManage(g.department, msg.sender), "department authority only");
        ValidationLib.requireAddress(officer);
        require(roles.isOfficer(officer) && departments.isDepartmentOfficer(g.department, officer), "invalid department officer");
        require(g.status == GrievanceTypes.Status.VERIFIED || g.status == GrievanceTypes.Status.ESCALATED || g.status == GrievanceTypes.Status.REOPENED, "not assignable");
        GrievanceTypes.Status oldStatus = g.status;
        g.assignedOfficer = officer;
        g.status = GrievanceTypes.Status.ASSIGNED;
        auditTrail.append(id, msg.sender, ACTION_ASSIGNED, bytes32(uint256(uint160(officer))));
        emit GrievanceAssigned(id, officer, msg.sender);
        emit StatusUpdated(id, oldStatus, g.status, msg.sender, bytes32(0));
    }

    function updateStatus(uint256 id, GrievanceTypes.Status newStatus, bytes32 evidenceHash) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        bool manager = departments.canManage(g.department, msg.sender);
        bool assigned = msg.sender == g.assignedOfficer && roles.isOfficer(msg.sender);
        require(manager || assigned, "not authorized");
        require(GrievanceLib.validAdministrativeTransition(g.status, newStatus), "invalid transition");
        if (newStatus == GrievanceTypes.Status.REJECTED || newStatus == GrievanceTypes.Status.VERIFIED || newStatus == GrievanceTypes.Status.CLOSED) require(manager, "manager required");
        if (newStatus == GrievanceTypes.Status.REJECTED) ValidationLib.requireHash(evidenceHash);
        GrievanceTypes.Status oldStatus = g.status;
        g.status = newStatus;
        auditTrail.append(id, msg.sender, ACTION_STATUS, keccak256(abi.encode(oldStatus, newStatus, evidenceHash)));
        emit StatusUpdated(id, oldStatus, newStatus, msg.sender, evidenceHash);
    }

    function submitResolution(uint256 id, bytes32 resolutionHash) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        require(msg.sender == g.assignedOfficer && roles.isOfficer(msg.sender), "assigned officer only");
        require(g.status == GrievanceTypes.Status.IN_PROGRESS, "not in progress");
        ValidationLib.requireHash(resolutionHash);
        GrievanceTypes.Status oldStatus = g.status;
        g.resolutionHash = resolutionHash;
        g.status = GrievanceTypes.Status.RESOLUTION_SUBMITTED;
        auditTrail.append(id, msg.sender, ACTION_RESOLUTION, resolutionHash);
        emit ResolutionSubmitted(id, msg.sender, resolutionHash);
        emit StatusUpdated(id, oldStatus, g.status, msg.sender, resolutionHash);
    }

    function verifyResolution(uint256 id, bytes32 feedbackHash) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        require(msg.sender == g.citizen, "owner citizen only");
        require(g.status == GrievanceTypes.Status.RESOLUTION_SUBMITTED || g.status == GrievanceTypes.Status.CITIZEN_VERIFICATION, "no resolution to verify");
        GrievanceTypes.Status oldStatus = g.status;
        g.status = GrievanceTypes.Status.RESOLVED;
        auditTrail.append(id, msg.sender, ACTION_VERIFIED, feedbackHash);
        emit ResolutionVerified(id, msg.sender, feedbackHash);
        emit StatusUpdated(id, oldStatus, g.status, msg.sender, feedbackHash);
    }

    function rejectResolution(uint256 id, bytes32 reasonHash) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        require(msg.sender == g.citizen, "owner citizen only");
        require(g.status == GrievanceTypes.Status.RESOLUTION_SUBMITTED || g.status == GrievanceTypes.Status.CITIZEN_VERIFICATION, "no resolution to reject");
        ValidationLib.requireHash(reasonHash);
        GrievanceTypes.Status oldStatus = g.status;
        g.status = GrievanceTypes.Status.REOPENED;
        g.reopenCount += 1;
        auditTrail.append(id, msg.sender, ACTION_RESOLUTION_REJECTED, reasonHash);
        emit ResolutionRejected(id, msg.sender, reasonHash);
        emit StatusUpdated(id, oldStatus, g.status, msg.sender, reasonHash);
    }

    function reopenGrievance(uint256 id, bytes32 reasonHash) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        bool citizen = msg.sender == g.citizen;
        require(citizen || departments.canManage(g.department, msg.sender), "not authorized");
        require(g.status == GrievanceTypes.Status.RESOLVED || g.status == GrievanceTypes.Status.CLOSED || g.status == GrievanceTypes.Status.REJECTED, "not reopenable");
        ValidationLib.requireHash(reasonHash);
        GrievanceTypes.Status oldStatus = g.status;
        g.status = GrievanceTypes.Status.REOPENED;
        g.reopenCount += 1;
        auditTrail.append(id, msg.sender, ACTION_REOPENED, reasonHash);
        emit GrievanceReopened(id, msg.sender, reasonHash, g.reopenCount);
        emit StatusUpdated(id, oldStatus, g.status, msg.sender, reasonHash);
    }

    function escalateGrievance(uint256 id, bytes32 reasonHash) external existing(id) {
        GrievanceTypes.Grievance storage g = grievances[id];
        require(!GrievanceLib.isTerminal(g.status) && g.status != GrievanceTypes.Status.RESOLVED, "terminal grievance");
        bool authority = departments.canManage(g.department, msg.sender);
        require(msg.sender == g.citizen || authority, "not authorized");
        ValidationLib.requireHash(reasonHash);
        GrievanceTypes.Status oldStatus = g.status;
        escalations.recordEscalation(id, g.priority, authority);
        g.status = GrievanceTypes.Status.ESCALATED;
        auditTrail.append(id, msg.sender, ACTION_ESCALATED, reasonHash);
        emit GrievanceEscalated(id, msg.sender, reasonHash, escalations.escalationLevel(id));
        emit StatusUpdated(id, oldStatus, g.status, msg.sender, reasonHash);
    }

    function getGrievance(uint256 id) external view existing(id) returns (GrievanceTypes.Grievance memory) { return grievances[id]; }
    function grievanceCount() external view returns (uint256) { return nextGrievanceId - 1; }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {RoleManager} from "../contracts/RoleManager.sol";
import {DepartmentManager} from "../contracts/DepartmentManager.sol";
import {EscalationManager} from "../contracts/EscalationManager.sol";
import {AuditTrail} from "../contracts/AuditTrail.sol";
import {GrievanceSystem} from "../contracts/GrievanceSystem.sol";
import {GrievanceTypes} from "../contracts/GrievanceTypes.sol";
import {IRoleManager} from "../interfaces/IRoleManager.sol";

/// @dev Framework-independent Solidity tests: Remix can deploy this contract and invoke test functions.
contract GrievanceActor {
    function create(GrievanceSystem system, bytes32 department) external returns (uint256) {
        return system.createGrievance(keccak256("road damage"), keccak256("off-chain description"), keccak256("INFRASTRUCTURE"), department, GrievanceTypes.Priority.HIGH);
    }

    function progress(GrievanceSystem system, uint256 id) external {
        system.updateStatus(id, GrievanceTypes.Status.IN_PROGRESS, keccak256("inspection metadata"));
        system.submitResolution(id, keccak256("resolution document stored off-chain"));
    }

    function verify(GrievanceSystem system, uint256 id) external {
        system.verifyResolution(id, keccak256("citizen feedback"));
    }

    function reject(GrievanceSystem system, uint256 id) external {
        system.rejectResolution(id, keccak256("resolution rejection reason"));
    }
}

contract GrievanceSystemTest {
    RoleManager private roles;
    DepartmentManager private departments;
    EscalationManager private escalations;
    AuditTrail private auditTrail;
    GrievanceSystem private system;
    GrievanceActor private citizen;
    GrievanceActor private officer;
    bytes32 private constant DEPARTMENT = keccak256("PUBLIC_WORKS");

    constructor() {
        roles = new RoleManager(address(this));
        departments = new DepartmentManager(IRoleManager(address(roles)));
        escalations = new EscalationManager(IRoleManager(address(roles)));
        auditTrail = new AuditTrail(address(this));
        system = new GrievanceSystem(IRoleManager(address(roles)), departments, escalations, auditTrail);

        // Complete both one-time trust links after deployment; this avoids circular constructors.
        escalations.bindGrievanceSystem(address(system));
        auditTrail.authorizeWriter(address(system));

        citizen = new GrievanceActor();
        officer = new GrievanceActor();
        roles.grantRole(roles.CITIZEN_ROLE(), address(citizen));
        roles.grantRole(roles.OFFICER_ROLE(), address(officer));
        roles.grantRole(roles.DEPARTMENT_ADMIN_ROLE(), address(this));
        departments.configureDepartment(DEPARTMENT, keccak256("department metadata"), address(this), true);
        departments.setDepartmentOfficer(DEPARTMENT, address(officer), true);
    }

    function testCompleteHappyPath() external {
        uint256 id = citizen.create(system, DEPARTMENT);
        system.updateStatus(id, GrievanceTypes.Status.UNDER_REVIEW, keccak256("review"));
        system.updateStatus(id, GrievanceTypes.Status.VERIFIED, keccak256("verification"));
        system.assignGrievance(id, address(officer));
        officer.progress(system, id);
        citizen.verify(system, id);

        GrievanceTypes.Grievance memory g = system.getGrievance(id);
        require(g.status == GrievanceTypes.Status.RESOLVED, "not resolved");
        require(g.citizen == address(citizen), "wrong citizen");
        require(g.assignedOfficer == address(officer), "wrong officer");
        require(auditTrail.getGrievanceRecordIndexes(id).length == 7, "incorrect audit count");
    }

    function testRejectAndReassign() external {
        uint256 id = citizen.create(system, DEPARTMENT);
        system.updateStatus(id, GrievanceTypes.Status.UNDER_REVIEW, bytes32(0));
        system.updateStatus(id, GrievanceTypes.Status.VERIFIED, bytes32(0));
        system.assignGrievance(id, address(officer));
        officer.progress(system, id);
        citizen.reject(system, id);
        GrievanceTypes.Grievance memory g = system.getGrievance(id);
        require(g.status == GrievanceTypes.Status.REOPENED, "not reopened");
        require(g.reopenCount == 1, "reopen not counted");
        system.assignGrievance(id, address(officer));
        require(system.getGrievance(id).status == GrievanceTypes.Status.ASSIGNED, "not reassigned");
    }

    function testDependenciesAndSLA() external view {
        require(address(system.roles()) == address(roles), "role dependency");
        require(escalations.grievanceSystem() == address(system), "system binding");
        require(auditTrail.writer(address(system)), "audit authorization");
        require(escalations.slaSeconds(GrievanceTypes.Priority.CRITICAL) == 1 days, "critical SLA");
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRoleManager} from "../interfaces/IRoleManager.sol";
import {GrievanceTypes} from "./GrievanceTypes.sol";
import {ValidationLib} from "../libraries/ValidationLib.sol";

/// @notice Department registry and officer membership. Metadata must not contain PII.
contract DepartmentManager {
    IRoleManager public immutable roles;
    mapping(bytes32 => GrievanceTypes.Department) private departments;
    mapping(bytes32 => mapping(address => bool)) private departmentOfficers;

    event DepartmentConfigured(bytes32 indexed departmentId, bytes32 indexed metadataHash, address indexed administrator, bool active);
    event DepartmentOfficerSet(bytes32 indexed departmentId, address indexed officer, bool enabled);

    modifier onlySuperAdmin() { require(roles.isSuperAdmin(msg.sender), "super admin only"); _; }
    modifier onlyDepartmentAuthority(bytes32 id) {
        GrievanceTypes.Department storage d = departments[id];
        require(roles.isSuperAdmin(msg.sender) || (roles.isDepartmentAdmin(msg.sender) && d.administrator == msg.sender), "department authority only");
        _;
    }

    constructor(IRoleManager roleManager) {
        ValidationLib.requireAddress(address(roleManager));
        roles = roleManager;
    }

    function configureDepartment(bytes32 id, bytes32 metadataHash, address administrator, bool active) external onlySuperAdmin {
        ValidationLib.requireHash(id);
        ValidationLib.requireHash(metadataHash);
        ValidationLib.requireAddress(administrator);
        require(roles.isDepartmentAdmin(administrator) || roles.isSuperAdmin(administrator), "administrator lacks role");
        departments[id] = GrievanceTypes.Department(id, metadataHash, administrator, active);
        emit DepartmentConfigured(id, metadataHash, administrator, active);
    }

    function setDepartmentOfficer(bytes32 id, address officer, bool enabled) external onlyDepartmentAuthority(id) {
        require(departments[id].id != bytes32(0), "unknown department");
        ValidationLib.requireAddress(officer);
        require(!enabled || roles.isOfficer(officer), "officer lacks role");
        departmentOfficers[id][officer] = enabled;
        emit DepartmentOfficerSet(id, officer, enabled);
    }

    function getDepartment(bytes32 id) external view returns (GrievanceTypes.Department memory) { return departments[id]; }
    function isActive(bytes32 id) external view returns (bool) { return departments[id].active; }
    function isDepartmentOfficer(bytes32 id, address officer) external view returns (bool) { return departmentOfficers[id][officer]; }
    function canManage(bytes32 id, address account) external view returns (bool) {
        return roles.isSuperAdmin(account) || (roles.isDepartmentAdmin(account) && departments[id].administrator == account);
    }
}

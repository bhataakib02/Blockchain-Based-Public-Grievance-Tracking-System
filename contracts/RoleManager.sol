// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IRoleManager} from "../interfaces/IRoleManager.sol";

/// @notice Central role source. Super admins administer every application role.
contract RoleManager is AccessControl, IRoleManager {
    bytes32 public constant override CITIZEN_ROLE = keccak256("CITIZEN_ROLE");
    bytes32 public constant override OFFICER_ROLE = keccak256("OFFICER_ROLE");
    bytes32 public constant override DEPARTMENT_ADMIN_ROLE = keccak256("DEPARTMENT_ADMIN_ROLE");
    bytes32 public constant override SUPER_ADMIN_ROLE = keccak256("SUPER_ADMIN_ROLE");

    constructor(address initialSuperAdmin) {
        require(initialSuperAdmin != address(0), "zero admin");
        _grantRole(DEFAULT_ADMIN_ROLE, initialSuperAdmin);
        _grantRole(SUPER_ADMIN_ROLE, initialSuperAdmin);
        _setRoleAdmin(CITIZEN_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(OFFICER_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(DEPARTMENT_ADMIN_ROLE, SUPER_ADMIN_ROLE);
        _setRoleAdmin(SUPER_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    }

    function hasRole(bytes32 role, address account) public view override(AccessControl, IRoleManager) returns (bool) {
        return super.hasRole(role, account);
    }

    function isCitizen(address account) external view override returns (bool) { return hasRole(CITIZEN_ROLE, account); }
    function isOfficer(address account) external view override returns (bool) { return hasRole(OFFICER_ROLE, account); }
    function isDepartmentAdmin(address account) external view override returns (bool) { return hasRole(DEPARTMENT_ADMIN_ROLE, account); }
    function isSuperAdmin(address account) external view override returns (bool) { return hasRole(SUPER_ADMIN_ROLE, account); }
}

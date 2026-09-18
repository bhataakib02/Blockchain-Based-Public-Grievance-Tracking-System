// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRoleManager {
    function CITIZEN_ROLE() external view returns (bytes32);
    function OFFICER_ROLE() external view returns (bytes32);
    function DEPARTMENT_ADMIN_ROLE() external view returns (bytes32);
    function SUPER_ADMIN_ROLE() external view returns (bytes32);
    function hasRole(bytes32 role, address account) external view returns (bool);
    function isCitizen(address account) external view returns (bool);
    function isOfficer(address account) external view returns (bool);
    function isDepartmentAdmin(address account) external view returns (bool);
    function isSuperAdmin(address account) external view returns (bool);
}

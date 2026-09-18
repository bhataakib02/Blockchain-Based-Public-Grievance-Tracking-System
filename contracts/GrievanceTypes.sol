// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Shared ABI types. User-provided text/files stay off-chain; bytes32 values are hashes or controlled metadata keys.
library GrievanceTypes {
    enum Status {
        SUBMITTED,
        UNDER_REVIEW,
        VERIFIED,
        ASSIGNED,
        IN_PROGRESS,
        RESOLUTION_SUBMITTED,
        CITIZEN_VERIFICATION,
        RESOLVED,
        CLOSED,
        REJECTED,
        ESCALATED,
        REOPENED
    }

    enum Priority { LOW, MEDIUM, HIGH, CRITICAL }

    struct Grievance {
        uint256 id;
        bytes32 title;
        bytes32 descriptionHash;
        bytes32 category;
        bytes32 department;
        Priority priority;
        address citizen;
        uint64 timestamp;
        Status status;
        address assignedOfficer;
        bytes32 resolutionHash;
        uint32 reopenCount;
    }

    struct Department {
        bytes32 id;
        bytes32 metadataHash;
        address administrator;
        bool active;
    }

    struct AuditRecord {
        uint256 grievanceId;
        address actor;
        bytes32 action;
        bytes32 dataHash;
        uint64 timestamp;
    }
}

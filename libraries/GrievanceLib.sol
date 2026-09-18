// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {GrievanceTypes} from "../contracts/GrievanceTypes.sol";

library GrievanceLib {
    function isTerminal(GrievanceTypes.Status status) internal pure returns (bool) {
        return status == GrievanceTypes.Status.CLOSED || status == GrievanceTypes.Status.REJECTED;
    }

    /// @dev Generic administrative workflow transitions. Assignment/resolution/citizen/escalation use dedicated entrypoints.
    function validAdministrativeTransition(GrievanceTypes.Status from, GrievanceTypes.Status to) internal pure returns (bool) {
        if (from == GrievanceTypes.Status.SUBMITTED) return to == GrievanceTypes.Status.UNDER_REVIEW || to == GrievanceTypes.Status.REJECTED;
        if (from == GrievanceTypes.Status.UNDER_REVIEW) return to == GrievanceTypes.Status.VERIFIED || to == GrievanceTypes.Status.REJECTED;
        if (from == GrievanceTypes.Status.VERIFIED) return to == GrievanceTypes.Status.REJECTED;
        if (from == GrievanceTypes.Status.ASSIGNED) return to == GrievanceTypes.Status.IN_PROGRESS;
        if (from == GrievanceTypes.Status.RESOLUTION_SUBMITTED) return to == GrievanceTypes.Status.CITIZEN_VERIFICATION;
        if (from == GrievanceTypes.Status.REOPENED || from == GrievanceTypes.Status.ESCALATED) return to == GrievanceTypes.Status.UNDER_REVIEW || to == GrievanceTypes.Status.IN_PROGRESS;
        if (from == GrievanceTypes.Status.RESOLVED) return to == GrievanceTypes.Status.CLOSED;
        return false;
    }
}

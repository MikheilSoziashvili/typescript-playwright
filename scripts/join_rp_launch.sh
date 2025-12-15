#!/bin/bash

# Script to run tests locally and append to existing ReportPortal launch
# Usage: ./scripts/join-rp-launch.sh <LAUNCH_ID> [playwright test arguments]

if [ -z "$1" ]; then
    echo "Error: ReportPortal Launch ID is required"
    echo "Usage: ./scripts/join-rp-launch.sh <LAUNCH_ID> [playwright test arguments]"
    exit 1
fi

LAUNCH_ID=$1
shift  # Remove first argument, rest are passed to Playwright

echo "Joining ReportPortal Launch: $LAUNCH_ID"

# Export environment variables for ReportPortal
export RP_ENABLED=true
export RP_LAUNCH_ID=$LAUNCH_ID
export RP_MODE=DEFAULT

# Run Playwright tests with remaining arguments
yarn playwright test "$@"

echo "Tests completed and appended to Launch: $LAUNCH_ID"
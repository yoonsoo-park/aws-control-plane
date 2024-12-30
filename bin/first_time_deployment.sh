#!/usr/bin/env bash

# TODO: EA - add the deploy command for the first time deployment
# cdk deploy AppTemplate-ComputeStack-${TARGET_ENV}-blue \
#     -c suffix=${TARGET_ENV} \
#     -c stage=blue \
#     --require-approval never

# cdk deploy AppTemplate-ComputeStack-${TARGET_ENV}-green \
#     -c suffix=${TARGET_ENV} \
#     -c stage=green \
#     --require-approval never
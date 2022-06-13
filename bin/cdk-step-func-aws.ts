#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StackMachineTest } from '../lib/stack-machine-test';

const app = new cdk.App();
new StackMachineTest(app, 'StackMachineTest');
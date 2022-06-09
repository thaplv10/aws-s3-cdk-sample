#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsS3CdkSampleStack } from '../lib/aws-s3-cdk-sample-stack';

const app = new cdk.App();
new AwsS3CdkSampleStack(app, 'AwsS3CdkSampleStack');

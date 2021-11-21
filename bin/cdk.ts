#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { VpcStackIpml } from '../lib/implements/vpcStackIpml';
import { SgStack } from '../lib/securityGroupStack';

const app = new cdk.App();
const vpcInstance = new VpcStackIpml(app, 'VpcStack');
const sg = new SgStack(vpcInstance);
const a = "a";


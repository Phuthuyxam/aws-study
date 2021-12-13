#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc-stack';
import { SgStack } from '../lib/security-group-stack';
import { Ec2Stack } from '../lib/ec2-stack';
import { AlbStack } from '../lib/alb-stack';
import {autoScalingStack} from '../lib/autoscaling-stack';
import {CodeBuildStack} from '../lib/codebuild-stack';
const app = new cdk.App();
const vpcInstance = new VpcStack(app, 'VpcStack');
const sgInstance = new SgStack(app, 'SgStack', { vpc: vpcInstance.getVpc() });
const ec2 = new Ec2Stack(app, 'Ec2Stack', { vpc: vpcInstance.getVpc(), sg: sgInstance });
const alb = new AlbStack(app, 'AlbStack', { vpc: vpcInstance.getVpc(), sg: sgInstance, ec2: ec2 });
const autoScaling = new autoScalingStack(app, 'AutoScalingStack', { vpc: vpcInstance.getVpc(), sg: sgInstance, ec2: ec2 });
const codebuild = new CodeBuildStack(app, 'CodeBuildStack');

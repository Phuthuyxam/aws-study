import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { SgStack } from '../security-group-stack';
export interface ec2StackProps extends cdk.StackProps{
    vpc: Vpc,
    sg : SgStack,
}
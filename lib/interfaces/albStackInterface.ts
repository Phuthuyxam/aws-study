import { SecurityGroup, Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { SgStack } from '../security-group-stack';
import { Ec2Stack } from '../ec2-stack';
export interface albStackProps extends cdk.StackProps{
    vpc: Vpc,
    sg : SgStack,
    ec2 : Ec2Stack
}
import { Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Ec2Stack } from '../ec2-stack';
import { SgStack } from '../security-group-stack';
export interface aslStackProps extends cdk.StackProps{ 
    vpc: Vpc,
    sg : SgStack,
    ec2 : Ec2Stack
}
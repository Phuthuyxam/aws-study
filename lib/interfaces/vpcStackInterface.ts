import { Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
export interface VpcStackProps extends cdk.StackProps{
    vpc : Vpc
}
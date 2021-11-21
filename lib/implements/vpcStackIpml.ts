import { Vpc, SubnetType } from "@aws-cdk/aws-ec2";
import { VpcStackInterface } from "../vpcStackInterface";
import * as cdk from '@aws-cdk/core';
import {getServiceName} from '../../helpers/common';

export class VpcStackIpml extends cdk.Stack implements VpcStackInterface {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    }

    vpcStack() {
        const vpcStack: Vpc = new Vpc(this, 'VPC', {
            cidr: '10.0.0.0/16',
            maxAzs: 2,
            natGateways: 1,
            subnetConfiguration: [
                {
                    subnetType: SubnetType.PUBLIC,
                    name: getServiceName('public-subnet'),
                    cidrMask: 24
                },
                {
                    subnetType: SubnetType.PRIVATE_WITH_NAT,
                    name: getServiceName('private-subnet'),
                    cidrMask: 24
                }
            ]
    
        });
        return vpcStack;
    }
    
}
//vpc-stack.ts
import { CfnNatGateway, Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import { InstanceIdTarget } from "@aws-cdk/aws-elasticloadbalancingv2-targets";
import { albStackProps } from './interfaces/albStackInterface'

export class AlbStack extends cdk.Stack {
  private alb : ApplicationLoadBalancer; 
  constructor(scope: cdk.Construct,
              id: string,
              props: albStackProps) {
    super(scope, id, props);

    this.alb = new ApplicationLoadBalancer(this, "alb", {
        vpc: props.vpc,
        internetFacing: true,
        securityGroup: props.sg.getAlbSg(),
        vpcSubnets: {
            subnetType: SubnetType.PUBLIC,
        },
    });

    const listener = this.alb.addListener("alb-listener", {
        port: 80,
    });
    listener.addTargets("alb-listener-target", {
        port: 80,
        targets: [new InstanceIdTarget(props.ec2.getEc2Private().instanceId)],
        healthCheck: {
            healthyHttpCodes: "200",
            path: "/",
        },
    });
    
  }
}

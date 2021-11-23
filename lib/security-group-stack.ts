import * as cdk from '@aws-cdk/core';
import { Peer, Port, SecurityGroup } from "@aws-cdk/aws-ec2";
import { VpcStackProps } from "./interfaces/vpcStackInterface";

export class SgStack extends cdk.Stack{
    basTionSg: SecurityGroup;
    albSg: SecurityGroup;
    webServerSg: SecurityGroup;
    constructor(scope: cdk.Construct,
        id: string,
        props: VpcStackProps) {
            
        super(scope, id, props);
        
        // register bastion sg
        const bastion = new SecurityGroup(this, 'bastion-sg', {
            vpc: props.vpc,
            allowAllOutbound: true
        });

        bastion.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
        this.basTionSg = bastion;

        // register load balencer sg
        const alb = new SecurityGroup(this, 'alb-sg', {
            vpc: props.vpc,
            allowAllOutbound: true
        });
        alb.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
        this.albSg = alb;

        // register webserver
        const webserver = new SecurityGroup(this, 'webserver-sg', {
            vpc: props.vpc,
            allowAllOutbound: true
        });
        webserver.connections.allowFrom(bastion, Port.tcp(22));
        webserver.connections.allowFrom(alb, Port.tcp(80));
        this.webServerSg = webserver;
    }
    getBastionSg() {
        return this.basTionSg;
    }
    getAlbSg() {
        return this.albSg;
    }
    getWebServerSg() {
        return this.webServerSg;
    }
}
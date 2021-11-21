import { Peer, Port, SecurityGroup } from "@aws-cdk/aws-ec2";
import { VpcStackIpml } from "./implements/vpcStackIpml";

export class SgStack {
    adapterVpcStack: VpcStackIpml;
    basTionSg: SecurityGroup;
    albSg: SecurityGroup;
    webServerSg: SecurityGroup;
    constructor(vpcStack : VpcStackIpml) {
        this.adapterVpcStack = vpcStack;
        
        // register bastion sg
        const bastion = new SecurityGroup(vpcStack, 'bastion-sg', {
            vpc: vpcStack.vpcStack(),
            allowAllOutbound: true
        });

        bastion.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
        this.basTionSg = bastion;

        // register load balencer sg
        const alb = new SecurityGroup(vpcStack, 'alb-sg', {
            vpc: vpcStack.vpcStack(),
            allowAllOutbound: true
        });
        alb.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
        this.albSg = alb;

        // register webserver
        const webserver = new SecurityGroup(vpcStack, 'alb-sg', {
            vpc: vpcStack.vpcStack(),
            allowAllOutbound: true
        });
        webserver.connections.allowFrom(bastion, Port.tcp(22));
        webserver.connections.allowFrom(alb, Port.tcp(80));
        this.webServerSg = webserver;
    }
}
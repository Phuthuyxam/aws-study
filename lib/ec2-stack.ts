//vpc-stack.ts
import { CfnNatGateway, Vpc, SubnetType, Instance } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { ec2StackProps } from './interfaces/ec2StackInterface';

export class Ec2Stack extends cdk.Stack {
  private ec2Bastion : Instance;
  private ec2Private : Instance;
  
  constructor(scope: cdk.Construct,
              id: string,
              props: ec2StackProps) {
    super(scope, id, props);

    // new bastion 
    this.ec2Bastion = new Instance(this, 'Bastion-ec2', {
        vpc: props.vpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            }),
            securityGroup: props.sg.getBastionSg(),
            keyName: "ec2-key-pair",
    });
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
        "sudo -i",
        "yum install -y httpd",
        "systemctl start httpd",
        "systemctl enable httpd",
        'echo "<h1>Hello World!</h1>" > /var/www/html/index.html'
    );

    this.ec2Private = new Instance(this, "Private-ec2", {
        vpc: props.vpc,
        vpcSubnets: {
            subnetType: SubnetType.PRIVATE_WITH_NAT,
        },
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage({
            generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
        securityGroup: props.sg.getWebServerSg(),
        keyName: "ec2-key-pair",
        userData,
    });
  }

  getEc2Bastion() {
    return this.ec2Bastion;
  }

  getEc2Private() {
    return this.ec2Private;
  }
}
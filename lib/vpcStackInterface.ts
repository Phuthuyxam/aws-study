import { Vpc } from "@aws-cdk/aws-ec2";

export interface VpcStackInterface {
    vpcStack: () => Vpc;
}
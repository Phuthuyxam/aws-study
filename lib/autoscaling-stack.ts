import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import { aslStackProps } from './interfaces/aslStackInterface';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

export class autoScalingStack extends cdk.Stack {

    /* 
        build a image -> code build
        => viết script ( chọn repo, commit id)

        new cdk => vpc , subnet, alb .., codebuild
        repo sửa code => commit id => codebuild =. chọn commit id => start build =>

        + khởi tạo 1 ec2 lên
        + cài source code
        + tạo image => my app
        + check image cũ => myapp:2 (nếu cần backup)
        + delete ec2

        code pipeline => tracking branch => codebuild

        => aws cli

        rds: mysql, pgsql, 
            aurora-mysql, aurora-pgsql ( sugget use )

        cluster db: support cân bằng tải.
    
    */


  
  constructor(scope: cdk.Construct,
              id: string,
              props: aslStackProps) {
    super(scope, id, props);
        // create autoscalingGroup
        const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc : props.vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            securityGroup: props.sg.getAutoScalingSg(),
            minCapacity: 1,
            maxCapacity: 4,
        });

        const workerUtilizationMetric = new cloudwatch.Metric({
            namespace: 'MyService',
            metricName: 'WorkerUtilization'
        });
        
        autoScalingGroup.scaleOnMetric('ScaleToCPU', {
          metric: workerUtilizationMetric,
          scalingSteps: [
            { upper: 10, change: -1 },
            { lower: 50, change: +1 },
            { lower: 70, change: +3 },
          ],
        
          // Change this to AdjustmentType.PERCENT_CHANGE_IN_CAPACITY to interpret the
          // 'change' numbers before as percentages instead of capacity counts.
          adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
        });

    }

}
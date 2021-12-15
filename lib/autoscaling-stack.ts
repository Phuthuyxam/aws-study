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


        tạo code commit

        phần 1: tạo infra
        + vpc, subnet, security-group
        phần 2: build web
        + alb, autoscaling, image


        // console -> tạo ec2 -> cài cắm => buildimage

        code build -> tạo image 

        tạo codecommit => source cdk
                       => source web

        tạo codebuild: 
                + repo: source cdk
                + commands:
                    - tạo image: build infa + dựng ec2 + lưu biến môi trường cho tên image
                    - tạo alb:
                    - tạo autoscaling



        domain: hostedzone, certificate
    */


  private autoScaling: autoscaling.AutoScalingGroup;
  constructor(scope: cdk.Construct,
              id: string,
              props: aslStackProps) {
    super(scope, id, props);
        
        // create autoscalingGroup
        this.autoScaling = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc : props.vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.lookup({
                name: <string>process.env.AMI_ID,
            }),
            securityGroup: props.sg.getAutoScalingSg(),
            minCapacity: 1,
            maxCapacity: 4,
        });

        const workerUtilizationMetric = new cloudwatch.Metric({
            namespace: 'MyService',
            metricName: 'WorkerUtilization'
        });
        
        this.autoScaling.scaleOnMetric('ScaleToCPU', {
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

    };

    getAutoscaling() {
        return this.autoScaling;
    }
}
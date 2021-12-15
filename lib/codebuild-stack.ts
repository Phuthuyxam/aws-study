import * as codecommit from '@aws-cdk/aws-codecommit';

//vpc-stack.ts
import { CfnNatGateway, Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import {getServiceName} from '../helpers/common';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { ComputeType } from '@aws-cdk/aws-codebuild';
import * as iam from '@aws-cdk/aws-iam';
import { Effect } from '@aws-cdk/aws-iam';



export class CodeBuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct,
              id: string,
              props?: cdk.StackProps) {
        super(scope, id, props);

        // make repo cdk
        // const gitHubSource = codebuild.Source.gitHub({
        //     owner: 'Phuthuyxam',
        //     repo: 'aws-study',
        //     webhook: true, // optional, default: true if `webhookFilters` were provided, false otherwise
        //     webhookTriggersBatchBuild: true, // optional, default is false
        //     webhookFilters: [
        //       codebuild.FilterGroup
        //         .inEventOf(codebuild.EventAction.PUSH)
        //         .andBranchIs('auto-scaling')
        //         .andCommitMessageIs('the commit message'),
        //     ],
        // });    
        // const codeBuildRole = new iam.Role(this, 'code-build-role', {
        //     assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        //     // managedPolicies: [
        //     //     iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
        //     // ],
        //   });
        // codeBuildRole.addToPolicy(new iam.PolicyStatement({
        //     resources: ['*'],
        //     actions: [
        //         "cloudformation:CreateStack",
        //         "cloudformation:CreateChangeSet",
        //         "cloudformation:ListStacks",
        //         "cloudformation:UpdateStack",
        //         "cloudformation:DescribeChangeSet",
        //         "cloudformation:ExecuteChangeSet"
        //     ],
        // }));


        // 👇 Create ACM Permission Policy
        const describeAcmCertificates = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: [
                        "sts:AssumeRole",
                        "cloudformation:*",
                        "ec2:*",
                        "ssm:GetParameters",
                        "iam:*"
                    ],
                }),
            ],
        });
    
        // 👇 Create Role
        const codeBuildRole = new iam.Role(this, 'example-iam-role', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            description: 'An example IAM role in AWS CDK',
            inlinePolicies: {
                DescribeACMCerts: describeAcmCertificates,
            },
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'AmazonAPIGatewayInvokeFullAccess',
                ),
            ],
        });

        new codebuild.Project(this, 'MyProject', {

            environment: {
                'computeType' : ComputeType.SMALL,
            },
            // environmentVariables: {         
            //     //INSTANCE_ID: { value: process.env.INSTANCE_ID },
            // },
            role: codeBuildRole,
            buildSpec: codebuild.BuildSpec.fromObject({
              version: '0.2',
              phases: {
                install: {
                  runtime_versions: {
                    nodejs: 12
                  },
                  commands: [
                    'echo "===== Build start ======"',
                    "n latest",
                    "npm -v",
                    
                    "npm install -g aws-cdk ",
                    "npm install -g typescript",
                    "cdk --version",

                    // "npm i -g aws-cdk",
                    "git version",
                    "git clone https://github.com/Phuthuyxam/aws-study.git",
                    "ls",
                    "cd aws-study",
                    "ls",

                    "aws --version",

                    "npm install",
                    "cdk deploy Ec2Stack --require-approval never",
                    "export VERSION=$(date +\\%Y\\%m\\%d\\%H\\%M\\%S)",
                    
                    `export INSTANCE_ID=$(aws cloudformation describe-stacks --stack-name Ec2Stack --output text --query="Stacks[0].Outputs[0].OutputValue")`,
                    "export AMI_NAME=web-ami-$VERSION",
                    // create image
                    `export AMI_ID=$(aws ec2 create-image --instance-id $INSTANCE_ID --name $AMI_NAME --output text)`,

                    // wait....
                    "aws ec2 wait image-available --image-ids $AMI_ID",
                    
                    "echo $AMI_ID",
                    // destroy ec2 stack

                    // run - cdk - autoscaling + alb

                    "cdk deploy AutoScalingStack --require-approval never",
                    "cdk deploy AlbStack --require-approval never",
                    "cdk destroy Ec2Stack --force",

                  ],
                },
              },
              
            }),

        });



    }
}
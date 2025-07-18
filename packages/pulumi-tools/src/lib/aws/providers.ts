import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import defu from "defu";
import { getCloudTemplateName, Provider } from "../../base/providers";

export function getAWSTemplateName() {
  return getCloudTemplateName(Provider.AWS);
}

export type CustomResourceOptions = pulumi.CustomResourceOptions & {
  scope: string;
  zone: string;
};

/**
 * Returns the provider options for AWS.
 *
 * @remarks
 * This function creates a new AWS provider with the region specified in the configuration.
 *
 * @returns The provider options for AWS.
 */
export function getProviderOpts(scope = "storm-cloud"): CustomResourceOptions {
  const config = new pulumi.Config("aws");

  const providerOpts = {
    provider: new aws.Provider(getAWSTemplateName(), {
      region: <aws.Region>config.require("aws_region")
    }),
    scope,
    zone: config.get("aws_zone") || "us-east-1a"
  };

  return providerOpts;
}

const size = aws.ec2.InstanceType.T2_Micro;

/**
 * Returns a VPC for the AWS provider.
 *
 * @remarks
 * This function creates a new default VPC with the specified tags.
 *
 * @param opts - Optional custom resource options.
 * @param appId - The application ID to use in the tags.
 * @param override - Optional overrides for the default VPC arguments.
 * @returns The default VPC resource.
 */
export function vpc(
  opts: CustomResourceOptions = getProviderOpts(),
  appId = "default",
  override: Partial<aws.ec2.DefaultVpcArgs> = {}
) {
  return new aws.ec2.DefaultVpc(
    `${opts.scope}-${appId}-${opts.zone}-vpc`,
    defu(
      {
        tags: {
          Scope: opts.scope,
          Name: `${opts.scope}-${appId}-vpc`,
          AppId: appId
        }
      },
      override
    ),
    opts
  );
}

/**
 * Returns a subnet for the AWS provider.
 *
 * @remarks
 * This function creates a new default subnet with the specified tags.
 *
 * @param opts - Optional custom resource options.
 * @param appId - The application ID to use in the tags.
 * @param override - Optional overrides for the default subnet arguments.
 * @returns The default subnet resource.
 */
export function subnet(
  opts: CustomResourceOptions = getProviderOpts(),
  appId = "default",
  override: Partial<aws.ec2.DefaultSubnetArgs> = {}
) {
  return new aws.ec2.DefaultSubnet(
    `${opts.scope}-${appId}-${opts.zone}-subnet`,
    defu(
      {
        availabilityZone: opts.zone,
        tags: {
          Scope: opts.scope,
          Name: `${opts.scope}-${appId}-${opts.zone}-subnet`,
          AppId: appId
        }
      },
      override
    ),
    opts
  );
}

/**
 * Returns a security group for the AWS provider.
 *
 * @remarks
 * This function creates a new security group with the specified tags.
 *
 * @param opts - Optional custom resource options.
 * @param appId - The application ID to use in the tags.
 * @param override - Optional overrides for the default security group arguments.
 * @returns The security group resource.
 */
export function securityGroup(
  vpc: aws.ec2.Vpc,
  opts: CustomResourceOptions = getProviderOpts(),
  appId = "default",
  override: Partial<aws.ec2.SecurityGroupArgs> = {}
) {
  return new aws.ec2.SecurityGroup(
    `${opts.scope}-${appId}-${opts.zone}-sg`,
    defu(
      {
        vpcId: vpc.id,
        description: `Enable HTTP access for ${
          appId === "default"
            ? opts.scope
            : appId !== opts.scope
              ? `${opts.scope}-${appId}`
              : opts.scope
        }`,
        ingress: [
          {
            protocol: aws.ec2.TCPProtocol,
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"]
          }
        ],
        tags: {
          Scope: opts.scope,
          Name: `${opts.scope}-${appId}-sg`,
          AppId: appId
        }
      },
      override
    ),
    opts
  );
}

export function ec2Instance(
  vpc: aws.ec2.Vpc,
  subnet: aws.ec2.Subnet,
  securityGroup: aws.ec2.SecurityGroup,
  opts: CustomResourceOptions = getProviderOpts(),
  appId = "default",
  override: Partial<aws.ec2.InstanceArgs> = {}
) {
  return new aws.ec2.Instance(
    `${opts.scope}-${appId}-${opts.zone}-ec2`,
    defu(
      {
        instanceType: size,
        ami: aws.ec2
          .getAmi({
            mostRecent: true,
            owners: ["amazon"],
            filters: [
              {
                name: "name",
                values: ["amzn2-ami-hvm-*-x86_64-gp2"]
              }
            ]
          })
          .then(ami => ami.id),
        subnetId: subnet.id,
        vpcSecurityGroupIds: [securityGroup.id],
        tags: {
          Scope: opts.scope,
          Name: `${opts.scope}-${appId}-ec2`,
          AppId: appId
        }
      },
      override
    ),
    opts
  );
}

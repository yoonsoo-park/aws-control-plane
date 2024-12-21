import { App, Stack, StackConfig, Utility } from '@ncino/aws-cdk';
import { WebsiteBucket } from '../storage/website-bucket';
import { WebsiteDistribution } from './cloudfront-distribution';
import { Tags } from 'aws-cdk-lib';
import { version } from '../../../package.json';
import { CfnOutput } from 'aws-cdk-lib';

export class WebsiteStack extends Stack {
	public readonly websiteBucket: WebsiteBucket;
	public readonly distribution: WebsiteDistribution;

	constructor(scope: App, props?: StackConfig) {
		super(
			scope,
			Utility.createResourceName(
				'WebsiteStack',
				scope.getContext('suffix'),
				scope.getContext('appName'),
			),
			props,
		);

		// Create S3 bucket for website hosting
		const bucketName = `omnichannel-website-${scope.getContext('suffix')}`;
		this.websiteBucket = new WebsiteBucket(this, bucketName);

		// Create CloudFront distribution
		this.distribution = new WebsiteDistribution(this, this.websiteBucket);

		// Add environment tags
		Tags.of(this).add('env', scope.getContext('suffix'));
		Tags.of(this).add('version', version);

		// Output the CloudFront URL
		new CfnOutput(this, 'WebsiteURL', {
			value: `https://${this.distribution.distributionDomainName}`,
			description: 'OmniChannel Control Plane website URL',
			exportName: `${scope.getContext('appName')}-website-url-${scope.getContext('suffix')}`,
		});
	}
}

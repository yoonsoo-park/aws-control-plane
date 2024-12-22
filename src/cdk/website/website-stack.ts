import { Feature, Stack, StageableStackProps } from '@ncino/aws-cdk';
import { WebsiteBucket } from '../storage/website-bucket';
import { WebsiteDistribution } from './cloudfront-distribution';
import { Tags } from 'aws-cdk-lib';
import { version } from '../../../package.json';
import { CfnOutput } from 'aws-cdk-lib';

export class WebsiteStack extends Stack {
	public readonly websiteBucket: WebsiteBucket;
	public readonly distribution: WebsiteDistribution;

	constructor(feature: Feature, id: string, props: StageableStackProps) {
		super(feature, id, props);

		// Create S3 bucket for website hosting
		const bucketName = `omnichannel-website-${feature.getContext('suffix')}`;
		this.websiteBucket = new WebsiteBucket(this, bucketName);

		// Create CloudFront distribution
		this.distribution = new WebsiteDistribution(this, this.websiteBucket);

		// Add environment tags
		Tags.of(this).add('env', feature.getContext('suffix'));
		Tags.of(this).add('version', version);

		// Output the CloudFront URL
		new CfnOutput(this, 'WebsiteURL', {
			value: `https://${this.distribution.distributionDomainName}`,
			description: 'OmniChannel Control Plane website URL',
			exportName: `${feature.getContext('appName')}-website-url-${feature.getContext('suffix')}`,
		});
	}
}

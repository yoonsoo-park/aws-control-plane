import { App, Stack, StackConfig, Utility } from '@ncino/aws-cdk';
import { WebsiteBucket } from '../storage/website-bucket';
import { Tags } from 'aws-cdk-lib';
import { version } from '../../../package.json';

export class WebsiteStack extends Stack {
	public readonly websiteBucket: WebsiteBucket;

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

		// Add environment tags
		Tags.of(this).add('env', scope.getContext('suffix'));
		Tags.of(this).add('version', version);
	}
}

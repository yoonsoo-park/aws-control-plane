import { Stack } from '@ncino/aws-cdk';
import {
	BlockPublicAccess,
	Bucket,
	BucketAccessControl,
	BucketEncryption,
	HttpMethods,
	ObjectOwnership,
} from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { RemovalPolicy } from 'aws-cdk-lib';
import { join } from 'path';

export class WebsiteBucket extends Bucket {
	constructor(stack: Stack, name: string) {
		super(stack, name, {
			bucketName: name.toLowerCase(),
			websiteIndexDocument: 'index.html',
			websiteErrorDocument: 'index.html', // SPA fallback
			publicReadAccess: false, // We'll use CloudFront for access
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			versioned: true,
			objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
			removalPolicy: RemovalPolicy.RETAIN,
			accessControl: BucketAccessControl.PRIVATE,
			cors: [
				{
					allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
					allowedOrigins: ['*'], // Will be restricted by CloudFront
					allowedHeaders: ['*'],
					maxAge: 3000,
				},
			],
		});
	}

	/**
	 * Deploys the static website content to the bucket
	 * @param stack The stack instance
	 * @param sourcePath Path to the build output directory
	 */
	deployWebsite(stack: Stack, sourcePath: string) {
		new BucketDeployment(stack, `${this.bucketName}-deployment`, {
			sources: [Source.asset(join(process.cwd(), sourcePath))],
			destinationBucket: this,
			retainOnDelete: true,
		});
	}
}

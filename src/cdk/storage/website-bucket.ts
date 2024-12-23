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
			publicReadAccess: true, // Enable public read access for testing
			blockPublicAccess: new BlockPublicAccess({
				// Allow public access for testing
				blockPublicAcls: false,
				blockPublicPolicy: false,
				ignorePublicAcls: false,
				restrictPublicBuckets: false,
			}),
			encryption: BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			versioned: true,
			objectOwnership: ObjectOwnership.OBJECT_WRITER,
			removalPolicy: RemovalPolicy.RETAIN,
			accessControl: BucketAccessControl.PUBLIC_READ, // Change to public read
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

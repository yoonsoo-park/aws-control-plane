import { Stack } from '@ncino/aws-cdk';
import {
	Distribution,
	ViewerProtocolPolicy,
	SecurityPolicyProtocol,
	OriginAccessIdentity,
	CachePolicy,
	CachePolicyProps,
	CachedMethods,
	AllowedMethods,
	ResponseHeadersPolicy,
	HeadersFrameOption,
	ResponseHeadersPolicyProps,
	HeadersReferrerPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Duration } from 'aws-cdk-lib';

export class WebsiteDistribution extends Distribution {
	constructor(stack: Stack, websiteBucket: IBucket) {
		// Create Origin Access Identity for S3
		const originAccessIdentity = new OriginAccessIdentity(stack, 'WebsiteOAI', {
			comment: `OAI for OmniChannel Control Plane website`,
		});

		// Grant read permissions to CloudFront
		websiteBucket.grantRead(originAccessIdentity);

		// Create cache policy
		const cachePolicy = new CachePolicy(stack, 'WebsiteCachePolicy', {
			...getDefaultCachePolicyProps(),
			comment: 'Cache policy for OmniChannel Control Plane website',
		});

		// Create security headers policy
		const securityHeadersPolicy = new ResponseHeadersPolicy(
			stack,
			'SecurityHeadersPolicy',
			getSecurityHeadersPolicyProps(),
		);

		super(stack, 'WebsiteDistribution', {
			defaultRootObject: 'index.html',
			defaultBehavior: {
				origin: new S3Origin(websiteBucket, {
					originAccessIdentity,
				}),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				cachePolicy,
				responseHeadersPolicy: securityHeadersPolicy,
				allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
				cachedMethods: CachedMethods.CACHE_GET_HEAD,
			},
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
			errorResponses: [
				{
					httpStatus: 404,
					responseHttpStatus: 200,
					responsePagePath: '/index.html', // SPA fallback
					ttl: Duration.minutes(5),
				},
			],
			enableLogging: true,
			comment: 'OmniChannel Control Plane website distribution',
		});
	}
}

function getDefaultCachePolicyProps(): CachePolicyProps {
	return {
		defaultTtl: Duration.days(1),
		maxTtl: Duration.days(365),
		minTtl: Duration.minutes(1),
		enableAcceptEncodingBrotli: true,
		enableAcceptEncodingGzip: true,
		comment: 'Default cache policy for static website',
	};
}

function getSecurityHeadersPolicyProps(): ResponseHeadersPolicyProps {
	return {
		comment: 'Security headers for OmniChannel Control Plane website',
		securityHeadersBehavior: {
			contentSecurityPolicy: {
				contentSecurityPolicy:
					"default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
				override: true,
			},
			strictTransportSecurity: {
				accessControlMaxAge: Duration.days(365),
				includeSubdomains: true,
				preload: true,
				override: true,
			},
			contentTypeOptions: {
				override: true,
			},
			frameOptions: {
				frameOption: HeadersFrameOption.DENY,
				override: true,
			},
			referrerPolicy: {
				referrerPolicy: HeadersReferrerPolicy.SAME_ORIGIN,
				override: true,
			},
			xssProtection: {
				protection: true,
				modeBlock: true,
				override: true,
			},
		},
	};
}

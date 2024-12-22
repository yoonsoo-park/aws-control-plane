import { Tags } from 'aws-cdk-lib';
import { StageableStack, Feature, StageableStackProps } from '@ncino/aws-cdk';
import { version } from '../../../package.json';
import { AppTempApiGateway } from './api-gateway';
import { AppTempKey } from '../security/kms/kms-key';

export class ApiStack extends StageableStack {
	restApiId: string;
	kmsKeyArn: string;

	constructor(feature: Feature, id: string, props: StageableStackProps) {
		super(feature, id, props);

		// Create KmsKey
		const kmsKey = new AppTempKey(this);
		this.kmsKeyArn = kmsKey.attrArn;

		// Create Api Gateway
		const apiGateway = new AppTempApiGateway(this);
		this.restApiId = apiGateway.restApiId;

		// add env tag
		Tags.of(this).add('env', feature.getContext('suffix'));
		Tags.of(this).add('version', version);
	}
}

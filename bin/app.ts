import { ApiStageType, Feature, StageableStackProps, Utility } from '@ncino/aws-cdk';
import { DeployStack } from '../deploy/deploy-stack';
import { ApiStack } from '../src/cdk/api/api-stack';
import { WebsiteStack } from '../src/cdk/website/website-stack';

const deployAccount = process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT;
const deployRegion = process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION;

const feature = new Feature({
	name: 'OmniChannelControlPlane',
	description: 'OmniChannel Control Plane for centralized nCino product access',
});
const stageName = feature.getContext('stage') || ApiStageType.BLUE;
const stackProps: StageableStackProps = {
	description:
		'Required. Contains API and static hosting resources for OmniChannel Control Plane.',
	env: { account: deployAccount, region: deployRegion },
	stageName,
};

if (Utility.isDevopsAccount()) {
	new DeployStack(feature);
} else {
	console.log('🛠  Website Stack');
	const websiteStack = new WebsiteStack(
		feature,
		`${feature.getFullName('WebsiteStack')}`,
		stackProps,
	);
	feature.setStack('websiteStack', websiteStack);

	console.log('🛠  API Stack');
	const apiStack = new ApiStack(feature, `${feature.getFullName('ApiStack')}`, stackProps);
	feature.setStack('apiStack', apiStack);

	// Set up dependencies
	feature.iamStack.addDependency(websiteStack);
	apiStack.addDependency(websiteStack);
}

feature.synth();

interface Product {
	id: string;
	name: string;
	description: string;
	environment?: string;
	accessUrl: string;
	requiredPermissions: string[];
}

const products: Product[] = [
	{
		id: 'ncino-bos',
		name: 'nCino Bank Operating System',
		description: 'The complete banking platform built on Salesforce.',
		environment: 'Production',
		accessUrl: 'https://ncino.my.salesforce.com',
		requiredPermissions: ['ncino_access'],
	},
	{
		id: 'spread',
		name: 'Spread',
		description: 'Financial spreading and analysis tool.',
		environment: 'Production',
		accessUrl: 'https://spread.ncino.com',
		requiredPermissions: ['spread_access'],
	},
	{
		id: 'portal',
		name: 'Customer Portal',
		description: 'Self-service portal for nCino customers.',
		environment: 'Production',
		accessUrl: 'https://portal.ncino.com',
		requiredPermissions: ['portal_access'],
	},
	{
		id: 'admin',
		name: 'Admin Console',
		description: 'Administrative tools and settings.',
		environment: 'Production',
		accessUrl: 'https://admin.ncino.com',
		requiredPermissions: ['admin_access'],
	},
];

export const getAuthorizedProducts = (userPermissions: string[]): Product[] => {
	return products.filter((product) =>
		product.requiredPermissions.some((permission) => userPermissions.includes(permission)),
	);
};

export const getAllProducts = (): Product[] => products;

export type { Product };

import { FC } from 'react';

interface ProductCardProps {
	name: string;
	description: string;
	environment?: string;
	accessUrl: string;
}

export const ProductCard: FC<ProductCardProps> = ({
	name,
	description,
	environment = 'Production',
	accessUrl,
}) => {
	const handleAccess = () => {
		window.open(accessUrl, '_blank');
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
			<div className="flex flex-col h-full">
				<div>
					<h3 className="text-xl font-semibold text-gray-900">{name}</h3>
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
						{environment}
					</span>
				</div>

				<p className="mt-4 text-gray-600 flex-grow">{description}</p>

				<button
					onClick={handleAccess}
					className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Access Product
				</button>
			</div>
		</div>
	);
};

import { FC } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';

interface Product {
	id: string;
	name: string;
	description: string;
	environment?: string;
	accessUrl: string;
}

interface ProductGridProps {
	products: Product[];
}

export const ProductGrid: FC<ProductGridProps> = ({ products }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					name={product.name}
					description={product.description}
					environment={product.environment}
					accessUrl={product.accessUrl}
				/>
			))}
		</div>
	);
};

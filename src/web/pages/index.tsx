import { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import { ProductGrid } from '../components/ProductGrid/ProductGrid';
import { getAuthorizedProducts } from '../utils/products';

const Home: NextPage = () => {
	const { user, isLoading, error } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg text-red-600">Error: {error.message}</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Please log in to access nCino products.</div>
			</div>
		);
	}

	const authorizedProducts = getAuthorizedProducts(user.permissions);

	return (
		<>
			<Head>
				<title>nCino OmniChannel Control Plane</title>
				<meta name="description" content="Centralized access point for nCino products" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Welcome to nCino OmniChannel
						</h1>
						<p className="text-xl text-gray-600">
							Access all your nCino products in one place
						</p>
					</div>

					{authorizedProducts.length > 0 ? (
						<ProductGrid products={authorizedProducts} />
					) : (
						<div className="text-center text-gray-600">
							No authorized products found. Please contact your administrator.
						</div>
					)}
				</div>
			</main>
		</>
	);
};

export default Home;

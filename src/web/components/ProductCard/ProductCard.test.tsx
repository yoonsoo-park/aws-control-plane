import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
	const mockProduct = {
		name: 'Test Product',
		description: 'Test Description',
		environment: 'Test Environment',
		accessUrl: 'https://test.ncino.com',
	};

	beforeEach(() => {
		// Mock window.open
		window.open = jest.fn();
	});

	it('renders product information correctly', () => {
		render(<ProductCard {...mockProduct} />);

		expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
		expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
		expect(screen.getByText(mockProduct.environment)).toBeInTheDocument();
	});

	it('opens product URL in new tab when access button is clicked', () => {
		render(<ProductCard {...mockProduct} />);

		const accessButton = screen.getByText('Access Product');
		fireEvent.click(accessButton);

		expect(window.open).toHaveBeenCalledWith(mockProduct.accessUrl, '_blank');
	});

	it('uses "Production" as default environment when not provided', () => {
		const productWithoutEnv = {
			name: 'Test Product',
			description: 'Test Description',
			accessUrl: 'https://test.ncino.com',
		};

		render(<ProductCard {...productWithoutEnv} />);
		expect(screen.getByText('Production')).toBeInTheDocument();
	});
});

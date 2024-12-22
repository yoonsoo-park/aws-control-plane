import { useState, useEffect } from 'react';

interface User {
	id: string;
	name: string;
	email: string;
	permissions: string[];
}

interface AuthState {
	user: User | null;
	isLoading: boolean;
	error: Error | null;
}

export const useAuth = () => {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// Simulate API call delay
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Mock user data
				const mockUser: User = {
					id: 'mock-user-1',
					name: 'John Doe',
					email: 'john.doe@ncino.com',
					permissions: [
						'ncino_access', // Permission for nCino Bank Operating System
						'spread_access', // Permission for Spread
						'portal_access', // Permission for Customer Portal
						'admin_access', // Admin access
					],
				};

				setAuthState({
					user: mockUser,
					isLoading: false,
					error: null,
				});
			} catch (error) {
				setAuthState({
					user: null,
					isLoading: false,
					error: error instanceof Error ? error : new Error('Authentication failed'),
				});
			}
		};

		checkAuth();
	}, []);

	const logout = async () => {
		try {
			// Simulate logout API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			setAuthState({
				user: null,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			setAuthState((prev) => ({
				...prev,
				error: error instanceof Error ? error : new Error('Logout failed'),
			}));
		}
	};

	return {
		...authState,
		logout,
	};
};

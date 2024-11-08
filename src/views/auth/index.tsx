import { Button } from '~/views/components/ui/button';
import { Input } from '~/views/components/ui/input';
import { makeEndpointRequest } from '~/utils/api';
import Container from '~/views/layout/container';
import { useState } from 'react';

const Auth = ({ setup }: { setup: boolean }) => {
	// State to hold the input field values for username and password
	const [fields, setFields] = useState({
		username: '',
		password: ''
	});

	// Function to update specific input field values (username or password)
	const updateField = (key: 'username' | 'password', value: string) => setFields((prev) => ({ ...prev, [key]: value }));

	// Function to handle form submission (either setup or login)
	const onSubmit = async () => {
		// Make API request to the appropriate endpoint (either /api/setup or /api/auth)
		const { status, data } = await makeEndpointRequest(setup ? '/api/setup' : '/api/auth', 'POST', fields);

		// If the request is successful (status 200), reload the page
		if (status === 200) {
			return location.reload();
		}

		// If the request fails, log the status and error data
		return console.error(status, ' - ', data);
	};

	return (
		<Container title={setup ? 'Setup' : 'Authentication'} session={null}>
			<div className="w-screen h-screen overflow-hidden flex justify-center items-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">TzuOS</h1>
						<p className="text-sm text-muted-foreground">{setup ? 'Setup a TzuOS account.' : 'Connect to your TzuOS account.'}</p>
					</div>

					<div className="grid gap-6">
						<div className="grid gap-2">
							{/* Input fields for username and password */}
							<Input type="text" onChange={(e) => updateField('username', e.target.value)} value={fields.username} placeholder="Enter your username" />
							<Input type="password" onChange={(e) => updateField('password', e.target.value)} value={fields.password} placeholder="Enter your password" />
						</div>

						{/* Submit Button with different labels based on setup or authentication */}
						<Button onClick={onSubmit}>{setup ? 'Complete Setup!' : 'Connect'}</Button>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Auth;

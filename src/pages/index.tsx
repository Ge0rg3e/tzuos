import { getSessionUser, type Session } from '~/server/auth';
import { GetServerSideProps, NextPage } from 'next';
import Dashboard from '~/views/dashboard';
import { db } from '~/server/db';
import Auth from '~/views/auth';

// Main page component that renders the Dashboard if authenticated, otherwise renders the Auth component
const Index: NextPage<{ setup: boolean; authenticated: boolean; session: Session }> = ({ setup, authenticated, session }) => {
	// If authenticated, render the Dashboard; otherwise, render the Auth component
	return authenticated ? <Dashboard session={session} /> : <Auth setup={setup} />;
};

// Server-side function to fetch user session and check if the setup is complete
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	// Retrieve the user session using the token from cookies
	const session = await getSessionUser(ctx.req.cookies.token as string);

	// Query the database to check for existing user accounts
	const accounts = await db.user.findMany();

	// Determine if the user is authenticated (i.e., session exists)
	const authenticated = session ? true : false;

	// Check if the setup is complete (i.e., no accounts exist)
	const setup = accounts.length === 0;

	// Return the session, authentication status, and setup state as props to the page
	return {
		props: { setup, authenticated, session }
	};
};

export default Index;

import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Fragment, type ReactNode } from 'react';
import { type Session } from '~/server/auth';
import Desktop from '../desktop';
import Head from 'next/head';

interface Props {
	children: ReactNode;
	loading?: boolean;
	session: Session;
	title?: string;
}

const Container = (props: Props) => {
	return (
		<Fragment>
			<Head>
				<title>{props.title ? `TzuOS | ${props.title}` : 'TzuOS'}</title>
			</Head>

			{props.loading ? (
				<div className="w-screen h-screen flex justify-center items-center">
					<LoadingSpinner className="size-[50px]" />
				</div>
			) : (
				<Fragment>
					{props.session && <Desktop />}
					<main className="animate-fadeIn">{props.children}</main>
				</Fragment>
			)}
		</Fragment>
	);
};

export default Container;

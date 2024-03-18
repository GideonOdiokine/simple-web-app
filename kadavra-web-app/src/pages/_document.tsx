import Document, {
	DocumentContext,
	DocumentInitialProps,
	Html,
	Head,
	Main,
	NextScript,
} from "next/document";

class MyDocument extends Document {
	static async getInitialProps(
		ctx: DocumentContext
	): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx);

		return initialProps;
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel='manifest' href='/manifest.json' />
					<meta name='theme-color' content='#061A14' />
					<link rel='apple-touch-icon' href='/192.png' />
					<meta
						name='description'
						content='Buy Currency at the Best Exchange Rate in Nigeria.'
					/>
					<link rel='manifest' href='/manifest.json' />
					<meta name='author' content='Kadavra' />
					<meta name='keywords' content='Kadavra, exchange, USD, NGN' />
					<meta name='Kadavra' content='Kadavra' />
					<meta property='og:type' content='website' />
					<meta property='og:site_name' content='Kadavra web app' />
					<meta property='og:locale' content='en_US' />
					<meta name='twitter:card' content='summary' />
					<meta name='twitter:site' content='@kadavra'></meta>
					<meta name='twitter:creator' content='@kadavra'></meta>
				</Head>
				<body>
					<Main />
					<NextScript />
					{/*Below we add the modal wrapper*/}
					<div id='modal-root'></div>
				</body>
			</Html>
		);
	}
}

export default MyDocument;

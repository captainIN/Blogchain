import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* PWA primary color */}
                    <meta name="theme-color"
                        content={theme.palette.primary.main} />
                    <link rel="shortcut icon"
                        href="/static/favicon.ico" />
                    <meta property="og:title" content="BlogChain" />
                    <meta property="og:site_name" content="BlogChain" />
                    <meta property="og:url" content="https://blogchain-rouge.vercel.app" />
                    <meta property="og:description" content="The Blog website built on Solana by Jaymanyoo. Users can signup, post blogs, comment on posts by harnessing the decentalised power of blockchain." />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content="https://ibb.co/kHMjjTT" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Anek+Latin:wght@100;200;300;400;700;800&display=swap" rel="stylesheet" />
                    {/* Inject MUI styles first to match with the prepend: true configuration. */}
                    {this.props.emotionStyleTags}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same emotion cache between 
    // all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await Document.getInitialProps(ctx);

    // This is important. It prevents emotion to render invalid HTML.
    // See 
    // https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153

    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}

            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};
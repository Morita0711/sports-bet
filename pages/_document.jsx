import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NXJHB2M');`,
            }}
          ></script>
          <link href="/favicon.png" rel="icon" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
          <link href="/icofont/icofont.min.css" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Lato:400,300,700,900"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.theme.min.css"
          />
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXJHB2M"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>
          <script
            type="application/javascript"
            src="https://widgets.sir.sportradar.com/0d905e362c5699706f12d1ae01831e4d/widgetloader"
            data-sr-language="pt"
            async
          ></script>

          {/* <script dangerouslySetInnerHTML={{
            __html: `(function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
    g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
    )})(window,document,"script","https://widgets.sir.sportradar.com/sportradar/widgetloader","SIR", {
        language: 'en',
        debug: true
    });`}}>
          </script>  */}

          <Main />
          <script
            type="text/javascript"
            src="https://code.jquery.com/jquery-1.12.0.min.js"
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj"
            crossOrigin="anonymous"
          ></script>
          <script
            type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.js"
          ></script>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/venobox/1.9.3/venobox.min.css"
            integrity="sha512-e+0yqAgUQFoRrJ4pZigQXpOE0S7J9IGwmgH801h4H5ODqOCG8/GRfXHQ+9ab754NL79O7wDwdjwY3CcU8sEANg=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

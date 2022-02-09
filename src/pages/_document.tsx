import React from 'react';
import NextDocument, { DocumentContext } from 'next/document';
import { ServerStyleSheet as StyledServerStyleSheet } from 'styled-components';
import { ServerStyleSheets as MaterialStylesSheets } from '@material-ui/core/styles';

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const styledSheet = new StyledServerStyleSheet();
    const materialSheet = new MaterialStylesSheets();

    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledSheet.collectStyles(
              materialSheet.collect(<App {...props} />),
            ),
        });

      const initialProps = await NextDocument.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {materialSheet.getStyleElement()}
            {styledSheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledSheet.seal();
    }
  }
}

import React from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => (
  <>
    <Head>
      <title>{props.title || 'WatchWith'}</title>
      <link rel="shortcut icon" type="image/png" href="/static/images/Icon-32.png" />
      <link rel="manifest" href="/static/manifest.json" />
    </Head>
    <div className={props.player ? 'playerContainer' : 'container'}>
      {props.children}
    </div>
    <footer className="footer text-muted">
      Made with <FontAwesomeIcon icon="heart" className="heart" /> by <a className="link" href="https://juanm04.com" target="_blank" rel="noopener noreferrer">JuanM04</a>
    </footer>
  </>
)
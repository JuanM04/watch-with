import React from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default props => (
  <>
    <Head>
      <title>{props.title || 'WatchWith'}</title>
    </Head>
    <div className={props.player ? 'playerContainer' : 'container'}>
      {props.children}
    </div>
    <footer className="footer text-muted">
      Made with <FontAwesomeIcon icon="heart" className="footerHeart" /> by <a className="footerLink" href="https://juanm04.com" target="_blank" rel="noopener noreferrer">JuanM04</a>
    </footer>
  </>
)
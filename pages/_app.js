import React from 'react';
import App, { Container } from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'
import '../src/styles/main.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckCircle, faPlayCircle, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faTwitch } from '@fortawesome/free-brands-svg-icons'

library.add(
  faCheckCircle, faPlayCircle, faHeart,
  faYoutube, faTwitch,
)



class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    online: global.navigator ? global.navigator.onLine : true
  }

  componentDidMount = () => {
    window.addEventListener('online', this.goOnline)
    window.addEventListener('offline', this.goOffline)
  }

  componentWillUnmount = () => {
    window.removeEventListener('online', this.goOnline)
    window.removeEventListener('offline', this.goOffline)
  }

  goOnline = () => this.setState({ online: true })
  goOffline = () => this.setState({ online: false })

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} online={this.state.online} />
      </Container>
    );
  }
}

export default MyApp;
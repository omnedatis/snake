import '../styles/globals.css'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import moment from 'moment';

export default function MyApp({ Component, pageProps }) {

  return <Component {...pageProps} />
}

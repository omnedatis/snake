import '../styles/globals.css'
import {useState, useEffect} from 'react'
import { useHistory } from 'react-router'

function MyApp({ Component, pageProps }) {
  const [isGameOver, setIsGameOver] = useState(false);
  // console.log(isGameOver)
  // useEffect(()=>{
  //   location.reload()
  // }, [])
  pageProps = {isGameOver, setIsGameOver, ...pageProps}
  return <Component {...pageProps} />

}

export default MyApp

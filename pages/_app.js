import '../styles/globals.css'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import moment from 'moment';

function MyApp({ Component, pageProps }) {
  const [isGameOver, setIsGameOver] = useState(false);
  // console.log(isGameOver)
  // useEffect(()=>{
  //   location.reload()
  // }, [])
  // console.log(moment().toString())
  // const router = useRouter()
  // let { delay, teleport } = router.query
  // console.log(teleport, 's')
  // delay = delay || 200
  // teleport = teleport ? true : false
  // console.log(teleport)
  // console.log(456)
  // sleep()
  pageProps = {isGameOver, setIsGameOver, ...pageProps}
  return <Component {...pageProps} />

}
async function sleep(){
  console.log('before');
  await new Promise((e)=>setTimeout(e, 10000));
  console.log('after')
}
export default MyApp

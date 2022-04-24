import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Localstack UI</title>
        <meta name="description" content="UI for working with localstack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.grid}>
          <a href="/ui/s3" className={styles.card}>
            <h2>S3 &rarr;</h2>
            <p>Click to see your buckets</p>
          </a>
        </div>
      </main>
    </div>
  )
}

export default Home

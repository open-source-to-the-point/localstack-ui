import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

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
          <Link href="/ui/s3">
            <a className={styles.card}>
              <h2>S3 &rarr;</h2>
              <p>Click to see your buckets</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;

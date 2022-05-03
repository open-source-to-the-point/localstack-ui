import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Slider from "@mui/material/Slider";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Localstack UI</title>
        <meta name="description" content="UI for working with localstack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <Slider defaultValue={30} className="text-green-700" />
        </div>
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

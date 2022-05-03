import { useRouter } from "next/router";
import config from "src/pages/config";

function BucketDetails({ data }: any) {
  const router = useRouter();
  const { bucketName } = router.query;
  return <h2>{bucketName}</h2>;
}

export async function getServerSideProps() {
  const response = await fetch(config.ui.s3.listBuckets);
  if (response.status !== 200) {
    return { props: {} };
  }

  const { data } = await response.json();
  return { props: { data } };
}

export default BucketDetails;

import { useRouter } from "next/router";
import apiRoutes from "@configs/apiRoutes";

function BucketDetails({ data }: any) {
  const router = useRouter();
  const { bucketName } = router.query;
  return <h2>{bucketName}</h2>;
}

export async function getServerSideProps() {
  const response = await fetch(apiRoutes.ui.s3.listBuckets);
  if (response.status !== 200) {
    return { props: {} };
  }

  const { data } = await response.json();
  return { props: { data } };
}

export default BucketDetails;

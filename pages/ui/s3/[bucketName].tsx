import { useRouter } from 'next/router';
import config from 'pages/config';

function BucketDetails({ data }: any) {
    const router = useRouter();
    const { bucketName } = router.query;
    return <h2>{bucketName}</h2>;
}

// export async function getServerSideProps() {
//     const response = await fetch(config.ui.s3.listBuckets);
//     const { data } = await response.json();

//     return { props: { data } };
// }

export default BucketDetails;

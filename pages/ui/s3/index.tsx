import Buckets from './buckets';
import config from 'pages/config';

function S3Main({ data }: any) {
    if (!data) return (
        <div className="w-full text-center">
            <code className='text-red-500'>
                Error occurred while fetching bucket list from S3
            </code>
        </div>
    );

    return (
        <div className="flex justify-center mt-16">
            <table className="w-1/2 text-center">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <Buckets bucketDetails={data}></Buckets>
                </tbody>
            </table>
        </div>
    );
}

export async function getServerSideProps() {
    const response = await fetch(config.ui.s3.listBuckets);
    if (response.status !== 200) {
        return { props: {} };
    }

    const { data } = await response.json();

    return { props: { data } };
}

export default S3Main;

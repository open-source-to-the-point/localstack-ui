import Buckets from './buckets';
import config from 'pages/config';

function S3Main({ data }: any) {
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
    const { data } = await response.json();

    return { props: { data } };
}

export default S3Main;

import { useRouter } from 'next/router';

const Bucket = ({ bucket: { name, creationDate, creationTime } }: any) => {
    const router = useRouter();
    const routeToBucketDetails = () => {
        router.push(`${router.route}/${name}`);
    }

    return (
        <tr>
            <td className="text-blue-500 cursor-pointer" onClick={routeToBucketDetails}>{name}</td>
            <td>{creationDate}</td>
            <td>{creationTime}</td>
        </tr>
    );
}

const Buckets = ({ bucketDetails }: any) => {
    return bucketDetails.map((bucket: any) => <Bucket key={bucket.name} bucket={bucket} />);
};

export default Buckets;

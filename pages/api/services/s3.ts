import { ListBucketsOutput, S3 } from '@aws-sdk/client-s3';
import config from 'pages/config';

interface IBucketDetails {
    name: string;
    creationDate: string;
    creationTime: string;
};

class S3Service extends S3 {
    async getBucketDetails(): Promise<IBucketDetails[]> {
        const { Buckets: buckets } = await this.listBuckets({});
        if (!buckets) {
            return [];
        }

        return buckets.map(bucket => {
            const { Name: name = 'NAME_NOT_CONFIGURED', CreationDate } = bucket;
            const [creationDate, creationTime] = new Date(CreationDate as unknown as string).toLocaleString().split(',');

            return {
                name,
                creationDate,
                creationTime,
            };
        });
    }
}

export default new S3Service(config.aws);

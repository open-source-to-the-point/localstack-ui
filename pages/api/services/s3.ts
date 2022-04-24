import { ListBucketsOutput, S3 } from '@aws-sdk/client-s3';
import config from 'pages/config';

interface IBucketDetails {
    name: string;
    creationDate: string;
    creationTime: string;
};

class S3Service {
    private s3: S3;
    constructor(s3Config: Record<string, unknown>) {
        this.s3 = new S3(s3Config);
    }

    async listBuckets(): Promise<IBucketDetails[]> {
        const { Buckets: buckets } = await this.s3.listBuckets({});
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

    async listObjects(): Promise<void> {
        return;
    }
}

export default new S3Service(config.aws);

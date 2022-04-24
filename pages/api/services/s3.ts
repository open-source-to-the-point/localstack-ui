import { S3 } from '@aws-sdk/client-s3';
import config from 'pages/config';

interface IBucketList {
    name: string;
    creationDate: string;
    creationTime: string;
};

interface IObjectList {

}

class S3Service {
    private s3: S3;
    constructor() {
        this.s3 = new S3(config.aws);
    }

    async listBuckets(): Promise<IBucketList[]> {
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

    async listObjects({ bucket }: { bucket: string }): Promise<void | IObjectList[]> {
        if (!bucket) return [];
        const response = await this.s3.listObjectsV2({ Bucket: bucket });
        console.log("++++++", response);
        return;
    }
}

export default new S3Service();

import { S3 } from '@aws-sdk/client-s3';
import { getLocaleTime } from '@pages/utils/get-locale-time';
import config from 'pages/config';

interface IBucket {
    name: string;
    creationDate: string;
    creationTime: string;
};

export interface IListObjects {
    dirs: string[],
    objects: {
        key: string,
        lastModifiedDate: string,
        lastModifiedTime: string
    }[]
}

class S3Service {
    private s3: S3;
    constructor() {
        this.s3 = new S3(config.aws);
    }

    createBucket(bucket: string) {
        return this.s3.createBucket({ Bucket: bucket });
    }

    async listBuckets(): Promise<IBucket[]> {
        const { Buckets: buckets } = await this.s3.listBuckets({});
        if (!buckets) {
            return [];
        }

        return buckets.map(bucket => {
            const { Name: name = 'NAME_NOT_CONFIGURED', CreationDate } = bucket;
            const [creationDate, creationTime] = getLocaleTime(CreationDate);

            return {
                name,
                creationDate,
                creationTime,
            };
        });
    }

    async listObjects({ bucket, dir }: { bucket: string, dir: string }): Promise<IListObjects> {
        if (!bucket) throw new Error('Bucket not specified');
        const response = await this.s3.listObjectsV2({ Bucket: bucket, Delimiter: `/${dir ? dir : ''}`, MaxKeys: 1000 });

        const dirs = response?.CommonPrefixes?.map(({ Prefix }) => Prefix) || [];
        const objects = response?.Contents?.map(({ Key, LastModified }) => {
            const [lastModifiedDate, lastModifiedTime] = getLocaleTime(LastModified);
            return { key: Key, lastModifiedDate, lastModifiedTime };
        }) || [];

        return { dirs, objects } as IListObjects;
    }
}

export default new S3Service();

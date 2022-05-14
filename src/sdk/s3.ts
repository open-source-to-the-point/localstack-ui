import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getLocaleTime } from "src/utils/get-locale-time";

interface IBucket {
  name: string;
  creationDate: string;
  creationTime: string;
}

export interface IListObjects {
  dirs: string[];
  objects: {
    key: string;
    lastModifiedDate: string;
    lastModifiedTime: string;
  }[];
}

const AWS_CONFIG = {
  endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
  sslEnabled: process.env.AWS_ENDPOINT_SSL_ENABLED === 'true' || false,
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true' || true,
};
const PRESIGNED_URL_EXPIRY = Number(process.env.AWS_S3_PRESIGNED_URL_EXPIRY) || 3600;

class S3Service {
  private s3: S3;
  constructor() {
    this.s3 = new S3(AWS_CONFIG);
  }

  createBucket(bucket: string) {
    return this.s3.createBucket({ Bucket: bucket });
  }

  deleteBucket(bucket: string) {
    return this.s3.deleteBucket({ Bucket: bucket });
  }

  async listBuckets(): Promise<IBucket[]> {
    const { Buckets: buckets } = await this.s3.listBuckets({});
    if (!buckets) {
      return [];
    }

    return buckets.map((bucket) => {
      const { Name: name = "NAME_NOT_CONFIGURED", CreationDate } = bucket;
      const [creationDate, creationTime] = getLocaleTime(CreationDate);

      return {
        name,
        creationDate,
        creationTime,
      };
    });
  }

  async getPresignedUrl({ bucket, key, action = 'GET' }: { bucket: string, key: string, action: string }): Promise<string> {
    const supportedActions: Record<string, GetObjectCommand | PutObjectCommand> = {
      'GET': new GetObjectCommand({ Bucket: bucket, Key: key }),
      'PUT': new PutObjectCommand({ Bucket: bucket, Key: key }),
    };

    if (!supportedActions[action]) {
      throw new Error('GetPresignedUrl: INVALID ACTION');
    }

    const url = await getSignedUrl(this.s3 as any, supportedActions[action] as any, { expiresIn: PRESIGNED_URL_EXPIRY });
    return url;
  }

  async listObjects({
    bucket,
    dir,
  }: {
    bucket: string;
    dir: string;
  }): Promise<IListObjects> {
    if (!bucket) throw new Error("Bucket not specified");
    const response = await this.s3.listObjectsV2({
      Bucket: bucket,
      Prefix: `${dir ? dir : ""}`,
      Delimiter: `/${dir ? dir : ""}`,
      MaxKeys: 1000,
    });

    const dirs = response?.CommonPrefixes?.map(({ Prefix }) => Prefix) || [];
    const objects =
      response?.Contents?.map(({ Key, LastModified }) => {
        const [lastModifiedDate, lastModifiedTime] =
          getLocaleTime(LastModified);
        return { key: Key, lastModifiedDate, lastModifiedTime };
      }) || [];

    return { dirs, objects } as IListObjects;
  }

  async deleteObject({ bucket, key }: { bucket: string, key: string }): Promise<void> {
    await this.s3.deleteObject({ Bucket: bucket, Key: key });
  }
}

export default new S3Service();

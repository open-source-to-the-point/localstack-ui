import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";
import s3Service from "@sdk/s3";
import { IListBuckets } from "./list-buckets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API.SUCCESS<IListBuckets[]> | API.ERROR>
) {
  try {
    const { bucket } = req.query as { bucket: string; dir: string };
    if (!bucket) {
      return res
        .status(status.BAD_REQUEST)
        .json({ code: "BUCKET_NAME_NOT_PROVIDED" });
    }

    await s3Service.createBucket(bucket);
    const bucketDetails = await s3Service.listBuckets();
    res.status(status.OK).json({ code: status[200], data: bucketDetails });
  } catch (error: unknown) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ code: "CREATE_BUCKET_FAILED", error });
  }
}

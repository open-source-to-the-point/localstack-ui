import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";
import s3Service from "@sdk/s3";
import { IBucket } from "@interfaces/s3";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<API.SUCCESS<IBucket[]> | API.ERROR>
) {
  try {
    const bucketDetails = await s3Service.listBuckets();
    res.status(status.OK).json({ code: status[200], data: bucketDetails });
  } catch (error: unknown) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ code: "LIST_BUCKETS_FAILED", error });
  }
}

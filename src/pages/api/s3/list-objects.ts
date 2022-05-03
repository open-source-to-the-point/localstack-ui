import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";
import s3Service, { IListObjects } from "@sdk/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<API.SUCCESS<IListObjects> | API.ERROR>
) {
  try {
    const { bucket, dir } = req.query as { bucket: string; dir: string };
    const bucketDetails = await s3Service.listObjects({ bucket, dir });
    res.status(status.OK).json({ code: status[200], data: bucketDetails });
  } catch (error: unknown) {
    console.error(error);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ code: "LIST_OBJECTS_FAILED", error: error });
  }
}

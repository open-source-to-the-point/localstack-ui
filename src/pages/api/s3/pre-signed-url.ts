import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";
import s3Service from "@sdk/s3";

// GET pre-signed-url?bucket=<bucket-name>&key=<path>&action='PUT | GET'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<API.SUCCESS<string> | API.ERROR>
) {
    try {
        const { bucket, key, action } = req.query as { bucket: string; key: string; action: string };
        const url = await s3Service.getPresignedUrl({ bucket, key, action });
        res.status(status.OK).json({ code: status[200], data: url });
    } catch (error: unknown) {
        console.error(error);
        res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ code: "GET_PRESIGNED_URL_FAILED", error: error });
    }
}

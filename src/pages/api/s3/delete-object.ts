import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";
import s3Service from "@sdk/s3";

// DELETE delete-object?bucket=<bucket-name>&key=<path>
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<API.SUCCESS<string> | API.ERROR>
) {
    try {
        const { bucket, key } = req.query as { bucket: string; key: string; };
        await s3Service.deleteObject({ bucket, key });
        res.status(status.OK).json({ code: status[200], data: key });
    } catch (error: unknown) {
        console.error(error);
        res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ code: "DELETE_OBJECT_FAILED", error: error });
    }
}

import type { NextApiRequest, NextApiResponse } from "next";
import status from "http-status";
import s3Service from "@sdk/s3";

// DELETE delete-dir?bucket=<bucket-name>&dir=<path>
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<API.SUCCESS<string> | API.ERROR>
) {
    try {
        const { bucket, dir } = req.query as { bucket: string; dir: string; };
        await s3Service.deleteDir({ bucket, dir });
        res.status(status.OK).json({ code: status[200], data: dir });
    } catch (error: unknown) {
        console.error(error);
        res
            .status(status.INTERNAL_SERVER_ERROR)
            .json({ code: "DELETE_DIR_FAILED", error: error });
    }
}

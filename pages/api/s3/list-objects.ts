import type { NextApiRequest, NextApiResponse } from 'next';
import status from 'http-status';
import s3Service from '../services/s3';

interface IListObjects {

}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<API.SUCCESS<IListObjects[]> | API.ERROR>
) {
    try {
        const { bucket } = req.query as { bucket: string };
        const bucketDetails = await s3Service.listObjects({ bucket });
        res.status(status.OK).json({ code: status[200], data: [] });
    } catch (error: unknown) {
        console.error(error);
        res.status(status.INTERNAL_SERVER_ERROR).json({ code: 'LIST_OBJECTS_FAILED', error: error });;
    }
}

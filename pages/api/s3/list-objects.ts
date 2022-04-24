import type { NextApiRequest, NextApiResponse } from 'next';
import status from 'http-status';
import s3Service from '../services/s3';

interface IListObjects {

}

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<API.SUCCESS<IListObjects[]> | API.ERROR>
) {
    try {
        const bucketDetails = await s3Service.listObjects();
        res.status(status.OK).json({ message: status[200], data: [] });
    } catch (error: unknown) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while fetching bucket details', error });
    }
}

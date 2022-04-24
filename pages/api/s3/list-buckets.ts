import type { NextApiRequest, NextApiResponse } from 'next';
import status from 'http-status';
import s3Service from '../services/s3';

interface IListBuckets {
    name: string;
    creationDate: string;
    creationTime: string;
}

export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<API.SUCCESS<IListBuckets[]> | API.ERROR>
) {
    try {
        const bucketDetails = await s3Service.listBuckets();
        res.status(status.OK).json({ message: status[200], data: bucketDetails });
    } catch (error: unknown) {
        res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred while fetching bucket details', error });
    }
}

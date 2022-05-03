export const getLocaleTime = (CreationDate: unknown) => {
    return new Date(CreationDate as string).toLocaleString().split(',');
};
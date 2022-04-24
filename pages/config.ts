const config = {
    get aws() {
        return {
            endpoint: 'http://localhost:4566',
        };
    },
    get ui() {
        const apiEndpoint = 'http://localhost:3000';
        return {
            apiEndpoint,
            s3: {
                listBuckets: `${apiEndpoint}/api/s3/list-buckets`,
            },
        }
    },
};

export default config;

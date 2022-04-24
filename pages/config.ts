const config = {
    get aws() {
        return {
            endpoint: 'http://localhost:4566',
            sslEnabled: false,
            s3ForcePathStyle: true
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

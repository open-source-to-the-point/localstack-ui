const API_ENDPOINT = "http://localhost:3000";
const API_S3_ENDPOINT = `${API_ENDPOINT}/api/s3`;

const apiRoutes = {
  ui: {
    s3: {
      createBucket: `${API_S3_ENDPOINT}/create-bucket`,
      deleteBucket: `${API_S3_ENDPOINT}/delete-bucket`,
      listBuckets: `${API_S3_ENDPOINT}/list-buckets`,
      listObjects: `${API_S3_ENDPOINT}/list-objects`,
    },
  },
};

export default apiRoutes;

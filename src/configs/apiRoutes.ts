const API_ENDPOINT = `http://localhost:${process.env.PORT || 3000}`;
const API_S3_ENDPOINT = `${API_ENDPOINT}/api/s3`;

const apiRoutes = {
  ui: {
    s3: {
      createBucket: `${API_S3_ENDPOINT}/create-bucket`,
      deleteBucket: `${API_S3_ENDPOINT}/delete-bucket`,
      getPresignedUrl: `${API_S3_ENDPOINT}/pre-signed-url`,
      listBuckets: `${API_S3_ENDPOINT}/list-buckets`,
      listObjects: `${API_S3_ENDPOINT}/list-objects`,
      deleteDir: `${API_S3_ENDPOINT}/delete-dir`,
      deleteObject: `${API_S3_ENDPOINT}/delete-object`,
    },
  },
};

export default apiRoutes;

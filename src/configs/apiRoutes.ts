const API_ENDPOINT = "http://localhost:3000";

const apiRoutes = {
  ui: {
    s3: {
      listBuckets: `${API_ENDPOINT}/api/s3/list-buckets`,
    },
  },
};

export default apiRoutes;

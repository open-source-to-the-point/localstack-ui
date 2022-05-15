import { useState } from "react";

import BucketsDataGrid from "@components/s3/bucketList/BucketsDataGrid";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import useModal from "@hooks/useModal";
import apiRoutes from "@configs/apiRoutes";

import { IBucket } from "@interfaces/s3";

const S3BucketList = ({ bucketList }: { bucketList: IBucket[] }) => {
  const [snackbarMsg, setSnackbarMsg] = useState("Bucket successfully deleted");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  const {
    isModalOpen: isSnackbarOpen,
    openModal: openSnackbar,
    closeModal: closeSnackbar,
  } = useModal();

  if (!bucketList)
    return (
      <div className="w-full text-center">
        <code className="text-red-500">
          Error occurred while fetching bucket list from S3
        </code>
      </div>
    );

  return (
    <>
      <div className="p-4 flex justify-center w-full h-full">
        <BucketsDataGrid
          bucketList={bucketList}
          openSnackbar={openSnackbar}
          setSnackbarSeverity={setSnackbarSeverity}
          setSnackbarMsg={setSnackbarMsg}
        />
      </div>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export async function getServerSideProps() {
  const response = await fetch(apiRoutes.ui.s3.listBuckets);
  if (response.status !== 200) {
    return { props: {} };
  }

  const { data } = await response.json();

  return { props: { bucketList: data } };
}

export default S3BucketList;

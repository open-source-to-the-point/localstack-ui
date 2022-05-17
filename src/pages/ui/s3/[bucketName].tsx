import { useState } from "react";
import { useRouter } from "next/router";

import Breadcrumbs from "@components/s3/Breadcrumbs";
import ObjectsDataGrid from "@components/s3/objectList/ObjectsDataGrid";

import apiRoutes from "@configs/apiRoutes";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import useModal from "@hooks/useModal";

import { ObjectType } from "@interfaces/s3";
import Head from "next/head";

export async function getServerSideProps(context: any) {
  const { bucketName } = context.params;
  const { dir } = context.query;
  const response = await fetch(
    `${apiRoutes.ui.s3.listObjects}?bucket=${bucketName}${
      dir ? `&dir=${dir}` : ""
    }`
  );

  if (response.status !== 200) {
    return { props: {} };
  }

  const { data } = await response.json();
  return { props: { objects: data } };
}

function BucketDetails({ objects }: any) {
  const router = useRouter();
  const { bucketName, dir } = router.query;

  const [snackbarMsg, setSnackbarMsg] = useState("Bucket successfully deleted");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  const {
    isModalOpen: isSnackbarOpen,
    openModal: openSnackbar,
    closeModal: closeSnackbar,
  } = useModal();

  const objectList = [
    ...objects?.dirs?.map((dir: string, index: number) => ({
      key: index,
      name: dir?.split("/").slice(-2, -1) + "/",
      type: ObjectType.FOLDER,
      path: dir,
    })),
    ...objects?.objects
      ?.filter((object: any) => object.key?.split("/").slice(-1)?.[0] !== "")
      .map((object: any, index: number) => {
        const { key, size, eTag, storageClass, lastModified } = object;
        const file = key.split("/").slice(-1)?.[0] || "",
          fileExtension = file.split(".")[1] || "";

        return {
          key: (objects?.dirs?.length || 0) + index,
          name: file,
          type: ObjectType.FILE,
          extension: fileExtension,
          size,
          eTag,
          storageClass,
          lastModified,
          path: key,
        };
      }),
  ];

  return (
    <>
      <Head>
        <title>S3 Bucket: {bucketName}</title>
      </Head>
      <div className="p-4 flex flex-col w-full h-full gap-4">
        <Breadcrumbs bucketName={bucketName} dir={dir} />
        <ObjectsDataGrid
          objectList={objectList}
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
}

export default BucketDetails;

import { Fragment, useCallback, useMemo, useState } from "react";

import ListHeader from "@components/s3/bucketList/ListHeader";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridActionsColDef,
  GridRowParams,
  GridRenderCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import Link from "@mui/material/Link";

import DeleteIcon from "@mui/icons-material/Delete";

import apiRoutes from "@configs/apiRoutes";
import { getLocaleTime } from "@utils/get-locale-time";

import { IBucket } from "@interfaces/s3";
import { useRouter } from "next/router";
import { Alert, Snackbar } from "@mui/material";
import useModal from "@hooks/useModal";

const S3BucketList = ({ bucketList }: { bucketList: IBucket[] }) => {
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>();
  const [snackbarMsg, setSnackbarMsg] = useState("Bucket successfully deleted");
  const {
    isModalOpen: isSnackbarOpen,
    openModal: openSnackbar,
    closeModal: closeSnackbar,
  } = useModal();

  const router = useRouter();

  const dataColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 400,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const { name } = params.row;

        return <Link href={`/ui/s3/${name}`}>{name}</Link>;
      },
    },
    {
      field: "creationDate",
      headerName: "Date",
      width: 250,
      disableColumnMenu: true,
    },
    {
      field: "creationTime",
      headerName: "Time",
      width: 250,
      disableColumnMenu: true,
    },
  ];
  const actionColumns: GridActionsColDef[] = [
    {
      field: "actions",
      type: "actions",
      width: 100,
      align: "center",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="delete"
          label="Delete"
          icon={<DeleteIcon />}
          onClick={async () => {
            const bucketName = params.id;
            const response = await fetch(
              `${apiRoutes.ui.s3.deleteBucket}?bucket=${bucketName}`
            );
            if (response.status !== 200) {
              console.debug(response);
            }

            const { data } = await response.json();

            router.replace(router.asPath);
            setSnackbarMsg(`"${bucketName}" successfully deleted`);
            openSnackbar();
          }}
        />,
      ],
    },
  ];

  const formattedBucketList = useMemo(() => {
    return bucketList.map((bucket) => {
      const [creationDate, creationTime] = getLocaleTime(bucket.creationDate);

      return {
        ...bucket,
        creationDate,
        creationTime,
      };
    });
  }, [bucketList]);

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
        <DataGrid
          columns={[...dataColumns, ...actionColumns]}
          getRowId={(row: typeof formattedBucketList[number]) => row.key}
          rows={formattedBucketList}
          checkboxSelection
          disableSelectionOnClick
          hideFooterPagination={true}
          onSelectionModelChange={(ids) => {
            setSelectedIds(ids);
          }}
          components={{
            Toolbar: () => (
              <ListHeader
                bucketList={formattedBucketList}
                selectedIds={selectedIds}
                setSnackbarMsg={setSnackbarMsg}
                openSnackbar={openSnackbar}
              />
            ),
          }}
        />
      </div>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
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

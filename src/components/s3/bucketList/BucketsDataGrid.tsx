import { useState } from "react";
import { useRouter } from "next/router";

import BucketListHeader from "@components/s3/bucketList/BucketListHeader";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridActionsColDef,
  GridRowParams,
  GridRenderCellParams,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import Link from "@mui/material/Link";

import DeleteIcon from "@mui/icons-material/Delete";

import apiRoutes from "@configs/apiRoutes";
import { getLocaleTime, getLocateDate } from "@utils/get-locale-time";

import { IBucket } from "@interfaces/s3";
import { AlertColor } from "@mui/material";

interface IBucketsDataGridProps {
  bucketList: IBucket[];
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const BucketsDataGrid: React.FC<IBucketsDataGridProps> = ({
  bucketList,
  setSnackbarSeverity,
  setSnackbarMsg,
  openSnackbar,
}) => {
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>();
  const router = useRouter();

  const dataColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 400,
      flex: 1,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const { name } = params.row;

        return <Link href={`/ui/s3/${name}`}>{name}</Link>;
      },
    },
    {
      field: "creationDate",
      headerName: "Date",
      width: 300,
      disableColumnMenu: true,
      valueFormatter: (params: GridValueFormatterParams) => {
        if (params.value == null) {
          return "";
        }

        return getLocateDate(new Date(params.value));
      },
    },
  ];
  const actionColumns: GridActionsColDef[] = [
    {
      field: "Actions",
      type: "actions",
      width: 100,
      hideable: false,
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
              setSnackbarSeverity("error");
              setSnackbarMsg(`Error while deleting "${bucketName}"`);
              openSnackbar();
              return;
            }

            const { data } = await response.json();

            router.replace(router.asPath);
            setSnackbarSeverity("success");
            setSnackbarMsg(`"${bucketName}" successfully deleted`);
            openSnackbar();
          }}
        />,
      ],
    },
  ];

  return (
    <DataGrid
      columns={[...dataColumns, ...actionColumns]}
      getRowId={(row: IBucket) => row.key}
      rows={bucketList}
      disableSelectionOnClick
      hideFooterPagination
      hideFooter
      onSelectionModelChange={(ids) => {
        setSelectedIds(ids);
      }}
      components={{
        Toolbar: () => (
          <BucketListHeader
            bucketList={bucketList}
            selectedIds={selectedIds}
            setSnackbarSeverity={setSnackbarSeverity}
            setSnackbarMsg={setSnackbarMsg}
            openSnackbar={openSnackbar}
          />
        ),
      }}
      componentsProps={{
        panel: {
          sx: {
            [`& .MuiDataGrid-columnsPanel > div:last-of-type`]: {
              display: "none",
            },
          },
        },
      }}
    />
  );
};

export default BucketsDataGrid;

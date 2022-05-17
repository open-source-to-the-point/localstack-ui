import { useState } from "react";
import { useRouter } from "next/router";

import UploadListHeader from "./UploadListHeader";

import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import prettyBytes from "pretty-bytes";

import { IUploadFile } from "@interfaces/s3";
import { AlertColor, Tooltip, Typography } from "@mui/material";

interface IUploadDataGridProps {
  objectList: IUploadFile[];
  setSelectedIds: React.Dispatch<React.SetStateAction<GridRowId[] | undefined>>;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const UploadDataGrid: React.FC<IUploadDataGridProps> = ({
  objectList,
  setSelectedIds,
  setSnackbarSeverity,
  setSnackbarMsg,
  openSnackbar,
}) => {
  const router = useRouter();
  const { bucketName } = router.query;

  const dataColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 300,
      flex: 1,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: "folder",
      headerName: "Folder",
      width: 450,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Tooltip title={params.value}>
          <Typography variant="caption">{params.value}</Typography>
        </Tooltip>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <Tooltip title={params.value}>
          <Typography variant="caption">{params.value}</Typography>
        </Tooltip>
      ),
    },
    {
      field: "size",
      headerName: "Size",
      width: 100,
      disableColumnMenu: true,
      align: "right",
      valueFormatter: (params: GridValueFormatterParams) => {
        if (params.value == null) {
          return "";
        }

        return prettyBytes(params.value);
      },
    },
  ];

  return (
    <DataGrid
      columns={dataColumns}
      getRowId={(row: typeof objectList[number]) => row.key}
      rows={objectList}
      checkboxSelection
      disableSelectionOnClick
      hideFooterPagination={true}
      onSelectionModelChange={(ids) => {
        setSelectedIds(ids);
      }}
      components={{
        Toolbar: () => (
          <UploadListHeader
            objectList={objectList}
            setSnackbarSeverity={setSnackbarSeverity}
            setSnackbarMsg={setSnackbarMsg}
            openSnackbar={openSnackbar}
          />
        ),
      }}
    />
  );
};

export default UploadDataGrid;

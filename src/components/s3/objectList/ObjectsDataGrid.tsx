import { useState } from "react";
import { useRouter } from "next/router";

import ObjectListHeader from "@components/s3/objectList/ObjectListHeader";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridActionsColDef,
  GridRowParams,
  GridRenderCellParams,
  GridRowId,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import Link from "@mui/material/Link";

import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import apiRoutes from "@configs/apiRoutes";
import { getLocateDate } from "@utils/get-locale-time";
import prettyBytes from "pretty-bytes";

import { IObject, ObjectType } from "@interfaces/s3";
import { AlertColor } from "@mui/material";

interface IObjectsDataGridProps {
  objectList: IObject[];
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const ObjectsDataGrid: React.FC<IObjectsDataGridProps> = ({
  objectList,
  setSnackbarSeverity,
  setSnackbarMsg,
  openSnackbar,
}) => {
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>();
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
      renderCell: (params: GridRenderCellParams) => {
        const { name, type, path } = params.row;

        const handleFileClick = async () => {
          const response = await fetch(
            `${apiRoutes.ui.s3.getPresignedUrl}?bucket=${bucketName}&key=${path}&action=GET`
          );

          if (response.status !== 200) {
            setSnackbarSeverity("error");
            setSnackbarMsg("Unable to open the file");
            openSnackbar();
            return;
          }

          const { data } = await response.json();
          console.log(JSON.stringify(data));
          window.open(data, "_blank");
        };

        return type === ObjectType.FOLDER ? (
          <Link href={`/ui/s3/${bucketName}?dir=${path}`}>
            <div className="flex items-center gap-1">
              <FolderOutlinedIcon fontSize="small" color="info" />
              {name}
            </div>
          </Link>
        ) : (
          <Link
            onClick={handleFileClick}
            color="#ed6c02"
            className="cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <InsertDriveFileOutlinedIcon fontSize="small" color="warning" />
              {name}
            </div>
          </Link>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      disableColumnMenu: true,
      valueGetter: (params: GridValueGetterParams) => {
        const { type, extension } = params.row;
        if (type === ObjectType.FOLDER) {
          return type;
        }
        return extension ? extension : "-";
      },
    },
    {
      field: "lastModified",
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
    {
      field: "storageClass",
      headerName: "Storage Class",
      width: 150,
      hide: true,
      disableColumnMenu: true,
    },
    {
      field: "eTag",
      headerName: "eTag",
      width: 250,
      hide: true,
      disableColumnMenu: true,
    },
  ];
  const actionColumns: GridActionsColDef[] = [
    {
      field: "actions",
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
          <ObjectListHeader
            objectList={objectList}
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
            [`& .MuiDataGrid-columnsPanel > div:first-of-type`]: {
              display: "none",
            },
            [`& .MuiDataGrid-columnsPanel > div:last-of-type`]: {
              display: "none",
            },
          },
        },
      }}
    />
  );
};

export default ObjectsDataGrid;

import { useMemo, useState } from "react";
import { useRouter } from "next/router";

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
import { AlertColor } from "@mui/material";

interface IBucketDataGridProps {
  bucketList: IBucket[];
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const BucketDataGrid: React.FC<IBucketDataGridProps> = ({
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

  return (
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
            setSnackbarSeverity={setSnackbarSeverity}
            setSnackbarMsg={setSnackbarMsg}
            openSnackbar={openSnackbar}
          />
        ),
      }}
    />
  );
};

export default BucketDataGrid;

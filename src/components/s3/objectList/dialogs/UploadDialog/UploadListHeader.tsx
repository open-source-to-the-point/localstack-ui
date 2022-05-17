import React from "react";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowId,
} from "@mui/x-data-grid";
import { AlertColor } from "@mui/material";

interface IUploadListHeaderProps {
  objectList: any;
  selectedIds: GridRowId[] | undefined;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const UploadListHeader: React.FC<IUploadListHeaderProps> = ({}) => {
  return (
    <>
      <GridToolbarContainer sx={{ justifyContent: "end" }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    </>
  );
};

export default UploadListHeader;

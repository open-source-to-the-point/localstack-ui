import React from "react";
import useModal from "@hooks/useModal";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowId,
} from "@mui/x-data-grid";
import { AlertColor, Button } from "@mui/material";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import UploadIcon from "@mui/icons-material/Upload";

import CreateFolderDialog from "./CreateFolderDialog";

interface IObjectListHeaderProps {
  objectList: any;
  selectedIds: GridRowId[] | undefined;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const ObjectListHeader: React.FC<IObjectListHeaderProps> = ({
  objectList,
  selectedIds,
  setSnackbarSeverity,
  setSnackbarMsg,
  openSnackbar,
}) => {
  const {
    isModalOpen: isCreateFolderDialogOpen,
    openModal: openCreateFolderDialog,
    closeModal: closeCreateFolderDialog,
  } = useModal();

  return (
    <>
      <GridToolbarContainer className="p-4 flex flex-col">
        <div className="w-full flex justify-between">
          <div className="text-lg">
            Objects {objectList.length > 0 ? `(${objectList.length})` : ""}
          </div>
          <div>
            <Button
              variant="contained"
              className="text-white font-bold"
              startIcon={<CreateNewFolderIcon />}
              onClick={openCreateFolderDialog}
            >
              Create Folder
            </Button>
            <Button
              variant="contained"
              className="ml-4 text-white font-bold"
              startIcon={<UploadIcon />}
              onClick={openCreateFolderDialog}
            >
              Upload
            </Button>
          </div>
        </div>
        <div className="mt-4 w-full flex justify-end">
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </div>
      </GridToolbarContainer>
      <CreateFolderDialog
        isDialogOpen={isCreateFolderDialogOpen}
        closeDialog={closeCreateFolderDialog}
        setSnackbarSeverity={setSnackbarSeverity}
        setCreationMsg={setSnackbarMsg}
        openCreationSnackbar={openSnackbar}
      />
    </>
  );
};

export default ObjectListHeader;

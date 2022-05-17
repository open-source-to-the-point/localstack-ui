import useModal from "@hooks/useModal";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowId,
} from "@mui/x-data-grid";
import { AlertColor, Button } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { CreateBucketDialog } from "./dialogs";

interface IBucketListHeaderProps {
  bucketList: any;
  selectedIds: GridRowId[] | undefined;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const BucketListHeader: React.FC<IBucketListHeaderProps> = ({
  bucketList,
  selectedIds,
  setSnackbarSeverity,
  setSnackbarMsg,
  openSnackbar,
}) => {
  const {
    isModalOpen: isCreateBucketDialogOpen,
    openModal: openCreateBucketDialog,
    closeModal: closeCreateBucketDialog,
  } = useModal();

  return (
    <>
      <GridToolbarContainer className="p-4 flex flex-col">
        <div className="w-full flex justify-between">
          <div className="text-lg">
            Buckets {bucketList.length > 0 ? `(${bucketList.length})` : ""}
          </div>
          <div>
            <Button
              variant="contained"
              sx={{ color: "white", fontWeight: "bold" }}
              startIcon={<AddCircleIcon htmlColor="#fff" />}
              onClick={openCreateBucketDialog}
            >
              Create Bucket
            </Button>
          </div>
        </div>
        <div className="mt-4 w-full flex justify-end">
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </div>
      </GridToolbarContainer>
      <CreateBucketDialog
        isDialogOpen={isCreateBucketDialogOpen}
        closeDialog={closeCreateBucketDialog}
        setSnackbarSeverity={setSnackbarSeverity}
        setCreationMsg={setSnackbarMsg}
        openCreationSnackbar={openSnackbar}
      />
    </>
  );
};

export default BucketListHeader;

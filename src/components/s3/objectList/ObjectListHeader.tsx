import React, { useCallback, useState } from "react";
import useModal from "@hooks/useModal";

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridRowId,
} from "@mui/x-data-grid";
import {
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import apiRoutes from "@configs/apiRoutes";
import { useRouter } from "next/router";

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
  setSnackbarMsg: setCreationMsg,
  openSnackbar: openCreationSnackbar,
}) => {
  const [bucketName, setBucketName] = useState("");
  const {
    isModalOpen: isCreateBucketDialogOpen,
    openModal: openCreateBucketDialog,
    closeModal: closeCreateBucketDialog,
  } = useModal();

  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isCreateBucketDialogOpen]);

  const createBucket = useCallback(async () => {
    const response = await fetch(
      `${apiRoutes.ui.s3.createBucket}?bucket=${bucketName}`
    );
    if (response.status !== 200) {
      console.debug(response);
      setSnackbarSeverity("error");
      setCreationMsg(`Error while creating "${bucketName}"`);
      openCreationSnackbar();
      return;
    }

    const { data } = await response.json();
    setSnackbarSeverity("success");
    setCreationMsg(`"${bucketName}" successfully created`);
    openCreationSnackbar();
    router.replace(router.asPath);
  }, [
    bucketName,
    openCreationSnackbar,
    router,
    setCreationMsg,
    setSnackbarSeverity,
  ]);

  return (
    <>
      <GridToolbarContainer className="p-4 flex flex-col">
        <div className="w-full flex justify-between">
          <div className="text-lg">
            Objects {objectList.length > 0 ? `(${objectList.length})` : ""}
          </div>
          {/* <div>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={openCreateBucketDialog}
            >
              Create Bucket
            </Button>
          </div> */}
        </div>
        <div className="mt-4 w-full flex justify-end">
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
        </div>
      </GridToolbarContainer>
      <Dialog open={isCreateBucketDialogOpen} onClose={closeCreateBucketDialog}>
        <DialogTitle>Create Bucket</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputRef}
            id="name"
            label="Bucket Name"
            autoFocus
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => setBucketName(event.currentTarget.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                createBucket();
              }
            }}
          />
          <DialogContentText>
            <Link
              href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html"
              target={"_blank"}
            >
              Naming Rules
            </Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateBucketDialog}>Cancel</Button>
          <Button variant="contained" onClick={createBucket}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ObjectListHeader;

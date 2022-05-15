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

interface IListHeaderProps {
  bucketList: any;
  selectedIds: GridRowId[] | undefined;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
  openSnackbar: () => void;
}
const ListHeader: React.FC<IListHeaderProps> = ({
  bucketList,
  selectedIds,
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
    }

    const { data } = await response.json();
    setCreationMsg(`"${bucketName}" successfully created`);
    openCreationSnackbar();
    router.replace(router.asPath);
  }, [bucketName, openCreationSnackbar, router, setCreationMsg]);

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
              startIcon={<AddCircleIcon />}
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

export default ListHeader;

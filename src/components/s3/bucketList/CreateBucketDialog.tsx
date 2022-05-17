import React, { useCallback, useState } from "react";

import { useRouter } from "next/router";
import apiRoutes from "@configs/apiRoutes";

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

interface ICreateBucketDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setCreationMsg: React.Dispatch<React.SetStateAction<string>>;
  openCreationSnackbar: () => void;
}

const CreateBucketDialog: React.FC<ICreateBucketDialogProps> = ({
  isDialogOpen,
  closeDialog,
  setSnackbarSeverity,
  setCreationMsg,
  openCreationSnackbar,
}) => {
  const [bucketName, setBucketName] = useState("");

  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDialogOpen]);

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
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      maxWidth="md"
      PaperProps={{ sx: { width: "30%" } }}
    >
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
        <Button onClick={closeDialog}>Cancel</Button>
        <Button variant="contained" onClick={createBucket}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBucketDialog;

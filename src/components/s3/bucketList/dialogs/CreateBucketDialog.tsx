import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import apiRoutes from "@configs/apiRoutes";

import {
  AlertColor,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { IBucket } from "@interfaces/s3";

interface ICreateBucketDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  bucketList: IBucket[];
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setCreationMsg: React.Dispatch<React.SetStateAction<string>>;
  openCreationSnackbar: () => void;
}

const CreateBucketDialog: React.FC<ICreateBucketDialogProps> = ({
  isDialogOpen,
  closeDialog,
  bucketList,
  setSnackbarSeverity,
  setCreationMsg,
  openCreationSnackbar,
}) => {
  const [bucketName, setBucketName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDialogOpen]);

  const createBucket = useCallback(async () => {
    // Validate Folder Name
    if (!bucketName) {
      setErrorMessage("Bucket Name is requried");
      return;
    }

    if (bucketName.length < 3 || bucketName.length > 63) {
      setErrorMessage(
        "Bucket names must be between 3 (min) and 63 (max) characters long"
      );
      return;
    }

    if (bucketList.some((bucket) => bucket.name === bucketName)) {
      setErrorMessage(`Bucket already exists`);
      return;
    }

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
    bucketList,
    bucketName,
    openCreationSnackbar,
    router,
    setCreationMsg,
    setSnackbarSeverity,
  ]);

  const closeCreateBucketDialog = useCallback(() => {
    closeDialog();
    setBucketName("");
    setErrorMessage("");
  }, [closeDialog]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={closeCreateBucketDialog}
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
        <Box lineHeight={0}>
          <Typography variant="caption" color="error">
            {errorMessage}
          </Typography>
        </Box>
        {/* <DialogContentText>
          <Link
            href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html"
            target={"_blank"}
          >
            Naming Rules
          </Link>
        </DialogContentText> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCreateBucketDialog}>Cancel</Button>
        <Button variant="contained" onClick={createBucket}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBucketDialog;

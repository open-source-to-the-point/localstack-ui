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
  TextField,
  Typography,
} from "@mui/material";
import { IObject } from "@interfaces/s3";

interface ICreateFolderDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  objectList: IObject[];
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setCreationMsg: React.Dispatch<React.SetStateAction<string>>;
  openCreationSnackbar: () => void;
}

const CreateFolderDialog: React.FC<ICreateFolderDialogProps> = ({
  isDialogOpen,
  closeDialog,
  objectList,
  setSnackbarSeverity,
  setCreationMsg,
  openCreationSnackbar,
}) => {
  const [folderName, setFolderName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { bucketName, dir: currentDir } = router.query;

  const inputRef = useRef<HTMLInputElement>();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDialogOpen]);

  const createFolder = useCallback(async () => {
    // Validate Folder Name
    if (!folderName) {
      setErrorMessage("Folder Name is requried");
      return;
    }

    if (folderName.includes("/")) {
      setErrorMessage(`'/' is not allowed`);
      return;
    }

    if (objectList.some((object) => object.name === `${folderName}/`)) {
      setErrorMessage(`Folder already exists`);
      return;
    }

    // TODO: Object key naming doc: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html

    // Create Folder
    const presignedUrlResponse = await fetch(
      `${apiRoutes.ui.s3.getPresignedUrl}?bucket=${bucketName}&key=${`${
        currentDir ? currentDir : ""
      }${folderName}/`}&action=PUT`
    );
    if (presignedUrlResponse.status !== 200) {
      console.debug(presignedUrlResponse);
      setSnackbarSeverity("error");
      setCreationMsg(`Error while creating "${folderName}"`);
      openCreationSnackbar();
      return;
    }

    const { data } = await presignedUrlResponse.json();
    const response = await fetch(data, { method: "PUT" });

    if (response.status !== 200) {
      console.debug(response);
      setSnackbarSeverity("error");
      setCreationMsg(`Error while creating "${folderName}"`);
      openCreationSnackbar();
      return;
    }

    setSnackbarSeverity("success");
    setCreationMsg(`"${folderName}" successfully created`);
    openCreationSnackbar();
    router.replace(router.asPath);
  }, [
    bucketName,
    currentDir,
    folderName,
    objectList,
    openCreationSnackbar,
    router,
    setCreationMsg,
    setSnackbarSeverity,
  ]);

  const closeCreateFolderDialog = useCallback(() => {
    closeDialog();
    setFolderName("");
    setErrorMessage("");
  }, [closeDialog]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={closeCreateFolderDialog}
      maxWidth="md"
      PaperProps={{ sx: { width: "30%" } }}
    >
      <DialogTitle>Create Folder</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={inputRef}
          id="name"
          label="Folder Name"
          autoFocus
          margin="dense"
          type="text"
          fullWidth
          variant="standard"
          required
          onChange={(event) => setFolderName(event.currentTarget.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              createFolder();
            }
          }}
        />
        <Box lineHeight={1}>
          <Typography variant="caption" color="error" lineHeight={1.5}>
            {errorMessage}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCreateFolderDialog}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ marginLeft: "1rem", color: "white", fontWeight: "bold" }}
          onClick={createFolder}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;

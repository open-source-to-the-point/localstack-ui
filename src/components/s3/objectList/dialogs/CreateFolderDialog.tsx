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
  TextField,
} from "@mui/material";

interface ICreateFolderDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setCreationMsg: React.Dispatch<React.SetStateAction<string>>;
  openCreationSnackbar: () => void;
}

const CreateFolderDialog: React.FC<ICreateFolderDialogProps> = ({
  isDialogOpen,
  closeDialog,
  setSnackbarSeverity,
  setCreationMsg,
  openCreationSnackbar,
}) => {
  const [folderName, setFolderName] = useState("");

  const router = useRouter();
  const { bucketName, dir: currentDir } = router.query;

  const inputRef = React.useRef<HTMLInputElement>();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDialogOpen]);

  const createFolder = useCallback(async () => {
    const presignedUrlResponse = await fetch(
      `${
        apiRoutes.ui.s3.getPresignedUrl
      }?bucket=${bucketName}&key=${`${currentDir}${folderName}/`}&action=PUT`
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
          onChange={(event) => setFolderName(event.currentTarget.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              createFolder();
            }
          }}
        />
        <DialogContentText>
          {`Don't not use "/" in the folder name`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button variant="contained" onClick={createFolder}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;

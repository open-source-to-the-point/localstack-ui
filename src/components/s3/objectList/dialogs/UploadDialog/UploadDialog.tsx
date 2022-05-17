import React, { useCallback, useState } from "react";

import { useRouter } from "next/router";
import apiRoutes from "@configs/apiRoutes";

import {
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import UploadDataGrid from "./UploadDataGrid";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface IUploadDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  setSnackbarSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;
  setUploadMsg: React.Dispatch<React.SetStateAction<string>>;
  openUploadSnackbar: () => void;
}

const UploadDialog: React.FC<IUploadDialogProps> = ({
  isDialogOpen,
  closeDialog,
  setSnackbarSeverity,
  setUploadMsg,
  openUploadSnackbar,
}) => {
  const [uploadOjectList, setUploadOjectList] = useState([]);
  const [folderName, setFolderName] = useState("");

  const router = useRouter();
  const { bucketName, dir: currentDir } = router.query;

  const upload = useCallback(async () => {
    const presignedUrlResponse = await fetch(
      `${
        apiRoutes.ui.s3.getPresignedUrl
      }?bucket=${bucketName}&key=${`${currentDir}${folderName}/`}&action=PUT`
    );
    if (presignedUrlResponse.status !== 200) {
      console.debug(presignedUrlResponse);
      setSnackbarSeverity("error");
      setUploadMsg(`Error while creating "${folderName}"`);
      openUploadSnackbar();
      return;
    }

    const { data } = await presignedUrlResponse.json();
    const response = await fetch(data, { method: "PUT" });

    if (response.status !== 200) {
      console.debug(response);
      setSnackbarSeverity("error");
      setUploadMsg(`Error while creating "${folderName}"`);
      openUploadSnackbar();
      return;
    }

    setSnackbarSeverity("success");
    setUploadMsg(`"${folderName}" successfully created`);
    openUploadSnackbar();
    router.replace(router.asPath);
  }, [
    bucketName,
    currentDir,
    folderName,
    openUploadSnackbar,
    router,
    setUploadMsg,
    setSnackbarSeverity,
  ]);

  return (
    <Dialog open={isDialogOpen} onClose={closeDialog} fullScreen={true}>
      <DialogTitle>Upload</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            margin: "1rem 0",
          }}
        >
          <Typography variant="body1">
            Files and Folders
            {uploadOjectList.length > 0 ? `(${uploadOjectList.length})` : ""}
          </Typography>
          <div>
            <Button
              variant="contained"
              startIcon={<RemoveIcon />}
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
              onClick={() => {}}
            >
              Remove
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ marginLeft: "1rem", color: "white", fontWeight: "bold" }}
              onClick={() => {}}
            >
              Add Files
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ marginLeft: "1rem", color: "white", fontWeight: "bold" }}
              onClick={() => {}}
            >
              Add Folder
            </Button>
          </div>
        </Box>
        <UploadDataGrid
          objectList={uploadOjectList}
          openSnackbar={openUploadSnackbar}
          setSnackbarSeverity={setSnackbarSeverity}
          setSnackbarMsg={setUploadMsg}
        />
      </DialogContent>
      <DialogActions sx={{ margin: "1rem" }}>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ color: "white", fontWeight: "bold" }}
          onClick={upload}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;

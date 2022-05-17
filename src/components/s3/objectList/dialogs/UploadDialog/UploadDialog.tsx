import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import apiRoutes from "@configs/apiRoutes";

import {
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import UploadDataGrid from "./UploadDataGrid";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IUploadFile } from "@interfaces/s3";
import prettyBytes from "pretty-bytes";
import { GridRowId } from "@mui/x-data-grid";

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
  const [uploadObjectList, setUploadOjectList] = useState<IUploadFile[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>();
  const [folderName, setFolderName] = useState("");

  const filesUploadRef = useRef<HTMLInputElement>();
  const folderUploadRef = useRef<HTMLInputElement>();

  const router = useRouter();
  const { bucketName, dir: currentDir } = router.query;

  const onSelectionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedFileList = Array.from(event.target.files || []).reduce<
        IUploadFile[]
      >((formattedFileList, file) => {
        const { name, type, size, webkitRelativePath } = file;
        const key = webkitRelativePath ? webkitRelativePath : name;

        if (
          !uploadObjectList.some((uploadObject) => uploadObject.key === key)
        ) {
          formattedFileList.push({
            key,
            file,
            name: name,
            folder: webkitRelativePath
              ? webkitRelativePath.slice(0, -1 * name.length)
              : "",
            type: type,
            size: size,
          });
        }

        return formattedFileList;
      }, []);

      if (formattedFileList) {
        setUploadOjectList([...uploadObjectList, ...formattedFileList]);
      }
      console.log(event.target.files);
    },
    [uploadObjectList]
  );

  useEffect(() => {
    console.log(uploadObjectList);
  }, [uploadObjectList]);

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
            {uploadObjectList.length > 0
              ? ` (${uploadObjectList.length}, ${prettyBytes(
                  uploadObjectList.reduce(
                    (totalSize, { size }) => totalSize + size,
                    0
                  )
                )})`
              : ""}
          </Typography>
          <div>
            <Button
              variant="contained"
              startIcon={<RemoveIcon />}
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
              onClick={() => {
                setUploadOjectList(
                  uploadObjectList.filter(
                    (uploadObject) => !selectedIds?.includes(uploadObject.key)
                  )
                );
                console.log(selectedIds);
              }}
            >
              Remove
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ marginLeft: "1rem", color: "white", fontWeight: "bold" }}
              onClick={() => {
                filesUploadRef?.current?.click();
              }}
            >
              Add Files
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ marginLeft: "1rem", color: "white", fontWeight: "bold" }}
              onClick={() => {
                folderUploadRef?.current?.click();
              }}
            >
              Add Folder
            </Button>
            <Input
              inputRef={filesUploadRef}
              type="file"
              sx={{ display: "none" }}
              inputProps={{
                multiple: true,
              }}
              onChange={onSelectionChange}
            ></Input>
            <Input
              inputRef={folderUploadRef}
              type="file"
              inputProps={{
                webkitdirectory: "true",
              }}
              sx={{ display: "none" }}
              onChange={onSelectionChange}
            ></Input>
          </div>
        </Box>
        <UploadDataGrid
          objectList={uploadObjectList}
          setSelectedIds={setSelectedIds}
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

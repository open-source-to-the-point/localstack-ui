import React, { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import apiRoutes from "@configs/apiRoutes";

import {
  AlertColor,
  Backdrop,
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
import { IUploadObject } from "@interfaces/s3";
import prettyBytes from "pretty-bytes";
import { GridRowId } from "@mui/x-data-grid";
import CircularProgressWithLabel from "@components/CircularProgressWithLabel";
import useModal from "@hooks/useModal";
import { timeout } from "@utils/index";

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
  const [uploadObjectList, setUploadOjectList] = useState<IUploadObject[]>([]);
  const [selectedIds, setSelectedIds] = useState<GridRowId[]>();
  const [uploadDisabled, setUploadDisabled] = useState(true);

  const {
    isModalOpen: isUploading,
    openModal: openUploadingModal,
    closeModal: closeUploadingModal,
  } = useModal();
  const totalUploaded = useRef(0);
  const [progress, setProgress] = useState(0);
  const [lastUploadedObject, setLastUploadedObject] = useState("");

  const filesUploadRef = useRef<HTMLInputElement>();
  const folderUploadRef = useRef<HTMLInputElement>();

  const router = useRouter();
  const { bucketName, dir: currentDir } = router.query;

  const onSelectionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedFileList = Array.from(event.target.files || []).reduce<
        IUploadObject[]
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
    },
    [uploadObjectList]
  );

  useEffect(() => {
    setUploadDisabled(uploadObjectList.length === 0);
  }, [uploadObjectList]);

  const uploadFile = useCallback(
    async (uploadObject: IUploadObject) => {
      const { key, name, file } = uploadObject;
      const presignedUrlResponse = await fetch(
        `${apiRoutes.ui.s3.getPresignedUrl}?bucket=${bucketName}&key=${`${
          currentDir ? currentDir : ""
        }${key}`}&action=PUT`
      );

      if (presignedUrlResponse.status !== 200) {
        console.debug(`Error while uploading "${name}"`, presignedUrlResponse);
        throw Error(`Error while uploading "${name}"`);
      }

      let formData = new FormData();
      formData.append("file", file);

      const { data } = await presignedUrlResponse.json();
      const response = await fetch(data, { method: "PUT", body: formData });

      if (response.status !== 200) {
        console.debug(response);
        throw Error(`Error while uploading "${name}"`);
      }
      setLastUploadedObject(key);
      totalUploaded.current = totalUploaded.current + 1;
      setProgress(totalUploaded.current);
    },
    [bucketName, currentDir]
  );

  const upload = useCallback(async () => {
    closeDialog();
    openUploadingModal();
    totalUploaded.current = 0;
    setProgress(0);

    Promise.all(uploadObjectList.map(uploadFile))
      .then(async () => {
        await timeout(500);
        setSnackbarSeverity("success");
        setUploadMsg(`Files successfully uploaded`);
      })
      .catch((err: any) => {
        setSnackbarSeverity("error");
        setUploadMsg(err.message);
      })
      .finally(() => {
        closeUploadingModal();
        openUploadSnackbar();
        router.replace(router.asPath);
      });
  }, [
    closeDialog,
    closeUploadingModal,
    openUploadSnackbar,
    openUploadingModal,
    router,
    setSnackbarSeverity,
    setUploadMsg,
    uploadFile,
    uploadObjectList,
  ]);

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        PaperProps={{ sx: { minWidth: "95%", minHeight: "95%" } }}
      >
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
            disabled={uploadDisabled}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUploading}
      >
        <CircularProgressWithLabel
          value={progress}
          of={uploadObjectList.length}
          label="Uploaded"
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "end",
            justifyContent: "start",
          }}
        >
          <Typography variant="body1" color="white" sx={{ margin: "1rem" }}>
            {lastUploadedObject}
          </Typography>
        </Box>
      </Backdrop>
    </>
  );
};

export default UploadDialog;

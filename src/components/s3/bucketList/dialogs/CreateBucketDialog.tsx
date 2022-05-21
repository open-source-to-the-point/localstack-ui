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

  const validateBucketName = (bucketName: string) => {
    if (!bucketName) {
      return "Bucket Name is requried";
    }

    //> # see https://stackoverflow.com/questions/50480924/regex-for-s3-bucket-name#50484916
    //> BUCKET_NAME_REGEX = (r'(?=^.{3,63}$)(?!^(\d+\.)+\d+$)' +
    //>     r'(^(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])$)')

    //> Naming rules doc: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
    if (!/^.{3,63}$/.test(bucketName))
      return "Bucket names must be between 3 (min) and 63 (max) characters long";

    if (!/^[a-z\d\.-]*$/.test(bucketName))
      return "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-)";

    if (!/^[a-z\d].*[a-z\d]$/.test(bucketName))
      return "Bucket names must begin and end with a letter or number";

    if (/^(\d+\.)+\d+$/.test(bucketName))
      return "Bucket name must not be in the format 00.11.22.33";

    if (
      /^((2(5[0-5]|[0-4][0-9])|[01]?[0-9]{1,2})\.){3}(2(5[0-5]|[0-4][0-9])|[01]?[0-9]{1,2})$/.test(
        bucketName
      )
    )
      return "Bucket names must not be formatted as an IP address (for example, 192.168.5.4)";

    if (bucketName.startsWith("xn--"))
      return "Bucket names must not start with the prefix xn--";

    if (bucketName.endsWith("-s3alias"))
      return "Bucket names must not end with the suffix -s3alias";

    return "";
  };

  const createBucket = useCallback(async () => {
    // Validate Folder Name
    const validationError = validateBucketName(bucketName);
    if (validationError) {
      setErrorMessage(validationError);
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
          onChange={(event) => {
            setErrorMessage("");
            setBucketName(event.currentTarget.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              createBucket();
            }
          }}
        />
        <Box lineHeight={1}>
          <Typography
            variant="caption"
            color="error"
            lineHeight={1.5}
            sx={{ whiteSpace: "pre-line" }}
          >
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
        <Button
          variant="contained"
          sx={{ marginLeft: "1rem", color: "white", fontWeight: "bold" }}
          onClick={createBucket}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBucketDialog;

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const S3Breadcrumbs = ({ bucketName, dir }: any) => {
  // Initialized with BucketList link
  const breadcrumbs = [
    <Link underline="hover" key="1" href="/ui/s3">
      Buckets
    </Link>,
  ];

  const dirPaths = dir?.split("/").slice(0, -1);
  const dirs: any = [];

  // Adding selected bucket name link
  if (dirPaths?.length > 0) {
    breadcrumbs.push(
      <Link underline="hover" key="2" href={`/ui/s3/${bucketName}`}>
        {bucketName}
      </Link>
    );
  } else {
    breadcrumbs.push(
      <Typography key="2" color="text.primary">
        {bucketName}
      </Typography>
    );
  }

  // Adding dir path links
  dirPaths?.forEach((dirPath: string, index: number) => {
    dirs.push(dirPath);
    if (dirPaths.length - 1 === index) {
      breadcrumbs.push(
        <Typography key={`dirPath-${index + 2}`} color="text.primary">
          {dirPath}
        </Typography>
      );
      return;
    }
    breadcrumbs.push(
      <Link
        underline="hover"
        key={`dirPath-${index + 2}`}
        href={`/ui/s3/${bucketName}?dir=${dirs.join("/") + "/"}`}
      >
        {dirPath}
      </Link>
    );
  });

  return (
    <div className="flex items-center gap-1">
      {breadcrumbs.flatMap((breadcrumb, index) => {
        const currentBreadcrumb = [breadcrumb];

        if (index !== breadcrumbs.length - 1) {
          currentBreadcrumb.push(
            <NavigateNextIcon key={`breadcrumb-${index}`} fontSize="small" />
          );
        }
        return currentBreadcrumb;
      })}
    </div>
  );
  // <Breadcrumbs
  //   separator={<NavigateNextIcon fontSize="small" />}
  //   aria-label="breadcrumb"
  // >
  //   {breadcrumbs}
  // </Breadcrumbs>
};

export default S3Breadcrumbs;

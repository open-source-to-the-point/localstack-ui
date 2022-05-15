import apiRoutes from "@configs/apiRoutes";
import { useRouter } from "next/router";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export async function getServerSideProps(context: any) {
  const { bucketName } = context.params;
  const { dir } = context.query;
  const response = await fetch(
    `${apiRoutes.ui.s3.listObjects}?bucket=${bucketName}${
      dir ? `&dir=${dir}` : ""
    }`
  );

  if (response.status !== 200) {
    return { props: {} };
  }

  const { data } = await response.json();
  return { props: { objects: data } };
}

const DirObject = ({ dir }: any) => {
  const router = useRouter();
  const { bucketName } = router.query;

  const routeToDirDetails = () => {
    console.log(router);
    router.push(`/ui/s3/${bucketName}?dir=${dir}`);
  };

  return (
    <div className="text-green-500 cursor-pointer" onClick={routeToDirDetails}>
      {dir?.split("/").slice(-2, -1) + "/"}
    </div>
  );
};

const ContentObject = ({ object }: any) => {
  const router = useRouter();
  const routeToObjectContent = () => {
    // router.push(`${router.route}/${name}`);
  };

  return (
    <div
      className="text-orange-500 cursor-pointer"
      onClick={routeToObjectContent}
    >
      {JSON.stringify(object)}
    </div>
  );
};

const Breakcrumds = ({ bucketName, dir }: any) => {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/ui/s3">
      Buckets
    </Link>,
  ];

  const dirPaths = dir?.split("/").slice(0, -1);
  const dirs: any = [];

  if (dirPaths?.length > 0) {
    breadcrumbs.push(
      <Link
        underline="hover"
        key="1"
        color="inherit"
        href={`/ui/s3/${bucketName}`}
      >
        {bucketName}
      </Link>
    );
  } else {
    breadcrumbs.push(
      <Typography key="3" color="text.primary">
        {bucketName}
      </Typography>
    );
  }

  dirPaths?.forEach((dirPath: string, index: number) => {
    dirs.push(dirPath);
    if (dirPaths.length - 1 === index) {
      breadcrumbs.push(
        <Typography key="3" color="text.primary">
          {dirPath}
        </Typography>
      );
      return;
    }
    breadcrumbs.push(
      <Link
        underline="hover"
        key="1"
        color="inherit"
        href={`/ui/s3/${bucketName}?dir=${dirs.join("/") + "/"}`}
      >
        {dirPath}
      </Link>
    );
  });

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

function BucketDetails({ objects }: any) {
  const router = useRouter();
  const { bucketName, dir } = router.query;

  console.log(objects);
  return (
    <div>
      <Breakcrumds bucketName={bucketName} dir={dir} />
      <div>
        {objects?.dirs?.map((dir: string, index: number) => (
          <DirObject key={index} dir={dir} />
        ))}
      </div>
      <div>
        {objects?.objects?.map((object: any, index: number) => (
          <ContentObject key={index} object={object} />
        ))}
      </div>
    </div>
  );
}

export default BucketDetails;

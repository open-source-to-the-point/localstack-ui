import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ICircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
  of?: number;
  label: string;
}
const CircularProgressWithLabel: React.FC<ICircularProgressWithLabelProps> = ({
  value,
  of,
}) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={of ? (value / of) * 100 : 0}
        size="12rem"
        thickness={3}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="white"
        >{`${value} / ${of}`}</Typography>
        <Typography variant="subtitle1" color="white">
          Uploaded
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;

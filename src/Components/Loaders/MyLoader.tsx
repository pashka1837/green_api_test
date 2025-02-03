import { Box, CircularProgress } from "@mui/joy";

export function MyLoader() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "rgba(1,1,1,0.3)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress color="success" />
    </Box>
  );
}

import Box from "@mui/joy/Box";
import { MyForm } from "../../Components/Login/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem("authData");
    if (authData) navigate("/");
  }, []);

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <MyForm />
    </Box>
  );
}

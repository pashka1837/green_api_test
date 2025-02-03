import { Button, Sheet } from "@mui/joy";
import { useNavigate } from "react-router";

export function NavBar() {
  const navigate = useNavigate();
  function handleLogOut() {
    localStorage.setItem("authData", "");
    navigate("/login");
    return;
  }
  return (
    <Sheet
      color="success"
      variant="soft"
      sx={{
        p: "10px",
        pr: "40px",
        height: "60px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Button color="danger" onClick={handleLogOut} size="sm">
        Logout
      </Button>
    </Sheet>
  );
}

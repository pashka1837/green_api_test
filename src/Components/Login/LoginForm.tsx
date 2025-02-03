import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;

export function MyForm() {
  const navigate = useNavigate();

  const [formError, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  function errorRes(
    e: FormEvent<HTMLFormElement>,
    errorMsg = "Неверные данные"
  ) {
    const formEl = e.target as HTMLFormElement;
    setError(errorMsg);
    setLoading(false);
    formEl.reset();
    return;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(e.currentTarget);
    const idInstance = formData.get("idInstance");
    const apiTokenInstance = formData.get("apiTokenInstance");
    try {
      const res = await fetch(
        `${apiUrl}/waInstance${idInstance}/getWaSettings/${apiTokenInstance}`
      );
      if (!res.ok) return errorRes(e);

      const data = await res.json();

      if (data.stateInstance !== "authorized")
        return errorRes(e, "WhatsApp не авторизован");

      localStorage.setItem(
        "authData",
        JSON.stringify({ idInstance, apiTokenInstance })
      );

      setLoading(false);
      formEl.reset();
      navigate("/");
      return;
    } catch {
      return errorRes(e);
    }
  }
  return (
    <Sheet
      variant="outlined"
      color="primary"
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: " grid", gap: "20px", p: "20px" }}
    >
      <Typography level="h4">Нужно авторизоваться</Typography>

      <FormControl>
        <FormLabel>idInstance</FormLabel>
        <Input required type="text" name="idInstance" />
      </FormControl>
      <FormControl>
        <FormLabel>apiTokenInstance</FormLabel>
        <Input required type="password" name="apiTokenInstance" />
      </FormControl>
      {formError && (
        <Typography color="danger" level="body-sm">
          {formError}
        </Typography>
      )}
      <Button loading={isLoading} type="submit">
        Login
      </Button>
    </Sheet>
  );
}

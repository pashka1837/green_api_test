import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { FormEvent, useState } from "react";
import useWpStore from "../../stores/zustandStore";

const apiUrl = import.meta.env.VITE_API_URL;

export function CreateChat() {
  const [isLoading, setLoading] = useState(false);
  const [formError, setError] = useState("");

  const { setCurrentChat, idInstance, apiTokenInstance, chats, createChat } =
    useWpStore((state) => state);

  function handleError(errorMsg: string) {
    setError(errorMsg);
    setLoading(false);
    return;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const newPhone = formData.get("phone");
    const currentChatId = `${newPhone}@c.us`;

    const formEl = e.target as HTMLFormElement;
    formEl.reset();

    const existChat = chats.find((chat) => chat.chatId === currentChatId);

    if (existChat) {
      setCurrentChat(currentChatId);
      setLoading(false);
      return;
    }

    try {
      const checkWpRes = await fetch(
        `${apiUrl}/waInstance${idInstance}/checkWhatsapp/${apiTokenInstance}`,
        {
          method: "POST",
          body: JSON.stringify({ phoneNumber: newPhone }),
        }
      );

      if (!checkWpRes.ok) return handleError("Неверные данные");

      const data = await checkWpRes.json();
      if (!data.existsWhatsapp) return handleError("У абонента нет WhatsApp");

      const infoRes = await fetch(
        `${apiUrl}/waInstance${idInstance}/getContactInfo/${apiTokenInstance}`,
        {
          method: "POST",
          body: JSON.stringify({ chatId: currentChatId }),
        }
      );
      if (!infoRes.ok) return handleError("Неверные данные");

      const { contactName, name } = await infoRes.json();
      createChat(currentChatId, contactName || name || newPhone);
      setCurrentChat(currentChatId);
      setLoading(false);
    } catch (error) {
      console.error(error);
      return handleError("Неверные данные");
    }
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      direction={"column"}
      spacing={1}
      sx={{
        borderBottom: "1px solid var(--joy-palette-success-500)",
        pr: "20px",
        p: "20px",
      }}
    >
      <Stack
        direction={"row"}
        spacing={1}
        alignItems={"flex-end"}
        justifyContent={"space-between"}
      >
        <FormControl>
          <FormLabel sx={{ textWrap: "wrap", maxWidth: "150px" }}>
            Номер телефона (77777777777)
          </FormLabel>
          <Input
            color="success"
            required
            type="text"
            name="phone"
            slotProps={{
              input: {
                pattern: `^(\\d{11})`,
              },
            }}
            sx={{ width: "150px", color: "black" }}
          />
        </FormControl>
        <Button color="success" loading={isLoading} type="submit">
          Создать чат
        </Button>
      </Stack>
      {formError && (
        <Typography color="danger" level="body-sm">
          {formError}
        </Typography>
      )}
    </Stack>
  );
}

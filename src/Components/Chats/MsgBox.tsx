import { Box, Button, Textarea } from "@mui/joy";
import { FormEvent, useEffect, useState } from "react";
import useWpStore from "../../stores/zustandStore";
import { chatErrorHandle } from "../../utils/utils";

type MsgBoxProps = {
  setChatLoad: React.Dispatch<React.SetStateAction<boolean>>;
};

const apiUrl = import.meta.env.VITE_API_URL;

export function MsgBox({ setChatLoad }: MsgBoxProps) {
  const { currentChatId, addMessage, idInstance, apiTokenInstance } =
    useWpStore((state) => state);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg("");
  }, [currentChatId]);

  async function handleSendMsg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChatLoad(true);
    const newMsg = msg;
    setMsg("");
    try {
      const res = await fetch(
        `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          method: "POST",
          body: JSON.stringify({ chatId: currentChatId, message: newMsg }),
        }
      );
      if (!res.ok) return chatErrorHandle(setChatLoad, "Неверные данные");

      const data = await res.json();

      const sentMsg: TextMsgType = {
        chatId: currentChatId,
        deletedMessageId: "",
        editedMessageId: "",
        idMessage: data.idMessage,
        isDeleted: false,
        isEdited: false,
        sendByApi: false,
        statusMessage: "",
        textMessage: newMsg,
        timestamp: Math.floor(Date.now() / 1000),
        type: "outgoing",
        typeMessage: "textMessage",
      };

      addMessage(sentMsg, currentChatId);
      setChatLoad(false);
      return;
    } catch (error) {
      console.error(error);
      return chatErrorHandle(setChatLoad, "Неверные данные");
    }
  }
  return (
    <Box
      onSubmit={handleSendMsg}
      component={"form"}
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Textarea
        onChange={(e) => setMsg(e.currentTarget.value)}
        value={msg}
        size="md"
        sx={{
          width: "100%",
          borderRadius: 0,
          color: "black",
          fontSize: "16px",
        }}
        required
        name="msg"
        color="success"
      />
      <Button
        type="submit"
        disabled={!msg}
        color="success"
        sx={{ borderRadius: 0 }}
      >
        Отправить
      </Button>
    </Box>
  );
}

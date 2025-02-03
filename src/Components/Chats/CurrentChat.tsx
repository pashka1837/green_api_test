import { useEffect, useMemo, useRef } from "react";
import useWpStore from "../../stores/zustandStore";
import { Box, Typography } from "@mui/joy";
import { chatErrorHandle } from "../../utils/utils";

type CurrentChatProps = {
  setChatLoad: React.Dispatch<React.SetStateAction<boolean>>;
};

const apiUrl = import.meta.env.VITE_API_URL;

export function CurrentChat({ setChatLoad }: CurrentChatProps) {
  const {
    currentChatId,
    chats,
    loadChatHistory,
    idInstance,
    apiTokenInstance,
    changeNotifStat,
  } = useWpStore((state) => state);
  const messages = useMemo(
    () =>
      chats
        .find((chat) => chat.chatId === currentChatId)
        ?.msgs.sort((a, b) => a.timestamp - b.timestamp) || [],
    [chats, currentChatId]
  );

  //   const messages =
  //     chats
  //       .find((chat) => chat.chatId === currentChatId)
  //       ?.msgs.sort((a, b) => a.timestamp - b.timestamp) || [];

  const chatRef = useRef<null | HTMLDivElement>(null);

  async function fetchHistory() {
    setChatLoad(true);
    try {
      const historyRes = await fetch(
        `${apiUrl}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
        {
          method: "POST",
          body: JSON.stringify({ chatId: currentChatId, count: 100 }),
        }
      );

      if (!historyRes.ok)
        return chatErrorHandle(setChatLoad, "Неверные данные");

      const historyData = await historyRes.json();

      const reverseMsgs = historyData
        .filter(
          (msg: any) =>
            msg.typeMessage === "textMessage" ||
            msg.typeMessage === "quotedMessage" ||
            msg.typeMessage === "extendedTextMessage"
        )
        .reverse();
      loadChatHistory(reverseMsgs, currentChatId);
      setChatLoad(false);
    } catch (error) {
      console.error(error);
      return chatErrorHandle(setChatLoad, "Неверные данные");
    }
  }

  useEffect(() => {
    changeNotifStat(currentChatId, false);
    const currentChat = chats.find((chat) => chat.chatId === currentChatId);
    if (!currentChat?.msgs.length) {
      fetchHistory();
    }
  }, [currentChatId]);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <Box
      ref={chatRef}
      sx={{
        p: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "scroll",
      }}
    >
      {messages.map((msg) => {
        let showMsg = "";
        let quotMsg = "";
        if ("extendedTextMessage" in msg) {
          showMsg = msg.extendedTextMessage?.text || "";
          if (
            "quotedMessage" in msg &&
            msg.quotedMessage.typeMessage === "textMessage"
          )
            quotMsg = msg.quotedMessage.textMessage;
        }
        if ("textMessage" in msg) {
          showMsg = msg.textMessage;
        }

        return (
          <Box sx={{ display: "grid" }} key={msg.idMessage}>
            <Box
              sx={{
                justifySelf: msg.type === "outgoing" ? "end" : "start",
                display: "grid",
                alignItems: "center",
                p: "6px 8px",
                borderRadius: "15px",
                bgcolor: "var(--joy-palette-success-300)",
                width: "fit-content",
              }}
            >
              {quotMsg && <Typography level="body-sm">({quotMsg})</Typography>}
              <Typography level="title-md">{showMsg}</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

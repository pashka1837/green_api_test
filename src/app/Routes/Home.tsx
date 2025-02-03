import { Box, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavBar } from "../../Components/NavBar/NavBar";
import { ChatList } from "../../Components/Chats/ChatList";
import { CreateChat } from "../../Components/Chats/CreateChat";
import useWpStore from "../../stores/zustandStore";
import { CurrentChat } from "../../Components/Chats/CurrentChat";
import { MsgBox } from "../../Components/Chats/MsgBox";
import { MyLoader } from "../../Components/Loaders/MyLoader";
import { buildMessage } from "../../utils/utils";

const apiUrl = import.meta.env.VITE_API_URL;

export function Home() {
  const {
    currentChatId,
    addMessage,
    setApiData,
    changeNotifStat,
    idInstance,
    apiTokenInstance,
  } = useWpStore((state) => state);

  const navigate = useNavigate();

  const [chatLoading, setChatLoad] = useState(false);

  async function fetchNotifs(idInstance: string, apiTokenInstance: string) {
    try {
      const res = await fetch(
        `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`
      );

      if (!res.ok) {
        alert("Не удалось получить новые уведомления");
        return null;
      }

      const data = (await res.json()) as IncomMsgResType;
      if (!data?.body) return null;

      const typeMessage = data.body?.messageData?.typeMessage || "";

      if (
        (typeMessage !== "textMessage" && typeMessage !== "quotedMessage") ||
        !("messageData" in data.body)
      )
        return data.receiptId;

      const refactorMsg = buildMessage(typeMessage, data.body);
      addMessage(refactorMsg, refactorMsg.chatId);

      if (currentChatId !== refactorMsg.chatId)
        changeNotifStat(refactorMsg.chatId, true);

      return data.receiptId;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function deleteNotif(
    idInstance: string,
    apiTokenInstance: string,
    receiptId: number
  ) {
    try {
      const res = await fetch(
        `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) return;

      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const { idInstance, apiTokenInstance } = authData;
    if (!idInstance || !apiTokenInstance) {
      navigate("/login");
      return;
    }
    setApiData(idInstance, apiTokenInstance);
  }, []);

  useEffect(() => {
    if (currentChatId) {
      const fetchInterval = setInterval(async () => {
        const receiptId = await fetchNotifs(idInstance, apiTokenInstance);
        if (receiptId)
          await deleteNotif(idInstance, apiTokenInstance, receiptId);
      }, 20500);
      return () => clearInterval(fetchInterval);
    }
  }, [currentChatId]);
  return (
    <>
      <NavBar />
      <Box
        sx={{
          height: "calc(100dvh - 60px)",
          display: "grid",
          gridTemplateColumns: "1fr 5fr",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridAutoRows: "min-content",
            gap: "20px",
            borderRight: "1px solid var(--joy-palette-success-500)",
          }}
        >
          <CreateChat />
          <ChatList />
        </Box>
        {currentChatId ? (
          <Box
            sx={{
              display: "grid",
              alignContent: "space-between",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {chatLoading && <MyLoader />}
            <CurrentChat setChatLoad={setChatLoad} />
            <MsgBox setChatLoad={setChatLoad} />
          </Box>
        ) : (
          <Box sx={{ p: "20px", display: "grid", placeItems: "center" }}>
            <Typography>Выберите чат или создайте новый</Typography>
          </Box>
        )}
      </Box>
    </>
  );
}

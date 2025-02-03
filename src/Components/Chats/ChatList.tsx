import {
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
} from "@mui/joy";
import useWpStore, { SingleChatType } from "../../stores/zustandStore";

export function ChatList() {
  const { chats } = useWpStore((state) => state);

  return (
    <List sx={{ pr: "20px", p: "20px" }}>
      {chats.map((chat) => (
        <Chat chat={chat} key={chat.chatId} />
      ))}
    </List>
  );
}

type ChatProps = {
  chat: SingleChatType;
};

function Chat({ chat }: ChatProps) {
  const { setCurrentChat, currentChatId } = useWpStore((state) => state);
  return (
    <ListItem>
      <ListItemButton
        variant={currentChatId === chat.chatId ? "soft" : "plain"}
        onClick={() =>
          currentChatId !== chat.chatId && setCurrentChat(chat.chatId)
        }
      >
        <ListItemContent>{chat.name}</ListItemContent>
        <Badge color="danger" badgeContent={chat.isNotif ? "" : 0}></Badge>
      </ListItemButton>
    </ListItem>
  );
}

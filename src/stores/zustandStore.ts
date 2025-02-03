import { create } from "zustand";

export type SingleChatType = {
  chatId: string;
  isNotif: boolean;
  name: string;
  msgs: Array<TextMsgType | QuotMsgType>;
};

type WpState = {
  idInstance: string;
  apiTokenInstance: string;
  currentChatId: string;
  chats: SingleChatType[];
  setApiData: (idInstance: string, apiTokenInstance: string) => void;
  setCurrentChat: (newChatId: string) => void;
  createChat: (chatId: string, name: string) => void;
  loadChatHistory: (
    msgs: (TextMsgType | QuotMsgType)[],
    chatId: string
  ) => void;
  addMessage: (msg: TextMsgType | QuotMsgType, chatId: string) => void;
  changeNotifStat: (chatId: string, isNotif: boolean) => void;
};

const useWpStore = create<WpState>()((set) => ({
  idInstance: "",
  apiTokenInstance: "",
  currentChatId: "",
  chats: [],
  setApiData: (idInstance, apiTokenInstance) =>
    set(() => ({ idInstance, apiTokenInstance })),
  setCurrentChat: (newChatId) => set(() => ({ currentChatId: newChatId })),
  createChat: (chatId, name) =>
    set((state) => ({
      chats: [...state.chats, { chatId, msgs: [], name, isNotif: false }],
    })),
  changeNotifStat: (chatId, isNotif) =>
    set((state) => {
      const curChat = state.chats.find((chat) => chat.chatId === chatId);
      if (!curChat) return state;
      return {
        chats: [
          { ...curChat, isNotif },
          ...state.chats.filter((chat) => chat.chatId !== chatId),
        ],
      };
    }),
  addMessage: (msg, chatId) =>
    set((state) => {
      const curChat = state.chats.find((chat) => chat.chatId === chatId);
      if (!curChat) return state;
      const isExists = curChat.msgs.find(
        (mes) => mes.idMessage === msg.idMessage
      );
      if (isExists) return state;
      return {
        chats: [
          { ...curChat, msgs: [...curChat.msgs, msg] },
          ...state.chats.filter((chat) => chat.chatId !== chatId),
        ],
      };
    }),
  loadChatHistory: (msgs, chatId) =>
    set((state) => {
      const curChat = state.chats.find((chat) => chat.chatId === chatId);
      if (!curChat) return state;
      return {
        chats: [
          { ...curChat, msgs: [...curChat.msgs, ...msgs] },
          ...state.chats.filter((chat) => chat.chatId !== chatId),
        ],
      };
    }),
}));

export default useWpStore;

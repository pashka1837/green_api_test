type HistoryMsgType = {
  chatId: string;
  deletedMessageId: string;
  editedMessageId: string;
  idMessage: string;
  isDeleted: boolean;
  isEdited: boolean;
  timestamp: number;
  type: "incoming" | "outgoing";
  typeMessage: "quotedMessage" | "textMessage";
};

type TextMsgType = HistoryMsgType & {
  sendByApi: boolean;
  statusMessage: string;
  textMessage: string;
};

type QuotMsgType = HistoryMsgType & {
  extendedTextMessage: {
    participant: string;
    stanzaId: string;
    text: string;
  };
  quotedMessage: {
    deletedMessageId: string;
    editedMessageId: string;
    isDeleted: boolean;
    isEdited: boolean;
    participant: string;
    stanzaId: string;
    textMessage: string;
    typeMessage: "textMessage";
  };
  senderContactName: string;
  senderId: string;
  senderName: string;
};

type IncomeMsgType = {
  typeWebhook: "incomingMessageReceived";
  instanceData: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };
  timestamp: number;
  idMessage: string;
  senderData: {
    chatId: string;
    sender: string;
    chatName: string;
    senderName: string;
    senderContactName: string;
  };
};

type IncomTextMsgType = IncomeMsgType & {
  messageData: {
    typeMessage: string;
    textMessageData: {
      textMessage: string;
    };
  };
};

type IncomQuotMsgType = IncomeMsgType & {
  messageData: {
    typeMessage: string;
    extendedTextMessageData: {
      text: string;
      stanzaId: string;
      participant: string;
    };
    quotedMessage: {
      stanzaId: string;
      participant: string;
      typeMessage: string;
      textMessage: string;
    };
  };
};

type IncomMsgResType = {
  receiptId: number;
  body: IncomTextMsgType | IncomQuotMsgType;
};

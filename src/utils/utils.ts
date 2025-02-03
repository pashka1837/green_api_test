export function buildMessage(
  typeMessage: "textMessage" | "quotedMessage",
  incomMsg: IncomTextMsgType | IncomQuotMsgType
): TextMsgType | QuotMsgType {
  if (typeMessage === "textMessage")
    return {
      chatId: incomMsg.senderData.chatId,
      deletedMessageId: "",
      editedMessageId: "",
      idMessage: incomMsg.idMessage,
      isDeleted: false,
      isEdited: false,
      timestamp: incomMsg.timestamp,
      type: "incoming",
      typeMessage: "textMessage",

      sendByApi: false,
      statusMessage: "",
      textMessage: (incomMsg as IncomTextMsgType).messageData.textMessageData
        .textMessage,
    };
  else
    return {
      chatId: incomMsg.senderData.chatId,
      deletedMessageId: "",
      editedMessageId: "",
      idMessage: incomMsg.idMessage,
      isDeleted: false,
      isEdited: false,
      timestamp: incomMsg.timestamp,
      type: "incoming",
      typeMessage: "quotedMessage",

      extendedTextMessage: {
        participant: (incomMsg as IncomQuotMsgType).messageData
          .extendedTextMessageData.participant,
        stanzaId: (incomMsg as IncomQuotMsgType).messageData
          .extendedTextMessageData.stanzaId,
        text: (incomMsg as IncomQuotMsgType).messageData.extendedTextMessageData
          .text,
      },
      quotedMessage: {
        deletedMessageId: "",
        editedMessageId: "",
        isDeleted: false,
        isEdited: false,

        participant: (incomMsg as IncomQuotMsgType).messageData.quotedMessage
          .participant,
        stanzaId: (incomMsg as IncomQuotMsgType).messageData.quotedMessage
          .stanzaId,
        textMessage: (incomMsg as IncomQuotMsgType).messageData.quotedMessage
          .textMessage,
        typeMessage: "textMessage",
      },
      senderContactName: incomMsg.senderData.senderContactName,
      senderId: incomMsg.senderData.sender,
      senderName: incomMsg.senderData.senderName,
    };
}

export function chatErrorHandle(
  setChatLoad: (value: React.SetStateAction<boolean>) => void,
  errMsg: string
) {
  setChatLoad(false);
  alert(errMsg);
  return;
}

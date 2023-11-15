import { useEffect, useRef, useState } from "react";
import FileTags from "src/components/chat/FileTags";
import Loader from "src/components/chat/Loader";
import MessageItem from "src/components/chat/MessageItem";
import ReplyBox from "src/components/chat/ReplyBox";
import docs from "src/helpers/http/docs";
import { createPairs, getLastNElements } from "src/helpers/mics";
import { getLastStoredDocsChat, storeDocsChat } from "src/helpers/storage";
import { MessageType } from "src/helpers/types/message.types";
import { getStoredUser } from "src/helpers/storage";
const MESSAGES = [
  {
    id: "1",
    message: "Hey there, lets get started!",
    isSent: false,
  },
];

type DocProps = {
  fileType: any;
};

const Documents = ({ fileType }: DocProps) => {
  const [messages, setMessages] = useState<MessageType[]>([...MESSAGES]);
  const [messageText, setMessageText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | null>([]); 
  const [filesLoading, setFilesLoading] = useState<boolean>(false); // New state for files loading
  const messagesEndRef = useRef<any>(null);
  const user = getStoredUser();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const storeToLocalStorage = async (newMsg: any) => {
    const currentMsgsString = await getLastStoredDocsChat(fileType);
    let currentMsgs = [];
    if (currentMsgsString) {
      currentMsgs = JSON.parse(currentMsgsString);
    } else {
      currentMsgs = [
        {
          id: "1",
          message: "Hey there, lets get started!",
          isSent: false,
        },
      ];
    }
    const newMessages = [...currentMsgs, newMsg];
    const get100Msgs = await getLastNElements(newMessages, 100);
    storeDocsChat(fileType, JSON.stringify(get100Msgs));
  };

  const onSend = (message: string) => {
    if (loading) return;
    const newMessageId = new Date().getTime();
    storeToLocalStorage({
      message,
      id: `msg-${newMessageId}`,
      isSent: true,
    });
    setTimeout(() => {
      setMessageText("");
      setLoading(true);
      setMessages((prev) => [
        ...prev,
        {
          message,
          id: `msg-${newMessageId}`,
          isSent: true,
        },
      ]);
      submitQueryToAI(message);
    }, 300);
  };

  const submitQueryToAI = async (query: string) => {
    const currentMessages = [...messages];
    const elementsExceptFirst = currentMessages.slice(1);
    const last10Msgs = await getLastNElements(elementsExceptFirst, 10);
    const last10MsgsText = last10Msgs?.map((i: any) => i?.message);
    const history = await createPairs(last10MsgsText);
    const payload = {
      q: query,
      history: messages?.length > 2 ? history : [],
      file_type: fileType,
    };
      try {
        // @ts-ignore
        let userId = JSON.parse(user)?.userId;
        let resp = await fetch(`https://r6k1vdua19.execute-api.eu-north-1.amazonaws.com/dev/api/users/${userId}/files/query?file_type=${fileType}&q=${query}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        let res = await resp.json()
        if (res?.statusCode) {
          const newSysMessageId = new Date().getTime();
          storeToLocalStorage({
            message: res?.body?.message || "Sorry, please try again!",
            id: `msg-${newSysMessageId}`,
            isSent: false,
          });
          setMessages((prev) => [
            ...prev,
            {
              message: res?.body?.message || "Sorry, please try again!",
              id: `msg-${newSysMessageId}`,
              isSent: false,
            },
          ]);
        } else {
          console.log("Error");
        }
        setLoading(false);
      }
     catch (error) {
        setLoading(false);
    }
  };

  const messagesAreaHeight = () => {
    const replyBoxHeight = document.getElementById("reply-box")?.offsetHeight;
    if (replyBoxHeight) {
      const height = `calc(100vh-${replyBoxHeight})`;
      return height;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLastMessages = async () => {
    const lastMessages = await getLastStoredDocsChat(fileType);
    if (lastMessages) {
      const currentMsgs = await JSON.parse(lastMessages);
      setMessages(currentMsgs);
    } else {
      setMessages([...MESSAGES]);
    }
  };

  useEffect(() => {
    getLastMessages();
  }, []);

  const deleteChat = async () => {
    await localStorage.removeItem("uniqueId");
    await localStorage.removeItem("lastTodos");
    getLastMessages();
    // @ts-ignore
    setMessages([{message: "Hey there, lets get started!", id: "1", isSent: false}])
  };

  return (
    <div className="ml-5 bg-white  rounded-lg h-[calc(100vh-32px)] flex-1 flex flex-col items-start p-4 gap-2">
      {messages?.length > 1 && (
        <div
          onClick={deleteChat}
          className="cursor-pointer self-end text-red-600 p-2 rounded-lg hover:bg-gray-100"
        >
          Clear chat
        </div>
      )}
        <FileTags fileType={fileType} filesLoading={filesLoading} />
      <div
        className="flex flex-col w-full flex-1 overflow-auto pr-1 mb-1"
        style={{
          height: messagesAreaHeight(),
        }}
      >
        {messages.map((item) => (
          <MessageItem message={item} key={item.id} />
        ))}
        {loading && (
          <div className="flex px-4 mt-4">
            <Loader />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ReplyBox
        onSend={onSend}
        messageText={messageText}
        setMessageText={setMessageText}
        isLoading={loading}
        fileType={fileType}
        files={files}
        setFiles={setFiles}
        setFilesLoading={setFilesLoading}
      />
    </div>
  );
};

export default Documents;

import { useEffect, useRef, useState } from "react";
import Loader from "src/components/chat/Loader";
import MessageItem from "src/components/chat/MessageItem";
import ReplyBox from "src/components/chat/ReplyBox";
import docs from "src/helpers/http/docs";
import { createPairs, getLastNElements } from "src/helpers/mics";
import { getLastStoredDocsChat, storeDocsChat } from "src/helpers/storage";
import { MessageType } from "src/helpers/types/message.types";
import { getStoredUser } from "src/helpers/storage";
import apiClient from "src/helpers/http/client";
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
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
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
      try {
        const resp = await apiClient.post(
          `/users/${userId}/code/query?file_type=${fileType}&q=${query}`,
          payload
        );
        const res = resp?.data;
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
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
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
    await localStorage.removeItem("lastCode");
    getLastMessages();
    // @ts-ignore
    setMessages([
      { message: "Hey there, lets get started!", id: "1", isSent: false },
    ]);
  };

  return (
    <div className="ml-5 bg-white rounded-2xl h-[calc(100vh-32px)] flex-1 flex flex-col items-start p-4 gap-2">
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
      <div className="flex w-full items-end">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={45}
          height={45}
          fill="none"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M7.5.25a7.25 7.25 0 0 0-2.292 14.13c.363.066.495-.158.495-.35 0-.172-.006-.628-.01-1.233-2.016.438-2.442-.972-2.442-.972-.33-.838-.805-1.06-.805-1.06-.658-.45.05-.441.05-.441.728.051 1.11.747 1.11.747.647 1.108 1.697.788 2.11.602.066-.468.254-.788.46-.969-1.61-.183-3.302-.805-3.302-3.583 0-.792.283-1.438.747-1.945-.075-.184-.324-.92.07-1.92 0 0 .61-.194 1.994.744A6.963 6.963 0 0 1 7.5 3.756 6.97 6.97 0 0 1 9.315 4c1.384-.938 1.992-.743 1.992-.743.396.998.147 1.735.072 1.919.465.507.745 1.153.745 1.945 0 2.785-1.695 3.398-3.31 3.577.26.224.492.667.492 1.343 0 .97-.009 1.751-.009 1.989 0 .194.131.42.499.349A7.25 7.25 0 0 0 7.499.25Z"
            clipRule="evenodd"
          />
        </svg>

        <ReplyBox
          onSend={onSend}
          messageText={messageText}
          setMessageText={setMessageText}
          isLoading={loading}
          files={null}
          setFiles={() => {}}
          setFilesLoading={() => {}}
        />
      </div>
    </div>
  );
};

export default Documents;

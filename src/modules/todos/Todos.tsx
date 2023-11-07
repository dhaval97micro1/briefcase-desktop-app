// import ComponentLayout from "../../components/layouts/ComponentLayout";

import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Loader from "src/components/chat/Loader";
import MessageItem from "src/components/chat/MessageItem";
import ReplyBox from "src/components/chat/ReplyBox";
import { getLastNElements } from "src/helpers/mics";
import {
  getLastStoredTodos,
  getStoredUser,
  storeTodos,
} from "src/helpers/storage";
import { MessageType } from "src/helpers/types/message.types";
import todos from "../../helpers/http/todos";

const MESSAGES = [
  {
    id: "1",
    message: "Hey there, lets get started!",
    isSent: false,
  },
];

const Todos = () => {
  const [messages, setMessages] = useState<MessageType[]>([...MESSAGES]);
  const [messageText, setMessageText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  const getUniqueId = async () => {
    const userString = await getStoredUser();
    if (userString) {
      const userInfo = JSON.parse(userString);
      setUserId(userInfo.userId);
    }
    // const storedUniqueId = await localStorage.getItem("uniqueId");
    // if (storedUniqueId) {
    //   setUserId(storedUniqueId);
    // } else {
    //   const uniqueId = await new Date().getTime();
    //   setUserId(uniqueId + "");
    //   localStorage.setItem("uniqueId", uniqueId + "");
    // }
  };

  useEffect(() => {
    getUniqueId();
  }, []);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const storeToLocalStorage = async (newMsg: any) => {
    const currentMsgsString = await getLastStoredTodos();
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
    storeTodos(JSON.stringify(get100Msgs));
    // const newMessages = getLastNElements()
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

  const submitQueryToAI = (query: string) => {
    const payload = {
      query,
      userId,
    };
    todos
      .manageTodo(payload)
      .then(async (res) => {
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
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const messagesAreaHeight = () => {
    const replyBoxHeight = document.getElementById("reply-box")?.offsetHeight;
    if (replyBoxHeight) {
      const height = `calc(100vh-${replyBoxHeight})`;
      return height;
    }
  };

  const getCurrentToDoList = () => {
    onSend("What’s my current to do list?");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getLastMessages = async () => {
    const lastMessages = await getLastStoredTodos();
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
    getUniqueId();
  };

  return (
    <div className="ml-5 bg-white rounded-lg h-[calc(100vh-32px)] flex-1 flex flex-col items-start p-4 gap-2">
      {messages?.length > 1 && (
        <div
          onClick={deleteChat}
          className="cursor-pointer self-end text-red-600 p-2 rounded-lg hover:bg-gray-100"
        >
          Clear chat
        </div>
      )}
      <div
        className="flex flex-col w-full flex-1 overflow-auto pr-1 mb-1"
        style={{
          height: messagesAreaHeight(),
        }}
      >
        {messages.map((item) => (
          <MessageItem message={item} />
        ))}
        {loading && (
          <div className="flex px-4 mt-4">
            <Loader />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div
        onClick={getCurrentToDoList}
        className={classNames(
          "flex self-center text-sm text-[#A1A1AB] text-center mb-1 hover:text-[#84848b]",
          {
            "cursor-pointer": !loading,
            "opacity-50": loading,
          }
        )}
      >
        What’s my current to do list?
      </div>
      <ReplyBox
        onSend={onSend}
        messageText={messageText}
        setMessageText={setMessageText}
        isLoading={loading}
      />
    </div>
  );
};

export default Todos;

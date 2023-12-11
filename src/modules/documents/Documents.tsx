import { useEffect, useRef, useState } from "react";
import Loader from "src/components/chat/Loader";
import MessageItem from "src/components/chat/MessageItem";
import ReplyBox from "src/components/chat/ReplyBox";
import { createPairs, getLastNElements } from "src/helpers/mics";
import { getLastStoredDocsChat, storeDocsChat } from "src/helpers/storage";
import { MessageType } from "src/helpers/types/message.types";
import { getStoredUser } from "src/helpers/storage";
import apiClient from "src/helpers/http/client";
import FilesMenu from "./FilesMenu";
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
  const [showFilesMenu, setShowFilesMenu] = useState<boolean>(false);

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
          `/users/${userId}/files/query?file_type=${fileType}&q=${query}`,
          payload
        );
        const res = resp?.data;
        if (res?.statusCode) {
          // This means that the run has been init
          let run_id = res?.body?.run_id;

          // We will loop every two seconds to check if the run has been complted
          var run_complete = false;
          var message = "";
          var total_polls = 0;

          while (run_complete === false) {
            // Wait for 1500 ms
            await new Promise((resolve) => setTimeout(resolve, 3500));

            let run_poll_resp = await apiClient.post(
              `/users/${userId}/files/poll/run?file_type=${fileType}&q=${query}`,
              { run_id, file_type: fileType }
            );

            if (total_polls > 30) {
              run_complete = true;
              message = "";
            }

            if (run_poll_resp?.data?.body?.completed === true) {
              run_complete = true;
              message = run_poll_resp?.data?.body?.message;
            }

            total_polls += 1;
          }

          const newSysMessageId = new Date().getTime();
          storeToLocalStorage({
            message: message || "Sorry, please try again!",
            id: `msg-${newSysMessageId}`,
            isSent: false,
          });
          setMessages((prev) => [
            ...prev,
            {
              message: message || "Sorry, please try again!",
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

  const handleUserChatHistory = async () => {
    try {
      // Call the api at  /api/users/{userId}/files/query/chat-history and getthe list of chat history frm openai
      // @ts-ignore
      let userId = JSON.parse(user)?.userId;
      const resp = await apiClient.get(
        `/users/${userId}/files/query/chat-history?file_type=${fileType}`
      );
      const res = resp?.data;
      if (res?.statusCode) {
        // Store the chat history in local storage
        // This function will be called only once when the user opens the chat for the first time

        let messages = res?.body?.chatHistory;
        console.log(messages);

        // Reverse messages array
        messages = messages.reverse();

        storeDocsChat(fileType, JSON.stringify(messages));

        getLastMessages();
      } else {
        console.log("Error");
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
    await localStorage.removeItem("lastDocsChat_" + fileType);
    getLastMessages();
    // @ts-ignore
    setMessages([
      { message: "Hey there, lets get started!", id: "1", isSent: false },
    ]);
  };

  const toggleFilesMenu = () => {
    setShowFilesMenu((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      handleUserChatHistory();
    }
  }, []);

  const openSidePanel = () => {
    setShowFilesMenu(true);
  };

  return (
    <div className="ml-5 bg-white rounded-2xl h-[calc(100vh-32px)] flex-1 flex flex-col items-start p-4 gap-2 overflow-x-hidden shadow-[0px_2px_14px_0px_rgba(0,0,0,0.05)]">
      {!showFilesMenu && (
        <div
          onClick={toggleFilesMenu}
          className="z-[9] cursor-pointer p-2 rounded-lg hover:bg-gray-100 border border-solid border-[#EAEAEA] absolute right-8"
        >
          <MenuIcon />
        </div>
      )}
      <div className="flex w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
        <div className="flex flex-col w-full flex-1 overflow-auto pr-1">
          <div
            className="flex flex-col w-full flex-1 overflow-auto pr-6 mb-6"
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
            files={files}
            setFiles={setFiles}
            setFilesLoading={setFilesLoading}
            openSidePanel={openSidePanel}
          />
        </div>
        <FilesMenu
          show={showFilesMenu}
          onClose={toggleFilesMenu}
          fileType={fileType}
          filesLoading={filesLoading}
        />
      </div>
    </div>
  );
};

export default Documents;

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
  >
    <path
      d="M5.25 4.375C5.25 5.34147 4.46647 6.125 3.5 6.125C2.53353 6.125 1.75 5.34147 1.75 4.375C1.75 3.40853 2.53353 2.625 3.5 2.625C4.46647 2.625 5.25 3.40853 5.25 4.375Z"
      fill="black"
    />
    <path
      d="M8.75 6.125H17.5C18.4625 6.125 19.25 5.3375 19.25 4.375C19.25 3.4125 18.4625 2.625 17.5 2.625H8.75C7.7875 2.625 7 3.4125 7 4.375C7 5.3375 7.7875 6.125 8.75 6.125Z"
      fill="black"
    />
    <path
      d="M5.25 10.5C5.25 11.4665 4.46647 12.25 3.5 12.25C2.53353 12.25 1.75 11.4665 1.75 10.5C1.75 9.53353 2.53353 8.75 3.5 8.75C4.46647 8.75 5.25 9.53353 5.25 10.5Z"
      fill="black"
    />
    <path
      d="M17.5 8.75H8.75C7.7875 8.75 7 9.5375 7 10.5C7 11.4625 7.7875 12.25 8.75 12.25H17.5C18.4625 12.25 19.25 11.4625 19.25 10.5C19.25 9.5375 18.4625 8.75 17.5 8.75Z"
      fill="black"
    />
    <path
      d="M5.25 16.625C5.25 17.5915 4.46647 18.375 3.5 18.375C2.53353 18.375 1.75 17.5915 1.75 16.625C1.75 15.6585 2.53353 14.875 3.5 14.875C4.46647 14.875 5.25 15.6585 5.25 16.625Z"
      fill="black"
    />
    <path
      d="M17.5 14.875H8.75C7.7875 14.875 7 15.6625 7 16.625C7 17.5875 7.7875 18.375 8.75 18.375H17.5C18.4625 18.375 19.25 17.5875 19.25 16.625C19.25 15.6625 18.4625 14.875 17.5 14.875Z"
      fill="black"
    />
  </svg>
);

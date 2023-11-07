import classNames from "classnames";

type Props = {
  messageText: string;
  setMessageText: (value: string) => void;
  onSend: (msg: string) => void;
  isLoading?: boolean;
};

const ReplyBox = ({
  onSend,
  messageText,
  setMessageText,
  isLoading,
}: Props) => {
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!messageText) {
      return;
    }
    onSend(messageText);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };
  return (
    <form
      className="flex items-center w-full"
      onSubmit={onSubmit}
      id="reply-box"
    >
      <input
        placeholder="Start typing…"
        value={messageText}
        onChange={onChange}
        className="w-full focus:outline-none rounded-[30px] bg-[#f1f0f0] h-[60px] px-7"
      />
      <button
        onClick={onSubmit}
        disabled={messageText === "" || isLoading}
        className={classNames("p-2 rounded-full", {
          "cursor-pointer hover:bg-[lightgray]":
            messageText !== "" && !isLoading,
          "opacity-60": messageText === "" || isLoading,
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19.7216 0.423088C23.2265 -1.21674 27.1785 2.18392 25.6697 5.92228L18.6647 23.278C17.2703 26.733 12.4131 26.9413 10.7012 23.6604L7.65951 18.4755L2.6955 16.3682C-0.79962 14.933 -0.929304 10.085 2.50254 8.47934L19.7216 0.423088ZM10.4731 17.5641L13.2113 22.2315C13.2259 22.2563 13.2397 22.2816 13.2527 22.3072C13.8275 23.4363 15.5198 23.3542 15.9872 22.1961L22.9921 4.84037C23.4443 3.71991 22.2552 2.42718 20.9447 3.04036L3.7257 11.0966C2.58006 11.6326 2.61455 13.215 3.79595 13.697L3.81484 13.7046L3.81478 13.7048L8.33054 15.6218L12.6954 11.2545C13.2592 10.6904 14.1734 10.6904 14.7373 11.2545C15.3011 11.8186 15.3011 12.7334 14.7373 13.2975L10.4731 17.5641Z"
            fill="#565D65"
          />
        </svg>
      </button>
    </form>
  );
};

export default ReplyBox;

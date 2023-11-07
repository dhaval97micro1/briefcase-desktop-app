import styled from "styled-components";

const StyledMessageBubble = styled.div`
  .system-message {
    border-radius: 8px 8px 8px 0px;
  }
`;

const Loader = () => {
  return (
    <StyledMessageBubble className="flex items-end mt-4 max-w-[70%] gap-[5px]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24H0V12Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.3174 8.73301C15.3665 8.73301 16.0896 8.97181 16.5225 9.44941C17.0012 9.97782 17.0114 10.679 16.9707 11.1922C16.9682 11.209 16.967 11.2237 16.9657 11.2376C16.9644 11.253 16.9631 11.2676 16.9605 11.2836L16.935 11.5224L16.927 11.5947C16.9191 11.6652 16.8823 11.7294 16.8247 11.7708C16.6336 11.9083 16.4241 12.0487 16.2221 12.1626C16.2136 12.1677 16.2056 12.1728 16.1977 12.1778C16.1819 12.188 16.166 12.1982 16.1457 12.2083C15.2392 12.7367 14.236 13.0975 13.1971 13.2652C13.1614 13.758 12.9425 14.3118 11.8272 14.3118C10.7119 14.3118 10.5032 13.7529 10.4573 13.2753C9.48465 13.1178 8.52726 12.7977 7.65644 12.3201C7.58005 12.2795 7.50366 12.2388 7.43237 12.1931C7.30988 12.1252 7.10554 11.9938 6.98341 11.914C6.91927 11.8722 6.87815 11.8033 6.87087 11.727L6.83145 11.3141L6.82636 11.2785C6.77543 10.7654 6.76016 10.0134 7.26431 9.45449C7.69718 8.97689 8.41522 8.73809 9.46937 8.73809H9.59159V8.71269C9.59159 7.86418 9.59159 6.80228 11.5064 6.80228H12.2804C14.1952 6.80228 14.1952 7.8591 14.1952 8.71269V8.73301H14.3174ZM11.8221 13.5497C12.4485 13.5497 12.4485 13.4684 12.4485 12.9298V12.2947H11.1957V12.9349C11.1957 13.4531 11.1957 13.5497 11.8221 13.5497ZM10.3198 8.71269V8.73301V8.73809H13.467V8.71269C13.467 7.85402 13.467 7.52884 12.2804 7.52884H11.5064C10.3198 7.52884 10.3198 7.84894 10.3198 8.71269ZM16.7817 13.1363C16.7997 12.938 16.5928 12.7954 16.4129 12.8808C15.8061 13.1689 14.6654 13.6887 13.9626 13.8732C13.879 13.8951 13.8113 13.9549 13.7746 14.0331C13.4645 14.6943 12.7856 15.0587 11.8272 15.0587C10.8592 15.0587 10.1888 14.7078 9.87971 14.0483C9.84305 13.9701 9.77544 13.9103 9.69188 13.8885C9.03006 13.7156 7.95837 13.2505 7.37821 12.9886C7.19883 12.9077 6.99657 13.0501 7.01443 13.2461L7.18792 15.1502C7.29487 16.1613 7.71245 17.1978 9.95316 17.1978H13.8337C16.0744 17.1978 16.492 16.1613 16.5989 15.1451L16.7817 13.1363Z"
          fill="#403DEC"
        />
        <path
          d="M0.383675 12C0.383675 5.58448 5.58448 0.383675 12 0.383675C18.4155 0.383675 23.6163 5.58448 23.6163 12C23.6163 18.4155 18.4155 23.6163 12 23.6163H0.383675V12Z"
          stroke="rgba(36, 0, 255, 0.13)"
          stroke-width="0.76735"
        />
      </svg>
      <div className="p-3 bg-[#E0E2F8] system-message">
        <svg
          width="60"
          height="16"
          viewBox="0 0 120 30"
          xmlns="http://www.w3.org/2000/svg"
          fill="#403DEC"
        >
          <circle cx="15" cy="15" r="15">
            <animate
              attributeName="r"
              from="15"
              to="15"
              begin="0s"
              dur="0.8s"
              values="15;9;15"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="15" r="9" fill-opacity="0.3">
            <animate
              attributeName="r"
              from="9"
              to="9"
              begin="0s"
              dur="0.8s"
              values="9;15;9"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="105" cy="15" r="15">
            <animate
              attributeName="r"
              from="15"
              to="15"
              begin="0s"
              dur="0.8s"
              values="15;9;15"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </StyledMessageBubble>
  );
};

export default Loader;

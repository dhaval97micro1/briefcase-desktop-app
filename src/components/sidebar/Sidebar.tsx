import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { clearStorage, getStoredUser } from "src/helpers/storage";
import { UserDetailsType } from "src/helpers/types/user.types";
import ProfileThumbnail from "../ProfileThumbnail";

const MENU = [
  {
    title: "Documents",
    subtitle: "Get answers, generate scenarios and content.",
    path: "/documents",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M15.0591 0.880005H7.93769C7.52927 0.880005 7.13753 1.04228 6.84872 1.33104C6.5599 1.61986 6.39769 2.01159 6.39769 2.42V4.4H4.41769C4.00927 4.4 3.61753 4.56228 3.32872 4.85104C3.0399 5.13986 2.87769 5.53159 2.87769 5.94V19.58C2.87769 19.9884 3.03989 20.3802 3.32872 20.669C3.61755 20.9577 4.00927 21.12 4.41769 21.12H14.0625C14.4709 21.12 14.8626 20.9577 15.1515 20.669C15.4403 20.3801 15.6025 19.9884 15.6025 19.58V17.6H17.5825C17.9909 17.6 18.3826 17.4377 18.6715 17.149C18.9603 16.8601 19.1225 16.4684 19.1225 16.06V4.675C19.1223 4.61406 19.0968 4.55584 19.0521 4.51437L15.2087 0.939374C15.1682 0.901418 15.1147 0.880219 15.0591 0.880005ZM15.2791 1.6038L18.3459 4.4638H15.2791V1.6038ZM14.0625 20.6796H4.4177C4.12595 20.6796 3.84614 20.5638 3.63989 20.3574C3.43357 20.1512 3.3177 19.8714 3.3177 19.5796V5.93964C3.3177 5.64788 3.43358 5.36808 3.63989 5.16183C3.84614 4.9555 4.12595 4.83964 4.4177 4.83964H11.3191V8.19464C11.3191 8.253 11.3423 8.30894 11.3836 8.35018C11.4248 8.39144 11.4808 8.41464 11.5391 8.41464H15.1625V19.5796C15.1625 19.8714 15.0466 20.1512 14.8403 20.3574C14.6341 20.5638 14.3543 20.6796 14.0625 20.6796ZM11.7591 5.12344L14.8259 7.98344H11.7591V5.12344ZM17.5825 17.1596H15.6025V8.19464C15.6024 8.13369 15.5769 8.07547 15.5321 8.03401L11.6887 4.45901C11.6482 4.42105 11.5947 4.39985 11.5391 4.39964H6.8377V2.41964C6.8377 2.12788 6.95358 1.84808 7.15989 1.64183C7.36614 1.4355 7.64595 1.31964 7.9377 1.31964H14.8391V4.67464C14.8391 4.733 14.8623 4.78894 14.9036 4.83019C14.9448 4.87144 15.0008 4.89464 15.0591 4.89464H18.6825V16.0596C18.6825 16.3514 18.5666 16.6312 18.3603 16.8374C18.1541 17.0438 17.8743 17.1596 17.5825 17.1596Z"
          fill="black"
        />
      </svg>
    ),
  },
  {
    title: "To-Do's",
    subtitle: "Get things done.",
    path: "/todos",
    icon: (
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
        <path
          d="M16.6678 3.09576L7.96037 11.8039L4.33192 8.17514L1.28149 11.2257L7.96037 17.9041L19.7183 6.14636L16.6678 3.09576ZM1.57847 11.2257L4.33192 8.47194L7.96037 12.1007L16.6678 3.39256L19.4213 6.14636L7.96037 17.6071L1.57847 11.2257Z"
          fill="black"
        />
      </svg>
    ),
  },
];
const Sidebar = () => {
  const [user, setUser] = useState<UserDetailsType | null>(null);
  const location = useLocation();

  const getUser = async () => {
    const userString = await getStoredUser();
    if (userString) {
      const userInfo = JSON.parse(userString);
      setUser(userInfo);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    await clearStorage();
    window.location.replace("/#/login");
  };
  return (
    <div className="w-[25%] min-w-[352px] bg-white rounded-lg h-[calc(100vh-32px)] pt-6 flex flex-col">
      <div className="flex-1">
        {MENU.map((item) => (
          <div key={item.title}>
            <Link
              to={item.path}
              className={classNames(
                "flex items-center px-4 py-4 mx-4 my-2 cursor-pointer hover:bg-[#EDEDED] rounded-lg",
                {
                  "bg-[#EDEDED]": location.pathname.includes(item.path),
                }
              )}
            >
              {item.icon}
              <div className="flex flex-col items-start ml-6 flex-1">
                <div className="text-lg font-medium">{item.title}</div>
                <div className="text-[15px] text-[#282834] text-start">
                  {item.subtitle}
                </div>
              </div>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M10.8 7.53127C10.7999 7.65554 10.7505 7.77468 10.6625 7.86252L5.03753 13.4563C4.95081 13.5493 4.83 13.6031 4.70287 13.6054C4.57567 13.6076 4.45307 13.5581 4.36312 13.4682C4.27317 13.3782 4.22367 13.2556 4.2259 13.1284C4.22815 13.0013 4.28196 12.8805 4.37503 12.7938L9.66253 7.50002L4.33753 2.17502C4.2636 2.05232 4.24988 1.90256 4.30017 1.76848C4.35052 1.6344 4.4594 1.53065 4.59577 1.48685C4.73215 1.4431 4.88102 1.46404 5.00002 1.54378L10.6563 7.20003C10.7465 7.2868 10.7983 7.40607 10.8 7.53127Z"
                  fill="gray"
                />
              </svg>
            </Link>
            <div className="separator h-px w-full mx-4 bg-[#EBEBEB]" />
          </div>
        ))}
      </div>
      <button onClick={logout} className="mb-2 text-red-600 text-base">
        Logout
      </button>
      <div className="mb-6 flex items-center justify-center gap-1.5">
        <ProfileThumbnail
          image={user?.userImage}
          firstName={user?.firstName}
          lastName={user?.lastName}
        />
        <div className="text-sm text-gray-500">
          <span className="font-medium">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

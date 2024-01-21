import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { Chats, Messages, User } from "./types";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface ChatContextProps {
  user: User | undefined | null;
  setUser: React.Dispatch<React.SetStateAction<User | undefined | null>>;
  chats: Chats[] | undefined | null;
  setchats: React.Dispatch<React.SetStateAction<Chats[] | null | undefined>>;
  searchmodal: boolean;
  setsearchmodal: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Messages[] | undefined | null;
  setmessages: React.Dispatch<
    React.SetStateAction<Messages[] | null | undefined>
  >;
  openChatbox: boolean;
  setopenChatbox: React.Dispatch<React.SetStateAction<boolean>>;
  messagesent: boolean;
  setmessagesent: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChats: Chats | null | undefined;
  setselectedChats: React.Dispatch<
    React.SetStateAction<Chats | null | undefined>
  >;
  socketstate: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  setsocketstate: React.Dispatch<
    React.SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>
  >;
  notifications: Messages[] | undefined | null;
  setnotifications: React.Dispatch<
    React.SetStateAction<Messages[] | null | undefined>
  >;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
  // You can provide the actual context value here
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const [chats, setchats] = useState<Chats[] | undefined | null>(undefined);
  const [searchmodal, setsearchmodal] = useState(false);
  const [messages, setmessages] = useState<Messages[] | null | undefined>(
    undefined
  );
  const [messagesent, setmessagesent] = useState(false);
  const [openChatbox, setopenChatbox] = useState(false);
  const [selectedChats, setselectedChats] = useState<Chats | undefined | null>(
    undefined
  );
  const [socketstate, setsocketstate] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [notifications, setnotifications] = useState<
    Messages[] | null | undefined
  >();
  const navigate = useNavigate();
  const userData = localStorage.getItem("userinfo");

  useEffect(() => {
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/auth");
    }
  }, [userData, navigate]);
  const contextValue: ChatContextProps = {
    // Define your context value properties or methods

    user,
    setUser,
    chats,
    setchats,
    searchmodal,
    setsearchmodal,
    messages,
    setmessages,
    openChatbox,
    setopenChatbox,
    messagesent,
    setmessagesent,
    selectedChats,
    setselectedChats,
    socketstate,
    setsocketstate,
    notifications,
    setnotifications,
  };

  // console.log(user);

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChatState = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;

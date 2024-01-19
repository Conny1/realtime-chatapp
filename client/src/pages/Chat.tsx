import { useState, useEffect } from "react";
import { styled } from "styled-components";
import Navbar from "../components/Navbar";
import autimage from "../images/auth.jpg";
import Profile from "../components/Profile";
import Addgroup from "../components/AddGroupModal";
import { useChatState } from "../state/state";
import EachChat from "../components/EachChat";
import axios from "axios";
import { Chats, MyApiError } from "../state/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import MessagesChatsBox from "../components/MessagesChatsBox";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { mobileResopnsive } from "../utils/responsive";

const Maincontainer = styled.div`
  background-image: url(${autimage});
  background-position: center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const NavContainer = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  background-position: center;
  background-size: cover;
  min-height: 100vh;
  max-width: 1280px;
  width: 98%;
  display: flex;
  gap: 10px;
  align-items: center;
  /* outline: 1px solid red; */
  ${mobileResopnsive({
    justifyContent: "center",
    gap: 0,
  })}
`;

const ChatContainer = styled.div`
  width: 30%;
  max-width: 500px;
  background-color: #fff;
  min-height: 96vh;
  padding: 5px;
  /* outline: 1px solid red; */
  ${mobileResopnsive({
    display: "none",
  })}
`;

const ResponsiveChatContainer = styled.div`
  position: absolute;
  display: none;
  left: 0;
  width: 90%;
  max-width: 500px;
  background-color: #fff;
  min-height: 96vh;
  padding: 5px;
  outline: 1px solid red;
  z-index: 999;
  ${mobileResopnsive({
    display: "block",
  })};
`;

const MyChatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-weight: 500;
    font-size: 18px;
  }
  button {
    border: none;
    height: 35px;
    width: 150px;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
  }
`;
const ContactsContainer = styled.div`
  /* outline: 1px solid red; */
  height: 80vh;
  overflow-y: scroll;
  section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
const MessageContainer = styled.div`
  flex: 1;
  background-color: #fff;
  height: 97vh;
  padding-left: 5px;
  padding-right: 5px;
  /* outline: 1px solid red; */
  /* ${mobileResopnsive({})} */
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    background-color: gainsboro;
    padding: 5px;
    outline: 1px solid gray;
    cursor: pointer;
    display: none;
    ${mobileResopnsive({
      display: "block",
      width: "fit-content",
    })}
  }

  h2 {
    font-weight: 500;
    font-size: 20px;
  }
  button {
    border: none;
    height: 30px;
    width: fit-content;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
  }
`;

const MessagesChat = styled.div`
  background-color: gainsboro;
  height: 80vh;
  /* overflow-y: scroll; */
`;
const Chatform = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  :nth-child(n) {
    flex: 1;
    height: 93%;
  }
  :nth-child(n + 2) {
    flex: 0;
    height: 100%;
  }
`;

const Chat = () => {
  const [profilemodal, setprofilemodal] = useState(false);
  const [addgroup, setaddgroup] = useState(false);
  const {
    user,
    setchats,
    chats,
    searchmodal,
    setmessagesent,
    messagesent,
    setsocketstate,
    socketstate,
    selectedChats,
  } = useChatState();
  const [chatnotfound, setchatnotfound] = useState(false);
  const [messagetosend, setmessagetosend] = useState("");
  const [selectedChatId, setselectedChatId] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);
  const [chatsModal, setchatsModal] = useState(false);

  const navigate = useNavigate();
  const ENDPOINT = import.meta.env.VITE_URL;

  useEffect(() => {
    const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(ENDPOINT);

    setsocketstate(socket);
    if (user) {
      // console.log(user);
      socket.emit("setup", user);
      socket.on("connected", () => setsocketConnected(false));
    }
    console.log(socketConnected);
  }, [user]);

  useEffect(() => {
    const config = {
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${user?.tokens}`,
      },
    };
    const fetchChats = async () => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_URL}/chats/fetchchats/${user?._id}`,
          config
        );

        setchats(resp.data);
      } catch (error) {
        const ApiError = error as MyApiError;
        if (ApiError.response && ApiError.response.status) {
          switch (ApiError.response.status) {
            case 404:
              setchatnotfound(true);
              break;
            case 400:
              navigate("/auth");
              break;
            case 401:
              navigate("/auth");
              break;
            case 403:
              navigate("/auth");
              break;

            default:
              toast("Network Error Try again");
              break;
          }
        }
      }
    };

    if (user?._id) {
      fetchChats();
    }
  }, [user, setchats, searchmodal, addgroup, navigate, messagesent]);

  const SendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setmessagesent(false);
    const config = {
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${user?.tokens}`,
      },
    };

    const data = {
      chatid: selectedChatId,
      userid: user?._id,
      content: messagetosend,
    };
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/messages/sendmessage`,
        data,
        config
      );
      if (resp.data) {
        toast("Message Delivered");
        setmessagetosend("");
        setmessagesent(true);
        if (socketstate) {
          socketstate.emit("newmessage", resp.data);
        }
      }
    } catch (error) {
      console.log(error);
      const ApiError = error as MyApiError;
      if (ApiError.response && ApiError.response.status) {
        switch (ApiError.response.status) {
          case 404:
            break;
          case 400:
            navigate("/auth");
            break;
          case 401:
            navigate("/auth");
            break;
          case 403:
            navigate("/auth");
            break;

          default:
            toast("Network Error Try again");
            break;
        }
      }
    }
  };

  return (
    <Maincontainer>
      <NavContainer>
        <Navbar />
      </NavContainer>
      <Container>
        <ToastContainer />
        <ChatContainer>
          <MyChatsContainer>
            <h2>My Chats</h2>

            <button onClick={() => setaddgroup(true)}>New Group Chat +</button>
            {/* AddGroup modal component */}
            {addgroup && <Addgroup setaddgroup={setaddgroup} />}
          </MyChatsContainer>
          <ContactsContainer>
            {chatnotfound ? (
              <button>
                {" "}
                {chats
                  ? "No chat history. Search for users to Add"
                  : "Guest User"}{" "}
              </button>
            ) : (
              //  Each Chat

              <section>
                {chats?.map((chat: Chats) => {
                  return (
                    <EachChat
                      key={chat._id}
                      {...chat}
                      setselectedChatId={setselectedChatId}
                    />
                  );
                })}
              </section>
            )}
          </ContactsContainer>
        </ChatContainer>
        {/* responsive chats container */}
        {chatsModal && (
          <ResponsiveChatContainer>
            <MyChatsContainer>
              <h2>My Chats</h2>

              <button onClick={() => setaddgroup(true)}>
                New Group Chat +
              </button>
              {/* AddGroup modal component */}
              {addgroup && <Addgroup setaddgroup={setaddgroup} />}
            </MyChatsContainer>
            {chatnotfound ? (
              <button>
                {chats
                  ? "No chat history. Search for users to Add"
                  : "Guest User"}{" "}
              </button>
            ) : (
              //  Each Chat
              <>
                <section>
                  {chats?.map((chat: Chats) => {
                    return (
                      <EachChat
                        key={chat._id}
                        {...chat}
                        setselectedChatId={setselectedChatId}
                      />
                    );
                  })}
                </section>
                <button onClick={() => setchatsModal(false)}>close</button>
              </>
            )}
          </ResponsiveChatContainer>
        )}

        <MessageContainer>
          <MessageHeader>
            <span onClick={() => setchatsModal(true)}>chats</span>{" "}
            <h2>
              {selectedChats
                ? selectedChats.isgroupchat
                  ? selectedChats.chatname
                  : selectedChats.users.map((item) =>
                      user?._id !== item._id ? item.name : ""
                    )
                : "no chats selected"}{" "}
            </h2>
            <button onClick={() => setprofilemodal(true)}>👁️</button>
          </MessageHeader>
          {/* profile Modal component */}
          {profilemodal && <Profile setprofilemodal={setprofilemodal} />}
          {/* chat box */}
          <MessagesChat>
            <MessagesChatsBox selectedChatId={selectedChatId} />
          </MessagesChat>
          {selectedChatId && (
            <Chatform onSubmit={SendMessage}>
              <input
                onChange={(e) => setmessagetosend(e.target.value)}
                type="text"
                placeholder="Send message"
                value={messagetosend}
              />
              <input type="submit" value="Send" />
            </Chatform>
          )}
        </MessageContainer>
      </Container>
    </Maincontainer>
  );
};

export default Chat;

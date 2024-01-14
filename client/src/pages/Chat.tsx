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

const Maincontainer = styled.div`
  background-image: url(${autimage});
  background-position: center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
`;

const ChatContainer = styled.div`
  width: 30%;
  max-width: 500px;
  background-color: #fff;
  min-height: 96vh;
  padding: 5px;
`;

const MyChatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-weight: 400;
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
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-weight: 400;
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
  const { user, setchats, chats, searchmodal, setmessagesent, messagesent } =
    useChatState();
  const [chatnotfound, setchatnotfound] = useState(false);
  const [messagetosend, setmessagetosend] = useState("");
  const [selectedChatId, setselectedChatId] = useState("");
  const navigate = useNavigate();

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
      }
    } catch (error) {
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

        <MessageContainer>
          <MessageHeader>
            <h2> {user ? user.name : "Guest User"} </h2>
            <button onClick={() => setprofilemodal(true)}>👁️</button>
          </MessageHeader>
          {/* profile Modal component */}
          {profilemodal && <Profile setprofilemodal={setprofilemodal} />}
          {/* chat box */}
          <MessagesChat>
            <MessagesChatsBox selectedChatId={selectedChatId} />
          </MessagesChat>
          <Chatform onSubmit={SendMessage}>
            <input
              onChange={(e) => setmessagetosend(e.target.value)}
              type="text"
              placeholder="Send message"
              value={messagetosend}
            />
            <input type="submit" value="Send" />
          </Chatform>
        </MessageContainer>
      </Container>
    </Maincontainer>
  );
};

export default Chat;

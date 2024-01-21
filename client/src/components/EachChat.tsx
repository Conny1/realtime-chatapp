import { styled } from "styled-components";
import { Messages, MyApiError, User } from "../state/types";
import { useChatState } from "../state/state";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* outline: 1px solid red; */
  height: 50px;

  cursor: pointer;

  h3 {
    font-size: 13px;
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 400;
  }

  p {
    font-size: 10px;
    margin-top: 0;
  }
`;
type Props = {
  users: User[];
  isgroupchat: boolean;
  chatname: string;
  latestmessage: Messages;
  setselectedChatId: React.Dispatch<React.SetStateAction<string>>;
  _id: string;
};

const EachChat = ({
  _id,
  users,
  isgroupchat,
  chatname,
  latestmessage,
  setselectedChatId,
}: Props) => {
  const {
    setmessages,
    setopenChatbox,
    setselectedChats,
    user,
    selectedChats,
    socketstate,
    notifications,
    setnotifications,
  } = useChatState();

  const [receivername, setreceivername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const choosechatname = () => {
      const data = users.filter((singuser) => singuser._id !== user?._id);
      // console.log(data);
      setreceivername(data[0]?.name);
    };
    if (!isgroupchat) {
      choosechatname();
    }
  }, [users, user?._id, isgroupchat]);

  const AccesChat = async () => {
    const config = {
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${user?.tokens}`,
      },
    };
    // filter chat from notification if there
    if (notifications) {
      setnotifications(notifications.filter((item) => item.chat._id !== _id));
    }

    const receiverid: User[] = users.filter(
      (singuser) => singuser._id !== user?._id
    );

    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/chats/accesschats/`,
        {
          userid: user?._id,
          receiverid: receiverid[0]?._id,
          isgroupchat,
          groupid: _id,
        },
        config
      );

      setopenChatbox(true);

      if (resp.data) {
        const chatid = resp.data[0]?._id;

        setselectedChatId(chatid);

        setselectedChats(resp.data[0]);

        const respMessage = await axios.get(
          `${import.meta.env.VITE_URL}/messages/getmessages/${chatid}`,

          config
        );
        // console.log(respMessage.data);

        setmessages(respMessage.data);
        if (socketstate) {
          socketstate.emit("joinchat", _id);
        }
      }
    } catch (error) {
      const ApiError = error as MyApiError;
      if (ApiError.response && ApiError.response.status) {
        switch (ApiError.response.status) {
          case 404:
            setopenChatbox(true);
            setmessages([]);
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
    <Container
      style={{
        backgroundColor: _id === selectedChats?._id ? "#24c2ff" : "#f6f6f6",
      }}
      onClick={AccesChat}
    >
      <ToastContainer />
      <h3> {isgroupchat ? chatname : receivername}</h3>
      {latestmessage && <p>{`Last Text :${latestmessage.content}`}</p>}
    </Container>
  );
};

export default EachChat;

import ScrollableFeed from "react-scrollable-feed";
import { styled } from "styled-components";
import { useChatState } from "../state/state";
import { useEffect } from "react";
import axios from "axios";

const Maincontainer = styled.div`
  /* outline: 1px solid red; */
  /* max-height: 80vh; */
  height: 100%;
  h1 {
    font-size: 20px;
  }
`;

const MessageDiv = styled.div`
  /* outline: 1px solid red; */
  min-height: 70px;
  display: flex;
  position: relative;
  padding: 3px;
  span {
    position: absolute;
    font-size: 10px;
    font-weight: 700;
    color: #0c10f3;
    left: 15px;
    background-color: #f6f6f6;
    padding: 3px;
    border-radius: 10px;
  }
  section {
    background-color: #f6f6f6;
    width: fit-content;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    border-radius: 10px;
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 10px;
  }

  img {
    height: 30px;
    width: 30px;
    border-radius: 30px;
    object-fit: contain;
  }
`;

type Props = {
  selectedChatId: string;
};
const MessagesChatsBox = ({ selectedChatId }: Props) => {
  const {
    messages,
    user,
    messagesent,
    setmessages,
    socketstate,
    setnotifications,
    notifications,
  } = useChatState();

  useEffect(() => {
    // receive messages
    if (socketstate) {
      socketstate.on("messagereceived", (newmessage) => {
        if (newmessage.chat._id !== selectedChatId) {
          // notification
          if (notifications) {
            setnotifications([
              ...notifications.filter(
                (item) => item.chat._id !== newmessage.chat._id
              ),
              newmessage,
            ]);
            console.log(notifications);
          } else {
            setnotifications([newmessage]);
          }

          console.log(notifications);
        } else {
          if (messages) {
            setmessages([...messages, newmessage]);
          }
        }
      });
    }
  });

  useEffect(() => {
    const getMessages = async () => {
      const config = {
        headers: {
          "content-Type": "application/json",
          authorization: `Bearer ${user?.tokens}`,
        },
      };

      const respMessage = await axios.get(
        `${import.meta.env.VITE_URL}/messages/getmessages/${selectedChatId}`,

        config
      );
      setmessages(respMessage.data);
      console.log(respMessage.data);
    };

    getMessages();
  }, [messagesent, selectedChatId, setmessages, user?.tokens]);

  return (
    <Maincontainer>
      {messages ? (
        messages.length === 0 ? (
          "Start conversation"
        ) : (
          <ScrollableFeed forceScroll={true}>
            {messages?.map((item) => (
              <MessageDiv
                style={{
                  justifyContent:
                    user?._id === item.sender._id ? "flex-end" : "flex-start",
                }}
                key={item._id}
              >
                {user?._id !== item.sender._id && (
                  <span>{item.sender.name}</span>
                )}

                <section>
                  {user?._id !== item.sender._id && (
                    <img src={item.sender.pic} alt="" />
                  )}
                  <p>{item.content}</p>
                </section>
              </MessageDiv>
            ))}
          </ScrollableFeed>
        )
      ) : (
        <h1>Select chat or Search users</h1>
      )}
    </Maincontainer>
  );
};

export default MessagesChatsBox;

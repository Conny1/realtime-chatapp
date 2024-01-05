import React, { useState } from "react";
import { styled } from "styled-components";
import Navbar from "../components/Navbar";
import autimage from "../images/auth.jpg";
import Profile from "../components/Profile";
import Addgroup from "../components/AddGroupModal";

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
  button {
    width: 100%;
    height: 35px;
    background-color: #65cfcf;
    border: none;
  }
`;
const MessageContainer = styled.div`
  flex: 1;
  background-color: #fff;
  min-height: 98vh;
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
  overflow-y: scroll;
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
  return (
    <Maincontainer>
      <NavContainer>
        <Navbar />
      </NavContainer>
      <Container>
        <ChatContainer>
          <MyChatsContainer>
            <h2>My Chats</h2>

            <button onClick={() => setaddgroup(true)}>New Group Chat +</button>
            {/* AddGroup modal component */}
            {addgroup && <Addgroup setaddgroup={setaddgroup} />}
          </MyChatsContainer>
          <ContactsContainer>
            <button>Guest Users</button>
          </ContactsContainer>
        </ChatContainer>

        <MessageContainer>
          <MessageHeader>
            <h2>Guest User</h2>
            <button onClick={() => setprofilemodal(true)}>👁️</button>
          </MessageHeader>
          {/* profile Modal component */}
          {profilemodal && <Profile setprofilemodal={setprofilemodal} />}

          <MessagesChat>hello</MessagesChat>
          <Chatform>
            <input type="text" placeholder="Send mesage" />
            <input type="submit" value="Send" />
          </Chatform>
        </MessageContainer>
      </Container>
    </Maincontainer>
  );
};

export default Chat;

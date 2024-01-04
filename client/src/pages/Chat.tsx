import React from "react";
import { styled } from "styled-components";
import Navbar from "../components/Navbar";
import autimage from "../images/auth.jpg";

const Maincontainer = styled.div`
  background-image: url(${autimage});
  background-position: center;
  background-size: cover;
  min-height: 100vh;
`;

const Container = styled.div`
  background-image: url(${autimage});
  background-position: center;
  background-size: cover;
  min-height: 100vh;
`;
const NavContainer = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Chat = () => {
  return (
    <Maincontainer>
      <NavContainer>
        <Navbar />
      </NavContainer>
      <Container></Container>
    </Maincontainer>
  );
};

export default Chat;

import { useState } from "react";
import styled from "styled-components";
import Login from "../components//Login";
import Signup from "../components//Signup";
import autimage from "../images/auth.jpg";

const MainContainer = styled.div`
  background-image: url(${autimage});
  background-position: center;
  background-size: cover;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin: 40px 0 15px 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-family: "Work Sans", sans-serif;
`;

const Content = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`;

const TabButton = styled.button`
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 30px;
  margin-bottom: 10px;
`;

const AuthPage = () => {
  const [login, setlogin] = useState(true);
  return (
    <MainContainer>
      <Container>
        <Header>
          <Title>Talk-A-Tive</Title>
        </Header>
        <Content>
          <Tabs>
            <TabButton onClick={() => setlogin(true)}>Login</TabButton>
            <TabButton onClick={() => setlogin(false)}>Sign Up</TabButton>
          </Tabs>
          {login ? <Login /> : <Signup />}
        </Content>
      </Container>
    </MainContainer>
  );
};

export default AuthPage;

import { useState } from "react";
import styled from "styled-components";

type ButtonProps = {
  colorScheme: "blue" | "red";
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  flex: 1;
`;

const StyledButton = styled.button<ButtonProps>`
  padding: 10px;
  background-color: ${(props) =>
    props.colorScheme === "blue" ? "#3182ce" : "#e53e3e"};
  color: white;
  width: 100%;
  margin-top: 15px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
`;

const StyledPasswordInputGroup = styled.div`
  display: flex;
`;

const Login = () => {
  const [show, setShow] = useState(false);

  return (
    <StyledForm>
      <StyledInput type="email" placeholder="Enter Your Email Address" />
      <StyledPasswordInputGroup>
        <StyledInput
          type={show ? "text" : "password"}
          placeholder="Enter password"
        />
        <button onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
      </StyledPasswordInputGroup>
      <StyledButton colorScheme="blue" type="submit">
        Login
      </StyledButton>
      <StyledButton colorScheme="red">Get Guest User Credentials</StyledButton>
    </StyledForm>
  );
};

export default Login;

import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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
interface MyApiError {
  response?: {
    status?: number;
  };
}

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const data = response.data;

      if (data) {
        toast("Log in succesful");
        localStorage.setItem("userinfo", JSON.stringify(data));
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      const myApiError = error as MyApiError;

      if (myApiError.response && myApiError.response.status) {
        switch (myApiError.response.status) {
          case 401:
            toast("Invalid Username or password");
            break;
          case 404:
            toast("User with that account does not exist");
            break;
          // Add more cases for other status codes if needed
          default:
            toast("Server error. Try again");
        }
      } else {
        // Handle other types of errors or rethrow if needed
        throw myApiError;
      }
    }
  };

  return (
    <StyledForm>
      <ToastContainer />
      <StyledInput
        type="email"
        onChange={(e) => setemail(e.target.value)}
        placeholder="Enter Your Email Address"
        required
        name="email"
      />
      <StyledPasswordInputGroup>
        <StyledInput
          type={show ? "text" : "password"}
          placeholder="Enter password"
          onChange={(e) => setpassword(e.target.value)}
          required
          name="password"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          {show ? "Hide" : "Show"}
        </button>
      </StyledPasswordInputGroup>
      <StyledButton onClick={loginHandler} colorScheme="blue" type="submit">
        Login
      </StyledButton>
      <StyledButton colorScheme="red">Get Guest User Credentials</StyledButton>
    </StyledForm>
  );
};

export default Login;

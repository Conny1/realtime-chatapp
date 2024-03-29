import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Signup = () => {
  const [show, setShow] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [confirm, setconfirm] = useState("");
  const [loading, setloading] = useState(false);

  const registerHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setloading(true);
    if (!name || !password || !email) {
      setloading(false);
      return toast("Proveide all details");
    }
    if (confirm !== password) {
      setloading(false);
      return toast("Passwords do not match");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      const data = response.data;
      if (data) {
        setloading(false);
        toast("Account created Sucessfully.Now LogIn");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledForm>
      <ToastContainer />
      <StyledInput
        type="name"
        required
        onChange={(e) => setname(e.target.value)}
        placeholder="Enter Your Name"
        name="name"
      />
      <StyledInput
        type="email"
        required
        onChange={(e) => setemail(e.target.value)}
        placeholder="Enter Your Email Address"
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
      {/* confirm password */}
      <StyledPasswordInputGroup>
        <StyledInput
          onChange={(e) => setconfirm(e.target.value)}
          type={show ? "text" : "password"}
          placeholder="Confirm password"
        />
      </StyledPasswordInputGroup>
      <label htmlFor="upload">Upload picture</label>
      <StyledInput type="file" id="upload" placeholder="Upload picture" />

      {loading ? (
        <StyledButton colorScheme="red">Loading...</StyledButton>
      ) : (
        <StyledButton
          onClick={registerHandler}
          colorScheme="blue"
          type="submit"
        >
          Signup
        </StyledButton>
      )}
    </StyledForm>
  );
};

export default Signup;

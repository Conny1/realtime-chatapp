import { styled } from "styled-components";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyApiError, User } from "../state/types";
import axios from "axios";
import EachUser from "./EachUser";
import { useChatState } from "../state/state";
import { useNavigate } from "react-router-dom";
import { mobileResopnsive } from "../utils/responsive";
const MainContainer = styled.div`
  position: absolute;
  background-color: #0000007f;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 62%;
  transform: translate(-50%, -50%);
  /* opacity: 0.5; */
  display: flex;
  justify-content: flex-start;
`;
const ModalContainer = styled.div`
  background-color: #fff;
  width: 40%;
  height: 100%;
  max-width: 300px;
  z-index: 9999;
  display: flex;
  padding: 10px;
  overflow-y: scroll;
  flex-direction: column;
  ${mobileResopnsive({
    width: "80%",
  })}
  section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
const SearchContainer = styled.form`
  :nth-child(n + 2) {
    border: 1px solid gainsboro;
    outline: none;
    font-size: 15px;
    height: 30px;
    &:hover {
      outline: 1px solid black;
    }
  }
  :nth-child(1) {
    border: 1px solid gainsboro;
    background-color: transparent;
    font-size: 22px;
    height: 33px;
    cursor: pointer;
    &:hover {
      outline: 1px solid green;
    }
  }
`;
type Props = {
  setsearchmodal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Search = ({ setsearchmodal }: Props) => {
  const [users, setusers] = useState([]);
  const [usernotfound, setusernotfound] = useState(false);
  const [term, setterm] = useState("");
  const { user } = useChatState();

  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${user?.tokens}`,
      },
    };
    const getallusers = async (val: string) => {
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_URL}/chats/getallusers?term=${val}`,
          config
        );

        setusernotfound(false);
        setusers(resp.data);
      } catch (error) {
        const ApiError = error as MyApiError;
        if (ApiError.response && ApiError.response.status) {
          switch (ApiError.response.status) {
            case 404:
              setusernotfound(true);
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
    getallusers(term);
  }, [term, user?.tokens, navigate]);

  return (
    <MainContainer>
      <ToastContainer />
      <ModalContainer>
        <button onClick={() => setsearchmodal(false)}>close</button>
        <br />
        <SearchContainer>
          <input
            type="text"
            placeholder="Search User"
            onChange={(e) => {
              setterm(e.target.value);
            }}
          />
        </SearchContainer>
        <section>
          {usernotfound ? (
            <p>No user Found</p>
          ) : (
            users?.map((user: User) => (
              <EachUser
                pic={user.pic}
                email={user.email}
                name={user.name}
                id={user._id}
                key={user._id}
              />
            ))
          )}
        </section>
      </ModalContainer>
    </MainContainer>
  );
};

export default Search;

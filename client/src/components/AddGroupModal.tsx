import { styled } from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { MyApiError, User } from "../state/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddtogroupUsers from "./AddtogroupUsers";
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
  justify-content: center;
  align-items: center;
  ${mobileResopnsive({
    top: "50%",
  })}
`;
const ModalContainer = styled.div`
  background-color: #fff;
  width: 40%;
  max-width: 500px;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 500px;
  padding: 5px;
  overflow-y: scroll;
  ${mobileResopnsive({
    maxWidth: "500px",
    width: "90%",
  })}

  input {
    border: 1px solid gainsboro;
    outline: none;
    font-size: 15px;
    height: 30px;
    margin-bottom: 10px;
    &:hover {
      outline: 1px solid black;
    }
  }
  section {
    display: flex;
    flex-direction: column;
    /* outline: 5px solid red; */
    gap: 5px;
    width: 100%;
    min-height: 200px;
    margin-bottom: 10px;

    ${mobileResopnsive({
      flexDirection: "row",
      flexWrap: "wrap",
      overflowY: "scroll",
    })}
  }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 3px;
  button {
    cursor: pointer;
  }
`;

const AddtogruopUsers = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  p {
    background-color: #f6f6f6;
    /* color: white; */
    outline: 1px solid gainsboro;
    font-size: 10px;
    border-radius: 10px;
    padding: 3px;
    font-weight: 900;
    margin-top: 0;
  }

  span {
    color: red;
    font-size: 8px;
    cursor: pointer;
  }
`;
type Props = {
  setaddgroup: React.Dispatch<React.SetStateAction<boolean>>;
};
type UserGrup = {
  name: string;
  id: string;
};

const Addgroup = ({ setaddgroup }: Props) => {
  const { user } = useChatState();
  const [users, setusers] = useState([]);
  const [usernotfound, setusernotfound] = useState(false);
  const [term, setterm] = useState("");
  const [chatname, setchatname] = useState("");
  const [userstogroup, setuserstogroup] = useState<UserGrup[]>([
    { name: "", id: "" },
  ]);
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
  }, [term, navigate, user?.tokens]);

  const removeUserfromCreateGroup = async (userid: string) => {
    const Users = userstogroup.filter((item) => item.id !== userid);
    setuserstogroup(Users);
  };

  const createChat = async () => {
    const config = {
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${user?.tokens}`,
      },
    };

    if (!chatname) return toast("Propvide chat name");
    const data = {
      chatname,
      users: [...userstogroup.map((user) => user.id), user?._id],
      groupadmin: user?._id,
    };

    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/chats/creategroup`,
        data,
        config
      );
      if (resp.data) {
        toast("New Group created");
        setTimeout(() => {
          setaddgroup(false);
        }, 4000);
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
    <MainContainer>
      <ToastContainer />
      <ModalContainer>
        <h1>Create Group Chat</h1>
        {userstogroup.length > 0 && (
          <AddtogruopUsers>
            {userstogroup.map((user, i) => {
              return (
                <p key={i}>
                  {user.name}{" "}
                  <span onClick={() => removeUserfromCreateGroup(user.id)}>
                    {" "}
                    X
                  </span>{" "}
                </p>
              );
            })}
          </AddtogruopUsers>
        )}
        <input
          type="text"
          onChange={(e) => setchatname(e.target.value)}
          placeholder="Chat Name"
        />

        <input
          onChange={(e) => setterm(e.target.value)}
          type="search"
          placeholder="Search Users to add to group"
        />

        {usernotfound ? (
          <p>No users found</p>
        ) : (
          <section>
            {users.map((user: User) => {
              return (
                <AddtogroupUsers
                  pic={user.pic}
                  email={user.email}
                  name={user.name}
                  id={user._id}
                  key={user._id}
                  setuserstogroup={setuserstogroup}
                />
              );
            })}
          </section>
        )}

        <BtnGroup>
          <button onClick={() => setaddgroup(false)}>close</button>
          <button onClick={createChat}>Create Chat</button>
        </BtnGroup>
      </ModalContainer>
    </MainContainer>
  );
};

export default Addgroup;

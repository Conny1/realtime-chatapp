import { styled } from "styled-components";
import { useChatState } from "../state/state";
import { MyApiError } from "../state/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  display: flex;
  align-items: center;
  /* outline: 1px solid red; */
  height: 50px;
  background-color: #f6f6f6;
  gap: 10px;

  h3 {
    font-size: 13px;
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 400;
  }

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    border-radius: 30px;
  }
`;
type Props = {
  name: string;
  pic: string;
  email: string;
  id: string;
};

const EachUser = ({ name, pic, email, id }: Props) => {
  const { user, setsearchmodal } = useChatState();
  const navigate = useNavigate();
  const accesChat = async (userid: string | undefined, receiverid: string) => {
    const config = {
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${user?.tokens}`,
      },
    };
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_URL}/chats/accesschats`,
        { userid, receiverid, isgroupchat: false },
        config
      );

      if (resp.data) {
        setsearchmodal(false);
      }
    } catch (error) {
      const ApiError = error as MyApiError;
      if (ApiError.response && ApiError.response.status) {
        switch (ApiError.response.status) {
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
      onClick={() => {
        accesChat(user?._id, id);
      }}
    >
      <ToastContainer />
      <img src={pic} alt="" />
      <h3>
        {name} <br /> <b>Email:</b> {email}
      </h3>
    </Container>
  );
};

export default EachUser;

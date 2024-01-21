import { styled } from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { mobileResopnsive } from "../utils/responsive";

const Container = styled.div`
  display: flex;
  align-items: center;
  /* outline: 1px solid red; */
  height: 50px;
  background-color: #f6f6f6;
  /* gap: 10px; */
  justify-content: space-between;
  ${mobileResopnsive({
    width: "130px",
    flexDirection: "column",
    alignItems: "center",
    height: "auto",
    maxHeight: "150px",
  })}

  h3 {
    font-size: 13px;
    margin-bottom: 0;
    margin-top: 0;
    font-weight: 400;
    text-align: start;
    ${mobileResopnsive({
      fontSize: "10px",
    })}
  }

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
    border-radius: 30px;
  }
  button {
    max-width: 50px;
  }
`;
type Props = {
  name: string;
  pic: string;
  email: string;
  id: string;
  setuserstogroup: React.Dispatch<React.SetStateAction<UserGrup[]>>;
};

type UserGrup = {
  name: string;
  id: string;
};

const AddtogroupUsers = ({ name, pic, email, id, setuserstogroup }: Props) => {
  const AdduserTogroup = async (userid: string, name: string) => {
    const user = new Set();
    user.add({ id: userid, name });
    setuserstogroup((prev: UserGrup[]) => [
      ...prev.filter((p) => p.id !== userid),
      { id: userid, name },
    ]);
  };

  return (
    <Container>
      <img src={pic} alt="" />
      <h3>
        {name} <br /> <b>Email:</b> {email}
      </h3>
      <button
        onClick={() => {
          AdduserTogroup(id, name);
        }}
      >
        Add
      </button>
    </Container>
  );
};

export default AddtogroupUsers;

import { styled } from "styled-components";
import { useChatState } from "../state/state";
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
`;
const ModalContainer = styled.div`
  background-color: #fff;
  width: 40%;
  max-width: 300px;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  ${mobileResopnsive({
    width: "90%",
    maxWidth: "500px",
  })}

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 50px;
  }
  button {
    cursor: pointer;
  }
`;
type Props = {
  setprofilemodal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Profile = ({ setprofilemodal }: Props) => {
  const { user } = useChatState();
  // console.log(user);
  if (!user)
    return (
      <>
        <h1>You seem to be logged out</h1>
      </>
    );
  return (
    <MainContainer>
      <ModalContainer>
        <h1>{user.name}</h1>

        <img src={user.pic} alt="profile pic" />

        <p>Email: {user.email}</p>

        <button onClick={() => setprofilemodal(false)}>close</button>
      </ModalContainer>
    </MainContainer>
  );
};

export default Profile;

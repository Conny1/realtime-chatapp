import { styled } from "styled-components";
import { useState, useEffect } from "react";
import Profile from "./Profile";
import Search from "./SearchModal";
import { useChatState } from "../state/state";
import { useNavigate } from "react-router-dom";
import { mobileResopnsive } from "../utils/responsive";

const Navcontainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  max-width: 1280px;
`;
const SearchContainer = styled.div`
  display: flex;
  :nth-child(n + 2) {
    border: none;
    outline: none;
    font-size: 15px;
    &:hover {
      outline: 1px solid gainsboro;
    }
    ${mobileResopnsive({
      display: "none",
    })}
  }
  :nth-child(1) {
    border: none;
    background-color: transparent;
    font-size: 22px;
    cursor: pointer;
    &:hover {
      outline: 1px solid gainsboro;
    }
    ${mobileResopnsive({
      fontSize: "20px",
    })}
  }
`;
const Logo = styled.h1`
  ${mobileResopnsive({
    fontSize: "19px",
  })}
`;
const Notificationcontainer = styled.div`
  min-width: 150px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* position: relative; */
  ${mobileResopnsive({
    minWidth: "100px",
  })}
  button {
    height: fit-content;
    width: fit-content;
    background-color: transparent;
    border: none;
    outline: none;
    font-weight: bold;
    cursor: pointer;
  }

  img {
    width: 30px;
    height: 30px;
    object-fit: fill;
    border-radius: 30px;
  }
  p {
    color: red;
    font-weight: 800;
  }
`;

const ProfileContainer = styled.div`
  position: absolute;
  /* outline: 1px solid red; */
  display: flex;
  flex-direction: column;
  background-color: #fff;
  width: 150px;
  right: 4%;
  top: 12%;
  gap: 10px;

  button {
    height: 30px;
    width: 100%;
    &:hover {
      background-color: gainsboro;
    }
  }
`;

const Navbar = () => {
  const [extMenu, setExtMenu] = useState(false);
  const [profilemodal, setprofilemodal] = useState(false);
  const { searchmodal, setsearchmodal, notifications } = useChatState();

  const navigate = useNavigate();
  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <Navcontainer>
      <SearchContainer onClick={() => setsearchmodal(true)}>
        <input type="submit" value="🔍" />
        <p>Search User</p>
      </SearchContainer>
      <Logo>Talk-A-Tive</Logo>

      <Notificationcontainer>
        {notifications && notifications.length > 0 ? (
          <p>{notifications.length}</p>
        ) : null}
        <button>🔔</button>
        <img
          onClick={() => setExtMenu((prev) => !prev)}
          src="https://media.istockphoto.com/id/1299026534/photo/nairobi-kenya.jpg?s=1024x1024&w=is&k=20&c=LeOxyYOOTjEZ7CxOckrR_Y9_XKRG-ldEsQi4dA_yR2M="
          alt="profile pic"
        />
        <button onClick={() => setExtMenu((prev) => !prev)}>V</button>

        {/* profile modal */}
        {extMenu && (
          <ProfileContainer>
            <button onClick={() => setprofilemodal(true)}>Profile</button>
            <button
              onClick={() => {
                localStorage.removeItem("userinfo");
                navigate("/auth");
              }}
            >
              Logout
            </button>
          </ProfileContainer>
        )}
      </Notificationcontainer>
      {profilemodal && <Profile setprofilemodal={setprofilemodal} />}

      {/* search modal */}

      {searchmodal && <Search setsearchmodal={setsearchmodal} />}
    </Navcontainer>
  );
};

export default Navbar;

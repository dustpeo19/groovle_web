import React, { useEffect, useState } from "react";
import { dbService } from "fb_info";
import { Link } from "react-router-dom";
import HomeForm from "components/HomeForm";

const Home = ({ userObj }) => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    // snapshot으로 room 정보 가져와서 useState에 저장
    dbService.collection("rooms").onSnapshot((snapshot) => {
      const roomArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setRooms(roomArray);
    });
  }, []);
  return (
    <div>
      <HomeForm userObj={userObj} />
      <div>
        {rooms.map((room) => (
          <Link to={"/room/" + room.roomId} key={room.roomCreateDate}>
            <div>
              <h3>{room.songName}</h3>
              <p>{room.artistName}</p>
              <p>방 주인: {room.roomCreatorDisplayName}</p>
              <hr />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

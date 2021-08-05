import React, { useEffect, useState } from "react";
import { dbService } from "fb_info";
import { Link, useHistory } from "react-router-dom";

const Home = ({ userObj }) => {
  const history = useHistory();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  // const [roomId, setRoomId] = useState("");
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
  const makeId = () => {
    // TODO: 같은 아이디 가진 방 있을때 어떻게 할지 결정
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var id = "";
    for (var i = 0; i < 4; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    return id;
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const roomIdCreated = makeId();
    await dbService.collection("rooms").add({
      roomId: roomIdCreated,
      roomCreatorId: userObj.uid,
      roomCreatorDisplayName: userObj.displayName,
      roomCreateDate: Date.now(),
      songName,
      artistName,
      audioSourceIds: [],
    });
    setSongName("");
    setArtistName("");
    // setRoomId(roomIdCreated);
    history.push("/room/" + roomIdCreated);
  };
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "songName") {
      setSongName(value);
    } else if (name === "artistName") {
      setArtistName(value);
    }
  };
  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              name="songName"
              onChange={onChange}
              placeholder="곡 제목"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="artistName"
              onChange={onChange}
              placeholder="아티스트명"
              required
            />
          </div>
          <div>
            <input type="submit" value="방 만들기" />
          </div>
        </form>
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
    </>
  );
};

export default Home;

import React, { useState } from "react";
import { dbService } from "fb_info";
import { Redirect } from "react-router-dom";

const Home = ({ userObj }) => {
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [roomId, setRoomId] = useState("");
  // TODO: 존재하는 방 리스트 쭉 보여주기
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
      roomCreator: userObj.uid,
      roomCreateDate: Date.now(),
      songName,
      artistName,
      audioSourceIds: [],
    });
    setSongName("");
    setArtistName("");
    setRoomId(roomIdCreated);
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
      </div>
      {roomId ? <Redirect push to={"/room/" + roomId} /> : null}
    </>
  );
};

export default Home;

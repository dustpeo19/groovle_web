import React, { useState } from "react";
import { dbService } from "fb_info";

const Home = ({ userObj }) => {
  const [songName, setSongName] = useState();
  const [artistName, setArtistName] = useState();
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("rooms").add({
      roomId: "ABCD",
      creator: userObj.uid,
      songName,
      artistName,
      audioSourceUrls: [],
      // TODO: 랜덤 roomId 만들어서 넣기, 방 만들고 submit 해도 입력한거 안없어짐, 리디렉션
      // history.push("/");
    });
  };
  const onSongNameChange = (event) => {
    const {
      target: { value },
    } = event;
    setSongName(value);
  };
  const onArtistNameChange = (event) => {
    const {
      target: { value },
    } = event;
    setArtistName(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            onChange={onSongNameChange}
            placeholder="곡 제목"
            required
          />
        </div>
        <div>
          <input
            type="text"
            onChange={onArtistNameChange}
            placeholder="아티스트명"
            required
          />
        </div>
        <div>
          <input type="submit" value="방 만들기" />
        </div>
      </form>
    </div>
  );
};

export default Home;

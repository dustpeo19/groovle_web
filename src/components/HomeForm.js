import React, { useState } from "react";
import { dbService } from "fb_info";
import { useHistory } from "react-router-dom";

const HomeForm = ({ userObj }) => {
  const history = useHistory();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [bpm, setBpm] = useState();
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
      bpm,
      audioSourceIds: [],
    });
    setSongName("");
    setArtistName("");
    setBpm(null);
    history.push("/room/" + roomIdCreated);
  };
  const onChange = (event) => {
    const {
      target: { name, value, bpm },
    } = event;
    if (name === "songName") {
      setSongName(value);
    } else if (name === "artistName") {
      setArtistName(value);
    } else if (name === "bpm") {
      setBpm(value);
    }
  };
  return (
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
        <input
          type="number"
          name="bpm"
          onChange={onChange}
          placeholder="BPM"
          required
        />
      </div>
      <div>
        <input type="submit" value="방 만들기" />
      </div>
    </form>
  );
};

export default HomeForm;

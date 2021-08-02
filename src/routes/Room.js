import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fb_info";

const Room = ({ userObj }) => {
  const [audioSource, setAudioSource] = useState();
  const [songName, setSongName] = useState();
  const [artistName, setArtistName] = useState();
  const [sessionName, setSessionName] = useState();
  const onSubmit = async (event) => {
    event.preventDefault();
    const audioSourceRef = storageService
      .ref()
      .child(`${userObj.uid}/${uuidv4()}`);
    const response = await audioSourceRef.putString(audioSource, "data_url");
    const audioSourceUrl = await response.ref.getDownloadURL();
    console.log(audioSourceUrl);
    await dbService.collection("audioSource").add({
      creator: userObj.uid,
      songName,
      artistName,
      sessionName,
      createDate: Date.now(),
      audioSourceUrl,
    });
    setAudioSource(""); // 업로드 후 Home에서 지워지게 함
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
  const onSessionNameChange = (event) => {
    const {
      target: { value },
    } = event;
    setSessionName(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        target: { result },
      } = finishedEvent;
      setAudioSource(result);
    };
    reader.readAsDataURL(file);
  };
  const onClearAudioSource = () => {
    setAudioSource(null);
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
          <input
            type="text"
            onChange={onSessionNameChange}
            placeholder="세션명"
            required
          />
        </div>
        <div>
          <input
            type="file"
            accept="audio/*"
            onChange={onFileChange}
            required
          />
        </div>
        <div>
          <input type="submit" value="Upload" />
        </div>
        {audioSource && (
          <div>
            <audio controls src={audioSource} />
            <button onClick={onClearAudioSource}>Cancel Upload</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Home;

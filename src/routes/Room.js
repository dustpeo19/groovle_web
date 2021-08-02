import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fb_info";
import { useParams } from "react-router-dom";

const Room = ({ userObj }) => {
  // TODO: 방 아이디 생성 코드
  const { roomId } = useParams();
  const [documentId, setDocumentId] = useState();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [roomCreator, setRoomCreator] = useState("");
  const [audioSource, setAudioSource] = useState("");
  const [audioSources, setAudioSources] = useState([]);
  const [audioSourceUrls, setAudioSourceUrls] = useState([]);
  const [sessionName, setSessionName] = useState();
  const getRoomInfo = async () => {
    // firebase에서 roomId를 통해 곡 제목, 아티스트명, 오디오파일 URL 리스트 받아옴
    const roomInfo = await dbService
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();
    roomInfo.forEach((document) => {
      setSongName(document.data().songName);
      setArtistName(document.data().artistName);
      setRoomCreator(document.data().creator);
      setDocumentId(document.id);
    });
  };
  useEffect(() => {
    getRoomInfo();
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    const audioSourceRef = storageService
      .ref()
      .child(`${userObj.uid}/${uuidv4()}`);
    const response = await audioSourceRef.putString(audioSource, "data_url");
    const audioSourceUrl = await response.ref.getDownloadURL();
    // const audioSourceObj = {}; 오디오 url이 누가 만들었고 세션이 누군가를 그냥 배열로 저장하면 모르기 때문에 객체?
    setAudioSourceUrls(audioSourceUrls.push(audioSourceUrl)); // TODO: prev 쓰는 코드 알아보기
    await dbService.doc(`rooms/${documentId}`).update({
      audioSourceUrls: audioSourceUrls,
    });
    setAudioSource(""); // 업로드 후 Home에서 지워지게 함
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
  //TODO: 업로드폼 내가 업로드 안했을때만 뜨도록 하기(?: 사용)
  return (
    <div>
      <div>
        <h3>{songName}</h3>
        <p>- {artistName}</p>
      </div>
      <form onSubmit={onSubmit}>
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

export default Room;

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fb_info";
import { useParams } from "react-router-dom";
import AudioSource from "components/AudioSource";

const Room = ({ userObj }) => {
  // TODO: 방 아이디 생성 코드
  const { roomId } = useParams();
  const [roomDocumentId, setRoomDocumentId] = useState("");
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [roomCreator, setRoomCreator] = useState("");
  const [audioSource, setAudioSource] = useState("");
  const [audioSourceIds, setAudioSourceIds] = useState([]);
  // const [audioSourceStorageName, setAudioSourceStorageName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const getRoomInfo = async () => {
    // firebase에서 roomId를 통해 곡 제목, 아티스트명, 오디오파일 도큐먼트 아이디 받아옴
    // TODO: roomId = ""이면 누가 임의로 url 지운것이니 home으로 리디렉션 => 찾는 방이 없을 시 리디렉션하면 url 없는것과 틀린것 모두 포함 가능
    const roomInfo = await dbService
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();
    roomInfo.forEach((document) => {
      setSongName(document.data().songName);
      setArtistName(document.data().artistName);
      setRoomCreator(document.data().roomCreator);
      setAudioSourceIds(document.data().audioSourceIds);
      setRoomDocumentId(document.id);
    });
  };
  useEffect(() => {
    getRoomInfo();
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    // TODO: storage의 파일 이름을 알아야 삭제를 하는데 알아올 방법이 없음
    const storageName = uuidv4();
    const audioSourceRef = storageService
      .ref()
      .child(`${userObj.uid}/${storageName}`);
    // setAudioSourceStorageName(storageName);
    const response = await audioSourceRef.putString(audioSource, "data_url");
    const audioSourceUrl = await response.ref.getDownloadURL();
    const audioSourceDocId = await dbService.collection("audioSources").add({
      creator: userObj.uid,
      createDate: Date.now(),
      sessionName,
      audioSourceUrl,
      audioSourceStorageName: storageName,
      belongingRoomDocumentId: roomDocumentId,
      belongingRoomSongName: songName,
      belongingRoomArtistName: artistName,
    });
    audioSourceIds.push(audioSourceDocId.id);
    setAudioSourceIds(audioSourceIds); // TODO: prev 쓰는 코드 알아보기
    await dbService.doc(`rooms/${roomDocumentId}`).update({
      audioSourceIds,
    });
    setAudioSource(""); // 업로드 후 room에서 지워지게 함
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
      <div>
        <h3>{songName}</h3>
        <p>{artistName}</p>
        <p>방 주인: {roomCreator}</p>
      </div>
      <form onSubmit={onSubmit}>
        {!audioSource && (
          <>
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
          </>
        )}
        {audioSource && (
          <div>
            <p>{sessionName}</p>
            <audio controls src={audioSource} />
            <br />
            <input type="submit" value="Upload" />
            <button onClick={onClearAudioSource}>Cancel Upload</button>
          </div>
        )}
      </form>
      <div>
        {audioSourceIds
          ? audioSourceIds.map((audioSourceId) => (
              <AudioSource
                key={audioSourceId}
                audioSourceId={audioSourceId}
                userObj={userObj}
                callingPage="Room"
              />
            ))
          : "업로드된 파일이 없습니다."}
      </div>
      <div>
        <button>합성</button>
      </div>
    </div>
  );
};

export default Room;

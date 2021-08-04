import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fb_info";

//creator 닉네임 받기 or userObj 받기
const AudioSource = ({ audioSourceId, userObj, callingPage }) => {
  const [mounted, setMounted] = useState(false); // 새 파일 submit 하면 unmount 오류 발생. 이를 해결 위한 state임. 실제 이게 해결방법인지는 찾아봐야함.
  const [audioSourceDocumentId, setAudioSourceDocumentId] = useState("");
  const [creator, setCreator] = useState("");
  const [createDate, setCreateDate] = useState();
  const [sessionName, setSessionName] = useState("");
  const [audioSourceUrl, setAudioSourceUrl] = useState("");
  const [audioSourceStorageName, setAudioSourceStorageName] = useState("");
  const [belongingRoomDocumentId, setBelongingRoomDocumentId] = useState("");
  const [belongingRoomSongName, setBelongingRoomSongName] = useState("");
  const [belongingRoomArtistName, setBelongingRoomArtistName] = useState("");
  const getAudioSourceInfo = async () => {
    // firebase에서 roomInfo로 받은 audioSource document id를 통해 세션, 만든 사람, 오디오파일 URL 리스트 받아옴
    await dbService
      .collection("audioSources")
      .doc(audioSourceId)
      .get()
      .then((document) => {
        setAudioSourceDocumentId(document.id);
        setCreator(document.data().creator);
        setCreateDate(document.data().createDate);
        setSessionName(document.data().sessionName);
        setAudioSourceUrl(document.data().audioSourceUrl);
        setBelongingRoomDocumentId(document.data().belongingRoomDocumentId);
        setBelongingRoomSongName(document.data().belongingRoomSongName);
        setBelongingRoomArtistName(document.data().belongingRoomArtistName);
        setAudioSourceStorageName(document.data().audioSourceStorageName);
      });
  };
  useEffect(() => {
    setMounted(true);
    if (mounted) {
      getAudioSourceInfo();
    }
    return () => {
      setMounted(false);
    };
  });
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      // TODO: room의 audioSourceIds 배열에서도 삭제해야 함
      await dbService.doc(`audioSources/${audioSourceDocumentId}`).delete();
      // TODO: storage에서도 삭제하는 코드 제대로 안됨. 지금 문제는 room에서 audioSourceIds에서 해당 항목을 삭제 안해서 생기는 듯
      const audioSourceRef = storageService
        .ref()
        .child(`${userObj.uid}/${audioSourceStorageName}`);
      await audioSourceRef
        .delete()
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <div>
      {callingPage === "Profile" && (
        <div>
          <p>{"곡명: " + belongingRoomSongName}</p>
          <p>{"아티스트명: " + belongingRoomArtistName}</p>
        </div>
      )}
      <p>{"파일 업로드한 사람: " + creator}</p>
      <p>{"파일 업로드 일시: " + createDate}</p>
      <p>{"세션명 :" + sessionName}</p>
      <audio controls src={audioSourceUrl} />
      {userObj.uid === creator && <button onClick={onDeleteClick}>삭제</button>}
    </div>
  );
};

export default AudioSource;

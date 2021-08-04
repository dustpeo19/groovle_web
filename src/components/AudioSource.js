import React, { useEffect, useState } from "react";
import { dbService } from "fb_info";

//creator 닉네임 받기 or userObj 받기
const AudioSource = ({ audioSourceId, userObj }) => {
  const [mounted, setMounted] = useState(false); // unmount 오류 해결 위한 state, 실제 이게 해결방법인지는 찾아봐야함
  const [creator, setCreator] = useState();
  const [createDate, setCreateDate] = useState();
  const [sessionName, setSessionName] = useState();
  const [audioSourceUrl, setAudioSourceUrl] = useState();
  const [audioSourceDocumentId, setAudioSourceDocumentId] = useState("");
  const getAudioSourceInfo = async () => {
    // firebase에서 roomInfo로 받은 audioSource document id를 통해 세션, 만든 사람, 오디오파일 URL 리스트 받아옴
    await dbService
      .collection("audioSources")
      .doc(audioSourceId)
      .get()
      .then((document) => {
        setCreator(document.data().creator);
        setCreateDate(document.data().createDate);
        setSessionName(document.data().sessionName);
        setAudioSourceUrl(document.data().audioSourceUrl);
        setAudioSourceDocumentId(document.id);
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
  return (
    <div>
      <p>{"파일 업로드한 사람: " + creator}</p>
      <p>{"파일 업로드 일시: " + createDate}</p>
      <p>{"세션명 :" + sessionName}</p>
      <audio controls src={audioSourceUrl} />
      <button>reUpload</button>
    </div>
  );
};

export default AudioSource;

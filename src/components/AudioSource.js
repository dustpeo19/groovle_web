import React from "react";

//creator 닉네임 받기
const AudioSource = ({ audioSourceObj }) => (
  <div>
    <p>{audioSourceObj.sessionName}</p>
    <audio controls src={audioSourceObj.audioSourceUrl} />
    <button>reUpload</button>
  </div>
);

export default AudioSource;

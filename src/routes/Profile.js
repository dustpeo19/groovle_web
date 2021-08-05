import AudioSource from "components/AudioSource";
import { authService, dbService } from "fb_info";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [rooms, setRooms] = useState([]);
  const [files, setFiles] = useState([]);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  const getMyRooms = async () => {
    const rooms = await dbService
      .collection("rooms")
      .where("roomCreatorId", "==", userObj.uid)
      .orderBy("roomCreateDate", "desc")
      .get();
    setRooms(rooms.docs.map((doc) => doc.data()));
  };
  const getMyFiles = async () => {
    const dbfiles = await dbService
      .collection("audioSources")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createDate", "desc")
      .get();
    dbfiles.forEach((document) => {
      const fileObject = {
        ...document.data(),
        id: document.id,
      };
      setFiles((prev) => [fileObject, ...prev]);
    });
  };
  useEffect(() => {
    getMyRooms();
    getMyFiles();
  }, []);
  return (
    <div>
      <div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="닉네임"
            value={newDisplayName}
            onChange={onChange}
          />
          <input type="submit" value="닉네임 업데이트" />
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
      </div>
      <div>
        <h2>My Rooms</h2>
        {rooms.map((room) => (
          <Link to={"/room/" + room.roomId} key={room.roomCreateDate}>
            <div>
              <h3>{room.songName}</h3>
              <p>{room.artistName}</p>
              <hr />
            </div>
          </Link>
        ))}
      </div>
      <div>
        <h2>My Files</h2>
        {/* {files.map((file) => (
          <Link
            to={"/room/" + file.roomId}
            key={file.createDate}
          >
            <div>
              <h3>{file.belongingRoomSongName}</h3>
              <p>{file.belongingRoomArtistName}</p>
              <p>세션: {file.sessionName}</p>
              <hr />
            </div>
          </Link>
        ))} */}
        {files.map((file) => (
          <Link to={"/room/" + file.belongingRoomId} key={file.createDate}>
            <AudioSource
              audioSourceId={file.id}
              userObj={userObj}
              callingPage="Profile"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Profile;

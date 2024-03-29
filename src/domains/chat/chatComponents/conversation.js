import {
  Stack,
  Box,
  Avatar,
  Typography,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import StyledBadge from "../../../components/Commun/StyledBadge";

import Icon from "../../../assets/logo.jpg";
import {
  CaretDown,
  LinkSimple,
  MagnifyingGlass,
  PaperPlaneTilt,
  Phone,
  Smiley,
  VideoCamera,
  Checks,
} from "phosphor-react";
import StyledInput from "../../../components/Commun/inputs/StyledInput";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "../../../assets/styles/conversation.css";

import { fetchMessages } from "../../../store/chatStore";
import Lottie from "lottie-react";
import typing from "../../../components/typing.json";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchUser } from "../../../store/user";

const Conversation = ({ setChatRoomList, room, userr }) => {

  let myId = "2";
  const userStore = useSelector((state) => state.user) || {};
  const { user } = userStore || {};
  console.log("hahaa", myId), "my";
  const dispatch = useDispatch();

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [openPicker, setPicker] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [number, setNumber] = useState(20);
  const [message, setMessage] = useState("");
  const [inbox, setInbox] = useState([
    {
      userId: "1",
      user: {
        avatar:
          "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
      },
      text: "Hey, how are you?",
    },
    {
      userId: "2",
      user: {
        avatar:
          "https://www.melty.fr/wp-content/uploads/meltyfr/2022/12/neytiri.avatar.webp",
      },
      text: "Hi! I'm doing great, thanks. How about you?",
    },
  ]);
  const [isTyping, setIsTyping] = useState([]);
  const [exist, setExist] = useState(null);

  const userName = user ? user.fullNameEn : userr?.user?.fullNameEn;
  const messagesEndRef = useRef(null);
  const { userId } = useParams();
  console.log("uu", userId);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };
  useEffect(() => {
    scrollToBottom();
  }, [inbox]);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId, userr?.userId]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/v1/chatRoom/by-participants/${
          userId ? userId : userr?.userId
        }/${myId}`
      )
      .then((res) => {
        console.log(res.data);
        setExist(res.data.id);
      })
      .catch((err) => console.log(err));
  }, [myId, userId]);

  useEffect(() => {
    if (exist) {
      axios
        .get(`http://localhost:3001/api/v1/messages/${exist}`, {
          params: {
            numberMessages: number,
          },
        })
        .then((response) => {
          let aux = [];
          for (let i = response.data.length - 1; i >= 0; i--) {
            aux.push(response.data[i]);
          }
          console.log(aux[aux.length - 1]);

          setInbox(aux);
        })
        .catch((err) => console.log(err));
    }
  }, [exist]);

  useEffect(() => {
    if (
      inbox[inbox.length - 1]?.chatRoomId === exist &&
      !inbox[inbox.length - 1]?.seen
    ) {
      if (inbox[inbox.length - 1]?.userId !== myId) {
        const payload = {
          chatRoomId: inbox[inbox.length - 1]?.chatRoomId,
          userId: myId,
          num: number,
        };
      }
    }
  }, [exist, inbox]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      if (exist) {
        let payload = {
          chatRoomId: exist,
          userId: myId,
          text: message,
        };
      } else {
        let payload = {
          receiverId:
            //  user.userId
            userId ? userId : userr?.userId,
          senderId: myId,
          text: message,
        };
      }

      setMessage("");
    } else {
      return;
    }
  };


  return (
    <Stack height="100%" maxHeight="100vh" width="100%">
      <Box
        p={2}
        sx={{
          height: "15vh",
          width: "100%",
          backgroundColor: "#F8FAFF",
          boxShadow: "0px 0px 2px",
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%", height: "100%" }}
        >
          <Stack direction="row" spacing={2}>
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar alt="profile picture" src={Icon} />
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {/* RANIA */}
                {userName}
              </Typography>
              <Typography variant="caption">Online</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
 
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          height: "70vh",
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 2px",
          overflowY: "scroll",
          scrollBehavior: "unset",
        }}
        ref={messagesEndRef}
      >
        {inbox.map((e, i) => (
          <div className="containerr" key={i}>
            <div
              className={`d-flex  ${
                e.userId !== myId
                  ? "justify-content-start"
                  : "justify-content-end"
              }`}
            >
              <img
                src={e.user.avatar ? e.user.avatar : Icon}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <div>
                <p
                  key={i}
                  className={
                    e.userId === myId ? "sent-message" : "received-message"
                  }
                >
                  {e.text}
                </p>
                <div>
                  {i === inbox.length - 1 && e.seen && e.userId === myId && (
                    <p>
                      <Checks size={25} weight="thin" color="green" /> at{" "}
                      {e.updatedAt.slice(11, 16)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping.length ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <p style={{ marginLeft: "5px", marginTop: "7px" }}>
              {isTyping.map((elem) => elem.fullNameEn + " ")} is typing
            </p>{" "}
            <Lottie
              animationData={typing}
              loop={true}
              style={{ width: "100px", marginLeft: "-34px" }}
            />
          </div>
        ) : null}
      </Box>
      <Box
        p={4}
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 2px",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack sx={{ width: "100%" }}>
            <StyledInput
              fullWidth
              placeholder="write a message . . ."
              variant="filled"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <LinkSimple />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment>
                    <IconButton
                      onClick={() => {
                        setPickerOpen(!pickerOpen);
                      }}
                    >
                      <Box
                        sx={{
                          display: pickerOpen ? "inline" : "none",
                          zIndex: 10,
                          position: "absolute",
                          bottom: 50,
                          right: 10,
                        }}
                      >
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji) => {
                            setSelectedEmoji(emoji.native);
                            setMessage(`${message}${emoji.native}`);
                            setPickerOpen(false);
                          }}
                        />
                      </Box>
                      <Smiley />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              setPickerOpen={setPickerOpen}
              onChange={(e) => {
                setMessage(`${e.target.value}`);
              }}
              value={message}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              background: "#57385c",
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent="center"
            >
              <IconButton onSubmit={handleSubmit}>
                <PaperPlaneTilt color="#fff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Conversation;

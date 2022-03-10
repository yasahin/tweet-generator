import "./App.css";
import "./style.scss";
import React, { useState, createRef, useEffect } from "react";
import { BsUpload } from "react-icons/bs";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import { FaRetweet, FaRegHeart, FaRegComment } from "react-icons/fa";
import { AvatarLoader } from "./loader";
import { useScreenshot } from "use-react-screenshot";
import { language } from "./languages";

function converImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement("CANVAS");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.crossOrigin = img.height;
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataUrl(outputFormat || "image/png");
    callback.callback(this, dataURL);
    //clean up
    canvas = null;
  };
  img.src = url;
}

const tweetFormat = (tweet) => {
  tweet = tweet
    .replace(/@([\w]+)/, "<span>@$1</span>")
    .replace(/#([\wşçöğüıİ]+)/gi, "<span>#$1</span>")
    .replace(/(https?:\/\/[\w\\.\\/]+)/, "<span>$1</span>");
  return tweet;
};
const formatNumber = (number) => {
  if (!number) {
    number = 0;
  }
  if (number < 1000) {
    return number;
  }
  number /= 1000;
  number = String(number).split(".");
  return (
    number[0] + (number[1] > 100 ? "." + number[1].slice(0, 1) + "B" : "B")
  );
};

function App() {
  const tweetRef = createRef(null);
  const downloadRef = createRef();
  const [name, setName] = useState();
  const [username, setUserName] = useState();
  const [isVerified, setIsVerified] = useState(0);
  const [tweet, setTweet] = useState(
    "It is an example test tweet for programming, please ignore @yasahinn | github: https://github.com/yasahin "
  );

  const [retweets, setRetweets] = useState(0);
  const [quoteTweets, setQuoteTweets] = useState(0);
  const [likes, setLikes] = useState(0);
  const [image, takeScreenshot] = useScreenshot();
  const [avatar, setAvatar] = useState();
  const [lang, setLang] = useState("en");
  const [langText, setLangText] = useState();
  useEffect(() => {
    setLangText(language[lang]);
  }, [lang]);

  const getImage = () => takeScreenshot(tweetRef.current);

  useEffect(() => {
    if (image) {
      downloadRef.current.click();
    }
  }, [image]);

  const avatarHandle = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      setAvatar(this.result);
    });
    reader.readAsDataURL(file);
  };
  const fetchTwitterInfo = () => {
    fetch(
      `https://typeahead-js-twitter-api-proxy.herokuapp.com/demo/search?q=${username}`
    )
      .then((res) => res.json())
      .then((data) => {
        const twitter = data[0];
        console.log(twitter);
        converImgToBase64(
          twitter.profile_image_url_https,
          function (base64Image) {
            setAvatar(base64Image);
          }
        );

        setName(twitter.name);
        setUserName(twitter.screen_name);
        setTweet(twitter.status.text);
        setRetweets(twitter.friends_count);
        setLikes(twitter.statuses_count);
        setQuoteTweets(twitter.listed_count);
      });
  };

  return (
    <>
      <div className="tweet-settings">
        <h3>{langText?.settings}</h3>
        <ul>
          <li>
            <label>{langText?.name}</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.username}</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </li>
          <li>
            <label>Tweet</label>
            <textarea
              className="textarea"
              maxLength="290"
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            />
          </li>
          <li>
            <label>Avatar</label>
            <input type="file" className="input" onChange={avatarHandle} />
          </li>
          <li>
            <label>Retweet</label>
            <input
              type="number"
              className="input"
              value={retweets}
              onChange={(e) => setRetweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.quTweet}</label>
            <input
              type="number"
              className="input"
              value={quoteTweets}
              onChange={(e) => setQuoteTweets(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.likes}</label>
            <input
              type="number"
              className="input"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
            />
          </li>
          <li>
            <label>{langText?.vfAccount}</label>
            <select
              onChange={(e) => setIsVerified(e.target.value)}
              defaultValue={isVerified}
            >
              <option value="1">Evet</option>
              <option value="0">Hayır</option>
            </select>
          </li>
          <button onClick={getImage}>Create</button>
          <div className="download-url">
            {image && (
              <a ref={downloadRef} href={image} download="tweet.png">
                Download Tweet
              </a>
            )}
          </div>
        </ul>
      </div>
      <div className="tweet-container">
        <div className="app-language">
          <span
            onClick={() => setLang("en")}
            className={lang === "en" && "active"}
          >
            English
          </span>
          <span
            onClick={() => setLang("tr")}
            className={lang === "tr" && "active"}
          >
            Türkçe
          </span>
        </div>
        <div className="fetch-info">
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="type your twitter username"
          />
          <button onClick={fetchTwitterInfo}>Set Info</button>
        </div>
        <div className="tweet" ref={tweetRef}>
          <div className="tweet-author">
            {(avatar && <img src={avatar} />) || <AvatarLoader />}
            <div>
              <div className="name">
                {name || "Name-Surname"}

                {isVerified == 1 && (
                  <IoIosCheckmarkCircleOutline width="19px" height="19px" />
                )}
              </div>
              <div className="username">@{username || "username"} </div>
            </div>
          </div>

          <div className="tweet-content">
            <p
              dangerouslySetInnerHTML={{
                __html:
                  (tweet && tweetFormat(tweet)) ||
                  "example tweet will come in this field @yasahinn ",
              }}
            />
          </div>
          <div className="tweet-stats">
            <span>
              <b>{formatNumber(retweets)}</b> Retweets
            </span>
            <span>
              <b>{formatNumber(quoteTweets)}</b> Quote Tweets
            </span>
            <span>
              <b>{formatNumber(likes)}</b> Likes
            </span>
          </div>
          <div className="tweet-actions">
            <span>
              <FaRegComment />
            </span>
            <span>
              <FaRetweet />
            </span>
            <span>
              <FaRegHeart />
            </span>
            <span>
              <BsUpload />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import moment from "moment";
import M from "materialize-css";
import "../App.css";

function Home() {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [mypics, setPics] = useState([]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    // console.log("likes")
    // console.log(id)
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteComment = (postid, commentid) => {
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        const newData1 = mypics.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        setPics(newData1);
      })
      .then((result) => {
        M.toast({
          html: "Comment Deleted Successfully",
          classes: "#43a047 green darken-1",
        });
      });
  };
  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log("new data" + newData);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postid) => {
    // console.log(postid);
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className=" home-card card" key={item._id}>
            <h5 style={{ padding: "5px" }}>
              <img className="setting" src={item.postedBy.pic} alt="logo" />

              <Link
                className="link-setting"
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>

              <span style={{ float: "right", color: "blue" }}>
                {moment(item.createdAt).fromNow()}
              </span>
            </h5>
            <div className="card-imeage ">
              <img src={item.photo} alt="logo" width="auto" height="400px" />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unLikePost(item._id);
                  }}
                >
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>{" "}
                  thumb_down{" "}
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  favorite_border thumb_up{" "}
                </i>
              )}
              <br></br>
              <span>{item.likes.length} likes</span>&nbsp;&nbsp;&nbsp;
              <span>{item.comments.length} comments</span>
              <h6>{item.title}</h6>
              {/* <p>{item.body}</p> */}
              <h6>
                <strong>
                  <Link
                    onClick={scrollToTop}
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                  >
                    {item.postedBy.name}
                  </Link>{" "}
                </strong>
                &nbsp;{item.body}
              </h6>
              {item.comments.length === 0 ? (
                <h6>
                  <strong>No comments yet..</strong>
                </h6>
              ) : item.comments.length === 1 ? (
                <h6>
                  <strong>View 1 comment</strong>
                </h6>
              ) : (
                <h6>
                  <strong>View all {item.comments.length} comments</strong>
                </h6>
              )}
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      <Link
                        onClick={scrollToTop}
                        to={
                          record.postedBy._id !== state._id
                            ? "/profile/" + record.postedBy._id
                            : "/profile"
                        }
                      >
                        {record.postedBy.name}
                      </Link>
                    </span>{" "}
                    {record.text}
                    {(item.postedBy._id === state._id ||
                      record.postedBy._id === state._id) && (
                      <i
                        className="material-icons"
                        style={{
                          float: "right",
                          color: "red",
                        }}
                        onClick={() => deleteComment(item._id, record._id)}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                );
              })}
              {/* {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                } */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value = "";
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
              {/* <button type="submit" style={{float:"right"}}><i className="material-icons" >arrow_forward</i>
                                </button> */}
              <p>
                <strong>
                  Posted on {moment(item.date).format("MMMM Do YYYY")}
                </strong>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;

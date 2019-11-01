import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';

function App() {

  const initialComment = {
    text: "",
    post_id: ""
  }

  const initialPost = {
    title: "",
    contents: ""
  }

  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [showId, setShowId] = useState("");
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState(initialComment);
  const [newPost, setNewPost] = useState(initialPost);
  const [editPostId, setEditPostId] = useState(false);
  console.log("App.js posts", posts);
  console.log("App.js newPost", newPost);
  console.log("App.js comment", comment);
  useEffect(() => {
    axios.get(`https://middle-earth-chat.herokuapp.com/api/posts`)
      .then(res => {
        console.log("App.js .get res", res);
        const sortedData = res.data.sort((a, b) => {
          return b.id - a.id
        })
        setPosts(sortedData);
      })
      .catch(err => {
        console.log('.get err', err);
      })

  }, [])

  const handleChanges = (e) => {
    e.preventDefault();
    setComment({
      ...comment,
      [e.target.name]: e.target.value
    })
  }

  const handlePost = (e) => {
    e.preventDefault();
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value
    })
  }

  const getComments = (e, id) => {
    e.preventDefault();
    axios.get(`https://middle-earth-chat.herokuapp.com/api/posts/${id}/comments`)
      .then(res => {
        console.log("getComments .get res.data", res.data);
        setComments(res.data);
      })
      .catch(err => {
        console.log("getComments .get err", err)
      })
  }

  const makePost = (e, newPost) => {
    e.preventDefault();
    if (!newPost.title || !newPost.contents) {
      alert("Your post needs both a title and contents");
    } else

      axios.post(`https://middle-earth-chat.herokuapp.com/api/posts`, newPost)
        .then(res => {
          const sortedData = res.data.sort((a, b) => {
            return b.id - a.id
          })
          setPosts(sortedData);
          setNewPost(initialPost);
        })
        .catch(err => {
          console.log("App.js makePost .post err", err.errorMessage);
        })
  }


  const editPost = (e, post_id, postToEdit) => {
    console.log(post_id, postToEdit);
    e.preventDefault();
    if (!newPost.title || !newPost.contents) {
      alert("Your post needs both a title and contents");
    } else {
      axios.put(`https://middle-earth-chat.herokuapp.com/api/posts/${post_id}`, postToEdit)
        .then(res => {
          const sortedData = res.data.sort((a, b) => {
            return b.id - a.id
          })
          setPosts(sortedData);
        })
        .catch(err => {
          console.log("App.js makePost .post err", err.errorMessage);
        })
    }

  }

  const leaveComment = (e, id, comment) => {
    e.preventDefault();
    if (comment.text === "") {
      alert("You need some text to comment!");
    } else
      axios.post(`https://middle-earth-chat.herokuapp.com/api/posts/${id}/comments`, comment)
        .then(res => {
          console.log("App.js leaveComment .post res", res);
          const sortedData = res.data.sort((a, b) => {
            return b.id - a.id
          })
          setPosts(sortedData);
          getComments(e, id);
          setComment({
            ...comment,
            text: ""
          });
        })
        .catch(err => {
          console.log("App.js leaveComment .post err", err.errorMessage);
        })
  }

  const deleteComment = (e, comment_id, post_id) => {
    e.preventDefault();
    axios.delete(`https://middle-earth-chat.herokuapp.com/api/posts/comments/${comment_id}`)
      .then(res => {
        const sortedData = res.data.sort((a, b) => {
          return b.id - a.id
        })
        setPosts(sortedData);
        getComments(e, post_id);
      })
      .catch(err => {
        console.log(err.message);
      })
  }


  const deletePost = (e, post_id) => {
    e.preventDefault();
    axios.delete(`https://middle-earth-chat.herokuapp.com/api/posts/${post_id}`)
      .then(res => {
        const sortedData = res.data.sort((a, b) => {
          return b.id - a.id
        })
        setPosts(sortedData);
      })
      .catch(err => {
        console.log(err.message);
      })

  }

  return (
    <div className="App">
      <img src="http://icons.iconarchive.com/icons/3xhumed/mega-games-pack-28/256/The-Lord-of-the-Rings-The-Battle-for-Middle-Earth-II-1-icon.png" alt="" />
      <h1>Middle Earth Chat</h1>
      <div className="post-inputs-container">
        <input placeholder="Give your post a title" onChange={handlePost} type="text" name="title" value={newPost.title} />
        <textarea value={newPost.contents} onChange={handlePost} placeholder="Say your piece..." name="contents" id="" />
        <button
          className="post-it-btn"
          onClick={(e) => { makePost(e, newPost) }} >Post It</button>
      </div>
      <div className="post-list">
        {posts.map(post => (

          <div key={post.id} className="post-content">
            <div className="post-id-info">
              <span className="post-id-span">Post id: {post.id}</span>
              <span className="post-created-at">Created {post.created_at}</span>
              <span className="post-last-updated">Updated: {post.updated_at}</span>
            </div>

            <span onClick={() => {
              setEditPostId(post.id)
              setNewPost(post);
            }} className="edit-post-span">Edit Post</span>
            <span onClick={(e) => { deletePost(e, post.id) }} className="delete-post-span" >Delete Post</span>
            {editPostId !== post.id && (
              <div className="not-editing-view">
                <h4>{post.title}</h4>
                <p>{post.contents}</p>
              </div>
            )}
            {editPostId === post.id && (
              <div className="not-editing-view">
                <h4>{newPost.title}</h4>
                <p>{newPost.contents}</p>
              </div>
            )}
            {editPostId === post.id && (
              <div className="editing-inputs">
                <input onChange={handlePost} value={newPost.title} type="text" name="title" />
                <textarea onChange={handlePost} value={newPost.contents} name="contents" id="" cols="30" rows="10" />
                <button className="submit-changes-btn" onClick={(e) => {
                  editPost(e, post.id, newPost)
                  setNewPost(initialPost);
                  setEditPostId("");
                }}>Submit Changes</button>
                <button className="cancel-changes-btn"
                  onClick={() => {
                    setEditPostId("")
                    setNewPost(initialPost);
                  }}>Cancel</button>
              </div>


            )}


            {showId !== post.id && (
              <button className="see-comments-btn"
                onClick={(e) => {
                  setShow(true);
                  getComments(e, post.id);
                  setShowId(post.id);
                  setComment({
                    ...comment,
                    post_id: post.id
                  })
                }
                }>See Comments</button>
            )}
            {showId === post.id && (
              <div className="comments">
                {comments.map((comment, index) => (
                  <div className="comment">

                    <p>{index + 1}. {comment.text} <span onClick={(e) => { deleteComment(e, comment.id, post.id) }}>X</span></p>
                  </div>
                ))}
                <div className="text-area">
                  <textarea onChange={handleChanges} value={comment.text} placeholder="Say something" name="text" id="" cols="100" rows="5" />
                </div>
                <div className="comment-btns">
                  <button className="hide-comments-btn"
                    onClick={() => {
                      setShowId("")
                      setShow(false)
                      setComment(initialComment);
                    }}>Hide Comments</button>
                  <button className="comment-btn"
                    onClick={(e) =>
                      leaveComment(e, post.id, comment)} >Comment</button>
                </div>

              </div>

            )}
          </div>
        ))}

      </div>
    </div >
  );
}

export default App;


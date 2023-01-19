import axios from "axios";
import React, { useState } from "react";
import {
  useAddNewPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation
} from "../../Api/apiSlice";

function PostList() {
  const [addNewPost, response] = useAddNewPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [imageURL, setImageURL] = useState(null);
  const imageInputRef = React.useRef(); 

  const handleImageUpload = (e) => {
    console.log(e.target.files[0]);
    const imageData = new FormData();
    imageData.set("key", "876935df77e8da04119600203a2323f6");
    imageData.append("image", e.target.files[0]);
    axios
      .post("https://api.imgbb.com/1/upload", imageData)
      .then(function (response) {
        setImageURL(response.data.data.display_url);
        console.log(response.data.data.display_url);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [inputField, setInputField] = useState({
    id: "",
    title: "",
    description: "",
    image: imageURL,
  });
  const handleInputs = (e) => {
    setInputField((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const setPostData = (data, imageURL) => {
    setInputField({
      id: data.id,
      title: data.title,
      description: data.description,
    });
  };

  const onEditData = () => {
    updatePost({
      id: inputField.id,
      title: inputField.title,
      description: inputField.description,
    });
    setInputField(() => ({
      id: "",
      title: "",
      description: "",
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { title, description, image } = e.target.elements;
    setInputField((inputField) => ({
      ...inputField,
      [e.target.name]: e.target.value,
    }));
    let formData = {
      title: title.value,
      description: description.value,
      image: imageURL,
    };
    formData.image &&
      addNewPost(formData)
        .unwrap()
        .then(() => {
          imageInputRef.current.value = "";
          setImageURL(null);
          setInputField(() => ({
            id: "",
            title: "",
            description: "",
          }))
        })
        .then((err) => {
          console.log(err);
        });
  };
  const {
    data: posts,
    isLoading: isGetLoading,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetPostsQuery({ refetchOnMountOrArgChange: true });

  let postContent;
  console.log(postContent);
  if (isGetLoading) {
    postContent = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else if (isGetSuccess) {
    postContent = !posts.length ? (
      <div className="row">
        <div className="card alert alert-secondary">
          <div className="card-body">
            <h5 className="card-title text-center">No Job Available Now</h5>
          </div>
        </div>
      </div>
    ) : (
      posts.map((item) => {
        return (
          <div className="col-lg-12 mb-3" key={item.id}>
            <div className="card alert alert-secondary">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <img src={item.image} alt={item.title}></img>
                <button
                  onClick={() => deletePost(item.id)}
                  className="btn btn-outline-danger me-2"
                >
                  Remove
                </button>
                <button
                  onClick={() => setPostData(item)}
                  className="btn btn-outline-primary"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        );
      })
    );
  } else if (isGetError) {
    postContent = (
      <div className="alert alert-danger" role="alert">
        {getError}
      </div>
    );
  }
  return (
    <div className="row">
      <div className="col-md-4 offset-md-*">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <h5 className="fw-bold">Enter Title</h5>
            </label>
            <input
              value={inputField.title}
              type="text"
              className="form-control"
              name="title"
              id="title"
              required
              onChange={handleInputs}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              <h5>Enter content</h5>
            </label>
            <textarea
              value={inputField.description}
              className="form-control"
              rows="6"
              name="description"
              id="description"
              required
              onChange={handleInputs}
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="formFile" class="form-label">
              Default file input example
            </label>
            <input
              class="form-control"
              value={inputField.imageURL}
              name="image"
              required
              onClick={handleImageUpload}
              type="file"
              ref={imageInputRef}
              id="image"
            />
          </div>
          <button className="btn btn-danger me-2" type="submit">
            Submit
          </button>
          <button
            onClick={onEditData}
            className="btn btn-primary"
            type="button"
          >
            Update
          </button>
        </form>
      </div>
      <div className="col-lg-8 px-5">
        <div className="row">{postContent}</div>
      </div>
    </div>
  );
}
export default PostList;

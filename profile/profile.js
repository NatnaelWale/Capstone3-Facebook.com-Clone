"use strict";


function loadUserImages(){
  const loginData = getLoginData();
  const img1 = document.createElement('img');
      img1.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
      img1.className = 'rounded-circle mx-2';
      img1.alt = 'avatar';
      img1.style.width = '38px';
      img1.style.height = '38px';
      img1.style.objectFit = 'cover';

      const profileTopRightImageDroppedDown = document.getElementById('profileTopRightImageDroppedDown');
      profileTopRightImageDroppedDown.appendChild(img1);


      const img2 = document.createElement('img');
      img2.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
      img2.className = 'rounded-circle';
      img2.alt = 'avatar';
      img2.style.width = '38px';
      img2.style.height = '38px';
      img2.style.objectFit = 'cover';

      const profileTopRightImage = document.getElementById('profileTopRightImage');
      profileTopRightImage.appendChild(img2);


      const img3 = document.createElement('img');
      img3.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
      img3.alt = 'avatar';
      img3.className = 'rounded-circle border shadow ms-2';
      img3.style.width = '200px';
      img3.style.height = '200px';
      img3.style.objectFit = 'cover';
      img3.style.margin = '-60px 0 0 40px';

      const profilePageMainPhoto = document.getElementById('profilePageMainPhoto');
      profilePageMainPhoto.appendChild(img3);

      const img4 = document.createElement('img');
      img4.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
      img4.className = 'rounded-circle';
      img4.alt = 'avatar';
      img4.style.width = '38px';
      img4.style.height = '38px';
      img4.style.objectFit = 'cover';

      const profilePagePostPhoto = document.getElementById('profilePagePostPhoto');
      profilePagePostPhoto.appendChild(img4);

}

loadUserImages();

function createElement(type, classNames, innerHTML, attributes = {}) {
  const element = document.createElement(type);
  if (classNames) element.className = classNames;
  if (innerHTML) element.innerHTML = innerHTML;
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
  return element;
}

function createAvatar(src) {
  return createElement("img", "rounded-circle me-2", null, {
    src,
    alt: "avatar",
    style: "width: 38px; height: 38px; object-fit: cover",
  });
}

function createDropdownMenu(menuId, postId, postText) {
  const menuIcon = createElement("i", "fas fa-ellipsis-h", null, {
    type: "button",
    id: menuId,
    "data-bs-toggle": "dropdown",
    "aria-expanded": "false",
  });
  const editMenu = createElement("ul", "dropdown-menu border-0 shadow", null, {
    "aria-labelledby": menuId,
  });
  const editPost = createElement(
    "a",
    "dropdown-item d-flex justify-content-around align-items-center fs-7",
    "Edit Post",
    { href: "#", "data-post-id": postId, "data-post-text": postText }
  );
  const deletePost = createElement(
    "a",
    "dropdown-item d-flex justify-content-around align-items-center fs-7",
    "Delete Post",
    { href: "#", "data-post-id": postId }
  );
  const li1 = createElement("li", "d-flex align-items-center");
  const li2 = createElement("li", "d-flex align-items-center");
  li1.appendChild(editPost);
  li2.appendChild(deletePost);
  editMenu.appendChild(li1);
  editMenu.appendChild(li2);

  return { menuIcon, editMenu };
}

function createCommentSection(commentId) {
  const commentSection = createElement("div", "collapse", null, {
    id: `comments${commentId}`,
  });

  const comment1 = createElement("div", "d-flex align-items-center my-1");
  comment1.appendChild(createAvatar("https://picsum.photos/200/300"));
  comment1.appendChild(
    createElement(
      "div",
      "p-3 rounded comment__input w-100",
      '<p class="fw-bold m-0">John</p><p class="m-0 fs-7 bg-gray p-2 rounded">Thank you for sharing this.</p>'
    )
  );

  const comment2 = createElement("div", "d-flex align-items-center my-1");
  comment2.appendChild(createAvatar("https://picsum.photos/200/301"));
  comment2.appendChild(
    createElement(
      "div",
      "p-3 rounded comment__input w-100",
      '<p class="fw-bold m-0">Jane</p><p class="m-0 fs-7 bg-gray p-2 rounded">OMG! I can not believe I am seeing this.</p>'
    )
  );

  const commentForm = createElement("form", "d-flex my-1");
  commentForm.appendChild(createAvatar("https://picsum.photos/200/302"));
  commentForm.appendChild(
    createElement("input", "form-control border-0 rounded-pill bg-gray", null, {
      type: "text",
      placeholder: "Write a comment",
    })
  );

  commentSection.appendChild(comment1);
  commentSection.appendChild(comment2);
  commentSection.appendChild(commentForm);

  return commentSection;
}

function addLike(postId, token, callback) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId }),
  };

  fetch(`${apiBaseURL}/api/likes`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Like added:", data);
      callback(data);
    })
    .catch((error) => console.error("Error adding like:", error));
}

function removeLike(likeId, token, callback) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  fetch(`${apiBaseURL}/api/likes/${likeId}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Like removed:", data);
      callback();
    })
    .catch((error) => console.error("Error removing like:", error));
}

function toggleLike(button, likeCountElement, userLikes, postId, token) {
  const liked = button.classList.toggle("liked");
  if (liked) {
    addLike(postId, token, (newLike) => {
      userLikes.push(newLike);
      button.querySelector("i").classList.add("text-primary");
      likeCountElement.innerHTML = `${userLikes.length} likes`;
    });
  } else {
    const likeId = userLikes.pop().likeId;
    removeLike(likeId, token, () => {
      button.querySelector("i").classList.remove("text-primary");
      likeCountElement.innerHTML = `${userLikes.length} likes`;
    });
  }
}

function getTimeDifferenceString(lastCheck) {
  const now = new Date();
  const lastCheckTime = new Date(lastCheck);
  const differenceInMilliseconds = now - lastCheckTime;
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );

  if (differenceInMinutes < 1) {
    return "few seconds ago";
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes} minutes ago`;
  } else {
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    return `${differenceInHours} hours ago`;
  }
}

function createPost(
  loggedInUserFullName,
  userBio,
  userAvatar,
  postImageSrc,
  commentId,
  lastCheck,
  userLikes,
  postId,
  token
) {
  console.log(loginData);
  const timeDifferenceString = getTimeDifferenceString(lastCheck);
  const postContainer = createElement(
    "div",
    "bg-white p-4 rounded shadow mt-3",
    null,
    { id: `post-${postId}` }
  );
  const postHeader = createElement("div", "d-flex justify-content-between");
  const authorInfo = createElement("div", "d-flex");
  const avatar = createAvatar(userAvatar);
  const authorDetails = createElement(
    "div",
    null,
    `<p class="m-0 fw-bold">${loggedInUserFullName}</p><span class="text-muted fs-7">${timeDifferenceString}</span>`
  );
  authorInfo.appendChild(avatar);
  authorInfo.appendChild(authorDetails);
  const { menuIcon, editMenu } = createDropdownMenu(
    `post${commentId}Menu`,
    postId,
    userBio
  );
  postHeader.appendChild(authorInfo);
  postHeader.appendChild(menuIcon);
  postHeader.appendChild(editMenu);
  postContainer.appendChild(postHeader);
  const postContent = createElement("div", "mt-3");
  const postText = createElement("p", "text-break", userBio, {
    id: "bioDisplay",
  });
  const postImage = createElement("img", "img-fluid rounded", null, {
    src: postImageSrc,
    alt: "post image",
  });
  postContent.appendChild(postText);
  postContent.appendChild(postImage);
  postContainer.appendChild(postContent);

  const likeCommentSection = createElement(
    "div",
    "post__comment mt-3 position-relative d-flex justify-content-between"
  );
  const likeCountElement = createElement(
    "p",
    "m-0 text-muted fs-7",
    `${userLikes.length} likes`
  );
  const likeButton = createElement(
    "div",
    "me-2 pointer",
    '<i class="fas fa-thumbs-up"></i><i class="text-danger fab fa-gratipay"></i><i class="text-warning fas fa-grin-squint"></i>'
  );
  likeButton.addEventListener("click", () =>
    toggleLike(likeButton, likeCountElement, userLikes, postId, token)
  );
  const likeSection = createElement("div", "d-flex align-items-center", null);
  likeSection.appendChild(likeButton);
  likeSection.appendChild(likeCountElement);

  const commentShareInfo = createElement(
    "div",
    "d-flex align-items-center",
    '<p class="m-0 text-muted">2 comments </p><p class="m-1 text-muted">14 shares</p>'
  );
  likeCommentSection.appendChild(likeSection);
  likeCommentSection.appendChild(commentShareInfo);
  postContainer.appendChild(likeCommentSection);

  const commentButton = createElement(
    "div",
    "dropdown-item rounded d-flex justify-content-center align-items-center pointer text-muted p-1",
    '<i class="fas fa-thumbs-up me-3"></i><p class="m-0">Like</p>'
  );
  commentButton.addEventListener("click", () =>
    toggleLike(commentButton, likeCountElement, userLikes, postId, token)
  );
  const commentSectionButton = createElement(
    "div",
    "dropdown-item rounded d-flex justify-content-center align-items-center pointer text-muted p-1",
    '<i class="fas fa-comment-alt me-3"></i><p class="m-0">Comment</p>',
    {
      "data-bs-toggle": "collapse",
      "data-bs-target": `#comments${commentId}`,
      "aria-expanded": "false",
      "aria-controls": `comments${commentId}`,
    }
  );
  const buttonContainer = createElement(
    "div",
    "d-flex justify-content-around mt-2"
  );
  buttonContainer.appendChild(commentButton);
  buttonContainer.appendChild(commentSectionButton);
  postContainer.appendChild(buttonContainer);

  postContainer.appendChild(createCommentSection(commentId));
  return postContainer;
}

function getAllPosts(loggedInUserFullName) {
  const loginData = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiBaseURL + `/api/posts/?username=${loginData.username}`, options)
    .then((response) => response.json())
    .then((users) => {
      // Sort users by lastcheck time in descending order
      users.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      const postsContainer = createPostsContainer();
      users.forEach((user, index) => {
        const userName = user.username || "Unknown Name";
        const userBio = user.text;
        const userLikes = user.likes;
        const postId = user._id;
        console.log(postId);
        const updatedAt = new Date(user.createdAt).toLocaleString();
        const userAvatar = `https://picsum.photos/200/300?random=${index + 1}`;
        const postImageSrc = `https://picsum.photos/700/300?random=${
          index + 1
        }`;
        const post = createPost(
          userName,
          userBio,
          userAvatar,
          postImageSrc,
          index,
          updatedAt,
          userLikes,
          postId,
          loginData.token
        );
        postsContainer.appendChild(post);
      });
      document.getElementById("right-wing").appendChild(postsContainer);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}
// getAllPosts();

function createPostsContainer() {
  return createElement(
    "div",
    "posts-container  custom-container d-flex flex-column align-items-center col-12",
    null,
    {
      style: "max-width: 700px; width: 100%;",
    }
  );
}

// Creating a post fetch request
postBtn.onclick = onPostBtnClicked;

function onPostBtnClicked(e) {
  e.preventDefault();
  const createModal = document.querySelector("#createModal");
  const postContent = document.querySelector("#postContent");
  const postBtn = document.querySelector("#postBtn");

  const loginData = getLoginData();

  let bodyData = {
    text: postContent.value,
  };

  fetch(apiBaseURL + "/api/posts", {
    method: "POST",
    body: JSON.stringify(bodyData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${loginData.token}`,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.statusCode === 409) {
        console.log(json);
        createModal.innerHTML = json.message;
      } else {
        createModal.className =
          "text-success text-center border p-2 shadow bg-success m-1 text-white";
        createModal.innerHTML = "You have succesfully posted to Facebook.";
        setTimeout("location.href = '/';", 2000);
      }
    })
    .catch((error) => {
      console.error("Error adding user: ", error);
      createModal.innerHTML = "Error creating user. Please try again.";
    });
}

// Function to create a modal dynamically
function createEditPostModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "editPostModal";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "editPostModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editPostModalLabel">Edit Post</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <textarea id="editPostContent" class="form-control" rows="5"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="saveEditPost">Save changes</button>
                </div>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
}

//Event listsener for editmodal and to get all post when DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  createEditPostModal();
  getAllPosts();
});

// Function to open the modal and populate it with the post content
function openEditModal(postId, postText) {
  console.log(postId);
  const editPostContent = document.getElementById("editPostContent");
  const saveEditPostButton = document.getElementById("saveEditPost");

  // Set the current post content in the modal textarea
  editPostContent.value = postText;

  // Add an event listener to save changes
  saveEditPostButton.onclick = function () {
    editPostModal.hide();
    alert("This API doesn't support post edits!");
  };

  // Show the modal
  const editPostModal = new bootstrap.Modal(
    document.getElementById("editPostModal")
  );
  editPostModal.show();
}

// Function to save the edited post
function savePostEdit(postId, newContent) {
  console.log(`Saving edited content for post ${postId}: ${newContent}`);

  fetch(apiBaseURL + `/api/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginData().token}`,
    },
    body: JSON.stringify({ text: newContent }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Post updated successfully:", data);
      // Update the post content on the page
      const postElement = document.getElementById(`post-${postId}`);
      postElement.querySelector("#bioDisplay").textContent = newContent;
    })
    .catch((error) => {
      console.error("Error updating post:", error);
    });
}

// Function to delete the post
function deletePostById(postId) {
  console.log(postId);
  console.log(`Deleting post ${postId}`);

  fetch(apiBaseURL + `/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getLoginData().token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Post deleted successfully:", data);
      // Remove the post from the DOM
      const postElement = document.getElementById(`post-${postId}`);
      postElement.remove();
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
    });
}

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.onclick = function (e) {
  e.preventDefault();
  logout();
};
const loginData = getLoginData();
console.log(loginData.token);

// Add event listeners for edit and delete actions
document.addEventListener("click", function (event) {
  if (event.target.matches(".dropdown-item")) {
    const postId = event.target.getAttribute("data-post-id");
    const postText = event.target.getAttribute("data-post-text");

    if (event.target.textContent.trim() === "Edit Post") {
      openEditModal(postId, postText);
    } else if (event.target.textContent.trim() === "Delete Post") {
      deletePostById(postId);
    }
  }
});

let loggedInUserFullName = "";
let loggedInUserUserName = "";
let loggedInUserBio = "";

function getLoggedInUser() {
  const loginData = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  const mainUserName = document.querySelector("#mainUserName");
  const profilepageFullName = document.querySelector("#profilepageFullName");
  const bioDisplay = document.querySelector("#bioDisplay");

  fetch(apiBaseURL + `/api/users/${loginData.username}`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      loggedInUserFullName = data.fullName;
      loggedInUserUserName = data.username;
      loggedInUserBio = data.bio;
      bioDisplay.innerHTML = loggedInUserBio;
      mainUserName.innerHTML = loggedInUserFullName;
      document.querySelector("#modalFullName").innerHTML = loggedInUserFullName;
      profilepageFullName.innerHTML = loggedInUserFullName;
    })
    .catch((error) => {
      console.error("Error fetching logged in user:", error);
    });
}
getLoggedInUser();

// Event listener inorder to create edit details modal
document.addEventListener("DOMContentLoaded", () => {
  createEditDetailsModal();

  const editDetailsBtn = document.querySelector("#editDetailsBtn");
  editDetailsBtn.onclick = () => {
    // console.log(loggedInUserFullName);
    // console.log(loggedInUserUserName);
    openEditDetailsModal(loggedInUserFullName, loggedInUserUserName);
  };
});

function createEditDetailsModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "editDetailsModal";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "editDetailsModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editDetailsModalLabel">Edit User Details</h5>
                    </div>
                    <div class="modal-body">
                        <form id="editDetailsForm">
                            <div class="form-group">
                                <label for="editFullName">New full name:</label>
                                <input type="text" class="form-control" id="editFullName" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="editDetailsModalCloseBtn">Close</button>
                        <button type="button" class="btn btn-primary" id="saveDetailsBtn">Save changes</button>
                    </div>
                </div>
            </div>
        `;
  document.body.appendChild(modal);

  const saveDetailsBtn = document.querySelector("#saveDetailsBtn");
  saveDetailsBtn.onclick = saveUserDetails;
}

//Open edit detials modal to get new details from user
function openEditDetailsModal(fullName) {
  const editFullNameInput = document.querySelector("#editFullName");

  editFullNameInput.value = fullName;

  const editDetailsModal = new bootstrap.Modal(
    document.getElementById("editDetailsModal")
  );
  editDetailsModal.show();
}

// Save user details after getting new values
function saveUserDetails() {
  const newFullName = document.querySelector("#editFullName").value;

  console.log(`Saving new details: Full Name - ${newFullName}`);

  const loginData = getLoginData();
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginData.token}`,
    },
    body: JSON.stringify({ fullName: newFullName }),
  };

  fetch(apiBaseURL + `/api/users/${loginData.username}`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("User details updated successfully:", data);

      // Update local storage with new login data
      const updatedLoginData = { ...loginData, fullName: newFullName };
      localStorage.setItem("loginData", JSON.stringify(updatedLoginData));

      // Update UI
      document.querySelector("#mainUserName").innerHTML = newFullName;
      document.querySelector("#profilepageFullName").innerHTML = newFullName;
      document.querySelector("#modalFullName").innerHTML = newFullName;

      // Close the modal
      const editDetailsModal = bootstrap.Modal.getInstance(
        document.getElementById("editDetailsModal")
      );
      editDetailsModal.hide();
    })
    .catch((error) => {
      console.error("Error updating user details:", error);
    });
}

//Edit Details modal close button functionality
document.addEventListener("DOMContentLoaded", () => {
  const editDetailsModalCloseBtn = document.querySelector(
    "#editDetailsModalCloseBtn"
  );
  editDetailsModalCloseBtn.onclick = () => {
    const editDetailsModal = bootstrap.Modal.getInstance(
      document.getElementById("editDetailsModal")
    );
    editDetailsModal.hide();
  };
});

// Event listener inorder to add bio modal
document.addEventListener("DOMContentLoaded", () => {
  createAddBioModal();

  const addBioBtn = document.querySelector("#addBioBtn");
  addBioBtn.onclick = () => {
    // console.log(loggedInUserFullName);
    // console.log(loggedInUserUserName);
    openAddBioModal(loggedInUserBio);
  };
});

function createAddBioModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "addBioModal";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "addBioModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addBioModalLabel">Edit User Details</h5>
                    </div>
                    <div class="modal-body">
                        <form id="editDetailsForm">
                            <div class="form-group">
                                <label for="addBio">Your bio:</label>
                                <input type="text" class="form-control" id="addBio" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="addBioModalCloseBtn">Close</button>
                        <button type="button" class="btn btn-primary" id="saveAddedBioBtn">Save changes</button>
                    </div>
                </div>
            </div>
        `;
  document.body.appendChild(modal);

  const saveAddedBioBtn = document.querySelector("#saveAddedBioBtn");
  saveAddedBioBtn.onclick = saveUserBio;
}

function openAddBioModal(bio) {
  const addBioInput = document.querySelector("#addBio");

  addBioInput.value = bio;

  const addBioModal = new bootstrap.Modal(
    document.getElementById("addBioModal")
  );
  addBioModal.show();
}

function saveUserBio() {
  const newAddedBio = document.querySelector("#addBio").value;

  console.log(`Saving new bio: bio - ${newAddedBio}`);

  const loginData = getLoginData();
  // console.log(loginData)
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginData.token}`,
    },
    body: JSON.stringify({ bio: newAddedBio }),
  };

  fetch(apiBaseURL + `/api/users/${loginData.username}`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("User bio added successfully:", data);

      // Update local storage with new login data
      const updatedLoginData = { ...loginData, bio: newAddedBio };
      localStorage.setItem("loginData", JSON.stringify(updatedLoginData));

      // Update UI
      document.querySelector("#bioDisplay").innerHTML = newAddedBio;
      document.querySelector("#bioIcon").classList.remove("d-none");

      // Close the modal
      const addBioModal = bootstrap.Modal.getInstance(
        document.getElementById("addBioModal")
      );
      addBioModal.hide();
    })
    .catch((error) => {
      console.error("Error updating user details:", error);
    });
}

//Add bio modal close button functionality
document.addEventListener("DOMContentLoaded", () => {
  const addBioModalCloseBtn = document.querySelector("#addBioModalCloseBtn");
  addBioModalCloseBtn.onclick = () => {
    const addBioModal = bootstrap.Modal.getInstance(
      document.getElementById("addBioModal")
    );
    addBioModal.hide();
  };
});

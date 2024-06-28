/* Posts Page JavaScript */

"use strict";

const loginData = getLoginData();
// console.log(loginData)

function loadUserImages() {
  const img1 = document.createElement("img");
  img1.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
  img1.className = "rounded-circle";
  img1.alt = "avatar";
  img1.style.width = "38px";
  img1.style.height = "38px";
  img1.style.objectFit = "cover";

  const postsTopRightImage = document.getElementById("postsTopRightImage");
  postsTopRightImage.appendChild(img1);

  const img2 = document.createElement("img");
  img2.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
  img2.className = "rounded-circle";
  img2.alt = "avatar";
  img2.style.width = "38px";
  img2.style.height = "38px";
  img2.style.objectFit = "cover";

  const postsSideBarPhoto = document.getElementById("postsSideBarPhoto");
  postsSideBarPhoto.appendChild(img2);

  const img3 = document.createElement("img");
  img3.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
  img3.className = "card-img-top";
  img3.alt = "story posts";
  img3.style.minHeight = "125px";
  img3.style.objectFit = "cover";

  const userStoryPhoto = document.getElementById("userStoryPhoto");
  userStoryPhoto.appendChild(img3);

  const img4 = document.createElement("img");
  img4.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
  img4.className = "rounded-circle";
  img4.alt = "avatar";
  img4.style.width = "38px";
  img4.style.height = "38px";
  img4.style.objectFit = "cover";

  const createPostPhoto = document.getElementById("createPostPhoto");
  createPostPhoto.appendChild(img4);

  const img5 = document.createElement("img");
  img5.src = `https://picsum.photos/seed/${loginData.username}/200/300`;
  img5.className = "rounded-circle mx-2";
  img5.alt = "avatar";
  img5.style.width = "38px";
  img5.style.height = "38px";
  img5.style.objectFit = "cover";

  const postsPageProfileIcon = document.getElementById("postsPageProfileIcon");
  postsPageProfileIcon.appendChild(img5);
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


function createDropdownMenu(menuId) {
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
    "Save Post",
    { href: "#" }
  );
  const deletePost = createElement(
    "a",
    "dropdown-item d-flex justify-content-around align-items-center fs-7",
    "Report Post",
    { href: "#" }
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
      '<p class="fw-bold m-0">John</p><p class="m-0 fs-7 bg-gray p-2 rounded">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'
    )
  );

  const comment2 = createElement("div", "d-flex align-items-center my-1");
  comment2.appendChild(createAvatar("https://picsum.photos/200/301"));
  comment2.appendChild(
    createElement(
      "div",
      "p-3 rounded comment__input w-100",
      '<p class="fw-bold m-0">Jane</p><p class="m-0 fs-7 bg-gray p-2 rounded">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId }),
  };

  fetch(`${apiBaseURL}/api/likes`, options)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Like added:', data);
          callback(data);
      })
      .catch(error => console.error('Error adding like:', error));
}

function removeLike(likeId, token, callback) {
  const options = {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
  };

  // console.log('Removing like with ID:', likeId); // Debug log

  fetch(`${apiBaseURL}/api/likes/${likeId}`, options)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Like removed:', data);
          callback(data);
      })
      .catch(error => console.error('Error removing like:', error));
}


// Function to initialize the like button state
function initializeLikeButton(button, userLikes, postId) {
  const userHasLiked = userLikes.some(like => like.postId === postId);
  if (userHasLiked) {
      button.classList.add('liked');
      button.querySelector('i').classList.add('text-primary');
  } else {
      button.classList.remove('liked');
      button.querySelector('i').classList.remove('text-primary');
  }
}

// Function to toggle like
function toggleLike(button, likeCountElement, userLikes, postId, token) {
  const liked = button.classList.toggle('liked');
  if (liked) {
      addLike(postId, token, (newLike) => {
          userLikes.push({ postId, likeId: newLike._id });
          button.querySelector('i').classList.add('text-primary');
          likeCountElement.innerHTML = `${userLikes.length} likes`;
      });
  } else {
      const likeIndex = userLikes.findIndex(like => like.postId === postId);
      if (likeIndex !== -1) {
          const likeId = userLikes[likeIndex].likeId;
          console.log('Removing like with ID:', likeId);  // Debug log
          userLikes.splice(likeIndex, 1);
          removeLike(likeId, token, () => {
              button.querySelector('i').classList.remove('text-primary');
              likeCountElement.innerHTML = `${userLikes.length} likes`;
          });
      } else {
          console.error('Like ID not found for removal.');
      }
  }
}


function getTimeDifferenceString(lastCheck) {
  const now = new Date();
  const lastCheckTime = new Date(lastCheck);
  const differenceInMilliseconds = now - lastCheckTime;
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

  if(differenceInMinutes < 1){
    return "few seconds ago";
  }
  else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minutes ago`;
  } else {
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      return `${differenceInHours} hours ago`;
  }
}


function createPost(userName, userBio, userAvatar, postImageSrc, commentId, lastCheck, userLikes, postId, token) {
  const timeDifferenceString = getTimeDifferenceString(lastCheck);
  const postContainer = createElement('div', 'bg-white p-4 rounded shadow mt-3 postContainer');
  const postHeader = createElement('div', 'd-flex justify-content-between');
  const authorInfo = createElement('div', 'd-flex');
  const avatar = createAvatar(userAvatar);
  const authorDetails = createElement('div', null, `<p class="m-0 fw-bold">${userName}</p><span class="text-muted fs-7">${timeDifferenceString}</span>`);
  authorInfo.appendChild(avatar);
  authorInfo.appendChild(authorDetails);
  const { menuIcon, editMenu } = createDropdownMenu(`post${commentId}Menu`);
  postHeader.appendChild(authorInfo);
  postHeader.appendChild(menuIcon);
  postHeader.appendChild(editMenu);
  postContainer.appendChild(postHeader);
  const postContent = createElement('div', 'mt-3');
  const postText = createElement('p', 'text-break', userBio, { id: 'bioDisplay' });
  const postImage = createElement('img', 'img-fluid rounded', null, {
      src: postImageSrc,
      alt: 'post image',
  });
  postContent.appendChild(postText);
  postContent.appendChild(postImage);
  postContainer.appendChild(postContent);

  const likeCommentSection = createElement('div', 'post__comment mt-3 position-relative d-flex justify-content-between');
  const likeCountElement = createElement('p', 'm-0 text-muted fs-7', `${userLikes.length} likes`);
  const likeButton = createElement('div', 'me-2 pointer', '<i class="fas fa-thumbs-up"></i><i class="text-danger fab fa-gratipay"></i><i class="text-warning fas fa-grin-squint"></i>');
  likeButton.addEventListener('click', () => toggleLike(likeButton, likeCountElement, userLikes, postId, token));
  const likeSection = createElement('div', 'd-flex align-items-center', null);
  likeSection.appendChild(likeButton);
  likeSection.appendChild(likeCountElement);

  const commentShareInfo = createElement('div', 'd-flex align-items-center', '<p class="m-0 text-muted">2 comments </p><p class="m-1 text-muted">14 shares</p>');
  likeCommentSection.appendChild(likeSection);
  likeCommentSection.appendChild(commentShareInfo);
  postContainer.appendChild(likeCommentSection);

  const commentButton = createElement('div', 'dropdown-item rounded d-flex justify-content-center align-items-center pointer text-muted p-1', '<i class="fas fa-thumbs-up me-3"></i><p class="m-0">Like</p>');
  commentButton.addEventListener('click', () => toggleLike(commentButton, likeCountElement, userLikes, postId, token));
  const commentSectionButton = createElement('div', 'dropdown-item rounded d-flex justify-content-center align-items-center pointer text-muted p-1', '<i class="fas fa-comment-alt me-3"></i><p class="m-0">Comment</p>', {
      'data-bs-toggle': 'collapse',
      'data-bs-target': `#comments${commentId}`,
      'aria-expanded': 'false',
      'aria-controls': `comments${commentId}`
  });
  const buttonContainer = createElement('div', 'd-flex justify-content-around mt-2');
  buttonContainer.appendChild(commentButton);
  buttonContainer.appendChild(commentSectionButton);
  postContainer.appendChild(buttonContainer);

  postContainer.appendChild(createCommentSection(commentId));
  return postContainer;
}


function getAllPostsByTime() {
  // const loginData = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiBaseURL + "/api/posts", options)
    .then((response) => response.json())
    .then((users) => {
      // Sort users by lastcheck time in descending order
      users.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      const postsContainer = createPostsContainer();
      users.forEach((user, index) => {
        // console.log(user)
        const userName = user.username || "Unknown Name";
        const userBio = user.text;
        const userLikes = user.likes;
        const postId = user._id
        // console.log(postId)
        const updatedAt = new Date(user.createdAt).toLocaleString();
        const userAvatar = `https://picsum.photos/200/300?random=${index + 1}`; 
        const postImageSrc = `https://picsum.photos/700/300?random=${index + 1}`;
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
      document.getElementById("postContainer").appendChild(postsContainer);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

getAllPostsByTime();


function getAllPostsByLike() {
  // const loginData = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiBaseURL + "/api/posts", options)
    .then((response) => response.json())
    .then((users) => {
      // Sort users by popularity amount in descending order
      users.sort((a, b) => b.likes.length - a.likes.length);
      console.log(users)
      
      const postsContainer = createPostsContainer();
      users.forEach((user, index) => {
        // console.log(user)
        const userName = user.username || "Unknown Name";
        const userBio = user.text;
        const userLikes = user.likes;
        const postId = user._id
        // console.log(postId)
        const updatedAt = new Date(user.createdAt).toLocaleString();
        const userAvatar = `https://picsum.photos/200/300?random=${index + 1}`; 
        const postImageSrc = `https://picsum.photos/700/300?random=${index + 1}`;
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
      document.getElementById("postContainer2").appendChild(postsContainer);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}



function createPostsContainer() {
  return createElement(
    "div",
    "d-flex flex-column align-items-center col-12 col-md-6 mt-2",
    null,
    {
      style: "width: 680px; margin-top: -40px;",
    }
  );
}


function getLoggedInUsers() {
  // const loginData = getLoginData();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };
  const postUserNameHere = document.querySelector("#postUserNameHere")
  const menuUserNameHere = document.querySelector("#menuUserNameHere");
  const postMainUserName = document.querySelector("#postMainUserName");
  fetch(apiBaseURL + `/api/users/${loginData.username}`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data) 
      let loggedInUserFullName = data.fullName;
      postUserNameHere.textContent = loggedInUserFullName;
      menuUserNameHere.textContent = loggedInUserFullName;
      postMainUserName.textContent = loggedInUserFullName;
      return loggedInUserFullName;
    })
    .catch((error) => {
      console.error("Error fetching logged in user:", error);
    });
}
getLoggedInUsers();



// post request codes

const createModal = document.querySelector("#createModal");
const postContent = document.querySelector("#postContent");
const postBtn = document.querySelector("#postBtn");

postBtn.onclick = onPostBtnClicked;


function onPostBtnClicked(e) {
  e.preventDefault();
  // const loginData = getLoginData();

  let bodyData = {
    text: postContent.value
  }

  fetch(apiBaseURL + "/api/posts",  {
    method: "POST",
    body: JSON.stringify(bodyData),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${loginData.token}`
        
    }
})
.then(response => response.json())
.then(json => {
    if(json.statusCode === 409){
        console.log(json)
        createModal.innerHTML = json.message;
    } else{
      createModal.className = "text-success text-center border p-2 shadow bg-success m-1 text-white"
      createModal.innerHTML = 'You have succesfully posted to Facebook.'
        setTimeout("location.href = '/';", 2000);
    }
})
.catch(error => {
    console.error('Error adding user: ', error);
    createModal.innerHTML = 'Error creating user. Please try again.';
});
}




const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.onclick = function (e) {
  e.preventDefault();
  logout();
};

console.log(loginData.token);






//Toggle between the posts display preference
document.addEventListener('DOMContentLoaded', () => {
  const recentPostsBtn = document.getElementById('recentPostsBtn');
  const popularPostsBtn = document.getElementById('popularPostsBtn');
  const postContainer = document.getElementById('postContainer');
  const postContainer2 = document.getElementById('postContainer2');

  function toggleButtonClasses(activeBtn, inactiveBtn) {
      activeBtn.classList.add('border', 'border-info', 'border-start-1', 'rounded-end');
      inactiveBtn.classList.remove('border', 'border-info', 'border-start-1', 'rounded-end');
  }

  recentPostsBtn.addEventListener('click', () => {
      toggleButtonClasses(recentPostsBtn, popularPostsBtn);
      postContainer2.innerHTML = "";
      getAllPostsByTime(postContainer);
  });

  popularPostsBtn.addEventListener('click', () => {
      toggleButtonClasses(popularPostsBtn, recentPostsBtn);
      postContainer.innerHTML = "";
      getAllPostsByLike(postContainer);
  });
});
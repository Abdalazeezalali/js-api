    //infinite scroll
    let currentPage = 1
    let lastPage = 1
    window.addEventListener('scroll', function () {
        const end = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        if (end && currentPage <= lastPage) {
            currentPage += 1
            getPosts(currentPage + 1, false)

        }
    })
    //end scroll
    setupUi()
    const url = "https://tarmeezacademy.com/api/v1"
    getPosts()

    function getPosts(page = 1, reload = true) {
        toggleLoader(true)
        axios.get(`${url}/posts?page=${page}`)
            .then((response) => {
                toggleLoader(false)
                const posts = response.data.data
                lastPage = response.data.meta.last_page
                if (reload) {
                    document.getElementById("posts").innerHTML = ""
                }
                for (post of posts) {
                    const author = post.author
                    let postTitle = ""
                    let user = getCurrentUser()
                    let isMyPost = user != null && post.author.id == user.id
                    let buttonContent = ``
                    if (isMyPost) {
                        buttonContent = `
                        <button class="btn btn-danger ms-2" style="float:right" onclick="deletePost('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                        <button class="btn btn-secondary" style="float:right" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                        `
                    }
                    if (post.title != null) {
                        postTitle = post.title
                    }

                    let content = `
            <div class="card shadow">
                <div class="card-header">
                    <img src="${author.profile_image}" alt="img"
                        style="width: 40px;height:40px"
                        class="rounded-circle border border-2">
                    <b>${post.author.username}</b>
                    ${buttonContent}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
                    <img src="${post.image}" alt="img"
                        class="w-100" style="height: 150px;">
                    <h6 class="mt-1 " style="color:grey">
                        ${post.created_at}
                    </h6>
                    <h5>
                        ${postTitle}
                    </h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16"
                            fill="currentColor" class="bi bi-pen"
                            viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                        </svg>
                        <span>
                            ${post.comments_count}
                            <span id="post-tags-${post.id}">
                                <button class="btn btn-sm rounded-5" style="color:white;background-color:grey;">
                                    
                                </button>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            `
                    document.getElementById("posts").innerHTML += content
                    const currentIdTags = `post-tags-${post.id}`
                    document.getElementById(currentIdTags).innerHTML = ""
                    for (tag of post.tags) {
                        let tagsContent = `
                <button class="btn btn-sm rounded-5" style="color:white;background-color:grey;">
                                    ${tag.name}
                </button>
                `
                        document.getElementById(currentIdTags).innerHTML += tagsContent
                    }
                }
            })
    }

    function postClicked(id) {
        window.location = `postDetails.html?postId=${id}`
    }

    function AddBtnClicked() {
        let postId = document.getElementById("post-id-inputt").value
        let isCreate = postId == null || postId == ""
        const title = document.getElementById("add-Post").value
        const body = document.getElementById("create-Post").value
        const image = document.getElementById("add-Image").files[0]
        let formData = new FormData()
        formData.append("body", body)
        formData.append("title", title)
        formData.append("image", image)

        const token = localStorage.getItem("token")
        const headers = {
            "Content-Type": "multipart/form-data",
            "authorization": `Bearer ${token}`
        }
        toggleLoader(true)

        let baseUrl = "https://tarmeezacademy.com/api/v1"
        let url = ``
        if (isCreate) {
            url = `${baseUrl}/posts`
            axios.post(url, formData, {
                    headers: headers
                })
                .then((response) => {
                    const modal = document.getElementById("post")
                    const modalInstance = bootstrap.Modal.getInstance(modal)
                    modalInstance.hide()
                    showSuccessAlert("new post has been created", "success")
                    getPosts()
                })
                .catch((error) => {
                    const message = error.response.data.message
                    showSuccessAlert(message, "danger")
                })
                .finally(()=>
    {
        toggleLoader(false)
    })
        } else {
            formData.append("_method", "put")
            url = `${baseUrl}/posts/${postId}`
            axios.post(url, formData, {
                    headers: headers
                })
                .then((response) => {
                    const modal = document.getElementById("post")
                    const modalInstance = bootstrap.Modal.getInstance(modal)
                    modalInstance.hide()
                    showSuccessAlert("new post has been created", "success")
                    getPosts()
                })
                .catch((error) => {
                    const message = error.response.data.message
                    showSuccessAlert(message, "danger")
                })
        }

    }

    function editPost(postObj) {
        let post = JSON.parse(decodeURIComponent(postObj))
        console.log(post)
        document.getElementById("post-submit").innerHTML = "update"
        //document.getElementById("add-Image").files[0]=post.image
        document.getElementById("post-id-inputt").value = post.id
        document.getElementById("add-Post").value = post.title
        document.getElementById("create-Post").value = post.body
        document.getElementById("exampleModalLabel1").innerHTML = "edit post:"
        let postModal = new bootstrap.Modal(document.getElementById("post"), {})
        postModal.toggle()
    }

    function deletePost(postObj) {
        let post = JSON.parse(decodeURIComponent(postObj))
        console.log(post)
        document.getElementById("delete-id").value=post.id
        let postModal = new bootstrap.Modal(document.getElementById("delete"), {})
        postModal.toggle()

    }

    function confirmDelete() {
        const token=localStorage.getItem("token")
    const postId=document.getElementById("delete-id").value
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
            headers:headers
        })
            .then((response) => {
                
                const modal = document.getElementById("delete")
                const modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showSuccessAlert(" the post has been deleted successfully ", "danger")
                setupUi()
                getPosts()

            }) .catch((error) => {
                const message = error.response.data.message
                showSuccessAlert(message, "danger")
            })
    }

    function AddBtn() {

        document.getElementById("post-submit").innerHTML = "Create"
        //document.getElementById("add-Image").files[0]=post.image
        document.getElementById("post-id-inputt").value = ""
        document.getElementById("add-Post").value = ""
        document.getElementById("create-Post").value = ""
        document.getElementById("exampleModalLabel1").innerHTML = "Create a new post:"
        let postModal = new bootstrap.Modal(document.getElementById("post"), {})
        postModal.toggle()
    }
    function toggleLoader(show=true){
        if(show){
            document.getElementById("loader").style.visibility="visible"
        }
        else{
            document.getElementById("loader").style.visibility="hidden"

        }
    }
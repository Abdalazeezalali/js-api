
setupUi()
getUser()
getPosts()
function getUser(){
    const id=9157
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response)=>{
        const user=response.data.data
        document.getElementById("main-email").innerHTML=user.email
        document.getElementById("name").innerHTML=user.name
        document.getElementById("username").innerHTML=user.username
        document.getElementById("posts-count").innerHTML=user.posts_count
        document.getElementById("comments-count").innerHTML=user.comments_count
        document.getElementById("header-img").src=user.profile_image
        document.getElementById("name-posts").innerHTML=user.username
    })
}
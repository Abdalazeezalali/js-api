function setupUi() {

    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("logged-in-div")
    const logoutDiv = document.getElementById("logout-div")
    //add btn post
    const AddBtn = document.getElementById("add-btn")
    if (token == null) {
        if (AddBtn != null) {
            AddBtn.style.setProperty("display", "none", "important")
        }
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
    } else {
        if (AddBtn != null) {
            AddBtn.style.setProperty("display", "block", "important")
        }
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")
        const user = getCurrentUser()
        document.getElementById("nav-userName").innerHTML = user.username
        document.getElementById("nav-user-img").src = user.profile_image
    }
}
function LoginBtnClicked(){
    const username=document.getElementById("UserName").value
    const password=document.getElementById("Password").value
    const params={
        "username":username,
        "password":password
    }
    toggleLoader(true)
    axios.post("https://tarmeezacademy.com/api/v1/login",params)
    .then((response) => {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal=document.getElementById("exampleModal")
        const modalInstance= bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showSuccessAlert("logged in successfully","success")
        setupUi()
    }) .catch((error) => {
        const message = error.response.data.message
        showSuccessAlert(message, "danger")
    }).finally(()=>
    {
        toggleLoader(false)
    })
}
function RegisterBtnClicked(){
    const username=document.getElementById("register-UserName").value
    const password=document.getElementById("register-Password").value
    const name=document.getElementById("register-Name").value
    const image=document.getElementById("register-Image").files[0]

    let formData=new FormData()
    formData.append("name",name)
    formData.append("username",username)
    formData.append("password",password)
    formData.append("image",image)
    
    const token=localStorage.getItem("token")
    const headers={
        "Content-Type":"multipart/form-data",
    }
    
    axios.post("https://tarmeezacademy.com/api/v1/register",formData,{
    headers:headers
})
    .then((response) => {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal=document.getElementById("register")
        const modalInstance= bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showSuccessAlert("New user Registered successfully","success")
        setupUi()
    }).catch((error) => {
        showSuccessAlert(error.response.data.message,"danger")
    })
}
function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showSuccessAlert("logged out successfully","success")
    setupUi()
}
function showSuccessAlert(customMessage,type){
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            const alert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('')
            alertPlaceholder.append(wrapper)
            }
            alert(customMessage, type)
            //hide alert
            /*setTimeout(()=>{
                const alertToHide=bootstrap.Alert.getOrCreateInstance("#liveAlertPlaceholder")
                alertToHide.close()
                
            },5000)*/
}
function getCurrentUser(){
    let user=null
    const storageUser=localStorage.getItem("user")
    if(storageUser!=null){
        user =JSON.parse(storageUser)
    }
    return user
}
function toggleLoader(show=true){
    if(show){
        document.getElementById("loader").style.visibility="visible"
    }
    else{
        document.getElementById("loader").style.visibility="hidden"

    }
}
let body = document.body;

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () =>{
   sideBar.classList.toggle('active');
   body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () =>{
   sideBar.classList.remove('active');
   body.classList.remove('active');
}

document.addEventListener('click', function (e) {
   if (
      window.innerWidth < 1200 &&
      sideBar.classList.contains('active') &&
      !sideBar.contains(e.target) &&
      e.target !== menuBtn
   ) {
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
})


sideBar.onclick = (e) => {
   e.stopPropagation();
};

window.onscroll = () =>{

   if(window.innerWidth < 1200){
      sideBar.classList.remove('active');
      body.classList.remove('active');
   }
};
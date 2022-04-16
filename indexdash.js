let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".bx-menu");
  console.log(sidebarBtn);
  sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
  });

  document.querySelector(".bx-menu").addEventListener("click",function(){
    document.querySelector("col-lg-3").classList.add("openedSidebar");
    
    
  })
  
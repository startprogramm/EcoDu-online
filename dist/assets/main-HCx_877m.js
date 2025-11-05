import{g as o,s as i}from"./supabase-BgHskl7U.js";async function c(){var n;const a=await o(),e=document.getElementById("auth-nav-items");if(a&&e){e.innerHTML=`
            <a href="profile.html" class="nav-link">Profile</a>
        `;const t=document.createElement("li");t.className="nav-item",t.innerHTML='<a href="#" id="nav-logout-btn" class="nav-link">Logout</a>',e.parentElement.appendChild(t),(n=document.getElementById("nav-logout-btn"))==null||n.addEventListener("click",async s=>{s.preventDefault(),await i()&&window.location.reload()})}}c();

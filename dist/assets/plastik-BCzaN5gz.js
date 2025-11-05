import{a as m,g as d}from"./supabase-BgHskl7U.js";/* empty css                    */async function i(r,o){const n=document.getElementById(o);if(n)try{const{data:e,error:a}=await m.from("comments").select(`
                *,
                profiles (
                    name,
                    email
                )
            `).eq("lesson_id",r).order("created_at",{ascending:!1});if(a)throw a;const c=await d(),s=c==null?void 0:c.id;if(!e||e.length===0){n.innerHTML='<p class="no-comments">No comments yet. Be the first to comment!</p>';return}n.innerHTML=e.map(t=>{var l;const u=s&&t.user_id===s,f=new Date(t.created_at).toLocaleDateString(),p=((l=t.profiles)==null?void 0:l.name)||"Anonymous";return`
                <div class="comment-item" data-comment-id="${t.id}">
                    <div class="comment-header">
                        <div class="comment-author">
                            <i class="fas fa-user-circle"></i>
                            <span class="author-name">${p}</span>
                            <span class="comment-date">${f}</span>
                        </div>
                        ${u?`
                            <div class="comment-actions">
                                <button class="edit-comment-btn" data-comment-id="${t.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-comment-btn" data-comment-id="${t.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `:""}
                    </div>
                    <p class="comment-content">${t.content}</p>
                </div>
            `}).join(""),n.querySelectorAll(".delete-comment-btn").forEach(t=>{t.addEventListener("click",()=>y(t.dataset.commentId,r,o))}),n.querySelectorAll(".edit-comment-btn").forEach(t=>{t.addEventListener("click",()=>w(t.dataset.commentId,r,o))})}catch(e){console.error("Error loading comments:",e),n.innerHTML='<p class="error-message">Failed to load comments.</p>'}}async function h(r,o,n){const e=await d();if(!e)return alert("Please login to comment"),window.location.href="login.html",!1;try{const{error:a}=await m.from("comments").insert([{lesson_id:r,user_id:e.id,content:o}]);if(a)throw a;return await i(r,n),!0}catch(a){return console.error("Error adding comment:",a),alert("Failed to add comment. Please try again."),!1}}async function y(r,o,n){if(confirm("Are you sure you want to delete this comment?"))try{const{error:e}=await m.from("comments").delete().eq("id",r);if(e)throw e;await i(o,n)}catch(e){console.error("Error deleting comment:",e),alert("Failed to delete comment.")}}async function w(r,o,n){const c=document.querySelector(`[data-comment-id="${r}"]`).querySelector(".comment-content").textContent,s=prompt("Edit your comment:",c);if(!(!s||s.trim()===""||s===c))try{const{error:t}=await m.from("comments").update({content:s.trim(),updated_at:new Date().toISOString()}).eq("id",r);if(t)throw t;await i(o,n)}catch(t){console.error("Error editing comment:",t),alert("Failed to edit comment.")}}function g(r,o,n){const e=document.getElementById(r);e&&e.addEventListener("submit",async a=>{a.preventDefault();const c=e.querySelector('textarea[name="comment"]'),s=c.value.trim();if(!s){alert("Please enter a comment");return}await h(o,s,n)&&(c.value="")})}const I="plastik-ifloslanish";async function E(){const o=await(await fetch(`https://gqirrnxqonhrumqbfezl.supabase.co/rest/v1/lessons?slug=eq.${I}`,{headers:{apikey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaXJybnhxb25ocnVtcWJmZXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTMzNjksImV4cCI6MjA3NzkyOTM2OX0._xbQudNJthD9tx1Y7Ym89QZlajkI1EkE3144xnAk5xg"}})).json();if(o&&o.length>0){const n=o[0].id;await i(n,"comments-container"),g("comment-form",n,"comments-container")}}E();

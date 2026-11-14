const EXERCISES=[
 ["腕立て伏せ","15回 · 胸・腕"],
 ["スクワット","20回 · 脚"],
 ["クランチ","15回 · お腹"],
 ["グルートブリッジ","15回 · お尻・腰まわり"],
 ["プランク","30秒 · 体幹"],
 ["スーパーマン","12回 · 背中"]
];
const KEY="morning-strength-v1";
let data=JSON.parse(localStorage.getItem(KEY)||'{"days":{},"reminder":"07:00"}');
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const shift=(date,n)=>{let d=new Date(date+"T12:00:00");d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const today=todayKey();
data.days[today] ||= {checks:Array(6).fill(false),complete:false};
const current=()=>data.days[today];
function streak(){let n=0,k=today;if(!data.days[k]?.complete)k=shift(k,-1);while(data.days[k]?.complete){n++;k=shift(k,-1)}return n}
function total(){return Object.values(data.days).filter(x=>x.complete).length}
function render(){
 document.getElementById("today").textContent=new Date().toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"short"});
 document.getElementById("streak").textContent=streak();document.getElementById("total").textContent=total();
 const checks=current().checks,done=checks.filter(Boolean).length,pct=Math.round(done/6*100);
 document.getElementById("progress").textContent=pct+"%";document.getElementById("count").textContent=`${done} / 6`;
 document.getElementById("bar").style.width=pct+"%";
 document.getElementById("message").textContent=done===6?"全種目クリア！今日もよく頑張った！":done?`いい調子！あと${6-done}種目。`:"1種目ずつチェックしていこう。";
 document.getElementById("finish").disabled=done!==6||current().complete;
 document.getElementById("finish").textContent=current().complete?"今日の記録は完了済み ✓":"今日のトレーニングを完了する";
 document.getElementById("tasks").innerHTML=EXERCISES.map((e,i)=>`<label class="task ${checks[i]?"done":""}"><input type="checkbox" data-i="${i}" ${checks[i]?"checked":""}><span><span class="name">${e[0]}</span><span class="detail">${e[1]}</span></span></label>`).join("");
 document.querySelectorAll(".task input").forEach(el=>el.addEventListener("change",ev=>{current().checks[+ev.target.dataset.i]=ev.target.checked;current().complete=false;save();render()}));
 const cal=document.getElementById("calendar");cal.innerHTML=Array.from({length:14},(_,i)=>{let k=shift(today,i-13),d=new Date(k+"T12:00:00");return `<div class="day ${data.days[k]?.complete?"hit":""}"><b>${d.getDate()}</b>${["日","月","火","水","木","金","土"][d.getDay()]}${data.days[k]?.complete?" ●":""}</div>`}).join("");
 document.getElementById("reminder").value=data.reminder||"07:00";
}
document.getElementById("finish").addEventListener("click",()=>{if(current().checks.every(Boolean)){current().complete=true;save();render()}});
document.getElementById("saveReminder").addEventListener("click",()=>{data.reminder=document.getElementById("reminder").value;save();document.getElementById("reminderNote").textContent=`希望時刻 ${data.reminder} を保存しました。現在はアプリ内の設定保存のみで、閉じている間の自動通知はまだ有効ではありません。`;});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
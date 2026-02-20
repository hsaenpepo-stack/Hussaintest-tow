(function(){
  const AUTH_KEY = "HA_AUTH_OK";
  const DATA_KEY = "HA_ADMIN_TMP_SECTIONS";

  const $ = (id)=>document.getElementById(id);

  const secTitle = $("secTitle");
  const secHint = $("secHint");
  const cardTitle = $("cardTitle");
  const imgPath = $("imgPath");
  const cardDesc = $("cardDesc");
  const promptText = $("promptText");

  const preview = $("preview");
  const exportBox = $("exportBox");

  function loadData(){
    try { return JSON.parse(localStorage.getItem(DATA_KEY) || "[]"); }
    catch(e){ return []; }
  }
  function saveData(d){
    localStorage.setItem(DATA_KEY, JSON.stringify(d));
    render();
  }

  function render(){
    preview.textContent = JSON.stringify(loadData(), null, 2);
  }

  function addCard(){
    const st = (secTitle.value || "").trim();
    const sh = (secHint.value || "").trim();
    const t = (cardTitle.value || "").trim();
    const img = (imgPath.value || "").trim();
    const d = (cardDesc.value || "").trim();
    const p = (promptText.value || "").trim();

    if(!st) return alert("اكتبي اسم السكشن");
    if(!t) return alert("اكتبي عنوان الكارت");
    if(!img) return alert("اكتبي مسار الصورة");
    if(!p) return alert("الصقي البرومبت");

    const data = loadData();
    let sec = data.find(x => (x.title||"") === st);
    if(!sec){
      sec = { title: st, hint: sh, items: [] };
      data.push(sec);
    }else{
      if(sh) sec.hint = sh;
      if(!sec.items) sec.items = [];
    }

    sec.items.push({
      img,
      title: t,
      desc: d,
      promptTitle: "Prompt — " + t,
      promptText: p
    });

    saveData(data);
    alert("تمت الإضافة ✅");
  }

  function doExport(){
    const data = loadData();
    const out = "window.THUMBS_SECTIONS = " + JSON.stringify(data, null, 2) + ";\n";
    exportBox.textContent = out;
  }

  async function copyExport(){
    const t = exportBox.textContent || "";
    if(!t.trim()) return;
    try{
      await navigator.clipboard.writeText(t);
      alert("تم النسخ ✅");
    }catch(e){
      alert("انسخي يدويًا");
    }
  }

  function clearAll(){
    localStorage.removeItem(DATA_KEY);
    exportBox.textContent = "تم المسح.";
    render();
  }

  $("btnAdd").addEventListener("click", addCard);
  $("btnExport").addEventListener("click", doExport);
  $("btnCopy").addEventListener("click", copyExport);
  $("btnClear").addEventListener("click", clearAll);

  $("btnLogout").addEventListener("click", ()=>{
    sessionStorage.removeItem(AUTH_KEY);
    location.replace("login.html?next=" + encodeURIComponent("admin.html"));
  });

  render();
})();
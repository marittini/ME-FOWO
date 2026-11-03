var Ma=Object.defineProperty;var Pa=(e,r,a)=>r in e?Ma(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a;var V=(e,r,a)=>Pa(e,typeof r!="symbol"?r+"":r,a);function Nt(e){let r=e.getMonth();return r>=2&&r<=4?"spring":r>=5&&r<=7?"summer":r>=8&&r<=10?"autumn":"winter"}var $e={spring:"\uBD04",summer:"\uC5EC\uB984",autumn:"\uAC00\uC744",winter:"\uACA8\uC6B8"};function le(e,r=new Date){let a=e.content?.weatherCities?.find(w=>w.id===(e.weatherCity??"seoul")),i=e.liveWeather?.state==="ready"&&(!e.weatherCity||e.liveWeather.value.cityId===e.weatherCity)?e.liveWeather.value:null,n=a?.timeZone??i?.timeZone??"Asia/Seoul",o=new Intl.DateTimeFormat("en-CA",{timeZone:n,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(r),s=w=>o.find(v=>v.type===w).value,l=`${s("year")}-${s("month")}-${s("day")}`,p=`${l}T${s("hour")}:${s("minute")}`,d=Nt(new Date(2e3,Number(s("month"))-1,15)),m=(a?.latitude??i?.latitude??37.57)<0?{spring:"autumn",summer:"winter",autumn:"spring",winter:"summer"}[d]:d,f=i?.sunrise?.startsWith(l)&&i?.sunset?.startsWith(l)?p>=i.sunrise&&p<i.sunset:Number(s("hour"))>=6&&Number(s("hour"))<18;return{season:m,phase:f?"day":"night"}}var St="forest-workshop:font-size",de={min:12,max:22,default:16,step:1};function Le(e){return Number.isFinite(e)?Math.min(de.max,Math.max(de.min,Math.round(e))):de.default}function $t(){try{let e=localStorage.getItem(St);return e===null?de.default:Le(Number(e))}catch{return de.default}}function It(e){try{localStorage.setItem(St,String(Le(e)))}catch{}}var Ct="forest-workshop:season",Ea=["auto","spring","summer","autumn","winter"];function Rt(){try{let e=localStorage.getItem(Ct);return Ea.includes(e)?e:"auto"}catch{return"auto"}}function At(e){try{localStorage.setItem(Ct,e)}catch{}}var Mt="forest-workshop:auto-reading";function Ie(e){return{enabled:e?.enabled===!0,seconds:typeof e?.seconds=="number"&&Number.isFinite(e.seconds)?Math.max(2,Math.min(10,Math.round(e.seconds))):4}}function Pt(){try{return Ie(JSON.parse(localStorage.getItem(Mt)??"null"))}catch{return Ie(null)}}function Et(e){try{localStorage.setItem(Mt,JSON.stringify(Ie(e)))}catch{}}var Wa=["clear","cloudy","rain","snow"],je={clear:"\uB9D1\uC74C",cloudy:"\uD750\uB9BC",rain:"\uBE44",snow:"\uB208"},Wt="forest-workshop:weather-effects";function Z(e){return{enabled:e?.enabled!==!1,kind:Wa.includes(e?.kind)?e.kind:"clear"}}function Tt(){try{return Z(JSON.parse(localStorage.getItem(Wt)??"null"))}catch{return Z(null)}}function zt(e){try{localStorage.setItem(Wt,JSON.stringify(Z(e)))}catch{}}var Lt="forest-workshop:model-connections";function X(e){try{let r=JSON.parse(localStorage.getItem(Lt)??"{}")[e];return typeof r=="string"&&r.length>0&&r.length<=128?r:null}catch{return null}}function jt(e,r){try{let a={story:X("story"),profile:X("profile"),letter:X("letter")};return a[e]=r,localStorage.setItem(Lt,JSON.stringify(a)),!0}catch{return!1}}function Ot(){try{return localStorage.getItem("forest-workshop:weather-city")??"seoul"}catch{return"seoul"}}function Vt(e){try{localStorage.setItem("forest-workshop:weather-city",e)}catch{}}var we=globalThis.__MARINARA_HOST__;if(!we||we.version!==1||!we.queryClient)throw new Error("Marinara Engine does not provide its query client; this package needs capability API 1.341 or newer.");var On=we.queryClient;function Dt(){let e=we.api;if(!e?.api)throw new Error("\uC774 Marinara Engine\uC740 \uD328\uD0A4\uC9C0 API \uD074\uB77C\uC774\uC5B8\uD2B8\uB97C \uC81C\uACF5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");return e}function z(){return Dt().api}function G(e,r){try{let a=e.payload;return typeof a?.message=="string"&&a.message?a.message:Dt().getApiErrorMessage(e,r)}catch{return e instanceof Error&&e.message?e.message:r}}function ye(e){let r=e.payload;return typeof r?.error=="string"?r.error:null}function Oe(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`}function ie(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let r=[...e].map(a=>a.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var q="/forest-workshop",j={getWeather:e=>z().get(`${q}/weather?city=${encodeURIComponent(e)}`),listWorlds:()=>z().get(`${q}/worlds`),createWorld:e=>z().post(`${q}/worlds`,e),getState:e=>z().get(`${q}/state?worldId=${encodeURIComponent(e)}`),prepareStory:(e,r)=>z().post(`${q}/stories/prepare`,{worldId:e,pairId:r,connectionId:X("story"),profileConnectionId:X("profile")}),getStoryOverview:e=>z().get(`${q}/stories?worldId=${encodeURIComponent(e)}`),getStory:(e,r)=>z().get(`${q}/stories/${encodeURIComponent(r)}?worldId=${encodeURIComponent(e)}`),generateStory:(e,r,a)=>z().post(`${q}/stories/generate`,{worldId:e,pairId:r,episode:a,connectionId:X("story"),profileConnectionId:X("profile")}),generateResidentLetter:(e,r)=>z().post(`${q}/mail/generate`,{worldId:e,activityId:r,connectionId:X("letter"),profileConnectionId:X("profile")}),getDeliveries:e=>z().get(`${q}/deliveries?worldId=${encodeURIComponent(e)}`),heartbeat:e=>z().post(`${q}/heartbeat`,{worldId:e}),sendCommand:e=>z().post(`${q}/commands`,e),getStorage:e=>z().get(`${q}/storage?worldId=${encodeURIComponent(e)}`),getBackup:e=>z().get(`${q}/backup?worldId=${encodeURIComponent(e)}`),listSources:e=>z().get(`${q}/sources?worldId=${encodeURIComponent(e)}`),previewSource:(e,r,a)=>z().get(`${q}/sources/preview?worldId=${encodeURIComponent(e)}&kind=${r}&id=${encodeURIComponent(a)}`),prepareProfile:(e,r)=>z().post(`${q}/residents/prepare`,{worldId:e,residentId:r,profileConnectionId:X("profile")}),rebuildSuggestion:(e,r)=>z().post(`${q}/rebuild-suggestion`,{worldId:e,source:r,connectionId:X("profile")}),uploadResidentImage:e=>{let r=new FormData;return r.append("worldId",e.worldId),r.append("residentId",e.residentId),r.append("uploadKey",e.uploadKey),r.append("file",e.file,e.file.name),z().upload(`${q}/residents/image`,r)},restore:(e,r)=>z().post(`${q}/restore`,{newWorldId:e,backup:r})};function Bt(e){let r=0,a=0,i=!1;async function n(o=!1){if(!o&&(i||Date.now()-r<15*6e4||typeof document<"u"&&document.hidden))return;let s=++a,l=e.store.get().weatherCity??"seoul";i=!0,r=Date.now(),e.store.get().liveWeather?.state!=="ready"&&e.store.set({liveWeather:{state:"loading"}});try{let p=await j.getWeather(l);if(s!==a||l!==(e.store.get().weatherCity??"seoul"))return;let d=Z(e.store.get().weatherEffects);e.store.set({liveWeather:{state:"ready",value:p},weatherError:null,weatherEffects:{...d,kind:p.kind}})}catch(p){if(s!==a)return;let d=G(p,"\uD604\uC7AC \uB0A0\uC528\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.");e.store.set({weatherError:d,...e.store.get().liveWeather?.state==="ready"?{}:{liveWeather:{state:"error",message:d}}})}finally{s===a&&(i=!1)}}return{refreshWeather:n,setWeatherCity(o){e.store.get().content?.weatherCities?.some(s=>s.id===o)&&(Vt(o),e.store.set({weatherCity:o,liveWeather:{state:"loading"},weatherError:null}),n(!0))}}}var Ce;function Ft(){return Ce||(Ce=(async()=>{if(typeof FontFace>"u"||!document.fonts)return;let e=await z().get("/capability-packages/forest-workshop/assets/assets/fonts/jua.json");if(e.family!=="Jua"||!e.data.startsWith("data:font/ttf;base64,"))throw new Error("Invalid game font");let r=await new FontFace("Jua",`url(${e.data})`,{weight:"400"}).load();document.fonts.add(r)})().catch(()=>{Ce=void 0}),Ce)}var Gt="\uC232\uACB0 \uACF5\uBC29 \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4. \uC124\uC815 \u2192 \uC800\uC7A5\xB7\uBC31\uC5C5\uC5D0\uC11C \uB0B4\uBCF4\uB0B8 JSON \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.";function qt(e,r){return!e||typeof e!="object"||Array.isArray(e)?0:Object.values(e).filter(r).length}function _t(e){let r=e;if(!r||r.format!=="forest-workshop-backup"||!r.world)return{ok:!1,message:Gt};let{settings:a,wallet:i,inventory:n}=r.world;if(typeof a?.worldName!="string"||typeof a.playerNickname!="string")return{ok:!1,message:Gt};let o=n&&typeof n=="object"?Object.values(n).filter(s=>typeof s=="number"&&s>0):[];return{ok:!0,summary:{worldName:a.worldName,playerNickname:a.playerNickname,gold:typeof i?.gold=="number"?i.gold:0,itemKinds:o.length,itemTotal:o.reduce((s,l)=>s+l,0),exportedAt:typeof r.exportedAt=="string"?r.exportedAt:"",residents:qt(r.world.residents,()=>!0),pairs:qt(r.world.pairs,s=>!s.archived),pictures:Array.isArray(r.assets)?r.assets.length:0}}}var Ht={};function et(e){return e in Ht}function Kt(e){let r=Ht[e];return r?`${r.label} \uAE30\uB2A5\uC740 \uC544\uC9C1 \uC900\uBE44 \uC911\uC774\uC5D0\uC694.`:""}var Ta="forest-workshop",za=`/api/capability-packages/${Ta}/assets/assets/`,Yt=["spring","summer","autumn","winter"],La=new Set(["wild-berry","herb","wood","pinecone","acorn","wheat","flower","pumpkin","cotton","tea-leaf","honey","mushroom","beeswax","feather","clover","berry-jam","dried-herb","flour","plank","thread","herb-tea","pumpkin-puree","acorn-flour","herb-sachet","berry-pie","wooden-tray","beeswax-candle","knit-scarf","flower-wreath","pumpkin-soup","honey-cake","birdhouse","acorn-cookie","tea-gift","apple","reed","carrot","flax","clay","salt","dried-apple","apple-jam","linen","reed-cord","prepared-clay","herb-salt","apple-bread","carrot-potage","mushroom-skewer","linen-handkerchief","herb-pillow","reed-basket","wooden-spoon","desk-organizer","clay-planter","wind-chime","apple-gift","picnic-wrap"]),Jt={"gather-yard":"facilities/gather-yard.webp","grow-plot":"facilities/grow-plot.webp","survey-desk":"facilities/survey-desk.webp","process-bench":"facilities/process-bench.webp","craft-bench":"facilities/craft-bench.webp"},Re={spring:{base:"backgrounds/workshop-base-spring.webp",scene:"backgrounds/workshop-scene-spring.webp"},summer:{base:"backgrounds/workshop-base-summer.webp",scene:"backgrounds/workshop-scene-summer.webp"},autumn:{base:"backgrounds/workshop-base-autumn.webp",scene:"backgrounds/workshop-scene-autumn.webp"},winter:{base:"backgrounds/workshop-base-winter.webp",scene:"backgrounds/workshop-scene-winter.webp"}},De={"forest-clearing":"backgrounds/story-forest-clearing.webp","river-bridge":"backgrounds/story-river-bridge.webp","herb-garden":"backgrounds/story-herb-garden.webp",workshop:"backgrounds/workshop-interior.webp"},Ae={joy:"emotions/joy.webp",affection:"emotions/affection.webp",curiosity:"emotions/curiosity.webp",fluster:"emotions/fluster.webp",inspiration:"emotions/inspiration.webp",annoyance:"emotions/annoyance.webp"},ve={home:"ui/nav-home.webp",work:"ui/nav-work.webp",explore:"ui/nav-explore.webp",residents:"ui/nav-residents.webp",invite:"ui/nav-invite.webp"},fe={portrait:"ui/manage-portrait.webp",guidelines:"ui/manage-guidelines.webp",memory:"ui/manage-memory.webp",backup:"ui/manage-backup.webp"},Be={sun:"ui/weather-sun.webp",cloud:"ui/weather-cloud.webp",rain:"ui/weather-rain.webp",snow:"ui/weather-snow.webp"},F={gift:"ui/gift.webp",letterPaper:"ui/letter-paper.webp",storyVignette:"ui/story-vignette.webp",inviteScene:"ui/invite-scene.webp",trail:"backgrounds/forest-trail.webp",interior:"backgrounds/workshop-interior.webp",titleSign:"ui/title-sign.webp",primaryButton:"ui/primary-button.webp",paperPanel:"ui/paper-panel.webp",woodPanel:"ui/wood-panel.webp",deliveryBoard:"ui/delivery-board.webp"};function tt(e){return`${za}${e}`}function Xt(e){return La.has(e)?`items/${e}.webp`:null}var Ve=new Set;function E(e,r){if(!e||Ve.has(e))return r.fallback();let a=document.createElement("img");return a.className=r.className,a.alt=r.alt??"",a.decoding="async",a.draggable=!1,r.lazy&&(a.loading="lazy"),a.addEventListener("error",()=>{Ve.add(e),a.replaceWith(r.fallback())},{once:!0}),a.src=tt(e),a}function he(e){return`url("${tt(e)}")`}var Ut=new Map;function Qt(e){let r=Ut.get(e);return r||(r=new Promise(a=>{if(Ve.has(e))return a(!1);let i=new Image;i.decoding="async",i.onload=()=>a(!0),i.onerror=()=>{Ve.add(e),a(!1)},i.src=tt(e)}),Ut.set(e,r)),r}function rt(e){return[{path:Re[e].base,flag:"art-base"},{path:F.titleSign,flag:"art-sign"},{path:F.primaryButton,flag:"art-button"},{path:F.paperPanel,flag:"art-paper"}]}function Zt(e){let r=e,a=new Set;return{get:()=>r,set(i){let n=typeof i=="function"?i(r):i;r={...r,...n};for(let o of a)o(r)},remember(i){let n=typeof i=="function"?i(r):i;r={...r,...n}},subscribe(i){return a.add(i),()=>a.delete(i)}}}var Fe=class{constructor(){V(this,"epoch",0)}beginNavigation(){return this.epoch+=1,this.epoch}isCurrentNavigation(r){return r===this.epoch}acceptsUpdate(r,a){return!r||r.worldId!==a.worldId?!1:a.revision>=r.revision}};function er(e){let r=0,{store:a}=e;function i(l){a.set(p=>p.register?{register:{...p.register,...l}}:{})}function n(){let l=a.get().register?.pendingImage;l&&URL.revokeObjectURL(l.previewUrl)}async function o(){let l=e.currentWorld();if(l){i({sources:{state:"loading"}});try{let{sources:p}=await j.listSources(l.worldId);i({sources:{state:"ready",value:p}})}catch(p){i({sources:{state:"error",message:G(p,"\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}}}async function s(l){let p=e.currentWorld(),d=a.get().register,c=d?.selected;if(!p||!c)return;let m=d.draft,u=`rebuild-suggestion:${l}`;i({generationKey:u});let f=await e.track(u,()=>j.rebuildSuggestion(p.worldId,{kind:c.kind,id:c.id}),"\uACF5\uBC29 \uD504\uB85C\uD544\uC744 \uC900\uBE44\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC5F0\uACB0 \uC124\uC815\uC744 \uD655\uC778\uD55C \uB4A4 \uB2E4\uC2DC \uC900\uBE44\uD574 \uC8FC\uC138\uC694."),w=a.get().register;f&&l===r&&e.currentWorld()?.worldId===p.worldId&&w?.selected?.kind===c.kind&&w.selected.id===c.id&&w.draft===m&&i({draft:f.suggestion})}return{openRegister(l=1){r+=1,n(),a.set({register:{step:l,kindTab:"character",query:"",sources:{state:"loading"},selected:null,preview:null,draft:"",pendingImage:null,starterChoice:null}}),e.navigate("register"),l===1&&o()},closeRegister(){r+=1,n(),a.set({register:null}),e.navigate("residents")},loadSources:o,setRegisterKind:l=>i({kindTab:l,sourcePage:0}),setRegisterQuery:l=>i({query:l,sourcePage:0}),setRegisterSourcePage:l=>i({sourcePage:Math.max(0,l)}),setRegisterStarterPage:l=>i({starterPage:Math.max(0,l)}),backToSources:()=>{r+=1,i({step:1})},setRegisterPanel:l=>i({panel:l}),setDraft:l=>a.remember(p=>p.register?{register:{...p.register,draft:l}}:{}),setStarterChoice:l=>i({starterChoice:l}),async chooseSource(l){let p=e.currentWorld();if(!p)return;let d=++r;i({step:2,panel:"setting",selected:l,preview:{state:"loading"},draft:""});try{let c=await j.previewSource(p.worldId,l.kind,l.id);if(d!==r||e.currentWorld()?.worldId!==p.worldId)return;i({preview:{state:"ready",value:c}}),await s(d)}catch(c){d===r&&e.currentWorld()?.worldId===p.worldId&&i({preview:{state:"error",message:G(c,"\uC790\uB8CC\uB97C \uC77D\uC9C0 \uBABB\uD588\uC5B4\uC694.")}})}},suggestSetting:()=>s(r),pickPendingImage(l){n(),i({pendingImage:{file:l,previewUrl:URL.createObjectURL(l)}})},clearPendingImage(){n(),i({pendingImage:null})},async confirmRegister(l,p){let d=a.get().register,c=d?.selected;if(!d||!c||!d.draft.trim())return;let m=`register:${c.kind}:${c.id}`,u=e.requestIdFor(`${m}:id`,m,ie);if(!await e.runCommand(m,"residents.register",{residentId:u,source:{kind:c.kind,id:c.id},worldSetting:d.draft}))return;e.forgetRequest(`${m}:id`);let w=l?d.pendingImage:null;w&&await p(u,w.file),n();let v=e.currentWorld();if(v&&v.state.progress.starterResidentId===null){i({step:3,starterChoice:u,pendingImage:null,selected:null,preview:null,draft:""});return}a.set(k=>({register:null,residentsView:{...k.residentsView,selectedId:u}})),e.navigate("residents"),e.notify(`\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD588\uC5B4\uC694 \xB7 ${c.name}`)},async confirmStarter(){let l=a.get().register?.starterChoice;!l||!await e.runCommand("choose-starter","residents.chooseStarter",{residentId:l})||(a.set({register:null}),e.navigate("home"),e.notify("\uC2DC\uC791 \uC8FC\uBBFC\uC774 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694."))},registerAnother(){i({step:1,query:""}),o()}}}var ja=6e4;function tr(e){return e.map((r,a)=>({rule:r,index:a})).sort((r,a)=>r.rule.priority-a.rule.priority||r.index-a.index).map(({rule:r})=>r)}function Oa(e){return e.map((r,a)=>({...r,priority:Math.min(5,a+1)}))}function at(e,r,a){return e.work.drafts[a]??tr(r.facilities[a]?.rules??[])}function rr(e,r,a){let i=e.work.drafts[a];return!!i&&JSON.stringify(i)!==JSON.stringify(tr(r.facilities[a]?.rules??[]))}function Ge(e){let{activity:r,simMs:a,...i}=e.production;return JSON.stringify([e.inventory,e.wallet,i,r.lastAbsence,e.activities,e.stories,e.mailbox])}function ar(e){let{store:r}=e,a,i=!1;function n(){return r.get().content}function o(d){r.set(c=>({work:{...c.work,...d}}))}function s(d,c){let m=e.currentWorld();if(!m)return;let u=at(r.get(),m.state.production,d);o({drafts:{...r.get().work.drafts,[d]:c(u.map(f=>({...f})))}})}async function l(){let d=e.currentWorld();if(!(!d||i)&&!(typeof document<"u"&&(document.visibilityState!=="visible"||!document.hasFocus()))){i=!0;try{let c=await j.heartbeat(d.worldId),m=e.currentWorld();if(!m||m.worldId!==c.worldId)return;Ge(m.state)===Ge(c.state)?e.rememberWorld(c):e.showWorld(c)}catch{}finally{i=!1}}}async function p(){let d=e.currentWorld();if(d)try{let c=await j.getState(d.worldId),m=e.currentWorld();if(!m||m.worldId!==c.worldId)return;Ge(m.state)===Ge(c.state)?e.rememberWorld(c):e.showWorld(c)}catch{}}return{heartbeat:l,refreshProduction:p,startHeartbeat(){clearInterval(a),a=setInterval(()=>{l()},ja),l()},stopHeartbeat(){clearInterval(a),a=void 0},selectFacility(d){o({facilityId:d,section:"status",queueView:void 0,queuePage:0,priorityPage:0})},setWorkSection(d){o({section:d})},setInventoryPage(d){o({inventoryPage:Math.max(0,d)})},setQueueView(d){o({queueView:d})},setQueuePage(d){o({queuePage:Math.max(0,d)})},setPriorityPage(d){o({priorityPage:Math.max(0,d)})},rememberQueueCount(d,c){r.remember(m=>({work:{...m.work,queueCounts:{...m.work.queueCounts,[d]:c}}}))},rememberAutoSellPage(d){r.remember(c=>c.sheet?.kind==="auto-sell"?{sheet:{...c.sheet,page:d}}:{})},rememberProtection(d){r.remember(c=>{if(c.sheet?.kind!=="protect-edit")return{};let m={...c.sheet.drafts};return d.itemId!==void 0&&d.amount!==void 0&&(m[d.itemId]=d.amount),{sheet:{...c.sheet,page:d.page??c.sheet.page,drafts:m}}})},selectRule(d,c){o({selected:{...r.get().work.selected,[d]:c}})},changeTarget(d,c,m){let u=n()?.production.targetStock??{min:1,max:999};s(d,f=>f.map(w=>w.policyId===c?{...w,targetStock:Math.min(u.max,Math.max(u.min,w.targetStock+m))}:w))},toggleRule(d,c){s(d,m=>m.map(u=>u.policyId===c?{...u,enabled:!u.enabled}:u))},moveRule(d,c,m){s(d,u=>{let f=u.findIndex(k=>k.policyId===c),w=f+m;if(f<0||w<0||w>=u.length)return u;let v=[...u];return[v[f],v[w]]=[v[w],v[f]],Oa(v)})},recommendRules(d){let c=e.currentWorld(),m=n()?.production.recommendedRules[d]??[];if(!c)return;let u=c.state.production.facilities[d]?.rules??[],f=m.map(k=>({policyId:u.find(h=>h.recipeId===k.recipeId)?.policyId??ie(),enabled:!0,recipeId:k.recipeId,targetStock:k.targetStock,priority:k.priority})),w=new Set(f.map(k=>k.recipeId)),v=[...f,...u.filter(k=>!w.has(k.recipeId)).map(k=>({...k,enabled:!1}))];o({drafts:{...r.get().work.drafts,[d]:v}}),e.notify("\uCD94\uCC9C \uC124\uC815\uC744 \uBD88\uB7EC\uC654\uC5B4\uC694. \uD655\uC778\uD55C \uB4A4 '\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9'\uC744 \uB204\uB974\uBA74 \uBC14\uB00C\uC5B4\uC694.")},discardDraft(d){let c={...r.get().work.drafts};delete c[d],o({drafts:c})},async applyRules(d){let c=r.get().work.drafts[d];if(!c||!await e.runCommand(`rules:${d}`,"production.setRules",{facilityId:d,rules:c}))return;let u={...r.get().work.drafts};delete u[d],o({drafts:u}),e.notify("\uC6B4\uC601 \uADDC\uCE59\uC744 \uC801\uC6A9\uD588\uC5B4\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uADF8\uB300\uB85C \uC774\uC5B4\uC9C0\uACE0 \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBC14\uB00C\uC5B4\uC694.")},async upgradeFacility(d,c){let m=await e.runCommand(`upgrade:${d}:${c}`,"production.upgradeFacility",{facilityId:d,fromLevel:c});m&&e.notify(`Lv. ${String(m.result.level)}\uB85C \uAC15\uD654\uD588\uC5B4\uC694. \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uBE68\uB77C\uC838\uC694.`)},async setProtected(d,c){await e.runCommand(`protect:${d}`,"production.setProtected",{itemId:d,amount:c})&&r.remember(u=>{if(u.sheet?.kind!=="protect-edit"||u.sheet.drafts?.[d]!==c)return{};let f={...u.sheet.drafts};return delete f[d],{sheet:{...u.sheet,drafts:f}}})},async sell(d,c){let m=await e.runCommand(`sell:${d}`,"economy.sell",{itemId:d,amount:c});m&&(r.set({sheet:null}),e.notify(`${c}\uAC1C\uB97C \uD314\uC544 ${String(m.result.gold)} G\uB97C \uBC1B\uC558\uC5B4\uC694.`))},async unlockFacility(d){let c=await e.runCommand(`unlock:${d}`,"production.unlockFacility",{facilityId:d});c&&!c.result.alreadyOpen&&e.notify("\uC2DC\uC124\uC774 \uC5F4\uB838\uC5B4\uC694. \uCD94\uCC9C \uADDC\uCE59\uC73C\uB85C \uBC14\uB85C \uC77C\uC744 \uC2DC\uC791\uD574\uC694.")},async setMode(d,c){(await e.runCommand(`mode:${d}`,"production.setMode",{facilityId:d,mode:c}))?.result.running&&e.notify("\uC9C0\uAE08 \uC791\uC5C5\uC774 \uB05D\uB098\uBA74 \uBC14\uB010 \uBC29\uC2DD\uC73C\uB85C \uC774\uC5B4\uC838\uC694.")},selectQueueRecipe(d,c){o({queueRecipe:{...r.get().work.queueRecipe,[d]:c}})},async addQueue(d,c,m){let u=`queue-entry:${d}`,f=e.requestIdFor(u,JSON.stringify([c,m]),ie);await e.runCommand(`queue:${d}`,"production.queueAdd",{facilityId:d,entryId:f,recipeId:c,count:m})&&e.forgetRequest(u)},async removeQueue(d,c){await e.runCommand(`queue-remove:${c}`,"production.queueRemove",{facilityId:d,entryId:c})},async assignResident(d,c){await e.runCommand(`assign:${d}`,"production.assignResident",{facilityId:d,residentId:c})&&(r.set({sheet:null}),e.notify(c?"\uC8FC\uBBFC\uC744 \uBC30\uCE58\uD588\uC5B4\uC694. \uBD84\uC57C\uAC00 \uB9DE\uC73C\uBA74 \uB2E4\uC74C \uC791\uC5C5\uBD80\uD130 \uD6A8\uACFC\uAC00 \uC801\uC6A9\uB3FC\uC694.":"\uC8FC\uBBFC \uBC30\uCE58\uB97C \uD574\uC81C\uD588\uC5B4\uC694."))},async setAutoSell(d,c){await e.runCommand(`auto-sell:${d}`,"economy.setAutoSell",{itemId:d,setting:c})&&e.notify(c.enabled?"\uC790\uB3D9 \uD310\uB9E4 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.":"\uC790\uB3D9 \uD310\uB9E4\uB97C \uAED0\uC5B4\uC694.")},async readReports(d){await e.runCommand("reports-read","production.markReportsRead",{throughReportId:d})&&r.set({sheet:null})}}}function it(e,r){let a=r.query.trim().toLowerCase();return Object.values(e.residents).filter(i=>r.tab==="all"||i.kind===r.tab).filter(i=>r.filter==="all"?!0:r.filter==="recruited"?i.recruited:!i.recruited).filter(i=>!a||i.displayName.toLowerCase().includes(a)||i.source.name.toLowerCase().includes(a)).sort((i,n)=>Number(n.recruited)-Number(i.recruited)||i.registeredAt.localeCompare(n.registeredAt))}function nt(e,r){return`pair-add:${[e,r].sort().join(":")}`}function ot(e,r){return e.residentIds[0]===r?e.residentIds[1]:e.residentIds[0]}function ir(e){let{store:r}=e;function a(d){let c=e.currentWorld();return c&&d?c.state.residents[d]??null:null}function i(d){r.set(c=>({residentsView:{...c.residentsView,...d}}))}let n=new Set,o=new Map;async function s(d,c=!1){let m=e.currentWorld();if(!m)return null;let u=`${m.worldId}:${d}`,f=`resident-${d}`,w=o.get(u);w||(w=(async()=>{if(e.currentWorld()?.state.mailbox.letters.some(h=>h.id===f))return f;let k=await e.track(`letter:${d}`,()=>j.generateResidentLetter(m.worldId,d),"\uD3B8\uC9C0\uB97C \uC900\uBE44\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uD65C\uB3D9 \uACB0\uACFC\uB294 \uBCF4\uAD00\uB418\uC5B4 \uC788\uC5B4\uC694. \uD3B8\uC9C0\uB97C \uB2E4\uC2DC \uC5F4\uC5B4 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");return!k||e.currentWorld()?.worldId!==m.worldId?null:(e.showWorld({worldId:m.worldId,revision:k.revision,updatedAt:new Date().toISOString(),state:k.state}),String(k.result.id))})().finally(()=>o.delete(u)),o.set(u,w));let v=await w;return c&&v&&e.currentWorld()?.worldId===m.worldId&&await l(v),v}async function l(d){let c=e.currentWorld()?.state.mailbox.letters.find(u=>u.id===d);if(!c)return;(c.readAt||await e.runCommand(`mail:${d}`,"mail.read",{id:d}))&&r.set(u=>u.sheet?.kind==="mailbox"?{sheet:{...u.sheet,archived:c.archived,id:d}}:{})}async function p(d){let c=e.currentWorld();if(!c)return;let m=c.state.activities?.completed?.find(u=>u.mailId===d);if(m){r.set({sheet:{kind:"mailbox",id:d}});let u=await s(m.id);if(e.currentWorld()?.worldId!==c.worldId)return;let f=r.get().sheet;u&&f?.kind==="mailbox"&&f.id===d&&await l(u);return}await l(d)}return{openGuidelines(d){r.set({sheet:{kind:"guidelines",pairId:d}})},rememberGuidelines(d){r.remember(c=>c.sheet?.kind==="guidelines"?{sheet:{...c.sheet,draft:{...d}}}:{})},async saveGuidelines(d,c){await e.runCommand(`guidelines:${d??"world"}`,"guidelines.update",{...d?{pairId:d}:{},...c})&&(r.set(u=>u.sheet?.kind==="guidelines"&&u.sheet.pairId===d&&JSON.stringify(u.sheet.draft)===JSON.stringify(c)?{sheet:{...u.sheet,draft:void 0}}:{}),e.notify("AI \uC9C0\uCE68\uC744 \uC800\uC7A5\uD588\uC5B4\uC694. \uB2E4\uC74C\uC5D0 \uC0C8\uB85C \uC4F0\uB294 \uC774\uC57C\uAE30\uBD80\uD130 \uC801\uC6A9\uB3FC\uC694."))},openMailbox(){r.set({sheet:{kind:"mailbox"}})},async openActivityLetter(d){let c=e.currentWorld()?.state.mailbox.letters.find(m=>m.id===d);if(!c){r.set({sheet:{kind:"mailbox"}}),e.notify("\uACB0\uACFC \uD3B8\uC9C0\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694. \uC6B0\uD3B8\uD568\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.");return}r.set({sheet:{kind:"mailbox",archived:c.archived}}),await p(d)},setMailboxView(d){r.set(c=>c.sheet?.kind==="mailbox"?{sheet:{...c.sheet,...d}}:{})},openLetter:p,generateResidentLetter:d=>s(d,!0),prepareLatestLetter(){let d=e.currentWorld(),c=d?.state.activities?.completed?.[0];if(!d||!c||d.state.mailbox.letters.some(u=>u.id===`resident-${c.id}`))return;let m=`${d.worldId}:${c.id}`;n.has(m)||(n.add(m),s(c.id))},async archiveLetter(d,c){await e.runCommand(`mail:${d}`,"mail.archive",{id:d,archived:c})&&r.set(u=>u.sheet?.kind==="mailbox"?{sheet:{...u.sheet,id:void 0}}:{})},openMemory(d){r.set({sheet:{kind:"memory",pairId:d,page:0}})},updateMemoryView(d){r.set(c=>c.sheet?.kind==="memory"?{sheet:{...c.sheet,...d}}:{})},rememberMemoryDraft(d){r.remember(c=>c.sheet?.kind==="memory"?{sheet:{...c.sheet,draft:d}}:{})},async correctMemory(d,c){let m=await e.runCommand(`memory:${d}`,"memory.correct",{factId:d,text:c});m&&(r.set(u=>u.sheet?.kind==="memory"?{sheet:{...u.sheet,factId:Number(m.result.factId),draft:void 0}}:{}),e.notify("\uAE30\uC5B5\uC744 \uC815\uC815\uD588\uC5B4\uC694. \uC6D0\uBB38\uC740 \uC774\uB825\uC5D0 \uB0A8\uC544\uC694."))},async setMemoryStatus(d,c){await e.runCommand(`memory:${d}`,"memory.setStatus",{factId:d,active:c})},setResidentsTab:d=>i({tab:d,page:0}),setResidentsQuery:d=>i({query:d,page:0}),setResidentsFilter:d=>i({filter:d,page:0}),setResidentsPage:d=>i({page:Math.max(0,d)}),showResidentsList:()=>i({detailOpen:!1}),selectResident:d=>i({selectedId:d}),openResidents(d){if(d){let c={...r.get().residentsView,tab:"all",query:"",filter:"all",selectedId:d,detailOpen:!1},m=e.currentWorld(),u=m?it(m.state,c).findIndex(f=>f.residentId===d):0;i({...c,page:Math.max(0,Math.floor(u/2))})}else i({detailOpen:!1});e.navigate("residents")},openRelations(d){r.set({focusResidentId:d}),e.navigate("relations")},openResidentImage(d){let c=a(d);r.set({focusResidentId:d,placementDraft:c?{...c.image.placement}:null}),e.navigate("resident-image")},openSheet(d){if(r.set({sheet:d,notice:null}),d.kind==="profile"){let c=e.currentWorld(),m=c?.state.residents[d.residentId];c&&m&&(m.profileVersion??0)<2&&e.track(`profile:${m.residentId}`,()=>j.prepareProfile(c.worldId,m.residentId),"\uD504\uB85C\uD544\uC744 \uC900\uBE44\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694.").then(u=>{u&&e.showWorld(u)})}},closeSheet(){r.set({sheet:null})},rememberProfile(d){r.remember(c=>c.sheet?.kind==="profile"?{sheet:{...c.sheet,...d}}:{})},toggleRelationsEditing(){r.set(d=>({relationsEditing:!d.relationsEditing}))},async updateWorldSetting(d,c){let m=await e.runCommand(`resident-setting:${d}`,"residents.update",{residentId:d,worldSetting:c});return m&&(r.remember(u=>u.sheet?.kind==="profile"?{sheet:{...u.sheet,draft:void 0}}:{}),e.notify("\uACF5\uBC29 \uC138\uACC4 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.")),m},async addPair(d,c){let m=a(d),u=a(c);if(!m||!u)return;let f=nt(m.residentId,u.residentId),w=e.requestIdFor(`${f}:id`,f,ie);await e.runCommand(f,"pairs.add",{pairId:w,residentIds:[m.residentId,u.residentId]})&&(e.forgetRequest(`${f}:id`),r.set({sheet:null}),e.notify(`${m.displayName} \xD7 ${u.displayName} \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5C8\uC5B4\uC694.`))},archivePair:d=>e.runCommand(`pair-archive:${d}`,"pairs.archive",{pairId:d}),restorePair:d=>e.runCommand(`pair-restore:${d}`,"pairs.restore",{pairId:d}),setPlacementDraft(d){r.set(c=>c.placementDraft?{placementDraft:{...c.placementDraft,...d}}:{})},resetPlacementDraft(){let d=r.get().content?.residents.placement;d&&r.set({placementDraft:{scale:d.scale.default,offsetX:d.offsetX.default,markerHeight:d.markerHeight.default}})},async applyPlacement(d){let c=r.get().placementDraft;if(!c)return;await e.runCommand(`placement:${d}`,"residents.setPlacement",{residentId:d,placement:c})&&e.notify("\uBC30\uCE58\uB97C \uC801\uC6A9\uD588\uC5B4\uC694. \uADF8\uB9BC \uD30C\uC77C\uC740 \uADF8\uB300\uB85C\uC608\uC694.")},async uploadResidentImage(d,c){let m=e.currentWorld();if(!m)return null;let u=`image-upload:${d}`,f=e.requestIdFor(u,`${d}:${c.name}:${c.size}:${c.lastModified}`),w=await e.track(u,()=>j.uploadResidentImage({worldId:m.worldId,residentId:d,uploadKey:f,file:c}),"\uADF8\uB9BC\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC608\uC694.");if(!w)return null;let v=e.currentWorld()??m;return e.showWorld({worldId:v.worldId,revision:w.revision,updatedAt:new Date().toISOString(),state:w.state}),e.notify(w.duplicate?"\uC774\uBBF8 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774\uC5D0\uC694.":"\uADF8\uB9BC\uC744 WebP\uB85C \uC800\uC7A5\uD588\uC5B4\uC694."),w},async restoreResidentImage(d,c){await e.runCommand(`image-restore:${d}`,"residents.restoreImage",{residentId:d,reference:c})&&(r.set({sheet:null}),e.notify("\uC774\uC804 \uADF8\uB9BC\uC73C\uB85C \uB418\uB3CC\uB838\uC5B4\uC694."))},async clearImageHistory(){let d=await e.runCommand("image-history-clear","residents.clearImageHistory",{});if(!d)return;r.set({sheet:null});let c=Array.isArray(d.result.released)?d.result.released.length:0;e.notify(c?`\uC774\uC804 \uADF8\uB9BC ${c}\uC7A5\uC744 \uC815\uB9AC\uD588\uC5B4\uC694.`:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."),await e.refreshStorage()}}}function nr(e){let{store:r}=e,a=0;async function i(){let n=e.currentWorld();if(!n)return;let o=++a;r.set({deliveries:{state:"loading"}});try{let s=await j.getDeliveries(n.worldId);o===a&&e.currentWorld()?.worldId===n.worldId&&r.set({deliveries:{state:"ready",value:s}})}catch(s){o===a&&e.currentWorld()?.worldId===n.worldId&&r.set({deliveries:{state:"error",message:G(s,"\uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}return{setInviteTab(n){r.set({inviteTab:n,invitePage:0})},setInvitePage(n){r.set({invitePage:Math.max(0,n)})},setInviteSheetPage(n){r.set(o=>{let s=o.sheet;return!s||s.kind!=="invite-result"&&s.kind!=="invite-chances"&&s.kind!=="invite-log"&&s.kind!=="invite-wish"?{}:{sheet:{...s,page:Math.max(0,n)}}})},async draw(n){let o=await e.runCommand(`invite:${n}`,"invite.draw",{count:n});o&&r.set({sheet:{kind:"invite-result",draws:o.result.draws}})},async setWish(n){await e.runCommand("invite-wish","invite.setWish",{residentId:n})&&r.set({sheet:null})},async exchange(n){let o=await e.runCommand(`exchange:${n}`,"invite.exchange",{residentId:n});o&&r.set({sheet:{kind:"invite-result",draws:[o.result]}})},openDeliveries(){r.set({sheet:{kind:"deliveries"}}),i()},selectDelivery(n){r.set(o=>o.sheet?.kind==="deliveries"?{sheet:{...o.sheet,selectedOrderId:n}}:{})},async deliver(n){let o=await e.runCommand(`deliver:${n}`,"economy.deliver",{orderId:n});if(!o)return;let s=o.result.reward;e.notify(`\uB0A9\uD488\uD588\uC5B4\uC694. \uCD08\uB300\uAD8C ${s.tickets}\uC7A5\uACFC ${s.gold} G\uB97C \uBC1B\uC558\uC5B4\uC694.`),await i()}}}function xe(e){return!e||e.kind==="choice"?[]:[e.text]}function or(e){return typeof Intl.Segmenter=="function"?Array.from(new Intl.Segmenter(void 0,{granularity:"grapheme"}).segment(e),r=>r.segment):Array.from(e)}function Va(e,r){let a=or(e),i=[];for(let n=0;n<a.length;){let o=1,s=a.length-n,l=0;for(;o<=s;){let d=Math.floor((o+s)/2);r(a.slice(n,n+d).join(""))?(l=d,o=d+1):s=d-1}let p=n+Math.max(1,l);if(p<a.length){let d=n+Math.floor((p-n)*.6),c=a.slice(d,p).join(""),m=[...c.matchAll(/[.!?。！？…]+[”’"')\]]*\s*|\n+|\s+/gu)],u=m.filter(w=>/[.!?。！？…\n]/u.test(w[0])),f=(u.length?u:m).at(-1);f?.index!==void 0&&(p=d+or(c.slice(0,f.index+f[0].length)).length)}i.push(a.slice(n,p).join("")),n=p}return i.length?i:[""]}function sr(e,r){let a=e.querySelector(".line, .narration");if(!a||!e.clientWidth||!e.clientHeight)return null;let i=getComputedStyle(e),n=e.querySelector(".speaker-tag"),o=e.clientHeight-parseFloat(i.paddingTop)-parseFloat(i.paddingBottom)-(n?n.getBoundingClientRect().height+(parseFloat(i.rowGap)||0):0),s=a.textContent;try{return Va(r,l=>(a.textContent=l,a.getBoundingClientRect().height<=o+.5))}finally{a.textContent=s}}function lr(e){let{store:r}=e,a,i=0,n=new Set,o=-1,s="";function l(h){r.set(x=>({explore:{...x.explore,...h}}))}function p(h){r.set(x=>x.reader?{reader:{...x.reader,...h}}:{})}async function d(h=!1){let x=e.currentWorld();if(!x)return;let $=++i;h||l({overview:{state:"loading"}});let I=null;try{let A=await j.getStoryOverview(x.worldId);if($!==i||e.currentWorld()?.worldId!==x.worldId)return;let L=r.get().explore.pairId;L=A.pairs.some(ne=>ne.pairId===L)?L:A.pairs[0]?.pairId??null;let Y=L?x.state.pairs[L]:null,ae=`${x.worldId}:${L}:${L?x.state.stories.pairs[L]?.completed.length??0:0}`;if(L&&Y&&!Y.archived&&Y.residentIds.some(ne=>x.state.residents[ne]?.recruited)&&!x.state.stories.pairs[L]?.current?.generated&&!n.has(ae)&&r.get().route==="explore"&&(n.add(ae),I=ae,l({overview:{state:"loading"}}),A=await j.prepareStory(x.worldId,L),$!==i||e.currentWorld()?.worldId!==x.worldId))return;l({overview:{state:"ready",value:A},pairId:A.pairs.some(ne=>ne.pairId===L)?L:A.pairs[0]?.pairId??null})}catch(A){if(I&&n.delete(I),$!==i||e.currentWorld()?.worldId!==x.worldId)return;(!h||I)&&l({overview:{state:"error",message:G(A,"\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}r.subscribe(h=>{h.route!==s&&(s=h.route,h.route!=="story"&&m(),h.route==="explore"&&d(h.explore.overview?.state==="ready"));let x=h.world?.state==="ready"?h.world.value.revision:-1;x!==o&&(o=x,(h.route==="explore"||h.route==="home")&&h.explore.overview?.state==="ready"&&d(!0))});function c(){clearInterval(a),a=void 0}function m(){c(),r.get().reader?.auto&&p({auto:!1})}function u(){let h=r.get().reader;if(!h||h.story.state!=="ready"||h.backlog||r.get().route!=="story")return;let x=h.story.value.segments[h.index];if(!x||x.kind==="choice"&&!w()){m();return}c(),p({auto:!0}),a=setInterval(()=>{let $=r.get(),I=$.reader;if(!I?.auto||$.route!=="story"||I.backlog||document.hidden||!document.hasFocus()){m();return}v()},(r.get().autoReading?.seconds??4)*1e3)}function f(){let h=r.get().reader;return h?.story.state==="ready"?h.story.value.segments:[]}function w(){let h=r.get().reader,x=e.currentWorld();if(!h||!x)return!1;let $=x.state.stories.pairs[h.pairId],A=[$?.current,...$?.completed??[]].find(L=>L?.episodes[h.episode]?.storyId===h.storyId)?.episodes[h.episode];return!!A?.choice||A?.state==="read"}function v(){let h=r.get().reader;if(!h)return;let x=f(),$=x[h.index],I=h.textPages??xe($);if((h.textPage??0)+1<I.length){p({textPage:(h.textPage??0)+1});return}$?.kind==="choice"&&!w()||(h.index<x.length&&p({index:h.index+1,textPage:0,textPages:void 0,choiceView:"question"}),(h.index+1>=x.length||x[h.index+1]?.kind==="choice")&&m())}async function k(){let h=r.get().reader,x=e.currentWorld();if(!(!h||!x)){p({story:{state:"loading"}});try{let $;try{$=await j.getStory(x.worldId,h.storyId)}catch(I){if(ye(I)!=="story_not_found")throw I;$=await j.generateStory(x.worldId,h.pairId,h.episode)}if(r.get().reader?.storyId!==h.storyId)return;p({story:{state:"ready",value:$},index:0}),r.get().autoReading?.enabled&&u()}catch($){if(r.get().reader?.storyId!==h.storyId)return;p({story:{state:"error",message:G($,"\uC774\uC57C\uAE30\uB97C \uC4F0\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD560 \uC218 \uC788\uC5B4\uC694.")}})}}}return{loadStoryOverview:d,selectActivityResident(h){l({activityResidentId:h})},async startActivity(h,x){let $=e.currentWorld();if(!$)return;let I=e.requestIdFor("activity-id",JSON.stringify([$.worldId,h,x]),ie);await e.runCommand("activity-start","activities.start",{id:I,kind:h,placeId:"workshop-edge",residentId:x})&&(e.forgetRequest("activity-id"),e.notify("\uACF5\uBC29 \uC8FC\uBCC0\uC73C\uB85C \uCD9C\uBC1C\uD588\uC5B4\uC694."))},async cancelActivity(h){await e.runCommand(`activity-cancel:${h}`,"activities.cancel",{id:h})},openExplore(){e.navigate("explore")},setExploreTab(h){l({tab:h})},setExploreSection(h){l({section:h})},setExploreHistoryPage(h){l({historyPage:Math.max(0,h)})},selectStoryPair(h){l({pairId:h,historyPage:0,selectedEpisode:void 0}),d()},selectStoryEpisode(h){l({selectedEpisode:h})},async depart(h,x){let $=await e.runCommand(`depart:${h}:${x}`,"stories.depart",{pairId:h,episode:x});$&&(e.notify(`\uD0D0\uD5D8\uC744 \uB5A0\uB0AC\uC5B4\uC694. ${String($.result.minutes)}\uBD84 \uB4A4\uC5D0 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694.`),await d(!0))},async cancelExpedition(){await e.runCommand("expedition-cancel","stories.cancel",{})&&(e.notify("\uD0D0\uD5D8\uC744 \uCDE8\uC18C\uD588\uC5B4\uC694. \uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC558\uC5B4\uC694."),await d(!0))},openStory(h,x,$){c();let I=r.get().route==="story"?"explore":r.get().route;r.set({reader:{pairId:h,episode:x,storyId:$,story:{state:"loading"},index:0,auto:!1,backlog:!1,from:I}}),e.navigate("story"),k()},retryStory(){k()},advanceStory:v,setStoryTextPages(h,x,$){let I=r.get().reader;if(!I||I.storyId!==h||I.index!==x||I.story.state!=="ready")return;let A=I.story.value.segments[x];if(!A||A.kind==="choice"||$.join("")!==A.text)return;let L=I.textPages??xe(A);if(JSON.stringify(L)===JSON.stringify($))return;let Y=L.slice(0,I.textPage??0).reduce((b,N)=>b+Array.from(N).length,0),ae=0,ne=Array.from($[0]??"").length;for(;ae<$.length-1&&ne<=Y;)ne+=Array.from($[++ae]).length;p({textPages:$,textPage:ae})},setChoiceView(h){p({choiceView:h})},pauseAutoReading:m,toggleAuto(){r.get().reader?.auto?m():u()},toggleBacklog(){let h=r.get().reader;h&&(m(),p({backlog:!h.backlog,backlogPage:void 0}))},setBacklogPage(h){p({backlogPage:Math.max(0,h)})},async chooseAnswer(h){let x=r.get().reader;if(!x)return;await e.runCommand(`choose:${x.storyId}`,"stories.choose",{pairId:x.pairId,episode:x.episode,storyId:x.storyId,optionId:h})&&v()},async finishStory(){let h=r.get().reader;if(!h)return;c();let x=await e.runCommand(`read:${h.storyId}`,"stories.markRead",{pairId:h.pairId,episode:h.episode,storyId:h.storyId});x&&(l({tab:"story",section:"history",pairId:h.pairId,historyPage:0}),r.set({reader:null}),e.navigate("explore"),x.result.alreadyRead||e.notify(x.result.arcDone?"\uC774 \uD0D0\uD5D8\uC758 \uC774\uC57C\uAE30\uB97C \uBAA8\uB450 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uD0D0\uD5D8\uC774 \uC5F4\uB838\uC5B4\uC694.":"\uC774\uC57C\uAE30\uB97C \uB2E4 \uC77D\uC5C8\uC5B4\uC694. \uB2E4\uC74C \uC774\uC57C\uAE30\uB97C \uB5A0\uB0A0 \uC218 \uC788\uB294\uC9C0 \uD655\uC778\uD574 \uBCF4\uC138\uC694."),await d(!0))},closeStory(){let h=r.get().reader;c(),r.set({reader:null}),e.navigate(h?.from&&h.from!=="story"?h.from:"explore")}}}var st="forest-workshop:last-world";function Da(){try{return localStorage.getItem(st)}catch{return null}}function dr(e){try{e?localStorage.setItem(st,e):localStorage.removeItem(st)}catch{}}function Ba(e){let r=e.status;return typeof r=="number"&&r>=400&&r<500&&ye(e)!==null}function cr(){let e=Zt({route:"worlds",worlds:{state:"loading"},world:null,content:null,busy:{},notice:null,restore:null,fontSize:$t(),autoReading:Pt(),weatherEffects:Tt(),weatherCity:Ot(),seasonChoice:Rt(),artReady:[],facilitiesTab:"facilities",storage:null,starterSheetHidden:!1,residentsView:{tab:"all",query:"",filter:"all",selectedId:null},focusResidentId:null,relationsEditing:!1,sheet:null,placementDraft:null,register:null,work:{facilityId:"gather-yard",drafts:{},selected:{},queueRecipe:{}},inviteTab:"invite",deliveries:null,explore:{tab:"story",pairId:null,overview:null},reader:null,worldReceivedAt:Date.now()}),r=new Map,a=new Fe;function i(){for(let{path:b}of rt(K(e.get())))Qt(b).then(N=>{N&&!e.get().artReady.includes(b)&&e.set(C=>({artReady:[...C.artReady,b]}))})}i();let n=K(e.get());e.subscribe(b=>{let N=K(b);N!==n&&(n=N,i())});let o=4e3,s=null,l;e.subscribe(b=>{if(b.notice!==s&&(s=b.notice,clearTimeout(l),s?.kind==="info")){let N=s;l=setTimeout(()=>{e.get().notice===N&&e.set({notice:null})},o)}});function p(b,N,C=Oe){let O=r.get(b);if(O&&O.signature===N)return O.id;let H=C();return r.set(b,{id:H,signature:N}),H}function d(b,N){e.set(C=>({busy:{...C.busy,[b]:N}}))}async function c(b,N,C){if(e.get().busy[b])return null;d(b,!0),e.set({notice:null});try{let O=await N();return r.delete(b),O}catch(O){return Ba(O)&&r.delete(b),e.set({notice:{kind:"error",text:G(O,C)}}),ye(O)==="stale_view"&&$(),null}finally{d(b,!1)}}let m=()=>{};function u(b,N){dr(b.worldId),e.set(C=>({world:{state:"ready",value:{worldId:b.worldId,revision:b.revision,updatedAt:b.updatedAt,state:b.state}},worldReceivedAt:Date.now(),work:C.world?.state==="ready"&&C.world.value.worldId===b.worldId?C.work:{facilityId:C.work.facilityId,drafts:{},selected:{},queueRecipe:{}},content:N??C.content,route:C.route==="worlds"?"home":C.route})),m()}function f(b,N){a.acceptsUpdate(I(),b)&&u(b,N)}function w(b,N){a.beginNavigation(),u(b,N)}function v(b){a.acceptsUpdate(I(),b)&&(e.remember({world:{state:"ready",value:{worldId:b.worldId,revision:b.revision,updatedAt:b.updatedAt,state:b.state}},worldReceivedAt:Date.now()}),m())}async function k(){e.set({worlds:{state:"loading"}});try{let{worlds:b}=await j.listWorlds();return e.set({worlds:{state:"ready",value:b}}),b}catch(b){return e.set({worlds:{state:"error",message:G(b,"\uC138\uACC4 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}),null}}async function h(b){let N=a.beginNavigation();e.set({world:{state:"loading"},route:"home",notice:null});try{let C=await j.getState(b);if(!a.isCurrentNavigation(N))return;u(C,C.content)}catch(C){if(!a.isCurrentNavigation(N))return;ye(C)==="world_not_found"&&dr(null),e.set({world:{state:"error",message:G(C,"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}async function x(){let b=I();if(b){e.set({storage:{state:"loading"}});try{e.set({storage:{state:"ready",value:await j.getStorage(b.worldId)}})}catch(N){e.set({storage:{state:"error",message:G(N,"\uC800\uC7A5 \uACF5\uAC04\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}})}}}async function $(){let b=e.get().world;b?.state==="ready"&&await h(b.value.worldId)}function I(){let b=e.get().world;return b?.state==="ready"?b.value:null}function A(b){e.set({route:b,notice:null,restore:null,sheet:null,relationsEditing:!1}),b==="worlds"&&k(),b==="backup"&&x()}async function L(b,N,C={}){let O=I();if(!O)return null;let H=JSON.stringify([O.worldId,N,C]),Aa=p(b,H),ze=await c(b,()=>j.sendCommand({worldId:O.worldId,commandId:Aa,expectedRevision:O.revision,type:N,payload:C}),"\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.");return!ze||I()?.worldId!==O.worldId?null:(f({worldId:O.worldId,revision:ze.revision,updatedAt:new Date().toISOString(),state:ze.state}),ze)}let Y={store:e,track:c,runCommand:L,currentWorld:I,requestIdFor:p,forgetRequest:b=>r.delete(b),showWorld:f,rememberWorld:v,navigate:A,refreshStorage:x,notify:(b,N="info")=>e.set({notice:{kind:N,text:b}})},ae=Bt(Y),ne=ir(Y);return m=ne.prepareLatestLetter,{store:e,...ne,...ae,...er(Y),...ar(Y),...nr(Y),...lr(Y),async start(){Ft().then(()=>e.set({})),ae.refreshWeather();let b=await k(),N=Da();b&&N&&b.some(C=>C.worldId===N&&C.readable)&&await h(N)},loadWorlds:k,openWorld:h,reloadWorld:$,setWorldsPage(b){e.set({worldsPage:Math.max(0,b)})},rememberWorldDraft(b){e.remember({worldDraft:b})},rememberWorldCreateOpen(b){e.remember({worldCreateOpen:b})},navigate:A,notify:Y.notify,notifyLocked(b){e.set({notice:{kind:"info",text:Kt(b)}})},setSeasonChoice(b){At(b),e.set({seasonChoice:b}),i()},setWeatherEffects(b){let N=Z(b);zt(N),e.set({weatherEffects:N})},setAutoReading(b){let N=Ie(b);Et(N),e.set({autoReading:N})},setFontSize(b){let N=Le(b);It(N),e.set({fontSize:N})},setFacilitiesTab(b){e.set(N=>({facilitiesTab:b,work:{...N.work,inventoryPage:0}}))},setSettingsSection(b){e.set({settingsSection:b})},rememberSettingsNickname(b,N){e.remember({settingsNicknameDraft:{worldId:b,value:N}})},async saveSettingsNickname(b,N){let C=await L("rename-nickname","settings.update",{playerNickname:N}),O=e.get().settingsNicknameDraft;return C&&O?.worldId===b&&O.value===N&&e.remember({settingsNicknameDraft:void 0}),C},openGroundEditor(){let b=I();b&&(A("home"),e.set({groundEditingWorld:b.worldId,settingsGroundDraft:{worldId:b.worldId,value:{...b.state.settings.ground}}}))},resetGroundEditor(){let b=I();b&&e.set({settingsGroundDraft:{worldId:b.worldId,value:{left:12,right:88,top:58,bottom:90}}})},cancelGroundEditor(){e.set({groundEditingWorld:void 0,settingsGroundDraft:void 0})},rememberGround(b,N){e.remember({settingsGroundDraft:{worldId:b,value:{...N}}})},async saveGround(b){let N=I()?.worldId,C={...b},O=await L("ground-save","settings.update",{ground:C});if(O){let H=e.get().settingsGroundDraft;H&&H.worldId===N&&JSON.stringify(H.value)===JSON.stringify(C)&&e.remember({settingsGroundDraft:void 0,groundEditingWorld:void 0}),Y.notify("\uC9C0\uBA74 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.")}return O},hideStarterSheet(){e.set({starterSheetHidden:!0})},showStarterSheet(){e.set({starterSheetHidden:!1})},dismissNotice(){e.set({notice:null})},async createWorld(b,N){let C=JSON.stringify([b.trim(),N.trim()]),O=p("create-world",C,ie),H=await c("create-world",()=>j.createWorld({worldId:O,worldName:b,playerNickname:N}),"\uC138\uACC4\uB97C \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");H&&(e.remember({worldDraft:void 0,worldCreateOpen:!1}),w(H,H.content))},runCommand:L,async downloadBackup(){let b=I();if(!b)return;let N=await c("backup",()=>j.getBackup(b.worldId),"\uBC31\uC5C5\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");if(!N)return;let C=new Blob([`${JSON.stringify(N,null,2)}
`],{type:"application/json"}),O=URL.createObjectURL(C),H=document.createElement("a");H.href=O,H.download=`forest-workshop-${b.state.settings.worldName}-${N.exportedAt.slice(0,10)}.json`,document.body.append(H),H.click(),H.remove(),setTimeout(()=>URL.revokeObjectURL(O),1e4),e.set({notice:{kind:"info",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uD0A4\uB294 \uB4E4\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}})},async selectRestoreFile(b){let N;try{N=JSON.parse(await b.text())}catch{e.set({restore:null,notice:{kind:"error",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uC77D\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. JSON \uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE8\uB77C \uC8FC\uC138\uC694."}});return}let C=_t(N);if(!C.ok){e.set({restore:null,notice:{kind:"error",text:C.message}});return}e.set({notice:null,restore:{fileName:b.name,signature:`${b.name}:${b.size}:${b.lastModified}`,backup:N,summary:C.summary}})},cancelRestore(){e.set({restore:null})},async confirmRestore(){let b=e.get().restore;if(!b)return;let N=p("restore",b.signature,ie),C=await c("restore",()=>j.restore(N,b.backup),"\uBC31\uC5C5\uC744 \uBCF5\uC6D0\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");C&&(w(C,C.content),e.set({route:"home",restore:null,notice:{kind:"info",text:`\uBC31\uC5C5\uC744 \uC0C8 \uC138\uACC4 '${C.state.settings.worldName}'(\uC73C)\uB85C \uBCF5\uC6D0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uC138\uACC4\uB294 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.`}}))}}}function K(e){return e.seasonChoice==="auto"?le(e).season:e.seasonChoice}function pr(e){return rt(K(e)).filter(({path:r})=>e.artReady.includes(r)).map(({flag:r})=>` ${r}`).join("")}function mr(e){return e.route==="residents"?`residents:list:${e.residentsView.page??0}`:e.route==="work"?`work:${e.work.facilityId}:${e.work.section??"status"}:${e.work.queueView??""}:${e.work.queuePage??0}:${e.work.priorityPage??0}`:e.route==="facilities"?`facilities:${e.facilitiesTab}:${e.work.inventoryPage??0}`:e.route==="settings"?`settings:${e.settingsSection??"workshop"}`:e.route==="explore"?`explore:${e.explore?.pairId??""}:${e.explore?.section??"episode"}:${e.explore?.historyPage??0}`:e.route==="invite"?`invite:${e.inviteTab??"invite"}:${e.invitePage??0}`:e.route==="register"?`register:${e.register?.step??1}:${e.register?.panel??"source"}:${e.register?.sourcePage??0}:${e.register?.starterPage??0}`:e.route==="worlds"?`worlds:${e.worldsPage??0}`:e.route}function t(e,r={},a=[]){let i=document.createElement(e);r.className&&(i.className=r.className),r.text!==void 0&&(i.textContent=r.text);for(let[n,o]of Object.entries(r.attrs??{}))o!==void 0&&i.setAttribute(n,o);for(let[n,o]of Object.entries(r.on??{}))o&&i.addEventListener(n,o);r.disabled!==void 0&&"disabled"in i&&(i.disabled=r.disabled);for(let n of a)n==null||n===!1||i.append(typeof n=="string"?document.createTextNode(n):n);return i}function y(e,r,a={}){return t("button",{className:a.variant==="secondary"?"button secondary":"button",text:e,attrs:{type:"button",...a.attrs},disabled:a.disabled,on:{click:r}})}function P(e){return t("p",{className:"muted",text:e,attrs:{role:"status"}})}function ee(e){return t("p",{className:"error",text:e,attrs:{role:"alert"}})}function lt(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)}MiB`:e>=1024?`${Math.round(e/1024)}KiB`:`${e}B`}function W(e,r,a,i=""){let n=a.find(o=>o instanceof HTMLButtonElement&&o.textContent==="\uB2EB\uAE30");return t("div",{className:"sheet-backdrop"},[t("section",{className:`sheet card ${i}`.trim(),attrs:{role:"dialog","aria-modal":"true","aria-labelledby":e}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:r,attrs:{id:e}}),n]),...a.filter(o=>o!==n)])])}function ue(e,r,a,i,n={}){let o=Math.min(i,Math.max(a,r)),s=t("output",{className:"step-value big",text:String(o),attrs:{id:e,"aria-live":"polite",...n.label?{"aria-label":n.label}:{}}}),l=d=>t("button",{className:"step",text:d>0?`+${d}`:String(d),attrs:{type:"button","aria-label":`${n.label??""} ${d>0?"\uB298\uB9AC\uAE30":"\uC904\uC774\uAE30"} ${Math.abs(d)}`.trim()},on:{click:()=>{o=Math.min(i,Math.max(a,o+d)),s.textContent=String(o),n.onChange?.(o)}}}),p=n.small?[l(-1),s,l(1)]:[l(-1),s,l(1),l(-10),l(10)];return{node:t("div",{className:`stepper wide${n.small?" compact":""}`},p),read:()=>o}}function J(e,r,a,i){if(a.length<=1)return null;let n=Math.max(0,Math.min(r,a.length-1)),o=t("summary",{className:"page-picker-summary",attrs:{"aria-label":e,id:`fw-picker-${encodeURIComponent(e)}`}},[t("span",{text:a[n]}),t("span",{className:"page-picker-arrow",text:"\u25BE",attrs:{"aria-hidden":"true"}})]),s=t("details",{className:"page-picker",on:{keydown:l=>{l.key==="Escape"&&s.open&&(l.preventDefault(),s.open=!1,o.focus())}}},[o,t("div",{className:"page-picker-options"},a.map((l,p)=>t("button",{className:"page-picker-option",text:l,attrs:{type:"button","aria-pressed":String(p===n)},on:{click:()=>{s.open=!1,o.focus(),p!==n&&i(p)}}})))]);return s}function ur(e,r){let a=e.sheet,i=e.world?.state==="ready"?e.world.value:null;if(a?.kind!=="mailbox"||!i)return null;let n=i.state.activities?.completed??[],o=(i.state.mailbox?.letters??[]).filter(m=>!n.some(u=>u.mailId===m.id&&i.state.mailbox.letters.some(f=>f.id===`resident-${u.id}`))).filter(m=>m.archived===!!a.archived).slice().sort((m,u)=>u.createdAt.localeCompare(m.createdAt)||m.id.localeCompare(u.id)),s=o.find(m=>m.id===a.id),l=Math.max(0,Math.min(a.page??0,Math.ceil(o.length/4)-1)),p=s?i.state.activities?.completed?.find(m=>m.mailId===s.id):void 0,d=p?i.state.mailbox.letters.find(m=>m.id===`resident-${p.id}`):void 0,c=!!(e.busy[`mail:${s?.id}`]||p&&e.busy[`letter:${p.id}`]);return W("fw-mailbox","\uC6B0\uD3B8\uD568",[t("div",{className:"mail-tabs",attrs:{role:"group","aria-label":"\uC6B0\uD3B8 \uBD84\uB958"}},[!1,!0].map(m=>y(m?"\uBCF4\uAD00\uD568":"\uBC1B\uC740 \uD3B8\uC9C0",()=>r.setMailboxView({archived:m,page:0,id:void 0}),{variant:"secondary",attrs:{"aria-pressed":String(!!a.archived===m)}}))),s?t("article",{className:"letter-detail"},[t("h3",{text:s.title}),t("p",{className:"muted",text:`${s.sender} \xB7 ${s.createdAt.slice(0,10)}`}),p&&!d&&c?P("\uC8FC\uBBFC\uC758 \uD3B8\uC9C0\uB97C \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694. \uC644\uC131\uB418\uBA74 \uBC14\uB85C \uBCF4\uC5EC\uB4DC\uB9B4\uAC8C\uC694."):t("div",{className:"letter-content"},[p&&!d?t("h4",{text:"\uBCF4\uAD00\uB41C \uD65C\uB3D9 \uAE30\uB85D"}):null,t("p",{className:"letter-body",text:s.body})]),p&&!c?y(d?"\uC8FC\uBBFC \uD3B8\uC9C0 \uBCF4\uAE30":c?"\uD3B8\uC9C0\uB97C \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694\u2026":"\uD3B8\uC9C0 \uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>d?void r.openActivityLetter(d.id):void r.generateResidentLetter(p.id),{disabled:c}):null,y(s.archived?"\uBC1B\uC740 \uD3B8\uC9C0\uB85C":"\uBCF4\uAD00\uD558\uAE30",()=>{r.archiveLetter(s.id,!s.archived)},{disabled:c}),y("\uBAA9\uB85D\uC73C\uB85C",()=>r.setMailboxView({id:void 0}),{variant:"secondary",disabled:c})]):t("div",{className:"mail-list"},o.length?o.slice(l*4,l*4+4).map(m=>y(`${m.readAt?"\uC77D\uC74C":"\uC0C8 \uD3B8\uC9C0"} \xB7 ${m.sender} \xB7 ${m.title}`,()=>{r.openLetter(m.id)},{variant:"secondary",disabled:!!e.busy[`mail:${m.id}`]})):[t("p",{className:"empty",text:a.archived?"\uBCF4\uAD00\uD55C \uD3B8\uC9C0\uAC00 \uC5C6\uC5B4\uC694.":"\uBC1B\uC740 \uD3B8\uC9C0\uAC00 \uC5C6\uC5B4\uC694."})]),s?null:J("\uD3B8\uC9C0 \uBAA9\uB85D \uACE0\uB974\uAE30",l,Array.from({length:Math.ceil(o.length/4)},(m,u)=>`${u+1} \xB7 ${u*4+1}\u2013${Math.min(o.length,u*4+4)}`),m=>r.setMailboxView({page:m})),y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary"})])}function gr(e,r){let a=e.sheet,i=e.world?.state==="ready"?e.world.value:null;if(a?.kind!=="guidelines"||!i)return null;let n=a.pairId?i.state.guidelines?.pairs[a.pairId]:i.state.guidelines?.world,o=a.draft??n??{enabled:!1,text:""},s=a.pairId?500:1e3,l=!!e.busy[`guidelines:${a.pairId??"world"}`],p=t("output",{className:"muted",text:`${o.text.length} / ${s}`}),d=t("textarea",{className:"textarea",attrs:{"aria-label":"AI \uC11C\uC220 \uC9C0\uCE68",maxlength:String(s),rows:"6"},on:{input:()=>{p.textContent=`${d.value.length} / ${s}`,m()}}});d.value=o.text;let c=t("input",{attrs:{type:"checkbox","aria-label":"\uC9C0\uCE68 \uC0AC\uC6A9"},on:{change:()=>m()}});c.checked=o.enabled;function m(){r.rememberGuidelines({enabled:c.checked,text:d.value})}return W("fw-guidelines",a.pairId?"\uD398\uC5B4 AI \uC9C0\uCE68":"\uACF5\uBC29 AI \uC9C0\uCE68",[t("p",{className:"muted",text:a.pairId?"\uC774 \uD398\uC5B4\uC758 \uC0C8 \uC774\uC57C\uAE30 \uB9D0\uD22C\uC640 \uBD84\uC704\uAE30\uB97C \uC815\uD574\uC694.":"\uACF5\uBC29\uC758 \uC0C8 \uC774\uC57C\uAE30 \uB9D0\uD22C\uC640 \uBD84\uC704\uAE30\uB97C \uC815\uD574\uC694."}),t("form",{className:"guidelines-form",on:{submit:u=>{if(u.preventDefault(),c.checked&&!d.value.trim()){r.notify("\uC0AC\uC6A9\uD560 \uC9C0\uCE68\uC744 \uC791\uC131\uD574 \uC8FC\uC138\uC694.");return}let f={enabled:c.checked,text:d.value};r.rememberGuidelines(f),r.saveGuidelines(a.pairId,f)}}},[t("label",{className:"guidelines-toggle"},[c,"\uC9C0\uCE68 \uC0AC\uC6A9"]),d,p,t("button",{className:"button",text:l?"\uC800\uC7A5 \uC911\u2026":"\uC9C0\uCE68 \uC800\uC7A5",attrs:{type:"submit"},disabled:l}),y("\uCD08\uAE30\uD654",()=>{d.value="",c.checked=!1,p.textContent=`0 / ${s}`,m()},{variant:"secondary",disabled:l})]),t("details",{className:"detail-help"},[t("summary",{text:"\uC9C0\uCE68 \uC801\uC6A9 \uC548\uB0B4"}),t("p",{className:"muted",text:"\uB9D0\uD22C\xB7\uBD84\uC704\uAE30\xB7\uAD00\uACC4 \uC9C4\uD589 \uC18D\uB3C4\uB97C \uCC38\uACE0\uD574\uC694. \uAE30\uC5B5\xB7\uBCF4\uC0C1\xB7\uAC8C\uC784 \uADDC\uCE59\uC774\uB098 \uC774\uBBF8 \uC791\uC131\uD55C \uC774\uC57C\uAE30\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),a.pairId?t("p",{className:"muted",text:"\uACF5\uBC29 \uC9C0\uCE68\uBCF4\uB2E4 \uC774 \uD398\uC5B4\uC758 \uC11C\uC220 \uC120\uD638\uB97C \uC6B0\uC120\uD574\uC694."}):null]),y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",disabled:l})])}var dt={active:"\uC0AC\uC6A9 \uC911",corrected:"\uC815\uC815 \uC804 \uC6D0\uBB38",invalidated:"\uC0AC\uC6A9 \uC911\uC9C0"},Fa={event:"\uC0AC\uAC74",feeling:"\uAC10\uC815",player:"\uD50C\uB808\uC774\uC5B4 \uB2F5\uBCC0"};function fr(e,r){let a=e.sheet,i=e.world?.state==="ready"?e.world.value:null;if(a?.kind!=="memory"||!i)return null;let n=a.pairId?i.state.pairs[a.pairId]:null,o=i.state.memory.facts.filter(k=>!a.pairId||n&&(k.visibility==="public"||n.residentIds.every(h=>k.knowerIds.includes(h)))).filter(k=>!a.status||a.status==="all"||k.status===a.status).filter(k=>!a.residentId||k.visibility==="public"||k.knowerIds.includes(a.residentId)).slice().reverse(),s=o.find(k=>k.factId===a.factId)??o[0],l=Math.max(0,Math.min(a.page??0,Math.ceil(o.length/3)-1)),p=s?!!e.busy[`memory:${s.factId}`]:!1,d=a.draft??s?.text??"",c=k=>{let h=r.store.get().sheet;if(h?.kind==="memory"&&h.draft!==void 0&&h.draft!==s?.text){r.notify("\uC815\uC815\uBB38\uC744 \uC800\uC7A5\uD55C \uB4A4 \uD544\uD130\uB97C \uBC14\uAFD4 \uC8FC\uC138\uC694.");return}r.updateMemoryView({...k,page:0,factId:void 0,draft:void 0})},m=["all","active","corrected","invalidated"],u=["",...Object.keys(i.state.residents)],f=J("\uAE30\uC5B5 \uC0C1\uD0DC \uD544\uD130",Math.max(0,m.indexOf(a.status??"all")),["\uBAA8\uB4E0 \uC0C1\uD0DC",...Object.values(dt)],k=>c({status:m[k]})),w=J("\uAE30\uC5B5 \uC778\uC9C0 \uC8FC\uBBFC \uD544\uD130",Math.max(0,u.indexOf(a.residentId??"")),u.map(k=>k?i.state.residents[k].displayName:"\uBAA8\uB4E0 \uC778\uC9C0 \uC8FC\uBBFC"),k=>c({residentId:u[k]})),v=t("textarea",{className:"textarea",attrs:{"aria-label":"\uAE30\uC5B5 \uC815\uC815\uBB38",maxlength:"160",rows:"3"},on:{input:()=>r.rememberMemoryDraft(v.value)}});return v.value=d,W("fw-memory",a.pairId?"\uD398\uC5B4 \uACF5\uC720 \uAE30\uC5B5":"\uAE30\uC5B5 \uAD00\uB9AC",[t("p",{className:"muted",text:a.pairId?"\uB450 \uC8FC\uBBFC\uC774 \uD568\uAED8 \uC544\uB294 \uAE30\uC5B5\uACFC \uACF5\uAC1C \uAE30\uC5B5\uB9CC \uBCF4\uC5EC\uC694. \uC815\uC815\uD574\uB3C4 \uC778\uC9C0 \uBC94\uC704\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694.":"\uC138\uACC4 \uAD00\uB9AC\uC790\uB294 \uC804\uCCB4 \uAE30\uC5B5\uC744 \uBCFC \uC218 \uC788\uC5B4\uC694. \uC8FC\uBBFC\uC740 \uC790\uC2E0\uC774 \uC544\uB294 \uAE30\uC5B5\uACFC \uACF5\uAC1C \uAE30\uC5B5\uB9CC \uC0AC\uC6A9\uD574\uC694."}),t("div",{className:"memory-filters"},[f,w]),o.length?t("div",{className:"memory-choices",attrs:{role:"group","aria-label":"\uAE30\uC5B5 \uC120\uD0DD"}},o.slice(l*3,l*3+3).map(k=>y(`${k.text.slice(0,32)} \xB7 ${dt[k.status]}`,()=>{let h=r.store.get().sheet;if(h?.kind==="memory"&&h.draft!==void 0&&h.draft!==s?.text){r.notify("\uC815\uC815\uBB38\uC744 \uC800\uC7A5\uD55C \uB4A4 \uB2E4\uB978 \uAE30\uC5B5\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.");return}r.updateMemoryView({factId:k.factId,draft:void 0})},{variant:"secondary",attrs:{"aria-pressed":String(k.factId===s?.factId)}}))):t("p",{className:"empty",text:"\uC544\uC9C1 \uAE30\uB85D\uB41C \uAE30\uC5B5\uC774 \uC5C6\uC5B4\uC694."}),J("\uAE30\uC5B5 \uBAA9\uB85D \uACE0\uB974\uAE30",l,Array.from({length:Math.ceil(o.length/3)},(k,h)=>`${h+1} \xB7 ${h*3+1}\u2013${Math.min(o.length,h*3+3)}`),k=>r.updateMemoryView({page:k})),s?t("section",{className:"memory-detail"},[t("p",{className:"memory-text",text:s.text}),t("span",{className:"muted",text:`${Fa[s.factType]} \xB7 ${dt[s.status]}`}),t("p",{className:"muted",text:`\uC544\uB294 \uC8FC\uBBFC: ${s.visibility==="public"?"\uBAA8\uB450":s.knowerIds.map(k=>i.state.residents[k]?.displayName??"\uC8FC\uBBFC").join(", ")}`}),t("p",{className:"muted",text:`${s.occurredAt.slice(0,10)} \xB7 ${s.storyId?`\uCD9C\uCC98 \uC774\uC57C\uAE30 ${s.storyId}`:"\uACF5\uBC29 \uAE30\uB85D"}${s.supersedes?` \xB7 \uC815\uC815 \uC6D0\uBB38 #${s.supersedes}`:""}`}),s.status==="active"?t("form",{on:{submit:k=>{k.preventDefault(),v.value.trim()&&v.value.trim()!==s.text&&r.correctMemory(s.factId,v.value)}}},[t("label",{className:"compare-title",text:"\uAE30\uC5B5 \uC815\uC815\uBB38"}),v,t("p",{className:"muted",text:"\uC6D0\uBB38\uACFC \uCD9C\uCC98\uB294 \uBCF4\uC874\uD558\uBA70 \uB2E4\uC74C \uC0DD\uC131\uBD80\uD130 \uC815\uC815\uBCF8\uC744 \uC0AC\uC6A9\uD574\uC694. \uC774\uBBF8 \uC4F4 \uC774\uC57C\uAE30\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),t("button",{className:"button",text:"\uC815\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:p})]):null,s.status!=="corrected"?y(s.status==="active"?"\uC0AC\uC6A9 \uC911\uC9C0":"\uB2E4\uC2DC \uC0AC\uC6A9",()=>{r.setMemoryStatus(s.factId,s.status!=="active")},{variant:"secondary",disabled:p}):null]):null,y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary"})],"memory-sheet")}var ct="http://www.w3.org/2000/svg";function S(e){return(r="icon")=>{let a=document.createElementNS(ct,"svg");a.setAttribute("viewBox","0 0 24 24"),a.setAttribute("aria-hidden","true"),a.setAttribute("focusable","false"),a.setAttribute("class",r);for(let i of e){let n=typeof i=="string"?{d:i}:i,o=n.circle?document.createElementNS(ct,"circle"):document.createElementNS(ct,"path");n.circle?(o.setAttribute("cx",String(n.circle[0])),o.setAttribute("cy",String(n.circle[1])),o.setAttribute("r",String(n.circle[2]))):o.setAttribute("d",n.d??""),n.fill&&o.setAttribute("class","fill"),a.append(o)}return a}}var g={back:S(["M15 5l-7 7 7 7"]),chevron:S(["M9 5l7 7-7 7"]),gear:S([{circle:[12,12,3.2]},"M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-2 1.2l-.3 2h-4l-.3-2a7.6 7.6 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 2-1.2l.3-2h4l.3 2a7.6 7.6 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 3z"]),lock:S(["M7 11V8a5 5 0 0 1 10 0v3","M5.5 11h13v9h-13z"]),home:S(["M3.5 11.5L12 4l8.5 7.5","M6 10v10h12V10","M10 20v-5h4v5"]),hammer:S(["M14 4l6 6-2.5 2.5-6-6z","M12.5 8.5L4 17l3 3 8.5-8.5"]),compass:S([{circle:[12,12,8.5]},"M15.5 8.5l-2 5-5 2 2-5z"]),residents:S([{circle:[9,9,3.2]},{circle:[16.5,10,2.6]},"M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5","M14.5 15.5c2.6-.6 5 .8 6 3.5"]),ticket:S(["M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z","M10 9.5c1.5 0 3 1 3 2.5s-1.5 2.5-3 2.5"]),mail:S(["M4 6.5h16v11H4z","M4.5 7l7.5 6 7.5-6"]),weather:S(["M7 18h10a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4 4 0 0 0 7 18z"]),clock:S([{circle:[12,12,8.5]},"M12 7.5V12l3 2"]),info:S([{circle:[12,12,8.5]},"M12 11v5.5","M12 7.6v.4"]),check:S(["M5 12.5l4.5 4.5L19 7.5"]),eye:S(["M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z",{circle:[12,12,2.8]}]),image:S(["M4 5h16v14H4z",{circle:[9,10,1.6]},"M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5"]),landscape:S(["M4 5h16v14H4z","M4.5 17l5.5-6 4 4 2-2 3.5 4"]),document:S(["M7 3.5h7l4 4V20.5H7z","M14 3.5v4h4","M9.5 12h6","M9.5 15.5h6"]),folder:S(["M3.5 7h6l2 2h9v10h-17z"]),book:S(["M12 6.5c-2-1.3-4.7-1.6-8-1v13c3.3-.6 6-.3 8 1 2-1.3 4.7-1.6 8-1v-13c-3.3-.6-6-.3-8 1z","M12 6.5v13"]),flower:S([{circle:[12,12,2.4]},{circle:[12,6.5,2.6]},{circle:[17.2,10.3,2.6]},{circle:[15.2,16.5,2.6]},{circle:[8.8,16.5,2.6]},{circle:[6.8,10.3,2.6]}]),people:S([{circle:[8,8.5,2.8]},{circle:[16,8.5,2.8]},"M3 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6","M11 19c.6-3 2.5-4.6 5-4.6s4.4 1.6 5 4.6"]),pair:S([{circle:[9,12,4.5]},{circle:[15,12,4.5]}]),upload:S(["M12 15.5V4.5","M7.5 9l4.5-4.5L16.5 9","M5 14v5.5h14V14"]),download:S(["M12 4.5v11","M7.5 11l4.5 4.5 4.5-4.5","M5 14v5.5h14V14"]),restore:S(["M4.5 12a7.5 7.5 0 1 0 2.2-5.3","M4.5 4.5v4h4"]),leaf:S(["M5 19c0-8 5-13 14-14-1 9-6 14-14 14z","M5 19l7-7"]),sprout:S(["M12 20v-8","M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6z","M12 12c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"]),search:S([{circle:[10.5,10.5,6]},"M15 15l5 5"]),jar:S(["M8 4.5h8v3H8z","M7 7.5h10l1 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z","M9 14h6"]),box:S(["M3.5 8l8.5-4 8.5 4v9l-8.5 4-8.5-4z","M3.5 8l8.5 4 8.5-4","M12 12v9"]),house:S(["M4 11l8-6.5 8 6.5","M6.5 9.5V19h11V9.5","M10.5 19v-4.5h3V19"]),pencil:S(["M15.5 4.5l4 4L9 19H5v-4z","M13.5 6.5l4 4"]),swap:S(["M5 9h12l-3-3","M19 15H7l3 3"]),minus:S(["M6 12h12"]),plus:S(["M6 12h12","M12 6v12"]),grip:S([{circle:[9,7,1.2],fill:!0},{circle:[15,7,1.2],fill:!0},{circle:[9,12,1.2],fill:!0},{circle:[15,12,1.2],fill:!0},{circle:[9,17,1.2],fill:!0},{circle:[15,17,1.2],fill:!0}]),menu:S(["M5 8h14","M5 12h14","M5 16h14"]),filter:S(["M4 5.5h16l-6 7.5v5.5l-4 1.5v-7z"]),heart:S(["M12 19s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 2.5C19 14.6 12 19 12 19z"]),sparkle:S(["M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"]),zoom:S([{circle:[10.5,10.5,6]},"M15 15l5 5","M10.5 8v5","M8 10.5h5"]),arrows:S(["M4 12h16","M7.5 8.5L4 12l3.5 3.5","M16.5 8.5L20 12l-3.5 3.5"]),updown:S(["M12 4v16","M8.5 7.5L12 4l3.5 3.5","M8.5 16.5L12 20l3.5-3.5"]),archive:S(["M3.5 5h17v4h-17z","M5 9v10h14V9","M10 13h4"]),berry:S([{circle:[9,13,3.6]},{circle:[15,13,3.6]},{circle:[12,17.5,3.6]},"M12 9.5V5","M12 6.5c1.5-1.8 3.5-2 5-1.5"]),log:S([{circle:[7.5,12,3.8]},"M7.5 8.2h11a3.8 3.8 0 0 1 0 7.6h-11",{circle:[7.5,12,1.3]}]),hourglass:S(["M7 4h10","M7 20h10","M8 4c0 5 8 5 8 8s-8 3-8 8","M16 4c0 5-8 5-8 8s8 3 8 8"]),up:S(["M6 15l6-6 6 6"]),down:S(["M6 9l6 6 6-6"]),addImage:S(["M6 3.5h8l4 4v13H6z","M14 3.5v4h4","M9 16l2.5-3 2 2 1-1.2",{circle:[17.5,17.5,3.5]},"M17.5 16v3","M16 17.5h3"]),acorn:S(["M6 10.5h12a6 6 0 0 1-12 0z","M5.5 10.5c0-3 3-4.5 6.5-4.5s6.5 1.5 6.5 4.5z","M12 6V3.5"]),pinecone:S(["M12 3.5c3.5 3 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 1.5-7 5-10z","M8 11h8","M7.5 15h9","M10 7.5h4"]),feather:S(["M19 4.5C11 5 6 10 5.5 19.5","M19 4.5c.5 7-4 12-11 12.5","M9 14l4-4"]),pumpkin:S(["M12 7.5c-4.5 0-7 2.8-7 6s2.5 6 7 6 7-2.8 7-6-2.5-6-7-6z","M12 7.5v12","M12 7.5c0-2 1-3.5 2.5-4"]),candle:S(["M9 9.5h6v10.5H9z","M12 9.5V7","M12 3.5c1.3 1.3 1.3 2.7 0 3.5-1.3-.8-1.3-2.2 0-3.5z"]),cup:S(["M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z","M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16","M9 4.5c0 1.5 1 1.5 1 3","M12.5 4.5c0 1.5 1 1.5 1 3"]),cake:S(["M5 12h14v8H5z","M5 15.5c2.3 1.4 4.7 1.4 7 0s4.7-1.4 7 0","M12 12V8.5",{circle:[12,6.5,1.4]}]),scarf:S(["M6 5h12v5H6z","M13 10v9l3-1V10","M8 7.5h1M11 7.5h1M14 7.5h1"]),wheat:S(["M12 20.5V7","M12 7c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 7c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 12c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 12c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z","M12 17c-2 0-3-1.5-3-3.5 2 0 3 1.5 3 3.5zM12 17c2 0 3-1.5 3-3.5-2 0-3 1.5-3 3.5z"]),clover:S([{circle:[9.5,9.5,2.8]},{circle:[14.5,9.5,2.8]},{circle:[9.5,14.5,2.8]},{circle:[14.5,14.5,2.8]},"M14 17l3.5 4"]),spool:S(["M7 4.5h10","M7 19.5h10","M9 4.5v15","M15 4.5v15","M9 8l6 3M9 12l6 3"]),mushroom:S(["M4.5 12a7.5 7.5 0 0 1 15 0z","M10 12v6.5a2 2 0 0 0 4 0V12"])};var Ga={"wild-berry":g.berry,herb:g.leaf,wood:g.log,pinecone:g.pinecone,acorn:g.acorn,wheat:g.wheat,flower:g.flower,pumpkin:g.pumpkin,cotton:g.weather,"tea-leaf":g.sprout,honey:g.jar,mushroom:g.mushroom,beeswax:g.box,feather:g.feather,clover:g.clover,"berry-jam":g.jar,"dried-herb":g.leaf,flour:g.box,plank:g.log,thread:g.spool,"herb-tea":g.cup,"pumpkin-puree":g.pumpkin,"acorn-flour":g.acorn,"herb-sachet":g.heart,"berry-pie":g.cake,"wooden-tray":g.log,"beeswax-candle":g.candle,"knit-scarf":g.scarf,"flower-wreath":g.flower,"pumpkin-soup":g.cup,"honey-cake":g.cake,birdhouse:g.house,"acorn-cookie":g.acorn,"tea-gift":g.clover},se={gather:"\uCC44\uC9D1",grow:"\uC7AC\uBC30",survey:"\uC870\uC0AC",process:"\uAC00\uACF5",craft:"\uC81C\uC791"},ke={gather:g.leaf,grow:g.sprout,survey:g.search,process:g.jar,craft:g.hammer};function _(e,r){return e?.items.find(a=>a.id===r)?.name??r}function qa(e,r="icon"){return(Ga[e]??g.box)(r)}function B(e,r="small"){return t("span",{className:`item-tile ${r} item-${e}`,attrs:{"aria-hidden":"true"}},[E(Xt(e),{className:"item-art",lazy:!0,fallback:()=>qa(e,"icon")})])}function Me(e,r="big"){return E(Jt[e]??null,{className:`facility-image ${r}`,fallback:()=>g.house(`icon ${r}`)})}function te(e,r){return e?.recipes.find(a=>a.id===r)??null}function oe(e,r){return e?.facilities.find(a=>a.id===r)??null}function be(e){let r=Math.max(0,Math.ceil(e/1e3)),a=Math.floor(r/3600),i=Math.floor(r%3600/60),n=r%60,o=s=>String(s).padStart(2,"0");return a?`${a}:${o(i)}:${o(n)}`:`${o(i)}:${o(n)}`}function Pe(e){let r=e/36e5;return r>=10||Number.isInteger(r)?`${Math.floor(r)}`:r.toFixed(1)}function hr(e,r,a,i=0){return Math.max(6e4,Math.round(r.minutes*6e4/(1+e.production.speedBonusPerLevel*(a-1)+i)))}function ce(e,r){let a=Math.min(e.crew.maxBreakthrough,Math.max(0,r));return Math.round((e.crew.passiveBase+e.crew.passivePerBreakthrough*a)*1e3)/1e3}function pe(e,r,a){let i=new Set(Object.values(r.production.facilities).map(m=>m.residentId).filter(m=>m!==null)),n=Object.values(r.pairs).filter(m=>!m.archived&&m.residentIds.every(u=>i.has(u))).length,o=Math.min(e.crew.setBonusMax,Math.round(e.crew.setBonusPerPair*n*1e3)/1e3),s=r.production.facilities[a]?.residentId??null,l=s?r.residents[s]:void 0,p=l!==void 0&&l.field===oe(e,a)?.field,d=p?ce(e,l.breakthrough):0,c=p?me(e,l.talentId)??null:null;return{resident:l??null,matches:p,passive:d,set:o,talent:c,total:Math.round((d+o)*1e3)/1e3}}function me(e,r){return e?.talents.find(a=>a.id===r)}function qe(e,r){let a={...e.inputs},i=r.total,n=r.talent?.effect,o=!1;return n&&n.recipeId===e.id&&(o=!0,n.kind==="speed"?i+=n.bonus:a[n.itemId]!==void 0&&(a[n.itemId]=Math.max(1,a[n.itemId]-n.amount))),{extraBonus:Math.round(i*1e3)/1e3,inputs:a,talentApplies:o}}function U(e){return`${Math.round(e*1e3)/10}%`}function br(e,r,a){let i=oe(e,a)?.unlock;if(!i)return[];let n=[];if(i.facilityLevel){let o=r.production.facilities[i.facilityLevel.facilityId],s=o?.unlocked?o.level:0,l=i.facilityLevel.level,p=oe(e,i.facilityLevel.facilityId)?.name??"";n.push({text:`${p} Lv. ${l} \uC774\uC0C1`,have:s,need:l,met:s>=l})}if(i.made){let o=r.production.made[i.made.itemId]??0,s=i.made.amount;n.push({text:`${_(e,i.made.itemId)} ${s}\uAC1C \uB9CC\uB4E4\uAE30`,have:o,need:s,met:o>=s})}return n}function wr(e,r){return e.production.queueSlotLevels.filter(a=>r>=a).length}function pt(e,r){return Math.round((e?.production.speedBonusPerLevel??0)*(r-1)*100)}function _a(e,r,a){return e.worldReceivedAt+(a.endsSim-r.state.production.simMs)}function Ne(e,r,a){let i=_a(e,r,a),n=a.endsSim-a.startedSim,o=t("span",{className:"bar-fill",attrs:{"data-progress-end":String(i),"data-progress-total":String(n)}}),s=Math.max(0,i-Date.now());return o.style.width=`${Math.round((n-s)/Math.max(1,n)*100)}%`,{bar:t("span",{className:"bar teal"},[o]),countdown:t("span",{className:"countdown",text:be(s),attrs:{"data-countdown-end":String(i)}})}}function yr(e,r){if(!r)return"";if(r.reason==="no_rules")return"\uCF1C \uB454 \uC6B4\uC601 \uADDC\uCE59\uC774 \uC5C6\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="target_reached")return"\uBAA8\uB4E0 \uBAA9\uD45C \uC7AC\uACE0\uB97C \uCC44\uC6CC \uC26C\uACE0 \uC788\uC5B4\uC694. \uC7AC\uACE0\uAC00 \uC904\uBA74 \uB2E4\uC2DC \uC2DC\uC791\uD574\uC694.";if(r.reason==="queue_empty")return"\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC26C\uACE0 \uC788\uC5B4\uC694.";if(r.reason==="locked")return"\uC544\uC9C1 \uC5F4\uB9AC\uC9C0 \uC54A\uC740 \uC2DC\uC124\uC774\uC5D0\uC694.";let a=_(e,r.itemId??""),i=r.protectedAmount?` (\uBCF4\uD638 ${r.protectedAmount}\uAC1C\uB294 \uC4F0\uC9C0 \uC54A\uC544\uC694)`:"";return`${a} \uBD80\uC871\uC73C\uB85C \uAE30\uB2E4\uB9AC\uACE0 \uC788\uC5B4\uC694: \uD55C \uBC88\uC5D0 ${r.needed??"?"}\uAC1C \uD544\uC694, \uC4F8 \uC218 \uC788\uB294 \uC591 ${r.usable??0}\uAC1C${i}.`}function Ha(e,r,a,i,n){let o=e.content,s=d=>Math.max(0,(r.state.inventory[d]??0)-(r.state.production.protectedStock[d]??0)),l=Object.entries(a.items).every(([d,c])=>s(d)>=c),p=!!e.busy[`deliver:${a.id}`];return t("div",{className:`order${i?" done":""}`},[t("strong",{className:"order-title",text:a.title}),t("ul",{className:"order-items"},Object.entries(a.items).map(([d,c])=>{let m=r.state.inventory[d]??0,u=r.state.production.protectedStock[d]??0;return t("li",{className:s(d)>=c?"enough":"short"},[B(d),t("span",{text:`${_(o,d)} ${s(d)}/${c}`}),u?t("small",{className:"muted",text:`\uBCF4\uC720 ${m} \xB7 \uBCF4\uD638 ${u}`}):null])})),t("p",{className:"order-reward"},[g.ticket("icon tiny"),` \uCD08\uB300\uAD8C ${a.reward.tickets}\uC7A5 \xB7 ${a.reward.gold} G`]),i?t("span",{className:"status-pill done",text:"\uB0A9\uD488 \uC644\uB8CC"}):y(p?"\uB0A9\uD488\uD558\uB294 \uC911\u2026":l?"\uB0A9\uD488\uD558\uAE30":"\uC7AC\uB8CC\uAC00 \uBD80\uC871\uD574\uC694",()=>{n.deliver(a.id)},{disabled:p||!l,variant:l?void 0:"secondary"})])}function Ka(e,r,a,i,n){let o=e.sheet?.kind==="deliveries"?e.sheet.selectedOrderId:void 0,s=a.find(l=>l.id===o)??a.find(l=>!i.includes(l.id))??a[0];return s?t("div",{className:"delivery-board"},[t("div",{className:"delivery-choices",attrs:{role:"group","aria-label":"\uB0A9\uD488 \uC758\uB8B0 \uC120\uD0DD"}},a.map(l=>{let p=Object.keys(l.items)[0]??"";return t("button",{className:`delivery-choice${l.id===s.id?" selected":""}`,attrs:{type:"button","aria-pressed":l.id===s.id?"true":"false","aria-label":`${l.title}${i.includes(l.id)?" \uB0A9\uD488 \uC644\uB8CC":""}`},on:{click:()=>n.selectDelivery(l.id)}},[B(p),t("span",{text:l.title}),t("small",{text:i.includes(l.id)?"\uC644\uB8CC":`\uCD08\uB300\uAD8C ${l.reward.tickets} \xB7 ${l.reward.gold} G`})])})),Ha(e,r,s,i.includes(s.id),n)]):t("p",{className:"empty",text:"\uC624\uB298\uC758 \uC758\uB8B0\uAC00 \uC5C6\uC5B4\uC694."})}function vr(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.deliveries,n=!a||!i||i.state==="loading"?[P("\uC624\uB298\uC758 \uB0A9\uD488 \uC758\uB8B0\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:i.state==="error"?[ee(i.message)]:[t("p",{className:"muted",text:"\uC758\uB8B0\uB294 \uD558\uB8E8(UTC \uAE30\uC900)\uB9C8\uB2E4 \uBC14\uB00C\uC5B4\uC694. \uC9C0\uB09C \uB0A0\uC758 \uC758\uB8B0\uB294 \uBAA8\uC544 \uB450\uC9C0 \uC54A\uC544\uC694. \uBCF4\uD638\uD55C \uC7AC\uACE0\uB294 \uB0A9\uD488\uD558\uC9C0 \uC54A\uC544\uC694."}),Ka(e,a,i.value.orders,i.value.done,r)];return W("fw-deliveries","\uCD08\uB300\uAD8C \uBC1B\uAE30 \xB7 \uC624\uB298\uC758 \uB0A9\uD488",[...n,y("\uB2EB\uAE30",()=>r.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function xr(e){return t("span",{className:"lock-tag",attrs:{"aria-hidden":"true"}},[g.lock("icon tiny"),"\uC900\uBE44 \uC911"])}var Ua=[{label:"\uD648",icon:g.home,art:ve.home,routes:["home","settings","backup","diagnostics"]},{label:"\uC791\uC5C5",icon:g.hammer,art:ve.work,routes:["work","facilities"]},{label:"\uD0D0\uC0AC",icon:g.compass,art:ve.explore,routes:["explore","story"]},{label:"\uC8FC\uBBFC",icon:g.residents,art:ve.residents,routes:["residents","relations","resident-image"]},{label:"\uCD08\uB300",icon:g.ticket,art:ve.invite,routes:["invite"]}];function kr(e,r){return t("nav",{className:"tabbar",attrs:{"aria-label":"\uACF5\uBC29 \uBA54\uB274"}},Ua.map(a=>{let i=a.feature?et(a.feature):!1,n=a.routes.includes(e.route);return t("button",{className:`tab${n?" current":""}${i?" is-locked":""}`,attrs:{type:"button","aria-current":n?"page":void 0,"aria-label":i?`${a.label} (\uC900\uBE44 \uC911)`:a.label},on:{click:()=>{i&&a.feature?r.notifyLocked(a.feature):a.routes[0]==="residents"?r.openResidents():a.routes[0]&&r.navigate(a.routes[0])}}},[t("span",{className:"tab-icon"},[E(a.art,{className:"tab-glyph tab-art",fallback:()=>a.icon("icon tab-glyph")}),i&&a.feature?xr(a.feature):null]),t("span",{className:"tab-label",text:a.label})])}))}function Ya(e,r){let i=(e.world?.state==="ready"?e.world.value:null)?.state.wallet.tickets??0;return t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${i}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>r.openDeliveries()}},[t("span",{className:"ticket-mark"},[g.ticket("icon")]),t("span",{className:"counter-value",text:String(i)})])}function Nr(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let i=a.state.wallet.gold.toLocaleString("ko-KR");return t("div",{className:"resources"},[t("span",{className:"counter gold",attrs:{"aria-label":`\uACE8\uB4DC ${i}`}},[t("span",{className:"coin",attrs:{"aria-hidden":"true"}}),t("span",{className:"counter-value",text:i})]),Ya(e,r),e.route==="settings"?null:t("button",{className:"icon-button gear",attrs:{type:"button","aria-label":"\uC124\uC815"},on:{click:()=>r.navigate("settings")}},[g.gear()])])}function Sr(e,r,a){if(a.kind==="home"){let n=e.world?.state==="ready"&&(e.world.value.state.mailbox?.letters.some(l=>!l.readAt&&!l.archived)??!1),o=e.liveWeather?.state==="ready"?e.liveWeather.value:null,s=o?`${o.temperature}\xB0 \xB7 ${je[o.kind]}${e.weatherError?" (\uC774\uC804 \uC815\uBCF4)":""}`:"\uB0A0\uC528 \uD655\uC778 \uC911";return t("header",{className:"top top-home"},[t("div",{className:"top-row"},[t("h1",{className:"sign sign-home",attrs:{id:"fw-screen-title"}},[t("span",{className:"sign-title",text:"\uC232\uACB0 \uACF5\uBC29"})]),Nr(e,r)]),t("div",{className:"top-row second"},[t("div",{className:"season-weather"},[t("span",{className:"season-badge",text:$e[K(e)],attrs:{"aria-label":`\uD604\uC7AC \uACC4\uC808 ${$e[K(e)]}`}}),t("button",{className:"chip-button weather",attrs:{type:"button","aria-label":`${s} \u2014 \uB3C4\uC2DC \uC124\uC815`},on:{click:()=>{r.setSettingsSection("workshop"),r.navigate("settings")}}},[E(Be[o?.kind==="clear"?"sun":!o||o.kind==="cloudy"?"cloud":o.kind],{className:"icon",fallback:()=>g.weather()}),t("span",{text:s})])]),t("button",{className:"icon-button mail",attrs:{type:"button","aria-label":n?"\uC6B0\uD3B8\uD568 \xB7 \uC0C8 \uD3B8\uC9C0 \uC788\uC74C":"\uC6B0\uD3B8\uD568"},on:{click:()=>r.openMailbox()}},[g.mail(),n?t("span",{className:"mail-new",attrs:{"aria-hidden":"true"}},[g.sparkle("icon tiny")]):null])])])}let i=a.back;return t("header",{className:`top top-sub${a.resources||a.counters?" with-resources":""}`},[t("div",{className:"top-row"},[i?t("button",{className:"back-button",attrs:{type:"button","aria-label":`${i.label}(\uC73C)\uB85C \uB3CC\uC544\uAC00\uAE30`},on:{click:()=>r.navigate(i.route)}},[g.back()]):t("span",{className:"back-spacer",attrs:{"aria-hidden":"true"}}),t("h1",{className:"sign",attrs:{id:"fw-screen-title"}},[t("span",{className:"sign-title",text:a.title})]),a.resources?Nr(e,r):a.counters??null]),a.subtitle?t("p",{className:"ribbon",text:a.subtitle}):null])}function Ja(e,r){return e.notice?t("div",{className:`notice ${e.notice.kind}`,attrs:{role:e.notice.kind==="error"?"alert":"status"}},[t("p",{text:e.notice.text}),t("button",{className:"notice-close",text:"\uB2EB\uAE30",attrs:{type:"button","aria-label":"\uC54C\uB9BC \uB2EB\uAE30"},on:{click:()=>r.dismissNotice()}})]):null}function T(e,r,a){return t("div",{className:`shell backdrop-${a.backdrop} season-${K(e)}${pr(e)}${a.nav?" has-nav":""}${a.homeLayout?" home-layout":""}${a.storyLayout?" story-layout":""}${e.notice?" has-notice":""}`},[t("div",{className:"scroll"},[t("div",{className:"column"},[Sr(e,r,a.top),a.hero??null,t("main",{className:"page",attrs:{"aria-labelledby":"fw-screen-title"}},a.body)])]),Ja(e,r),a.nav?kr(e,r):null,a.sheet??(e.sheet?.kind==="mailbox"?ur(e,r):e.sheet?.kind==="guidelines"?gr(e,r):e.sheet?.kind==="memory"?fr(e,r):e.sheet?.kind==="deliveries"?vr(e,r):null)])}function M(e,r,a={}){return t("section",{className:`card ${a.className??""}`.trim(),attrs:a.id?{"aria-labelledby":a.id}:{}},[e?t("h2",{className:"section-title",text:e,attrs:a.id?{id:a.id}:{}}):null,...r])}var _e="/forest-workshop/p0",Xa={pass:"\uD1B5\uACFC",fail:"\uC2E4\uD328",unavailable:"\uC0AC\uC6A9 \uBD88\uAC00"};function R(e,r={},a=[]){let i=document.createElement(e);r.className&&(i.className=r.className),r.text!==void 0&&(i.textContent=r.text);for(let[n,o]of Object.entries(r.attrs??{}))i.setAttribute(n,o);for(let n of a)n&&i.append(n);return i}var He=class{constructor(){V(this,"node",R("div",{className:"diagnostics"}));V(this,"started",!1);V(this,"status",{state:"loading"});V(this,"probe",null);V(this,"image",{state:"loading"});V(this,"uploading",!1);V(this,"uploadError",null);V(this,"pendingUpload",null)}start(){this.started||(this.started=!0,this.render(),this.loadStatus(),this.loadImage())}async loadStatus(){this.status={state:"loading"},this.render();try{this.status={state:"ready",value:await z().get(`${_e}/status`)}}catch(r){this.status={state:"error",message:G(r,"\uD328\uD0A4\uC9C0 \uC0C1\uD0DC\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async loadImage(){this.image={state:"loading"},this.render();try{let r=await z().get(`${_e}/image`);this.image={state:"ready",value:r.current}}catch(r){this.image={state:"error",message:G(r,"\uC800\uC7A5\uB41C \uADF8\uB9BC\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}async runProbe(){if(this.probe?.state!=="loading"){this.probe={state:"loading"},this.render();try{let r=await z().post(`${_e}/probe`);this.probe={state:"ready",value:r.checks}}catch(r){this.probe={state:"error",message:G(r,"\uC5F0\uACB0 \uC810\uAC80\uC744 \uC2E4\uD589\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.")}}this.render()}}async upload(r){if(this.uploading)return;let a=this.pendingUpload?.file===r?this.pendingUpload:{file:r,key:Oe()};this.pendingUpload=a,this.uploading=!0,this.uploadError=null,this.render();try{let i=new FormData;i.append("uploadKey",a.key),i.append("file",r,r.name);let n=await z().upload(`${_e}/image`,i);this.image={state:"ready",value:n.image},this.pendingUpload=null}catch(i){this.uploadError=G(i,"\uADF8\uB9BC\uC744 \uC62C\uB9AC\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC785\uB2C8\uB2E4.")}finally{this.uploading=!1,this.render()}}render(){this.node.replaceChildren(R("p",{className:"muted",text:"\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C\uB97C \uD655\uC778\uD569\uB2C8\uB2E4. \uACB0\uACFC\uB294 \uC138\uACC4\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),this.renderStatus(),this.renderProbe(),this.renderImage())}retryButton(r,a){let i=R("button",{className:"button secondary",text:r,attrs:{type:"button"}});return i.addEventListener("click",a),i}renderStatus(){let r=R("section",{className:"card",attrs:{"aria-labelledby":"fw-status"}},[R("h2",{text:"\uC5D4\uC9C4 \uC5F0\uACB0",attrs:{id:"fw-status"}})]);if(this.status.state==="loading")r.append(R("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.status.state==="error")r.append(R("p",{className:"error",text:this.status.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.loadStatus()}));else{let{value:a}=this.status;r.append(R("p",{className:"muted",text:`\uD328\uD0A4\uC9C0 ${a.version} \xB7 \uB2E8\uACC4 ${a.stage}`}),R("ul",{className:"list"},a.host.map(i=>R("li",{className:"row"},[R("span",{className:"name",text:i.name}),R("span",{className:`badge ${i.available?"pass":i.required?"fail":"unavailable"}`,text:i.available?"\uC788\uC74C":i.required?"\uC5C6\uC74C (\uD544\uC218)":"\uC5C6\uC74C"})]))))}return r}renderProbe(){let r=R("button",{className:"button",text:this.probe?.state==="loading"?"\uC810\uAC80 \uC911\u2026":"\uC5F0\uACB0 \uC810\uAC80 \uC2E4\uD589",attrs:{type:"button"}});r.disabled=this.probe?.state==="loading",r.addEventListener("click",()=>{this.runProbe()});let a=R("section",{className:"card",attrs:{"aria-labelledby":"fw-probe"}},[R("h2",{text:"\uC800\uC7A5\xB7\uC790\uB8CC\xB7\uBAA8\uB378 \uC810\uAC80",attrs:{id:"fw-probe"}}),R("p",{className:"muted",text:"\uC784\uC2DC \uBB38\uC11C\uB97C \uC4F0\uACE0 \uC9C0\uC6C1\uB2C8\uB2E4. \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uBA70, \uBAA8\uB378 \uC0DD\uC131 \uC694\uCCAD\uC740 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),r]);return!this.probe||this.probe.state==="loading"?a:this.probe.state==="error"?(a.append(R("p",{className:"error",text:this.probe.message,attrs:{role:"alert"}})),a):(a.append(R("ul",{className:"list",attrs:{"aria-live":"polite"}},this.probe.value.map(i=>R("li",{className:"row stacked"},[R("div",{className:"row-head"},[R("span",{className:"name",text:i.label}),R("span",{className:`badge ${i.status}`,text:Xa[i.status]})]),R("span",{className:"detail",text:i.detail})])))),a)}renderImage(){let r=R("input",{className:"file",attrs:{type:"file",accept:"image/png,image/webp",id:"fw-file"}});r.disabled=this.uploading,r.addEventListener("change",()=>{let i=r.files?.[0];i&&this.upload(i)});let a=R("section",{className:"card",attrs:{"aria-labelledby":"fw-image"}},[R("h2",{text:"\uC8FC\uBBFC \uADF8\uB9BC \uC800\uC7A5 \uC810\uAC80",attrs:{id:"fw-image"}}),R("p",{className:"muted",text:"PNG \uB610\uB294 \uC815\uC801 WebP(\uCD5C\uB300 20MiB, 4096\xD74096)\uB97C \uACE0\uB974\uBA74 \uD22C\uBA85\uB3C4\uB97C \uC720\uC9C0\uD55C WebP \uD488\uC9C895\uB85C \uBC14\uAFD4 \uC804\uC5ED \uAC24\uB7EC\uB9AC\uC5D0 \uC800\uC7A5\uD569\uB2C8\uB2E4. PNG \uC6D0\uBCF8\uC740 \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."}),R("label",{className:"field-label",text:"\uADF8\uB9BC \uD30C\uC77C \uACE0\uB974\uAE30",attrs:{for:"fw-file"}}),r]);if(this.uploading&&a.append(R("p",{className:"muted",text:"\uBCC0\uD658\uD558\uACE0 \uC800\uC7A5\uD558\uB294 \uC911\u2026",attrs:{role:"status"}})),this.uploadError){a.append(R("p",{className:"error",text:this.uploadError,attrs:{role:"alert"}}));let i=this.pendingUpload;i&&!this.uploading&&a.append(this.retryButton("\uAC19\uC740 \uD30C\uC77C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>{this.upload(i.file)}))}if(this.image.state==="loading")a.append(R("p",{className:"muted",text:"\uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}}));else if(this.image.state==="error")a.append(R("p",{className:"error",text:this.image.message,attrs:{role:"alert"}}),this.retryButton("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{this.loadImage()}));else if(!this.image.value)a.append(R("p",{className:"empty",text:"\uC544\uC9C1 \uC800\uC7A5\uB41C \uADF8\uB9BC\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}));else{let i=this.image.value,n=R("img",{className:"preview",attrs:{src:`${i.url}${i.url.includes("?")?"&":"?"}v=${i.imageVersion}`,alt:"\uC800\uC7A5\uB41C \uC8FC\uBBFC \uADF8\uB9BC \uBBF8\uB9AC\uBCF4\uAE30",width:String(i.width),height:String(i.height)}});a.append(R("div",{className:"stage"},[n]),R("dl",{className:"facts"},[R("dt",{text:"\uCC38\uC870"}),R("dd",{text:i.reference}),R("dt",{text:"\uD06C\uAE30"}),R("dd",{text:`${i.width}\xD7${i.height}`}),R("dt",{text:"\uC6A9\uB7C9"}),R("dd",{text:`\uC785\uB825 ${lt(i.inputBytes)} \u2192 WebP ${lt(i.outputBytes)}`}),R("dt",{text:"\uD22C\uBA85\uB3C4"}),R("dd",{text:i.hasTransparency?"\uD22C\uBA85 \uC601\uC5ED \uC788\uC74C (\uC720\uC9C0\uB428)":"\uBD88\uD22C\uBA85 \uADF8\uB9BC"}),R("dt",{text:"\uBC84\uC804"}),R("dd",{text:String(i.imageVersion)})]))}return a}};function ge(e){return!!e.groundEditingWorld&&e.world?.state==="ready"&&e.groundEditingWorld===e.world.value.worldId}function $r(e,r,a){if(e.world?.state!=="ready")return null;let i=e.world.value,n={...e.settingsGroundDraft?.worldId===i.worldId?e.settingsGroundDraft.value:i.state.settings.ground},o=t("div",{className:"ground-overlay",attrs:{"aria-label":"\uD648 \uC774\uB3D9\uC601\uC5ED \uD3B8\uC9D1"}}),s=t("div",{className:"ground-selection"},[t("span",{className:"ground-caption",text:"\uC8FC\uBBFC \uC774\uB3D9 \uAC00\uB2A5 \uC601\uC5ED"})]),l=()=>{let p=`left:${n.left}%;top:${n.top}%;width:${n.right-n.left}%;height:${n.bottom-n.top}%;`;s.style.cssText=p,a&&(a.style.cssText=p+"right:auto;bottom:auto;padding:0;")};for(let[p,d]of[["left","\uC67C\uCABD"],["right","\uC624\uB978\uCABD"],["top","\uC704\uCABD"],["bottom","\uC544\uB798\uCABD"]]){let c=t("button",{className:`ground-handle ${p}`,text:p==="left"||p==="right"?"\u2194":"\u2195",attrs:{type:"button","aria-label":`\uC774\uB3D9\uC601\uC5ED ${d} \uACBD\uACC4 \uC870\uC808`}}),m=u=>{let f=p==="left"?0:p==="right"?n.left+20:p==="top"?35:Math.max(55,n.top+10),w=p==="left"?n.right-20:p==="right"?100:p==="top"?Math.min(85,n.bottom-10):100;n[p]=Math.round(Math.max(f,Math.min(w,u))),r.rememberGround(i.worldId,n),c.setAttribute("aria-label",`\uC774\uB3D9\uC601\uC5ED ${d} \uACBD\uACC4 ${n[p]}%`),l()};c.addEventListener("pointerdown",u=>{u.button===0&&(u.preventDefault(),c.setPointerCapture(u.pointerId))}),c.addEventListener("pointermove",u=>{if(!c.hasPointerCapture(u.pointerId))return;let f=o.getBoundingClientRect();!f.width||!f.height||m(p==="left"||p==="right"?(u.clientX-f.left)/f.width*100:(u.clientY-f.top)/f.height*100)}),c.addEventListener("pointerup",u=>{c.hasPointerCapture(u.pointerId)&&c.releasePointerCapture(u.pointerId)}),c.addEventListener("keydown",u=>{let f=u.key==="ArrowLeft"||u.key==="ArrowUp"?-1:u.key==="ArrowRight"||u.key==="ArrowDown"?1:0;f&&(u.preventDefault(),m(n[p]+f))}),s.append(c)}return o.append(s),l(),o}function Ir(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let i=!!e.busy["ground-save"];return t("div",{className:"ground-actions"},[t("p",{text:"\uBC30\uACBD \uC704 \uACBD\uACC4\uB97C \uB04C\uC5B4 \uC8FC\uBBFC\uC774 \uB2E4\uB2D0 \uACF3\uC744 \uC815\uD574 \uC8FC\uC138\uC694. \uC800\uC7A5 \uC804\uC5D0\uB294 \uC801\uC6A9\uB418\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"ground-action-row"},[y("\uAE30\uBCF8 \uBC94\uC704",()=>r.resetGroundEditor(),{variant:"secondary",disabled:i}),y("\uCDE8\uC18C",()=>r.cancelGroundEditor(),{variant:"secondary",disabled:i}),y(i?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{r.saveGround(r.store.get().settingsGroundDraft?.value??a.state.settings.ground)},{disabled:i})])])}var Qa="http://www.w3.org/2000/svg";function Cr(e){let r=document.createElementNS(Qa,"svg");return r.setAttribute("viewBox","0 0 60 80"),r.setAttribute("aria-hidden","true"),r.setAttribute("class",e),r.innerHTML='<circle cx="30" cy="24" r="15"/><path d="M6 80c0-17 11-29 24-29s24 12 24 29z"/>',r}function Rr(e,r){let a=e.image.current;return t("img",{className:r,attrs:{src:`${a.url}${a.url.includes("?")?"&":"?"}v=${encodeURIComponent(a.reference)}`,alt:"",width:String(a.width),height:String(a.height),decoding:"async",draggable:"false"}})}function mt(e){return{bottom:Math.max(15,Math.min(82,4+e.scale*.9-12+e.markerHeight*.4)),left:Math.max(10,Math.min(90,50+e.offsetX*.5))}}function re(e,r={}){let a=r.placement??e.image.placement,i=t("span",{className:"figure",attrs:{"aria-hidden":"true"}});if(!e.image.current)i.append(t("span",{className:"figure-empty"},[Cr("figure-silhouette"),t("span",{className:"figure-empty-text",text:"\uADF8\uB9BC \uC5C6\uC74C"})]));else{let n=t("span",{className:"figure-body"},[Rr(e,"figure-image")]);n.style.height=`${a.scale*.9}%`,n.style.left=`${50+a.offsetX*.5}%`,i.append(n)}if(r.marker){let n=t("span",{className:"emotion-bubble",text:"?"}),o=mt(a);n.style.bottom=`${o.bottom}%`,n.style.left=`${o.left}%`,i.append(n)}return i}function D(e,r="small"){let a=t("span",{className:`avatar ${r}`,attrs:{"aria-hidden":"true"}});return e?.image.current?a.append(Rr(e,"avatar-image")):(a.append(Cr("avatar-silhouette")),e||a.append(t("span",{className:"avatar-unknown",text:"?"}))),a}var Ee={character:"\uCE90\uB9AD\uD130",persona:"\uD398\uB974\uC18C\uB098"};function Q(e){return t("span",{className:`tag ${e.kind}`,text:Ee[e.kind]})}function Ar(e){let r=Z(e.weatherEffects);if(!r.enabled)return null;let a=(i,n)=>E(Be[i],{className:n,fallback:()=>t("span")});return t("div",{className:`weather-layer weather-${r.kind}`,attrs:{"aria-hidden":"true"}},[r.kind==="clear"?le(e).phase==="night"?t("span",{className:"weather-moon"}):a("sun","weather-sun"):a("cloud","weather-cloud"),...r.kind==="rain"||r.kind==="snow"?Array.from({length:r.kind==="rain"?10:8},(i,n)=>{let o=t("span",{className:"weather-particle"},[a(r.kind==="snow"?"snow":"rain","weather-sprite")]);return o.style.cssText=`--weather-x:${5+n*37%90}%;--weather-delay:${-n*.47}s;--weather-duration:${r.kind==="snow"?7+n%3:2+n%3}s;--weather-top:${12+n*19%72}%;`,o}):[]])}var Za="http://www.w3.org/2000/svg";function ei(){let e=document.createElementNS(Za,"svg");return e.setAttribute("viewBox","0 0 390 300"),e.setAttribute("preserveAspectRatio","xMidYMax slice"),e.setAttribute("aria-hidden","true"),e.setAttribute("class","scene-art"),e.innerHTML=`
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
      <rect width="390" height="300" fill="#cfe5c0" stroke="none"/>
      <path d="M-10 70 Q20 10 70 30 Q100 -10 150 20 L150 -10 H-10z" fill="#8fbf6e"/>
      <path d="M400 80 Q370 20 320 40 Q300 -5 250 15 L250 -10 H400z" fill="#e2a55a"/>
      <circle cx="60" cy="120" r="34" fill="#8fbf6e"/>
      <circle cx="335" cy="115" r="30" fill="#8fbf6e"/>
      <path d="M-5 215 Q100 188 200 203 T395 198 V305 H-5z" fill="#a9cc86"/>
      <g transform="translate(150 70)">
        <rect x="0" y="62" width="170" height="108" rx="6" fill="#b98250"/>
        <rect x="10" y="74" width="150" height="96" fill="#dcb07c"/>
        <path d="M-22 70 L85 8 L192 70 Z" fill="#3f8a86"/>
        <path d="M10 62 L85 20 L160 62" fill="none" stroke-width="2.5"/>
        <rect x="66" y="104" width="38" height="66" rx="4" fill="#7a4b2a"/>
        <rect x="20" y="96" width="34" height="30" rx="3" fill="#f8de98"/>
        <rect x="116" y="96" width="34" height="30" rx="3" fill="#f8de98"/>
        <rect x="56" y="78" width="58" height="18" rx="3" fill="#f6e9cb"/>
        <circle cx="147" cy="84" r="7" fill="#f5c45c"/>
      </g>
      <path d="M150 305 Q190 240 235 240 Q280 240 302 305z" fill="#ead6a8"/>
      <circle cx="40" cy="232" r="25" fill="#6fa452"/><circle cx="76" cy="248" r="19" fill="#6fa452"/>
      <circle cx="350" cy="232" r="23" fill="#6fa452"/><circle cx="318" cy="250" r="17" fill="#6fa452"/>
      <g stroke-width="2"><circle cx="30" cy="224" r="4" fill="#fff6e4"/><circle cx="54" cy="240" r="4" fill="#fff6e4"/>
      <circle cx="345" cy="226" r="4" fill="#fff6e4"/><circle cx="326" cy="246" r="4" fill="#fff6e4"/>
      <circle cx="70" cy="232" r="4" fill="#d5a9e3"/><circle cx="360" cy="246" r="4" fill="#d5a9e3"/></g>
    </g>`,e}function ti(e){let r=e.progress.starterResidentId;return Object.values(e.residents).filter(a=>a.recruited).sort((a,i)=>+(i.residentId===r)-+(a.residentId===r)||a.registeredAt.localeCompare(i.registeredAt)).slice(0,2)}function Mr(e,r,a,i){if(r){let n=t("div",{className:"resident-reaction",attrs:{hidden:""}}),o,s=t("button",{className:"resident-touch",attrs:{type:"button","aria-label":`${r.displayName}\uC5D0\uAC8C \uC778\uC0AC\uD558\uAE30`},on:{click:()=>{n.hidden=!1,clearTimeout(o),o=setTimeout(()=>{n.hidden=!0},1600)}}},[re(r)]);return n.append(E(Ae.joy,{className:"resident-greeting",alt:"\uBC18\uAC00\uC6C0",fallback:()=>t("span",{className:"resident-greeting",text:"\u266A",attrs:{"aria-label":"\uBC18\uAC00\uC6C0"}})})),t("div",{className:`resident-spot filled ${e}`},[s,n])}if(a.progress.starterResidentId===null&&e==="left"){let n=Object.keys(a.residents).length>0;return t("button",{className:`resident-spot invite ${e}`,attrs:{type:"button"},on:{click:()=>i.openRegister(n?3:1)}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:n?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"})])}return t("button",{className:`resident-spot ${e}`,attrs:{type:"button","aria-label":"\uBE48 \uC790\uB9AC \u2014 \uCD08\uB300\uB85C \uC0C8 \uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30"},on:{click:()=>i.navigate("invite")}},[t("span",{className:"spot-shadow"}),t("span",{className:"spot-text",text:"\uCD08\uB300"})])}function ri(e,r){return t("div",{className:"scene-props"},[t("button",{className:"scene-board",disabled:r,attrs:{type:"button","aria-label":"\uACF5\uBC29 \uAC8C\uC2DC\uD310 \u2014 \uC624\uB298\uC758 \uB0A9\uD488",title:"\uC624\uB298\uC758 \uB0A9\uD488 \uC758\uB8B0"},on:{click:()=>e.openDeliveries()}},[E(F.deliveryBoard,{className:"board-art",fallback:()=>g.document("icon board-art")})])])}function Pr(e,r){let a=e.world?.state==="ready"?e.world.value.state:null,i=a?ti(a):[],n=a?.settings.ground??{left:12,right:88,top:58,bottom:90},o=a?t("div",{className:"scene-stage ground-stage"},[Mr("left",i[0]??null,a,r),Mr("right",i[1]??null,a,r)]):null;o&&(o.style.cssText=`left:${n.left}%;top:${n.top}%;width:${n.right-n.left}%;height:${n.bottom-n.top}%;right:auto;bottom:auto;padding:0;`);let s=t("section",{className:`scene scene-${le(e).phase}${ge(e)?" editing-ground":""}`,attrs:{"aria-label":"\uACF5\uBC29 \uC7A5\uBA74"}},[t("div",{className:"scene-scenery"},[E(Re[K(e)].scene,{className:"scene-art",fallback:ei}),a?ri(r,ge(e)):null]),ge(e)?null:Ar(e),o,ge(e)?$r(e,r,o):a?t("button",{className:"ground-launch icon-button",attrs:{type:"button","aria-label":"\uC9C0\uBA74 \uD3B8\uC9D1",title:"\uC9C0\uBA74 \uD3B8\uC9D1"},on:{click:()=>r.openGroundEditor()}},[g.pencil("icon")]):null,i.length===0?t("p",{className:"scene-caption"},[g.leaf("icon tiny"),"\uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uC774\uACF3\uC5D0 \uBAA8\uC5EC\uC694"]):null]);return s.dataset.homeScene=JSON.stringify([e.world?.state==="ready"?e.world.value.worldId:null,K(e),le(e).phase,Z(e.weatherEffects),i,n,ge(e)]),s}function ai(e,r){return e.items.find(a=>a.id===r)?.name??r}function Er(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.content;if(!a||!i||a.state.progress.starterKitClaimed||e.starterSheetHidden)return null;let n=!!e.busy["claim-starter-kit"],o=i.starterKit;return t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-starter"}},[t("div",{className:"kit-heading"},[E(F.gift,{className:"kit-gift",fallback:()=>g.box("icon kit-gift")}),t("h2",{className:"section-title",text:"\uACF5\uBC29 \uC2DC\uC791 \uAFB8\uB7EC\uBBF8",attrs:{id:"fw-starter"}})]),t("p",{className:"muted",text:"\uCCAB \uCC44\uC9D1\uACFC \uAC00\uACF5\uC744 \uC2DC\uC791\uD560 \uC7AC\uB8CC\uC608\uC694. \uD55C \uBC88\uB9CC \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694."}),t("ul",{className:"kit"},[t("li",{className:"kit-item"},[t("span",{className:"coin"}),t("span",{text:"\uACE8\uB4DC"}),t("strong",{text:o.gold.toLocaleString("ko-KR")})]),o.tickets?t("li",{className:"kit-item"},[g.ticket("icon"),t("span",{text:"\uCD08\uB300\uAD8C"}),t("strong",{text:`${o.tickets}\uC7A5`})]):null,...Object.entries(o.items).map(([s,l])=>t("li",{className:"kit-item"},[B(s),t("span",{text:ai(i,s)}),t("strong",{text:l.toLocaleString("ko-KR")})]))]),y(n?"\uBC1B\uB294 \uC911\u2026":"\uBC1B\uAE30",()=>{r.runCommand("claim-starter-kit","onboarding.claimStarterKit")},{disabled:n,attrs:{"data-wide":""}}),y("\uB098\uC911\uC5D0",()=>r.hideStarterSheet(),{variant:"secondary",attrs:{"data-wide":""}})])])}function Wr(e){let r=e.state.production.reportsReadThrough;return e.state.production.reports.filter(a=>a.reportId>r)}function Ke(e,r){let a={};for(let i of e)for(let[n,o]of Object.entries(i[r]))a[n]=(a[n]??0)+o;return a}function ii(e){let r=Object.values(e.state.production.facilities);return r.some(a=>a.waiting?.reason==="materials")?"\uC7AC\uB8CC\uB97C \uAE30\uB2E4\uB9AC\uB294 \uC2DC\uC124\uC774 \uC788\uC5B4\uC694":r.some(a=>a.job)?"\uACF5\uBC29\uC774 \uC798 \uB3CC\uC544\uAC00\uACE0 \uC788\uC5B4\uC694":"\uACF5\uBC29\uC774 \uC26C\uACE0 \uC788\uC5B4\uC694"}function Tr(e,r,a){let i=Wr(e),n=Object.entries(Ke(i,"produced")).sort(([,s],[,l])=>l-s),o=s=>s?t("div",{className:"report-slot"},[B(s[0],"big"),t("span",{className:"slot-name",text:_(r,s[0])}),t("strong",{text:`+${s[1]}`})]):t("div",{className:"report-slot empty"},[t("span",{className:"slot-art"}),t("span",{className:"slot-name",text:"\uC0C8 \uC785\uACE0 \uC5C6\uC74C"}),t("strong",{text:"\u2013"})]);return M(null,[t("h2",{className:"report-title",text:ii(e)}),t("div",{className:"report-body"},[t("div",{className:"report-items"},[o(n[0]),o(n[1])]),t("div",{className:"report-actions"},[t("button",{className:"button report-button",attrs:{type:"button"},on:{click:()=>a.openSheet({kind:"work-report"})}},[t("span",{text:"\uC791\uC5C5 \uBCF4\uACE0"}),i.length?t("span",{className:"count-badge",text:String(i.length)}):null,g.chevron("icon")]),t("span",{className:"report-caption"},[g.leaf("icon tiny"),"\uC790\uB3D9 \uC785\uACE0 \uC644\uB8CC"])])])],{className:"report-card"})}function zr(e,r,a){let i=e.state.production.activity.lastAbsence,n=r?.production.absenceLimitMs??72*36e5;return t("button",{className:"strip offline",attrs:{type:"button"},on:{click:()=>a.notify(i&&i.totalMs>i.creditedMs?`\uC9C0\uB09C\uBC88\uC5D4 ${Pe(i.totalMs)}\uC2DC\uAC04 \uBE44\uC6E0\uACE0, \uADF8\uC911 \uCD5C\uB300 72\uC2DC\uAC04\uB9CC \uACF5\uBC29\uC774 \uC77C\uD588\uC5B4\uC694. \uB0A8\uC740 \uC791\uC5C5\uC740 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uC774\uC5B4\uC838\uC694.`:"\uC790\uB9AC\uB97C \uBE44\uC6B4 \uB3D9\uC548\uC5D0\uB3C4 \uCD5C\uB300 72\uC2DC\uAC04\uAE4C\uC9C0 \uACF5\uBC29\uC774 \uC77C\uD574\uC694. \uADF8 \uB4A4\uC5D4 \uBA48\uCD98 \uC790\uB9AC\uC5D0\uC11C \uAE30\uB2E4\uB824\uC694.")}},[g.clock(),t("span",{},["\uBBF8\uC811\uC18D \uB204\uC801 ",t("strong",{text:`${i?Pe(i.creditedMs):"0"}\uC2DC\uAC04`}),` / \uCD5C\uB300 ${Pe(n)}\uC2DC\uAC04`]),g.info("icon muted-icon")])}function ni(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(r)}function Se(e,r,a){let i=Object.entries(r);return t("span",{className:"report-items"},i.length?i.map(([n,o])=>t("span",{className:"report-item"},[B(n),t("span",{text:`${_(e,n)} ${a}${o}`})])):[t("span",{text:"\uC5C6\uC74C"})])}function Lr(e,r,a){let i=e.content,n=r.state.production.reports,o=Wr(r),s=!!e.busy["reports-read"];return W("fw-work-report","\uC791\uC5C5 \uBCF4\uACE0",[t("p",{className:"muted",text:"\uBB3C\uAC74\uC740 \uCC3D\uACE0\uC5D0 \uC790\uB3D9 \uC785\uACE0\uB410\uC5B4\uC694. \uD655\uC778\uD558\uBA74 \uBCF4\uACE0\uB9CC \uC77D\uC74C\uC73C\uB85C \uD45C\uC2DC\uD574\uC694."}),o.length?t("div",{className:"report-total"},[t("p",{},[t("strong",{text:"\uC0C8\uB85C \uB4E4\uC5B4\uC628 \uAC83 "}),Se(i,Ke(o,"produced"),"+")]),t("p",{},[t("strong",{text:"\uC7AC\uB8CC\uB85C \uC4F4 \uAC83 "}),Se(i,Ke(o,"consumed"),"\u2212")]),o.some(l=>l.gold>0)?t("p",{},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4 "}),Se(i,Ke(o,"sold"),"\u2212"),t("span",{text:` \u2192 +${o.reduce((l,p)=>l+p.gold,0)} G`})]):null]):t("p",{className:"empty",text:"\uC0C8 \uBCF4\uACE0\uAC00 \uC5C6\uC5B4\uC694."}),n.length?t("details",{className:"detail-help"},[t("summary",{text:"\uCD5C\uADFC \uC791\uC5C5 \uB0B4\uC5ED"}),t("ol",{className:"report-list"},n.slice(0,10).map(l=>t("li",{className:`report-entry${l.reportId>r.state.production.reportsReadThrough?" new":""}`},[t("span",{className:"report-time",text:`${ni(l.at)}${l.offlineMs?` \xB7 \uBE44\uC6B4 \uB3D9\uC548 ${Pe(l.offlineMs)}\uC2DC\uAC04`:""}`}),l.runs?t("span",{text:`${l.runs}\uD68C \uC644\uB8CC`}):null,Object.keys(l.produced).length?t("div",{},[t("strong",{text:"\uB4E4\uC5B4\uC634 "}),Se(i,l.produced,"+")]):null,Object.keys(l.consumed).length?t("div",{},[t("strong",{text:"\uC7AC\uB8CC "}),Se(i,l.consumed,"\u2212")]):null,l.gold?t("div",{},[t("strong",{text:"\uC790\uB3D9 \uD310\uB9E4 "}),Se(i,l.sold,"\u2212"),t("span",{text:` +${l.gold} G`})]):null])))]):null,o.length?y(s?"\uD655\uC778\uD558\uB294 \uC911\u2026":"\uD655\uC778",()=>{a.readReports(n[0].reportId)},{disabled:s,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function jr(e,r){let a=n=>r?.stories.arcs.find(o=>o.id===n)?.title??"\uC774\uC57C\uAE30";for(let n of Object.values(e.stories.pairs)){let o=n.current;if(o?.episodes.some(s=>s.state==="unlocked"))return`\uC0C8 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB838\uC5B4\uC694 \xB7 ${o.generated?.title??a(o.arcId)}`}let i=e.stories.expedition;if(i){let n=e.stories.pairs[i.pairId]?.current;return`\uD0D0\uD5D8 \uC911 \xB7 ${n?n.generated?.title??a(n.arcId):"\uC774\uC57C\uAE30 \uD0D0\uD5D8"}`}return Object.keys(e.pairs).length?"\uD0D0\uC0AC\uC5D0\uC11C \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC744 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694":"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30\uAC00 \uC5F4\uB824\uC694"}function oi(e,r,a){return t("button",{className:"strip story",attrs:{type:"button","aria-label":`\uC8FC\uBBFC \uC774\uC57C\uAE30 \u2014 ${jr(e,r)}`},on:{click:()=>a.openExplore()}},[t("span",{className:"story-art",attrs:{"aria-hidden":"true"}},[E(F.storyVignette,{className:"story-vignette",fallback:()=>g.book("icon")})]),t("span",{className:"story-text"},[t("strong",{text:"\uC8FC\uBBFC \uC774\uC57C\uAE30"}),t("span",{text:jr(e,r)})]),t("span",{className:"round-arrow"},[g.chevron()])])}function Or(e,r){let a=e.world;return!a||a.state!=="ready"?T(e,r,{top:{kind:"home"},backdrop:"forest",nav:!1,body:[a?.state==="error"?M(null,[ee(a.message),y("\uC138\uACC4 \uBAA9\uB85D\uC73C\uB85C",()=>r.navigate("worlds"),{variant:"secondary"})]):P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]}):T(e,r,{top:{kind:"home"},backdrop:"forest",hero:Pr(e,r),homeLayout:!0,body:ge(e)?[Ir(e,r)]:[Tr(a.value,e.content,r),oi(a.value.state,e.content,r),zr(a.value,e.content,r)],nav:!0,sheet:e.sheet?.kind==="work-report"?Lr(e,a.value,r):Er(e,r)})}var ut={new:"\uC0C8 \uC8FC\uBBFC",breakthrough:"\uB3CC\uD30C",token:"\uC885\uD45C"};function Vr(e,r){return e.outcome==="new"?"\uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694!":e.outcome==="breakthrough"?`\uB3CC\uD30C ${e.breakthrough}/${r}`:"\uCD5C\uB300 \uB3CC\uD30C\uB77C \uC885\uD45C 1\uAC1C\uAC00 \uB410\uC5B4\uC694"}function Ue(e){return y("\uB2EB\uAE30",()=>e.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})}function Ye(e,r,a,i,n=!1){let o=e.sheet,s=o&&(o.kind==="invite-result"||o.kind==="invite-chances"||o.kind==="invite-log"||o.kind==="invite-wish")?o.page??0:0,l=Math.max(1,Math.ceil(a.length/2)),p=Math.min(s,l-1);return t("div",{className:"paged-rows"},[t(n?"ol":"ul",{className:i},a.slice(p*2,p*2+2)),J("\uCD08\uB300 \uBAA9\uB85D \uACE0\uB974\uAE30",p,Array.from({length:l},(d,c)=>`${c*2+1}\u2013${Math.min(a.length,c*2+2)} / ${a.length}`),d=>r.setInviteSheetPage(d))])}function si(e,r,a,i,n){let o=i.length===1?i[0]:null,s=o?r.state.residents[o.residentId]:null;return W("fw-invite-result",i.length>1?`${i.length}\uD68C \uCD08\uB300 \uACB0\uACFC`:"\uCD08\uB300 \uACB0\uACFC",[o&&s?t("div",{className:"result-hero"},[t("span",{className:"result-stage"},[re(s)]),t("strong",{className:"result-name",text:s.displayName}),t("span",{className:`result-badge ${o.outcome}`,text:ut[o.outcome]}),t("p",{className:"muted",text:Vr(o,a.crew.maxBreakthrough)})]):Ye(e,n,i.map(l=>{let p=r.state.residents[l.residentId];return t("li",{className:`result-row ${l.outcome}`},[D(p??null),t("strong",{text:p?.displayName??"\uC8FC\uBBFC"}),t("span",{className:`result-badge ${l.outcome}`,text:ut[l.outcome]}),t("small",{className:"muted",text:`${Vr(l,a.crew.maxBreakthrough)}${l.via==="guarantee"?" \xB7 \uBCF4\uC7A5":""}`})])}),"result-list",!0),Ue(n)])}function li(e,r,a,i){let n=Object.keys(r.state.residents).sort(),o=r.state.invite.wishResidentId,s=p=>p===o?a.invite.wishWeight:a.invite.baseWeight,l=n.reduce((p,d)=>p+s(d),0);return W("fw-invite-chances","\uD655\uB960 \uBCF4\uAE30",[t("p",{className:"muted",text:`\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC740 \uBAA8\uB450 \uAC19\uC740 \uD655\uB960\uC774\uC5D0\uC694(\uB4F1\uAE09 \uC5C6\uC74C). \uD76C\uB9DD \uC8FC\uBBFC\uC740 ${a.invite.wishWeight}\uBC30\uB85C \uB9CC\uB098\uC694. \uC0C8 \uC8FC\uBBFC \uC5C6\uC774 ${a.invite.guaranteeAfter}\uBC88\uC774 \uC9C0\uB098\uBA74 \uB2E4\uC74C \uCD08\uB300\uB294 \uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC\uC774\uC5D0\uC694(\uD76C\uB9DD \uC8FC\uBBFC\uC774 \uAE30\uB2E4\uB9AC\uBA74 \uADF8 \uC8FC\uBBFC). 10\uD68C \uCD08\uB300\uB294 \uD55C \uBC88\uC529 \uCC28\uB840\uB85C \uC801\uC6A9\uB3FC\uC694.`}),n.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):Ye(e,i,n.map(p=>{let d=r.state.residents[p],c=l?s(p)/l*100:0;return t("li",{className:"chance-row"},[D(d),t("span",{className:"chance-name"},[t("strong",{text:d.displayName}),p===o?t("span",{className:"tag wish",text:"\uD76C\uB9DD"}):null]),t("strong",{className:"chance-value",text:`${c.toFixed(c<10?2:1)}%`})])}),"chance-list"),t("p",{className:"muted",text:`\uCC98\uC74C \uB9CC\uB098\uBA74 \uC601\uC785, \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C(\uCD5C\uB300 ${a.crew.maxBreakthrough}), \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C 1\uAC1C. \uC885\uD45C ${a.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uACE0\uB97C \uC218 \uC788\uC5B4\uC694.`}),Ue(i)])}function di(e,r,a,i){let n=r.state.invite.log,o=new Intl.DateTimeFormat("ko-KR",{dateStyle:"short",timeStyle:"short"});return W("fw-invite-log","\uCD08\uB300 \uAE30\uB85D",[n.length===0?t("p",{className:"empty",text:"\uC544\uC9C1 \uCD08\uB300 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694."}):Ye(e,i,n.map(s=>t("li",{className:`result-row ${s.outcome}`},[D(r.state.residents[s.residentId]??null),t("strong",{text:r.state.residents[s.residentId]?.displayName??s.name}),t("span",{className:`result-badge ${s.outcome}`,text:ut[s.outcome]}),t("small",{className:"muted",text:`${o.format(new Date(s.at))}${s.via==="guarantee"?" \xB7 \uBCF4\uC7A5":s.via==="exchange"?" \xB7 \uC885\uD45C \uAD50\uD658":""}${s.outcome==="breakthrough"?` \xB7 \uB3CC\uD30C ${s.breakthrough}/${a.crew.maxBreakthrough}`:""}`})])),"result-list",!0),t("p",{className:"muted",text:`\uCD5C\uADFC ${a.invite.logLimit}\uAC74\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694.`}),Ue(i)])}function ci(e,r,a){let i=r.state.invite.wishResidentId,n=!!e.busy["invite-wish"],o=Object.values(r.state.residents).sort((s,l)=>s.displayName.localeCompare(l.displayName,"ko"));return W("fw-invite-wish","\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815",[t("p",{className:"muted",text:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911 \uD55C \uBA85\uC744 \uACE0\uB974\uBA74 \uADF8 \uC8FC\uBBFC\uC744 \uB354 \uC798 \uB9CC\uB098\uC694."}),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):Ye(e,a,o.map(s=>t("li",{},[t("button",{className:`pick-row${s.residentId===i?" selected":""}`,attrs:{type:"button","aria-pressed":s.residentId===i?"true":"false"},disabled:n,on:{click:()=>{a.setWish(s.residentId)}}},[D(s),t("strong",{text:s.displayName}),Q(s),t("small",{className:"muted",text:s.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"}),s.residentId===i?g.check("icon"):null])])),"pick-list"),i?y("\uD76C\uB9DD \uC8FC\uBBFC \uD574\uC81C",()=>{a.setWish(null)},{variant:"secondary",disabled:n}):null,Ue(a)])}function Dr(e,r,a,i){let n=e.sheet;return n?n.kind==="invite-result"?si(e,r,a,n.draws,i):n.kind==="invite-chances"?li(e,r,a,i):n.kind==="invite-log"?di(e,r,a,i):n.kind==="invite-wish"?ci(e,r,i):null:null}function pi(e,r){let a=e.world?.state==="ready"?e.world.value:null;if(!a)return null;let{tickets:i,tokens:n}=a.state.wallet;return t("div",{className:"resources invite-counters"},[t("button",{className:"counter ticket",attrs:{type:"button","aria-label":`\uCD08\uB300\uAD8C ${i}\uC7A5 \u2014 \uCD08\uB300\uAD8C \uBC1B\uAE30`},on:{click:()=>r.openDeliveries()}},[t("span",{className:"ticket-mark"},[g.ticket("icon")]),t("span",{className:"counter-value",text:String(i)}),t("span",{className:"counter-plus"},[g.plus("icon tiny")])]),t("span",{className:"counter token",attrs:{"aria-label":`\uC885\uD45C ${n}\uAC1C`}},[t("span",{className:"token-mark"},[g.leaf("icon")]),t("span",{className:"counter-value",text:String(n)})])])}function mi(e,r){let a=(i,n,o)=>t("button",{className:`segment${e.inviteTab===i?" selected":""}`,attrs:{type:"button",role:"tab","aria-selected":e.inviteTab===i?"true":"false"},on:{click:()=>r.setInviteTab(i)}},[o,t("span",{text:n})]);return t("div",{className:"segmented invite-tabs",attrs:{role:"tablist","aria-label":"\uCD08\uB300"}},[a("invite","\uC8FC\uBBFC \uCD08\uB300",g.sprout("icon")),a("exchange","\uC885\uD45C \uAD50\uD658",g.leaf("icon"))])}function Br(e,r,a,i,n){let o=i*a.invite.ticketsPerDraw,s=Math.max(0,o-r.state.wallet.tickets),l=Object.keys(r.state.residents).length===0,p=!!e.busy[`invite:${i}`];return t("button",{className:`draw-button${s?" short":""}`,attrs:{type:"button","aria-label":`${i}\uD68C \uCD08\uB300 \u2014 \uCD08\uB300\uAD8C ${o}\uC7A5${s?`, ${s}\uC7A5 \uBD80\uC871`:""}`},disabled:p||s>0||l||r.state.progress.starterResidentId===null,on:{click:()=>{n.draw(i)}}},[t("strong",{className:"draw-title",text:p?"\uCD08\uB300\uD558\uB294 \uC911\u2026":`${i}\uD68C \uCD08\uB300`}),t("span",{className:"draw-cost"},[g.ticket("icon"),`${o}\uC7A5`]),s?t("span",{className:"draw-short"},[g.info("icon tiny"),`\uCD08\uB300\uAD8C ${s}\uC7A5 \uBD80\uC871`]):null])}function ui(e,r,a,i){let n=Object.values(r.state.residents),o=r.state.invite.wishResidentId?r.state.residents[r.state.invite.wishResidentId]:null,s=n.filter(p=>!p.recruited).length,l=a.invite.guaranteeAfter-r.state.invite.sinceNew+1;return[t("div",{className:"invite-stage"},[E(F.inviteScene,{className:"invite-scene",fallback:()=>g.ticket("icon huge")})]),M(null,[t("button",{className:"menu-row wish-row",attrs:{type:"button"},on:{click:()=>i.openSheet({kind:"invite-wish"})}},[t("span",{className:"menu-icon light"},[g.sprout("icon")]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uD76C\uB9DD \uC8FC\uBBFC \uC124\uC815"}),t("span",{className:"menu-detail",text:o?`${o.displayName} \xB7 \uB2E4\uB978 \uC8FC\uBBFC\uBCF4\uB2E4 \uC798 \uB9CC\uB098\uC694`:"\uB4F1\uB85D\uB41C \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098 \uC911\uC5D0\uC11C \uB9CC\uB098\uC694."})]),t("span",{className:"menu-chevron"},[g.chevron()])]),n.length===0?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uCD08\uB300\uD560 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uBA3C\uC800 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC8FC\uC138\uC694."}),y("\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30",()=>i.navigate("residents"))]):r.state.progress.starterResidentId===null?t("div",{className:"invite-empty"},[t("p",{className:"empty",text:"\uC2DC\uC791 \uC8FC\uBBFC\uC744 \uBA3C\uC800 \uC815\uD558\uBA74 \uCD08\uB300\uD560 \uC218 \uC788\uC5B4\uC694."}),y("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>i.navigate("residents"))]):null,t("div",{className:"draw-row"},[Br(e,r,a,1,i),Br(e,r,a,a.invite.multiDraw,i)]),t("p",{className:"hint center",text:n.length===0?"\uB4F1\uB85D\uD55C \uC8FC\uBBFC \uC911\uC5D0\uC11C \uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9CC\uB0A0 \uC218 \uC788\uC5B4\uC694.":s>0?`\uC544\uC9C1 \uC624\uC9C0 \uC54A\uC740 \uC8FC\uBBFC ${s}\uBA85 \xB7 \uB2A6\uC5B4\uB3C4 ${Math.max(1,l)}\uBC88\uC9F8 \uCD08\uB300\uC5D0\uB294 \uC0C8 \uC8FC\uBBFC\uC744 \uB9CC\uB098\uC694.`:"\uBAA8\uB450 \uACF5\uBC29\uC5D0 \uC654\uC5B4\uC694. \uB2E4\uC2DC \uB9CC\uB098\uBA74 \uB3CC\uD30C, \uCD5C\uB300 \uB3CC\uD30C \uB4A4\uC5D0\uB294 \uC885\uD45C\uAC00 \uB3FC\uC694."}),t("div",{className:"link-row"},[t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>i.openSheet({kind:"invite-chances"})}},[g.info("icon"),t("span",{text:"\uD655\uB960 \uBCF4\uAE30"})]),t("button",{className:"link-button with-icon",attrs:{type:"button"},on:{click:()=>i.openSheet({kind:"invite-log"})}},[g.document("icon"),t("span",{text:"\uCD08\uB300 \uAE30\uB85D"})])])])]}function gi(e,r,a,i,n){let o=a.crew.maxBreakthrough,s=r.recruited&&r.breakthrough>=o,l=!!e.busy[`exchange:${r.residentId}`],p=r.recruited?s?"\uCD5C\uB300 \uB3CC\uD30C":`\uB3CC\uD30C ${r.breakthrough}/${o} \u2192 ${r.breakthrough+1}`:"\uCD08\uB300 \uB300\uAE30 \u2192 \uC601\uC785";return t("li",{className:"exchange-row"},[D(r),t("span",{className:"exchange-name"},[t("strong",{text:r.displayName}),t("span",{className:"tag-row"},[Q(r),t("small",{className:"muted",text:p})])]),t("button",{className:"button small",text:l?"\uAD50\uD658 \uC911\u2026":"\uAD50\uD658",attrs:{type:"button","aria-label":`${r.displayName} \uC120\uD0DD \xB7 \uC885\uD45C \uAD50\uD658`},disabled:l||s||i<a.invite.tokensPerExchange,on:{click:()=>{n.exchange(r.residentId)}}})])}function fi(e,r,a,i){let n=r.state.wallet.tokens,o=Object.values(r.state.residents).sort((p,d)=>Number(p.recruited)-Number(d.recruited)||p.displayName.localeCompare(d.displayName,"ko")),s=Math.max(1,Math.ceil(o.length/2)),l=Math.min(e.invitePage??0,s-1);return[M("\uC885\uD45C \uAD50\uD658",[t("p",{className:"exchange-summary"},[t("span",{className:"token-coin"},[g.leaf("icon")]),t("strong",{text:`${n} / ${a.invite.tokensPerExchange}`}),t("span",{className:"muted",text:` \uC885\uD45C ${a.invite.tokensPerExchange}\uAC1C\uB85C \uC6D0\uD558\uB294 \uC8FC\uBBFC\uC744 \uBC14\uB85C \uB9DE\uC774\uD558\uAC70\uB098 \uB3CC\uD30C\uD574\uC694.`})]),o.length===0?t("p",{className:"empty",text:"\uB4F1\uB85D\uB41C \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"exchange-list"},o.slice(l*2,l*2+2).map(p=>gi(e,p,a,n,i))),J("\uAD50\uD658 \uC8FC\uBBFC \uBAA9\uB85D \uACE0\uB974\uAE30",l,Array.from({length:s},(p,d)=>`${d+1} \xB7 ${o.slice(d*2,d*2+2).map(c=>c.displayName).join(" \xB7 ")}`),p=>i.setInvitePage(p))])]}function Fr(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.content,n=a&&i;return T(e,r,{top:{kind:"sub",title:"\uCD08\uB300",subtitle:"\uC0C8\uB85C\uC6B4 \uC778\uC5F0\uC744 \uB9DE\uC774\uD574\uC694",resources:!1,counters:pi(e,r)},backdrop:"forest",body:n?[mi(e,r),...e.inviteTab==="invite"?ui(e,a,i,r):fi(e,a,i,r)]:[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:n?Dr(e,a,i,r):null})}function Gr(e,r,a){let i=e.explore.tab==="patrol"?"patrol":"survey",n=i==="survey"?"\uC870\uC0AC":"\uC21C\uCC30",o=r.state.activities?.running,l=Object.values(r.state.residents).filter(f=>f.recruited).filter(f=>!r.state.stories.expedition?.participants.includes(f.residentId)),p=l.find(f=>f.residentId===e.explore.activityResidentId)??l[0],d=t("select",{className:"input",attrs:{"aria-label":"\uD65C\uB3D9 \uC8FC\uBBFC \uC120\uD0DD"},on:{change:()=>a.selectActivityResident(d.value)}},l.map(f=>t("option",{text:f.displayName,attrs:{value:f.residentId}})));d.value=p?.residentId??"";let c=Math.max(0,Date.now()-(e.worldReceivedAt??Date.now())),m=o?Math.max(0,o.endsSim-r.state.production.simMs-c):0,u=(r.state.activities?.completed.length??0)>=100||(r.state.mailbox?.letters.length??0)>=200;return M("\uACF5\uBC29 \uC8FC\uBCC0",[E(De[i==="survey"?"herb-garden":"river-bridge"],{className:"activity-landscape",fallback:()=>t("span"),alt:i==="survey"?"\uC870\uC0AC\uD560 \uACF5\uBC29 \uD143\uBC2D":"\uC21C\uCC30\uD560 \uC232\uAE38 \uB2E4\uB9AC"}),t("p",{text:i==="survey"?"\uC8FC\uBCC0\uC758 \uD480\uACFC \uB098\uBB47\uC78E\uC744 \uC0B4\uD3B4\uBCF4\uACE0 \uBC1C\uACAC\uC744 \uAE30\uB85D\uD574\uC694.":"\uAE38\uACFC \uC27C\uD130\uB97C \uD55C \uBC14\uD034 \uB3CC\uBA70 \uC548\uBD80\uB97C \uD655\uC778\uD574\uC694."}),o?t("div",{className:"activity-running"},[t("strong",{text:`${r.state.residents[o.residentId]?.displayName??"\uC8FC\uBBFC"} \xB7 ${o.kind==="survey"?"\uC870\uC0AC":"\uC21C\uCC30"} \uC911`}),t("progress",{className:"activity-progress",attrs:{max:String(o.endsSim-o.startedSim),value:String(Math.max(0,o.endsSim-o.startedSim-m)),"aria-label":"\uD65C\uB3D9 \uC9C4\uD589\uB960"}}),t("span",{className:"countdown",text:be(m),attrs:{"data-countdown-end":String(Date.now()+m)}}),y("\uD65C\uB3D9 \uCDE8\uC18C",()=>{a.cancelActivity(o.id)},{variant:"secondary",disabled:!!e.busy[`activity-cancel:${o.id}`]}),t("p",{className:"muted",text:"\uC644\uB8CC \uACB0\uACFC\uB294 \uAE30\uB85D\uACFC \uC6B0\uD3B8\uD568\uC5D0 \uB0A8\uC544\uC694. \uCDE8\uC18C\uD574\uB3C4 \uC7AC\uD654\uB294 \uC18C\uBAA8\uB418\uC9C0 \uC54A\uC544\uC694."})]):t("div",{className:"activity-prepare"},[p?t("div",{className:"activity-resident"},[D(p),d]):l.length?d:t("p",{text:"\uC601\uC785\uD55C \uC8FC\uBBFC \uC911 \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC5D0 \uCC38\uC5EC\uD558\uC9C0 \uC54A\uC740 \uC8FC\uBBFC\uC774 \uD544\uC694\uD574\uC694."}),t("p",{text:`\uC18C\uC694 ${i==="survey"?30:15}\uBD84 \xB7 \uC8FC\uBBFC 1\uBA85 \xB7 \uACB0\uACFC \uAE30\uB85D\uACFC \uD3B8\uC9C0`}),t("p",{className:"muted",text:"\uCD9C\uBC1C\uD558\uBA74 \uC2DC\uC124 \uBC30\uCE58\uC5D0\uC11C \uBE60\uC838\uC694. \uC0DD\uC0B0 \uC911\uC778 \uC791\uC5C5\uC740 \uCDE8\uC18C\uB418\uC9C0 \uC54A\uC544\uC694. \uC7AC\uB8CC\xB7\uACE8\uB4DC\xB7\uCD08\uB300\uAD8C \uBCF4\uC0C1\uC740 \uC5C6\uC5B4\uC694."}),y(u?"\uAE30\uB85D \uC800\uC7A5 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD588\uC5B4\uC694":`${n} \uCD9C\uBC1C`,()=>{p&&a.startActivity(i,p.residentId)},{disabled:!p||u||!!e.busy["activity-start"]})]),t("p",{className:"muted",text:"\uC138\uACC4\uB2F9 \uC870\uC0AC\xB7\uC21C\uCC30 \uD55C \uD65C\uB3D9\uB9CC \uC9C4\uD589\uD574\uC694. \uBBF8\uC811\uC18D \uC2DC\uAC04\uC740 \uCD5C\uB300 72\uC2DC\uAC04\uAE4C\uC9C0 \uBC18\uC601\uB3FC\uC694. \uB0A8\uC740 \uC2DC\uAC04\uC740 \uCD94\uC815\uCE58\uC608\uC694."}),y("\uC6B0\uD3B8\uD568 \uC5F4\uAE30",()=>a.openMailbox(),{variant:"secondary"})],{className:"activity-card"})}var hi="http://www.w3.org/2000/svg",gt={locked:"\uC7A0\uAE40",available:"\uCD9C\uBC1C \uAC00\uB2A5",running:"\uD0D0\uD5D8 \uC911",unlocked:"\uC774\uC57C\uAE30 \uC5F4\uB9BC",read:"\uC77D\uC74C"};function We(e,r){let a=[["survey","\uC870\uC0AC",g.search],["patrol","\uC21C\uCC30",g.compass],["story","\uC774\uC57C\uAE30 \uD0D0\uD5D8",g.leaf]];return t("div",{className:"field-tabs explore-tabs work-fields",attrs:{role:"tablist","aria-label":"\uD0D0\uC0AC"}},a.map(([i,n,o])=>t("button",{className:`field-tab${e.explore.tab===i?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":String(e.explore.tab===i)},on:{click:()=>r.setExploreTab(i)}},[o("icon field-glyph"),t("span",{text:n})])))}function bi(e,r){let a=document.createElementNS(hi,"svg");a.setAttribute("viewBox","0 0 360 170"),a.setAttribute("class","trail-art"),a.setAttribute("aria-hidden","true");let i=[[60,120],[170,92],[285,60]],n=o=>e.episodes[o].status==="read"?"#5a9a44":o===r?"#fff8e8":"#cdbf9f";return a.innerHTML=`
    <g stroke="#4b2e1a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">





      <path d="M20 135 Q60 120 ${i[0][0]} ${i[0][1]} Q120 100 ${i[1][0]} ${i[1][1]} Q230 80 ${i[2][0]} ${i[2][1]}"
        fill="none" stroke="#fff8e8" stroke-width="6" stroke-dasharray="10 8"/>
      ${i.map(([o,s],l)=>`<circle cx="${o}" cy="${s}" r="11" fill="${n(l)}"/>`).join("")}
      <g transform="translate(${i[r][0]-14} ${i[r][1]-46})">
        <path d="M14 30 L8 22 H4 a4 4 0 0 1-4-4 V4 a4 4 0 0 1 4-4 H24 a4 4 0 0 1 4 4 V18 a4 4 0 0 1-4 4 H20z" fill="#fff8e8"/>
        <path d="M14 18 c0-6 0-9 0-12 M14 12 c-4-1-6-4-6-7 4 1 6 3 6 7z M14 10 c4-1 5-4 5-7-4 1-5 3-5 7z" fill="#5a9a44" stroke-width="2"/>
      </g>
    </g>`,t("div",{className:"trail-scene"},[E(F.trail,{className:"trail-background",fallback:()=>t("span",{className:"trail-background"})}),a])}function wi(e,r,a,i){if(a.length<2)return null;let n=t("select",{className:"input",attrs:{"aria-label":"\uD398\uC5B4 \uACE0\uB974\uAE30"},on:{change:()=>i.selectStoryPair(n.value)}},a.map(o=>{let s=r.state.pairs[o.pairId].residentIds.map(l=>r.state.residents[l]?.displayName??"\uC8FC\uBBFC");return t("option",{text:s.join(" \xB7 "),attrs:{value:o.pairId}})}));return n.value=a.some(o=>o.pairId===e.explore.pairId)?e.explore.pairId:a[0].pairId,n}function yi(e,r,a){return t("ol",{className:"episode-row",attrs:{"aria-label":"\uC774\uC57C\uAE30 \uD3B8"}},e.episodes.map(i=>t("li",{},[t("button",{className:`episode-tile ${i.status}${i.index===r?" selected":""}`,attrs:{type:"button","aria-pressed":i.index===r?"true":"false","aria-label":`${i.index+1}\uD3B8 ${i.title} ${gt[i.status]}`},on:{click:()=>a.selectStoryEpisode(i.index)}},[t("span",{className:"episode-icon"},[(i.status==="locked"?g.lock:g.book)("icon big"),i.status==="read"?t("span",{className:"episode-check"},[g.check("icon tiny")]):null]),t("span",{className:"episode-text"},[t("strong",{text:`${i.index+1}\uD3B8`}),t("span",{text:i.title}),t("small",{text:i.status==="locked"?i.reasons[0]??gt.locked:gt[i.status]})])])])))}function vi(e,r,a,i,n,o){let s=v=>Math.max(0,(r.state.inventory[v]??0)-(r.state.production.protectedStock[v]??0)),l=Object.entries(n.preparations),p=l.every(([v,k])=>s(v)>=k),d=n.participants.map(v=>r.state.residents[v]).filter(Boolean),c=r.state.stories.expedition,m=c&&c.pairId===i.pairId&&c.episode===n.index,u=v=>!!e.busy[v],f=d.filter(v=>Object.values(r.state.production.facilities).some(k=>k.residentId===v.residentId)),w;if(n.status==="available"){let v=`depart:${i.pairId}:${n.index}`;w=y(u(v)?"\uCD9C\uBC1C\uD558\uB294 \uC911\u2026":p?"\uD0D0\uD5D8 \uCD9C\uBC1C":"\uC900\uBE44\uBB3C\uC774 \uBD80\uC871\uD574\uC694",()=>{o.depart(i.pairId,n.index)},{disabled:u(v)||!p,attrs:{"data-wide":""}})}else if(n.status==="running"&&m){let v=Ne(e,r,c);w=t("div",{className:"expedition-running"},[t("p",{className:"running-line"},[g.compass("icon"),t("strong",{text:"\uD0D0\uD5D8 \uC911"}),v.countdown]),v.bar,y(u("expedition-cancel")?"\uCDE8\uC18C\uD558\uB294 \uC911\u2026":"\uD0D0\uD5D8 \uCDE8\uC18C (\uC900\uBE44\uBB3C\uC740 \uBAA8\uB450 \uB3CC\uB824\uBC1B\uC544\uC694)",()=>{o.cancelExpedition()},{variant:"secondary",disabled:u("expedition-cancel")})])}else if((n.status==="unlocked"||n.status==="read")&&n.storyId){let v=n.storyId;w=y(n.status==="read"?"\uB2E4\uC2DC \uC77D\uAE30":n.written?"\uC774\uC5B4 \uC77D\uAE30":"\uC774\uC57C\uAE30 \uC77D\uAE30",()=>o.openStory(i.pairId,n.index,v),{attrs:{"data-wide":""}})}else w=t("div",{className:"locked-reasons"},[t("p",{className:"hint",text:"\uC544\uC9C1 \uB5A0\uB0A0 \uC218 \uC5C6\uC5B4\uC694:"}),t("ul",{},n.reasons.map(v=>t("li",{text:v})))]);return t("div",{className:"expedition-details"},[t("div",{className:"detail-grid"},[t("div",{className:"detail-cell"},[g.clock("icon big"),t("span",{},[t("small",{text:"\uC18C\uC694 \uC2DC\uAC04"}),t("strong",{text:`${n.minutes}\uBD84`})])]),t("div",{className:"detail-cell"},[g.people("icon big"),t("span",{},[t("small",{text:"\uCC38\uC5EC \uC8FC\uBBFC"}),t("strong",{text:`${d.length}\uBA85`})]),t("span",{className:"avatar-row"},d.map(v=>D(v)))]),t("div",{className:"detail-cell wide"},[g.box("icon big"),t("span",{},[t("small",{text:"\uC900\uBE44\uBB3C"}),t("span",{className:"prep-list"},l.map(([v,k])=>t("span",{className:`prep${s(v)>=k?" ok":""}`},[B(v),`${_(a,v)} ${Math.min(s(v),k)}/${k}`,s(v)>=k?g.check("icon tiny"):null])))])]),t("div",{className:"detail-cell wide"},[g.sparkle("icon big"),t("span",{},[t("small",{text:"\uBC1C\uACAC\uD560 \uC218 \uC788\uB294 \uAC83"}),t("strong",{text:i.arc.discovery})])])]),t("p",{className:"hint",text:f.length?`${f.map(v=>v.displayName).join(", ")}\uC740(\uB294) \uCD9C\uBC1C\uD558\uBA74 \uC2DC\uC124\uC5D0\uC11C \uBE60\uC838\uC694. \uC2DC\uC124\uC740 \uAE30\uBCF8 \uD6A8\uC728\uB85C \uACC4\uC18D \uC77C\uD558\uACE0, \uC9C4\uD589 \uC911\uC778 \uC791\uC5C5\uC740 \uCDE8\uC18C\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC2DC\uC124\uC740 \uADF8\uB300\uB85C \uC77C\uD574\uC694. \uD0D0\uD5D8\uC740 \uC77C\uC0C1 \uC0DD\uC0B0\uACFC \uB530\uB85C \uD558\uB098\uC529 \uB5A0\uB098\uC694."}),w])}function xi(e,r,a){let n=(e.world?.state==="ready"?e.world.value.state.stories.pairs?.[r.pairId]?.current:null)?.episodes.flatMap((l,p)=>l.state==="read"?[{index:p,storyId:l.storyId}]:[])??[];if(r.completed.length===0&&n.length===0)return M("\uC77D\uC740 \uC774\uC57C\uAE30",[t("p",{className:"empty",text:"\uC544\uC9C1 \uC77D\uC740 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})]);let o=Math.max(1,Math.ceil(r.completed.length/2)),s=Math.min(e.explore.historyPage??0,o-1);return M("\uC77D\uC740 \uC774\uC57C\uAE30",[n.length&&s===0?t("div",{className:"completed-arc"},[t("strong",{text:r.arc.title}),...n.map(({index:l,storyId:p})=>y(`${l+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`,()=>a.openStory(r.pairId,l,p),{variant:"secondary"}))]):null,t("ul",{className:"menu-list"},r.completed.slice().reverse().slice(s*2,s*2+2).map(l=>t("li",{className:"completed-arc"},[t("strong",{text:l.title}),t("span",{className:"row-actions"},l.storyIds.map((p,d)=>t("button",{className:"outline-button small",text:`${d+1}\uD3B8`,attrs:{type:"button","aria-label":`${l.title} ${d+1}\uD3B8 \uB2E4\uC2DC \uC77D\uAE30`},on:{click:()=>a.openStory(r.pairId,d,p)}})))]))),J("\uC77D\uC740 \uC774\uC57C\uAE30 \uBAA9\uB85D \uACE0\uB974\uAE30",s,Array.from({length:o},(l,p)=>`${p+1} \xB7 ${r.completed.slice().reverse().slice(p*2,p*2+2).map(d=>d.title).join(" \xB7 ")}`),l=>a.setExploreHistoryPage(l))])}function ki(e,r,a,i){let n=r.state.stories.expedition,o=n?a.find(p=>p.pairId===n.pairId):null,s=Math.round(i.production.absenceLimitMs/36e5);if(!n||!o)return t("div",{className:"strip offline explore-strip"},[g.compass(),t("span",{text:"\uC9C0\uAE08\uC740 \uB5A0\uB09C \uD0D0\uD5D8\uC774 \uC5C6\uC5B4\uC694."}),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})]);let l=Ne(e,r,n);return t("div",{className:"strip offline explore-strip"},[g.compass(),t("span",{className:"strip-progress"},[t("span",{},[`${o.episodes[n.episode].title} \xB7 `,l.countdown," \uB0A8\uC74C"]),l.bar]),t("small",{className:"muted",text:`\uBC29\uCE58 \uB204\uC801 \uCD5C\uB300 ${s}\uC2DC\uAC04`})])}function Ni(e,r,a,i){if(e.explore.tab!=="story")return[We(e,i),Gr(e,r,i)];let n=e.explore.overview;if(!n||n.state==="loading")return[We(e,i),P("\uC774\uC57C\uAE30\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(n.state==="error")return[We(e,i),M(null,[ee(n.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{i.loadStoryOverview()})])];let o=n.value.pairs.filter(c=>e.explore.section==="history"||!r.state.pairs[c.pairId]?.archived);if(o.length===0)return[We(e,i),M(null,[t("p",{text:"\uD398\uC5B4\uB97C \uB9CC\uB4E4\uBA74 \uB450 \uC8FC\uBBFC\uC758 \uC774\uC57C\uAE30 \uD0D0\uD5D8\uC774 \uC5F4\uB824\uC694."}),t("p",{className:"muted",text:"1\uD3B8\uC740 \uD55C \uC8FC\uBBFC\uB9CC \uACF5\uBC29\uC5D0 \uC640 \uC788\uC5B4\uB3C4 \uB5A0\uB0A0 \uC218 \uC788\uC5B4\uC694."}),y("\uC8FC\uBBFC \uD654\uBA74\uC73C\uB85C",()=>i.navigate("residents"),{variant:"secondary"})])];let s=o.find(c=>c.pairId===e.explore.pairId)??o[0],l=s.episodes.some(c=>c.index===e.explore.selectedEpisode)?e.explore.selectedEpisode:s.episodes.find(c=>c.status!=="read")?.index??2,p=e.explore.section==="history"?"history":"episode",d=[["episode","\uD0D0\uD5D8 \uC900\uBE44"],["history","\uC77D\uC740 \uC774\uC57C\uAE30"]];return[We(e,i),wi(e,r,o,i),t("div",{className:"pill-tabs",attrs:{role:"group","aria-label":"\uC774\uC57C\uAE30 \uD654\uBA74"}},d.map(([c,m])=>t("button",{className:`pill-tab${p===c?" current":""}`,text:m,attrs:{type:"button","aria-pressed":p===c?"true":"false"},on:{click:()=>i.setExploreSection(c)}}))),p==="episode"?t("section",{className:"card trail-card",attrs:{"aria-label":`${s.arc.place} \uC9C0\uB3C4`}},[bi(s,l),t("span",{className:"place-sign",text:s.arc.place})]):null,p==="episode"?M(s.arc.title,[yi(s,l,i),vi(e,r,a,s,s.episodes[l],i)],{className:"arc-card"}):null,p==="episode"?ki(e,r,o,a):null,p==="history"?xi(e,s,i):null]}function qr(e,r){let a=e.world?.state==="ready"?e.world.value:null;return T(e,r,{top:{kind:"sub",title:"\uD0D0\uC0AC",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?Ni(e,a,e.content,r):[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0})}var Si={calm:"affection",surprise:"curiosity",worry:"fluster",thinking:"inspiration",shy:"fluster"},$i={joy:"\u266A",affection:"\u2661",curiosity:"?",fluster:"\u{1F4A7}",inspiration:"\u2726",annoyance:"\u{1F4A2}"};function _r(e){let r=e in Ae?e:Si[e];return r?E(Ae[r],{className:"emotion-bubble emotion-art",fallback:()=>t("span",{className:"emotion-bubble",text:$i[r]})}):null}function Te(e,r){return e.state.residents[r]?.displayName??"\uC8FC\uBBFC"}function Ii(e,r,a,i){let n=a?.participants??[],o=i?.kind==="line"?i.speakerId:i?.kind==="choice"?i.askerId:null;return t("section",{className:"story-stage",attrs:{"aria-hidden":"true"}},[E(De[a?.background??"workshop"]??F.interior,{className:"stage-art",fallback:()=>t("span",{className:"stage-shelf"})}),t("div",{className:`stage-cast cast-${n.length}`},n.map(s=>{let l=r.state.residents[s];if(!l)return null;let p=o!==s?null:i?.kind==="line"?_r(i.emotion):_r("curiosity"),d=t("span",{className:`stage-spot${o===s?" speaking":""}`},[p,re(l)]),c=mt(l.image.placement);return d.style.setProperty("--mark-bottom",`${c.bottom}%`),d.style.setProperty("--mark-left",`${c.left}%`),d}))])}function Ci(e,r,a,i){if(a.story.state==="loading")return t("div",{className:"dialogue-box loading",attrs:{role:"status"}},[t("p",{text:"\uC774\uC57C\uAE30\uB97C \uC4F0\uB294 \uC911\uC774\uC5D0\uC694\u2026"}),t("p",{className:"muted",text:"\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC57C\uAE30\uB97C \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694. \uC644\uC131\uB418\uBA74 \uBC14\uB85C \uBCF4\uC5EC\uB4DC\uB9B4\uAC8C\uC694."})]);if(a.story.state==="error")return t("div",{className:"dialogue-box error",attrs:{role:"alert"}},[t("p",{text:a.story.message}),t("div",{className:"row-actions"},[y("\uAC19\uC740 \uC774\uC57C\uAE30\uB85C \uB2E4\uC2DC \uC2DC\uB3C4",()=>i.retryStory()),y("\uB2EB\uAE30",()=>i.closeStory(),{variant:"secondary"})])]);let o=a.story.value.segments;if(a.index>=o.length){let p=!!e.busy[`read:${a.storyId}`];return t("div",{className:"dialogue-box end"},[t("p",{className:"end-line",text:"\uC774\uC57C\uAE30\uB294 \uC5EC\uAE30\uAE4C\uC9C0\uC608\uC694."}),t("p",{className:"muted",text:"\uB2E4 \uC77D\uC73C\uBA74 \uC774 \uC7A5\uBA74\uC744 \uD568\uAED8\uD55C \uC8FC\uBBFC\uB4E4\uC758 \uAE30\uC5B5\uC5D0 \uB0A8\uC544\uC694."}),y(p?"\uAE30\uB85D\uD558\uB294 \uC911\u2026":"\uB2E4 \uC77D\uC74C",()=>{i.finishStory()},{disabled:p,attrs:{"data-wide":""}})])}let l=o[a.index];if(l.kind==="choice"){let p=ft(r,a),d=p?.choice?.optionId??null,c=!!e.busy[`choose:${a.storyId}`],m=l.question.length+l.options.reduce((u,f)=>u+f.text.length,0)>150;return m&&(a.choiceView??"question")==="question"?t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[g.leaf("icon tiny"),Te(r,l.askerId)]),t("p",{className:"line",text:l.question}),y("\uB2F5\uBCC0 \uACE0\uB974\uAE30",()=>i.setChoiceView("answers"))]):t("div",{className:"dialogue-box choice"},[t("span",{className:"speaker-tag"},[g.leaf("icon tiny"),Te(r,l.askerId)]),m?y("\uC9C8\uBB38 \uB2E4\uC2DC \uBCF4\uAE30",()=>i.setChoiceView("question"),{variant:"secondary"}):t("p",{className:"line",text:l.question}),t("div",{className:"choice-options",attrs:{role:"group","aria-label":"\uB300\uB2F5 \uACE0\uB974\uAE30"}},l.options.map(u=>t("button",{className:`choice-option${d===u.optionId?" chosen":""}`,text:u.text,attrs:{type:"button","aria-pressed":d===u.optionId?"true":"false"},disabled:c||d!==null||p?.state==="read",on:{click:()=>{i.chooseAnswer(u.optionId)}}}))),d||p?.state==="read"?t("p",{className:"muted",text:d?"\uC774\uBBF8 \uB300\uB2F5\uD588\uC5B4\uC694.":"\uB2E4\uC2DC \uC77D\uC744 \uB54C\uB294 \uB300\uB2F5\uC774 \uB0A8\uC9C0 \uC54A\uC544\uC694."}):t("p",{className:"muted",text:"\uB300\uB2F5\uC740 \uD55C \uBC88\uB9CC \uD560 \uC218 \uC788\uC5B4\uC694. \uBB3C\uC5B4\uBCF8 \uC8FC\uBBFC\uB9CC \uAE30\uC5B5\uD574\uC694."})])}return t("div",{className:`dialogue-box${l.kind==="narration"?" narration-only":""}`},[l.kind==="line"?t("span",{className:"speaker-tag"},[g.leaf("icon tiny"),Te(r,l.speakerId)]):null,t("p",{className:l.kind==="line"?"line":"narration",text:(a.textPages??xe(l))[a.textPage??0]??l.text})])}function ft(e,r){let a=e.state.stories.pairs[r.pairId];return[a?.current,...a?.completed??[]].find(n=>n?.episodes[r.episode]?.storyId===r.storyId)?.episodes[r.episode]}function Ri(e,r,a){let i=r.story.state==="ready"?r.story.value:null,n=i?i.segments.slice(0,Math.min(r.index+1,i.segments.length)):[],o=Math.max(1,n.length),s=Math.min(r.backlogPage??o-1,o-1);return W("fw-backlog","\uAE30\uB85D",[t("ol",{className:"backlog-list"},n.slice(s,s+1).map(l=>t("li",{className:`backlog-${l.kind}`},[l.kind==="line"?t("strong",{text:Te(e,l.speakerId)}):l.kind==="choice"?t("strong",{text:Te(e,l.askerId)}):null,t("span",{text:l.kind==="choice"?l.question:l.text})]))),o>1?t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>a.setBacklogPage(s-1),{variant:"secondary",disabled:s===0}),t("span",{text:`${s+1} / ${o}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>a.setBacklogPage(s+1),{variant:"secondary",disabled:s+1>=o})]):null,y("\uB2EB\uAE30",()=>a.toggleBacklog(),{variant:"secondary",attrs:{"data-wide":""}})])}function Hr(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.reader;if(!a||!i)return T(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",back:{route:"explore",label:"\uD0D0\uC0AC"},resources:!1},backdrop:"wood",body:[t("p",{className:"muted",text:"\uC5F4\uB9B0 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC5B4\uC694."})],nav:!0});let n=i.story.state==="ready"?i.story.value:null,o=n?.segments.length??0,s=n?.segments[i.index],l=i.textPages??xe(s),p=(i.textPage??0)>=l.length-1,d=s?.kind==="choice"&&!ft(a,i)?.choice&&ft(a,i)?.state!=="read",c=t("div",{className:"resources reader-tools"},[t("button",{className:"chip-button",attrs:{type:"button","aria-label":"\uAE30\uB85D",title:"\uAE30\uB85D","aria-pressed":i.backlog?"true":"false"},disabled:!n,on:{click:()=>r.toggleBacklog()}},[g.book("icon"),t("span",{text:"\uAE30\uB85D"})]),t("button",{className:`chip-button${i.auto?" active":""}`,attrs:{type:"button","aria-label":i.auto?"\uC790\uB3D9 \uB044\uAE30":"\uC790\uB3D9",title:i.auto?"\uC790\uB3D9 \uB044\uAE30":"\uC790\uB3D9","aria-pressed":i.auto?"true":"false"},disabled:!n,on:{click:()=>r.toggleAuto()}},[g.chevron("icon"),t("span",{text:i.auto?"\uC790\uB3D9 \uB044\uAE30":"\uC790\uB3D9"})])]),m=T(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC774\uC57C\uAE30",subtitle:n?.title??"\uC774\uC57C\uAE30",resources:!1,counters:c},backdrop:"wood",storyLayout:!0,body:[Ii(K(e),a,n,s),t("section",{className:"conversation-panel",attrs:{"aria-label":"\uC774\uC57C\uAE30 \uB300\uD654"}},[Ci(e,a,i,r),n&&i.index<o?t("div",{className:"reader-foot"},[t("span",{className:"count-pill",text:`${i.index+1} / ${o}`}),y(i.index===o-1&&p?"\uB2E4 \uC77D\uACE0 \uBCF4\uAD00":"\uACC4\uC18D",()=>{i.index===o-1&&p?r.finishStory():r.advanceStory()},{disabled:d||!!e.busy[`read:${i.storyId}`],attrs:{"data-wide":""}})]):null])],nav:!1,sheet:i.backlog?Ri(a,i,r):null}),u=m.querySelector(".back-button, .back-spacer");if(u){let f=t("button",{className:"back-button",attrs:{type:"button","aria-label":"\uC774\uC57C\uAE30 \uB2EB\uAE30"},on:{click:()=>r.closeStory()}},[g.back()]);u.replaceWith(f)}return m}var Kr,ht=!1;function Je(e){let r=()=>{clearTimeout(Kr),Kr=setTimeout(()=>{!ht&&a.isConnected&&e.onSearch(a.value)},300)},a=t("input",{className:"search-input",attrs:{id:e.id,type:"search",placeholder:e.placeholder,value:e.value,autocomplete:"off"},on:{compositionstart:()=>ht=!0,compositionend:()=>{ht=!1,r()},input:()=>r()}});return t("label",{className:"search-field",attrs:{for:e.id}},[g.search("icon"),t("span",{className:"visually-hidden",text:e.placeholder}),a])}function bt(e){let r=(a,i)=>t("li",{className:`step-item${e===a?" current":e>a?" done":""}`,attrs:e===a?{"aria-current":"step"}:{}},[t("span",{className:"step-number",text:String(a)}),t("span",{className:"step-label",text:i})]);return t("ol",{className:"steps card",attrs:{"aria-label":"\uC8FC\uBBFC \uB4F1\uB85D \uB2E8\uACC4"}},[r(1,"\uC790\uB8CC \uC120\uD0DD"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(2,"\uACF5\uBC29 \uC124\uC815"),t("li",{className:"step-arrow",attrs:{"aria-hidden":"true"},text:"\u2192"}),r(3,"\uC2DC\uC791 \uC8FC\uBBFC")])}function Ai(e,r){if(e.sources.state==="loading")return P("\uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026");if(e.sources.state==="error")return t("div",{},[ee(e.sources.message),y("\uB2E4\uC2DC \uBD88\uB7EC\uC624\uAE30",()=>{r.loadSources()},{variant:"secondary"})]);let a=e.query.trim().toLowerCase(),i=e.sources.value.filter(s=>s.kind===e.kindTab).filter(s=>!a||s.name.toLowerCase().includes(a));if(i.length===0)return t("p",{className:"empty",text:a?"\uC774\uB984\uC774 \uB9DE\uB294 \uC790\uB8CC\uAC00 \uC5C6\uC5B4\uC694.":`${Ee[e.kindTab]}\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC5D4\uC9C4\uC758 \uC11C\uC7AC\uC5D0\uC11C \uBA3C\uC800 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694.`});let n=Math.ceil(i.length/2),o=Math.min(e.sourcePage??0,n-1);return t("div",{className:"source-pages"},[t("ul",{className:"source-list"},i.slice(o*2,o*2+2).map(s=>t("li",{},[t("button",{className:"menu-row source-row",attrs:{type:"button"},disabled:s.residentId!==null,on:{click:()=>{r.chooseSource(s)}}},[E(fe.portrait,{className:"manage-art",fallback:()=>g.document()}),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:s.name}),t("span",{className:"menu-detail",text:s.residentId?"\uC774\uBBF8 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC774\uC5D0\uC694":s.summary||"\uC124\uBA85 \uC5C6\uC74C"})]),t("span",{className:"menu-chevron"},[s.residentId?g.check():g.chevron()])])]))),n>1?t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>r.setRegisterSourcePage(o-1),{variant:"secondary",disabled:o===0}),t("span",{text:`${o+1} / ${n}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>r.setRegisterSourcePage(o+1),{variant:"secondary",disabled:o+1>=n})]):null])}function Mi(e,r){return[M("\uC790\uB8CC \uC120\uD0DD",[t("p",{className:"muted",text:"\uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD560 \uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uACE8\uB77C \uC8FC\uC138\uC694. \uC6D0\uBCF8\uC740 \uC77D\uAE30\uB9CC \uD558\uACE0 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"pill-tabs two",attrs:{role:"tablist","aria-label":"\uC790\uB8CC \uC885\uB958"}},["character","persona"].map(a=>t("button",{className:`pill-tab${e.kindTab===a?" current":""}`,text:Ee[a],attrs:{type:"button",role:"tab","aria-selected":e.kindTab===a?"true":"false"},on:{click:()=>r.setRegisterKind(a)}}))),Je({id:"fw-source-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:a=>r.setRegisterQuery(a)}),Ai(e,r)],{id:"fw-source-title"})]}function Pi(e){if(!e||e.state==="loading")return P("\uC6D0\uB798 \uC124\uC815\uC744 \uC77D\uB294 \uC911\u2026");if(e.state==="error")return ee(e.message);let r=e.value;return t("div",{className:"readonly-box"},[t("p",{text:r.summary||"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."})])}function Ei(e,r){if(!r||r.state!=="ready"||!e.content)return null;let a=me(e.content,r.value.talent.talentId),i=r.value.talent.field;return t("div",{className:"talent-card",attrs:{"aria-label":"\uB9DE\uC774\uD558\uBA74 \uC815\uD574\uC9C0\uB294 \uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30"}},[t("p",{className:"talent-field"},[ke[i]("icon"),t("strong",{text:`\uC804\uBB38 \uBD84\uC57C \xB7 ${se[i]}`})]),a?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${a.name}`}),t("span",{text:a.description})]):null,t("p",{className:"muted",text:"\uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC838\uC694. \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD558\uBA74 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."})])}function Wi(e,r,a){let i=t("input",{className:"visually-hidden",attrs:{id:"fw-register-image",type:"file",accept:"image/png,image/webp"},on:{change:()=>{let o=i.files?.[0];if(i.value="",!!o){if(o.size>a){r.notify(`\uD30C\uC77C\uC774 ${Math.round(a/1024/1024)}MiB\uB97C \uB118\uC5B4\uC694. \uB2E4\uB978 \uADF8\uB9BC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694.`,"error");return}r.pickPendingImage(o)}}}}),n=e.pendingImage;return t("div",{className:"image-drop"},[i,t("label",{className:"drop-zone checker",attrs:{for:"fw-register-image"}},[n?t("img",{className:"drop-preview",attrs:{src:n.previewUrl,alt:""}}):g.addImage("icon drop-icon"),t("span",{className:"drop-text"},[t("strong",{text:n?n.file.name:"\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D"}),t("span",{text:n?`${Math.max(1,Math.round(n.file.size/1024))} KB \xB7 \uB4F1\uB85D\uD558\uBA74 WebP\uB85C \uC800\uC7A5\uD574\uC694`:"PNG \xB7 WebP \u2192 WebP \uC800\uC7A5"})])]),n?y("\uACE0\uB978 \uADF8\uB9BC \uBE7C\uAE30",()=>r.clearPendingImage(),{variant:"secondary"}):null])}function Ti(e,r,a){let i=e.selected,n=r.content?.residents.worldSettingMax??16e3,o=!!(e.generationKey&&r.busy[e.generationKey]),s=!!r.busy[`register:${i.kind}:${i.id}`],l=Object.keys(r.busy).some(w=>w.startsWith("image-upload:")&&r.busy[w]),p=s||l,d=t("span",{className:"counter-text",text:`${e.draft.length} / ${n}`,attrs:{id:"fw-draft-count"}}),c=t("textarea",{className:"textarea",attrs:{id:"fw-world-setting",maxlength:String(n),rows:"10",placeholder:"\uC774 \uC138\uACC4\uC5D0\uC11C \uC5B4\uB5A4 \uC8FC\uBBFC\uC778\uC9C0 \uC801\uC5B4 \uC8FC\uC138\uC694.","aria-describedby":"fw-world-setting-help fw-draft-count"},on:{input:()=>{d.textContent=`${c.value.length} / ${n}`,a.setDraft(c.value),f.disabled=!c.value.trim()}}});c.value=e.draft;let m=e.preview?.state==="ready",u=e.panel??"source",f=y("\uB2E4\uC74C: \uC8FC\uBBFC \uADF8\uB9BC",()=>a.setRegisterPanel("image"),{disabled:!e.draft.trim()});return[t("section",{className:"card selected-source"},[t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>a.backToSources()}},[E(fe.portrait,{className:"manage-art",fallback:()=>g.document()}),t("span",{className:"menu-text"},[t("small",{className:"muted",text:"\uC120\uD0DD\uD55C \uC790\uB8CC"}),t("span",{className:"menu-title",text:`${Ee[i.kind]} \xB7 ${i.name}`})]),t("span",{className:"menu-chevron"},[g.chevron()])])]),u==="source"?t("section",{className:"card rebuild",attrs:{"aria-labelledby":"fw-original"}},[t("h2",{className:"section-title doc",text:"\uC6D0\uB798 \uC124\uC815",attrs:{id:"fw-original"}}),Pi(e.preview),Ei(r,e.preview),y("\uB2E4\uC74C: \uACF5\uBC29 \uC124\uC815",()=>a.setRegisterPanel("setting"),{disabled:!m})]):null,u==="setting"?t("section",{className:"card rebuild"},[t("label",{className:"section-title",text:"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815",attrs:{for:"fw-world-setting"}}),t("p",{className:"muted",text:"\uC6D0\uB798 \uD504\uB85C\uD544\uC758 \uC131\uACA9\uACFC \uB9D0\uD22C\uB97C \uC0B4\uB824 \uACF5\uBC29\uC5D0 \uB9DE\uB294 \uC124\uC815\uC744 \uC900\uBE44\uD574\uC694. \uC644\uC131\uB41C \uB0B4\uC6A9\uC744 \uD655\uC778\uD558\uACE0 \uD544\uC694\uD558\uBA74 \uC218\uC815\uD574 \uC8FC\uC138\uC694.",attrs:{id:"fw-world-setting-help"}}),o?P("\uC8FC\uBBFC\uC758 \uACF5\uBC29 \uD504\uB85C\uD544\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694\u2026"):null,t("div",{className:"textarea-wrap"},[c,d]),t("div",{className:"rule-actions even"},[t("button",{className:"button",attrs:{type:"button"},on:{click:()=>{c.focus(),c.setSelectionRange(c.value.length,c.value.length)}}},[g.pencil("icon"),t("span",{text:"\uC218\uC815"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:o||!m,on:{click:()=>{a.suggestSetting()}}},[o?null:g.sparkle("icon"),t("span",{text:o?"\uC900\uBE44 \uC911\u2026":"\uB2E4\uC2DC \uC900\uBE44"})])]),t("p",{className:"hint",text:"\uD655\uC778\uD55C \uD504\uB85C\uD544\uC740 \uD3B8\uC9C0\uC640 \uC774\uC57C\uAE30\uC5D0\uC11C \uD568\uAED8 \uC0AC\uC6A9\uD574\uC694. \uC6D0\uBCF8 \uCE90\uB9AD\uD130\xB7\uD398\uB974\uC18C\uB098\uB294 \uBC14\uAFB8\uC9C0 \uC54A\uC544\uC694."}),t("div",{className:"rule-actions even"},[y("\uC774\uC804",()=>a.setRegisterPanel("source"),{variant:"secondary"}),f])]):null,u==="image"?M("\uC8FC\uBBFC \uADF8\uB9BC \uC9C1\uC811 \uB4F1\uB85D",[Wi(e,a,r.content?.residents.maxImageBytes??20*1024*1024),t("p",{className:"hint center"},[g.info("icon"),"\uC6D0\uBCF8 \uD504\uB85C\uD544\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."])],{id:"fw-register-image-title"}):null,u==="image"?t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:p||!m,on:{click:()=>{a.confirmRegister(!0,(w,v)=>a.uploadResidentImage(w,v))}}},[g.leaf("icon"),t("span",{text:s?"\uB4F1\uB85D\uD558\uB294 \uC911\u2026":l?"\uADF8\uB9BC \uC800\uC7A5 \uC911\u2026":"\uC8FC\uBBFC \uB4F1\uB85D\uD558\uAE30"}),g.chevron("icon")]):null,u==="image"?t("button",{className:"button secondary",attrs:{type:"button","data-wide":""},disabled:p||!m,on:{click:()=>{a.confirmRegister(!1,async()=>{})}}},[g.clock("icon"),t("span",{text:"\uADF8\uB9BC \uC5C6\uC774 \uC8FC\uBBFC \uB4F1\uB85D"})]):null,u==="image"?y("\uC774\uC804: \uACF5\uBC29 \uC124\uC815",()=>a.setRegisterPanel("setting"),{variant:"secondary"}):null]}function zi(e,r,a,i){let n=Object.values(r.state.residents),o=!!a.busy["choose-starter"],s=Math.max(1,n.length),l=Math.min(e.starterPage??0,s-1);return[M("\uC2DC\uC791 \uC8FC\uBBFC",[t("p",{className:"muted",text:"\uACF5\uBC29\uC5D0\uC11C \uD568\uAED8 \uC2DC\uC791\uD560 \uC8FC\uBBFC \uD55C \uBA85\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uB2E4\uB978 \uC8FC\uBBFC\uC740 \uCD08\uB300\uB85C \uB9DE\uC774\uD574\uC694."}),t("ul",{className:"starter-list",attrs:{role:"radiogroup","aria-label":"\uC2DC\uC791 \uC8FC\uBBFC"}},n.slice(l,l+1).map(p=>t("li",{},[t("button",{className:`starter-option${e.starterChoice===p.residentId?" chosen":""}`,attrs:{type:"button",role:"radio","aria-checked":e.starterChoice===p.residentId?"true":"false"},on:{click:()=>i.setStarterChoice(p.residentId)}},[t("span",{className:"starter-stage"},[re(p)]),t("strong",{text:p.displayName}),Q(p)])]))),s>1?t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>i.setRegisterStarterPage(l-1),{variant:"secondary",disabled:l===0}),t("span",{text:`${l+1} / ${s}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>i.setRegisterStarterPage(l+1),{variant:"secondary",disabled:l+1>=s})]):null],{id:"fw-starter-title"}),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:o||!e.starterChoice,on:{click:()=>{i.confirmStarter()}}},[g.house("icon"),t("span",{text:o?"\uB9DE\uC774\uD558\uB294 \uC911\u2026":e.starterChoice?`${r.state.residents[e.starterChoice]?.displayName??"\uC120\uD0DD\uD55C \uC8FC\uBBFC"}\uACFC(\uC640) \uC2DC\uC791\uD558\uAE30`:"\uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694"})]),y("\uC8FC\uBBFC \uB354 \uB4F1\uB85D\uD558\uAE30",()=>i.registerAnother(),{variant:"secondary",attrs:{"data-wide":""}})]}function Ur(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.register,n;return!a||!i?n=[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]:i.step===3?n=[bt(3),...zi(i,a,e,r)]:i.step===2&&i.selected?n=[bt(2),...Ti(i,e,r)]:n=[bt(1),...Mi(i,r)],T(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uB4F1\uB85D",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:n,nav:!1})}var Jr="ABCDEFGHIJKLMNOPQRSTUVWXYZ";function Li(e,r){return[...e?.relationStages??[]].reverse().find(i=>r>=i.from)?.label??"\u2013"}function Xr(e,r,a){return a.state.residents[ot(e,r.residentId)]??null}function ji(e,r){let a=r.map((i,n)=>`A\u2013${Jr[n+1]??"?"}`).join(" \xB7 ");return M(null,[t("div",{className:"relation-hero"},[D(e,"large"),t("span",{className:"hero-label",text:`\uACF5\uC720 \uC8FC\uBBFC \xB7 ${e.displayName}`}),t("strong",{className:"hero-pairs",text:r.length?a:"\uC544\uC9C1 \uD398\uC5B4\uAC00 \uC5C6\uC5B4\uC694"}),t("p",{className:"hero-note",text:r.length>1?"\uB450 \uAD00\uACC4\uB294 \uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC838\uC694":r.length===1?"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4\uC608\uC694":"\uB2E4\uB978 \uC8FC\uBBFC\uACFC \uD398\uC5B4\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC5B4\uC694"})])],{className:"hero-card"})}function Yr(e,r,a){return t("button",{className:"button secondary",attrs:{type:"button"},on:{click:a}},[E(fe[e],{className:"action-art",fallback:()=>g.book("icon")}),t("span",{text:r})])}function Oi(e,r,a,i,n,o){let s=Xr(e,a,i),l=n.relationsEditing,p=!!n.busy[`pair-archive:${e.pairId}`];return t("li",{className:"pair-row card"},[t("div",{className:"pair-faces"},[t("span",{className:"pair-letters"},[t("span",{className:"letter",text:"A"}),"\xD7",t("span",{className:"letter",text:Jr[r+1]??"?"})]),t("span",{className:"faces"},[D(a),t("span",{className:"times",text:"\xD7"}),D(s)]),t("span",{className:"partner-name",text:s?.displayName??"\uC54C \uC218 \uC5C6\uB294 \uC8FC\uBBFC"})]),t("div",{className:"pair-info"},[t("div",{className:"relation-now"},[t("small",{text:"\uD604\uC7AC \uAD00\uACC4"}),t("strong",{text:Li(n.content,e.familiarity)})]),t("p",{className:"recent"},[t("span",{className:"recent-label",text:"\uCD5C\uADFC \uC0AC\uAC74"}),t("span",{text:e.lastEvent?.summary??"\uC544\uC9C1 \uC5C6\uC5B4\uC694"})]),l?t("div",{className:"pair-actions"},[y(p?"\uBCF4\uAD00 \uC911\u2026":"\uBCF4\uAD00",()=>{o.archivePair(e.pairId)},{variant:"secondary",disabled:p})]):t("div",{className:"pair-actions"},[Yr("memory","\uAE30\uC5B5 \uBCF4\uAE30",()=>o.openMemory(e.pairId)),Yr("guidelines","\uC9C0\uCE68 \uAD00\uB9AC",()=>o.openGuidelines(e.pairId))])])])}function Vi(e,r,a,i,n){return e.length===0?null:M("\uBCF4\uAD00\uD55C \uD398\uC5B4",[t("ul",{className:"archived-list"},e.map(o=>{let s=Xr(o,r,a),l=!!i.busy[`pair-restore:${o.pairId}`];return t("li",{className:"archived-row"},[D(s),t("span",{className:"archived-name",text:`${r.displayName} \xD7 ${s?.displayName??"?"}`}),y(l?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uB418\uB3CC\uB9AC\uAE30",()=>{n.restorePair(o.pairId)},{variant:"secondary",disabled:l})])}))],{id:"fw-archived"})}function Di(e,r,a,i){let n=new Map(Object.values(r.state.pairs).filter(s=>s.residentIds.includes(e.residentId)).map(s=>[ot(s,e.residentId),s.archived])),o=Object.values(r.state.residents).filter(s=>s.residentId!==e.residentId);return W("fw-pair-add","\uD398\uC5B4 \uCD94\uAC00",[t("p",{className:"muted",text:`${e.displayName}\uC758 \uD398\uC5B4\uAC00 \uB420 \uC8FC\uBBFC\uC744 \uACE8\uB77C \uC8FC\uC138\uC694. \uD398\uC5B4\uB97C \uB9CC\uB4E4\uC5B4\uB3C4 \uC9C0\uB09C \uAE30\uC5B5\uC774\uB098 \uC5F0\uC560 \uAD00\uACC4\uAC00 \uC0C8\uB85C \uC0DD\uAE30\uC9C0\uB294 \uC54A\uC544\uC694.`}),o.length===0?t("p",{className:"empty",text:"\uD568\uAED8\uD560 \uB2E4\uB978 \uC8FC\uBBFC\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30\uC5D0\uC11C \uBA3C\uC800 \uB4F1\uB85D\uD574 \uC8FC\uC138\uC694."}):t("ul",{className:"candidate-list"},o.map(s=>{let l=n.has(s.residentId),p=nt(e.residentId,s.residentId);return t("li",{},[t("button",{className:"candidate",attrs:{type:"button"},disabled:l||!!a.busy[p],on:{click:()=>{i.addPair(e.residentId,s.residentId)}}},[D(s),t("span",{className:"candidate-name",text:s.displayName}),Q(s),t("span",{className:"candidate-state",text:l?n.get(s.residentId)?"\uBCF4\uAD00\uD568\uC5D0 \uC788\uC5B4\uC694":"\uC774\uBBF8 \uD398\uC5B4":a.busy[p]?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uACE0\uB974\uAE30"})])])})),y("\uB2EB\uAE30",()=>i.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Qr(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=a?a.state.residents[e.focusResidentId??""]??null:null,n={top:{kind:"sub",title:"\uAD00\uACC4",subtitle:"\uAC19\uC740 \uC138\uACC4\uC5D0\uC11C \uC774\uC5B4\uC9C0\uB294 \uAD00\uACC4",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"forest",nav:!0};if(!a||!i)return T(e,r,{...n,body:[P(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uAD00\uACC4\uB97C \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")]});let o=Object.values(a.state.pairs).filter(l=>l.residentIds.includes(i.residentId)).sort((l,p)=>l.createdAt.localeCompare(p.createdAt)),s=o.filter(l=>!l.archived);return T(e,r,{...n,body:[ji(i,s),t("ul",{className:"pair-list"},s.map((l,p)=>Oi(l,p,i,a,e,r))),t("p",{className:"notice-strip"},[t("span",{className:"bang",text:"!"}),"\uD398\uC5B4 \uC9C0\uC815\uC740 \uC5F0\uC778 \uC120\uC5B8\uC774 \uC544\uB2C8\uC5D0\uC694."]),t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"pair-add",residentId:i.residentId})}},[g.people("icon"),t("span",{text:"\uD398\uC5B4 \uCD94\uAC00"})]),t("button",{className:`button secondary${e.relationsEditing?" pressed":""}`,attrs:{type:"button","aria-pressed":e.relationsEditing?"true":"false"},on:{click:()=>r.toggleRelationsEditing()}},[g.archive("icon"),t("span",{text:e.relationsEditing?"\uBCC0\uACBD \uB05D\uB0B4\uAE30":"\uBCC0\uACBD \xB7 \uBCF4\uAD00"})])]),e.relationsEditing?Vi(o.filter(l=>l.archived),i,a,e,r):null],sheet:e.sheet?.kind==="pair-add"?Di(i,a,e,r):null})}function Zr(e){return`${Math.max(1,Math.round(e/1024)).toLocaleString("ko-KR")} KB`}function wt(e,r,a,i,n,o,s){let l=`fw-placement-${e}`,p=t("span",{className:"slider-value",text:s(i)}),d=t("input",{className:"slider",attrs:{id:l,type:"range",min:String(n.min),max:String(n.max),step:"1",value:String(i),"aria-valuetext":s(i)},on:{input:()=>p.textContent=s(Number(d.value)),change:()=>o.setPlacementDraft({[e]:Number(d.value)})}});return t("div",{className:"setting-row slider-row"},[r("icon"),t("label",{className:"setting-label",text:a,attrs:{for:l}}),d,p])}function Bi(e,r,a){let i=!!r.busy[`image-restore:${e.residentId}`],n=o=>t("li",{className:"history-item"},[t("span",{className:"history-thumb checker"},[t("img",{attrs:{src:o.url,alt:""}})]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:o.fileName||"\uC774\uC804 \uADF8\uB9BC"}),t("span",{className:"menu-detail",text:`${o.width} \xD7 ${o.height} \xB7 ${Zr(o.bytes)}`})]),y(i?"\uB418\uB3CC\uB9AC\uB294 \uC911\u2026":"\uC774 \uADF8\uB9BC\uC73C\uB85C",()=>{a.restoreResidentImage(e.residentId,o.reference)},{disabled:i})]);return W("fw-image-history","\uC774\uC804 \uADF8\uB9BC",[e.image.history.length?t("ul",{className:"history-list"},e.image.history.map(n)):t("p",{className:"empty",text:"\uB418\uB3CC\uB9B4 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uCD5C\uADFC 3\uC7A5\uAE4C\uC9C0 \uBCF4\uAD00\uD574\uC694. \uC9C0\uB09C \uC774\uC57C\uAE30 \uB2E4\uC2DC\uBCF4\uAE30\uC5D0\uB3C4 \uC9C0\uAE08 \uADF8\uB9BC\uC774 \uC4F0\uC5EC\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Fi(e,r,a){let i=r.content?.residents.placement,n=r.placementDraft??e.image.placement,o=e.image.current,s=!!r.busy[`image-upload:${e.residentId}`],l=!!r.busy[`placement:${e.residentId}`],p=JSON.stringify(n)!==JSON.stringify(e.image.placement),d=t("input",{className:"visually-hidden",attrs:{id:"fw-image-file",type:"file",accept:"image/png,image/webp"},disabled:s,on:{change:()=>{let m=d.files?.[0];d.value="",m&&a.uploadResidentImage(e.residentId,m)}}}),c=m=>m>0?`+${m}`:String(m);return[t("section",{className:"card image-card"},[t("p",{className:"target-ribbon"},[g.leaf("icon"),t("strong",{text:e.displayName})]),t("div",{className:"image-stage checker"},[re(e,{placement:n,marker:!0})]),o?t("details",{className:"detail-help"},[t("summary",{text:"\uD604\uC7AC \uADF8\uB9BC \uC815\uBCF4"}),t("div",{className:"file-facts"},[t("strong",{text:o.fileName||"resident.webp"}),t("span",{text:`${o.width} \xD7 ${o.height} / ${Zr(o.bytes)}`})])]):t("p",{className:"muted",text:"\uADF8\uB9BC \uC5C6\uC774\uB3C4 \uACF5\uBC29\uC744 \uC774\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694."}),d,t("label",{className:`button big-action file-button${s?" busy":""}`,attrs:{for:"fw-image-file","data-wide":"","aria-disabled":s?"true":"false"}},[t("span",{text:s?"WebP\uB85C \uC800\uC7A5\uD558\uB294 \uC911\u2026":o?"\uD30C\uC77C \uC120\uD0DD \xB7 \uAD50\uCCB4":"\uD30C\uC77C \uC120\uD0DD"})]),i?t("div",{className:"setting-block sliders"},[wt("scale",g.zoom,"\uADF8\uB9BC \uD06C\uAE30",n.scale,i.scale,a,m=>`${m}%`),wt("offsetX",g.arrows,"\uC88C\uC6B0 \uC704\uCE58",n.offsetX,i.offsetX,a,c),wt("markerHeight",g.updown,"\uAC10\uC815 \uD45C\uC2DC \uB192\uC774",n.markerHeight,i.markerHeight,a,c)]):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:l||!p,on:{click:()=>{a.applyPlacement(e.residentId)}}},[t("span",{text:l?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":p?"\uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("details",{className:"detail-help"},[t("summary",{text:"\uADF8\uB9BC \uC5C5\uB85C\uB4DC \uC548\uB0B4"}),t("ul",{className:"rules"},[t("li",{text:"PNG \xB7 \uC815\uC801 WebP \uC5C5\uB85C\uB4DC (20MiB \xB7 4096px\uAE4C\uC9C0)"}),t("li",{text:"\uD22C\uBA85\uB3C4 \uC720\uC9C0 \xB7 WebP \uD488\uC9C8 95 \uC800\uC7A5"}),t("li",{text:"PNG \uC6D0\uBCF8\uC740 \uB530\uB85C \uBCF4\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."})])]),t("div",{className:"rule-actions even"},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>a.resetPlacementDraft()}},[g.restore("icon"),t("span",{text:"\uAE30\uBCF8 \uBC30\uCE58"})]),t("button",{className:"button secondary",attrs:{type:"button"},disabled:e.image.history.length===0,on:{click:()=>a.openSheet({kind:"image-history",residentId:e.residentId})}},[g.image("icon"),t("span",{text:`\uC774\uC804 \uADF8\uB9BC${e.image.history.length?` ${e.image.history.length}`:""}`})])])])]}function ea(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=a?a.state.residents[e.focusResidentId??""]??null:null;return T(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC \uADF8\uB9BC",back:{route:"residents",label:"\uC8FC\uBBFC"},resources:!1},backdrop:"wood",body:i?Fi(i,e,r):[P(a?"\uC8FC\uBBFC\uC744 \uACE0\uB978 \uB4A4 \uC8FC\uBBFC \uADF8\uB9BC\uC744 \uC5F4\uC5B4 \uC8FC\uC138\uC694.":"\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:i&&e.sheet?.kind==="image-history"?Bi(i,e,r):null})}function ta(e,r,a,i){let n=r.state.residents[i],o=e.content;if(!n||!o)return null;let s=me(o,n.talentId),l=o.facilities.find(p=>p.field===n.field);return W("fw-field",`${n.displayName}\uC758 \uC804\uBB38 \uBD84\uC57C \xB7 \uD2B9\uAE30`,[t("div",{className:"talent-card"},[t("p",{className:"talent-field"},[ke[n.field]("icon"),t("strong",{text:`${se[n.field]} \uBD84\uC57C`}),t("span",{className:"muted",text:` \xB7 ${l?.name??""}`})]),t("p",{className:"muted",text:`${l?.name??"\uAC19\uC740 \uBD84\uC57C \uC2DC\uC124"}\uC5D0 \uBC30\uCE58\uD558\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694: \uAE30\uBCF8 ${U(ce(o,0))} \u2192 \uC9C0\uAE08 ${U(ce(o,n.breakthrough))} (\uB3CC\uD30C ${n.breakthrough}/${o.crew.maxBreakthrough}).`}),s?t("p",{className:"talent-name"},[t("strong",{text:`\uD2B9\uAE30 \xB7 ${s.name}`}),t("span",{text:s.description})]):null]),t("p",{className:"hint",text:"\uC804\uBB38 \uBD84\uC57C\uC640 \uD2B9\uAE30\uB294 \uC8FC\uBBFC\uC744 \uB9DE\uC774\uD560 \uB54C \uC6D0\uB798 \uC124\uC815\uC744 \uBC14\uD0D5\uC73C\uB85C \uC815\uD574\uC84C\uC5B4\uC694. \uC6D0\uBCF8 \uCE74\uB4DC\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function Gi(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function yt(e,r){return r?t("div",{className:"source-field"},[t("strong",{text:e}),t("p",{text:r})]):null}function ra(e,r,a,i){let n=e.state.residents[i];if(!n)return null;let o=r.content?.residents.worldSettingMax??16e3,s=!!r.busy[`resident-setting:${i}`],l=r.sheet?.kind==="profile"&&r.sheet.residentId===i?r.sheet:null,p=l?.draft??n.worldSetting,d=t("span",{className:"counter-text",text:`${p.length} / ${o}`}),c=t("textarea",{className:"textarea",attrs:{id:"fw-profile-setting",maxlength:String(o),rows:"4","aria-describedby":"fw-profile-count"},on:{input:()=>{d.textContent=`${c.value.length} / ${o}`,a.rememberProfile({draft:c.value})}}});c.value=p,d.id="fw-profile-count";let{source:m}=n,u=t("div",{className:"compare-box source"},[t("h3",{className:"compare-title"},[g.document("icon"),"\uC6D0\uB798 \uC124\uC815"]),t("p",{className:"muted",text:`${m.name} \xB7 ${Gi(m.takenAt)}\uC5D0 \uC77D\uC74C \xB7 \uC6D0\uBCF8\uC740 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694`}),yt("\uC124\uBA85",m.description),yt("\uC131\uACA9",m.personality),yt("\uC0C1\uD669",m.scenario),!m.description&&!m.personality&&!m.scenario?t("p",{className:"muted",text:"\uC6D0\uBCF8\uC5D0 \uC801\uD78C \uC124\uBA85\uC774 \uC5C6\uC5B4\uC694."}):null]),f=t("div",{className:"profile-panel"},[t("form",{className:"compare-box world",on:{submit:x=>{x.preventDefault(),c.value.trim()&&c.value!==n.worldSetting&&a.updateWorldSetting(i,c.value)}}},[t("label",{className:"compare-title",attrs:{for:"fw-profile-setting"}},[g.leaf("icon"),"\uACF5\uBC29 \uC138\uACC4 \uC124\uC815"]),r.busy[`profile:${i}`]?P("\uACF5\uBC29 \uD504\uB85C\uD544\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694\u2026"):null,t("div",{className:"profile-prose"},n.worldSetting.split(/\n\s*\n/u).map(x=>t("p",{text:x}))),t("details",{className:"profile-edit",attrs:l?.draft!==void 0?{open:""}:{}},[t("summary",{text:"\uACF5\uBC29 \uC124\uC815 \uC218\uC815"}),c,d,t("button",{className:"button small",text:s?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815 \uC800\uC7A5",attrs:{type:"submit"},disabled:s||!!r.busy[`profile:${i}`]})])])]),w=t("div",{className:"profile-panel"},[u]),v=[f,w],k=["\uACF5\uBC29 \uC124\uC815","\uC6D0\uB798 \uC124\uC815"].map((x,$)=>t("button",{className:"profile-tab",text:x,attrs:{type:"button","aria-pressed":$===0?"true":"false"},on:{click:()=>{a.rememberProfile({panel:$}),h($)}}}));function h(x){v.forEach(($,I)=>$.hidden=I!==x),k.forEach(($,I)=>$.setAttribute("aria-pressed",I===x?"true":"false"))}return h(l?.panel===1?1:0),t("div",{className:"sheet-backdrop"},[t("section",{className:"sheet card",attrs:{role:"dialog","aria-modal":"true","aria-labelledby":"fw-profile"}},[t("div",{className:"sheet-head"},[t("h2",{className:"section-title",text:"\uC8FC\uBBFC \uD504\uB85C\uD544",attrs:{id:"fw-profile"}}),y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary"})]),t("div",{className:"profile-identity"},[D(n,"large"),t("div",{className:"profile-identity-text"},[t("strong",{text:n.displayName}),Q(n),t("span",{text:n.recruited?"\uACF5\uBC29 \uC8FC\uBBFC":"\uCD08\uB300 \uB300\uAE30"}),t("button",{className:"outline-button",text:"\uAD00\uACC4 \uBCF4\uAE30",attrs:{type:"button"},on:{click:()=>{if(c.value!==n.worldSetting){a.notify("\uC218\uC815\uD55C \uACF5\uBC29 \uC124\uC815\uC744 \uC800\uC7A5\uD55C \uB4A4 \uAD00\uACC4\uB97C \uBCFC \uC218 \uC788\uC5B4\uC694.");return}a.openRelations(i)}}})])]),t("div",{className:"profile-tabs",attrs:{"aria-label":"\uD504\uB85C\uD544 \uB0B4\uC6A9 \uC120\uD0DD"}},k),...v])])}var qi=[{id:"all",label:"\uC804\uCCB4"},{id:"character",label:"\uCE90\uB9AD\uD130"},{id:"persona",label:"\uD398\uB974\uC18C\uB098"}],Xe=[{id:"all",label:"\uBAA8\uB450"},{id:"recruited",label:"\uC601\uC785\uD55C \uC8FC\uBBFC"},{id:"waiting",label:"\uCD08\uB300 \uB300\uAE30"}];function _i(e,r){let a=Xe[(Xe.findIndex(n=>n.id===e.filter)+1)%Xe.length],i=Xe.find(n=>n.id===e.filter);return t("div",{className:"search-bar"},[Je({id:"fw-resident-search",value:e.query,placeholder:"\uC774\uB984\uC73C\uB85C \uCC3E\uAE30",onSearch:n=>r.setResidentsQuery(n)}),t("button",{className:`icon-button filter${e.filter==="all"?"":" active"}`,attrs:{type:"button","aria-label":`\uBCF4\uAE30: ${i.label} (\uB204\uB974\uBA74 ${a.label})`},on:{click:()=>r.setResidentsFilter(a.id)}},[g.filter()]),e.filter==="all"?null:t("span",{className:"filter-chip",text:i.label})])}function Hi(e,r){return t("div",{className:"pill-tabs",attrs:{role:"tablist","aria-label":"\uC8FC\uBBFC \uC885\uB958"}},qi.map(a=>t("button",{className:`pill-tab${e.tab===a.id?" current":""}`,text:a.label,attrs:{type:"button",role:"tab","aria-selected":e.tab===a.id?"true":"false"},on:{click:()=>r.setResidentsTab(a.id)}})))}function Ki(e,r){let a=se[e.field];return t("button",{className:"tag field",attrs:{type:"button","aria-label":`${e.displayName} \uC804\uBB38 \uBD84\uC57C ${a} \u2014 \uD2B9\uAE30 \uBCF4\uAE30`},on:{click:()=>r.openSheet({kind:"field",residentId:e.residentId})}},[ke[e.field]("icon tiny"),t("span",{text:a})])}function Ui(e,r,a){return t("li",{className:`resident-card${a?" selected":""}`},[t("button",{className:"resident-card-main",attrs:{type:"button","aria-label":`${e.displayName} \uC790\uC138\uD788 \uBCF4\uAE30`,"aria-pressed":String(a)},on:{click:()=>r.selectResident(e.residentId)}},[t("span",{className:"card-stage"},[re(e)]),t("strong",{className:"resident-name",text:e.displayName}),t("span",{className:"tag-row"},[t("span",{className:"resident-field-label",text:`${e.kind==="character"?"\uCE90\uB9AD\uD130":"\uD398\uB974\uC18C\uB098"} \xB7 ${se[e.field]}`})]),t("span",{className:`status-pill ${e.recruited?"done":"waiting"}`,text:e.recruited?"\uC601\uC785 \uC644\uB8CC":"\uCD08\uB300 \uB300\uAE30"})])])}function vt(e,r,a){return t("button",{className:"detail-action",attrs:{type:"button"},on:{click:a}},[e("icon"),t("span",{text:r})])}function Yi(e,r,a){let i=a?.crew.maxBreakthrough??5,n=a?ce(a,0):0,o=a?ce(a,e.breakthrough):0,s=me(a,e.talentId),l=Object.entries(r.state.production.facilities).find(([,c])=>c.residentId===e.residentId)?.[0],p=a?.facilities.find(c=>c.id===l),d=e.recruited?p?p.field===e.field?`${p.name}\uC5D0\uC11C \uCC98\uB9AC \uC18D\uB3C4 +${U(o)}`:`${p.name}\uC5D0 \uC788\uC9C0\uB9CC \uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC\uAC00 \uC5C6\uC5B4\uC694.`:"\uC544\uC9C1 \uBC30\uCE58\uD558\uC9C0 \uC54A\uC558\uC5B4\uC694. \uACF5\uBC29 \uC791\uC5C5 \u2192 \uBC30\uCE58 \uBCC0\uACBD.":"\uCD08\uB300\uD558\uBA74 \uC2DC\uC124\uC5D0 \uBC30\uCE58\uD560 \uC218 \uC788\uC5B4\uC694.";return t("div",{className:"passive-block resident-benefits"},[t("dl",{className:"resident-facts"},[t("div",{},[t("dt",{text:"\uBC30\uCE58 \uD6A8\uACFC"}),t("dd",{text:`${se[e.field]} \uCC98\uB9AC \uC18D\uB3C4 +${U(o)}`})]),s?t("div",{},[t("dt",{text:`\uD2B9\uAE30 \xB7 ${s.name}`}),t("dd",{text:s.description})]):null,t("div",{},[t("dt",{text:"\uD604\uC7AC \uBC30\uCE58"}),t("dd",{text:d})])]),t("p",{className:"breakthrough"},[t("span",{text:`\uB3CC\uD30C ${e.breakthrough}/${i}`}),t("span",{className:"leaf-pips",attrs:{"aria-hidden":"true"}},Array.from({length:i},(c,m)=>t("span",{className:`pip${m<e.breakthrough?" on":""}`})))]),t("p",{className:"muted",text:`\uAE30\uBCF8 +${U(n)} \xB7 \uB3CC\uD30C\uC5D0 \uB530\uB77C \uD6A8\uACFC\uAC00 \uC62C\uB77C\uAC00\uC694`})])}function Ji(e,r,a,i){return M(null,[t("div",{className:"resident-detail"},[t("span",{className:"detail-stage"},[re(e)]),t("div",{className:"detail-info"},[t("strong",{className:"detail-name",text:e.displayName}),t("span",{className:"tag-row"},[Q(e),Ki(e,i)])])]),Yi(e,r,a),t("div",{className:"detail-actions"},[vt(g.image,"\uC8FC\uBBFC \uADF8\uB9BC",()=>i.openResidentImage(e.residentId)),vt(g.document,"\uD504\uB85C\uD544",()=>i.openSheet({kind:"profile",residentId:e.residentId})),vt(g.heart,"\uAD00\uACC4",()=>i.openRelations(e.residentId))]),e.recruited?null:t("button",{className:"button",text:"\uCD08\uB300\uD558\uB7EC \uAC00\uAE30",attrs:{type:"button"},on:{click:()=>i.navigate("invite")}})],{className:"detail-card"})}function Xi(e,r,a){let i=r.residentsView,n=Object.values(e.state.residents),o=it(e.state,i),s=2,l=Math.max(1,Math.ceil(o.length/s)),p=Math.min(i.page??0,l-1),d=o.slice(p*s,(p+1)*s),c=d.find(u=>u.residentId===i.selectedId)??d[0]??null,m=n.length===0?t("div",{className:"empty-state"},[t("p",{text:"\uC544\uC9C1 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"muted",text:"\uCE90\uB9AD\uD130\uB098 \uD398\uB974\uC18C\uB098\uB97C \uBD88\uB7EC\uC640 \uC774 \uC138\uACC4\uC758 \uC8FC\uBBFC\uC73C\uB85C \uB9DE\uC774\uD574 \uBCF4\uC138\uC694."})]):o.length===0?t("p",{className:"empty",text:"\uC870\uAC74\uC5D0 \uB9DE\uB294 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694."}):t("ul",{className:"resident-grid"},d.map(u=>Ui(u,a,u.residentId===c?.residentId)));return[_i(i,a),t("section",{className:"card resident-board",attrs:{"aria-label":"\uC8FC\uBBFC \uBAA9\uB85D"}},[Hi(i,a),m,J("\uC8FC\uBBFC \uBAA9\uB85D \uACE0\uB974\uAE30",p,Array.from({length:l},(u,f)=>`${f+1} \xB7 ${o.slice(f*s,(f+1)*s).map(w=>w.displayName).join(" \xB7 ")}`),u=>a.setResidentsPage(u))]),c?Ji(c,e,r.content,a):null,t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},on:{click:()=>a.openRegister(1)}},[g.people("icon"),t("span",{text:"\uC8FC\uBBFC \uBD88\uB7EC\uC624\uAE30"})])]}function aa(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.sheet?.kind==="profile"&&a?ra(a,e,r,e.sheet.residentId):e.sheet?.kind==="field"&&a?ta(e,a,r,e.sheet.residentId):null;return T(e,r,{top:{kind:"sub",title:"\uC8FC\uBBFC",resources:!1},backdrop:"forest",body:a?Xi(a,e,r):[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:i})}function xt(e,r,a){return t("div",{className:"preview-row"},[e("icon"),t("span",{text:r}),t("strong",{text:a})])}function Qe(e,r,a){let i=!!e.busy.restore,n=t("input",{className:"visually-hidden",attrs:{type:"file",accept:"application/json,.json",id:a},disabled:i,on:{change:()=>{let l=n.files?.[0];l&&r.selectRestoreFile(l),n.value=""}}}),o=e.restore,s=o?.summary;return t("div",{className:"restore"},[n,t("label",{className:"menu-row",attrs:{for:a}},[t("span",{className:"menu-icon"},[g.download()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uBC31\uC5C5 \uBD88\uB7EC\uC624\uAE30"}),t("span",{className:"menu-detail",text:o?o.fileName:"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("span",{className:"menu-chevron"},[g.chevron()])]),t("div",{className:"preview-box",attrs:{"aria-live":"polite"}},[t("p",{className:"preview-head"},[g.eye("icon"),t("strong",{text:"\uBCF5\uC6D0 \uBBF8\uB9AC\uBCF4\uAE30"})]),s?t("div",{className:"preview-rows"},[xt(g.residents,"\uC8FC\uBBFC",`${s.residents}\uBA85`),xt(g.pair,"\uD398\uC5B4",`${s.pairs}\uAC1C`),xt(g.image,"\uADF8\uB9BC",`${s.pictures}\uAC1C`)]):t("p",{className:"muted",text:"\uBC31\uC5C5 \uD30C\uC77C\uC744 \uACE0\uB974\uBA74 \uB2F4\uAE34 \uB0B4\uC6A9\uC744 \uBA3C\uC800 \uBCF4\uC5EC \uB4DC\uB824\uC694."})]),t("button",{className:"button big-action",attrs:{type:"button","data-wide":""},disabled:!s||i,on:{click:()=>{r.confirmRestore()}}},[g.restore("icon"),t("span",{text:i?"\uBCF5\uC6D0\uD558\uB294 \uC911\u2026":"\uC0C8 \uC138\uACC4\uB85C \uBCF5\uC6D0"})]),t("p",{className:"hint center"},[g.info("icon"),"\uD604\uC7AC \uC138\uACC4\uB294 \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC544\uC694."])])}function Qi(e){let r=new Date(e);if(Number.isNaN(r.getTime()))return"\uC54C \uC218 \uC5C6\uC74C";let a=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit",hour12:!1}).format(r);return r.toDateString()===new Date().toDateString()?`\uC624\uB298 ${a}`:`${new Intl.DateTimeFormat("ko-KR",{month:"long",day:"numeric"}).format(r)} ${a}`}function na(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MB`:e>=1024?`${(e/1024).toFixed(1)} KB`:`${e} B`}function Zi(e){let r=e.storage,a;if(!r||r.state==="loading")a=P("\uD655\uC778\uD558\uB294 \uC911\u2026");else if(r.state==="error")a=ee(r.message);else{let i=[[g.image,"\uC8FC\uBBFC \uADF8\uB9BC","residentImagesBytes"],[g.landscape,"\uBC30\uACBD","backgroundsBytes"],[g.document,"\uAE30\uB85D","recordsBytes"]],n=Math.max(1,...i.map(([,,o])=>r.value[o]));a=t("div",{className:"usage-rows"},i.map(([o,s,l])=>{let p=r.value[l],d=t("span",{className:"usage-fill"});return d.style.width=p>0?`max(0.9em, ${Math.round(p/n*100)}%)`:"0",t("div",{className:"usage-row"},[o("icon"),t("span",{className:"usage-label",text:s}),t("span",{className:"usage-bar",attrs:{role:"presentation"}},[d]),t("span",{className:"usage-size",text:na(p)})])}))}return M("\uC800\uC7A5 \uACF5\uAC04 \uC0AC\uC6A9\uB7C9",[a,t("p",{className:"hint center"},[g.info("icon"),"\uADF8\uB9BC\uC740 WebP\uB85C \uBCF4\uAD00\uD574\uC694."])],{id:"fw-usage"})}function en(e,r){let a=!!e.busy.backup;return t("button",{className:"menu-row",attrs:{type:"button"},disabled:a,on:{click:()=>{r.downloadBackup()}}},[t("span",{className:"menu-icon"},[g.upload()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:a?"\uBC31\uC5C5 \uB9CC\uB4DC\uB294 \uC911\u2026":"\uBC31\uC5C5 \uB0B4\uBCF4\uB0B4\uAE30"}),t("span",{className:"menu-detail",text:"\uC138\uACC4 \xB7 \uC7AC\uD654 \xB7 \uCC3D\uACE0 \uD3EC\uD568 \xB7 \uBE44\uBC00\uD0A4 \uC81C\uC678"})]),t("span",{className:"menu-chevron"},[g.chevron()])])}function ia(e,r,a,i,n){return t("button",{className:"menu-row quiet",attrs:{type:"button"},on:{click:()=>e.navigate(r)}},[t("span",{className:"menu-icon quiet"},[a()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:i}),t("span",{className:"menu-detail",text:n})]),t("span",{className:"menu-chevron"},[g.chevron()])])}function oa(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=a?[t("section",{className:"card saved",attrs:{"aria-label":"\uC800\uC7A5 \uC0C1\uD0DC"}},[t("p",{className:"saved-title"},[t("span",{className:"check"},[g.check()]),"\uC800\uC7A5 \uC644\uB8CC"]),t("p",{className:"saved-time",text:`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${Qi(a.updatedAt)}`})]),Zi(e),M(null,[en(e,r),Qe(e,r,"fw-backup-restore")],{className:"menu"}),M(null,[t("button",{className:"menu-row",attrs:{type:"button"},on:{click:()=>r.openSheet({kind:"history-cleanup"})}},[t("span",{className:"menu-icon light"},[g.image()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:"\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC"}),t("span",{className:"menu-detail",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC\uC740 \uC720\uC9C0"})]),t("span",{className:"menu-chevron"},[g.chevron()])]),ia(r,"worlds",g.house,"\uB2E4\uB978 \uC138\uACC4","\uC138\uACC4 \uACE0\uB974\uAE30 \xB7 \uC0C8\uB85C \uB9CC\uB4E4\uAE30"),ia(r,"diagnostics",g.info,"\uC5F0\uACB0 \uC810\uAC80","\uC5D4\uC9C4 \uC5F0\uACB0\uACFC \uADF8\uB9BC \uC800\uC7A5 \uACBD\uB85C \uD655\uC778")],{className:"menu"})]:[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return T(e,r,{top:{kind:"sub",title:"\uC800\uC7A5\xB7\uBC31\uC5C5",back:{route:"settings",label:"\uC124\uC815"},resources:!1},backdrop:"wood",body:i,nav:!0,sheet:a&&e.sheet?.kind==="history-cleanup"?tn(a.state,e,r):null})}function tn(e,r,a){let i=Object.values(e.residents).reduce((s,l)=>s+l.image.history.length,0),n=Object.values(e.residents).flatMap(s=>s.image.history).reduce((s,l)=>s+l.bytes,0),o=!!r.busy["image-history-clear"];return W("fw-history-cleanup","\uADF8\uB9BC \uC774\uB825 \uC815\uB9AC",[i?t("p",{text:`\uC8FC\uBBFC\uB4E4\uC758 \uC774\uC804 \uADF8\uB9BC ${i}\uC7A5(${na(n)})\uC744 \uC815\uB9AC\uD574\uC694. \uC9C0\uAE08 \uC4F0\uB294 \uADF8\uB9BC\uC740 \uADF8\uB300\uB85C\uC774\uACE0, \uC815\uB9AC\uD55C \uADF8\uB9BC\uC740 '\uC774\uC804 \uADF8\uB9BC'\uC5D0\uC11C \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC5B4\uC694.`}):t("p",{className:"empty",text:"\uC815\uB9AC\uD560 \uC774\uC804 \uADF8\uB9BC\uC774 \uC5C6\uC5B4\uC694."}),t("p",{className:"hint",text:"\uB2E4\uB978 \uACF3\uC5D0\uC11C \uC4F0\uB294 \uADF8\uB9BC \uD30C\uC77C\uC740 \uAC24\uB7EC\uB9AC\uC5D0 \uADF8\uB300\uB85C \uB0A8\uC544\uC694."}),i?y(o?"\uC815\uB9AC\uD558\uB294 \uC911\u2026":`${i}\uC7A5 \uC815\uB9AC\uD558\uAE30`,()=>{a.clearImageHistory()},{disabled:o,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>a.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function rn(e,r,a){let i=!!r.busy["rename-nickname"],n=e.state.settings.playerNickname,o=t("input",{className:"input",attrs:{id:"fw-set-nick",maxlength:"24",autocomplete:"off",value:r.settingsNicknameDraft?.worldId===e.worldId?r.settingsNicknameDraft.value:n},on:{input:()=>a.rememberSettingsNickname(e.worldId,o.value)}});return t("form",{className:"setting-row",on:{submit:s=>{s.preventDefault();let l=o.value.trim();l&&l!==n&&a.saveSettingsNickname(e.worldId,o.value)}}},[g.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uB2C9\uB124\uC784",attrs:{for:"fw-set-nick"}}),t("span",{className:"setting-field"},[o,t("button",{className:"button small",text:i?"\uC800\uC7A5 \uC911\u2026":"\uC218\uC815",attrs:{type:"submit"},disabled:i})])])}function an(e,r,a){return t("div",{className:"setting-row"},[t("span",{className:"setting-label",text:"\uC9C0\uBA74 \uC124\uC815"}),t("button",{className:"button small",text:"\uD648\uC5D0\uC11C \uC601\uC5ED \uD3B8\uC9D1",attrs:{type:"button"},on:{click:()=>a.openGroundEditor()}})])}function nn(e,r){let a=t("select",{className:"input",attrs:{"aria-label":"\uD604\uC2E4 \uB0A0\uC528 \uB3C4\uC2DC"},on:{change:()=>r.setWeatherCity(a.value)}},(e.content?.weatherCities??[{id:"seoul",name:"\uC11C\uC6B8"}]).map(i=>t("option",{text:i.name,attrs:{value:i.id}})));return a.value=e.weatherCity??"seoul",t("div",{className:"setting-block live-weather-settings"},[t("strong",{text:"\uD604\uC2E4 \uB0A0\uC528"}),a,t("p",{className:"muted",text:e.weatherError??(e.liveWeather?.state==="ready"?`${e.liveWeather.value.city} \xB7 ${e.liveWeather.value.temperature}\xB0C \xB7 ${je[e.liveWeather.value.kind]} \xB7 \uD604\uC9C0 ${e.liveWeather.value.observedAt.slice(11,16)} \uAE30\uC900`:"\uC120\uD0DD\uD55C \uB3C4\uC2DC\uC758 \uB0A0\uC528\uB97C \uD655\uC778\uD558\uACE0 \uC788\uC5B4\uC694\u2026")}),y("\uB0A0\uC528 \uC0C8\uB85C\uACE0\uCE68",()=>{r.refreshWeather(!0)},{variant:"secondary"}),t("a",{text:"\uB0A0\uC528 \uC81C\uACF5: Open-Meteo",attrs:{href:"https://open-meteo.com/",target:"_blank",rel:"noopener noreferrer"}})])}function on(e,r){let a=t("input",{className:"slider",attrs:{id:"fw-font-size",type:"range",min:String(de.min),max:String(de.max),step:String(de.step),value:String(e.fontSize),"aria-valuetext":`${e.fontSize}px`},on:{change:()=>r.setFontSize(Number(a.value))}});return t("div",{className:"setting-block"},[t("div",{className:"setting-row slider-row"},[g.leaf("icon row-leaf"),t("label",{className:"setting-label",text:"\uAE00\uC790 \uD06C\uAE30",attrs:{for:"fw-font-size"}}),a,t("span",{className:"slider-value",text:`${e.fontSize}px`})]),t("p",{className:"font-preview",text:"\uC774\uB807\uAC8C \uD45C\uC2DC\uB3FC\uC694."})])}function sn(e,r){let a=[{id:"auto",label:`\uC790\uB3D9 (${$e[K({...e,seasonChoice:"auto"})]})`},{id:"spring",label:"\uBD04"},{id:"summer",label:"\uC5EC\uB984"},{id:"autumn",label:"\uAC00\uC744"},{id:"winter",label:"\uACA8\uC6B8"}];return t("div",{className:"setting-block"},[t("div",{className:"setting-row"},[g.leaf("icon row-leaf"),t("span",{className:"setting-label",text:"\uACC4\uC808",attrs:{id:"fw-season-label"}})]),t("div",{className:"chip-row season-chips",attrs:{role:"group","aria-labelledby":"fw-season-label"}},a.map(i=>t("button",{className:`pill-tab${e.seasonChoice===i.id?" current":""}`,text:i.label,attrs:{type:"button","aria-pressed":e.seasonChoice===i.id?"true":"false"},on:{click:()=>r.setSeasonChoice(i.id)}}))),t("p",{className:"hint",text:"\uC790\uB3D9\uC740 \uC120\uD0DD\uD55C \uB3C4\uC2DC\uC758 \uD604\uC9C0 \uB0A0\uC9DC\uC640 \uBC18\uAD6C\uB97C \uB530\uB77C\uC694. \uB0AE\uACFC \uBC24\uC740 \uD604\uC9C0 \uC77C\uCD9C\xB7\uC77C\uBAB0\uC744 \uB530\uB974\uBA70 \uC815\uBCF4\uAC00 \uC5C6\uC73C\uBA74 \uD604\uC9C0 06\u201318\uC2DC\uB97C \uB0AE\uC73C\uB85C \uD45C\uC2DC\uD574\uC694. \uB0A0\uC528\uB294 \uC120\uD0DD\uD55C \uB3C4\uC2DC\uC758 \uD604\uC7AC \uC815\uBCF4\uB97C \uB530\uB77C\uC694. \uACC4\uC808\uC740 \uADF8\uB9BC\uB9CC \uBC14\uAFB8\uACE0 \uC0DD\uC0B0 \xB7 \uD310\uB9E4 \xB7 \uC120\uBB3C\uC5D0\uB294 \uC601\uD5A5\uC774 \uC5C6\uC5B4\uC694."})])}function ln(e,r){let a=e.autoReading??{enabled:!1,seconds:4},i=t("select",{className:"input",attrs:{"aria-label":"\uC774\uC57C\uAE30 \uC790\uB3D9 \uB118\uAE30\uAE30 \uAC04\uACA9"},on:{change:()=>r.setAutoReading({...a,seconds:Number(i.value)})}},Array.from({length:9},(n,o)=>t("option",{text:`${o+2}\uCD08`,attrs:{value:String(o+2)}})));return i.value=String(a.seconds),t("div",{className:"setting-block"},[t("button",{className:"toggle-row",attrs:{type:"button",role:"switch","aria-checked":String(a.enabled),"aria-label":"\uC774\uC57C\uAE30 \uC790\uB3D9 \uB118\uAE30\uAE30"},on:{click:()=>r.setAutoReading({...a,enabled:!a.enabled})}},[t("span",{className:"toggle-text"},[t("strong",{text:"\uC774\uC57C\uAE30 \uC790\uB3D9 \uB118\uAE30\uAE30"}),t("span",{text:a.enabled?"\uC0C8 \uC774\uC57C\uAE30\uB97C \uC790\uB3D9\uC73C\uB85C \uB118\uACA8\uC694":"\uC9C1\uC811 \uB20C\uB7EC \uB118\uACA8\uC694"})]),t("span",{className:`switch ${a.enabled?"on":"off"}`},[t("span",{className:"knob"})])]),i,t("p",{className:"muted",text:"\uC9C8\uBB38\xB7\uAE30\uB85D\xB7\uD654\uBA74\uC744 \uBC97\uC5B4\uB0A0 \uB54C \uBA48\uCDB0\uC694. \uB2E4\uC2DC \uC2DC\uC791\uD558\uB824\uBA74 \uC774\uC57C\uAE30\uC758 \uC790\uB3D9 \uBC84\uD2BC\uC744 \uB20C\uB7EC \uC8FC\uC138\uC694. \uBCF4\uAD00\uC740 \uC9C1\uC811 \uB20C\uB7EC\uC694."})])}function dn(e,r){let a=Z(e.weatherEffects);return t("div",{className:"setting-block weather-settings"},[t("button",{className:"toggle-row",attrs:{type:"button",role:"switch","aria-label":"\uB0A0\uC528 \uD6A8\uACFC","aria-checked":String(a.enabled)},on:{click:()=>r.setWeatherEffects({...a,enabled:!a.enabled})}},[t("span",{className:"toggle-text"},[t("strong",{text:"\uB0A0\uC528 \uD6A8\uACFC"}),t("span",{text:a.enabled?"\uACF5\uBC29 \uBC30\uACBD\uC5D0 \uC740\uC740\uD558\uAC8C \uD45C\uC2DC\uD574\uC694":"\uBC30\uACBD \uD6A8\uACFC\uB97C \uC26C\uC5B4\uC694"})]),t("span",{className:`switch ${a.enabled?"on":"off"}`,attrs:{"aria-hidden":"true"}},[t("span",{className:"knob"})])]),t("p",{className:"muted",text:"\uC120\uD0DD\uD55C \uB3C4\uC2DC\uC758 \uB0A0\uC528\uB97C 15\uBD84\uB9C8\uB2E4 \uD655\uC778\uD574 \uBC30\uACBD\uC5D0 \uBC18\uC601\uD574\uC694. \uC0DD\uC0B0\uC5D0\uB294 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uC73C\uBA70, \uB3D9\uC791 \uC904\uC774\uAE30 \uC124\uC815\uC5D0\uC11C\uB294 \uC6C0\uC9C1\uC774\uC9C0 \uC54A\uC544\uC694."})])}function Ze(e,r,a){return t("button",{className:"manage-row",attrs:{type:"button"},on:{click:a}},[E(fe[e],{className:"manage-art",fallback:()=>g.document("icon")}),t("span",{className:"manage-title",text:r}),t("span",{className:"menu-chevron"},[g.chevron()])])}function cn(){let e=t("div",{className:"setting-block"},[t("strong",{text:"AI \uBAA8\uB378 \uC5F0\uACB0"}),t("p",{className:"muted",text:"\uC774 \uAE30\uAE30\uC758 \uC124\uC815\uC774\uC5D0\uC694. \uAE30\uC874 \uC774\uC57C\uAE30\uB294 \uBC14\uB00C\uC9C0 \uC54A\uC544\uC694."})]),r=t("p",{className:"muted",text:"\uC5F0\uACB0 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026",attrs:{role:"status"}});return e.append(r),Promise.resolve().then(()=>z().get("/connections")).then(a=>{if(!Array.isArray(a))throw new Error("invalid connections");let i=a.flatMap(n=>{if(!n||typeof n!="object")return[];let o=n;return typeof o.id=="string"&&typeof o.name=="string"&&o.id.length<=128?[{id:o.id,name:o.name,model:typeof o.model=="string"?o.model:""}]:[]});r.textContent="\uC120\uD0DD\uD55C \uC5F0\uACB0\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC73C\uBA74 \uD574\uB2F9 \uC0DD\uC131\uC774 \uC911\uB2E8\uB3FC\uC694.";for(let[n,o]of[["story","\uC774\uC57C\uAE30 \uC0DD\uC131"],["profile","\uC8FC\uBBFC \uC124\uC815 \uC81C\uC548"],["letter","\uC8FC\uBBFC \uD3B8\uC9C0"]]){let s=X(n),l=t("select",{className:"input",attrs:{"aria-label":o},on:{change:()=>{jt(n,l.value||null)?r.textContent="\uC5F0\uACB0 \uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.":(l.value=X(n)??"",r.textContent="\uC774 \uAE30\uAE30\uC5D0 \uC124\uC815\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694.")}}});l.append(t("option",{text:"\uC5D4\uC9C4 \uAE30\uBCF8 \uC5F0\uACB0",attrs:{value:""}})),s&&!i.some(p=>p.id===s)&&l.append(t("option",{text:"\uC5F0\uACB0\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694 \u2014 \uB2E4\uC2DC \uC120\uD0DD",attrs:{value:s}}));for(let p of i)l.append(t("option",{text:p.model?`${p.name} \xB7 ${p.model}`:p.name,attrs:{value:p.id}}));l.value=s??"",e.append(t("label",{className:"setting-row"},[t("span",{className:"setting-label",text:o}),l]))}}).catch(()=>{r.textContent="\uC5F0\uACB0 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC5D4\uC9C4 \uC5F0\uACB0\uC744 \uD655\uC778\uD558\uACE0 \uC124\uC815\uC744 \uB2E4\uC2DC \uC5F4\uC5B4 \uC8FC\uC138\uC694."}),t("details",{className:"setting-block"},[t("summary",{text:"AI \uBAA8\uB378 \uC5F0\uACB0 \uC124\uC815"}),e])}function sa(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.settingsSection??"workshop",o=a?[t("div",{className:"pill-tabs",attrs:{role:"group","aria-label":"\uC124\uC815 \uD56D\uBAA9"}},[["workshop","\uB0B4 \uACF5\uBC29"],["display","\uD45C\uC2DC"],["manage","\uAD00\uB9AC"]].map(([s,l])=>t("button",{className:`pill-tab${i===s?" current":""}`,text:l,attrs:{type:"button","aria-pressed":i===s?"true":"false"},on:{click:()=>r.setSettingsSection(s)}}))),i==="workshop"?M("\uB0B4 \uACF5\uBC29",[rn(a,e,r),an(a,e,r),nn(e,r)],{id:"fw-mine"}):null,i==="display"?M("\uD45C\uC2DC",[on(e,r),sn(e,r),dn(e,r),ln(e,r)],{id:"fw-display"}):null,i==="manage"?M("\uAD00\uB9AC",[cn(),Ze("portrait","\uC8FC\uBBFC \uADF8\uB9BC \uAD00\uB9AC",()=>r.navigate("residents")),Ze("guidelines","AI \uC9C0\uCE68 \uAD00\uB9AC",()=>r.openGuidelines()),Ze("memory","\uAE30\uC5B5 \uAD00\uB9AC",()=>r.openMemory()),Ze("backup","\uC800\uC7A5 \xB7 \uBC31\uC5C5",()=>r.navigate("backup")),t("div",{className:"note-box"},[g.clock("icon"),t("span",{},[t("strong",{text:"\uBBF8\uC811\uC18D \uB204\uC801 \uC0C1\uD55C 72\uC2DC\uAC04"}),t("span",{text:"72\uC2DC\uAC04\uC774 \uC9C0\uB098\uBA74 \uC77C\uBD80 \uC790\uB3D9 \uC9C4\uD589\uC774 \uBA48\uCDB0\uC694."})])])],{id:"fw-manage"}):null,i==="manage"?t("p",{className:"footnote",text:"\uC790\uB3D9\uD654 \uADDC\uCE59\uC740 \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC5B4\uC694."}):null]:[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];return T(e,r,{top:{kind:"sub",title:"\uC124\uC815",back:{route:"home",label:"\uD648"},resources:!1},backdrop:"wood",body:o,nav:!0})}function pn(e,r,a,i,n){let o=0;for(let s of Object.values(e.state.production.facilities))if(!(!s.unlocked||s.mode!=="auto"))for(let l of s.rules){let p=r.recipes.find(d=>d.id===l.recipeId);l.enabled&&p&&Object.keys(p.outputs)[0]===a&&(o=Math.max(o,l.targetStock))}return{floor:Math.max(i,n?0:o,e.state.production.protectedStock[a]??0),target:o}}function la(e,r,a,i){let n=new Date().toISOString().slice(0,10),o=r.state.production.sales,s=a.items.filter(m=>(r.state.inventory[m.id]??0)>0||r.state.production.autoSell[m.id]?.enabled),l=s.map(m=>{let u=r.state.production.autoSell[m.id]??{enabled:!1,keep:0,dailyMax:10},f=ue(`fw-keep-${m.id}`,u.keep,0,999,{label:`${m.name} \uB0A8\uAE38 \uC218\uB7C9`}),w=ue(`fw-daily-${m.id}`,u.dailyMax,1,999,{label:`${m.name} \uD558\uB8E8 \uCD5C\uB300`}),v=t("input",{attrs:{type:"checkbox",id:`fw-continuous-${m.id}`}});v.checked=!!u.continuous;let{floor:k,target:h}=pn(r,a,m.id,u.keep,!!(u.continuous&&u.enabled)),x=o.day===n?o.sold[m.id]??0:0,$=!!e.busy[`auto-sell:${m.id}`],I=A=>{i.setAutoSell(m.id,{enabled:A,keep:f.read(),dailyMax:w.read(),continuous:v.checked})};return t("li",{className:`auto-sell-row${u.enabled?" on":""}`},[t("div",{className:"auto-sell-head"},[B(m.id),t("span",{className:"protect-name"},[t("strong",{text:m.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[m.id]??0} \xB7 1\uAC1C ${m.sellPrice} G \xB7 \uC624\uB298 \uD310\uB9E4 ${x}`})]),t("span",{className:`switch ${u.enabled?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:u.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])]),t("div",{className:"auto-sell-fields"},[t("label",{className:"field-label",text:"\uD310\uB9E4 \uD6C4 \uB0A8\uAE38 \uC218\uB7C9",attrs:{for:`fw-keep-${m.id}`}}),f.node,t("label",{className:"field-label",text:"\uD558\uB8E8 \uCD5C\uB300 \uD310\uB9E4\uB7C9",attrs:{for:`fw-daily-${m.id}`}}),w.node]),t("label",{attrs:{for:`fw-continuous-${m.id}`}},[v," \uD310\uB9E4\uD560 \uB9CC\uD07C \uACC4\uC18D \uC0DD\uC0B0\uD558\uAE30"]),t("p",{className:"hint",text:u.enabled&&u.continuous?`\uD604\uC7AC \uD310\uB9E4 \uC2DC ${k}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694. \uD310\uB9E4 \uD55C\uB3C4\uC5D0 \uB3C4\uB2EC\uD558\uBA74 \uC77C\uBC18 \uC0DD\uC0B0 \uBAA9\uD45C ${h}\uAC1C\uB97C \uB530\uB985\uB2C8\uB2E4.`:`\uD604\uC7AC ${k}\uAC1C \uC774\uC0C1 \uB0A8\uACA8\uC694 (\uBCF4\uAD00\uB7C9 \xB7 \uC0DD\uC0B0 \uBAA9\uD45C ${h} \xB7 \uBCF4\uD638 \uC7AC\uACE0 \uC911 \uAC00\uC7A5 \uD070 \uAC12).`}),t("div",{className:"row-actions"},[y($?"\uC800\uC7A5 \uC911\u2026":u.enabled?"\uC124\uC815 \uC800\uC7A5":"\uCF1C\uAE30",()=>I(!0),{disabled:$}),u.enabled?y("\uB044\uAE30",()=>I(!1),{variant:"secondary",disabled:$}):null])])}),p=Math.max(0,Math.min(s.length-1,e.sheet?.kind==="auto-sell"?e.sheet.page??0:0)),d=t("select",{className:"input",attrs:{"aria-label":"\uC790\uB3D9 \uD310\uB9E4\uD560 \uD488\uBAA9"},on:{change:()=>c(Number(d.value))}},s.map((m,u)=>t("option",{text:m.name,attrs:{value:String(u)}})));function c(m){p=m,l.forEach((u,f)=>u.hidden=f!==p),d.value=String(p),i.rememberAutoSellPage(p)}return c(p),W("fw-auto-sell","\uC790\uB3D9 \uD310\uB9E4",[l.length?d:null,l.length?t("ul",{className:"protect-list"},l):t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}),t("details",{className:"detail-help"},[t("summary",{text:"\uC790\uB3D9 \uD310\uB9E4 \uADDC\uCE59 \xB7 \uD558\uB8E8 \uD55C\uB3C4 \uC548\uB0B4"}),t("p",{className:"muted",text:"\uCF20 \uD488\uBAA9\uC744 \uD558\uB8E8(UTC \uAE30\uC900) \uD310\uB9E4 \uD55C\uB3C4\uAE4C\uC9C0 \uD314\uC544\uC694. \uACC4\uC18D \uC0DD\uC0B0\uC744 \uC120\uD0DD\uD558\uBA74 \uB0A8\uAE38 \uC218\uB7C9\uACFC \uBCF4\uD638 \uC7AC\uACE0\uB97C \uC9C0\uD0A4\uBA70 \uD310\uB9E4\uD560 \uB9CC\uD07C \uB9CC\uB4E4\uC5B4\uC694."})]),y("\uB2EB\uAE30",()=>i.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function da(e,r){let a=new Map(r?.items.map((i,n)=>[i.id,n]));return Object.entries(e.state.inventory).filter(([,i])=>i>0).sort(([i],[n])=>(a.get(i)??999)-(a.get(n)??999)).map(([i,n])=>({itemId:i,amount:n,name:_(r,i)}))}function mn(e,r){let a=(i,n,o)=>t("button",{className:`big-tab${(e.facilitiesTab==="protection"?"facilities":e.facilitiesTab)===i?" current":""}`,attrs:{type:"button",role:"tab","aria-selected":(e.facilitiesTab==="protection"?"facilities":e.facilitiesTab)===i?"true":"false"},on:{click:()=>r.setFacilitiesTab(i)}},[o,t("span",{text:n})]);return t("div",{className:"big-tabs",attrs:{role:"tablist","aria-label":"\uC2DC\uC124\uACFC \uCC3D\uACE0"}},[a("facilities","\uC2DC\uC124",g.house("icon big")),a("storage","\uCC3D\uACE0",g.box("icon big"))])}function un(e,r,a,i){let n=e.work.facilityId,o=a.state.production.facilities[n],s=oe(r,n),l=r.production.maxLevel,p=o.level>=l,d=p?null:r.production.upgradeCosts[o.level-1],c=!!e.busy[`upgrade:${n}:${o.level}`],m=d!==null&&a.state.wallet.gold<d,u=!o.unlocked,f=pe(r,a.state,n);return M(null,[t("div",{className:"chip-row",attrs:{role:"group","aria-label":"\uC2DC\uC124 \uACE0\uB974\uAE30"}},r.facilities.map(w=>t("button",{className:`pill-tab${w.id===n?" current":""}`,attrs:{type:"button","aria-pressed":w.id===n?"true":"false","aria-label":a.state.production.facilities[w.id]?.unlocked?w.name:`${w.name} (\uD574\uAE08 \uC804)`},on:{click:()=>i.selectFacility(w.id)}},[t("span",{text:w.name}),a.state.production.facilities[w.id]?.unlocked?null:g.lock("icon tiny")]))),t("div",{className:"facility"},[t("span",{className:`facility-picture${u?" closed":""}`},[Me(n,"huge")]),t("div",{className:"facility-info"},[t("strong",{className:"facility-name",text:s?.name??n}),t("span",{className:"facility-level"},[`Lv. ${o.level}`,p?null:t("span",{className:"level-next",text:` \u2192 Lv. ${o.level+1}`})]),t("div",{className:"effect-row"},[t("span",{text:"\uCC98\uB9AC \uC18D\uB3C4"}),t("span",{},[`+${pt(r,o.level)}%`,p?null:t("span",{className:"level-next",text:` \u2192 +${pt(r,o.level+1)}%`})])]),t("div",{className:"effect-row"},[t("span",{text:"\uC791\uC5C5 \uBC29\uC2DD"}),t("span",{text:u?"\uD574\uAE08 \uC804":o.mode==="auto"?"\uC790\uB3D9 \uC6B4\uC601":"\uC9C0\uC815 \uD69F\uC218"})]),t("div",{className:"effect-row"},[t("span",{text:"\uC8FC\uBBFC \uD6A8\uACFC"}),t("span",{text:`+${U(f.total)}${f.resident?` (${f.resident.displayName})`:""}`})]),t("p",{className:"muted",text:s?.description??""}),u?t("p",{className:"hint",text:"\uACF5\uBC29 \uC791\uC5C5\uC5D0\uC11C \uD574\uAE08 \uC870\uAC74\uC744 \uCC44\uC6B0\uACE0 \uC2DC\uC124\uC744 \uC5F4\uBA74 \uAC15\uD654\uD560 \uC218 \uC788\uC5B4\uC694."}):null,t("button",{className:"gold-button",attrs:{type:"button"},disabled:u||p||c||m,on:{click:()=>{i.upgradeFacility(n,o.level)}}},p?[t("span",{text:"\uCD5C\uACE0 \uB2E8\uACC4"})]:[t("span",{className:"coin"}),t("span",{text:c?"\uAC15\uD654\uD558\uB294 \uC911\u2026":`${d.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`})]),m?t("p",{className:"hint",text:`\uACE8\uB4DC\uAC00 ${(d-a.state.wallet.gold).toLocaleString("ko-KR")} G \uBD80\uC871\uD574\uC694.`}):null])])],{className:"facility-card"})}function gn(e,r){let a=Object.values(e.state.production.autoSell).filter(i=>i.enabled).length;return t("button",{className:"toggle-row",attrs:{type:"button","aria-label":`\uC790\uB3D9 \uD310\uB9E4 ${a?`\uCF1C\uC9D0 (${a}\uAC1C \uD488\uBAA9)`:"\uAEBC\uC9D0"} \u2014 \uC124\uC815 \uC5F4\uAE30`},on:{click:()=>r.openSheet({kind:"auto-sell"})}},[t("span",{className:"toggle-icon"},[g.gear("icon")]),t("span",{className:"toggle-text"},[t("strong",{text:a?`\uC790\uB3D9 \uD310\uB9E4 \xB7 ${a}\uAC1C \uD488\uBAA9`:"\uC790\uB3D9 \uD310\uB9E4"}),t("span",{text:"\uBCF4\uD638 \uC7AC\uACE0\uC640 \uB0A8\uAE38 \uC218\uB7C9\uC744 \uC9C0\uCF1C\uC694."})]),t("span",{className:`switch ${a?"on":"off"}`},[t("span",{className:"knob"}),t("span",{className:"switch-label",text:a?"\uCF1C\uC9D0":"\uAEBC\uC9D0"})])])}function ca(e,r,a){let i=Array.from({length:Math.ceil(r.length/3)},(n,o)=>{let s=r.slice(o*3,o*3+3);return`${o+1} \xB7 ${s.map(l=>l.name).join(" \xB7 ")}`});return J("\uC7AC\uACE0 \uBAA9\uB85D \uACE0\uB974\uAE30",e,i,n=>a.setInventoryPage(n))}function pa(e,r,a,i,n=!1){return t("ul",{className:"stock-cards"},e.slice(r*3,r*3+3).map(o=>{let s=a.state.production.protectedStock[o.itemId]??0;return t("li",{className:"stock-card"},[t("div",{className:"stock-card-head"},[B(o.itemId),t("strong",{text:o.name})]),t("dl",{className:"stock-values"},[["\uBCF4\uC720",o.amount],["\uBCF4\uD638",s],["\uC0AC\uC6A9 \uAC00\uB2A5",Math.max(0,o.amount-s)]].map(([l,p])=>t("div",{},[t("dt",{text:String(l)}),t("dd",{text:Number(p).toLocaleString("ko-KR")})]))),n?y("\uD314\uAE30",()=>i.openSheet({kind:"sell",itemId:o.itemId}),{variant:"secondary",attrs:{"aria-label":`${o.name} \uD314\uAE30`}}):null])}))}function fn(e,r,a,i){let n=da(r,a),o=Math.min(e.work.inventoryPage??0,Math.max(0,Math.ceil(n.length/3)-1));return M(null,[t("div",{className:"card-head"},[t("div",{},[t("h2",{className:"section-title",text:"\uC7AC\uACE0 \uBCF4\uD638",attrs:{id:"fw-protect"}}),t("p",{className:"muted",text:"\uC9C0\uC815\uD55C \uC218\uB7C9\uC740 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uC544\uC694."})]),t("button",{className:"outline-button",attrs:{type:"button"},on:{click:()=>i.openSheet({kind:"protect-edit"})}},[g.pencil("icon"),t("span",{text:"\uD3B8\uC9D1\uD558\uAE30"})])]),n.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):pa(n,o,r,i),ca(o,n,i),gn(r,i)],{id:"fw-protect"})}function hn(e,r,a,i){let n=da(r,a),o=Math.min(e.work.inventoryPage??0,Math.max(0,Math.ceil(n.length/3)-1));return M("\uCC3D\uACE0",[n.length===0?t("p",{className:"empty",text:"\uCC3D\uACE0\uAC00 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):pa(n,o,r,i,!0),ca(o,n,i)],{id:"fw-storage"})}function bn(e,r,a,i){let n=a.production.protectedStock,o=e.sheet?.kind==="protect-edit"?e.sheet:null,s=a.items.map(c=>{let m=ue(`fw-protect-${c.id}`,o?.drafts?.[c.id]??r.state.production.protectedStock[c.id]??0,n.min,n.max,{onChange:f=>i.rememberProtection({itemId:c.id,amount:f})}),u=!!e.busy[`protect:${c.id}`];return t("li",{className:"protect-row"},[B(c.id),t("span",{className:"protect-name"},[t("strong",{text:c.name}),t("small",{className:"muted",text:`\uBCF4\uC720 ${r.state.inventory[c.id]??0}`})]),m.node,y(u?"\uC800\uC7A5 \uC911\u2026":"\uC800\uC7A5",()=>{i.setProtected(c.id,m.read())},{disabled:u,attrs:{"aria-label":`${c.name} \uBCF4\uD638 \uC218\uB7C9 \uC800\uC7A5`}})])}),l=Math.max(0,Math.min(s.length-1,o?.page??0)),p=t("select",{className:"input",attrs:{"aria-label":"\uBCF4\uD638\uD560 \uC544\uC774\uD15C"},on:{change:()=>d(Number(p.value))}},a.items.map((c,m)=>t("option",{text:c.name,attrs:{value:String(m)}})));function d(c){l=Math.max(0,Math.min(s.length-1,c)),s.forEach((m,u)=>m.hidden=u!==l),p.value=String(l),i.rememberProtection({page:l})}return d(l),W("fw-protect-edit","\uC7AC\uACE0 \uBCF4\uD638",[p,t("ul",{className:"protect-list"},s),t("p",{className:"muted",text:"\uBCF4\uD638\uD55C \uC218\uB7C9\uC740 \uC790\uB3D9 \uC81C\uC791\uACFC \uD310\uB9E4\uC5D0 \uC4F0\uC9C0 \uC54A\uC544\uC694. 0\uC774\uBA74 \uBCF4\uD638\uD558\uC9C0 \uC54A\uC544\uC694."}),y("\uB2EB\uAE30",()=>i.closeSheet(),{variant:"secondary"})])}function wn(e,r,a,i,n){let o=a.items.find(c=>c.id===n),s=r.state.inventory[n]??0,l=Math.max(0,s-(r.state.production.protectedStock[n]??0)),p=ue("fw-sell-amount",Math.min(l,1),l?1:0,l),d=!!e.busy[`sell:${n}`];return W("fw-sell",`${o?.name??n} \uD314\uAE30`,[t("p",{className:"muted",text:`1\uAC1C ${o?.sellPrice??0} G \xB7 \uD314 \uC218 \uC788\uB294 \uC591 ${l}\uAC1C (\uBCF4\uC720 ${s}\uAC1C, \uBCF4\uD638\uBD84 \uC81C\uC678)`}),l?p.node:t("p",{className:"empty",text:"\uBCF4\uD638\uBD84\uC744 \uBE7C\uBA74 \uD314 \uC218 \uC788\uB294 \uC591\uC774 \uC5C6\uC5B4\uC694."}),l?y(d?"\uD30C\uB294 \uC911\u2026":"\uD314\uAE30",()=>{i.sell(n,p.read())},{disabled:d,attrs:{"data-wide":""}}):null,y("\uB2EB\uAE30",()=>i.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function ma(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=e.content,n=a&&i,o=n&&e.sheet?.kind==="protect-edit"?bn(e,a,i,r):n&&e.sheet?.kind==="sell"?wn(e,a,i,r,e.sheet.itemId):n&&e.sheet?.kind==="auto-sell"?la(e,a,i,r):null;return T(e,r,{top:{kind:"sub",title:"\uC2DC\uC124\uACFC \uCC3D\uACE0",back:{route:"work",label:"\uACF5\uBC29 \uC791\uC5C5"},resources:!0},backdrop:"forest",body:n?[mn(e,r),...e.facilitiesTab!=="storage"?[a.state.production.facilities[e.work.facilityId]&&i.facilities?un(e,i,a,r):null,fn(e,a,i,r)]:[hn(e,a,i,r)]]:[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:o})}function ua(e,r,a,i,n){let o=oe(a,n),s=r.state.production.facilities[n]?.residentId??null,l=!!e.busy[`assign:${n}`],p=m=>Object.entries(r.state.production.facilities).find(([,u])=>u.residentId===m)?.[0]??null,d=Object.values(r.state.residents).filter(m=>m.recruited).sort((m,u)=>+(u.field===o?.field)-+(m.field===o?.field)||m.displayName.localeCompare(u.displayName,"ko")),c=pe(a,r.state,n);return W("fw-assign",`${o?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`,[t("p",{className:"muted",text:`${o?se[o.field]:""} \uBD84\uC57C \uC8FC\uBBFC\uC744 \uB450\uBA74 \uCC98\uB9AC \uC18D\uB3C4\uAC00 \uBE68\uB77C\uC838\uC694. \uC9C0\uAE08 \uC791\uC5C5\uC740 \uC2DC\uC791\uD55C \uC18D\uB3C4 \uADF8\uB300\uB85C \uB05D\uB098\uACE0, \uB2E4\uC74C \uD68C\uCC28\uBD80\uD130 \uC801\uC6A9\uB3FC\uC694. \uD398\uC5B4 \uB450 \uC0AC\uB78C\uC774 \uBAA8\uB450 \uBC30\uCE58\uB418\uBA74 \uBAA8\uB4E0 \uC2DC\uC124 +${U(a.crew.setBonusPerPair)}(\uCD5C\uB300 ${U(a.crew.setBonusMax)}).`}),t("p",{className:"assign-now"},[t("strong",{text:"\uC9C0\uAE08 "}),c.resident?c.resident.displayName:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",` \xB7 \uC8FC\uBBFC \uD6A8\uACFC +${U(c.total)}`]),d.length===0?t("div",{className:"assign-empty"},[t("p",{className:"empty",text:"\uC544\uC9C1 \uACF5\uBC29\uC5D0 \uC628 \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uC694. \uC8FC\uBBFC\uC774 \uC5C6\uC5B4\uB3C4 \uC2DC\uC124\uC740 \uACC4\uC18D \uC77C\uD574\uC694."}),r.state.progress.starterResidentId===null?y(Object.keys(r.state.residents).length?"\uC2DC\uC791 \uC8FC\uBBFC \uACE0\uB974\uAE30":"\uCCAB \uC8FC\uBBFC \uB9DE\uC774\uD558\uAE30",()=>i.openRegister(Object.keys(r.state.residents).length?3:1)):y("\uC8FC\uBBFC \uCD08\uB300\uD558\uAE30",()=>i.navigate("invite"))]):t("ul",{className:"pick-list"},d.map(m=>{let u=m.field===o?.field,f=p(m.residentId),w=me(a,m.talentId),v=[u?`+${U(ce(a,m.breakthrough))}${w?` \xB7 \uD2B9\uAE30 ${w.name}: ${w.description}`:""}`:`${se[m.field]} \uBD84\uC57C\uB77C \uD6A8\uACFC \uC5C6\uC74C`,f&&f!==n?`${oe(a,f)?.name??""}\uC5D0\uC11C \uC62E\uACA8 \uC640\uC694`:""].filter(Boolean).join(" \xB7 ");return t("li",{},[t("button",{className:`pick-row${m.residentId===s?" selected":""}`,attrs:{type:"button","aria-pressed":m.residentId===s?"true":"false"},disabled:l||m.residentId===s,on:{click:()=>{i.assignResident(n,m.residentId)}}},[D(m),t("strong",{text:m.displayName}),Q(m),t("small",{className:u?"good":"muted",text:v})])])})),s?y("\uBC30\uCE58 \uD574\uC81C",()=>{i.assignResident(n,null)},{variant:"secondary",disabled:l}):null,y("\uB2EB\uAE30",()=>i.closeSheet(),{variant:"secondary",attrs:{"data-wide":""}})])}function ga(e,r,a,i,n){let o=a.state.production.facilities[i],s=r.recipes.filter(A=>A.facilityId===i),l=wr(r,o.level),p=o.queue.length>=l,d=e.work.queueRecipe[i]??s[0]?.id??"",c=te(r,d),m=t("p",{className:"hint"}),u=pe(r,a.state,i),f=A=>{let L=c?Object.entries(qe(c,u).inputs):[];m.textContent=L.length?`\uC608\uC0C1 \uC7AC\uB8CC ${L.map(([Y,ae])=>`${_(r,Y)} ${ae*A}`).join(" \xB7 ")} \u2014 \uD55C \uD68C\uCC28\uC529 \uC2DC\uC791\uD560 \uB54C \uAEBC\uB0B4\uC694. \uC7AC\uB8CC \uD655\uBCF4\uB97C \uBBF8\uB9AC \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC544\uC694.`:"\uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."},w=r.production.queueCount,v=e.work.queueCounts?.[i]??1,k=ue(`fw-queue-count-${i}`,v,w.min,w.max,{label:"\uD69F\uC218",onChange:A=>{f(A),n.rememberQueueCount(i,A)}});f(v);let h=!!e.busy[`queue:${i}`],x=e.work.queueView??(o.queue.length?"list":"add"),$=t("select",{className:"input",attrs:{"aria-label":"\uB300\uAE30 \uC911\uC778 \uC791\uC5C5"}},o.queue.map((A,L)=>t("option",{text:`${L+1}. ${te(r,A.recipeId)?.name??A.recipeId} \xB7 ${A.started}/${A.total}\uD68C`,attrs:{value:A.entryId}}))),I=t("select",{className:"input",attrs:{"aria-label":"\uC81C\uC791\uBC95 \uACE0\uB974\uAE30"},on:{change:()=>n.selectQueueRecipe(i,I.value)}},s.map(A=>t("option",{text:A.name,attrs:{value:A.id}})));return I.value=d,t("div",{className:"plan-block queue"},[t("span",{className:"plan-label"},["\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ",t("small",{text:`(${o.queue.length}/${l}\uCE78 \xB7 \uC704\uC5D0\uC11C\uBD80\uD130 \uCC28\uB840\uB85C \uB9CC\uB4E4\uC5B4\uC694)`})]),t("div",{className:"pill-tabs two",attrs:{role:"group","aria-label":"\uB300\uAE30\uC5F4 \uD654\uBA74"}},[t("button",{className:`pill-tab${x==="list"?" current":""}`,text:"\uB300\uAE30\uC5F4 \uBCF4\uAE30",attrs:{type:"button","aria-pressed":x==="list"?"true":"false"},on:{click:()=>n.setQueueView("list")}}),t("button",{className:`pill-tab${x==="add"?" current":""}`,text:"\uC791\uC5C5 \uCD94\uAC00",attrs:{type:"button","aria-pressed":x==="add"?"true":"false"},on:{click:()=>n.setQueueView("add")}})]),x==="list"?o.queue.length===0?t("p",{className:"empty",text:"\uB300\uAE30\uC5F4\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694."}):t("div",{className:"queue-add"},[$,t("button",{className:"outline-button",text:"\uC120\uD0DD\uD55C \uC791\uC5C5 \uBE7C\uAE30",attrs:{type:"button"},disabled:Object.keys(e.busy).some(A=>A.startsWith("queue-remove:")&&e.busy[A]),on:{click:()=>{n.removeQueue(i,$.value)}}})]):null,x==="add"?t("div",{className:"queue-add"},[I,k.node,m,t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:h||p||!c,on:{click:()=>{n.addQueue(i,d,k.read())}}},[g.plus("icon"),t("span",{text:p?"\uB300\uAE30\uC5F4\uC774 \uAC00\uB4DD \uCC3C\uC5B4\uC694":h?"\uCD94\uAC00\uD558\uB294 \uC911\u2026":"\uB300\uAE30\uC5F4\uC5D0 \uCD94\uAC00"})])]):null])}var yn=[{field:"gather",label:"\uCC44\uC9D1",icon:g.leaf},{field:"grow",label:"\uC7AC\uBC30",icon:g.sprout},{field:"survey",label:"\uC870\uC0AC",icon:g.search},{field:"process",label:"\uAC00\uACF5",icon:g.jar},{field:"craft",label:"\uC81C\uC791",icon:g.hammer}];function fa(e,r,a,i){return t("div",{className:"field-tabs work-fields",attrs:{role:"tablist","aria-label":"\uC791\uC5C5 \uBD84\uC57C"}},yn.map(n=>{let o=e.facilities.find(p=>p.field===n.field);if(!o)return null;let s=o.id===a,l=r.state.production.facilities[o.id]?.unlocked??!1;return t("button",{className:`field-tab${s?" current":""}${l?"":" closed"}`,attrs:{type:"button",role:"tab","aria-selected":s?"true":"false","aria-label":l?n.label:`${n.label} (\uD574\uAE08 \uC804)`},on:{click:()=>i.selectFacility(o.id)}},[E({gather:"items/herb.webp",grow:"items/wheat.webp",survey:"ui/nav-explore.webp",process:"items/berry-jam.webp",craft:"ui/nav-work.webp"}[n.field]??null,{className:"field-art",fallback:()=>n.icon("icon field-glyph")}),t("span",{text:n.label}),l?null:t("span",{className:"lock-tag"},[g.lock("icon tiny")])])}))}function vn(e,r,a,i){let n=!!e.busy[`mode:${r}`],o=(s,l)=>t("button",{className:`segment${a.mode===s?" selected":""}`,text:l,attrs:{type:"button","aria-pressed":a.mode===s?"true":"false"},disabled:n,on:{click:()=>a.mode===s?void 0:void i.setMode(r,s)}});return t("div",{className:"segmented",attrs:{role:"group","aria-label":"\uC791\uC5C5 \uBC29\uC2DD"}},[o("auto","\uC790\uB3D9 \uC6B4\uC601"),o("count","\uC9C0\uC815 \uD69F\uC218")])}function xn(e,r,a,i,n){let o=oe(r,i),s=br(r,a.state,i),l=s.every(d=>d.met),p=!!e.busy[`unlock:${i}`];return M(null,[t("div",{className:"facility-entry"},[t("span",{className:"facility-open closed"},[t("span",{className:"facility-art closed"},[Me(i),t("span",{className:"facility-lock"},[g.lock("icon")])]),t("span",{className:"facility-text"},[t("strong",{text:`${o?.name??i} \xB7 \uD574\uAE08 \uC804`}),t("span",{text:o?.description??""})])])]),t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uD574\uAE08 \uC870\uAC74"}),t("ul",{className:"unlock-list"},s.map(d=>t("li",{className:d.met?"met":""},[(d.met?g.check:g.hourglass)("icon"),t("span",{text:d.text}),t("strong",{text:`${Math.min(d.have,d.need)} / ${d.need}`})])))]),t("button",{className:"button",attrs:{type:"button","data-wide":""},disabled:!l||p,on:{click:()=>{n.unlockFacility(i)}}},[t("span",{text:p?"\uC5EC\uB294 \uC911\u2026":l?"\uC2DC\uC124 \uC5F4\uAE30":"\uC870\uAC74\uC744 \uCC44\uC6B0\uBA74 \uC5F4 \uC218 \uC788\uC5B4\uC694"})])],{className:"work-card"})}function kn(e,r,a,i,n,o){let s=oe(r,i),l=pe(r,a.state,i),p=n.level<r.production.maxLevel?r.production.upgradeCosts[n.level-1]:void 0;return t("div",{className:"facility-entry"},[t("button",{className:"facility-open",attrs:{type:"button","aria-label":`${s?.name??"\uC2DC\uC124"} \u2014 \uC2DC\uC124\uACFC \uCC3D\uACE0 \uC5F4\uAE30`},on:{click:()=>{o.setFacilitiesTab("facilities"),o.navigate("facilities")}}},[t("span",{className:"facility-art"},[Me(i)]),t("span",{className:"facility-text"},[t("strong",{text:`${s?.name??i} Lv. ${n.level}`}),t("span",{className:"crew-line"},[l.resident?D(l.resident):null,l.resident?`${l.resident.displayName} \xB7 ${l.matches?`+${U(l.passive)}${l.talent?` \xB7 \uD2B9\uAE30 ${l.talent.name}`:""}`:"\uBD84\uC57C\uAC00 \uB2EC\uB77C \uD6A8\uACFC \uC5C6\uC74C"}`:"\uBC30\uCE58\uD55C \uC8FC\uBBFC \uC5C6\uC74C",l.set?` \xB7 \uC138\uD2B8 +${U(l.set)}`:""])])]),p!==void 0?t("button",{className:"outline-button",text:`${p.toLocaleString("ko-KR")} G \xB7 \uAC15\uD654`,attrs:{type:"button","aria-label":`${s?.name??"\uC2DC\uC124"} \uAC15\uD654 ${p} \uACE8\uB4DC`},disabled:a.state.wallet.gold<p||!!e.busy[`upgrade:${i}:${n.level}`],on:{click:()=>{o.upgradeFacility(i,n.level)}}}):null,t("button",{className:"outline-button",attrs:{type:"button","aria-label":`${s?.name??"\uC2DC\uC124"} \uBC30\uCE58 \uBCC0\uACBD`},on:{click:()=>o.openSheet({kind:"assign",facilityId:i})}},[g.swap("icon"),t("span",{text:"\uBC30\uCE58 \uBCC0\uACBD"})])])}function Nn(e,r,a,i){let n=r?te(e,r.recipeId):null;if(!n)return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[g.jar("icon big")]),t("span",{className:"recipe-text"},[t("strong",{text:"\uC81C\uC791\uBC95"}),t("span",{text:"\uC544\uB798 \uC6B0\uC120\uC21C\uC704\uC5D0\uC11C \uC81C\uC791\uBC95\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694."})])]);let o=Object.keys(n.outputs)[0],s=qe(n,i),l=hr(e,n,a,s.extraBonus),p=Object.entries(s.inputs).map(([d,c])=>`${_(e,d)} ${c}`);return t("div",{className:"recipe"},[t("span",{className:"recipe-art"},[B(o,"big")]),t("span",{className:"recipe-text"},[t("strong",{text:n.name}),t("span",{text:n.description}),t("span",{className:"recipe-flow",text:`${p.length?`${p.join(" \xB7 ")} \u2192 `:""}${Object.entries(n.outputs).map(([d,c])=>`${_(e,d)} ${c}`).join(" \xB7 ")} \xB7 1\uD68C ${be(l)}`}),s.talentApplies&&i.talent?t("span",{className:"talent-note"},[g.sparkle("icon tiny"),` \uD2B9\uAE30 ${i.talent.name}: ${i.talent.description}`]):null])])}function Sn(e,r,a,i,n){let o=te(e,i.recipeId),s=o?Object.keys(o.outputs)[0]:"",l=r.state.production,p=r.state.inventory[s]??0,d=Object.values(l.facilities).reduce((u,f)=>u+(f.job?.outputs[s]??0),0),c=t("span",{className:"bar-fill red"});c.style.width=`${Math.min(100,Math.round((p+d)/Math.max(1,i.targetStock)*100))}%`;let m=(u,f,w,v=!1)=>t("button",{className:`step${v?" plus":""}`,attrs:{type:"button","aria-label":w},on:{click:()=>n.changeTarget(a,i.policyId,u)}},[f("icon")]);return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uBAA9\uD45C \uC7AC\uACE0"}),t("span",{className:"stepper"},[m(-1,g.minus,"\uBAA9\uD45C 1 \uC904\uC774\uAE30"),t("span",{className:"step-value",text:String(i.targetStock),attrs:{"aria-live":"polite"}}),m(1,g.plus,"\uBAA9\uD45C 1 \uB298\uB9AC\uAE30",!0)]),t("span",{className:"plan-progress"},[t("span",{className:"muted"},[`\uD604\uC7AC ${_(e,s)} `,t("strong",{text:String(p)}),d?` (+${d} \uC9C4\uD589 \uC911)`:""," / \uBAA9\uD45C ",t("strong",{text:String(i.targetStock)})]),t("span",{className:"bar"},[c])])])}function $n(e,r,a){let i=a?te(e,a.recipeId):null,n=i?Object.entries(i.inputs):[],o=r.state.production;return t("div",{className:"plan-block"},[t("span",{className:"plan-label",text:"\uC7AC\uB8CC \uC0AC\uC6A9 \uC124\uC815"}),n.length===0?t("p",{className:"muted",text:"\uC774 \uC81C\uC791\uBC95\uC740 \uC7AC\uB8CC \uC5C6\uC774 \uC232\uC5D0\uC11C \uBC14\uB85C \uBAA8\uC544\uC694."}):t("div",{className:"usage-list"},n.map(([s])=>{let l=r.state.inventory[s]??0,p=o.protectedStock[s]??0;return t("div",{className:"usage"},[t("span",{className:"usage-item"},[B(s),t("span",{text:_(e,s)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uC720"}),t("strong",{text:String(l)})]),t("span",{className:"usage-cell"},[t("small",{text:"\uBCF4\uD638"}),t("strong",{text:String(p)})]),t("span",{className:"usage-cell available"},[t("small",{text:"\uC0AC\uC6A9 \uAC00\uB2A5"}),t("strong",{text:String(Math.max(0,l-p))})])])}))])}function In(e,r,a,i,n){let o=a.find(l=>l.policyId===i)??a[0],s=t("select",{className:"input",attrs:{"aria-label":"\uC21C\uC11C\uC640 \uCF1C\uC9D0\uC744 \uBC14\uAFC0 \uC0DD\uC0B0 \uBB3C\uD488"},on:{change:()=>n.selectRule(r,s.value)}},a.map((l,p)=>t("option",{text:`${p+1}. ${te(e,l.recipeId)?.name??l.recipeId}${l.enabled?"":" (\uAEBC\uC9D0)"}`,attrs:{value:l.policyId}})));return s.value=o?.policyId??"",t("div",{className:"plan-block"},[t("span",{className:"plan-label"},["\uC791\uC5C5 \uC6B0\uC120\uC21C\uC704 ",t("small",{text:"(\uC704\uC758 \uC791\uC5C5\uBD80\uD130 \uCC28\uB840\uB300\uB85C \uC9C4\uD589\uD574\uC694)"})]),a.length?s:null,...a.filter(l=>l===o).map(l=>{let p=a.indexOf(l),d=te(e,l.recipeId),c=d?Object.keys(d.outputs)[0]:"";return t("div",{className:`priority-row${l.policyId===i?" selected":""}${l.enabled?"":" off"}`},[t("span",{className:"rank",text:String(p+1)}),t("button",{className:"priority-main",attrs:{type:"button","aria-pressed":l.policyId===i?"true":"false"},on:{click:()=>{n.selectRule(r,l.policyId),n.setWorkSection("recipe")}}},[B(c),t("span",{className:"priority-name",text:d?.name??l.recipeId}),t("small",{className:"muted",text:`\uBAA9\uD45C ${l.targetStock}`})]),t("button",{className:`chip-toggle${l.enabled?" on":""}`,text:l.enabled?"\uCF1C\uC9D0":"\uAEBC\uC9D0",attrs:{type:"button","aria-pressed":l.enabled?"true":"false","aria-label":`${d?.name??""} ${l.enabled?"\uB044\uAE30":"\uCF1C\uAE30"}`},on:{click:()=>n.toggleRule(r,l.policyId)}}),t("span",{className:"order-buttons"},[t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC704\uB85C"},disabled:p===0,on:{click:()=>n.moveRule(r,l.policyId,-1)}},[g.up("icon")]),t("button",{className:"mini",attrs:{type:"button","aria-label":"\uC544\uB798\uB85C"},disabled:p===a.length-1,on:{click:()=>n.moveRule(r,l.policyId,1)}},[g.down("icon")])])])}),t("p",{className:"muted",text:"\uC774 \uC2DC\uC124\uC758 \uC81C\uC791\uBC95\uC740 \uBAA8\uB450 \uB4F1\uB85D\uB418\uC5B4 \uC788\uC5B4\uC694. \uC0AC\uC6A9\uD560 \uC81C\uC791\uBC95\uC744 \uCF1C\uACE0 \uBAA9\uD45C \uC7AC\uACE0\uB97C \uC815\uD574 \uC8FC\uC138\uC694."})])}function Cn(e,r,a,i){if(!i.job)return t("div",{className:"plan-row"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),t("span",{className:"plan-progress wide"},[t("span",{className:"muted",text:"\uC26C\uB294 \uC911"}),t("span",{className:"bar"})])]);let n=te(r,i.job.recipeId),o=Object.keys(i.job.outputs)[0],s=Ne(e,a,i.job);return t("div",{className:"plan-row current-work"},[t("span",{className:"plan-label",text:"\uD604\uC7AC \uC791\uC5C5"}),B(o),t("span",{className:"plan-progress"},[t("span",{className:"muted",text:`${n?.name??"\uC791\uC5C5"} \xB7 \uC9C4\uD589 \uC911`}),s.bar]),s.countdown])}function Rn(e,r,a,i){let n=r.state.production.facilities[a]?.waiting;if(!n)return null;let o=[];if(n.reason==="no_rules")o.push(t("button",{className:"outline-button",text:"\uC0DD\uC0B0 \uC21C\uC11C \uC124\uC815\uD558\uAE30",attrs:{type:"button"},on:{click:()=>i.setWorkSection("priority")}}));else if(n.reason==="queue_empty")o.push(t("button",{className:"outline-button",text:"\uC791\uC5C5 \uCD94\uAC00\uD558\uAE30",attrs:{type:"button"},on:{click:()=>{i.setQueueView("add"),i.setWorkSection("recipe")}}}));else if(n.reason==="materials"&&n.itemId){let s=n.itemId,l=[...new Set(e.recipes.filter(p=>(p.outputs[s]??0)>0).map(p=>p.facilityId))].filter(p=>p!==a&&r.state.production.facilities[p]);for(let p of l){let d=e.facilities.find(m=>m.id===p);if(!d)continue;let c=r.state.production.facilities[p]?.unlocked;o.push(t("button",{className:"outline-button",text:`${_(e,s)} \uC5BB\uB294 \uACF3 \xB7 ${d.name}${c?"":" (\uC5F4\uAE30 \uD544\uC694)"}`,attrs:{type:"button"},on:{click:()=>i.selectFacility(p)}}))}}return t("div",{className:"waiting-guide"},[t("p",{className:"hint",text:yr(e,n)}),...o])}function An(e,r,a,i){let n=e.work.facilityId,o=a.state.production.facilities[n];if(!o)return[P("\uC2DC\uC124\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026")];if(!o.unlocked)return[fa(r,a,n,i),xn(e,r,a,n,i)];let s=at(e,a.state.production,n),l=s.find(f=>f.policyId===e.work.selected[n])??s[0],p=rr(e,a.state.production,n),d=!!e.busy[`rules:${n}`],c=o.mode==="auto",m=pe(r,a.state,n),u=t("div",{className:"recipe-choices",attrs:{role:"group","aria-label":"\uC0DD\uC0B0 \uBB3C\uD488 \uACE0\uB974\uAE30"}},s.map(f=>{let w=te(r,f.recipeId),v=w?Object.keys(w.outputs)[0]:void 0;return t("button",{className:"recipe-choice",attrs:{type:"button","aria-pressed":String(f.policyId===l?.policyId),"aria-label":`${w?.name??f.recipeId} \uC0DD\uC0B0 \uC124\uC815${f.enabled?"":" (\uAEBC\uC9D0)"}`},on:{click:()=>i.selectRule(n,f.policyId)}},[v?B(v):g.jar("icon"),t("span",{text:w?.name??f.recipeId}),f.enabled?null:t("small",{text:"\uAEBC\uC9D0"})])}));return[fa(r,a,n,i),M(null,[vn(e,n,o,i),t("section",{className:"production-summary",attrs:{"aria-label":"\uD604\uC7AC \uC0DD\uC0B0 \uC0C1\uD0DC"}},[Cn(e,r,a,o),Rn(r,a,n,i),t("div",{className:"production-order"},[t("span",{className:"muted",text:c?"\uC801\uC6A9\uB41C \uC6B0\uC120\uC21C\uC704":"\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4"}),t("ol",{className:"production-slots"},(c?o.rules.filter(f=>f.enabled).sort((f,w)=>f.priority-w.priority):o.queue).map(f=>{let w=te(r,f.recipeId),v=w?Object.keys(w.outputs)[0]:void 0;return t("li",{},[v?B(v):null,t("span",{text:w?.name??"\uC81C\uC791\uBC95 \uD655\uC778 \uD544\uC694"})])})),t("small",{className:"muted",text:c?"\uBAA9\uD45C \uC7AC\uACE0\uC640 \uC7AC\uB8CC\uC5D0 \uB530\uB77C \uC791\uC5C5\uD574\uC694.":"\uB4F1\uB85D\uD55C \uC21C\uC11C\uB85C \uC791\uC5C5\uD574\uC694."})])]),kn(e,r,a,n,o,i),...c?[t("h2",{className:"section-title",text:"\uC0DD\uC0B0 \uC124\uC815"}),u,Nn(r,l,o.level,m),l?Sn(r,a,n,l,i):null,$n(r,a,l),t("h2",{className:"section-title",text:"\uC791\uC5C5 \uC6B0\uC120\uC21C\uC704"}),In(r,n,s,l?.policyId,i)]:[ga(e,r,a,n,i)],c&&o.queue.length?t("p",{className:"hint",text:`\uC9C0\uC815 \uD69F\uC218 \uB300\uAE30\uC5F4 ${o.queue.length}\uAC1C\uB294 \uBA48\uCD98 \uCC44 \uADF8\uB300\uB85C \uB0A8\uC544 \uC788\uC5B4\uC694.`}):null,c&&p?t("div",{className:"draft-note"},[t("span",{text:"\uBCC0\uACBD\uD55C \uC124\uC815\uC740 \uC801\uC6A9 \uD6C4 \uC0AC\uC6A9\uB3FC\uC694."}),t("button",{className:"link-button",text:"\uB418\uB3CC\uB9AC\uAE30",attrs:{type:"button"},on:{click:()=>i.discardDraft(n)}})]):null,c?t("div",{className:"rule-actions"},[t("button",{className:"button wide-main",attrs:{type:"button"},disabled:!p||d,on:{click:()=>{i.applyRules(n)}}},[g.check("icon"),t("span",{text:d?"\uC801\uC6A9\uD558\uB294 \uC911\u2026":p?"\uC6B4\uC601 \uADDC\uCE59 \uC801\uC6A9":"\uC801\uC6A9\uB428"})]),t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>i.recommendRules(n)}},[g.gear("icon"),t("span",{text:"\uCD94\uCC9C \uC124\uC815"})])]):null],{className:"work-card"}),t("div",{className:"work-stock-actions",attrs:{role:"group","aria-label":"\uC7AC\uACE0 \uAD00\uB9AC"}},[t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>{i.setFacilitiesTab("protection"),i.navigate("facilities")}}},[g.lock("icon"),"\uC7AC\uACE0 \uBCF4\uD638"]),t("button",{className:"button secondary",attrs:{type:"button"},on:{click:()=>{i.setFacilitiesTab("storage"),i.navigate("facilities")}}},[g.box("icon"),"\uCC3D\uACE0 \xB7 \uD310\uB9E4"])])]}function ha(e,r){let a=e.world?.state==="ready"?e.world.value:null,i=a&&e.content&&e.sheet?.kind==="assign"?ua(e,a,e.content,r,e.sheet.facilityId):null;return T(e,r,{top:{kind:"sub",title:"\uACF5\uBC29 \uC791\uC5C5",back:{route:"home",label:"\uD648"},resources:!0},backdrop:"forest",body:a&&e.content?An(e,e.content,a,r):[P("\uC138\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\u2026")],nav:!0,sheet:i})}var ba={world:40,nickname:24};function Mn(e){let r=new Date(e);return Number.isNaN(r.getTime())?e:new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(r)}function Pn(e,r){let a=M("\uB0B4 \uC138\uACC4",[],{id:"fw-worlds"}),{worlds:i}=e;if(i.state==="loading")a.append(P("\uBD88\uB7EC\uC624\uB294 \uC911\u2026"));else if(i.state==="error")a.append(ee(i.message),y("\uB2E4\uC2DC \uC2DC\uB3C4",()=>{r.loadWorlds()},{variant:"secondary"}));else if(i.value.length===0)a.append(t("p",{className:"empty",text:"\uC544\uC9C1 \uC138\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC0C8\uB85C \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694."}));else{let n=Math.ceil(i.value.length/2),o=Math.min(e.worldsPage??0,n-1);a.append(t("ul",{className:"menu-list"},i.value.slice(o*2,o*2+2).map(s=>t("li",{},[t("button",{className:"menu-row",attrs:{type:"button"},disabled:!s.readable,on:{click:()=>{r.openWorld(s.worldId)}}},[t("span",{className:"menu-icon"},[g.house()]),t("span",{className:"menu-text"},[t("span",{className:"menu-title",text:s.worldName}),t("span",{className:"menu-detail",text:s.readable?`\uB9C8\uC9C0\uB9C9 \uC800\uC7A5 ${Mn(s.updatedAt)}`:"\uC774 \uBC84\uC804\uC5D0\uC11C \uC77D\uC744 \uC218 \uC5C6\uB294 \uC138\uACC4"})]),t("span",{className:"menu-chevron"},[g.chevron()])])])))),n>1&&a.append(t("div",{className:"resident-pages"},[y("\uC774\uC804",()=>r.setWorldsPage(o-1),{variant:"secondary",disabled:o===0}),t("span",{text:`${o+1} / ${n}`,attrs:{"aria-live":"polite"}}),y("\uB2E4\uC74C",()=>r.setWorldsPage(o+1),{variant:"secondary",disabled:o+1>=n})]))}return a}function wa(e,r){let a=!!e.busy["create-world"],i=t("input",{className:"input",attrs:{id:"fw-world-name",name:"worldName",maxlength:String(ba.world),autocomplete:"off",required:"",value:e.worldDraft?.worldName??""},on:{input:()=>r.rememberWorldDraft({worldName:i.value,nickname:n.value})}}),n=t("input",{className:"input",attrs:{id:"fw-nickname",name:"playerNickname",maxlength:String(ba.nickname),autocomplete:"off",required:"",value:e.worldDraft?.nickname??""},on:{input:()=>r.rememberWorldDraft({worldName:i.value,nickname:n.value})}});return t("form",{className:"card form",attrs:{"aria-labelledby":"fw-create"},on:{submit:s=>{s.preventDefault(),!(!i.value.trim()||!n.value.trim())&&r.createWorld(i.value,n.value)}}},[t("h2",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30",attrs:{id:"fw-create"}}),t("p",{className:"muted",text:"\uD50C\uB808\uC774\uC5B4\uB294 \uC678\uD615 \uC5C6\uC774 \uB2C9\uB124\uC784\uC73C\uB85C\uB9CC \uB4F1\uC7A5\uD569\uB2C8\uB2E4. \uB458 \uB2E4 \uB098\uC911\uC5D0 \uC124\uC815\uC5D0\uC11C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4."}),t("label",{className:"field-label",text:"\uC138\uACC4 \uC774\uB984",attrs:{for:"fw-world-name"}}),i,t("label",{className:"field-label",text:"\uB0B4 \uB2C9\uB124\uC784",attrs:{for:"fw-nickname"}}),n,t("button",{className:"button",text:a?"\uB9CC\uB4DC\uB294 \uC911\u2026":"\uB9CC\uB4E4\uAE30",attrs:{type:"submit"},disabled:a})])}function ya(e,r){let a=e.world?.state==="ready",i=e.worlds.state==="ready"&&e.worlds.value.length===0,n=i?null:t("details",{className:"card restore-details",attrs:{open:e.worldCreateOpen?"":void 0},on:{toggle:()=>r.rememberWorldCreateOpen(!!n?.open)}},[t("summary",{className:"section-title",text:"\uC0C8 \uC138\uACC4 \uB9CC\uB4E4\uAE30"}),wa(e,r)]),o=i?wa(e,r):n,s=t("details",{className:"card restore-details",attrs:{open:e.restore?"":void 0}},[t("summary",{className:"section-title",text:"\uBC31\uC5C5\uC5D0\uC11C \uBCF5\uC6D0"}),Qe(e,r,"fw-worlds-restore")]);return T(e,r,{top:a?{kind:"sub",title:"\uC138\uACC4 \uACE0\uB974\uAE30",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1}:{kind:"sub",title:"\uC232\uACB0 \uACF5\uBC29",resources:!1},backdrop:"wood",body:[i?null:Pn(e,r),o,s],nav:!1})}var va=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 48'%3E%3Cpath d='M0 0h120v26c-8 0-10 12-20 12S88 22 78 22 66 36 56 36 44 20 34 20 22 34 12 34 4 26 0 26z' fill='%2394bf74' stroke='%235f8f45' stroke-width='3'/%3E%3C/svg%3E")`,xa=`
.ground-preview { position: relative; height: 110px; background: #dcebc4; border: 2px solid var(--ink); border-radius: 12px; }
.ground-area { position: absolute; border: 2px dashed var(--fw-accent); background: #8fbf6e; }
.ground-editor { display: grid; gap: 0.5em; }
.ground-row { display: grid; grid-template-columns: 3em minmax(0,1fr) 2em; gap: 0.5em; align-items: center; min-height: 44px; }
.ground-row input { width: 100%; min-height: 44px; }

:host {
  --fs: var(--fw-font-size, 16px);
  --ink: #4b2e1a;
  --line: 3px;
  --line-in: 2.5px;
  --drop: 0 0.22em 0 var(--ink);
  --fw-page: #f1e4c3;
  --fw-surface: #fbf1da;
  --fw-surface-2: #f2e2bd;
  --fw-surface-3: #fff8e8;
  --fw-text: #3f2717;
  --fw-muted: #7a5a3d;
  --fw-accent: #2e7f72;
  --fw-on-accent: #fffaf0;
  --fw-wood: #c58a52;
  --fw-wood-dark: #8a5a33;
  --fw-leaf: #5a9a44;
  --fw-leaf-soft: #dcebc4;
  --fw-gold: #f3c34a;
  --fw-pass: #3f8a3d;
  --fw-fail: #c0433a;
  --fw-blue: #3a6fc0;
  --fw-unavailable: #8a6a12;
  --fw-track: #e4d6b6;
  --fw-panel-block: clamp(24px, 6cqw, 32px);
  --fw-panel-inline: clamp(24px, 5.5cqw, 28px);
  --fw-inset: clamp(14px, 4cqw, 18px);
  display: block;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  color: var(--fw-text);
  color-scheme: light;
  font: 400 var(--fs)/1.6 "Jua", system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  font-synthesis: none;
  -webkit-text-size-adjust: 100%;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
:host(:fullscreen) { width: 100vw; height: 100dvh; max-width: none; max-height: none; padding: env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left); background: var(--fw-page); }
* { box-sizing: border-box; }
p { margin: 0; }
.icon { width: 1.35em; height: 1.35em; flex: none; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.icon .fill { fill: currentColor; stroke: none; }
.icon.tiny { width: 0.95em; height: 0.95em; }
.icon.big { width: 2.2em; height: 2.2em; }
.icon.huge { width: 4.5em; height: 4.5em; stroke-width: 2; }
.muted-icon { color: var(--fw-muted); }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* \u2500\u2500 Frame \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.shell { position: relative; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
.column { width: 100%; max-width: 520px; margin: 0 auto; min-height: 100%; display: flex; flex-direction: column; }
.backdrop-forest { background: var(--fw-page); }
.backdrop-forest .scroll {
  background-color: var(--fw-page);
  background-image: ${va}, linear-gradient(#94bf74, #94bf74);
  background-repeat: repeat-x, no-repeat;
  background-size: 7.5em 3em, 100% 5.2em;
  background-position: 0 5.1em, 0 0;
}
.backdrop-wood { background: #a8703f; }
.backdrop-wood .scroll {
  background-color: #a8703f;
  background-image: ${va}, linear-gradient(#94bf74, #94bf74),
    repeating-linear-gradient(90deg, #b07a46 0 2.4em, var(--ink) 2.4em calc(2.4em + 3px), #a8703f calc(2.4em + 3px) 4.8em, var(--ink) 4.8em calc(4.8em + 3px));
  background-repeat: repeat-x, no-repeat, repeat;
  background-size: 7.5em 3em, 100% 5.2em, auto;
  background-position: 0 5.1em, 0 0, 0 0;
}
.backdrop-wood .page { padding-left: 0.75em; padding-right: 0.75em; }
.page {
  flex: 1 0 auto;
  display: grid;
  gap: 0.85em;
  align-content: start;
  padding: 0.6em 0.9em 1.25em;
}
.page > * { min-width: 0; }
.muted { color: var(--fw-muted); font-size: calc(var(--fs) * 0.875); }
.empty { color: var(--fw-muted); }
.error { color: var(--fw-fail); font-weight: 800; overflow-wrap: anywhere; }
.hint { display: flex; align-items: center; gap: 0.4em; color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.hint.center { justify-content: center; text-align: center; }

/* Toast: the answer to a tap (locked feature, saved, errors), just above the bottom bar. */
.notice {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: calc(1em + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  width: min(calc(100% - 1.5em), 480px);
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.6em 0.6em 0.6em 1em;
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  box-shadow: var(--drop);
}
.has-nav .notice { bottom: calc(5.8em + env(safe-area-inset-bottom, 0px)); }
/* While a toast shows, the page can scroll its last controls above it. */
.has-notice .page { padding-bottom: 6em; }
.notice p { flex: 1; min-width: 0; overflow-wrap: anywhere; font-weight: 700; }
.notice.error { color: var(--fw-fail); background: #fde9e2; }
.notice-close { flex: none; min-height: 2.75em; padding: 0 0.6em; border: 0; background: none; color: inherit; font: inherit; font-weight: 800; text-decoration: underline; text-decoration-thickness: 2px; cursor: pointer; }

/* \u2500\u2500 Top bar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.top { display: grid; gap: 0.45em; padding: 0.75em 0.75em 0.4em; }
.top-row { display: flex; align-items: center; gap: 0.45em; min-width: 0; }
.top-row.second { justify-content: space-between; }
.sign {
  position: relative;
  margin: 0;
  min-width: 0;
  padding: 0.28em 1em;
  border-radius: 0.6em;
  border: var(--line) solid var(--ink);
  background: var(--fw-wood);
  color: var(--ink);
  font-size: calc(var(--fs) * 1.4);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: var(--drop), inset 0 -0.3em 0 #b07a46;
}
.sign::before, .sign::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0.38em;
  height: 0.38em;
  margin-top: -0.19em;
  border-radius: 50%;
  background: var(--ink);
}
.sign::before { left: 0.38em; }
.sign::after { right: 0.38em; }
.sign-home { flex: 0 1 auto; font-size: calc(var(--fs) * 1.6); padding: 0.22em 0.95em; }
.top-sub .sign { flex: 1 1 auto; }
.top-sub.with-resources .sign { flex: 0 1 auto; font-size: calc(var(--fs) * 1.05); padding: 0.32em 0.95em; }
.top-sub:not(.with-resources) .sign { margin-right: 3.2em; }
.back-button, .back-spacer { flex: none; width: 2.75em; height: 2.75em; }
.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--ink);
  box-shadow: var(--drop);
  cursor: pointer;
}
.back-button .icon { stroke-width: 3; }
.resources { display: flex; align-items: center; gap: 0.3em; margin-left: auto; min-width: 0; }
.counter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  min-width: 0;
  min-height: 2.2em;
  padding: 0 0.65em 0 0.15em;
  border-radius: 999px;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.counter-value { font-size: calc(var(--fs) * 0.9); white-space: nowrap; }
button.counter { cursor: pointer; }
.coin {
  flex: none;
  display: inline-block;
  width: 1.65em;
  height: 1.65em;
  border-radius: 50%;
  background: var(--fw-gold);
  border: var(--line-in) solid var(--ink);
  box-shadow: inset 0 0 0 0.22em var(--fw-gold), inset 0 0 0 0.36em #d9a22c;
}
.ticket-mark { display: inline-flex; color: var(--fw-leaf); padding-left: 0.2em; }
.icon-button {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6em;
  height: 2.6em;
  border-radius: 0.75em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--ink);
  box-shadow: var(--drop);
  cursor: pointer;
}
.icon-button.gear { border: 0; background: none; box-shadow: none; }
.icon-button.gear .icon { width: 1.9em; height: 1.9em; stroke-width: 2.6; }
.chip-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  min-height: 2.4em;
  padding: 0.2em 0.9em;
  border-radius: 0.8em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  box-shadow: var(--drop);
  cursor: pointer;
}

/* \u2500\u2500 Cards \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.card {
  position: relative;
  display: grid;
  gap: 0.75em;
  align-content: start;
  padding: var(--fw-panel-block) var(--fw-panel-inline);
  border-radius: 1.1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface);
  box-shadow: var(--drop);
}
.card > * { min-width: 0; }
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
}
/* A flat leaf with the same ink outline as everything else. */
.section-title::before {
  content: "";
  flex: none;
  width: 0.9em;
  height: 0.9em;
  border-radius: 0 75% 0 75%;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-leaf);
}
.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75em; }
.card-head > div { display: grid; gap: 0.2em; min-width: 0; }

/* \u2500\u2500 Buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.button {
  position: relative;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  min-height: 2.8em;
  padding: 0.45em 1.2em;
  border-radius: 0.85em;
  border: var(--line) solid var(--ink);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  font: inherit;
  font-weight: 900;
  box-shadow: var(--drop);
  cursor: pointer;
}
.button:active:not(:disabled) { transform: translateY(0.15em); box-shadow: 0 0.07em 0 var(--ink); }
.button[data-wide] { justify-self: stretch; width: 100%; font-size: calc(var(--fs) * 1.1); }
.button.small { min-height: 2.5em; padding: 0.3em 0.9em; font-size: calc(var(--fs) * 0.95); }
.button.secondary { background: var(--fw-surface-3); color: var(--fw-text); }
.button.big-action { min-height: 3.2em; border-radius: 1em; font-size: calc(var(--fs) * 1.2); }
.button:disabled { opacity: 0.55; cursor: not-allowed; }
.outline-button {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  min-height: 2.75em;
  padding: 0.3em 0.9em;
  border-radius: 0.85em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  box-shadow: var(--drop);
  cursor: pointer;
}

/* \u2500\u2500 Locked (\uC900\uBE44 \uC911) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.lock-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  padding: 0.05em 0.45em;
  border-radius: 999px;
  border: 2px solid var(--fw-surface-3);
  background: var(--ink);
  color: #fff4dc;
  font-size: calc(var(--fs) * 0.68);
  font-weight: 900;
  line-height: 1.45;
  white-space: nowrap;
}
.is-locked { position: relative; cursor: pointer; }
.is-locked > .lock-tag { position: absolute; top: -0.55em; right: -0.35em; z-index: 1; }
.is-locked > :not(.lock-tag) { opacity: 0.6; }
.is-locked.button { background: #8fb3ab; }
.locked-block { position: relative; display: grid; gap: 0.75em; border-radius: 0.8em; cursor: pointer; }
/* A block that opens its card puts the tag on the card's top edge, clear of the block's title. */
.card > .locked-block:first-child > .locked-veil { top: -1.8em; }
.locked-block > :not(.locked-veil) { opacity: 0.55; }
/* Sits on the block's top edge so it never covers the block's own title. */
.locked-veil {
  position: absolute;
  top: -0.8em;
  right: 0.3em;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.12em 0.65em 0.12em 0.2em;
  border-radius: 999px;
  background: var(--fw-surface-3);
  border: var(--line-in) solid var(--ink);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.8);
  font-weight: 900;
}

/* \u2500\u2500 Bottom bar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tabbar {
  position: relative;
  z-index: 3;
  flex: none;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 0.4em 0.4em calc(0.4em + env(safe-area-inset-bottom, 0px));
  border-radius: 1.3em 1.3em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
}
.tab {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 3.6em;
  padding: 0.25em 0.1em;
  border: 0;
  border-radius: 0.8em;
  background: none;
  color: var(--fw-text);
  font: inherit;
  cursor: pointer;
}
.tab + .tab::before { content: ""; position: absolute; left: -1px; top: 18%; bottom: 18%; border-left: var(--line-in) solid #d8bf93; }
.tab-icon { position: relative; display: inline-flex; color: var(--ink); }
.tab-glyph { width: 1.95em; height: 1.95em; stroke-width: 2.4; }
.tab-art { display: block; width: 2.3em; height: 2.3em; object-fit: contain; }
.tab-icon .lock-tag { position: absolute; top: -0.3em; right: -1.2em; }
.tab-label { font-size: calc(var(--fs) * 0.85); font-weight: 900; }
.tab.current .tab-label { padding: 0 0.9em; border-radius: 0.55em; border: var(--line-in) solid var(--ink); background: #5f9a4a; color: #fff; }
.tab.current .tab-icon { color: var(--fw-accent); }
.tab.is-locked .tab-glyph { opacity: 0.5; }

/* Home fits the available host viewport; detail sheets keep the full existing content. */
.home-layout .scroll { overflow: hidden; }
.home-layout .column { height: 100%; min-height: 0; position: relative; }
.home-layout .top-home { position: absolute; inset: 0 0 auto; z-index: 3; }
.home-layout .scene { flex: 1 1 auto; min-height: 0; aspect-ratio: auto; margin: 0; }
.home-layout .scene-stage { bottom: 0.65em; }
.home-layout .scene-caption { bottom: 0.2em; }
.home-layout .page { flex: none; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.4em; padding: 0.4em 0.6em 0.55em; }
.home-summary, .home-layout .strip.story, .home-layout .strip.offline {
  min-width: 0; min-height: 3.2em; padding: 0.4em 0.6em; border: var(--line-in) solid var(--ink);
  border-radius: 0.8em; background: var(--fw-surface); color: var(--fw-text); font: inherit; cursor: pointer;
}
.home-summary { display: flex; align-items: center; justify-content: space-between; gap: 0.3em; text-align: left; }
.home-summary-copy { display: grid; min-width: 0; line-height: 1.25; }
.home-summary-copy strong, .home-layout .story-text strong { font-size: calc(var(--fs) * 0.86); }
.home-summary-copy span, .home-layout .story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.home-layout .strip.story { justify-content: space-between; text-align: left; gap: 0.25em; }
.home-layout .story-art { display: none; }
.home-layout .round-arrow { width: 1.5em; height: 1.5em; border: 0; background: none; color: var(--ink); }
.home-layout .strip.offline { grid-column: 1 / -1; min-height: 2.75em; font-size: calc(var(--fs) * 0.8); }
@media (max-height: 480px) { .home-layout .scroll { overflow-y: auto; } .home-layout .column { height: auto; min-height: 100%; } .home-layout .scene { flex: none; min-height: 12em; } }

.page-picker { width: 100%; }
.page-picker-summary { display: flex; align-items: center; justify-content: space-between; gap: 0.6em; min-height: 44px; padding: 0.3em 0.8em; border: var(--line-in) solid var(--ink); border-radius: 0.7em; background: var(--fw-surface-3); font-weight: 800; cursor: pointer; list-style: none; }
.page-picker-summary::-webkit-details-marker { display: none; }
.page-picker-summary > span:first-child { overflow-wrap: anywhere; }
.page-picker-options { display: grid; gap: 0.3em; max-height: 14em; overflow-y: auto; margin-top: 0.3em; padding: 0.4em; border: var(--line-in) solid var(--ink); border-radius: 0.7em; background: var(--fw-surface-3); }
.page-picker-option { min-height: 44px; padding: 0.5em 0.7em; border: 2px solid transparent; border-radius: 0.5em; background: transparent; color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.page-picker-option[aria-pressed="true"] { border-color: var(--fw-accent); background: var(--fw-leaf-soft); font-weight: 800; }
.page-picker-arrow { flex: none; }
button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid #315eac; outline-offset: 2px; }
/* \u2500\u2500 \uD648 (01-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.top-home { padding-bottom: 0; }
.chip-button.weather { color: var(--fw-text); }
.scene { position: relative; margin: 0 0 -1.6em; min-height: 17em; aspect-ratio: 390 / 300; }
.scene-art { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.scene-stage { position: absolute; left: 0; right: 0; bottom: 2.6em; display: flex; justify-content: space-around; padding: 0 1em; }
.resident-spot {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: end;
  width: 6.5em;
  height: 8.5em;
  border: var(--line) dashed var(--ink);
  border-radius: 3em 3em 1em 1em;
  background: rgba(255, 248, 232, 0.55);
  color: var(--ink);
  font: inherit;
  cursor: pointer;
}
.spot-shadow { width: 4.5em; height: 0.8em; margin-bottom: 0.35em; border-radius: 50%; background: rgba(75, 46, 26, 0.25); }
.spot-text { margin-bottom: 0.5em; font-weight: 900; font-size: calc(var(--fs) * 0.85); }
.scene-caption {
  position: absolute;
  left: 50%;
  bottom: 2em;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.1em 0.8em;
  border-radius: 999px;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.78);
  font-weight: 800;
  white-space: nowrap;
}
.report-card { z-index: 1; }
.report-title { margin: 0; text-align: center; font-size: calc(var(--fs) * 1.45); font-weight: 900; }
.report-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.6em; align-items: center; }
.report-items { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding-right: 0.6em; border-right: var(--line-in) solid #d8bf93; }
.report-slot { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em 0.2em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); }
.slot-art { width: 2.6em; height: 2.6em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.slot-name { font-size: calc(var(--fs) * 0.85); font-weight: 800; }
.report-slot strong { font-size: calc(var(--fs) * 1.2); }
.report-actions { display: grid; justify-items: center; gap: 0.4em; }
.report-button { justify-self: stretch; white-space: nowrap; padding-left: 0.6em; padding-right: 0.6em; font-size: calc(var(--fs) * 1.15); }
.report-caption { display: inline-flex; align-items: center; gap: 0.25em; color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.strip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  width: 100%;
  min-height: 2.9em;
  padding: 0.5em 1em;
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 800;
  text-align: left;
  box-shadow: var(--drop);
  cursor: pointer;
}
.strip.story { justify-content: flex-start; gap: 0.8em; padding: 0.6em; min-height: 5em; }
.story-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 6em; height: 3.8em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #e9c995; color: var(--ink); }
.story-text { flex: 1; display: grid; min-width: 0; }
.story-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.story-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.round-arrow { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.6em; height: 2.6em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-wood-dark); color: #fff4dc; }
.round-arrow .icon { stroke-width: 3; }

/* \u2500\u2500 \uACF5\uBC29 \uC791\uC5C5 (01-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.field-tabs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.95em; padding: 0 0.15em; }
.field-tab {
  display: grid;
  justify-items: center;
  gap: 0.1em;
  min-width: 0;
  min-height: 4.5em;
  padding: 0.45em 0.1em 1em;
  border-radius: 0.9em 0.9em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}
.field-glyph { width: 1.8em; height: 1.8em; color: var(--fw-leaf); }
.work-card { gap: 0.85em; }
.segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 0.22em; border-radius: 999px; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.segment { display: flex; align-items: center; justify-content: center; min-height: 2.6em; border-radius: 999px; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.segment.selected { border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.facility-entry { display: flex; align-items: center; gap: 0.5em; padding: 0.5em; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.facility-entry .outline-button { padding: 0.3em 0.6em; }
.facility-open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 0.7em; padding: 0.2em; border: 0; border-radius: 0.7em; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.facility-art, .recipe-art { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 3.4em; height: 3.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--ink); }
.facility-text, .recipe-text { display: grid; min-width: 0; }
.facility-text strong, .recipe-text strong { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.facility-text span, .recipe-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.recipe { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.recipe-art { width: 5.5em; height: 5em; }
.plan-row, .plan-block { display: grid; gap: 0.5em; padding: 0.6em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); }
.plan-row { grid-template-columns: auto auto minmax(0, 1fr); align-items: center; }
.plan-label { font-weight: 900; }
.plan-label small { color: var(--fw-muted); font-weight: 600; font-size: calc(var(--fs) * 0.75); }
.stepper { display: inline-flex; align-items: center; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); overflow: hidden; }
.step { display: inline-flex; align-items: center; justify-content: center; width: 2.2em; height: 2.2em; }
.step.plus { background: var(--fw-accent); color: var(--fw-on-accent); border-left: var(--line-in) solid var(--ink); }
.step-value { min-width: 2.2em; text-align: center; font-weight: 900; }
.plan-progress { display: grid; gap: 0.25em; min-width: 0; font-size: calc(var(--fs) * 0.85); }
.plan-progress.wide { grid-column: 2 / -1; }
.bar { display: block; height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); }
.usage { display: grid; grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 1fr)); align-items: center; padding: 0.4em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.usage-item { font-weight: 900; padding-left: 0.4em; }
.usage-cell { display: grid; justify-items: center; border-left: var(--line-in) solid #d8bf93; }
.usage-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.priority-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.rank { display: inline-flex; align-items: center; justify-content: center; width: 1.8em; height: 1.8em; border-radius: 0.45em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 900; }
.priority-name { flex: 1; font-weight: 900; }
.rule-actions { display: grid; grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr); gap: 0.6em; }
.rule-actions .button { justify-self: stretch; min-height: 3.1em; }
.button.wide-main { font-size: calc(var(--fs) * 1.15); }

/* \u2500\u2500 \uC2DC\uC124\uACFC \uCC3D\uACE0 (01-3) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.big-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.3em; margin-bottom: -0.95em; }
.big-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  min-height: 3.7em;
  padding-bottom: 0.7em;
  border-radius: 1.1em 1.1em 0 0;
  border: var(--line) solid var(--ink);
  border-bottom: 0;
  background: var(--fw-surface);
  color: var(--fw-text);
  font: inherit;
  font-size: calc(var(--fs) * 1.25);
  font-weight: 900;
  cursor: pointer;
}
.big-tab.current { background: var(--fw-accent); color: var(--fw-on-accent); }
.facility { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 0.8em; align-items: start; }
.facility-picture { display: flex; align-items: center; justify-content: center; aspect-ratio: 1; border-radius: 1em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--ink); }
.facility-info { display: grid; gap: 0.45em; min-width: 0; }
.facility-name { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.facility-level { font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.level-next { color: var(--fw-accent); }
.effect-row { display: grid; grid-template-columns: 1fr 1fr; padding: 0.35em 0.6em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 800; }
.gold-button { display: flex; align-items: center; justify-content: center; gap: 0.4em; min-height: 3em; border-radius: 1em; border: var(--line) solid var(--ink); background: var(--fw-gold); box-shadow: var(--drop); font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.stock { width: 100%; border-collapse: separate; border-spacing: 0 0.35em; table-layout: fixed; }
.stock th, .stock td { padding: 0.5em 0.25em; text-align: center; overflow-wrap: anywhere; }
.stock thead th { padding: 0.4em 0.2em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 800; border-top: var(--line-in) solid var(--ink); border-bottom: var(--line-in) solid var(--ink); }
.stock thead th:first-child { border-left: var(--line-in) solid var(--ink); border-radius: 0.6em 0 0 0.6em; width: 28%; }
.stock thead th:last-child { border-right: var(--line-in) solid var(--ink); border-radius: 0 0.6em 0.6em 0; }
.stock tbody th, .stock tbody td { background: var(--fw-surface-3); border-top: var(--line-in) solid var(--ink); border-bottom: var(--line-in) solid var(--ink); }
.stock tbody th { display: table-cell; text-align: left; font-weight: 900; border-left: var(--line-in) solid var(--ink); border-radius: 0.7em 0 0 0.7em; }
.stock tbody td:last-child { border-right: var(--line-in) solid var(--ink); border-radius: 0 0.7em 0.7em 0; }
.num { font-variant-numeric: tabular-nums; font-weight: 900; font-size: calc(var(--fs) * 1.05); }
.num.protected { color: var(--fw-fail); }
.num.reserved { color: var(--fw-blue); }
.num.available { color: var(--fw-pass); }
.item-dot { display: inline-block; width: 1.1em; height: 1.1em; margin-right: 0.35em; vertical-align: -0.15em; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-wood); }
.item-dot.big { width: 2.2em; height: 2.2em; margin: 0; border-width: var(--line-in); }
.storage-grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35em; }
.storage-item { display: flex; align-items: center; gap: 0.5em; min-height: 3em; padding: 0.3em 0.5em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: left; }
.storage-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.storage-item strong { font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.toggle-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7em;
  width: 100%;
  min-height: 3.6em;
  padding: 0.55em 0.75em;
  border-radius: 0.9em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.toggle-icon { flex: none; display: inline-flex; color: var(--fw-leaf); }
.toggle-text { flex: 1; display: grid; min-width: 0; }
.toggle-text strong { font-size: calc(var(--fs) * 1.05); font-weight: 900; }
.toggle-text span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.82); }
.switch { flex: none; position: relative; display: inline-flex; align-items: center; justify-content: flex-end; width: 3.5em; height: 2em; padding: 0 0.5em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #9b8f80; }
.switch.on { background: var(--fw-leaf); justify-content: flex-start; }
.switch .knob { position: absolute; top: 0.12em; left: 0.12em; width: 1.45em; height: 1.45em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: #fff; }
.switch.on .knob { left: auto; right: 0.12em; }
.switch:has(.switch-label) { width: 4.9em; }
.switch-label { color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 900; }

/* \u2500\u2500 \uC124\uC815 (04-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
/* Flex with wrap: at large text sizes or on narrow phones the field drops to its own line instead of shrinking. */
.setting-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.55em 0.65em;
  border-radius: 0.9em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
}
.row-leaf { color: var(--fw-leaf); }
.setting-label { font-weight: 900; white-space: nowrap; }
.input {
  width: 100%;
  min-width: 0;
  min-height: 2.6em;
  padding: 0.35em 0.7em;
  border: var(--line-in) solid var(--ink);
  border-radius: 0.7em;
  background: #fffdf6;
  color: var(--fw-text);
  font: inherit;
}
.input.readonly { display: inline-flex; align-items: center; gap: 0.4em; color: var(--fw-muted); overflow: hidden; white-space: nowrap; }
.setting-block { display: grid; gap: 0.5em; padding: 0.55em 0.65em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.setting-block .setting-row { padding: 0; border: 0; background: none; }
/* The field and its button wrap together. */
.setting-field { flex: 1 1 12em; min-width: 0; display: flex; align-items: center; gap: 0.5em; }
.setting-field > .input { flex: 1 1 auto; }
.setting-field > .button { flex: none; white-space: nowrap; }
.setting-row > .slider { flex: 1 1 6em; width: auto; }
.setting-row > .button, .setting-row > .icon, .setting-label, .slider-value { flex: none; }
/* Range: a flat track with an ink outline and a round ink-outlined thumb. */
.slider { -webkit-appearance: none; appearance: none; width: 100%; min-width: 0; height: 2.6em; background: none; cursor: pointer; }
.slider::-webkit-slider-runnable-track { height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-leaf); }
.slider::-moz-range-track { height: 0.85em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); }
.slider::-moz-range-progress { height: 0.85em; border-radius: 999px; background: var(--fw-leaf); }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 1.5em; height: 1.5em; margin-top: -0.5em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.slider::-moz-range-thumb { width: 1.2em; height: 1.2em; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-surface-3); }
.slider-value { min-width: 3em; text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.font-preview { margin: 0 0.5em; padding: 0.6em; border-radius: 0.7em; border: var(--line-in) dashed var(--ink); background: var(--fw-surface-2); text-align: center; font-size: var(--fs); }
.manage-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75em;
  width: 100%;
  min-height: 3.1em;
  padding: 0.4em 0.75em;
  border: var(--line-in) solid var(--ink);
  border-radius: 0.85em;
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.manage-icon { flex: none; display: inline-flex; color: var(--fw-wood-dark); }
.manage-title { flex: 1; font-weight: 900; }
.menu-chevron { flex: none; display: inline-flex; color: var(--ink); }
.menu-chevron .icon { stroke-width: 3; }
.note-box { display: flex; align-items: center; gap: 0.75em; padding: 0.65em 0.9em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); color: #33502a; }
.note-box .icon { width: 1.8em; height: 1.8em; }
.note-box > span { display: grid; }
.note-box strong { font-weight: 900; }
.note-box span span { font-size: calc(var(--fs) * 0.85); }
.footnote { justify-self: center; max-width: 100%; padding: 0.3em 1.1em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface); color: var(--fw-text); font-size: calc(var(--fs) * 0.85); font-weight: 700; text-align: center; }

/* \u2500\u2500 \uC800\uC7A5\xB7\uBC31\uC5C5 (05-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.card.saved { justify-items: center; gap: 0.3em; padding: 1.2em 1em; }
.saved-title { display: flex; align-items: center; gap: 0.5em; font-size: calc(var(--fs) * 1.7); font-weight: 900; }
.check { display: inline-flex; width: 1.75em; height: 1.75em; align-items: center; justify-content: center; border-radius: 50%; border: var(--line) solid var(--ink); background: var(--fw-pass); color: #fff; }
.check .icon { width: 1.1em; height: 1.1em; stroke-width: 3.4; }
.saved-time { color: var(--fw-muted); font-size: calc(var(--fs) * 1.05); }
.usage-rows { display: grid; padding: 0.3em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.usage-row { display: grid; grid-template-columns: auto 4.6em minmax(0, 1fr) 4.6em; align-items: center; gap: 0.6em; padding: 0.55em 0; }
.usage-row + .usage-row { border-top: var(--line-in) solid #e3cfa6; }
.usage-row .icon { color: var(--ink); }
.usage-label { font-weight: 800; }
.usage-bar { display: block; height: 1em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-track); overflow: hidden; }
.usage-fill { display: block; height: 100%; border-right: var(--line-in) solid var(--ink); border-radius: 999px; background: #3a9a80; }
.usage-size { text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.menu { gap: 0.6em; }
.menu-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8em;
  width: 100%;
  min-height: 3.8em;
  padding: 0.6em 0.75em;
  border-radius: 0.95em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface-3);
  color: var(--fw-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-row:disabled { opacity: 0.55; cursor: not-allowed; }
.menu-icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 2.9em; height: 2.9em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: 0 0.15em 0 var(--ink); }
.menu-icon.light, .menu-icon.quiet { background: var(--fw-surface-2); color: var(--ink); }
.menu-text { display: grid; flex: 1; min-width: 0; }
.menu-title { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.menu-row.quiet .menu-title { font-size: var(--fs); }
.menu-detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.menu-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
label.menu-row:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.restore { display: grid; gap: 0.6em; }
.preview-box { display: grid; gap: 0.45em; padding: 0.75em; border-radius: 0.9em; border: var(--line-in) dashed var(--ink); background: var(--fw-surface); }
.preview-head { display: flex; align-items: center; gap: 0.45em; font-size: calc(var(--fs) * 1.05); }
.preview-head .icon { color: var(--fw-accent); }
.preview-rows { display: grid; padding: 0.2em 0.75em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.preview-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75em; padding: 0.4em 0; }
.preview-row + .preview-row { border-top: var(--line-in) solid #e3cfa6; }
.preview-row .icon { color: var(--fw-wood-dark); }
.preview-row strong { font-variant-numeric: tabular-nums; }

/* \u2500\u2500 \uC138\uACC4 \uACE0\uB974\uAE30 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.form { gap: 0.55em; }
.form .button { margin-top: 0.4em; }
.field-label { font-weight: 900; }
.restore-details > summary { cursor: pointer; min-height: 2.75em; }
.restore-details[open] > .restore { margin-top: 0.75em; }
.invite-empty { display: grid; gap: 0.65em; justify-items: start; }

/* \u2500\u2500 Sheets (\uC2DC\uC791 \uAFB8\uB7EC\uBBF8 and the resident sheets) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-backdrop { position: absolute; inset: 0; z-index: 10; display: flex; align-items: flex-end; justify-content: center; padding: 0.75em; background: rgba(48, 29, 16, 0.5); }
.sheet { width: min(100%, 480px); max-height: 100%; overflow-y: auto; gap: 0.75em; padding: var(--fw-panel-block) var(--fw-panel-inline); }
.kit-heading { display: flex; align-items: center; gap: 0.55em; }
.kit-heading .section-title { margin: 0; }
.kit-gift { width: 2.5em; height: 2.5em; flex: none; object-fit: contain; }
.kit { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.kit-item { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.6em; padding: 0.55em 0.8em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); font-weight: 800; }
.kit-item .icon { color: var(--fw-leaf); }
.kit-item strong { font-variant-numeric: tabular-nums; }

/* \u2500\u2500 \uC5F0\uACB0 \uC810\uAC80 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.diagnostics { display: grid; gap: 0.85em; min-width: 0; }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5em; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; min-width: 0; }
.row.stacked { display: grid; gap: 0.25em; padding-bottom: 0.5em; border-bottom: var(--line-in) solid #e3cfa6; }
.row.stacked:last-child { border-bottom: 0; padding-bottom: 0; }
.row-head { display: flex; justify-content: space-between; align-items: center; gap: 0.75em; }
.name { min-width: 0; overflow-wrap: anywhere; }
.detail { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); overflow-wrap: anywhere; }
.badge { flex: none; font-size: calc(var(--fs) * 0.8); font-weight: 900; padding: 0.1em 0.6em; border-radius: 999px; border: var(--line-in) solid currentColor; background: var(--fw-surface-3); }
.badge.pass { color: var(--fw-pass); }
.badge.fail { color: var(--fw-fail); }
.badge.unavailable { color: var(--fw-unavailable); }
.file { width: 100%; max-width: 100%; font: inherit; min-height: 2.75em; }
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 12em;
  padding: 0.75em;
  border-radius: 0.8em;
  border: var(--line-in) solid var(--ink);
  background-color: #f4efe3;
  background-image: linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%),
    linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.preview { max-width: 100%; max-height: 22em; width: auto; height: auto; object-fit: contain; }
.facts { margin: 0; display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.25em 0.75em; font-size: calc(var(--fs) * 0.9); }
.facts dt { color: var(--fw-muted); }
.facts dd { margin: 0; overflow-wrap: anywhere; font-weight: 800; }

/* \u2500\u2500 Narrow phones \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@media (max-width: 380px) {
  :host { --line: 2.5px; --line-in: 2px; }
  .top { padding-left: 0.5em; padding-right: 0.5em; }
  .sign-home { font-size: calc(var(--fs) * 1.3); }
  .top-sub.with-resources .sign { font-size: var(--fs); padding: 0.3em 0.5em; }
  .coin { width: 1.35em; height: 1.35em; }
  .counter { padding-right: 0.45em; }
  .icon-button.gear { width: 2.2em; }
  .field-tab { font-size: calc(var(--fs) * 0.85); }
  .report-body { grid-template-columns: 1fr; }
  .report-items { padding-right: 0; border-right: 0; }
  .facility { grid-template-columns: 1fr; }
  .facility-picture { aspect-ratio: auto; min-height: 6em; }
  .plan-row { grid-template-columns: auto minmax(0, 1fr); }
  .plan-row .plan-progress { grid-column: 1 / -1; }
  .usage-row { grid-template-columns: auto minmax(0, 1fr) auto; }
  .usage-row .usage-label { grid-column: 2; }
  .usage-row .usage-bar { grid-column: 1 / -1; grid-row: 2; }
}

/* \u2500\u2500 Focus \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
button:focus-visible, .locked-block:focus-visible, .input:focus-visible, .slider:focus-visible, .file:focus-visible {
  outline: 3px solid var(--fw-accent);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } .button:active:not(:disabled) { transform: none; } }
`;var ka=`
.work-card { gap: 0.35em; }
.work-stock-actions { display: flex; gap: 0.4em; }
.work-stock-actions .outline-button { flex: 1; min-width: 0; min-height: 44px; }
.work-sections { display: flex; gap: 0.4em; }
.work-sections .pill-tab { flex: 1; min-width: 0; padding: 0.25em; }
.work-sections .pill-tab[aria-pressed="true"] { background: #4f8f6e; color: #fff; }
/* Item tiles: the item's icon in a framed square until the illustrated item art (P5). */
.item-tile { flex: none; display: inline-grid; place-items: center; width: 1.9em; height: 1.9em; margin-right: 0.35em; vertical-align: middle; border-radius: 0.5em; border: 2px solid var(--ink); background: var(--fw-surface-3); color: var(--ink); }
.item-tile .icon { width: 1.25em; height: 1.25em; }
.item-tile.big { width: 3.2em; height: 3.2em; margin: 0; border-width: var(--line-in); border-radius: 0.75em; }
.item-tile.big .icon { width: 2em; height: 2em; }
.item-wild-berry { background: #fbd9d4; color: #a3262a; }
.item-herb { background: #dcebc4; color: #3f7a2d; }
.item-wood { background: #f1d6b2; color: #8a5a33; }
.item-berry-jam { background: #f9c6cf; color: #a3262a; }

/* \uACF5\uBC29 \uC791\uC5C5 */
.facility-entry { display: grid; grid-template-columns: 1fr 1fr; }
.facility-entry .facility-open { grid-column: 1 / -1; min-width: 0; }
.facility-entry .outline-button { min-width: 0; }

.field-tab.current { background: var(--fw-accent); color: var(--fw-on-accent); }
.field-tab.current .field-glyph { color: var(--fw-on-accent); }
.segmented > .segment { border: 0; background: none; color: var(--fw-text); font: inherit; font-weight: 900; cursor: pointer; }
.segmented > .segment.selected { border: var(--line-in) solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.recipe-flow { margin-top: 0.15em; color: var(--fw-text); font-weight: 800; font-size: calc(var(--fs) * 0.8); }
.bar { position: relative; overflow: hidden; }
.bar-fill { position: absolute; inset: 0 auto 0 0; display: block; width: 0; border-right: var(--line-in) solid var(--ink); background: var(--fw-accent); }
.bar-fill.red { background: #d9534f; }
.bar-fill[style*="width: 0%"] { border-right: 0; }
.usage-list { display: grid; gap: 0.4em; }
.usage-item { display: inline-flex; align-items: center; min-width: 0; }
.usage-cell.available strong { color: var(--fw-pass); }
.priority-row { flex-wrap: wrap; }
.priority-row.selected { background: #eef6e2; box-shadow: inset 0 0 0 var(--line-in) #4f8f6e; }
.priority-row.off .priority-main { opacity: 0.55; }
.priority-main { flex: 1 1 8em; min-width: 0; display: flex; align-items: center; gap: 0.3em; padding: 0; border: 0; background: none; color: inherit; font: inherit; font-weight: 900; text-align: left; cursor: pointer; }
.priority-main .muted { margin-left: auto; white-space: nowrap; }
.chip-toggle { flex: none; min-height: 2.2em; padding: 0 0.7em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #b9ad9c; color: #fff; font: inherit; font-size: calc(var(--fs) * 0.8); font-weight: 900; cursor: pointer; }
.chip-toggle.on { background: var(--fw-leaf); }
.order-buttons { flex: none; display: inline-flex; gap: 0.25em; }
.mini { min-width: 44px; min-height: 44px; display: inline-grid; place-items: center; width: 2.2em; height: 2.2em; border-radius: 0.55em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--ink); cursor: pointer; }
.mini:disabled { opacity: 0.35; cursor: default; }
.mini .icon { stroke-width: 3; }
.add-rules { display: flex; flex-wrap: wrap; gap: 0.4em; }
.outline-button.small { min-height: 44px; padding: 0.2em 0.7em; font-size: calc(var(--fs) * 0.85); box-shadow: 0 0.15em 0 var(--ink); }
.plan-row.current-work { grid-template-columns: auto auto minmax(0, 1fr) auto; }
.countdown { font-weight: 900; font-size: calc(var(--fs) * 1.2); font-variant-numeric: tabular-nums; }
.draft-note { display: flex; justify-content: center; align-items: center; gap: 0.3em; padding: 0.35em 0.8em; border-radius: 999px; border: var(--line-in) dashed var(--ink); background: #fff3c8; font-weight: 800; font-size: calc(var(--fs) * 0.85); }
.link-button { border: 0; background: none; padding: 0.2em; color: var(--fw-accent); font: inherit; font-weight: 900; text-decoration: underline; text-decoration-thickness: 2px; cursor: pointer; }

/* \uC2DC\uC124\uACFC \uCC3D\uACE0 */
.chip-row { display: flex; gap: 0.4em; flex-wrap: wrap; }
.chip-row .pill-tab { padding: 0 1em; }
.gold-button { width: 100%; color: var(--fw-text); font: inherit; font-weight: 900; cursor: pointer; }
.gold-button:disabled { opacity: 0.55; cursor: not-allowed; }
.gold-button .coin { width: 1.4em; height: 1.4em; }
.stock tbody th .item-tile { width: 1.7em; height: 1.7em; }
.storage-item .outline-button { margin-top: 0.2em; }
.stepper.wide { display: flex; justify-content: space-between; width: 100%; }
.stepper.wide .step { width: auto; flex: 1; min-height: 2.6em; border: 0; border-right: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 900; cursor: pointer; }
.stepper.wide .step:last-child { border-right: 0; border-left: var(--line-in) solid var(--ink); }
.stepper.wide .step:nth-child(4) { border-right: 0; border-left: var(--line-in) solid var(--ink); }
.step-value.big { flex: 1.4; display: grid; place-items: center; font-size: calc(var(--fs) * 1.25); }
.protect-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.55em; }
.protect-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "tile name save" "picker picker picker"; align-items: center; gap: 0.45em 0.5em; padding: 0.55em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.protect-row[hidden] { display: none; }
.protect-row > .item-tile { grid-area: tile; }
.protect-name { grid-area: name; display: grid; min-width: 0; }
.protect-row > .stepper { grid-area: picker; }
.protect-row > .button { grid-area: save; }

.waiting-guide { display: grid; gap: 0.4em; justify-items: start; }
.waiting-guide .hint { margin: 0; }
.waiting-guide .outline-button { text-align: left; white-space: normal; }

/* \uACF5\uBC29 \uC18C\uC2DD \xB7 \uC791\uC5C5 \uBCF4\uACE0 */
.report-slot.empty { opacity: 0.6; }
.report-slot .item-tile { margin-bottom: 0.1em; }
.count-badge { display: inline-grid; place-items: center; min-width: 1.5em; height: 1.5em; padding: 0 0.3em; border-radius: 999px; border: 2px solid var(--ink); background: #d9534f; color: #fff; font-size: calc(var(--fs) * 0.75); font-weight: 900; }
.strip.offline strong { margin: 0 0.15em; }
.report-total { display: grid; gap: 0.3em; padding: 0.7em 0.8em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); }
.report-items { display: inline-flex; flex-wrap: wrap; gap: 0.3em 0.6em; vertical-align: middle; }
.report-item { display: inline-flex; align-items: center; gap: 0.2em; }
.report-item .item-tile { width: 1.8em; height: 1.8em; }
.report-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; max-height: 16em; overflow-y: auto; }
.report-entry { display: grid; gap: 0.1em; padding: 0.5em 0.7em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-size: calc(var(--fs) * 0.9); }
.report-entry.new { background: #fff3c8; }
.report-time { color: var(--fw-muted); font-size: calc(var(--fs) * 0.78); font-weight: 800; }

@media (max-width: 380px) {
  .plan-row.current-work { grid-template-columns: auto minmax(0, 1fr) auto; }
  .plan-row.current-work .plan-label { grid-column: 1 / -1; }
}
`;var Na=`
.paged-rows { display: grid; gap: 0.5em; }
/* Top counters (\uCD08\uB300\uAD8C + \xB7 \uC885\uD45C) */
.invite-counters { gap: 0.35em; }
.counter-plus { display: inline-flex; align-items: center; justify-content: center; width: 1.45em; height: 1.45em; margin-left: 0.1em; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-accent); color: var(--fw-on-accent); }
.counter-plus .icon { stroke-width: 3; }
.token-mark, .token-coin { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 1.65em; height: 1.65em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: #b9cf7a; color: #2f4a26; }
.token-coin.big { width: 3.6em; height: 3.6em; border-width: var(--line); box-shadow: var(--drop); }
.token-coin.big .icon { width: 1.8em; height: 1.8em; }

/* Tabs and the envelope */
.invite-tabs .segment { gap: 0.45em; }
.invite-tabs .segment .icon { width: 1.2em; height: 1.2em; }
.invite-stage { display: grid; place-items: center; padding: 0.4em 0 0; }
.invite-envelope { width: min(76%, 300px); height: auto; filter: drop-shadow(0 0.25em 0 rgba(75, 46, 26, 0.35)); }

/* \uD76C\uB9DD \uC8FC\uBBFC \xB7 1\uD68C / 10\uD68C \uCD08\uB300 */
.wish-row .menu-detail { overflow-wrap: anywhere; }
.draw-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6em; }
.draw-button {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.2em;
  min-height: 6.4em;
  padding: 0.7em 0.5em 1.1em;
  border-radius: 1em;
  border: var(--line) solid var(--ink);
  background: var(--fw-accent);
  color: var(--fw-on-accent);
  box-shadow: var(--drop);
  font: inherit;
  cursor: pointer;
}
.draw-button:disabled { background: #a29a8b; color: #f7f1e6; cursor: not-allowed; }
.draw-title { font-size: calc(var(--fs) * 1.35); font-weight: 900; }
.draw-cost { display: inline-flex; align-items: center; gap: 0.3em; font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.draw-short { position: absolute; left: 50%; bottom: -0.85em; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 0.25em; padding: 0.1em 0.6em; border-radius: 999px; border: 2px solid var(--ink); background: var(--fw-surface-3); color: var(--fw-fail); font-size: calc(var(--fs) * 0.8); font-weight: 900; white-space: nowrap; }
.draw-row + .hint { margin-top: 0.6em; }
.link-row { display: flex; justify-content: space-between; gap: 0.5em; padding-top: 0.4em; border-top: var(--line-in) dashed var(--fw-track); }
.link-button.with-icon { display: inline-flex; align-items: center; gap: 0.35em; color: var(--fw-text); }

/* \uC885\uD45C \uAD50\uD658 card and list */
.exchange-card { display: grid; grid-template-columns: auto auto 1fr auto; align-items: center; gap: 0.7em; width: 100%; padding: 0.2em; border: 0; background: none; color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.exchange-count { display: grid; justify-items: center; gap: 0.25em; padding-right: 0.7em; border-right: var(--line-in) solid var(--fw-track); }
.exchange-count strong { font-size: calc(var(--fs) * 1.1); }
.count-pill { padding: 0.1em 0.8em; border-radius: 999px; border: 2px solid var(--ink); background: var(--fw-surface-2); font-weight: 900; font-size: calc(var(--fs) * 1.15); }
.exchange-text { display: grid; gap: 0.2em; min-width: 0; }
.exchange-text strong { display: inline-flex; align-items: center; gap: 0.3em; }
.exchange-summary { display: flex; align-items: center; flex-wrap: wrap; gap: 0.4em; margin: 0; }
.exchange-list, .pick-list, .result-list, .chance-list, .order-list, .queue-list, .unlock-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.exchange-row, .chance-row, .result-row { display: flex; align-items: center; gap: 0.6em; padding: 0.45em 0.6em; border-radius: 0.85em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.exchange-name, .chance-name { display: grid; gap: 0.2em; flex: 1; min-width: 0; }
.chance-value { font-variant-numeric: tabular-nums; }
.tag.wish { background: var(--fw-gold); color: var(--ink); }

/* Pick rows (\uD76C\uB9DD \uC8FC\uBBFC, \uBC30\uCE58 \uBCC0\uACBD, \uC804\uBB38 \uBD84\uC57C) */
.pick-row { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5em; width: 100%; min-height: 3.2em; padding: 0.45em 0.7em; border-radius: 0.85em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.pick-row > strong { flex: 1 1 6em; min-width: 0; overflow-wrap: anywhere; }
.pick-row.selected { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 2px var(--fw-leaf); }
.pick-row:disabled { cursor: default; }
.pick-row .good { color: var(--fw-pass); font-weight: 900; }
.pick-list.fields .pick-row .icon { width: 1.5em; height: 1.5em; color: var(--fw-accent); }
.assign-now { margin: 0; padding: 0.45em 0.7em; border-radius: 0.8em; border: 2px dashed var(--ink); background: var(--fw-surface); }

/* Results */
.result-hero { display: grid; justify-items: center; gap: 0.35em; text-align: center; }
.result-stage { position: relative; display: block; width: 9em; height: 11em; border-radius: 1em; border: var(--line) solid var(--ink); background: var(--fw-leaf-soft); overflow: hidden; }
.result-name { font-size: calc(var(--fs) * 1.4); }
.result-row > strong { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.result-row > small { flex-basis: 100%; padding-left: 2.9em; }
.result-row { flex-wrap: wrap; }
.result-badge { padding: 0.05em 0.6em; border-radius: 999px; border: 2px solid var(--ink); font-weight: 900; font-size: calc(var(--fs) * 0.82); }
.result-badge.new { background: var(--fw-gold); color: var(--ink); }
.result-badge.breakthrough { background: var(--fw-leaf-soft); color: #2f4a26; }
.result-badge.token { background: #b9cf7a; color: #2f4a26; }

/* \uCD08\uB300\uAD8C \uBC1B\uAE30 \xB7 \uB0A9\uD488 */
.delivery-board { display: grid; gap: 0.5em; }
.delivery-choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35em; }
.delivery-choice { display: grid; justify-items: center; gap: 0.15em; min-width: 0; min-height: 44px; padding: 0.35em 0.2em; border: 2px solid var(--ink); border-radius: 0.7em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: center; cursor: pointer; }
.delivery-choice span:not(.item-tile) { overflow-wrap: anywhere; font-weight: 800; font-size: calc(var(--fs) * 0.8); }
.delivery-choice small { font-size: calc(var(--fs) * 0.7); }
.delivery-choice.selected { background: var(--fw-leaf-soft); outline: 2px solid var(--fw-accent); }
.order { display: grid; gap: 0.45em; padding: 0.7em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.order.done { background: var(--fw-surface-2); }
.order-title { font-size: calc(var(--fs) * 1.05); }
.order-items { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.3em; }
.order-items li { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45em; font-weight: 800; }
.order-items li.short > span { color: var(--fw-fail); }
.order-reward { display: flex; align-items: center; gap: 0.3em; margin: 0; font-weight: 900; color: var(--fw-accent); }
.order .status-pill { justify-self: start; }

/* \uC791\uC5C5: closed tabs, \uD574\uAE08, crew line, \uC9C0\uC815 \uD69F\uC218 */
.field-tab.closed { background: var(--fw-surface-2); color: var(--fw-muted); }
.field-tab .lock-tag { position: absolute; top: 0.2em; right: 0.2em; }
.facility-open.closed { cursor: default; }
.unlock-list li { display: flex; align-items: center; gap: 0.5em; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-weight: 800; }
.unlock-list li > span { flex: 1; min-width: 0; }
.unlock-list li.met { background: var(--fw-leaf-soft); }
.unlock-list li.met .icon { color: var(--fw-pass); }
.crew-line { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 0.35em; font-weight: 800; color: var(--fw-text); }
.crew-line .avatar { width: 1.8em; height: 1.8em; }
.queue-row { display: flex; align-items: center; gap: 0.5em; padding: 0.4em 0.55em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.queue-name { display: grid; flex: 1; min-width: 0; }
.queue-add { display: grid; gap: 0.55em; padding-top: 0.5em; border-top: var(--line-in) dashed var(--fw-track); }
.queue-add .pill-tab { display: inline-flex; align-items: center; gap: 0.35em; }
.queue-add .pill-tab .item-tile { width: 1.6em; height: 1.6em; }

/* \uC790\uB3D9 \uD310\uB9E4 */
.auto-sell-row { display: grid; gap: 0.5em; padding: 0.7em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.auto-sell-row.on { background: var(--fw-leaf-soft); }
.auto-sell-head { display: flex; align-items: center; gap: 0.55em; }
.auto-sell-head .protect-name { flex: 1; min-width: 0; display: grid; }
.auto-sell-fields { display: grid; gap: 0.3em; }
.row-actions { display: flex; flex-wrap: wrap; gap: 0.5em; }
.row-actions .button { flex: 1; }

/* \uC8FC\uBBFC: \uD2B9\uAE30 and lit \uB3CC\uD30C leaves */
.talent-card { display: grid; gap: 0.35em; padding: 0.65em 0.75em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-leaf-soft); }
.talent-card p { margin: 0; }
.talent-field { display: flex; align-items: center; gap: 0.4em; font-size: calc(var(--fs) * 1.05); }
.talent-field .icon { color: var(--fw-accent); }
.talent-name { display: grid; gap: 0.15em; }
.talent-line, .talent-note { display: flex; align-items: center; flex-wrap: wrap; gap: 0.3em; margin: 0; color: #2f4a26; font-weight: 800; }
.pip.on { background: var(--fw-leaf); }
.passive-block { display: grid; gap: 0.25em; }
.passive-block p { margin: 0; }

@media (max-width: 360px) {
  .draw-title { font-size: calc(var(--fs) * 1.15); }
  .exchange-card { grid-template-columns: auto 1fr auto; }
  .exchange-count { justify-items: start; border-right: 0; }
  .exchange-text { grid-column: 1 / -1; order: 5; }
}
`;var Sa=`
.activity-running,.activity-prepare,.activity-record { display: grid; gap: 0.5em; }
.activity-record { padding: 0.6em; border-radius: 0.7em; background: var(--fw-surface-3); }

/* \uD0D0\uC0AC */
.explore-tabs { grid-template-columns: 1fr 1fr 1.4fr; }
.explore-tabs .field-tab span { white-space: nowrap; }
.pair-chips { margin-top: 0.4em; }
.trail-card { position: relative; padding: 0; overflow: hidden; }
.trail-art { display: block; width: 100%; height: auto; }
.place-sign { position: absolute; left: 0.8em; top: 0.8em; padding: 0.3em 0.9em; border-radius: 0.6em; border: var(--line) solid var(--ink); background: #e2b57a; color: var(--ink); font-weight: 900; box-shadow: var(--drop); }
.arc-card > .section-title { justify-content: center; }
.episode-row { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.episode-tile { width: 100%; min-height: 44px; font: inherit; color: var(--fw-text); cursor: pointer; display: grid; justify-items: center; gap: 0.25em; padding: 0.5em 0.35em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
.episode-tile.selected { background: var(--fw-accent); color: var(--fw-on-accent); box-shadow: var(--drop); }
.episode-tile.selected small { color: var(--fw-on-accent); }
.episode-tile.locked.selected { color: var(--fw-text); box-shadow: inset 0 0 0 0.2em var(--fw-accent), var(--drop); }
.episode-tile.locked.selected small { color: var(--fw-muted); }
.episode-tile.locked { background: var(--fw-surface-2); color: var(--fw-muted); }
.episode-icon { position: relative; display: inline-flex; }
.episode-check { position: absolute; right: -0.4em; bottom: -0.2em; display: inline-flex; border-radius: 50%; border: 2px solid var(--ink); background: var(--fw-leaf); color: #fff; }
.episode-text { display: grid; gap: 0.1em; min-width: 0; }
.episode-text strong { font-size: calc(var(--fs) * 1.05); }
.episode-text span { font-weight: 800; font-size: calc(var(--fs) * 0.88); overflow-wrap: anywhere; }
.episode-text small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); overflow-wrap: anywhere; }
.expedition-details { display: grid; gap: 0.6em; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; padding: 0.6em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); }
.detail-cell { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45em; min-width: 0; }
.detail-cell.wide { grid-column: 1 / -1; }
.detail-cell > span { display: grid; min-width: 0; }
.detail-cell small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); }
.detail-cell strong { font-size: calc(var(--fs) * 1.05); }
.detail-cell > .icon { color: var(--fw-wood-dark); }
.avatar-row { display: inline-flex !important; grid-auto-flow: column; gap: 0.2em; margin-left: auto; }
.prep-list { display: flex !important; flex-wrap: wrap; gap: 0.4em; }
.prep { display: inline-flex; align-items: center; gap: 0.3em; font-weight: 900; color: var(--fw-fail); }
.prep.ok { color: var(--fw-text); }
.prep.ok .icon { color: var(--fw-pass); }
.locked-reasons ul { margin: 0; padding-left: 1.2em; font-weight: 800; }
.expedition-running { display: grid; gap: 0.45em; }
.running-line { display: flex; align-items: center; gap: 0.45em; margin: 0; }
.running-line .countdown { margin-left: auto; }
.explore-strip { cursor: default; justify-content: flex-start; flex-wrap: wrap; }
.strip-progress { display: grid; flex: 1; gap: 0.25em; min-width: 10em; }
.completed-arc { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5em; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.completed-arc strong { flex: 1; }

/* \uACF5\uBC29 \uC774\uC57C\uAE30 */
.story-layout .column { height: 100%; min-height: 0; }
.story-layout .page { display: flex; flex: 1 1 auto; min-height: 0; flex-direction: column; gap: 0.45em; }
.story-layout .story-stage { flex: 1 1 auto; height: auto; min-height: 3em; }
.story-layout .dialogue-box { flex: none; margin-top: 0; min-height: 0; padding: 0.85em 1em; border-radius: 0.7em; }
.story-layout .dialogue-box:not(.choice):not(.loading):not(.error):not(.end) { height: 9em; overflow-y: auto; align-content: start; }
.story-layout .speaker-tag { position: static; justify-self: start; padding: 0; border: 0; background: transparent; color: var(--fw-wood-dark); }
.story-layout .dialogue-box .line { font-size: var(--fs); font-weight: 600; line-height: 1.45; }
.story-layout .reader-foot { flex: none; display: flex; align-items: center; margin-top: 0; }
.story-layout .reader-foot .button { flex: 1; }
.reader-tools { gap: 0.35em; }
.reader-tools .chip-button { min-height: 44px; padding: 0.1em 0.7em; }
.chip-button.active { background: var(--fw-accent); color: var(--fw-on-accent); }
.story-stage { position: relative; height: clamp(15em, 52vh, 26em); border-radius: 1.1em; border: var(--line) solid var(--ink); background: #e9c995; overflow: hidden; box-shadow: var(--drop); }
.stage-shelf { position: absolute; left: 0; right: 0; top: 0; height: 58%; border-bottom: var(--line) solid var(--ink); background: #c58a52; }
.stage-shelf::before { content: ""; position: absolute; left: 8%; right: 8%; top: 35%; height: 0.6em; border: var(--line-in) solid var(--ink); border-radius: 0.3em; background: #8a5a33; }
.stage-cast { position: absolute; inset: 0; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; align-items: end; padding: 0 4%; }
.stage-spot { position: relative; display: block; height: 92%; }
.stage-spot .figure { position: absolute; inset: 0; }
.emotion-bubble { position: absolute; z-index: 2; bottom: var(--mark-bottom, 78%); left: var(--mark-left, 50%); transform: translateX(-50%); display: inline-grid; place-items: center; min-width: 2.2em; height: 2.2em; padding: 0 0.4em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: #fff8e8; font-weight: 900; font-size: calc(var(--fs) * 1.2); }
.dialogue-box { position: relative; display: grid; gap: 0.5em; margin-top: -2.4em; padding: 1.4em 1.1em 1em; border-radius: 1.1em; border: var(--line) solid var(--ink); background: var(--fw-surface-3); box-shadow: var(--drop); min-height: 7.5em; }
.dialogue-box p { margin: 0; }
.speaker-tag { position: absolute; top: -1.1em; left: 0.9em; display: inline-flex; align-items: center; gap: 0.3em; padding: 0.25em 0.9em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: #f2e2bd; font-weight: 900; }
.dialogue-box .line { font-size: calc(var(--fs) * 1.15); font-weight: 800; line-height: 1.55; }
.dialogue-box .narration { color: var(--fw-muted); line-height: 1.55; }
.dialogue-box.narration-only .narration { color: var(--fw-text); }
.dialogue-box.end { text-align: center; }
.end-line { font-size: calc(var(--fs) * 1.15); font-weight: 900; }
.choice-options { display: grid; gap: 0.4em; }
.choice-option { min-height: 2.8em; padding: 0.4em 0.8em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: #fff; color: var(--fw-text); font: inherit; font-weight: 800; text-align: left; cursor: pointer; }
.choice-option.chosen { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 2px var(--fw-leaf); }
.choice-option:disabled { cursor: default; }
.reader-foot { display: grid; justify-items: center; gap: 0.5em; margin-top: 0.6em; }
.reader-foot .count-pill { background: #8a5a33; color: #fff4dc; }
.backlog-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.backlog-list li { display: grid; gap: 0.1em; padding: 0.4em 0.6em; border-radius: 0.7em; border: 2px solid var(--fw-track); background: var(--fw-surface-3); }
.backlog-narration span { color: var(--fw-muted); }
@media (max-width: 360px) {
  .explore-tabs { grid-template-columns: 1fr 1fr 1.6fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
`;var En=Yt.map(e=>`.season-${e}.art-base:is(.backdrop-forest, .backdrop-wood) { background: var(--fw-page) ${he(Re[e].base)} center top / cover no-repeat; }`).join(`
`),$a=`
/* Keep the season picture on the viewport, covering tall and wide hosts independently of content length. */
${En}
.art-base:is(.backdrop-forest, .backdrop-wood) .scroll { background: transparent; }

/* Item, facility and emotion pictures: drawn straight on the panel like the mockups, no tile frame around them. */
.item-tile { width: 2em; height: 2em; }
.item-tile:has(.item-art) { border: 0; border-radius: 0; background: none; }
.item-tile .item-art { width: 100%; height: 100%; object-fit: contain; display: block; filter: drop-shadow(0 1px 0 rgba(75, 46, 26, 0.25)); }
.item-tile.big:has(.item-art) { width: 3.6em; height: 3.6em; }
.stock tbody th .item-tile, .queue-add .pill-tab .item-tile { width: 2em; height: 2em; }
.facility-image { display: block; object-fit: contain; }
.facility-image.big, .facility-image.huge { width: 100%; height: 100%; }
.facility-art { position: relative; }
.facility-art:has(.facility-image) { width: 6em; height: 4.8em; border: 0; border-radius: 0; background: none; }
.recipe-art:has(.item-art) { border: 0; border-radius: 0; background: none; }
.recipe-art .item-tile.big:has(.item-art) { width: 4.6em; height: 4.6em; }
.facility-picture:has(.facility-image) { border: 0; border-radius: 0; background: none; aspect-ratio: auto; min-height: 0; }
.facility-image.huge { max-height: 11em; }
.facility-picture.closed .facility-image, .facility-art.closed .facility-image { filter: grayscale(0.85) brightness(0.92); }
.facility-lock { position: absolute; right: 0; bottom: 0; display: inline-grid; place-items: center; width: 1.8em; height: 1.8em; border-radius: 50%; border: var(--line-in) solid var(--ink); background: var(--fw-wood); color: var(--ink); }
.facility-lock .icon { width: 1.1em; height: 1.1em; }
.facility-entry:has(.facility-image) { padding: 0.35em 0.5em; }
.facility-entry:has(.facility-image) .facility-text strong { white-space: nowrap; }
img.scene-art { object-fit: cover; object-position: 50% 20%; }
.scene { isolation: isolate; }
.scene-scenery { position: absolute; inset: 0; z-index: 0; overflow: hidden; container-type: size; pointer-events: none; }
.scene-props {
  --scene-image-left: calc((100cqw - max(100cqw, 66.6667cqh)) * .5);
  --scene-image-top: calc((100cqh - max(150cqw, 100cqh)) * .2);
  position: absolute;
  width: max(100cqw, 66.6667cqh);
  height: max(150cqw, 100cqh);
  left: var(--scene-image-left);
  top: var(--scene-image-top);
  pointer-events: none;
}
.scene-board {
  position: absolute;
  left: clamp(calc(12px - var(--scene-image-left)), 84%, calc(100cqw - var(--scene-image-left) - clamp(56px, 16%, 96px) - 12px));
  top: max(31%, calc(12em - var(--scene-image-top)));
  width: clamp(56px, 16%, 96px);
  aspect-ratio: 1;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  pointer-events: auto;
  touch-action: manipulation;
  font: inherit;
}
.scene-board:disabled { cursor: default; opacity: 1; }
.scene-board .board-art { display: block; width: 100%; height: 100%; object-fit: contain; }
.scene-board:focus-visible { outline: 3px solid var(--fw-accent); outline-offset: 4px; border-radius: 8px; }

.story-stage .stage-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 60%; display: block; }
.art-sign .reader-tools .chip-button { white-space: nowrap; }
img.emotion-bubble.emotion-art { min-width: 0; width: 2.6em; height: 2.6em; padding: 0; border: 0; border-radius: 0; background: none; object-fit: contain; }

/* \uD648 (board 01-1): the workshop scene fills the top of the screen and the sign, money and \uB0A0\uC528 sit on it. */
.column:has(> .scene img.scene-art) { position: relative; }
.column:has(> .scene img.scene-art) > .top-home { position: absolute; z-index: 3; top: 0; left: 0; right: 0; }
.scene:has(img.scene-art) { aspect-ratio: 390 / 470; min-height: 22em; margin-bottom: 0; }
.home-layout .scene:has(img.scene-art) { min-height: 0; aspect-ratio: auto; margin: 0; }
@media (max-height: 480px) { .home-layout .scene:has(img.scene-art) { min-height: 12em; } }

/* Wooden sign (title-sign.webp) on every screen; the DOM title sits in its empty middle (textSafeRect 22\u201378 % \xD7 36\u201374 %). */
.art-sign .sign {
  flex: none;
  aspect-ratio: 768 / 359;
  width: min(12em, 52vw);
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: ${he(F.titleSign)} center / 100% 100% no-repeat;
  box-shadow: none;
  color: #4b2e1a;
  font-size: calc(var(--fs) * 1.6);
  font-weight: 900;
  letter-spacing: 0.04em;
  overflow: visible;
}
.art-sign .sign::before, .art-sign .sign::after { content: none; }
.art-sign .sign-home { width: min(10.5em, 44vw); font-size: calc(var(--fs) * 1.45); }
/* The gear on the scene: a cream disc so it reads over leaves (board 01-1). */
.art-base .icon-button.gear { border-radius: 50%; background: rgba(255, 248, 232, 0.85); }
.art-sign .top-sub .sign { margin-right: 0; }
.art-sign .top-sub:not(.with-resources) .top-row { justify-content: center; }
.art-sign .top-sub:not(.with-resources) .back-button { position: absolute; left: 0.75em; }
.art-sign .top-sub.with-resources .sign { width: min(9.5em, 40vw); font-size: calc(var(--fs) * 1.15); padding: 0; }

/* Narrow phones: the sign and its title shrink with the bar so the money and the gear keep their row. */
.art-sign .top { container-type: inline-size; }
@container (max-width: 380px) {
  .art-sign .sign-home { width: 40cqi; font-size: 5cqi; padding: 0; }
  .art-sign .top-sub.with-resources .sign { width: 37cqi; font-size: 4.3cqi; padding: 0; letter-spacing: 0; }
}
/* Large teal calls to action: primary-button.webp as nine-slice. Small, inline and secondary buttons stay drawn. */
.art-button .button:not(.secondary):not(.small):not(.is-locked):not(:disabled):not(.pressed):not(.setting-field > .button) {
  border-color: transparent;
  border-width: 0;
  border-image: ${he(F.primaryButton)} 70 138 fill / 16px 32px / 0 stretch;
  background: transparent;
  box-shadow: none;
  padding-left: 1.8em;
  padding-right: 1.8em;
  text-shadow: 0 1px 0 rgba(37, 22, 12, 0.45);
}

.art-button .button.report-button:not(:disabled) { padding-left: 1.1em; padding-right: 1.1em; }

/* Cards, sheets and the story dialogue: paper-panel.webp (cream paper with leaf corners, as on every board). */
.art-paper .card, .art-paper .sheet, .art-paper .dialogue-box {
  border-color: transparent;
  border-width: 0;
  border-image: ${he(F.paperPanel)} 105 154 fill / 30px 44px / 0 stretch;
  background: transparent;
  box-shadow: none;
}
.art-paper .card { padding: var(--fw-panel-block) var(--fw-panel-inline); }
.art-paper .resident-board { padding: var(--fw-panel-block) var(--fw-panel-inline); }
/* Inside the paper, rows and boxes use a light tan line and no ink frame, as on the boards. */
.art-paper .card :is(.facility-entry, .recipe, .plan-row, .plan-block, .setting-block, .detail-grid, .report-slot, .kit-item, .completed-arc, .segmented, .episode-tile:not(.selected)) {
  border-color: #dcc49a;
  border-width: 2px;
}
.art-paper .sheet, .art-paper .dialogue-box { padding: var(--fw-panel-block) var(--fw-panel-inline); }
/* With the 96 px picture the facility text needs the row: the action button wraps under it on phones. */
.facility-entry:has(.facility-image) { flex-wrap: wrap; }
.facility-entry:has(.facility-image) .facility-open { flex: 1 1 13em; }
.facility-entry:has(.facility-image) .outline-button { white-space: nowrap; }
.facility-entry:has(.facility-image) > :not(.facility-open) { margin-left: auto; }
.work-card .facility-entry:has(.facility-image) > .outline-button { width: 100%; margin: 0; justify-content: center; text-align: center; white-space: nowrap; font-size: calc(var(--fs) * 0.85); }
.work-stock-actions .outline-button { justify-content: center; text-align: center; }
.work-fields { margin-bottom: 0; }
.work-fields .field-tab { min-height: 44px; padding: 0.3em 0.1em; border-bottom: var(--line) solid var(--ink); border-radius: 0.65em; }
.work-fields .field-glyph { display: block; margin: 0 auto; }
.work-card .facility-art, .work-card .facility-image { width: 44px; height: 44px; }
.work-card .facility-text strong { font-size: var(--fs); }
.work-card .facility-open { gap: 0.4em; }
.work-card .segment { min-height: 44px; }
.work-card .facility-entry .outline-button { min-height: 44px; }
.work-card .plan-row.current-work { grid-template-columns: auto minmax(0, 1fr) auto; }
.work-card .current-work .plan-label { grid-column: 1 / -1; }
.work-card .current-work .plan-progress { grid-column: auto; }
.art-paper .work-card { padding: 0.6em 0.8em; gap: 0.25em; }

.big-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
/* Mockup art pass: read the whole production plan in one flow. */
.work-card .section-title { font-size: calc(var(--fs) * 1.1); padding-top: 0.65em; border-top: 1px solid #dcc49a; }
.art-paper .work-card { padding: 1em 1.15em; gap: 0.7em; }
.work-card .facility-art, .work-card .facility-image { width: 5em; height: 4.5em; }
.work-fields .field-art { display: block; width: 1.9em; height: 1.9em; object-fit: contain; }
.work-fields .field-tab { display: flex; flex-direction: column; gap: 0.2em; padding: 0.4em 0.15em; }
.work-stock-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.work-stock-actions .button { width: 100%; padding: 0.5em; }
.art-paper .card :is(.priority-row, .usage, .setting-row, .storage-item, .usage-rows, .menu-row) { border-color: #dcc49a; box-shadow: none; }
.art-paper .card .outline-button { border-width: 2px; box-shadow: 0 2px 0 #d7bd92; }
.art-paper .card .muted { font-weight: 500; }
.art-paper .card .recipe-text strong { font-weight: 800; }

/* The original paper and button pictures also dress secondary controls. */
.art-paper .button.secondary, .art-paper .page-picker-summary {
  border: 1px solid #b49a72; background: var(--fw-surface-3); box-shadow: none; padding: 0.6em 1em;
}
.tab.current { background: var(--fw-leaf-soft); box-shadow: inset 0 0 0 1px #769b55; }
.tab.current .tab-label { border: 0; background: none; color: var(--fw-text); padding: 0; }

/* Restore the report illustration and story banner; content may scroll instead of shrinking. */
.home-layout .scroll { overflow-y: auto; }
.home-layout .column { height: 100%; min-height: 100%; }
.home-layout .scene { flex: 1 0 18em; min-height: 18em; height: auto; }
.home-layout .page { grid-template-columns: minmax(0, 1fr); gap: 0.6em; }
.home-layout .report-card { padding: 1em 1.15em; }
.home-layout .report-title { font-size: calc(var(--fs) * 1.2); }
.home-layout .report-body { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.5em; }
.home-layout .report-items { padding: 0; border: 0; }
.home-layout .report-slot { padding: 0; border: 0; background: none; }
.home-layout .report-actions { min-width: 0; }
.home-layout .report-button { min-width: 0; width: 100%; font-size: var(--fs); }
.home-layout .strip.story { min-height: 5em; padding: 0.5em 0.8em; }
.home-layout .story-art { display: flex; flex: none; width: 4em; height: 4em; padding: 0; border: 0; background: none; }
.story-vignette { width: 100%; height: 100%; object-fit: contain; }
.home-layout .story-text { flex: 1; min-width: 0; }
.home-layout .story-text strong { font-size: var(--fs); }
.home-layout .story-text span { font-size: calc(var(--fs) * 0.875); }
.home-layout .strip.offline { grid-row: 2; }
.trail-scene { position: relative; background: #dcebc4; aspect-ratio: 360 / 200; overflow: hidden; }
.trail-background { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.trail-scene .trail-art { position: absolute; inset: 0; width: 100%; height: 100%; }
.invite-scene { display: block; width: 100%; max-height: 17em; object-fit: cover; border-radius: 1em; }
@media (max-width: 340px) {
  .home-layout .report-body { grid-template-columns: minmax(0, 1fr); }
  .home-layout .report-items { justify-content: space-around; }
  .home-layout .report-button { min-height: 44px; }
  .rule-actions { grid-template-columns: minmax(0, 1fr); }
}

.letter-detail {
  border: 0;
  border-image: ${he(F.letterPaper)} 200 190 fill / 55px 42px / 0 stretch;
  padding: 3.6em 1.6em 2.6em;
  color: var(--fw-text);
}
.letter-detail h3 { margin: 0; font-size: calc(var(--fs) * 1.15); }
.letter-body { overflow-wrap: anywhere; }

/* Anchor the title to the wooden board, independent of the surrounding row width. */
.art-sign .sign-title { position: absolute; inset: 36% 18% 22%; display: grid; place-items: center; line-height: 1.1; white-space: nowrap; font-size: min(1em, 4.2cqi); }
.ground-launch.icon-button { width: 44px; height: 44px; min-height: 44px; min-width: 44px; padding: 0; border-width: 2px; box-shadow: none; bottom: 0.75em; right: 0.75em; }
.empty, .invite-empty { text-align: center; justify-items: center; }
.card > .empty, .sheet > .empty { width: 100%; padding: 1em 0; }
.report-slot.empty { justify-items: center; text-align: center; }
.report-slot.empty .slot-art { display: none; }

.season-weather { display: flex; align-items: center; gap: 0.4em; }
.season-badge { display: inline-grid; place-items: center; min-height: 2em; padding: 0.15em 0.65em; border: 1.5px solid var(--ink); border-radius: 999px; background: var(--fw-surface-3); color: var(--fw-text); font-weight: 700; }

/* Align icon and label as one centered control; keep reading and action gaps distinct. */
.work-fields .field-tab { align-items: center; justify-content: center; text-align: center; min-height: 4.4em; padding: 0.5em 0.2em; gap: 0.25em; font-weight: 700; }
.work-fields .field-art { flex: none; width: 1.7em; height: 1.7em; margin: 0 auto; }
.work-fields .field-tab > span:not(.lock-tag) { width: 100%; text-align: center; line-height: 1.25; }
.work-card .facility-entry { gap: 0.6em; padding: 0.65em; }
.work-card .recipe { gap: 0.7em; padding: 0.75em; }
.work-card .recipe-art .item-tile.big:has(.item-art) { width: 3.5em; height: 3.5em; }
.work-card .recipe-text strong { font-size: calc(var(--fs) * 1.1); line-height: 1.3; }
.work-card .recipe-text > span { font-size: calc(var(--fs) * 0.875); line-height: 1.5; }
.work-card .section-title { gap: 0.4em; font-size: calc(var(--fs) * 1.1); }
.mail-new { position: absolute; right: -0.2em; top: -0.2em; display: grid; place-items: center; width: 1.1em; height: 1.1em; border: 1px solid var(--ink); border-radius: 50%; background: var(--fw-gold); color: var(--ink); }
.mail-new .icon { width: 0.8em; height: 0.8em; }
.weather-choices { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.4em; }
.weather-choice { display: grid; place-items: center; align-content: center; gap: 0.25em; min-width: 0; min-height: 44px; padding: 0.5em 0.2em; border: 1px solid #b49a72; border-radius: 0.7em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; cursor: pointer; }
.weather-choice.current { border: 2px solid var(--fw-accent); background: var(--fw-leaf-soft); font-weight: 700; }
.weather-choice-art { width: 1.6em; height: 1.6em; object-fit: contain; }
.weather-layer { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; opacity: 0.6; }
.weather-layer img { object-fit: contain; }
.scene-night .scene-scenery { filter: brightness(0.62) saturate(0.8); }
.scene-night .scene-stage { filter: brightness(0.85); }
.weather-moon { position: absolute; right: 18%; top: 23%; width: 2em; height: 2em; border-radius: 50%; background: #fff3c4; box-shadow: 0 0 1.5em #fff3c488; }
.weather-sun { position: absolute; width: 3em; height: 3em; right: 18%; top: 23%; }
.weather-cloud { position: absolute; width: 4.5em; height: 3em; left: 12%; top: 24%; animation: fw-cloud-drift 12s ease-in-out infinite alternate; }
.weather-particle { position: absolute; left: var(--weather-x); top: -10%; width: 0.8em; height: 0.8em; animation: fw-weather-fall var(--weather-duration) linear var(--weather-delay) infinite; }
.weather-snow .weather-particle { width: 1em; height: 1em; }
.weather-sprite { width: 100%; height: 100%; }
.scene-stage { z-index: 3; pointer-events: none; }
.scene-stage button { pointer-events: auto; }
.ground-launch, .scene-caption { z-index: 2; }
@keyframes fw-weather-fall { from { transform: translate(0, 0); } to { transform: translate(0.8em, calc(60vh + 4em)); } }
@keyframes fw-cloud-drift { from { transform: translateX(0); } to { transform: translateX(1em); } }
@media (prefers-reduced-motion: reduce) {
  .weather-layer * { animation: none !important; }
  .weather-particle { top: var(--weather-top); opacity: 0.4; }
}

.work-card .facility-text strong { white-space: normal; line-height: 1.3; }
.work-card .facility-entry { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@container (max-width: 360px) {
  .art-sign .top-sub.with-resources .top-row { flex-wrap: wrap; }
  .art-sign .top-sub.with-resources .resources { flex: 1 0 100%; justify-content: flex-end; margin-left: 0; }
}
@media (max-width: 360px) {
  .work-card .facility-entry .outline-button { grid-column: 1 / -1; white-space: normal; }
  .work-card .facility-art, .work-card .facility-image { width: 3.8em; height: 3.8em; }
}

/* Resident boards: picture selection and details remain in one reading flow. */
.resident-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.resident-card { border: 1px solid #c9b18a; gap: 0.4em; padding: 0.45em; box-shadow: none; }
.resident-card.selected { border: 2px solid var(--fw-accent); background: #eef6e2; box-shadow: none; }
.resident-card-main { min-width: 0; gap: 0.4em; }
.card-stage { border: 1px solid #dcc49a; background: #f6ead0; }
.resident-name { font-size: var(--fs); line-height: 1.35; font-weight: 700; }
.resident-field-label { font-size: calc(var(--fs) * 0.8); color: var(--fw-muted); }
.resident-card .status-pill { min-height: 1.8em; font-size: calc(var(--fs) * 0.85); font-weight: 700; border-width: 1px; cursor: inherit; }
.detail-info { gap: 0.5em; }
.detail-name { font-size: calc(var(--fs) * 1.15); line-height: 1.35; }
.detail-actions { gap: 0.5em; }
.detail-action { min-height: 44px; min-width: 0; border: 1px solid #b49a72; padding: 0.45em 0.3em; font-weight: 700; }
.relation-hero .avatar.large { width: 4.5em; height: 4.5em; max-width: 100px; max-height: 100px; }
.hero-label { margin-top: 0; max-width: 100%; overflow-wrap: anywhere; }
.hero-pairs { font-size: calc(var(--fs) * 1.4); line-height: 1.3; overflow-wrap: anywhere; }
.hero-note { font-weight: 500; }
.pair-row { gap: 0.85em; }
.relation-now { border: 1px solid #dcc49a; }
.pair-actions .button { grid-column: auto; min-width: 0; min-height: 44px; padding: 0.45em; font-size: calc(var(--fs) * 0.9); }
.archived-row { flex-wrap: wrap; }
.archived-name { min-width: 0; overflow-wrap: anywhere; }
.art-paper .steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5em; padding: 0.85em; }
.steps .step-arrow { display: none; }
.step-item { flex-direction: column; align-items: center; text-align: center; gap: 0.35em; }
.step-label { font-size: calc(var(--fs) * 0.85); line-height: 1.35; }
.drop-zone { flex-wrap: wrap; text-align: center; }
.drop-text { justify-items: center; }
.target-ribbon { flex-wrap: wrap; justify-content: center; text-align: center; }
.action-art { flex: none; width: 1.2em; height: 1.2em; object-fit: contain; }
.pair-actions .button { flex-wrap: wrap; }
.manage-art { display: block; flex: none; width: 2.3em; height: 2.3em; object-fit: contain; }
.manage-row { gap: 0.7em; padding: 0.65em 0.75em; min-height: 44px; border: 1px solid #dcc49a; }
.manage-title { min-width: 0; overflow-wrap: anywhere; font-weight: 700; }
@media (max-width: 380px) {
  .detail-stage { width: min(100%, 8em); justify-self: center; aspect-ratio: 1; }
  .detail-info { justify-items: center; text-align: center; }
  .detail-info .tag-row { justify-content: center; }
  .pair-actions { grid-template-columns: minmax(0, 1fr); }
  .archived-row .button { width: 100%; }
}

.resident-pages { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 0.4em; align-items: center; }
.resident-pages .button { min-width: 0; width: 100%; min-height: 44px; padding: 0.45em 0.4em; white-space: nowrap; }
.resident-pages > span { text-align: center; }
.starter-list > li:only-child { grid-column: 1 / -1; width: calc(50% - 0.3em); justify-self: center; }
.resident-grid > .resident-card:only-child { grid-column: 1 / -1; width: calc(50% - 0.3em); justify-self: center; }

@container (max-width: 360px) {
  .story-layout .top-sub.with-resources .top-row { flex-wrap: nowrap; }
  .story-layout .top-sub.with-resources .reader-tools { flex: 0 0 auto; margin-left: auto; }
  .story-layout .reader-tools .chip-button { width: 44px; min-height: 44px; padding: 0; justify-content: center; }
  .story-layout .reader-tools .chip-button > span { display: none; }
}

/* Detail panels retain the paper artwork while reserving width for large text. */
.art-paper .sheet { padding: var(--fw-panel-block) var(--fw-panel-inline); }
.sheet { scroll-padding-block: calc(var(--fw-panel-block) + 60px) var(--fw-panel-block); }
.sheet > .sheet-head { position: sticky; top: calc(-1 * var(--fw-panel-block)); z-index: 3; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; padding-block: 12px; background: var(--fw-surface); border-bottom: 1px solid var(--fw-wood-dark); }
.sheet-head .section-title { min-width: 0; margin: 0; font-size: calc(var(--fs) * 1.1); overflow-wrap: anywhere; }
.sheet-head > .button { min-height: 44px; white-space: nowrap; padding: 8px 12px; }
.sheet .stepper.wide:not(.compact) { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; padding: 4px; border: 0; background: transparent; overflow: visible; }
.sheet .stepper.wide:not(.compact) > :nth-child(-n+3) { grid-column: span 2; }
.sheet .stepper.wide:not(.compact) > :nth-child(n+4) { grid-column: span 3; }
.sheet .stepper.wide .step { min-width: 0; min-height: 44px; border: 2px solid var(--ink); border-radius: 8px; white-space: nowrap; }
.sheet .step-value { min-width: 0; display: grid; place-items: center; }
.sheet .protect-row { grid-template-columns: 48px minmax(0, 1fr); grid-template-areas: "tile name" "picker picker" "save save"; padding: var(--fw-inset); gap: 12px; }
.sheet .protect-row > .button { width: 100%; min-height: 44px; white-space: nowrap; }
.sheet .protect-name { min-width: 0; overflow-wrap: anywhere; }
.sheet .profile-identity { gap: 12px; padding: var(--fw-inset); }
.sheet .profile-identity .avatar.large { width: 64px; height: 64px; }
.sheet .profile-identity-text { flex: 1; gap: 6px; }
.sheet .profile-identity-text .outline-button { white-space: nowrap; padding-inline: 8px; }
.sheet .profile-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.sheet .compare-box { padding: var(--fw-inset); }
.sheet .compare-box .button { justify-self: stretch; min-height: 44px; }
.detail-help summary { min-height: 44px; display: list-item; padding-block: 10px; cursor: pointer; }
.detail-help p { margin-block: 8px; }
.memory-text { font-weight: 700; line-height: 1.65; white-space: pre-wrap; }
.memory-filters { display: grid; gap: 8px; }
.sheet select.input { min-height: 44px; width: 100%; min-width: 0; padding: 8px; border: 2px solid var(--ink); border-radius: 8px; background: var(--fw-surface); color: var(--fw-text); font: inherit; }
.art-paper .image-card { padding: var(--fw-panel-block) var(--fw-panel-inline); gap: 16px; }
.image-card .target-ribbon { display: flex; flex-wrap: nowrap; width: 100%; gap: 8px; padding: 8px; margin: 0; }
.image-card .target-ribbon strong { min-width: 0; overflow-wrap: anywhere; font-size: var(--fs); }
.image-card .image-stage { max-height: 220px; }
.image-card .file-facts { overflow-wrap: anywhere; }
.image-card .slider-row { grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; }
.image-card .slider-row .slider { grid-column: 1 / -1; grid-row: 2; width: 100%; min-height: 44px; }
.image-card .rule-actions.even { grid-template-columns: 1fr; }

/* Composition pass: prioritize production state, pictures and a single reading surface. */
.production-summary { display: grid; gap: 12px; padding: var(--fw-inset); background: var(--fw-leaf-soft); border-radius: 12px; }
.production-summary .plan-row { padding: 0; border: 0; background: transparent; }
.production-summary .waiting-guide { margin: 0; }
.production-order { display: grid; gap: 6px; }
.production-slots { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.production-slots li { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border: 1px solid #b9cda8; border-radius: 8px; background: var(--fw-surface-3); font-size: calc(var(--fs) * .85); }
.production-slots:empty::after { content: "\uB4F1\uB85D\uB41C \uC791\uC5C5 \uC5C6\uC74C"; color: var(--fw-muted); }
.recipe-choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.recipe-choice { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; min-width: 0; min-height: 52px; padding: 8px; font: inherit; color: var(--fw-text); background: var(--fw-surface-3); border: 1px solid #b49a72; border-radius: 10px; cursor: pointer; }
.recipe-choice span { overflow-wrap: anywhere; }
.recipe-choice[aria-pressed="true"] { border: 2px solid var(--fw-accent); background: #e6f1dc; }
.resident-card .card-stage { aspect-ratio: 4 / 3; }
.resident-card .tag-row { gap: 0; }
.resident-card .status-pill { width: auto; min-height: 0; padding: 2px 6px; border: 0; background: transparent; color: var(--fw-muted); }
.resident-card .status-pill.done::before { content: "\u2713 "; color: var(--fw-accent); }
.home-layout .strip.story, .home-layout .strip.offline { border-width: 1px; border-color: #bda881; box-shadow: none; }
.home-layout .strip.story .round-arrow { background: transparent; border: 0; }
.profile-panel .compare-box.source { border: 0; background: transparent; padding: 8px 0; }
.story-layout .reader-tools .chip-button { width: 44px; min-height: 44px; padding: 0; justify-content: center; }
.story-layout .reader-tools .chip-button > span { display: none; }
.story-layout .story-stage { border-width: 1px; box-shadow: none; }
.story-layout .ribbon { padding: 0; border: 0; background: transparent; }
.story-layout .conversation-panel { flex: none; display: grid; gap: 8px; min-height: 0; padding: var(--fw-panel-block) var(--fw-panel-inline); border-radius: 12px; background: var(--fw-surface-3); }
.art-paper .conversation-panel { border-image: ${he(F.paperPanel)} 105 154 fill / 20px 28px / 0 stretch; }
.story-layout .conversation-panel .dialogue-box { border: 0; border-image: none; box-shadow: none; border-radius: 0; background: transparent; padding: 0; margin: 0; }
.story-layout .conversation-panel .dialogue-box .line, .story-layout .conversation-panel .dialogue-box .narration { overflow-wrap: anywhere; align-self: start; }
.story-layout .conversation-panel .reader-foot { margin: 0; gap: 8px; }
.story-layout .conversation-panel .reader-foot .count-pill { background: transparent; color: var(--fw-muted); white-space: nowrap; }
.story-layout .conversation-panel .reader-foot .button { min-height: 44px; }

/* Shared narrow layouts: labels and quantities get rows rather than single-character columns. */
.big-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-bottom: 0; }
.big-tab { flex-direction: column; gap: 4px; padding: 10px 6px; min-height: 76px; font-size: var(--fs); border-radius: 12px; border: 1px solid #b49a72; }
.big-tab > .icon { width: 28px; height: 28px; }
.big-tab > span { white-space: nowrap; }
.stock-cards { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.stock-card { display: grid; gap: 12px; padding: var(--fw-inset); border: 1px solid #c9b18a; border-radius: 12px; background: var(--fw-surface-3); min-width: 0; }
.stock-card-head { display: grid; grid-template-columns: 40px minmax(0, 1fr); align-items: center; gap: 8px; }
.stock-card-head strong { overflow-wrap: anywhere; }
.stock-card-head > .item-tile { width: 40px; height: 40px; margin: 0; }
.stock-values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin: 0; }
.stock-values > div { display: grid; align-content: start; gap: 4px; min-width: 0; text-align: center; }
.stock-values dt { font-size: calc(var(--fs) * .8); color: var(--fw-muted); }
.stock-values dd { margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.stock-card > .outline-button { min-height: 44px; width: 100%; white-space: nowrap; }
.auto-sell-head { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 8px; align-items: center; }
.auto-sell-head .switch { grid-column: 2; justify-self: start; }
.auto-sell-head .protect-name { min-width: 0; }
.auto-sell-row .auto-sell-settings { grid-template-columns: minmax(0, 1fr); }
.sheet .row-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.sheet .row-actions > .button { flex: 1 1 140px; min-height: 44px; }
.usage-row { grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; }
.usage-bar { grid-column: 1 / -1; grid-row: 2; }
.usage-size { white-space: nowrap; }
.facility-card .facility { grid-template-columns: minmax(0, 1fr); gap: 12px; }
.facility-card .facility-picture { width: min(100%, 180px); justify-self: center; }
.facility-card .facility-info { min-width: 0; }
.work-card .facility-open { display: flex; flex-wrap: wrap; gap: 8px; }
.work-card .facility-text { flex: 1 1 120px; min-width: 0; }
.home-layout .top-home .top-row:first-child { flex-wrap: wrap; }
.home-layout .top-home .top-row:first-child .resources { flex: 1 0 100%; justify-content: flex-end; }
.home-layout .top-home .resources .chip-button { padding-inline: 8px; min-width: 0; }
.invite-action { min-width: 0; }
@container (min-width: 480px) {
  .home-layout .top-home .top-row:first-child { flex-wrap: nowrap; }
  .home-layout .top-home .top-row:first-child .resources { flex: 0 1 auto; }
}

.stock-values { grid-template-columns: minmax(0, 1fr); }
.stock-values > div { grid-template-columns: minmax(0, 1fr) auto; text-align: left; align-items: center; }
.stock-values dd { white-space: nowrap; text-align: right; }
.auto-sell-head > .item-tile { grid-column: 1; grid-row: 1 / 3; margin: 0; }
.auto-sell-head .protect-name { grid-area: auto; grid-column: 2; grid-row: 1; }
.auto-sell-head .switch { grid-column: 2; grid-row: 2; }
.auto-sell-row .auto-sell-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.draw-short { position: static; transform: none; max-width: 100%; white-space: normal; text-align: center; justify-content: center; }
.draw-button { min-width: 0; }
.setting-row .is-locked { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.setting-row .is-locked > .lock-tag { position: static; }
.top-home .resources .counter { flex: none; }

.home-layout .scene { overflow: hidden; }
.home-layout .page { min-width: 0; }
.auto-sell-row[hidden] { display: none; }

/* Readable management rows and storage figures at 22px text, without nested padding consuming the label. */
.menu-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) 20px; align-items: center; gap: 8px; padding: 12px; min-height: 56px; }
.menu-row .menu-icon, .menu-row > .manage-art { width: 40px; height: 40px; }
.menu-row .menu-chevron, .menu-row > .icon:last-child { max-width: 20px; }
.art-paper .selected-source { padding: var(--fw-panel-block) var(--fw-panel-inline); }
.selected-source .menu-row { padding: 8px; }
.usage-row { grid-template-columns: auto minmax(0, 1fr); }
.usage-label { grid-column: 2; }
.usage-size { grid-column: 2; grid-row: 2; justify-self: end; }
.usage-bar { grid-column: 1 / -1; grid-row: 3; }

.priority-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; }
.priority-main { grid-column: 2 / -1; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 8px; }
.priority-main .priority-name { min-width: 0; }
.priority-main .muted { grid-column: 2; margin-left: 0; }
.priority-row > .chip-toggle { grid-column: 2; justify-self: start; }
.toggle-row { display: grid; grid-template-columns: 32px minmax(0, 1fr); gap: 8px; }
.toggle-row .toggle-icon { grid-column: 1; grid-row: 1; }
.toggle-row .toggle-text { grid-column: 2; grid-row: 1; }
.toggle-row .switch { grid-column: 2; grid-row: 2; }
.candidate { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 8px; min-width: 0; }
.candidate .avatar { width: 56px; height: 56px; grid-column: 1; grid-row: 1 / 4; }
.candidate-name { grid-column: 2; grid-row: 1; min-width: 0; }
.candidate > .tag { grid-column: 2; grid-row: 2; justify-self: start; }
.candidate-state { grid-column: 2; grid-row: 3; }

.restore-details > summary { cursor: pointer; }
.restore-details > summary::after { content: "\u25BE"; margin-left: auto; color: var(--fw-accent); }
.restore-details[open] > summary::after { content: "\u25B4"; }

/* Reserve real space inside the paper artwork; border-image itself consumes no layout width. */
.column { container-type: inline-size; }
.page { gap: clamp(10px, 3cqw, 14px); padding-inline: clamp(10px, 3cqw, 16px); }
.card, .art-paper .card { padding: var(--fw-panel-block) var(--fw-panel-inline); }
.card > .section-title { margin-bottom: 12px; }
.setting-block, .plan-block, .readonly-box, .kit-item, .detail-grid { padding: var(--fw-inset); }
.card > p + p, .card > p + .button, .card > .button + p { margin-top: 10px; }
.profile-panel .compare-box.world { background: transparent; border: 0; padding: 0; }
.profile-prose { display: grid; gap: 1em; line-height: 1.8; }
.profile-prose p, .source-field p { white-space: pre-wrap; }
.profile-edit { margin-top: 16px; display: grid; gap: 10px; }
.profile-edit > summary { cursor: pointer; min-height: 44px; padding-block: 10px; }
.profile-edit .textarea { min-height: 12em; line-height: 1.7; }
.resident-detail { align-items: start; }
.detail-info { gap: 12px; }
.resident-benefits { display: grid; gap: 12px; }
.resident-facts { margin: 0; display: grid; gap: 12px; }
.resident-facts > div { display: grid; gap: 4px; }
.resident-facts dt { color: var(--fw-muted); font-size: .85em; }
.resident-facts dd { margin: 0; line-height: 1.6; }
.detail-card .detail-actions { margin-top: 14px; }
.activity-card { display: grid; gap: 14px; }
.activity-prepare, .activity-running { display: grid; gap: 12px; }
.activity-landscape { width: 100%; max-height: 150px; object-fit: cover; border-radius: 10px; }
.activity-resident { display: flex; align-items: center; gap: 12px; }
.activity-progress { width: 100%; accent-color: var(--fw-accent); }
@container (max-width: 360px) {
  .resident-detail { grid-template-columns: 64px minmax(0,1fr); gap: 10px; }
  .detail-stage { width: 64px; }
  .detail-info { gap: 10px; }
  .detail-info .resident-benefits { grid-column: 1 / -1; }
}
`;var Ia=`
.mail-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; }
.mail-tabs [aria-pressed="true"] { outline: 2px solid var(--fw-accent); }
.mail-list,.letter-detail { display: grid; gap: 0.6em; }
.mail-list .button { text-align: left; min-height: 44px; white-space: normal; }
.letter-body { white-space: pre-wrap; line-height: 1.7; }
.mail-unread { font-size: 12px; }

.guidelines-form { display: grid; gap: 0.5em; }
.guidelines-toggle { display: flex; align-items: center; gap: 0.5em; min-height: 44px; }
.guidelines-toggle input { width: 24px; height: 24px; }
.memory-choices { display: grid; gap: 0.35em; }
.memory-choices .button { min-height: 44px; justify-content: flex-start; text-align: left; font-size: calc(var(--fs) * 0.85); }
.memory-choices [aria-pressed="true"] { outline: 2px solid var(--fw-accent); }
.memory-detail { display: grid; gap: 0.5em; padding: 0.7em; border-radius: 0.8em; background: var(--fw-surface-3); overflow-wrap: anywhere; }
.memory-detail form { display: grid; gap: 0.5em; }

/* \u2500\u2500 Shared: ribbon, figure, avatar, tags \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.ribbon {
  justify-self: center;
  max-width: 100%;
  margin: -0.1em 0 0;
  padding: 0.2em 1.1em;
  border-radius: 0.5em;
  border: var(--line-in) solid var(--ink);
  background: var(--fw-surface);
  color: var(--fw-text);
  font-size: calc(var(--fs) * 0.9);
  font-weight: 700;
  text-align: center;
}
.figure { position: relative; display: block; width: 100%; height: 100%; overflow: hidden; }
.figure-body { position: absolute; bottom: 4%; transform: translateX(-50%); display: flex; align-items: flex-end; justify-content: center; width: 100%; }
.figure-image { display: block; max-width: 100%; max-height: 100%; width: auto; height: 100%; object-fit: contain; object-position: 50% 100%; }
.figure-marker { position: absolute; transform: translate(-50%, 0); display: inline-flex; padding: 0.15em; border-radius: 50%; background: var(--fw-surface-3); color: var(--fw-leaf); border: var(--line-in) solid var(--ink); }
.figure-empty { position: absolute; inset: 0; display: grid; place-items: center; align-content: center; gap: 0.2em; color: #c9ad84; }
.figure-silhouette { width: 45%; max-width: 5em; fill: currentColor; stroke: var(--ink); stroke-width: 3; stroke-linejoin: round; }
.figure-empty-text { padding: 0.05em 0.6em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); font-weight: 800; }
.checker {
  background-color: #f4efe3;
  background-image: linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%),
    linear-gradient(45deg, #e2dccd 25%, transparent 25%, transparent 75%, #e2dccd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
.avatar { position: relative; flex: none; display: inline-grid; place-items: center; width: 3.4em; height: 3.4em; border-radius: 50%; overflow: hidden; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: #c9ad84; }
.avatar.large { width: 6.5em; height: 6.5em; border-width: 3px; }
.avatar-image { width: 100%; height: 100%; object-fit: cover; object-position: 50% 12%; }
.avatar-silhouette { width: 70%; fill: currentColor; stroke: var(--ink); stroke-width: 3; margin-top: 20%; }
.avatar-unknown { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: calc(var(--fs) * 1.3); font-weight: 900; }
.tag-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.3em; }
.tag { position: relative; display: inline-flex; align-items: center; gap: 0.2em; padding: 0.1em 0.65em; border-radius: 999px; border: 2px solid var(--ink); font: inherit; font-size: calc(var(--fs) * 0.78); font-weight: 900; }
.tag.character { background: #d6e7fb; color: #285a93; }
.tag.persona { background: #e9dcfa; color: #6a3f9c; }
.tag.field { background: var(--fw-leaf-soft); color: #3f5b33; cursor: pointer; }
/* On a small tag the lock sits inside, after the word, instead of covering it. */
.tag.is-locked > .lock-tag { position: static; margin-left: 0.15em; border: 0; }
.button.pressed { background: var(--fw-surface-2); box-shadow: none; transform: translateY(0.15em); }
.textarea { width: 100%; min-height: 6em; padding: 0.6em 0.75em; border: var(--line-in) solid var(--ink); border-radius: 0.7em; background: #fffdf6; color: var(--fw-text); font: inherit; line-height: 1.55; resize: vertical; }
.textarea-wrap { position: relative; display: grid; }
.textarea-wrap .textarea { padding-bottom: 1.8em; }
.textarea-wrap .counter-text { position: absolute; right: 0.75em; bottom: 0.45em; }
.counter-text { justify-self: end; color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); font-variant-numeric: tabular-nums; }
.subhead { margin: 0.3em 0 0; font-size: calc(var(--fs) * 1.05); font-weight: 900; }
.empty-state { display: grid; justify-items: center; gap: 0.3em; padding: 1.2em 0.5em; text-align: center; }
.rule-actions.even { grid-template-columns: 1fr 1fr; }
.rule-actions.even .button { justify-self: stretch; }

/* \u2500\u2500 \uC8FC\uBBFC (03-1) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.search-bar { display: flex; align-items: center; gap: 0.5em; padding: 0.45em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); flex-wrap: wrap; }
.search-field { flex: 1 1 10em; display: flex; align-items: center; gap: 0.45em; min-width: 0; padding: 0 0.7em; border-radius: 0.7em; background: var(--fw-surface-2); color: var(--fw-wood-dark); }
.search-input { flex: 1; min-width: 0; min-height: 2.6em; border: 0; background: none; color: var(--fw-text); font: inherit; outline: none; }
.icon-button.filter.active { background: var(--fw-accent); color: var(--fw-on-accent); }
.filter-chip { padding: 0.1em 0.7em; border-radius: 999px; background: var(--fw-leaf-soft); color: #3f5b33; font-size: calc(var(--fs) * 0.8); font-weight: 800; }
.pill-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.pill-tabs.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.pill-tab { min-height: 2.6em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-2); color: var(--fw-text); font: inherit; font-weight: 800; cursor: pointer; }
.pill-tab.current { background: #4f8f6e; color: #fff; box-shadow: 0 0.15em 0 var(--ink); }
.resident-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 0.4em; }
.resident-list-open { display: flex; align-items: center; gap: 0.65em; width: 100%; min-height: 4.2em; padding: 0.35em 0.55em; border: var(--line-in) solid var(--ink); border-radius: 0.8em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.resident-list-copy { display: grid; flex: 1; min-width: 0; line-height: 1.3; }
.resident-list-copy strong { overflow-wrap: anywhere; }
.resident-list-copy span { color: var(--fw-muted); font-size: calc(var(--fs) * 0.85); }
.resident-pages { display: flex; align-items: center; justify-content: space-between; gap: 0.5em; }
.resident-pages .outline-button { min-width: 4em; }
.residents-back { justify-self: start; }
.resident-card { display: grid; justify-items: center; gap: 0.4em; padding: 0.5em 0.5em 0.65em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); min-width: 0; }
.resident-card.selected { background: #eef6e2; box-shadow: 0 0 0 var(--line-in) #4f8f6e, var(--drop); }
.resident-card-main { display: grid; justify-items: center; gap: 0.35em; width: 100%; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.card-stage { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #f6ead0; overflow: hidden; }
.resident-name { font-size: calc(var(--fs) * 1.02); font-weight: 900; text-align: center; overflow-wrap: anywhere; }
.status-pill { position: relative; display: inline-flex; justify-content: center; align-items: center; width: 100%; min-height: 2.3em; padding: 0.2em 0.5em; border-radius: 0.75em; border: var(--line-in) solid var(--ink); font: inherit; font-weight: 900; }
.status-pill.done { background: #3f7c5e; color: #fff; }
.status-pill.waiting { background: var(--fw-surface-2); color: var(--fw-muted); border: var(--line-in) dashed var(--ink); cursor: pointer; }
.detail-card { gap: 0.8em; }
.resident-detail { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 0.75em; align-items: center; }
.detail-stage { display: block; aspect-ratio: 1; border-radius: 0.85em; border: var(--line-in) solid var(--ink); overflow: hidden; background: #f6ead0; }
.detail-info { display: grid; gap: 0.4em; min-width: 0; justify-items: start; }
.detail-info .tag-row { justify-content: flex-start; }
.detail-name { font-size: calc(var(--fs) * 1.2); font-weight: 900; overflow-wrap: anywhere; }
.detail-locked { width: 100%; gap: 0.2em; padding: 0.5em; background: var(--fw-surface-2); }
.passive, .breakthrough { display: flex; align-items: center; gap: 0.35em; flex-wrap: wrap; }
.leaf-pips { display: inline-flex; gap: 0.2em; }
.pip { width: 0.85em; height: 1em; border-radius: 0 75% 0 75%; border: 2px solid var(--ink); background: var(--fw-surface-2); }
.detail-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.4em; }
.detail-action { display: flex; align-items: center; justify-content: center; gap: 0.35em; min-height: 3em; padding: 0.3em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 800; cursor: pointer; }
.detail-action .icon { color: var(--fw-wood-dark); }

.ground-launch { position: absolute; right: 0.6em; bottom: 0.5em; z-index: 4; min-height: 44px; }
.ground-overlay { position: absolute; inset: 0; z-index: 5; }
.ground-selection { position: absolute; border: 3px dashed #fff; outline: 2px solid #286c4b; background: #4f8f6e55; }
.ground-caption { position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); padding: 0.2em 0.4em; white-space: nowrap; color: #fff; background: #286c4b; font-size: 12px; }
.ground-handle { position: absolute; width: 44px; height: 44px; border: 2px solid #286c4b; border-radius: 50%; color: #243d2c; background: #fff8e8; font: inherit; font-weight: 900; touch-action: none; cursor: grab; padding: 0; }
.ground-handle.left { left: 0; top: 50%; transform: translate(-50%, -50%); }
.ground-handle.right { right: 0; top: 50%; transform: translate(50%, -50%); }
.ground-handle.top { left: 50%; top: 0; transform: translate(-50%, -50%); }
.ground-handle.bottom { left: 50%; bottom: 0; transform: translate(-50%, 50%); }
.editing-ground .resident-spot { pointer-events: none; }
.editing-ground .resident-spot:not(.filled) { visibility: hidden; }
.editing-ground .resident-spot.filled, .editing-ground .resident-spot.filled .figure { animation-play-state: paused; }
.ground-actions { grid-column: 1 / -1; display: grid; gap: 0.4em; font-size: calc(var(--fs) * 0.85); }
.ground-action-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0.3em; }
.ground-action-row .button { min-width: 0; min-height: 44px; padding: 0.3em; }
/* Foot positions follow the saved world's ground rectangle. */
.ground-stage .resident-spot { position: absolute; transform: translate(-50%, -100%); top: 65%; }
.ground-stage .resident-spot.left { left: 22%; }
.ground-stage .resident-spot.right { left: 78%; }
.ground-stage .resident-spot.filled.left { animation: fw-ground-left 18s ease-in-out infinite; }
.ground-stage .resident-spot.filled.right { animation: fw-ground-right 18s ease-in-out infinite; }
@keyframes fw-ground-left { 0%, 20%, 95%, 100% { left: 22%; top: 65%; } 45%, 70% { left: 40%; top: 35%; } }
@keyframes fw-ground-right { 0%, 20%, 95%, 100% { left: 78%; top: 40%; } 45%, 70% { left: 60%; top: 65%; } }
@media (prefers-reduced-motion: reduce) { .ground-stage .resident-spot.filled.left, .ground-stage .resident-spot.filled.right { animation: none; } }
/* Home scene: residents standing in their places. */
.resident-spot.filled { width: 8.5em; height: 11em; border: 0; border-radius: 0; background: none; }
.resident-spot.filled.left { animation: fw-stroll-left 12s ease-in-out infinite; }
.resident-spot.filled.right { animation: fw-stroll-right 15s ease-in-out infinite; }
@keyframes fw-stroll-left { 0%, 20%, 95%, 100% { transform: translate(0, 0); } 45%, 70% { transform: translate(2.5em, 0); } }
@keyframes fw-stroll-right { 0%, 20%, 95%, 100% { transform: translate(0, 0); } 45%, 70% { transform: translate(-2.5em, 0); } }
@media (prefers-reduced-motion: reduce) { .resident-spot.filled.left, .resident-spot.filled.right { animation: none; } }
@keyframes fw-facing-left { 0%, 69% { transform: scaleX(1); } 70%, 94% { transform: scaleX(-1); } 95%, 100% { transform: scaleX(1); } }
@keyframes fw-facing-right { 0%, 69% { transform: scaleX(-1); } 70%, 94% { transform: scaleX(1); } 95%, 100% { transform: scaleX(-1); } }
.resident-spot.filled .figure { position: absolute; inset: 0; }
.resident-spot.filled.left .figure { animation: fw-facing-left 18s step-end infinite; }
.resident-spot.filled.right .figure { animation: fw-facing-right 18s step-end infinite; }
@media (prefers-reduced-motion: reduce) { .resident-spot.filled.left .figure, .resident-spot.filled.right .figure { animation: none; } }
.spot-name { position: absolute; left: 50%; bottom: -0.4em; transform: translateX(-50%); padding: 0.05em 0.6em; border-radius: 999px; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); font-size: calc(var(--fs) * 0.78); font-weight: 800; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
.resident-spot.invite { border-style: solid; background: var(--fw-surface-3); color: var(--fw-accent); box-shadow: var(--drop); }
.resident-spot.invite .spot-text { margin: 0 0.4em 0.6em; text-align: center; }

/* \u2500\u2500 \uD504\uB85C\uD544 sheet \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5em; }
.profile-identity { display: flex; align-items: center; gap: 0.8em; padding: 0.6em; border-radius: 0.9em; background: var(--fw-surface-3); }
.profile-identity-text { display: grid; gap: 0.2em; min-width: 0; }
.profile-identity-text strong { overflow-wrap: anywhere; font-size: calc(var(--fs) * 1.1); }
.profile-identity-text .outline-button { min-height: 44px; justify-content: center; }
.profile-tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35em; }
.profile-tab { min-height: 44px; padding: 0.3em; border: 2px solid var(--ink); border-radius: 0.6em; background: var(--fw-surface-3); color: var(--fw-text); font: inherit; font-weight: 700; cursor: pointer; }
.profile-tab[aria-pressed="true"] { background: var(--fw-accent); color: var(--fw-on-accent); }
.profile-panel[hidden] { display: none; }
.compare { display: grid; gap: 0.6em; }
.compare-box { display: grid; gap: 0.4em; padding: 0.7em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); }
.compare-box.source { background: var(--fw-surface-2); }
.compare-box.world { background: var(--fw-leaf-soft); }
.compare-box .button { justify-self: end; }
.compare-title { display: flex; align-items: center; gap: 0.35em; font-weight: 900; }
.source-field { display: grid; gap: 0.1em; }
.source-field p { white-space: pre-wrap; font-size: calc(var(--fs) * 0.9); }
.source-details { display: block; }
.source-details summary { cursor: pointer; min-height: 2.75em; }
.source-details[open] > :not(summary) { margin-top: 0.6em; }
.sheet-head { flex-wrap: wrap; }
.sheet-head .section-title { flex: 1 1 10em; }

/* \u2500\u2500 \uAD00\uACC4 (03-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.hero-card { padding-top: 1.2em; }
.relation-hero { display: grid; justify-items: center; gap: 0.35em; text-align: center; }
.hero-label { margin-top: -0.9em; padding: 0.1em 0.9em; border-radius: 0.5em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); font-weight: 800; z-index: 1; }
.hero-pairs { color: var(--fw-wood-dark); font-size: calc(var(--fs) * 1.8); font-weight: 900; letter-spacing: 0.02em; }
.hero-note { font-weight: 700; }
.pair-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6em; }
.pair-row { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); align-items: center; gap: 0.6em; }
.pair-faces { display: grid; justify-items: center; gap: 0.25em; }
.pair-letters { display: inline-flex; align-items: center; gap: 0.3em; color: var(--fw-muted); font-weight: 800; }
.letter { display: inline-grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff4dc; font-weight: 900; }
.faces { display: inline-flex; align-items: center; gap: 0.15em; }
.faces .avatar { width: 3em; height: 3em; }
.times { color: var(--fw-wood-dark); font-weight: 900; }
.partner-name { font-weight: 800; text-align: center; overflow-wrap: anywhere; font-size: calc(var(--fs) * 0.9); }
.pair-info { display: grid; gap: 0.45em; min-width: 0; }
.relation-now { display: grid; padding: 0.4em 0.7em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); }
.relation-now small { color: var(--fw-muted); font-size: calc(var(--fs) * 0.75); }
.relation-now strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.recent { display: flex; align-items: center; gap: 0.5em; flex-wrap: wrap; font-size: calc(var(--fs) * 0.9); }
.recent-label { padding: 0.05em 0.6em; border-radius: 0.5em; background: var(--fw-surface-2); color: var(--fw-muted); font-size: calc(var(--fs) * 0.8); }
.pair-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.35em; }
.pair-actions .outline-button { justify-content: center; min-height: 2.5em; padding: 0.2em 0.3em; gap: 0.2em; font-size: calc(var(--fs) * 0.82); white-space: nowrap; }
.pair-actions .outline-button .icon { display: none; }
.pair-actions .button { grid-column: 1 / -1; justify-self: stretch; }
.notice-strip { display: flex; align-items: center; justify-content: center; gap: 0.5em; padding: 0.5em 1em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); font-weight: 700; text-align: center; }
.bang { display: inline-grid; place-items: center; width: 1.6em; height: 1.6em; border-radius: 50%; background: var(--fw-wood-dark); color: #fff; font-weight: 900; }
.archived-list, .candidate-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4em; }
.archived-row { display: flex; align-items: center; gap: 0.6em; padding: 0.4em; border-radius: 0.7em; background: var(--fw-surface-3); }
.archived-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.candidate { display: flex; align-items: center; gap: 0.6em; width: 100%; padding: 0.45em 0.6em; border-radius: 0.8em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; text-align: left; cursor: pointer; }
.candidate:disabled { opacity: 0.6; cursor: not-allowed; }
.candidate-name { flex: 1; min-width: 0; font-weight: 800; overflow-wrap: anywhere; }
.candidate-state { color: var(--fw-accent); font-weight: 800; font-size: calc(var(--fs) * 0.85); }

/* \u2500\u2500 \uC8FC\uBBFC \uB4F1\uB85D (05-3) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.steps { list-style: none; margin: 0; display: flex; align-items: center; justify-content: space-between; gap: 0.3em; padding: 0.7em 0.8em; }
.step-item { display: flex; align-items: center; gap: 0.35em; min-width: 0; }
.step-number { flex: none; display: inline-grid; place-items: center; width: 2em; height: 2em; border-radius: 50%; border: var(--line-in) solid var(--ink); color: var(--fw-wood-dark); font-weight: 900; }
.step-item.current .step-number { background: var(--fw-accent); color: #fff; }
.step-item.done .step-number { background: var(--fw-leaf-soft); border-color: var(--fw-leaf); color: #3f5b33; }
.step-label { font-weight: 900; font-size: calc(var(--fs) * 0.92); white-space: nowrap; }
.step-arrow { color: var(--fw-muted); font-weight: 800; }
.source-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.source-pages { display: grid; gap: 0.5em; }
.source-row .menu-detail { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.source-row:disabled { opacity: 0.65; cursor: default; }
.selected-source { padding: 0.5em; }
.selected-source .menu-row { border: 0; background: none; }
.rebuild { gap: 0.65em; }
.readonly-box { padding: 0.6em 0.8em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); white-space: pre-wrap; }
.image-drop { display: grid; gap: 0.5em; }
.drop-zone { display: flex; align-items: center; justify-content: center; gap: 0.8em; min-height: 6.5em; padding: 0.8em; border-radius: 0.8em; border: var(--line-in) dashed var(--ink); cursor: pointer; }
.drop-zone:focus-within { outline: 3px solid var(--fw-accent); outline-offset: 2px; }
.drop-icon { width: 3em; height: 3em; color: var(--fw-wood-dark); }
.drop-preview { max-height: 6em; max-width: 40%; object-fit: contain; }
.drop-text { display: grid; gap: 0.1em; min-width: 0; }
.drop-text strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; overflow-wrap: anywhere; }
.drop-text span { color: var(--fw-muted); }
.starter-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6em; }
.starter-option { display: grid; justify-items: center; gap: 0.3em; width: 100%; padding: 0.5em; border-radius: 0.9em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); color: var(--fw-text); font: inherit; cursor: pointer; }
.starter-option.chosen { border-color: var(--fw-accent); box-shadow: var(--drop); }
.starter-stage { display: block; width: 100%; aspect-ratio: 4 / 5; border-radius: 0.75em; border: var(--line-in) solid var(--ink); background: #f6ead0; overflow: hidden; }

/* \u2500\u2500 \uC8FC\uBBFC \uADF8\uB9BC (04-2) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.image-card { gap: 0.7em; }
.target-ribbon { justify-self: center; display: inline-flex; align-items: center; gap: 0.5em; margin-top: -0.2em; padding: 0.3em 1.2em; border-radius: 0.6em; border: var(--line-in) solid var(--ink); background: var(--fw-surface); }
.target-ribbon .icon { color: var(--fw-leaf); }
.target-ribbon strong { font-size: calc(var(--fs) * 1.1); font-weight: 900; }
.image-stage { display: block; aspect-ratio: 4 / 3.4; border-radius: 0.8em; border: var(--line-in) solid var(--ink); overflow: hidden; }
.file-facts { display: grid; justify-items: center; gap: 0.1em; padding: 0.5em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); text-align: center; }
.file-facts strong { overflow-wrap: anywhere; }
.file-button { cursor: pointer; }
.file-button.busy { opacity: 0.6; cursor: progress; }
.rules { margin: 0; padding: 0.6em 0.8em 0.6em 2em; border-radius: 0.7em; border: var(--line-in) solid var(--ink); background: var(--fw-surface-3); display: grid; gap: 0.15em; font-size: calc(var(--fs) * 0.9); }
.sliders { gap: 0.2em; }
.sliders .setting-row + .setting-row { border-top: var(--line-in) solid var(--ink); padding-top: 0.4em; }
.sliders .icon { color: var(--fw-wood-dark); }
.history-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
.history-item { display: flex; align-items: center; gap: 0.6em; padding: 0.45em; border-radius: 0.8em; background: var(--fw-surface-3); flex-wrap: wrap; }
.history-thumb { flex: none; display: grid; place-items: center; width: 3.6em; height: 3.6em; border-radius: 0.5em; overflow: hidden; }
.history-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }

@media (max-width: 380px) {
  .resident-detail { grid-template-columns: 1fr; }
  .detail-stage { aspect-ratio: 4 / 3; }
  .pair-row { grid-template-columns: 1fr; }
  .steps { flex-wrap: wrap; justify-content: center; }
  .step-arrow { display: none; }
  .detail-action { flex-direction: column; gap: 0.1em; font-size: calc(var(--fs) * 0.85); }
}
`,Ca=`
.resident-touch { position:absolute; inset:0; width:100%; height:100%; border:0; padding:0; background:none; cursor:pointer; color:inherit; }
.scene-stage .resident-touch { pointer-events:none; }
.resident-touch .figure-body, .resident-touch .figure-empty > * { pointer-events:auto; }
.resident-touch:focus-visible { outline:3px solid var(--fw-accent); border-radius:1em; }
.ground-stage .resident-spot.filled.left, .ground-stage .resident-spot.filled.right, .ground-stage .resident-spot.filled .figure, .ground-stage .resident-spot.filled .figure-body { animation-delay:-4s; }
.resident-spot .figure-body { transform-origin:50% 100%; animation:fw-footsteps 18s linear infinite; }
.resident-reaction { position:absolute; z-index:5; bottom:55%; left:65%; display:grid; justify-items:center; gap:.25em; padding:0; border:0; background:transparent; pointer-events:none; }
.resident-spot.right .resident-reaction { left:auto; right:65%; }
.resident-reaction[hidden] { display:none; }
.resident-greeting { width:2.1em; height:2.1em; object-fit:contain; font-size:1.4em; color:var(--fw-accent); }
@keyframes fw-greeting { 0%,100% { transform:translateX(-50%) scale(1); } 35% { transform:translateX(-50%) scale(1.06,.94); } 65% { transform:translateX(-50%) translateY(-4%) scale(.97,1.03); } }
@keyframes fw-footsteps { 0%,20%,45%,70%,95%,100% { transform:translateX(-50%) scale(1); }
22%,26%,30%,34%,38%,42%,72%,76%,80%,84%,88%,92% { transform:translateX(-50%) translateY(-3%) scale(.98,1.02); }
24%,28%,32%,36%,40%,44%,74%,78%,82%,86%,90%,94% { transform:translateX(-50%) scale(1.025,.975); } }
.editing-ground .figure-body { animation-play-state:paused; }
@media (prefers-reduced-motion:reduce) { .resident-spot .figure-body, .resident-spot.reacting .figure-body { animation:none; } }
`;var Ra="marinara-capability-forest-workshop",kt=class extends HTMLElement{constructor(){super();V(this,"root");V(this,"controller",null);V(this,"diagnostics",null);V(this,"unsubscribe",null);V(this,"styleNode",document.createElement("style"));V(this,"renderedRoute",null);V(this,"renderedPage",null);V(this,"ticker");V(this,"resizeObserver",new ResizeObserver(()=>this.measureStory()));V(this,"refreshedEnds",new Set);V(this,"onPresence",()=>{document.hidden&&this.controller?.pauseAutoReading(),this.controller?.heartbeat()});V(this,"onFullscreenGesture",()=>{document.fullscreenElement||!document.fullscreenEnabled||this.requestFullscreen?.().catch(()=>{})});V(this,"onBlur",()=>this.controller?.pauseAutoReading());V(this,"presentWorld",null);V(this,"environmentKey","");this.root=this.attachShadow({mode:"open"}),this.styleNode.textContent=xa+ka+Ia+Na+Sa+$a+Ca}connectedCallback(){this.controller||(this.controller=cr(),this.diagnostics=new He,this.controller.start()),this.unsubscribe?.(),this.unsubscribe=this.controller.store.subscribe(a=>this.render(a)),this.render(this.controller.store.get()),document.fonts?.ready.then(()=>{this.isConnected&&this.controller&&this.render(this.controller.store.get())}),this.addEventListener("pointerdown",this.onFullscreenGesture),this.resizeObserver.observe(this),this.controller.startHeartbeat(),document.addEventListener("visibilitychange",this.onPresence),window.addEventListener("focus",this.onPresence),window.addEventListener("blur",this.onBlur),clearInterval(this.ticker),this.ticker=setInterval(()=>{this.tick(),this.controller?.refreshWeather()},1e3)}disconnectedCallback(){this.removeEventListener("pointerdown",this.onFullscreenGesture),this.resizeObserver.disconnect(),this.unsubscribe?.(),this.unsubscribe=null,this.controller?.stopHeartbeat(),this.controller?.pauseAutoReading(),document.removeEventListener("visibilitychange",this.onPresence),window.removeEventListener("focus",this.onPresence),window.removeEventListener("blur",this.onBlur),clearInterval(this.ticker)}tick(){let a=this.controller?.store.get();if(a){let n=`${K(a)}:${le(a).phase}`;n!==this.environmentKey&&(this.environmentKey=n,this.controller?.store.set({}))}let i=Date.now();for(let n of this.root.querySelectorAll("[data-countdown-end]")){let o=Number(n.dataset.countdownEnd);n.textContent=be(o-i),o<=i&&!this.refreshedEnds.has(n.dataset.countdownEnd)&&(this.refreshedEnds.add(n.dataset.countdownEnd),setTimeout(()=>{this.controller?.refreshProduction()},1500))}for(let n of this.root.querySelectorAll("[data-progress-end]")){let o=Number(n.dataset.progressEnd),s=Math.max(1,Number(n.dataset.progressTotal));n.style.width=`${Math.min(100,Math.max(0,Math.round((s-Math.max(0,o-i))/s*100)))}%`}}screen(a,i){switch(a.route){case"home":return Or(a,i);case"work":return ha(a,i);case"facilities":return ma(a,i);case"settings":return sa(a,i);case"backup":return oa(a,i);case"residents":return aa(a,i);case"relations":return Qr(a,i);case"register":return Ur(a,i);case"resident-image":return ea(a,i);case"invite":return Fr(a,i);case"explore":return qr(a,i);case"story":return Hr(a,i);case"diagnostics":return this.diagnostics.start(),T(a,i,{top:{kind:"sub",title:"\uC5F0\uACB0 \uC810\uAC80",back:{route:"backup",label:"\uC800\uC7A5\xB7\uBC31\uC5C5"},resources:!1},backdrop:"wood",body:[this.diagnostics.node],nav:!0});default:return ya(a,i)}}measureStory(){let a=this.controller?.store.get().reader;if(!a||a.story.state!=="ready"||this.controller?.store.get().route!=="story")return;let i=a.story.value.segments[a.index];if(!i||i.kind==="choice")return;let n=this.root.querySelector(".story-layout .dialogue-box:not(.choice)");if(!n)return;let o=sr(n,i.text);o&&this.controller?.setStoryTextPages(a.storyId,a.index,o)}render(a){let i=a.world?.state==="ready"?a.world.value.worldId:null;i&&i!==this.presentWorld&&(this.presentWorld=i,queueMicrotask(()=>{this.controller?.heartbeat()}));let n=this.screen(a,this.controller);this.style.setProperty("--fw-font-size",`${a.fontSize}px`);let o=this.root.activeElement,s=o?.id,l=o&&"selectionStart"in o&&typeof o.selectionStart=="number"?[o.selectionStart,o.selectionEnd??o.selectionStart]:null,p=mr(a),d=a.route===this.renderedRoute&&p===this.renderedPage?this.root.querySelector(".scroll")?.scrollTop??0:0,c=this.root.querySelector(".scene[data-home-scene]"),m=n.querySelector(".scene[data-home-scene]"),u=[];if(c&&m&&c.dataset.homeScene===m.dataset.homeScene){for(let w of c.querySelectorAll(".resident-spot, .figure, .figure-body"))for(let v of w.getAnimations())v instanceof CSSAnimation&&typeof v.currentTime=="number"&&u.push({node:w,name:v.animationName,time:v.currentTime});m.replaceWith(c)}this.root.replaceChildren(this.styleNode,n);for(let w of u)for(let v of w.node.getAnimations())v instanceof CSSAnimation&&v.animationName===w.name&&(v.currentTime=w.time);this.renderedRoute=a.route,this.renderedPage=p;let f=this.root.querySelector(".scroll");if(f&&(f.scrollTop=d),this.measureStory(),s){let w=this.root.getElementById(s);if(w?.focus({preventScroll:!0}),w&&l&&typeof w.setSelectionRange=="function")try{w.setSelectionRange(l[0],l[1])}catch{}}}};typeof customElements<"u"&&!customElements.get(Ra)&&customElements.define(Ra,kt);

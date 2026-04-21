import { useState, useRef, useEffect } from "react";

const LH_WEBHOOK = "https://your-webhook-url-here.com/api/leads";
const BRAND = { agent:"Murat İyicioğlu", company:"Turyap Queen", tagline:"Gayrimenkul Danışmanlığı" };

/* ══ QUESTIONS ══════════════════════════════════════════════ */
const BQ = [
  {id:"b1",ph:1,top:"YAŞAM TARZI",w:2.0,q:"Yeni evinizin çevresinde en önemli kriter hangisi?",
   o:[{v:"A",w:[10,2,0,3],t:"Merkezi, prestijli ve ulaşımı kolay bir adres"},
      {v:"B",w:[2,10,2,0],t:"Sosyal hayatın canlı, enerjinin yüksek olduğu mahalle"},
      {v:"C",w:[0,2,10,2],t:"Sakin, huzurlu ve güvenli; gürültüden uzak semt"},
      {v:"D",w:[2,0,2,10],t:"Uzun vadede değer kazanan, yatırım potansiyeli yüksek bölge"}]},
  {id:"b2",ph:1,top:"İLETİŞİM TERCİHİ",w:2.0,q:"Danışmanınızla nasıl bir iletişim tarzı tercih edersiniz?",
   o:[{v:"A",w:[10,2,0,2],t:"Hızlı ve net; kısa mesajlar, direkt bilgi, zaman kaybı yok"},
      {v:"B",w:[2,10,3,0],t:"Samimi ve enerjik; aramalar, sohbet, pozitif atmosfer"},
      {v:"C",w:[0,3,10,2],t:"Sabırlı ve anlayışlı; acele etmeden, güven vererek ilerlesin"},
      {v:"D",w:[2,0,2,10],t:"Detaylı ve belgeli; her bilgi yazılı, kayıt altında olsun"}]},
  {id:"b3",ph:1,top:"BÜTÇE YAKLAŞIMI",w:2.0,q:"Bütçenizi belirlerken nasıl bir yol izlersiniz?",
   o:[{v:"A",w:[10,2,0,3],t:"Stratejik düşünürüm; doğru fırsatta hızlı ve kararlı hareket ederim"},
      {v:"B",w:[3,10,2,0],t:"Doğru hissi yakaladığımda bütçemi zorlayabilirim"},
      {v:"C",w:[0,2,10,3],t:"Belirlediğim limitten çıkmam; güvenli ve riski minimum tutarım"},
      {v:"D",w:[2,0,3,10],t:"Emsal fiyatları analiz eder, mantıksal karşılaştırmayla karar veririm"}]},
  {id:"b4",ph:1,top:"KARAR HIZI",w:2.0,q:"Beğendiğiniz bir ev için ne kadar sürede karar verebilirsiniz?",
   o:[{v:"A",w:[10,3,0,2],t:"24 saat içinde; doğru seçenekse uzatmam gerek yok"},
      {v:"B",w:[2,10,3,0],t:"Birkaç gün; hissi oturtmak ve yakınlarımla paylaşmak isterim"},
      {v:"C",w:[0,3,10,2],t:"Acelemi yok; her detayı rahatça inceledikten sonra karar veririm"},
      {v:"D",w:[2,0,2,10],t:"Kapsamlı karşılaştırma gerekiyor; 1-2 hafta sürebilir"}]},
  {id:"b5",ph:2,top:"AİLE & ÇEVRE",w:1.5,q:"Satın alma kararında aile veya yakınlarınızın rolü nedir?",
   o:[{v:"A",w:[10,2,0,2],t:"Kararı ben veririm; başkasının onayına ihtiyacım yok"},
      {v:"B",w:[2,10,4,0],t:"Ailemle paylaşırım ama his ve enerji kararımı şekillendirir"},
      {v:"C",w:[0,4,10,2],t:"Ailenin mutabık olması önemli; birlikte karar vermeyi tercih ederim"},
      {v:"D",w:[2,0,2,10],t:"Uzman görüşleri ve veriler belirleyicidir; aileyle de konuşurum"}]},
  {id:"b6",ph:2,top:"EV ÖNCELİĞİ",w:1.5,q:"Bir evi gerçekten değerli yapan en önemli unsur sizin için nedir?",
   o:[{v:"A",w:[10,2,0,4],t:"Lokasyon, yeniden satış değeri ve yatırım getirisi"},
      {v:"B",w:[0,10,4,0],t:"Tasarım, ışık, atmosfer — içine girince güzel hissettirmesi"},
      {v:"C",w:[0,4,10,2],t:"Güvenlik, mahalle dokusu ve komşuluk kalitesi"},
      {v:"D",w:[3,0,2,10],t:"Yapı kalitesi, teknik belgeler ve uzun ömürlülük"}]},
  {id:"b7",ph:2,top:"ZİYARET TERCİHİ",w:1.5,q:"Ev gezerken nasıl bir süreç tercih edersiniz?",
   o:[{v:"A",w:[10,2,0,2],t:"Hızlı ve verimli; kısa sürede birkaç yeri görmek"},
      {v:"B",w:[0,10,3,0],t:"Keyifli ve kişisel; her evi hissederek, hikayesini dinleyerek"},
      {v:"C",w:[0,3,10,2],t:"Sakin ve planlı; aceleci atmosfer istemiyorum"},
      {v:"D",w:[2,0,2,10],t:"Teknik detaylar (m², tapu, aidat) önceden elimde olsun"}]},
  {id:"b8",ph:2,top:"ENDİŞE NOKTASI",w:2.0,q:"Satın alma sürecinde sizi en çok ne yavaşlatır?",
   o:[{v:"A",w:[10,2,0,2],t:"Gereksiz bürokratik süreçler ve uzayan zaman çizelgeleri"},
      {v:"B",w:[2,10,3,0],t:"Soğuk, resmi ve enerjisiz bir atmosfer"},
      {v:"C",w:[0,3,10,2],t:"Baskı ve acelecilik; rahat düşünme ortamı istemek"},
      {v:"D",w:[2,0,2,10],t:"Doğrulanamayan bilgiler ve eksik belgeler"}]},
  {id:"b9",ph:3,top:"SEÇENEK SAYISI",w:1.0,q:"Karar vermeden önce kaç farklı seçenek görmeyi tercih edersiniz?",
   o:[{v:"A",w:[10,2,0,2],t:"Az ama öz; 1-3 iyi seçenek yeterli"},
      {v:"B",w:[2,10,3,2],t:"Birkaçını görmek isterim; hissimi karşılaştırmak için"},
      {v:"C",w:[0,3,10,2],t:"Ne kadar çok görürsem o kadar iyi; acele etmem"},
      {v:"D",w:[2,0,2,10],t:"Sistematik karşılaştırma yaparım; 5-10 seçenek görebilirim"}]},
  {id:"b10",ph:3,top:"MÜZAKERE TARZI",w:2.0,q:"Fiyat veya koşullarda bir anlaşmazlık olursa nasıl yaklaşırsınız?",
   o:[{v:"A",w:[10,2,0,3],t:"Net ve direkt; pazarlık kısa ve hızlı bitsin"},
      {v:"B",w:[2,10,4,0],t:"İlişkiyi koruyarak, sıcak bir diyalogla çözüm ararım"},
      {v:"C",w:[0,4,10,2],t:"Uzlaşma yolunu tercih ederim; tartışmaktan kaçınırım"},
      {v:"D",w:[3,0,2,10],t:"Verilere dayalı argümanla mantıksal ikna ederim"}]},
  {id:"b11",ph:3,top:"BİLGİ ALMA",w:1.5,q:"Danışmanınızdan nasıl bilgi almayı tercih edersiniz?",
   o:[{v:"A",w:[10,2,0,3],t:"Kısa ve öz; sadece önemli gelişmeler, gereksiz detay yok"},
      {v:"B",w:[2,10,4,0],t:"Düzenli ve samimi; süreçte olan her şeyi paylaşsın"},
      {v:"C",w:[0,4,10,2],t:"Haftalık özet; ne var ne yok bilmek isterim, paniksiz"},
      {v:"D",w:[2,0,2,10],t:"Detaylı ve belgeli raporlar; her veriyi kayıt altında görmek"}]},
  {id:"b12",ph:3,top:"KARAR ANI",w:2.0,q:"Satın alma kararını verdiğinizde nasıl hissedersiniz?",
   o:[{v:"A",w:[10,3,0,2],t:"Rahatım; hızlı karar verebiliyorsam doğru olandır"},
      {v:"B",w:[2,10,3,0],t:"Heyecan verici; bu anı paylaşmak isterim"},
      {v:"C",w:[0,3,10,3],t:"Son kez gözden geçiririm; her şey yerli yerinde mi kontrol ederim"},
      {v:"D",w:[2,0,3,10],t:"Tüm verileri son kez doğrular, sonra net kararımı veririm"}]},
];

const SQ = [
  {id:"s1",ph:1,top:"SATIŞ YÖNETİMİ",w:2.0,q:"Evinizin satış sürecini nasıl yönetilmesini istersiniz?",
   o:[{v:"A",w:[10,2,0,3],t:"Net plan ve hızlı aksiyon; minimum bekleme ile sonuca gidelim"},
      {v:"B",w:[2,10,2,0],t:"Evin değerine yakışan, özenle planlanmış bir lansman süreci"},
      {v:"C",w:[0,2,10,3],t:"Stressiz ve kontrollü; her adımda bilgilendirilmek isterim"},
      {v:"D",w:[3,0,3,10],t:"Raporlarla desteklenen, ölçülebilir ve şeffaf yönetim"}]},
  {id:"s2",ph:1,top:"İLK GÖRÜŞME",w:2.0,q:"Danışmanın ilk toplantıda size ne sunmasını beklersiniz?",
   o:[{v:"A",w:[10,2,0,3],t:"Net hedef ve aksiyon planı: fiyat + süre tahmini"},
      {v:"B",w:[2,10,2,0],t:"Evinizin değerini anlatan, duygusal bağ kuran bir sunum"},
      {v:"C",w:[0,2,10,3],t:"Her adımda yanınızda olacağını hissettiren güven veren yaklaşım"},
      {v:"D",w:[3,0,3,10],t:"Bölge verileri, emsal satışlar ve detaylı strateji raporu"}]},
  {id:"s3",ph:1,top:"FİYAT BEKLENTİSİ",w:2.0,q:"Evinizin fiyatlandırılması konusunda nasıl düşünüyorsunuz?",
   o:[{v:"A",w:[10,3,0,2],t:"Maksimum kar hedefliyorum; en iyi fiyatı almak istiyorum"},
      {v:"B",w:[3,10,2,0],t:"Evim özel ve değerli; gerçek değerinden aşağı gitmem"},
      {v:"C",w:[0,2,10,3],t:"Adil ve makul bir fiyat; ne çok ucuz ne fazla bekletsin"},
      {v:"D",w:[2,0,3,10],t:"Piyasa verileri ve emsal karşılaştırması ile desteklenmiş fiyat"}]},
  {id:"s4",ph:1,top:"TEK YETKİ",w:2.0,q:"Tek yetkili danışmanla çalışmak hakkında ne düşünürsünüz?",
   o:[{v:"A",w:[10,2,0,3],t:"Sonuç odaklı ve hız garantisi varsa tek yetki veririm"},
      {v:"B",w:[2,10,3,0],t:"Evimin değerini anlayan ve onu doğru tanıtan birine güvenirim"},
      {v:"C",w:[0,3,10,2],t:"Süreci bana açıkça anlatan, şeffaf biriyle çalışmaya hazırım"},
      {v:"D",w:[2,0,2,10],t:"Strateji, hedef ve süreç net ortaya konulursa değerlendiririm"}]},
  {id:"s5",ph:2,top:"PAZARLAMA",w:1.5,q:"Evinizin pazarlanmasında nasıl bir yaklaşım istersiniz?",
   o:[{v:"A",w:[10,3,0,2],t:"Geniş yayın; mümkün olan en fazla alıcıya ulaş"},
      {v:"B",w:[2,10,2,3],t:"Seçici ve prestijli; özel ağa, nitelikli kitlelere sunulsun"},
      {v:"C",w:[0,2,10,3],t:"Kontrollü; rastgele herkese gösterilmesini istemiyorum"},
      {v:"D",w:[2,3,2,10],t:"Analitik; hangi kanalda kaç kişiye ulaşıldığı raporlansın"}]},
  {id:"s6",ph:2,top:"ZİYARETÇİ",w:1.5,q:"Evinizi gezecek alıcılar konusunda tercihiniz nedir?",
   o:[{v:"A",w:[10,2,0,2],t:"Herkese gösterilsin; satışı hızlandırır"},
      {v:"B",w:[2,10,3,2],t:"Evi anlayan ve değerini bilen alıcılar; sıradan profil istemiyorum"},
      {v:"C",w:[0,3,10,2],t:"Saygılı ve özenli; evimi dikkatlice gezecek kişiler"},
      {v:"D",w:[3,2,2,10],t:"Finansal yeterliliği doğrulanmış, ciddiyeti kanıtlanmış alıcılar"}]},
  {id:"s7",ph:2,top:"KRİZ TUTUMU",w:2.0,q:"Beklentinizin altında teklifler gelirse nasıl yaklaşırsınız?",
   o:[{v:"A",w:[10,2,0,3],t:"Ticari değerlendiririm; duygusuz ve hızlı karar veririm"},
      {v:"B",w:[2,10,3,0],t:"Evimin değerini biliyorum; kolay taviz vermem"},
      {v:"C",w:[0,3,10,2],t:"Paniklemem ama süreci nazikçe yönetmem gerekir"},
      {v:"D",w:[3,0,2,10],t:"Piyasa verilerini yeniden gözden geçirir, teknik değerlendiririm"}]},
  {id:"s8",ph:2,top:"İLETİŞİM",w:1.5,q:"Satış sürecinde ne sıklıkla bilgi almak istersiniz?",
   o:[{v:"A",w:[10,2,0,3],t:"Sadece kritik gelişmelerde; gereksiz güncelleme istemiyorum"},
      {v:"B",w:[2,10,3,2],t:"Düzenli ve enerjik; süreçte olup biten her şeyi duymak isterim"},
      {v:"C",w:[0,3,10,3],t:"Haftalık düzenli özet; rahatlatıcı ve sakin bir güncelleme"},
      {v:"D",w:[2,2,3,10],t:"Detaylı ve belgelenmiş raporlar; verileri kayıt altında görmek"}]},
  {id:"s9",ph:3,top:"KARAR ORTAĞI",w:1.5,q:"Bu satış kararını kiminle / nasıl alıyorsunuz?",
   o:[{v:"A",w:[10,2,0,3],t:"Kararı ben veririm; kimsenin onayına ihtiyacım yok"},
      {v:"B",w:[2,10,4,0],t:"Eşim/ortağımla konuşurum; his ve enerji belirleyici"},
      {v:"C",w:[0,4,10,2],t:"Aile kararı; herkesin mutabık olması gerekiyor"},
      {v:"D",w:[3,0,2,10],t:"Uzman görüşleri ve veriler belirleyici; aileyle de paylaşırım"}]},
  {id:"s10",ph:3,top:"SÜRE BEKLENTİSİ",w:2.0,q:"Satışın ne kadar sürmesi sizin için kabul edilebilir?",
   o:[{v:"A",w:[10,2,0,2],t:"30-45 gün; kısa sürede kapanmasını bekliyorum"},
      {v:"B",w:[2,10,3,0],t:"Doğru alıcıyı beklerim; değerini bilmeden satmam"},
      {v:"C",w:[0,3,10,2],t:"Acelesi yok; doğru süreçle ilerlensin"},
      {v:"D",w:[2,0,2,10],t:"Piyasa ortalaması ne diyorsa, ona göre planlarım"}]},
  {id:"s11",ph:3,top:"İDEAL DANIŞMAN",w:2.0,q:"Sizin için ideal gayrimenkul danışmanı nasıl biri?",
   o:[{v:"A",w:[10,2,0,2],t:"Sonuç getirir, hızlı satar, vakit kaybetmez"},
      {v:"B",w:[2,10,3,0],t:"Enerji yüksek, ekip ruhu olan, ortaklık hissettiren"},
      {v:"C",w:[0,3,10,2],t:"Güven veren, rehberlik eden, aileden biri gibi"},
      {v:"D",w:[2,0,2,10],t:"Yasal bilgisi güçlü, piyasa analizi yapan, kanıt sunan uzman"}]},
  {id:"s12",ph:3,top:"KAPANIŞ ANI",w:2.0,q:"Satış anlaşması imzalanırken nasıl hissedersiniz?",
   o:[{v:"A",w:[10,2,0,2],t:"Rahatım; hızlı kapandıysa doğru kararı verdim demektir"},
      {v:"B",w:[2,10,3,0],t:"Özel bir an; kutlamak ve paylaşmak isterim"},
      {v:"C",w:[0,2,10,3],t:"Her detay gözden geçirildi mi son kez kontrol etmek isterim"},
      {v:"D",w:[2,0,3,10],t:"Tüm belgeleri ve rakamları son kez doğruladıktan sonra imzalarım"}]},
];

/* ══ SCORING ════════════════════════════════════════════════ */
function calcScores(ans,qs){
  const pts={A:0,B:0,C:0,D:0};
  qs.forEach(q=>{const a=ans[q.id];if(!a)return;const opt=q.o.find(o=>o.v===a);if(!opt)return;["A","B","C","D"].forEach((k,i)=>{pts[k]+=opt.w[i]*q.w;});});
  const tot=Object.values(pts).reduce((s,v)=>s+v,0);
  if(!tot)return{A:25,B:25,C:25,D:25};
  const raw={};let sum=0;
  ["A","B","C","D"].forEach(k=>{raw[k]=Math.round((pts[k]/tot)*100);sum+=raw[k];});
  const top=Object.keys(raw).sort((a,b)=>raw[b]-raw[a]);
  raw[top[0]]+=(100-sum);return raw;
}
function detectProfile(sc){
  const s=Object.entries(sc).sort((a,b)=>b[1]-a[1]);
  const gap=s[0][1]-s[1][1];
  return{primary:s[0][0],secondary:(s[1][1]>=22&&gap<=20)?s[1][0]:null,isHybrid:gap<=12};
}
const hitap=(n,g)=>g==="erkek"?`${n} Bey`:g==="kadin"?`${n} Hanım`:n;

/* ══ PROFILE META ═══════════════════════════════════════════ */
const PM={
  A:{lbl:"KIRMIZI",sym:"▲",col:"#b91c1c",bg:"#fef2f2",brd:"#fca5a5",lt:"#fee2e2",tag:"Sonuç Odaklı",soft:"Hız ve Netlik Odaklı Tercihler",rgb:[185,28,28],bgRgb:[254,242,242]},
  B:{lbl:"SARI",   sym:"◆",col:"#92400e",bg:"#fffbeb",brd:"#fcd34d",lt:"#fef3c7",tag:"Prestij / İmaj",soft:"Estetik ve Değer Odaklı Tercihler",rgb:[146,64,14],bgRgb:[255,251,235]},
  C:{lbl:"YEŞİL",  sym:"●",col:"#14532d",bg:"#f0fdf4",brd:"#86efac",lt:"#dcfce7",tag:"Güven / Konfor",soft:"Güven ve Konfor Odaklı Tercihler",rgb:[20,83,45],bgRgb:[240,253,244]},
  D:{lbl:"MAVİ",   sym:"■",col:"#1e3a8a",bg:"#eff6ff",brd:"#93c5fd",lt:"#dbeafe",tag:"Analitik / Veri",soft:"Detay ve Analiz Odaklı Tercihler",rgb:[30,58,138],bgRgb:[239,246,255]},
};
const PHASES={1:"TEMEL TERCİHLER",2:"KARAR DİNAMİĞİ",3:"BEKLENTI & KAPANIŞ"};
const TR_MAP={'ğ':'g','Ğ':'G','ü':'u','Ü':'U','ş':'s','Ş':'S','ı':'i','İ':'I','ö':'o','Ö':'O','ç':'c','Ç':'C'};
const trFix=s=>(s||'').replace(/[ğĞüÜşŞıİöÖçÇ]/g,m=>TR_MAP[m]||m);

/* ══ DIAMOND SVG ════════════════════════════════════════════ */
function Diamond({sc,size=200}){
  const[go,setGo]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setGo(true),200);return()=>clearTimeout(t);},[]);
  const cx=size/2,cy=size/2,R=size*0.37;
  const r=v=>(go?(sc[v]||0):0)/100*R;
  const pts={A:[cx,cy-r("A")],B:[cx+r("B"),cy],C:[cx,cy+r("C")],D:[cx-r("D"),cy]};
  const poly=[pts.A,pts.B,pts.C,pts.D].map(p=>p.join(",")).join(" ");
  const CC={A:"#b91c1c",B:"#d97706",C:"#16a34a",D:"#2563eb"};
  const LL={A:"KIRMIZI",B:"SARI",C:"YEŞİL",D:"MAVİ"};
  const grid=[25,50,75,100].map(p=>{const g=R*(p/100);return`${cx},${cy-g} ${cx+g},${cy} ${cx},${cy+g} ${cx-g},${cy}`;});
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:"visible"}}>
      <defs><radialGradient id="dg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#2d5c10" stopOpacity=".35"/><stop offset="100%" stopColor="#2d5c10" stopOpacity=".05"/></radialGradient></defs>
      {grid.map((g,i)=><polygon key={i} points={g} fill="none" stroke="#c9b070" strokeWidth=".8" opacity={.18+i*.1}/>)}
      <line x1={cx} y1={cy-R} x2={cx} y2={cy+R} stroke="#c9b070" strokeWidth=".8" opacity=".35"/>
      <line x1={cx-R} y1={cy} x2={cx+R} y2={cy} stroke="#c9b070" strokeWidth=".8" opacity=".35"/>
      <polygon points={poly} fill="url(#dg)" stroke="#2d5c10" strokeWidth="2.5" style={{transition:"all 1.3s cubic-bezier(.4,0,.2,1)"}}/>
      {Object.entries(pts).map(([k,[x,y]])=>(
        <circle key={k} cx={x} cy={y} r={6} fill={CC[k]} stroke="#faf6e8" strokeWidth="2" style={{transition:"all 1.3s cubic-bezier(.4,0,.2,1)",filter:`drop-shadow(0 0 5px ${CC[k]}99)`}}/>
      ))}
      <text x={cx} y={cy-R-14} textAnchor="middle" fontSize="9" fill={CC.A} fontFamily="monospace" fontWeight="600">{LL.A} {sc.A}%</text>
      <text x={cx+R+12} y={cy+4} textAnchor="start" fontSize="9" fill={CC.B} fontFamily="monospace" fontWeight="600">{LL.B} {sc.B}%</text>
      <text x={cx} y={cy+R+18} textAnchor="middle" fontSize="9" fill={CC.C} fontFamily="monospace" fontWeight="600">{LL.C} {sc.C}%</text>
      <text x={cx-R-12} y={cy+4} textAnchor="end" fontSize="9" fill={CC.D} fontFamily="monospace" fontWeight="600">{LL.D} {sc.D}%</text>
      <text x={cx} y={cy+5} textAnchor="middle" fontSize="8" fill="#8c7040" fontFamily="monospace" opacity=".45">DISC</text>
    </svg>
  );
}

function CheckAnim(){
  return(
    <svg width="76" height="76" viewBox="0 0 76 76">
      <circle cx="38" cy="38" r="32" fill="none" stroke="#2d5c10" strokeWidth="3" style={{strokeDasharray:201,strokeDashoffset:201,animation:"circleIn .7s ease forwards"}}/>
      <polyline points="20,39 32,51 56,25" fill="none" stroke="#2d5c10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:60,strokeDashoffset:60,animation:"checkIn .4s .65s ease forwards"}}/>
    </svg>
  );
}

async function sendToLH(payload){
  try{await fetch(LH_WEBHOOK,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});}
  catch(e){console.warn("LeadHunter webhook hatası:",e);}
}

/* ══ MAIN APP ═══════════════════════════════════════════════ */
export default function App(){
  const[phase,setPhase]=useState("intro");
  const[role,setRole]=useState(null);
  const[qi,setQi]=useState(0);
  const[ans,setAns]=useState({});
  const[info,setInfo]=useState({name:"",surname:"",gender:"",phone:"",email:""});
  const[errs,setErrs]=useState({});
  const[res,setRes]=useState(null);
  const[pct,setPct]=useState(0);
  const[typed,setTyped]=useState("");
  const[panel,setPanel]=useState(false);
  const[cpd,setCpd]=useState(false);
  const[pdfLoading,setPdfLoading]=useState(false);
  const[installPrompt,setInstallPrompt]=useState(null);
  const[installed,setInstalled]=useState(false);
  const pRef=useRef(null);const tRef=useRef("");

  const QS=role==="buyer"?BQ:SQ;
  const prof=res?detectProfile(res.scores):null;
  const pm=prof?PM[prof.primary]:null;
  const pm2=prof?.secondary?PM[prof.secondary]:null;
  const salT=info.gender==="erkek"?"Bey":info.gender==="kadin"?"Hanım":"";

  /* PWA setup */
  useEffect(()=>{
    const handler=e=>{e.preventDefault();setInstallPrompt(e);};
    window.addEventListener("beforeinstallprompt",handler);
    window.addEventListener("appinstalled",()=>setInstalled(true));
    // Inject manifest
    try{
      const manifest={name:"Turyap Queen Tercih Rehberi",short_name:"Tercih Rehberi",
        start_url:"./",display:"standalone",background_color:"#ede8d8",theme_color:"#1a2e08",
        description:"Murat İyicioğlu - Turyap Queen",
        icons:[{src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a2e08'/%3E%3Ctext y='.9em' font-size='80' x='10'%3E🏠%3C/text%3E%3C/svg%3E",sizes:"any",type:"image/svg+xml"}]};
      if(!document.querySelector('link[rel="manifest"]')){
        const blob=new Blob([JSON.stringify(manifest)],{type:"application/json"});
        const link=document.createElement("link");
        link.rel="manifest";link.href=URL.createObjectURL(blob);
        document.head.appendChild(link);
      }
    }catch(e){}
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);

  const installApp=async()=>{
    if(!installPrompt)return;
    installPrompt.prompt();
    const r=await installPrompt.userChoice;
    if(r.outcome==="accepted")setInstalled(true);
    setInstallPrompt(null);
  };

  /* Quiz navigation */
  const pick=v=>{
    const upd={...ans,[QS[qi].id]:v};
    setAns(upd);
    setTimeout(()=>{if(qi<QS.length-1){setQi(qi+1);}else{setPhase("contact");}},300);
  };

  const goBack=()=>{
    if(qi>0)setQi(qi-1);
    else setPhase("role");
  };

  const goForward=()=>{
    if(!ans[QS[qi].id])return; // must answer first
    if(qi<QS.length-1)setQi(qi+1);
    else setPhase("contact");
  };

  /* Contact form */
  const handlePhone=e=>{
    const d=e.target.value.replace(/\D/g,"").slice(0,11);
    setInfo(p=>({...p,phone:d}));
    if(errs.phone)setErrs(p=>({...p,phone:""}));
  };

  const submitContact=()=>{
    const e={};
    if(!info.name.trim())e.name="Ad zorunludur";
    if(!info.surname.trim())e.surname="Soyad zorunludur";
    if(!info.gender)e.gender="Lütfen seçiniz";
    if(info.phone.length!==11)e.phone="11 rakam giriniz";
    else if(!info.phone.startsWith("0"))e.phone="Numara 0 ile başlamalıdır";
    if(info.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))e.email="Geçerli bir e-posta giriniz";
    if(Object.keys(e).length){setErrs(e);return;}
    setPhase("scan");runAnalysis();
  };

  /* Scan progress */
  useEffect(()=>{
    if(phase!=="scan")return;
    setPct(0);
    pRef.current=setInterval(()=>{
      setPct(p=>{const n=p+Math.random()*3+.8;if(n>=96){clearInterval(pRef.current);return 96;}return n;});
    },100);
    return()=>clearInterval(pRef.current);
  },[phase]);

  /* AI Analysis */
  const runAnalysis=async()=>{
    const sc=calcScores(ans,QS);
    const pf=detectProfile(sc);
    const ansSum=QS.map(q=>{const ch=q.o.find(o=>o.v===ans[q.id]);return`[${q.top}] Faz${q.ph} | Cevap(${ans[q.id]}): "${ch?.t}"`;}).join("\n");
    const prompt=`Sen bir psikolojik satış analiz uzmanısın. DISC renk profiline göre gayrimenkul müşterisi analizi yapıyorsun.

DANIŞMAN: ${BRAND.agent} / ${BRAND.company}
MÜŞTERİ: ${info.name} ${info.surname} ${salT}
DURUM: ${role==="buyer"?"ALICI":"SATICI"}

DISC: A=KIRMIZI(Hız/Sonuç) B=SARI(Prestij/İmaj) C=YEŞİL(Güven/Konfor) D=MAVİ(Analitik/Veri)
SKORLAR: A=${sc.A}% B=${sc.B}% C=${sc.C}% D=${sc.D}%
${pf.secondary?`BİRİNCİL:${pf.primary}(${sc[pf.primary]}%) + İKİNCİL:${pf.secondary}(${sc[pf.secondary]}%) → MELEZ`:`BASKUN: ${pf.primary}(${sc[pf.primary]}%)`}

CEVAPLAR:\n${ansSum}

ÖNEMLI: Tüm hitaplarda "${info.name} ${salT}" formatını kullan.

SADECE JSON döndür:
{"profile_title":"max 5 kelime","profile_summary":"2-3 cümle","script":"${info.name} ${salT} hitabıyla, doğal, 3-5 cümle","anti_script":"1-2 cümle","avoid":["3 madde"],"power_move":"1 cümle","urgency_trigger":"tetikleyici cümle","trust_builder":"güven kurma hamlesi","warning":"en kritik hata","closing_line":"${info.name} ${salT} hitabıyla kapanış"}`;

    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,messages:[{role:"user",content:prompt}]})});
      const data=await resp.json();
      const raw=data.content?.map(b=>b.text||"").join("")||"";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      const fullRes={...parsed,scores:sc};
      await sendToLH({source:"PSY-SALES ENGINE v3",timestamp:new Date().toISOString(),
        danisман:{ad:BRAND.agent,sirket:BRAND.company},
        lead:{ad:info.name,soyad:info.surname,hitap:`${info.name} ${salT}`,cinsiyet:info.gender,telefon:info.phone,eposta:info.email||null,pozisyon:role==="buyer"?"Alıcı":"Satıcı"},
        profil:{ana_renk:PM[pf.primary].lbl,ikincil_renk:pf.secondary?PM[pf.secondary].lbl:null,melez:pf.isHybrid,baslik:parsed.profile_title,ozet:parsed.profile_summary,disc_skorlari:sc},
        satis_araclari:{script:parsed.script,kapanis_cumlesi:parsed.closing_line,kapanis_hamlesi:parsed.power_move,tetikleyici:parsed.urgency_trigger,guven_hamlesi:parsed.trust_builder,anti_script:parsed.anti_script,kacinilanlar:parsed.avoid,kritik_hata:parsed.warning},
        cevaplar:QS.map(q=>({konu:q.top,faz:q.ph,secilen:ans[q.id],metin:q.o.find(o=>o.v===ans[q.id])?.t}))});
      setPct(100);
      setTimeout(()=>{setRes(fullRes);setPhase("thanks");tRef.current="";setTyped("");typeAnim(parsed.script);},600);
    }catch{
      setPct(100);
      setTimeout(()=>{setRes({scores:sc,profile_title:"Tamamlandı",profile_summary:"",script:"",avoid:[],power_move:"",urgency_trigger:"",trust_builder:"",anti_script:"",warning:"",closing_line:""});setPhase("thanks");},600);
    }
  };

  const typeAnim=text=>{if(!text)return;let i=0;const iv=setInterval(()=>{tRef.current+=text[i]||"";setTyped(tRef.current);i++;if(i>=text.length)clearInterval(iv);},20);};

  const hardReset=()=>{setPhase("intro");setRole(null);setQi(0);setAns({});setInfo({name:"",surname:"",gender:"",phone:"",email:""});setErrs({});setRes(null);setTyped("");tRef.current="";setPanel(false);};

  /* PDF Generation */
  const generatePDF=async()=>{
    if(!res||!pm){return;}
    setPdfLoading(true);
    try{
      if(!window.jspdf){
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload=res;s.onerror=rej;document.head.appendChild(s);
        });
      }
      const{jsPDF}=window.jspdf;
      const doc=new jsPDF({orientation:"p",unit:"mm",format:"a4"});
      const W=210,H=297,ML=14,MR=14,CW=W-ML-MR;
      let useTr=false;

      // Try loading Turkish-compatible font
      try{
        const fr=await fetch("https://cdn.jsdelivr.net/npm/roboto-fontface@0.10.0/fonts/roboto/Roboto-Regular.ttf");
        if(fr.ok){
          const buf=await fr.arrayBuffer();
          const u8=new Uint8Array(buf);
          let b64="";const chunk=8192;
          for(let i=0;i<u8.length;i+=chunk)b64+=btoa(String.fromCharCode(...u8.slice(i,i+chunk)));
          doc.addFileToVFS("Roboto.ttf",b64);
          doc.addFont("Roboto.ttf","Roboto","normal");
          doc.setFont("Roboto");
          useTr=true;
        }
      }catch(fe){console.log("Font fallback:",fe);}

      const T=useTr?(s=>s||""):trFix;
      const setF=(size,color)=>{doc.setFontSize(size);if(color)doc.setTextColor(...color);};
      const fillRect=(x,y,w,h,fill,stroke)=>{
        if(fill)doc.setFillColor(...fill);
        if(stroke)doc.setDrawColor(...stroke);
        doc.rect(x,y,w,h,fill&&stroke?"FD":fill?"F":"D");
      };
      const wrappedText=(text,x,y,maxW,lh=5.2)=>{
        const lines=doc.splitTextToSize(T(text),maxW);
        doc.text(lines,x,y);
        return lines.length*lh;
      };

      // ── PAGE HEADER ─────────────────────────────────────────
      fillRect(0,0,W,20,[26,46,8]);
      if(useTr)doc.setFont("Roboto");
      setF(13,[168,224,96]);doc.text(T(BRAND.company),ML,9);
      setF(8,[92,186,44]);doc.text(T(`${BRAND.agent} · ${BRAND.tagline}`),ML,15);
      setF(8,[168,224,96]);doc.text(new Date().toLocaleDateString("tr-TR"),W-MR,9,{align:"right"});
      setF(7,[92,186,44]);doc.text("DISC PROFİL RAPORU",W-MR,15,{align:"right"});

      // ── LEAD INFO ───────────────────────────────────────────
      let y=24;
      fillRect(ML,y,CW,22,[250,246,232],[201,176,112]);
      setF(8,[140,112,64]);doc.text("MÜŞTERİ BİLGİLERİ",ML+4,y+6);
      setF(12,[26,26,10]);doc.text(T(`${info.name} ${info.surname} ${salT}`),ML+4,y+13);
      setF(8,[60,46,18]);
      doc.text(T(`Tel: ${info.phone}`),ML+4,y+19);
      if(info.email)doc.text(T(`E: ${info.email}`),ML+60,y+19);
      doc.text(T(role==="buyer"?"Alıcı":"Satıcı"),W-MR,y+13,{align:"right"});
      doc.text(new Date().toLocaleDateString("tr-TR"),W-MR,y+19,{align:"right"});
      y+=26;

      // ── PROFILE BADGE ───────────────────────────────────────
      fillRect(ML,y,CW,22,pm.bgRgb,pm.rgb);
      if(prof?.isHybrid&&pm2){
        fillRect(ML+2,y+1,60,5,[26,46,8]);
        setF(6,[168,224,96]);doc.text(T(`MELEZ: ${pm.lbl} + ${pm2.lbl}`),ML+4,y+5);
      }
      setF(18,pm.rgb);doc.text(pm.sym,ML+4,y+(prof?.isHybrid&&pm2?14:12));
      setF(13,pm.rgb);doc.text(T(`${pm.lbl}${pm2?` + ${pm2.lbl}`:""}`),ML+14,y+(prof?.isHybrid&&pm2?10:8));
      setF(8,pm.rgb);doc.text(T(res.profile_title||""),ML+14,y+(prof?.isHybrid&&pm2?15:13));
      setF(8,pm.rgb);doc.text(T(pm.tag),W-MR,y+7,{align:"right"});
      setF(7,[...pm.rgb,180]);
      const sumLines=doc.splitTextToSize(T(res.profile_summary||""),CW-22);
      if(sumLines.length<=2){doc.text(sumLines,ML+14,y+18);}
      y+=26;

      // ── DISC BARS ───────────────────────────────────────────
      fillRect(ML,y,CW,34,[250,246,232],[201,176,112]);
      setF(7,[140,112,64]);doc.text("DISC SKOR DAĞILIMI",ML+4,y+6);
      const barColors={A:[185,28,28],B:[217,119,6],C:[22,163,74],D:[37,99,235]};
      const barLabels={A:"KIRMIZI",B:"SARI",C:"YEŞİL",D:"MAVİ"};
      const bW=CW-38;
      Object.entries(res.scores).forEach(([k,v],i)=>{
        const by=y+11+i*5.5;
        setF(6,barColors[k]);doc.text(T(barLabels[k]),ML+4,by+3);
        fillRect(ML+24,by,bW,3.5,[220,200,140]);
        fillRect(ML+24,by,bW*(v/100),3.5,barColors[k]);
        setF(6,barColors[k]);doc.text(`${v}%`,ML+24+bW+2,by+3);
      });
      y+=38;

      // ── SCRIPT ──────────────────────────────────────────────
      const scriptLines=doc.splitTextToSize(T(`"${res.script||""}"`),CW-8);
      const scriptH=14+scriptLines.length*5.2;
      fillRect(ML,y,CW,scriptH,[26,46,8],[45,92,16]);
      setF(7,[92,186,44]);doc.text("SATIŞ SCRİPTİ",ML+4,y+6);
      setF(9,[200,240,128]);doc.text(scriptLines,ML+4,y+12);
      y+=scriptH+3;

      // ── CLOSING ─────────────────────────────────────────────
      if(res.closing_line){
        const clLines=doc.splitTextToSize(T(`"${res.closing_line}"`),CW-8);
        const clH=12+clLines.length*5.2;
        if(y+clH<H-30){
          fillRect(ML,y,CW,clH,[26,46,8],[45,92,16]);
          setF(7,[92,186,44]);doc.text("KAPANIŞ CÜMLESİ",ML+4,y+6);
          setF(9,[200,240,128]);doc.text(clLines,ML+4,y+11);
          y+=clH+3;
        }
      }

      // ── TWO COL: POWER + TRIGGER ─────────────────────────────
      const colW=(CW-3)/2;
      if(res.power_move&&y+20<H-30){
        const pmLines=doc.splitTextToSize(T(res.power_move),colW-6);
        const trigLines=res.urgency_trigger?doc.splitTextToSize(T(`"${res.urgency_trigger}"`),colW-6):[];
        const rowH=Math.max(14+pmLines.length*5,14+(trigLines.length||0)*5);
        if(y+rowH<H-30){
          fillRect(ML,y,colW,rowH,pm.bgRgb,pm.rgb);
          setF(6,pm.rgb);doc.text("KAPANIŞ HAMLESİ",ML+3,y+6);
          setF(8,pm.rgb);doc.text(pmLines,ML+3,y+11);
          if(trigLines.length){
            fillRect(ML+colW+3,y,colW,rowH,[255,251,235],[252,211,77]);
            setF(6,[146,64,14]);doc.text("TETİKLEYİCİ",ML+colW+6,y+6);
            setF(8,[120,53,15]);doc.text(trigLines,ML+colW+6,y+11);
          }
          y+=rowH+3;
        }
      }

      // New page if needed
      if(y>H-60){
        doc.addPage();
        fillRect(0,0,W,10,[26,46,8]);
        setF(7,[168,224,96]);doc.text(T(`${BRAND.company} — ${info.name} ${info.surname} ${salT}`),ML,7);
        y=15;
      }

      // ── TRUST + ANTI ────────────────────────────────────────
      if(res.trust_builder&&y+18<H-30){
        const tbLines=doc.splitTextToSize(T(res.trust_builder),CW-8);
        const tbH=12+tbLines.length*5;
        fillRect(ML,y,CW,tbH,[240,253,244],[134,239,172]);
        setF(6,[20,83,45]);doc.text("GÜVEN İNŞASI",ML+4,y+6);
        setF(8,[20,83,45]);doc.text(tbLines,ML+4,y+11);
        y+=tbH+3;
      }
      if(res.anti_script&&y+16<H-30){
        const asLines=doc.splitTextToSize(T(res.anti_script),CW-8);
        const asH=12+asLines.length*5;
        fillRect(ML,y,CW,asH,[255,241,242],[252,165,165]);
        setF(6,[185,28,28]);doc.text("ASLA SÖYLEME — ANTİ SCRİPT",ML+4,y+6);
        setF(8,[127,29,29]);doc.text(asLines,ML+4,y+11);
        y+=asH+3;
      }

      // ── AVOID ───────────────────────────────────────────────
      if(res.avoid?.length&&y+20<H-30){
        const avoidItems=(res.avoid||[]).map(a=>doc.splitTextToSize(T(`×  ${a}`),CW-8));
        const avH=10+avoidItems.reduce((s,l)=>s+l.length*5,0)+3;
        if(y+avH<H-30){
          fillRect(ML,y,CW,avH,[250,246,232],[201,176,112]);
          setF(6,[140,112,64]);doc.text("KAÇIN",ML+4,y+6);
          let ay=y+11;
          avoidItems.forEach(lines=>{setF(8,[185,28,28]);doc.text(lines,ML+4,ay);ay+=lines.length*5;});
          y+=avH+3;
        }
      }

      // ── WARNING ─────────────────────────────────────────────
      if(res.warning&&y+16<H-20){
        const wLines=doc.splitTextToSize(T(res.warning),CW-8);
        const wH=12+wLines.length*5;
        fillRect(ML,y,CW,wH,[254,252,232],[253,224,71]);
        setF(6,[133,77,14]);doc.text("KRİTİK HATA",ML+4,y+6);
        setF(8,[113,63,18]);doc.text(wLines,ML+4,y+11);
      }

      // ── FOOTER ──────────────────────────────────────────────
      fillRect(0,H-12,W,12,[26,46,8]);
      setF(6,[92,186,44]);
      doc.text(T(`${BRAND.agent} · ${BRAND.company} · PSY-SALES ENGINE v3`),ML,H-4);
      doc.text(new Date().toLocaleDateString("tr-TR"),W-MR,H-4,{align:"right"});

      const fname=`${info.name||"rapor"}_${info.surname||""}_DISC_${new Date().toLocaleDateString("tr-TR").replace(/\./g,"-")}.pdf`;
      doc.save(fname);
    }catch(err){
      console.error("PDF hatası:",err);
      alert("PDF oluşturulurken hata oluştu. Tekrar deneyin.");
    }
    setPdfLoading(false);
  };

  const copyAll=()=>{
    if(!res)return;
    const lines=[`══ ${BRAND.company} — ${BRAND.agent} ══`,`PSY-SALES RAPORU // ${new Date().toLocaleDateString("tr-TR")}`,``,`Müşteri: ${info.name} ${info.surname} ${salT}`,`Telefon: ${info.phone}`,info.email?`E-posta: ${info.email}`:"",`Pozisyon: ${role==="buyer"?"Alıcı":"Satıcı"}`,``,`PROFİL: ${pm?.lbl}${pm2?" + "+pm2.lbl:""} — ${res.profile_title}`,`DISC: A=${res.scores.A}% B=${res.scores.B}% C=${res.scores.C}% D=${res.scores.D}%`,``,`SCRİPT:\n${res.script}`,``,`KAPANIŞ:\n${res.closing_line}`,``,`HAMLE:\n${res.power_move}`,``,`TETİKLEYİCİ:\n${res.urgency_trigger}`,``,`GÜVEN:\n${res.trust_builder}`,``,`ANTİ:\n${res.anti_script}`,``,`KAÇIN:\n${res.avoid?.map(a=>"× "+a).join("\n")}`,``,`HATA:\n${res.warning}`].filter(l=>l!==null).join("\n");
    navigator.clipboard.writeText(lines);
    setCpd(true);setTimeout(()=>setCpd(false),2000);
  };

  /* CSS */
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne+Mono&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    @keyframes blink{0%,100%{opacity:1}55%{opacity:.25}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes circleIn{from{stroke-dashoffset:201}to{stroke-dashoffset:0}}
    @keyframes checkIn{from{stroke-dashoffset:60}to{stroke-dashoffset:0}}
    @keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    @keyframes sheen{from{opacity:0}50%{opacity:1}to{opacity:0}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

    .sh{min-height:100vh;background:#ede8d8;
      background-image:repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(100,80,40,.055) 24px);
      font-family:'IBM Plex Mono',monospace;color:#1a1a0a;
      display:flex;flex-direction:column;align-items:center;padding:0 14px 60px}
    .sh::before{content:'';position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;
      background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.011) 3px,rgba(0,0,0,.011) 4px)}
    .inn{position:relative;z-index:1;width:100%;max-width:640px}

    .hbar{padding:13px 0 11px;border-bottom:2.5px solid #3d2e0a;margin-bottom:20px}
    .h-top{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:6px}
    .h-sys{font-size:9px;color:#8c7040;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:3px}
    .h-tit{font-family:'Syne Mono',monospace;font-size:clamp(16px,4vw,22px);color:#1a1a0a}
    .h-tit em{color:#2d5c10;font-style:normal}
    .h-r{text-align:right}
    .h-ver{font-size:9px;color:#8c7040;letter-spacing:.15em;display:block;margin-bottom:5px}
    .led{width:9px;height:9px;border-radius:50%;background:#5cba2c;box-shadow:0 0 7px #5cba2c;display:inline-block;animation:blink 1.6s infinite}
    .h-brand{display:flex;align-items:center;gap:10px}
    .h-logo{width:30px;height:30px;border-radius:3px;background:#1a2e08;display:flex;align-items:center;justify-content:center;font-size:12px;font-family:'Syne Mono',monospace;color:#a8e060;font-weight:700;border:1.5px solid #2d5c10;flex-shrink:0}
    .h-brand-name{font-size:11px;color:#3d2e0a;letter-spacing:.04em;line-height:1.4}
    .h-brand-name strong{font-size:12px;display:block;color:#1a1a0a}

    .card{background:#faf6e8;border:2px solid #c9b070;border-radius:3px;padding:17px 19px;margin-bottom:11px;box-shadow:3px 3px 0 #c9b070}
    .chd{font-size:9px;letter-spacing:.2em;color:#8c7040;text-transform:uppercase;margin-bottom:9px}
    .chd::before{content:'// ';color:#c9b070}

    .pbtn{width:100%;padding:13px;border:2px solid #1a2e08;background:#1a2e08;color:#a8e060;
      font-family:'Syne Mono',monospace;font-size:12px;letter-spacing:.1em;cursor:pointer;
      border-radius:3px;box-shadow:4px 4px 0 #0d1a04;transition:all .18s}
    .pbtn:hover:not(:disabled){transform:translate(-2px,-2px);box-shadow:6px 6px 0 #0d1a04}
    .pbtn:disabled{opacity:.35;cursor:not-allowed}
    .sbtn{width:100%;padding:10px;border:1.5px solid #c9b070;background:transparent;
      font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.1em;color:#8c7040;
      cursor:pointer;border-radius:3px;box-shadow:2px 2px 0 #c9b070;transition:all .16s;margin-top:9px}
    .sbtn:hover{background:#1a2e08;color:#a8e060;border-color:#1a2e08}

    .role-g{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
    .rbtn{padding:18px 12px;border:2px solid #c9b070;background:#faf6e8;border-radius:3px;cursor:pointer;font-family:'IBM Plex Mono',monospace;transition:all .18s;text-align:center;box-shadow:3px 3px 0 #c9b070}
    .rbtn:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #c9b070}
    .rbtn.sel{background:#1a2e08;border-color:#1a2e08;color:#a8e060;box-shadow:3px 3px 0 #0d1a04}

    .ph-ban{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:7px 12px;background:#1a2e08;border-radius:2px}
    .ph-dot{width:6px;height:6px;border-radius:50%;background:#a8e060;animation:blink .9s infinite}
    .ph-lbl{font-size:9px;letter-spacing:.18em;color:#a8e060;text-transform:uppercase}
    .ph-num{margin-left:auto;font-size:9px;color:#5cba2c;letter-spacing:.1em}

    .prog-r{display:flex;gap:4px;margin-bottom:6px}
    .pseg{height:5px;flex:1;border-radius:1px;background:#d5c080;transition:background .4s}
    .pseg.done{background:#1a2e08}.pseg.act{background:#4a8c20}
    .pm{display:flex;justify-content:space-between;font-size:9px;color:#8c7040;letter-spacing:.1em;margin-bottom:12px}

    .q-top{display:inline-block;font-size:9px;letter-spacing:.18em;background:#1a2e08;color:#a8e060;padding:3px 10px;border-radius:2px;margin-bottom:9px}
    .q-txt{font-family:'Syne Mono',monospace;font-size:14px;line-height:1.6;color:#1a1a0a;margin-bottom:14px}
    .opt{width:100%;text-align:left;padding:11px 13px;background:#faf6e8;border:1.5px solid #c9b070;
      border-radius:3px;margin-bottom:7px;cursor:pointer;font-family:'IBM Plex Mono',monospace;
      font-size:12px;line-height:1.5;color:#2d2010;transition:all .14s;box-shadow:2px 2px 0 #c9b070;
      display:flex;align-items:flex-start;gap:11px;position:relative}
    .opt:hover{background:#1a2e08;color:#c8f080;border-color:#1a2e08;box-shadow:2px 2px 0 #0d1a04;transform:translateX(4px)}
    .opt.selected{background:#f0fdf4;border-color:#86efac;box-shadow:2px 2px 0 #86efac;color:#14532d}
    .opt.selected .ok{color:#16a34a}
    .ok{font-size:10px;letter-spacing:.1em;min-width:16px;padding-top:1px;color:#8c7040;font-weight:600;transition:color .14s;flex-shrink:0}
    .opt:hover .ok{color:#5cba2c}
    .sel-tick{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:13px;color:#16a34a}

    /* Nav row for quiz */
    .nav-row{display:grid;grid-template-columns:1fr 2fr;gap:8px;margin-top:4px}
    .nav-back{padding:10px;border:1.5px solid #c9b070;background:transparent;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.08em;color:#8c7040;cursor:pointer;border-radius:3px;box-shadow:2px 2px 0 #c9b070;transition:all .15s}
    .nav-back:hover{background:#3d2e0a;color:#f5eecc;border-color:#3d2e0a}
    .nav-next{padding:10px;border:2px solid;font-family:'Syne Mono',monospace;font-size:11px;letter-spacing:.1em;cursor:pointer;border-radius:3px;transition:all .15s}
    .nav-next.enabled{background:#1a2e08;border-color:#1a2e08;color:#a8e060;box-shadow:2px 2px 0 #0d1a04}
    .nav-next.enabled:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 #0d1a04}
    .nav-next.disabled{background:transparent;border-color:#d5c080;color:#c9b070;cursor:not-allowed}

    .frow{display:grid;grid-template-columns:1fr 1fr;gap:11px}
    @media(max-width:480px){.frow{grid-template-columns:1fr}}
    .fw{margin-bottom:12px}
    .fl{font-size:9px;letter-spacing:.18em;color:#8c7040;text-transform:uppercase;margin-bottom:4px;display:flex;align-items:center;gap:4px}
    .req{color:#b91c1c;font-size:11px}
    .opt-lbl{font-size:8px;color:#a8a080;letter-spacing:.1em}
    .fi{width:100%;padding:10px 13px;background:#faf6e8;border:1.5px solid #c9b070;border-radius:3px;font-family:'IBM Plex Mono',monospace;font-size:13px;color:#1a1a0a;box-shadow:2px 2px 0 #c9b070;transition:all .14s;outline:none}
    .fi:focus{border-color:#2d5c10;box-shadow:2px 2px 0 #2d5c10}
    .fi.err{border-color:#b91c1c;box-shadow:2px 2px 0 #fca5a5}
    .fe{font-size:10px;color:#b91c1c;margin-top:3px;letter-spacing:.05em}
    .fh{font-size:9px;color:#8c7040;margin-top:3px;letter-spacing:.05em}
    .ph-w{position:relative}
    .ph-c{position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:10px;color:#8c7040;pointer-events:none}
    .gen-g{display:grid;grid-template-columns:1fr 1fr;gap:7px}
    .gbtn{padding:9px;border:1.5px solid #c9b070;background:#faf6e8;border-radius:3px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#3d2e12;transition:all .14s;text-align:center;box-shadow:2px 2px 0 #c9b070}
    .gbtn.sel{background:#1a2e08;border-color:#1a2e08;color:#a8e060;box-shadow:2px 2px 0 #0d1a04}

    .scan-w{text-align:center;padding:50px 0}
    .scan-t{font-family:'Syne Mono',monospace;font-size:15px;color:#1a1a0a;margin-bottom:4px}
    .scan-s{font-size:10px;color:#8c7040;letter-spacing:.15em;margin-bottom:24px;animation:blink 1s infinite}
    .sbar-o{background:#d5c080;border:2px solid #c9b070;border-radius:2px;height:14px;max-width:340px;margin:0 auto 6px;overflow:hidden}
    .sbar-i{height:100%;background:#1a2e08;transition:width .25s ease;position:relative;overflow:hidden}
    .sbar-i::after{content:'';position:absolute;top:0;bottom:0;right:0;width:40px;background:linear-gradient(90deg,transparent,rgba(168,224,96,.4));animation:sheen 1s infinite}
    .spct{font-size:10px;color:#8c7040;letter-spacing:.15em}
    .scolors{display:flex;justify-content:center;gap:12px;margin-top:20px}
    .schip{display:flex;align-items:center;gap:5px;font-size:9px;letter-spacing:.1em}
    .sdot{width:8px;height:8px;border-radius:50%}

    .thnk-w{display:flex;flex-direction:column;align-items:center;padding:26px 0 16px}
    .chk-w{margin-bottom:14px;animation:popIn .5s .1s ease both}
    .thnk-n{font-family:'Syne Mono',monospace;font-size:20px;color:#1a1a0a;margin-bottom:8px;text-align:center}
    .thnk-s{font-size:12.5px;color:#5c4a1e;line-height:1.75;text-align:center;max-width:360px;margin-bottom:16px}
    .thnk-tag{display:inline-block;padding:6px 16px;border-radius:2px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;border:1.5px solid}
    .thnk-agent{font-size:11px;color:#8c7040;text-align:center;letter-spacing:.08em;margin-top:6px}

    /* Home button on thanks page */
    .home-btn{width:100%;padding:12px;border:1.5px solid #c9b070;background:#faf6e8;
      font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.1em;color:#5c4a1e;
      cursor:pointer;border-radius:3px;box-shadow:2px 2px 0 #c9b070;transition:all .15s;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:8px}
    .home-btn:hover{background:#1a2e08;color:#a8e060;border-color:#1a2e08}

    .overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:100;display:flex;flex-direction:column}
    .ov-bg{flex:1;background:rgba(26,26,10,.6);cursor:pointer}
    .ov-p{background:#ede8d8;border-top:3px solid #1a2e08;max-height:90vh;overflow-y:auto;animation:slideUp .35s ease;padding:0 16px 40px}
    .ov-h{position:sticky;top:0;background:#1a2e08;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;margin:0 -16px 14px}
    .ov-ht{font-size:9px;color:#a8e060;letter-spacing:.15em;text-transform:uppercase;flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .ov-close{background:transparent;border:1px solid #2d5c10;color:#5cba2c;border-radius:2px;padding:4px 10px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.08em;transition:all .14s;white-space:nowrap;margin-left:8px}
    .ov-close:hover{background:#2d5c10;color:#a8e060}

    .cons-btn{position:fixed;bottom:18px;right:14px;z-index:50;background:#1a2e08;border:2px solid #2d5c10;color:#a8e060;border-radius:3px;padding:9px 14px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;box-shadow:3px 3px 0 #0d1a04;transition:all .18s;animation:popIn .5s 1.8s ease both;opacity:0}
    .cons-btn:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #0d1a04}

    /* PWA install button */
    .pwa-btn{position:fixed;bottom:18px;left:14px;z-index:50;background:#faf6e8;border:2px solid #c9b070;color:#3d2e0a;border-radius:3px;padding:9px 14px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.08em;box-shadow:3px 3px 0 #c9b070;transition:all .18s;animation:popIn .5s 2s ease both;display:flex;align-items:center;gap:6px}
    .pwa-btn:hover{background:#1a2e08;color:#a8e060;border-color:#1a2e08;box-shadow:3px 3px 0 #0d1a04}

    /* PDF button */
    .pdf-btn{width:100%;padding:12px;border:2px solid #b91c1c;background:#fff1f2;color:#7f1d1d;font-family:'Syne Mono',monospace;font-size:11px;letter-spacing:.1em;cursor:pointer;border-radius:3px;box-shadow:3px 3px 0 #fca5a5;transition:all .18s;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:8px}
    .pdf-btn:hover:not(:disabled){background:#b91c1c;color:#fff;border-color:#7f1d1d}
    .pdf-btn:disabled{opacity:.5;cursor:not-allowed}

    .pb{padding:17px 19px;border-radius:3px;margin-bottom:11px;border:2px solid;box-shadow:4px 4px 0}
    .pb-top{display:flex;align-items:center;gap:11px;margin-bottom:9px;flex-wrap:wrap}
    .pb-sym{font-size:32px;font-family:'Syne Mono',monospace;line-height:1}
    .pb-sym2{font-size:20px;font-family:'Syne Mono',monospace;line-height:1;opacity:.7}
    .pb-n{font-family:'Syne Mono',monospace;font-size:17px;font-weight:700}
    .pb-s{font-size:10px;opacity:.6;margin-top:2px;letter-spacing:.04em}
    .pb-tag{margin-left:auto;font-size:9px;letter-spacing:.12em;padding:4px 9px;border-radius:2px;border:1px solid;text-transform:uppercase;white-space:nowrap}
    .hyb{display:inline-block;font-size:9px;letter-spacing:.12em;background:#1a2e08;color:#a8e060;padding:2px 8px;border-radius:2px;margin-bottom:6px}
    .brw{display:flex;align-items:center;gap:8px;margin-bottom:7px}
    .bsym{font-size:11px;width:14px;text-align:center}
    .blbl{font-size:9px;letter-spacing:.08em;width:58px}
    .btrk{flex:1;height:5px;background:#d5c080;border-radius:1px;overflow:hidden}
    .bfil{height:5px;border-radius:1px;transition:width 1.3s cubic-bezier(.4,0,.2,1)}
    .bval{font-size:10px;width:32px;text-align:right;font-weight:600}
    .sbox{background:#1a2e08;border:2px solid #2d5c10;border-radius:3px;padding:17px 19px;margin-bottom:11px;box-shadow:4px 4px 0 #0d1a04}
    .sbox-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:11px}
    .slbl{font-size:9px;color:#5cba2c;letter-spacing:.18em;text-transform:uppercase}
    .cpbtn{background:transparent;border:1px solid #2d5c10;border-radius:2px;padding:4px 10px;cursor:pointer;color:#5cba2c;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.08em;transition:all .14s}
    .cpbtn:hover{background:#2d5c10;color:#a8e060}
    .stxt{color:#c8f080;font-size:13px;line-height:1.9;font-style:italic}
    .cur{display:inline-block;width:8px;height:13px;background:#5cba2c;margin-left:2px;animation:blink .7s infinite;vertical-align:middle}
    .ibox{padding:11px 15px;border-radius:3px;border:1.5px solid;margin-bottom:9px;box-shadow:3px 3px 0}
    .ihd{font-size:9px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:7px}
    .ibody{font-size:12.5px;line-height:1.7}
    .tcol{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px}
    @media(max-width:480px){.tcol{grid-template-columns:1fr}}
    .avr{display:flex;gap:9px;margin-bottom:6px;align-items:flex-start}
    .diam-wrap{display:flex;justify-content:center;margin:4px 0 12px}
    .divider{border:none;border-top:1px dashed #c9b070;margin:9px 0}
    .fade-in{animation:fadeIn .3s ease}
  `;

  const qph=QS[qi]?.ph||1;
  const phasePct=(qi/QS.length)*100;
  const hasAns=!!ans[QS[qi]?.id];

  return(
    <>
      <style>{css}</style>
      <div className="sh">
        <div className="inn">

          {/* HEADER */}
          <div className="hbar">
            <div className="h-top">
              <div>
                <span className="h-sys">GAYRİMENKUL DANIŞMANLIĞI</span>
                <span className="h-tit">Tercih <em>Rehberi</em></span>
              </div>
              <div className="h-r">
                <span className="h-ver">12Q / DISC</span>
                <span className="led"/>
              </div>
            </div>
            <div className="divider" style={{marginTop:7,marginBottom:7}}/>
            <div className="h-brand">
              <div className="h-logo">TQ</div>
              <div className="h-brand-name">
                <strong>{BRAND.agent}</strong>
                {BRAND.company} · {BRAND.tagline}
              </div>
            </div>
          </div>

          {/* ── INTRO ── */}
          {phase==="intro"&&(
            <div className="fade-in">
              <div className="card">
                <div className="chd">HOŞ GELDİNİZ</div>
                <p style={{fontSize:13,color:"#2d2010",lineHeight:1.75,marginBottom:12}}>
                  Size en uygun gayrimenkul deneyimini sunabilmek için birkaç <strong>tercih sorusu</strong> sormak istiyoruz.
                </p>
                <p style={{fontSize:12,color:"#5c4a1e",lineHeight:1.65,marginBottom:14}}>
                  Yaklaşık <strong>3-4 dakika</strong> süren bu kısa rehber, danışmanınızın size özel bir hizmet sunmasına yardımcı olur.
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                  {[["⏱","3-4 dak."],["❓","12 soru"],["🎯","Kişiselleştirilmiş"]].map(([ic,lb],i)=>(
                    <div key={i} style={{background:"#f5eecc",border:"1.5px solid #c9b070",borderRadius:3,padding:"10px 8px",textAlign:"center",fontSize:11,color:"#5c4a1e"}}>
                      <div style={{fontSize:20,marginBottom:4}}>{ic}</div>{lb}
                    </div>
                  ))}
                </div>
              </div>
              <button className="pbtn" onClick={()=>setPhase("role")}>[ BAŞLA → ]</button>
            </div>
          )}

          {/* ── ROLE ── */}
          {phase==="role"&&(
            <div className="fade-in">
              <div className="card">
                <div className="chd">SİZİ DAHA İYİ TANIYALIM</div>
                <p style={{fontSize:12.5,color:"#5c4a1e",lineHeight:1.65,marginBottom:14}}>Mülk yolculuğunuz hangi aşamada?</p>
                <div className="role-g">
                  {[{id:"buyer",icon:"🏠",lbl:"ALICI",sub:"Mülk satın almak istiyorum"},
                    {id:"seller",icon:"🔑",lbl:"SATICI",sub:"Mülkümü satmak istiyorum"}].map(r=>(
                    <button key={r.id} className={`rbtn${role===r.id?" sel":""}`} onClick={()=>setRole(r.id)}>
                      <span style={{fontSize:26,display:"block",marginBottom:7}}>{r.icon}</span>
                      <span style={{fontSize:13,fontWeight:600,display:"block",letterSpacing:".08em"}}>{r.lbl}</span>
                      <span style={{fontSize:10,opacity:.6,display:"block",marginTop:3}}>{r.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button className="pbtn" disabled={!role} onClick={()=>{setQi(0);setAns({});setPhase("quiz");}}>
                {role?"[ DEVAM → ]":"[ LÜTFEN SEÇİNİZ ]"}
              </button>
              <button className="sbtn" onClick={()=>setPhase("intro")}>← ANA SAYFA</button>
            </div>
          )}

          {/* ── QUIZ ── */}
          {phase==="quiz"&&(
            <div key={qi} className="fade-in">
              <div className="ph-ban">
                <div className="ph-dot"/>
                <span className="ph-lbl">BÖLÜM {qph} — {PHASES[qph]}</span>
                <span className="ph-num">SORU {qi+1}/{QS.length}</span>
              </div>
              <div>
                <div className="prog-r">
                  {QS.map((_,i)=><div key={i} className={`pseg${i<qi?" done":i===qi?" act":""}`}/>)}
                </div>
                <div className="pm">
                  <span>{Math.round(phasePct)}% tamamlandı</span>
                  <span style={{color:qph===1?"#b91c1c":qph===2?"#d97706":"#2563eb"}}>{QS[qi].top}</span>
                </div>
              </div>
              <div className="card">
                <span className="q-top">{QS[qi].top}</span>
                <p className="q-txt">{QS[qi].q}</p>
                {QS[qi].o.map((opt,i)=>{
                  const isSel=ans[QS[qi].id]===opt.v;
                  return(
                    <button key={i} className={`opt${isSel?" selected":""}`} onClick={()=>pick(opt.v)}>
                      <span className="ok">{isSel?"✓":opt.v}</span>
                      <span>{opt.t}</span>
                      {isSel&&<span className="sel-tick">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Navigation row */}
              <div className="nav-row">
                <button className="nav-back" onClick={goBack}>
                  ← {qi===0?"POZİSYON":"ÖNCEKİ"}
                </button>
                <button
                  className={`nav-next${hasAns?" enabled":" disabled"}`}
                  onClick={goForward}
                  disabled={!hasAns}>
                  {qi===QS.length-1?"BİLGİ FORMU →":"SONRAKİ SORU →"}
                </button>
              </div>
            </div>
          )}

          {/* ── CONTACT ── */}
          {phase==="contact"&&(
            <div className="fade-in">
              <div className="card">
                <div className="chd">BİLGİLERİNİZ</div>
                <p style={{fontSize:12.5,color:"#5c4a1e",lineHeight:1.65,marginBottom:16}}>
                  {BRAND.agent}'nun size özel rehber hazırlayabilmesi için birkaç bilgiye ihtiyaç var.
                </p>
                <div className="frow">
                  <div className="fw">
                    <label className="fl">AD <span className="req">*</span></label>
                    <input className={`fi${errs.name?" err":""}`} type="text" placeholder="Adınız"
                      value={info.name} onChange={e=>{setInfo(p=>({...p,name:e.target.value}));setErrs(p=>({...p,name:""}));}}/>
                    {errs.name&&<div className="fe">⚠ {errs.name}</div>}
                  </div>
                  <div className="fw">
                    <label className="fl">SOYAD <span className="req">*</span></label>
                    <input className={`fi${errs.surname?" err":""}`} type="text" placeholder="Soyadınız"
                      value={info.surname} onChange={e=>{setInfo(p=>({...p,surname:e.target.value}));setErrs(p=>({...p,surname:""}));}}/>
                    {errs.surname&&<div className="fe">⚠ {errs.surname}</div>}
                  </div>
                </div>
                <div className="fw">
                  <label className="fl">CİNSİYET <span className="req">*</span></label>
                  <div className="gen-g">
                    {[{v:"erkek",lbl:"👨 Bay"},{v:"kadin",lbl:"👩 Bayan"}].map(g=>(
                      <button key={g.v} className={`gbtn${info.gender===g.v?" sel":""}`}
                        onClick={()=>{setInfo(p=>({...p,gender:g.v}));setErrs(p=>({...p,gender:""}));}}>
                        {g.lbl}
                      </button>
                    ))}
                  </div>
                  {errs.gender&&<div className="fe" style={{marginTop:5}}>⚠ {errs.gender}</div>}
                </div>
                <div className="fw">
                  <label className="fl">TELEFON <span className="req">*</span></label>
                  <div className="ph-w">
                    <input className={`fi${errs.phone?" err":""}`} type="tel" placeholder="05XX XXX XX XX"
                      value={info.phone} onChange={handlePhone} style={{paddingRight:50}}/>
                    <span className="ph-c" style={{color:info.phone.length===11?"#2d5c10":"#8c7040"}}>{info.phone.length}/11</span>
                  </div>
                  {errs.phone?<div className="fe">⚠ {errs.phone}</div>:<div className="fh">Başında 0 ile 11 rakam</div>}
                  {info.phone.length>0&&info.phone.length<11&&!errs.phone&&(
                    <div style={{fontSize:10,color:"#d97706",marginTop:3}}>↳ {11-info.phone.length} rakam daha</div>
                  )}
                </div>
                <div className="fw">
                  <label className="fl">E-POSTA <span className="opt-lbl">(OPSİYONEL)</span></label>
                  <input className={`fi${errs.email?" err":""}`} type="email" placeholder="ornek@mail.com"
                    value={info.email} onChange={e=>{setInfo(p=>({...p,email:e.target.value}));setErrs(p=>({...p,email:""}));}}/>
                  {errs.email?<div className="fe">⚠ {errs.email}</div>:<div className="fh">İsterseniz sonuçları e-posta ile alın</div>}
                </div>
              </div>
              <button className="pbtn" onClick={submitContact}>[ TAMAMLA → ]</button>
              <button className="sbtn" onClick={()=>{setPhase("quiz");setQi(QS.length-1);}}>← SORULARA DÖN</button>
            </div>
          )}

          {/* ── SCAN ── */}
          {phase==="scan"&&(
            <div className="scan-w fade-in">
              <p className="scan-t">// PROFİL HAZIRLANIYOR</p>
              <p className="scan-s">TERCİHLERİNİZ İŞLENİYOR...</p>
              <div style={{maxWidth:340,margin:"0 auto 6px"}}>
                <div className="sbar-o"><div className="sbar-i" style={{width:`${pct}%`}}/></div>
                <p className="spct">{Math.floor(pct)}%</p>
              </div>
              <div className="scolors">
                {Object.entries(PM).map(([k,m],i)=>(
                  <div key={k} className="schip" style={{color:m.col,animation:`blink ${.7+i*.25}s infinite`}}>
                    <div className="sdot" style={{background:m.col}}/>{m.lbl}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── THANKS (CLIENT VIEW — FROZEN) ── */}
          {phase==="thanks"&&pm&&(
            <div className="fade-in">
              <div className="thnk-w">
                <div className="chk-w"><CheckAnim/></div>
                <h2 className="thnk-n">
                  Teşekkürler,<br/>
                  <span style={{color:pm.col}}>{info.name} {salT}</span>!
                </h2>
                <p className="thnk-s">
                  Profiliniz oluşturuldu. <strong>{BRAND.agent}</strong>, tercihlerinize
                  göre size özel bir deneyim sunmak için en kısa sürede iletişime geçecek.
                </p>
                <div className="thnk-tag" style={{color:pm.col,borderColor:pm.brd,background:pm.bg}}>
                  {pm.soft}
                </div>
                {pm2&&<div style={{fontSize:11,color:pm2.col,marginBottom:12,letterSpacing:".08em"}}>+ {pm2.soft}</div>}
                <div className="thnk-agent">{BRAND.agent} · {BRAND.company}</div>
              </div>

              {/* Home / Restart button — client visible */}
              <button className="home-btn" onClick={hardReset}>
                <span>🏠</span> Ana Sayfaya Dön
              </button>

              {/* Consultant trigger */}
              <button className="cons-btn" onClick={()=>setPanel(true)}>📊 DANIŞMAN</button>
            </div>
          )}

        </div>
      </div>

      {/* PWA Install button */}
      {installPrompt&&!installed&&(
        <button className="pwa-btn" onClick={installApp}>
          <span>📲</span> Uygulamayı Yükle
        </button>
      )}

      {/* ══ DANIŞMAN PANELİ ════════════════════════════════════ */}
      {panel&&res&&pm&&(
        <div className="overlay">
          <div className="ov-bg" onClick={()=>setPanel(false)}/>
          <div className="ov-p">
            <div className="ov-h">
              <span className="ov-ht">📊 {info.name} {info.surname} {salT} · {info.phone}{info.email?` · ${info.email}`:""}</span>
              <button className="ov-close" onClick={()=>setPanel(false)}>✕</button>
            </div>

            {/* Lead stamp */}
            <div style={{background:"#1a2e08",borderRadius:3,padding:"9px 13px",marginBottom:11,display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"#5cba2c",letterSpacing:".15em",marginBottom:2}}>LEADHUNTER'A GÖNDERİLDİ ✓</div>
                <div style={{fontSize:13,color:"#a8e060",fontFamily:"'Syne Mono',monospace"}}>{info.name} {info.surname} {salT}</div>
                <div style={{fontSize:10,color:"#4a8c20",marginTop:2}}>{role==="buyer"?"Alıcı":"Satıcı"} · {info.phone}{info.email?` · ${info.email}`:""}</div>
              </div>
              <div style={{textAlign:"right",fontSize:9,color:"#4a8c20"}}>{new Date().toLocaleDateString("tr-TR")}</div>
            </div>

            {/* Profile badge */}
            <div className="pb" style={{background:pm.bg,borderColor:pm.brd,boxShadow:`4px 4px 0 ${pm.brd}`,color:pm.col}}>
              {prof?.isHybrid&&pm2&&<div className="hyb">MELEZ: {pm.lbl} + {pm2.lbl}</div>}
              <div className="pb-top">
                <span className="pb-sym">{pm.sym}</span>
                {pm2&&<span className="pb-sym2" style={{color:pm2.col}}>{pm2.sym}</span>}
                <div><div className="pb-n">{pm.lbl}{pm2?` + ${pm2.lbl}`:""}</div><div className="pb-s">{res.profile_title}</div></div>
                <div className="pb-tag" style={{color:pm.col,borderColor:pm.brd,background:pm.lt}}>{pm.tag}</div>
              </div>
              <p style={{fontSize:12.5,lineHeight:1.75,opacity:.82}}>{res.profile_summary}</p>
            </div>

            {/* Diamond + bars */}
            <div className="card">
              <div className="chd">AI DISC DİYAGRAMI — ALGORİTMİK SKOR</div>
              <div className="diam-wrap"><Diamond sc={res.scores} size={196}/></div>
              {Object.entries(PM).map(([k,m])=>(
                <div key={k} className="brw">
                  <span className="bsym" style={{color:m.col}}>{m.sym}</span>
                  <span className="blbl" style={{color:m.col,fontSize:"9px"}}>{m.lbl}</span>
                  <div className="btrk"><div className="bfil" style={{width:`${res.scores[k]||0}%`,background:m.col}}/></div>
                  <span className="bval" style={{color:m.col}}>{res.scores[k]}%</span>
                </div>
              ))}
            </div>

            {/* Script */}
            <div className="sbox">
              <div className="sbox-hd">
                <span className="slbl">// SATIŞ SCRİPTİ</span>
                <button className="cpbtn" onClick={()=>{navigator.clipboard.writeText(res.script);setCpd(true);setTimeout(()=>setCpd(false),2000);}}>
                  {cpd?"✓ OK":"KOPYALA"}
                </button>
              </div>
              <p className="stxt">"{typed}"{typed.length<(res.script?.length||0)&&<span className="cur"/>}</p>
            </div>

            {/* Closing */}
            {res.closing_line&&(
              <div className="ibox" style={{background:"#1a2e08",borderColor:"#2d5c10",boxShadow:"3px 3px 0 #0d1a04"}}>
                <div className="ihd" style={{color:"#5cba2c"}}>🎯 KAPANIŞ CÜMLESİ</div>
                <p className="ibody" style={{color:"#c8f080",fontStyle:"italic"}}>"{res.closing_line}"</p>
              </div>
            )}

            {/* Two col */}
            <div className="tcol">
              {res.power_move&&(
                <div className="ibox" style={{background:pm.bg,borderColor:pm.brd,boxShadow:`3px 3px 0 ${pm.brd}`}}>
                  <div className="ihd" style={{color:pm.col}}>⚡ KAPANIŞ HAMLESİ</div>
                  <p className="ibody" style={{color:pm.col}}>{res.power_move}</p>
                </div>
              )}
              {res.urgency_trigger&&(
                <div className="ibox" style={{background:"#fffbeb",borderColor:"#fcd34d",boxShadow:"3px 3px 0 #fcd34d"}}>
                  <div className="ihd" style={{color:"#92400e"}}>🔑 TETİKLEYİCİ</div>
                  <p className="ibody" style={{color:"#78350f",fontStyle:"italic"}}>"{res.urgency_trigger}"</p>
                </div>
              )}
            </div>

            {/* Trust */}
            {res.trust_builder&&(
              <div className="ibox" style={{background:"#f0fdf4",borderColor:"#86efac",boxShadow:"3px 3px 0 #86efac"}}>
                <div className="ihd" style={{color:"#14532d"}}>🤝 GÜVEN İNŞASI</div>
                <p className="ibody" style={{color:"#14532d"}}>{res.trust_builder}</p>
              </div>
            )}

            {/* Anti + Avoid */}
            <div className="card">
              <div className="chd">ANTİ-SCRİPT & KAÇIN</div>
              {res.anti_script&&(
                <div style={{background:"#fff1f2",border:"1.5px solid #fca5a5",borderRadius:3,padding:"9px 12px",marginBottom:9}}>
                  <span style={{fontSize:9,color:"#b91c1c",fontWeight:600,letterSpacing:".1em",display:"block",marginBottom:3}}>ASLA SÖYLEME:</span>
                  <span style={{fontSize:12.5,color:"#7f1d1d",lineHeight:1.6}}>{res.anti_script}</span>
                </div>
              )}
              {res.avoid?.map((a,i)=>(
                <div key={i} className="avr">
                  <span style={{color:"#b91c1c",fontSize:13,lineHeight:1.4}}>✕</span>
                  <span style={{fontSize:12.5,color:"#2d2010",lineHeight:1.55}}>{a}</span>
                </div>
              ))}
            </div>

            {/* Warning */}
            {res.warning&&(
              <div className="ibox" style={{background:"#fefce8",borderColor:"#fde047",boxShadow:"3px 3px 0 #fde047",marginBottom:12}}>
                <div className="ihd" style={{color:"#854d0e"}}>⚠ KRİTİK HATA</div>
                <p className="ibody" style={{color:"#713f12"}}>{res.warning}</p>
              </div>
            )}

            {/* PDF Download */}
            <button className="pdf-btn" onClick={generatePDF} disabled={pdfLoading}>
              {pdfLoading
                ? <><span style={{animation:"pulse 1s infinite"}}>⏳</span> PDF Hazırlanıyor...</>
                : <><span>📄</span> PDF İNDİR — Türkçe Rapor</>}
            </button>

            {/* Copy all */}
            <button className="pbtn" onClick={copyAll} style={{marginBottom:8}}>
              {cpd?"[ ✓ RAPOR KOPYALANDI ]":"[ 📋 TÜM RAPORU KOPYALA ]"}
            </button>

            {/* Reset */}
            <button className="sbtn" onClick={()=>{setPanel(false);hardReset();}}>
              🏠 Ana Sayfaya Dön — Yeni Analiz
            </button>

            <div style={{textAlign:"center",fontSize:9,color:"#8c7040",letterSpacing:".1em",marginTop:10}}>
              {BRAND.agent} · {BRAND.company} · {new Date().toLocaleDateString("tr-TR")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

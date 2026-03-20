import { useState, useRef, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "https://exoneditor-api.onrender.com";

const C = {
  bg:"#07090f",bg2:"#0d1117",bg3:"#111827",bg4:"#1e293b",
  border:"rgba(255,255,255,0.08)",
  green:"#4ade80",green2:"#16a34a",
  blue:"#60a5fa",blue2:"#2563eb",
  purple:"#a78bfa",red:"#f87171",red2:"#b91c1c",
  amber:"#fbbf24",text:"#f1f5f9",muted:"#64748b",muted2:"#94a3b8",
};
function rgb(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`${r},${g},${b}`;}

function Btn({children,onClick,color=C.blue2,disabled,small,full,style={}}){
  return<button onClick={onClick} disabled={disabled} style={{
    background:disabled?"#1e293b":color,color:disabled?C.muted:"#fff",
    border:"none",borderRadius:8,padding:small?"5px 12px":"8px 18px",
    fontSize:small?12:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
    fontFamily:"inherit",width:full?"100%":"auto",...style}}/>;
}
function Btn2({children,onClick,color=C.blue2,disabled,small,full,style={}}){
  return<button onClick={onClick} disabled={disabled} style={{
    background:disabled?"#1e293b":color,color:disabled?C.muted:"#fff",
    border:"none",borderRadius:8,padding:small?"5px 12px":"8px 18px",
    fontSize:small?12:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
    fontFamily:"inherit",width:full?"100%":"auto",...style}}>{children}</button>;
}
function Input({value,onChange,placeholder,onKeyDown,width="100%",mono}){
  return<input value={value} onChange={e=>onChange(e.target.value)} onKeyDown={onKeyDown}
    placeholder={placeholder} style={{width,background:C.bg3,border:`1px solid ${C.border}`,
    borderRadius:7,padding:"7px 12px",color:C.text,fontSize:13,
    fontFamily:mono?"monospace":"inherit",outline:"none"}}/>;
}
function Tag({children,color=C.blue}){
  return<span style={{background:`rgba(${rgb(color)},.12)`,color,
    border:`1px solid rgba(${rgb(color)},.25)`,borderRadius:100,
    padding:"2px 10px",fontSize:11,fontWeight:600,fontFamily:"monospace"}}>{children}</span>;
}
function Card({title,children,accent=C.blue,action}){
  return<div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
    {title&&<div style={{padding:"9px 16px",borderBottom:`1px solid ${C.border}`,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      fontSize:12,fontWeight:700,color:accent,background:`rgba(${rgb(accent)},.06)`}}>
      <span>{title}</span>{action}</div>}
    <div style={{padding:16}}>{children}</div>
  </div>;
}
function Spin(){return<span style={{display:"inline-block",width:12,height:12,
  border:`2px solid ${C.border}`,borderTopColor:C.blue,borderRadius:"50%",
  animation:"spin .7s linear infinite",verticalAlign:"middle",marginRight:5}}/>;}

function BarraGene({total,exons,marcadores=[]}){
  if(!total||!exons.length)return<div style={{height:44,background:"#1e293b",borderRadius:6,
    display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontSize:12}}>
    Aguardando éxons…</div>;
  return<div style={{position:"relative",height:44,borderRadius:6,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:"8px 0",background:"#aaaaaa"}}/>
    {exons.map((ex,i)=>{
      const x1=((ex.inicio-1)/total)*100,x2=(ex.fim/total)*100;
      return<div key={i} style={{position:"absolute",top:8,bottom:8,
        left:`${x1}%`,width:`${Math.max(x2-x1,.15)}%`,background:ex.cor||"#000",borderRadius:1}}/>;
    })}
    {marcadores.filter(Boolean).map((m,i)=>{
      const xc=Math.max(1,Math.min(99,((m.pi+m.pf)/2/total)*100));
      return<div key={i} style={{position:"absolute",top:0,bottom:0,left:`${xc}%`,
        transform:"translateX(-50%)",display:"flex",flexDirection:"column",
        alignItems:"center",pointerEvents:"none"}}>
        <div style={{width:0,height:0,borderLeft:"5px solid transparent",
          borderRight:"5px solid transparent",borderTop:`9px solid ${m.cor}`,marginTop:2}}/>
        <div style={{width:1.5,flex:1,background:m.cor,opacity:.7}}/>
        <span style={{fontSize:9,color:m.cor,fontWeight:700,fontFamily:"monospace",
          whiteSpace:"nowrap",marginBottom:2}}>{m.label}</span>
      </div>;
    })}
  </div>;
}

function TabelaExons({exons,setExons,totalSeq}){
  const[ini,setIni]=useState("");const[fim,setFim]=useState("");const[cor,setCor]=useState("#000000");
  const add=()=>{
    const s=parseInt(ini),f=parseInt(fim);
    if(!s||!f||s>=f){alert("Início deve ser menor que Fim");return;}
    if(totalSeq&&f>totalSeq){alert(`Fim excede ${totalSeq} pb`);return;}
    setExons(p=>[...p,{numero:p.length+1,inicio:s,fim:f,cor,fonte:"Courier New",tamanho:11}]);
    setIni("");setFim("");
  };
  const rem=i=>setExons(p=>p.filter((_,j)=>j!==i).map((e,j)=>({...e,numero:j+1})));
  return<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
      <Input value={ini} onChange={setIni} placeholder="Início" width="90px" mono/>
      <Input value={fim} onChange={setFim} placeholder="Fim" width="90px" mono/>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontSize:11,color:C.muted}}>Cor:</span>
        <input type="color" value={cor} onChange={e=>setCor(e.target.value)}
          style={{width:28,height:26,border:"none",background:"none",cursor:"pointer"}}/>
      </div>
      <Btn2 onClick={add} small color={C.green2}>＋ Adicionar</Btn2>
      {exons.length>0&&<Btn2 onClick={()=>setExons([])} small color={C.muted}
        style={{marginLeft:"auto"}}>🗑 Limpar</Btn2>}
    </div>
    {exons.length>0&&<div style={{maxHeight:180,overflowY:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead><tr style={{color:C.muted,borderBottom:`1px solid ${C.border}`}}>
          {["Éxon","Início","Fim","Tam","Cor",""].map(h=>
            <th key={h} style={{padding:"3px 8px",textAlign:"left",fontWeight:500}}>{h}</th>)}
        </tr></thead>
        <tbody>{exons.map((e,i)=><tr key={i} style={{borderBottom:`1px solid rgba(255,255,255,.04)`}}>
          <td style={{padding:"3px 8px",color:C.green}}>Éxon {e.numero}</td>
          <td style={{padding:"3px 8px",fontFamily:"monospace"}}>{e.inicio?.toLocaleString()}</td>
          <td style={{padding:"3px 8px",fontFamily:"monospace"}}>{e.fim?.toLocaleString()}</td>
          <td style={{padding:"3px 8px",color:C.muted2}}>{e.fim-e.inicio+1}pb</td>
          <td style={{padding:"3px 8px"}}>
            <div style={{width:14,height:14,background:e.cor||"#000",borderRadius:3,border:`1px solid ${C.border}`}}/>
          </td>
          <td style={{padding:"3px 8px"}}>
            <button onClick={()=>rem(i)} style={{background:"none",border:"none",
              color:C.red,cursor:"pointer",fontSize:13}}>×</button>
          </td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>;
}

export default function App(){
  const[modo,setModo]=useState(null);
  // auto
  const[termo,setTermo]=useState("");const[org,setOrg]=useState("Homo sapiens");
  const[results,setResults]=useState([]);const[selIdx,setSelIdx]=useState(null);
  // estado geral
  const[loading,setLoading]=useState(false);const[status,setStatus]=useState("");
  const[erro,setErro]=useState("");const[geneData,setGeneData]=useState(null);
  const[exons,setExons]=useState([]);
  // manual
  const fileRef=useRef();
  const[seqManual,setSeqManual]=useState(null);const[checkOk,setCheckOk]=useState(false);
  const[featText,setFeatText]=useState("");const[showModal,setShowModal]=useState(false);
  // análise
  const[aasIn,setAasIn]=useState("");const[resAas,setResAas]=useState(null);
  const[numAa,setNumAa]=useState("");const[resLoc,setResLoc]=useState(null);
  const[resStop,setResStop]=useState(null);
  const[marcLoc,setMarcLoc]=useState(null);const[marcStop,setMarcStop]=useState(null);
  const[utrOn,setUtrOn]=useState(false);const[utrReg,setUtrReg]=useState(null);
  const[gLoc,setGLoc]=useState(null);const[gStop,setGStop]=useState(null);
  // doc
  const[caixa,setCaixa]=useState("minuscula");const[corBase,setCorBase]=useState("#aaaaaa");
  const[genDoc,setGenDoc]=useState(false);

  const reset=()=>{setModo(null);setGeneData(null);setExons([]);setSeqManual(null);
    setCheckOk(false);setResults([]);setSelIdx(null);setErro("");setStatus("");
    setResAas(null);setResLoc(null);setResStop(null);setMarcLoc(null);setMarcStop(null);
    setUtrOn(false);setUtrReg(null);setGLoc(null);setGStop(null);};

  const buscar=useCallback(async()=>{
    if(!termo.trim())return;
    setLoading(true);setErro("");setResults([]);setSelIdx(null);
    try{
      const q=`(${termo}[Gene Name] OR ${termo}[Accession])`;
      const r=await fetch(`${API}/buscar?termo=${encodeURIComponent(q)}&organismo=${encodeURIComponent(org)}`);
      const d=await r.json();
      setResults(d.resultados||[]);
      if(!d.resultados?.length)setErro("Nenhum resultado encontrado.");
    }catch{setErro("Erro de conexão.");}
    setLoading(false);
  },[termo,org]);

  const carregar=useCallback(async()=>{
    if(selIdx===null)return;
    const acc=results[selIdx].acc;
    setLoading(true);setErro("");
    setResAas(null);setResLoc(null);setResStop(null);
    setMarcLoc(null);setMarcStop(null);setGLoc(null);setGStop(null);
    setUtrOn(false);setUtrReg(null);
    setStatus("Passo 1/2 — detectando região…");
    try{
      let r=await fetch(`${API}/carregar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({acc})});
      let d=await r.json();
      if(d.detail)throw new Error(d.detail);
      const reg=d.regiao_sugerida;
      if(reg){
        setStatus(`Passo 2/2 — região ${reg.de.toLocaleString()}–${reg.ate.toLocaleString()} pb…`);
        r=await fetch(`${API}/carregar`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({acc,seq_start:reg.de,seq_stop:reg.ate})});
        d=await r.json();
        if(d.detail)throw new Error(d.detail);
      }
      setGeneData(d);
      setExons((d.exons||[]).map(e=>({...e,cor:"#000000",fonte:"Courier New",tamanho:11})));
      setStatus(`✅ ${d.accession} — ${d.total_pb?.toLocaleString()} pb, ${d.exons?.length} éxons`);
    }catch(e){setErro(String(e.message||e));setStatus("");}
    setLoading(false);
  },[selIdx,results]);

  const uploadDocx=useCallback(async(file)=>{
    setLoading(true);setErro("");setSeqManual(null);setGeneData(null);setExons([]);
    try{
      const form=new FormData();form.append("file",file);
      const r=await fetch(`${API}/upload-docx`,{method:"POST",body:form});
      const d=await r.json();
      if(d.detail)throw new Error(d.detail);
      setSeqManual(d);
    }catch(e){setErro(String(e.message||e));}
    setLoading(false);
  },[]);

  const confirmarManual=()=>{
    setCheckOk(true);
    setGeneData({sequencia:seqManual.sequencia,total_pb:seqManual.total_pb,
      accession:"Manual",definicao:"Sequência carregada manualmente",
      organismo:"",exons:[],proteinas:[],proteina_nascente:"",proteina_madura_seq:"",regiao_sugerida:null});
  };

  const importarFeatures=useCallback(async()=>{
    if(!featText.trim())return;
    try{
      const r=await fetch(`${API}/parsear-features`,{method:"POST",
        headers:{"Content-Type":"application/json"},body:JSON.stringify({texto:featText})});
      const d=await r.json();
      if(d.detail)throw new Error(d.detail);
      const tot=seqManual?.total_pb||Infinity;
      const v=d.exons.filter(e=>e.fim<=tot);
      setExons(v.map(e=>({...e,cor:"#000000",fonte:"Courier New",tamanho:11})));
      setFeatText("");setShowModal(false);
      alert(`✅ ${v.length} éxon(s) importado(s)`);
    }catch(e){setErro(String(e.message||e));}
  },[featText,seqManual]);

  const analisarCodons=useCallback(async(aas)=>{
    if(!geneData?.sequencia)return;
    const p=aas.split(/[,\s]+/).map(s=>s.trim()).filter(Boolean);
    if(p.length<3){setResAas({erro:"Mínimo 3 aminoácidos."});return;}
    try{
      const r=await fetch(`${API}/analisar-codons`,{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({sequencia:geneData.sequencia,
          proteina_nascente:geneData.proteina_nascente||"",
          coords_cds:geneData.proteinas?.[0]?.coords_cds||[],aas_entrada:p})});
      const d=await r.json();
      setResAas(d);
      if(d.encontrado&&d.posicoes_gene?.[0]>0&&exons.length){
        const atg=d.posicoes_gene[0],ex1=exons[0].inicio;
        if(atg>ex1)setUtrReg({pos_ini:ex1-1,pos_fim:atg-1,cor:"#6699cc",len:atg-ex1});
      }
    }catch(e){setResAas({erro:String(e)});}
  },[geneData,exons]);

  const autoAas=useCallback(async()=>{
    if(!geneData?.proteina_nascente)return;
    const aas=geneData.proteina_nascente.slice(0,6).split("").join(",");
    setAasIn(aas);await analisarCodons(aas);
  },[geneData,analisarCodons]);

  const locCodon=useCallback(async()=>{
    if(!geneData?.sequencia||!numAa)return;
    try{
      const r=await fetch(`${API}/localizar-codon`,{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({sequencia:geneData.sequencia,
          coords_cds:geneData.proteinas?.[0]?.coords_cds||[],numero_aa:parseInt(numAa)})});
      const d=await r.json();
      setResLoc(d);
      if(!d.erro){
        setMarcLoc({pi:d.pos_inicio-1,pf:d.pos_fim,label:`aa${numAa}`,cor:"#7c3aed"});
        setGLoc({pos_ini:d.pos_inicio-1,pos_fim:d.pos_fim,cor:"#7c3aed",negrito:true});
      }
    }catch(e){setResLoc({erro:String(e)});}
  },[geneData,numAa]);

  const locStop=useCallback(async()=>{
    if(!geneData?.proteina_nascente)return;
    try{
      const r=await fetch(`${API}/stop-codon`,{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({sequencia:geneData.sequencia,
          coords_cds:geneData.proteinas?.[0]?.coords_cds||[],
          proteina_nascente:geneData.proteina_nascente})});
      const d=await r.json();
      setResStop(d);
      if(!d.erro&&d.encontrado){
        setMarcStop({pi:d.pos_inicio-1,pf:d.pos_fim,label:`Stop(${d.codon})`,cor:"#dc2626"});
        setGStop({pos_ini:d.pos_inicio-1,pos_fim:d.pos_fim,cor:"#cc0000",negrito:true});
      }
    }catch(e){setResStop({erro:String(e)});}
  },[geneData]);

  const gerarDoc=useCallback(async(tipo)=>{
    if(!geneData?.sequencia||!exons.length)return;
    setGenDoc(true);
    try{
      const codons_grifar=[gLoc,gStop].filter(Boolean);
      const utr=utrOn&&utrReg?utrReg:null;
      const r=await fetch(`${API}/gerar-documento`,{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({sequencia:geneData.sequencia,exons,tipo,caixa,
          cor_base:corBase,codons_grifar,utr_regiao:utr})});
      if(!r.ok)throw new Error(await r.text());
      const blob=await r.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;
      a.download=tipo==="completo"?"exon_completo.docx":"exon_somente_exons.docx";
      a.click();URL.revokeObjectURL(url);
    }catch(e){setErro(String(e));}
    setGenDoc(false);
  },[geneData,exons,caixa,corBase,gLoc,gStop,utrOn,utrReg]);

  const podeGerar=geneData?.sequencia&&exons.length>0;
  const totSeq=geneData?.total_pb||seqManual?.total_pb||0;
  const noEditor=geneData&&(checkOk||modo==="auto");

  return<div style={{minHeight:"100vh",background:C.bg,color:C.text,
    fontFamily:"'Inter',sans-serif",fontSize:13,lineHeight:1.6}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      @keyframes spin{to{transform:rotate(360deg)}}
      *{box-sizing:border-box}body{margin:0}
      button:hover:not(:disabled){filter:brightness(1.12)}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.bg2}}
      ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
      input[type=color]{cursor:pointer}
      select{outline:none}input{outline:none}
    `}</style>

    {/* HEADER */}
    <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,
      padding:"10px 24px",display:"flex",alignItems:"center",gap:10,
      position:"sticky",top:0,zIndex:50}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {[0,1,2,3,4].map(i=><g key={i}>
          <ellipse cx={6+Math.sin(i)*3} cy={2+i*4} rx={2.5} ry={1.2}
            fill={i%2===0?"#4ade80":"#60a5fa"} opacity={.9}/>
          <ellipse cx={18-Math.sin(i)*3} cy={2+i*4} rx={2.5} ry={1.2}
            fill={i%2===0?"#60a5fa":"#4ade80"} opacity={.9}/>
          <line x1={6+Math.sin(i)*3+2.5} y1={2+i*4} x2={18-Math.sin(i)*3-2.5} y2={2+i*4}
            stroke="#475569" strokeWidth=".7"/>
        </g>)}
      </svg>
      <span style={{fontWeight:700,fontSize:15,letterSpacing:"-.02em"}}>ExonEditor</span>
      <span style={{background:`rgba(${rgb(C.green)},.12)`,color:C.green,
        border:`1px solid rgba(${rgb(C.green)},.25)`,borderRadius:100,
        padding:"1px 8px",fontSize:10,fontWeight:600}}>Web</span>
      {status&&<span style={{color:C.muted2,fontSize:11,marginLeft:8}}>{status}</span>}
      {modo&&<Btn2 onClick={reset} small color={C.bg4} style={{marginLeft:"auto"}}>← Início</Btn2>}
    </div>

    <div style={{maxWidth:1140,margin:"0 auto",padding:24}}>

      {/* TELA INICIAL */}
      {!modo&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",minHeight:"68vh",gap:36}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:34,fontWeight:800,letterSpacing:"-.03em",marginBottom:6}}>
            ExonEditor
          </div>
          <div style={{color:C.muted2,fontSize:14}}>
            Anotação e análise de éxons em sequências genéticas
          </div>
        </div>
        <div style={{display:"flex",gap:20}}>
          {[
            {id:"auto",label:"Modo Automático",sub:"Integração NCBI API",
             desc:"Busca, sequência e éxons\nimportados automaticamente",
             border:"#1e4a7a",hov:C.blue2,
             icon:<svg width="56" height="56" viewBox="0 0 56 56" fill="none">
               <circle cx="28" cy="28" r="26" fill="#1e3a5c" stroke={C.blue2} strokeWidth="1.5"/>
               {[0,1,2,3].map(i=><g key={i}>
                 <circle cx={18+Math.sin(i*1.3)*7} cy={16+i*8} r={3.5} fill={i%2===0?"#4ade80":"#60a5fa"}/>
                 <circle cx={38-Math.sin(i*1.3)*7} cy={16+i*8} r={3.5} fill={i%2===0?"#60a5fa":"#4ade80"}/>
                 <line x1={18+Math.sin(i*1.3)*7+3.5} y1={16+i*8} x2={38-Math.sin(i*1.3)*7-3.5} y2={16+i*8} stroke="#60a5fa" strokeWidth="1" opacity=".5"/>
               </g>)}
             </svg>},
            {id:"manual",label:"Modo Manual",sub:"Upload de arquivo .docx",
             desc:"Faça upload do seu arquivo\nWord com a sequência",
             border:"#1a4a2a",hov:C.green2,
             icon:<svg width="56" height="56" viewBox="0 0 56 56" fill="none">
               <circle cx="28" cy="28" r="26" fill="#0f2a0f" stroke={C.green2} strokeWidth="1.5"/>
               <rect x="16" y="12" width="24" height="34" rx="2" fill="#166534" stroke="#4ade80" strokeWidth="1"/>
               <rect x="16" y="12" width="24" height="10" fill={C.green2}/>
               <text x="28" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">.docx</text>
               {[26,31,36].map(y=><rect key={y} x="20" y={y} width="16" height="2.5" rx="1" fill="#4ade80" opacity=".6"/>)}
               <circle cx="38" cy="40" r="7" fill={C.green2}/>
               <text x="38" y="44" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">↑</text>
             </svg>},
          ].map(m=>{
            const[hov,setHov]=useState(false);
            return<div key={m.id} onClick={()=>setModo(m.id)}
              onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
              style={{background:C.bg2,border:`1px solid ${hov?m.hov:m.border}`,
                borderRadius:16,padding:"28px 36px",cursor:"pointer",textAlign:"center",
                minWidth:210,transition:"border-color .2s"}}>
              <div style={{marginBottom:12}}>{m.icon}</div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{m.label}</div>
              <div style={{color:m.hov,fontSize:12,marginBottom:8}}>{m.sub}</div>
              <div style={{color:C.muted2,fontSize:12,lineHeight:1.5,whiteSpace:"pre-line"}}>{m.desc}</div>
            </div>;
          })}
        </div>
        <div style={{color:C.muted,fontSize:11}}>
          Barra visual · Análise de códons · Stop codon · Proteínas · Geração Word
        </div>
      </div>}

      {/* MODO AUTO: BUSCA */}
      {modo==="auto"&&!geneData&&<div style={{maxWidth:720,margin:"32px auto"}}>
        <Card title="🔬 Buscar Gene no NCBI GenBank" accent={C.blue}>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <Input value={termo} onChange={setTermo} placeholder="Gene, accession ou ID (ex: ALB, TP53, 213)"
              onKeyDown={e=>e.key==="Enter"&&buscar()}/>
            <Btn2 onClick={buscar} disabled={loading||!termo} color={C.blue2}>
              {loading?<><Spin/>Buscando…</>:"🔍 Buscar"}
            </Btn2>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <span style={{color:C.muted,fontSize:12,whiteSpace:"nowrap"}}>Organismo:</span>
            <Input value={org} onChange={setOrg} placeholder="Homo sapiens" width="200px"/>
            <span style={{color:C.muted,fontSize:11,fontStyle:"italic"}}>Gene Genômico Completo</span>
          </div>
          {erro&&<div style={{color:C.red,fontSize:12,marginBottom:8}}>⚠ {erro}</div>}
          {results.length>0&&<div style={{marginTop:14}}>
            <div style={{color:C.muted2,fontSize:12,marginBottom:8}}>
              {results.length} resultado(s) — selecione e clique em Carregar
            </div>
            {results.map((r,i)=><div key={i} onClick={()=>setSelIdx(i)} style={{
              padding:"10px 14px",marginBottom:6,
              background:selIdx===i?`rgba(${rgb(C.blue2)},.1)`:C.bg3,
              border:`1px solid ${selIdx===i?C.blue2:C.border}`,
              borderRadius:8,cursor:"pointer",display:"flex",
              justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <span style={{fontFamily:"monospace",color:C.blue,fontWeight:600}}>{r.acc}</span>
                <span style={{color:C.muted2,marginLeft:10,fontSize:12}}>{r.titulo?.slice(0,65)}</span>
              </div>
              <span style={{background:`rgba(${rgb(C.muted)},.12)`,color:C.muted,
                border:`1px solid rgba(${rgb(C.muted)},.25)`,borderRadius:100,
                padding:"2px 8px",fontSize:11,fontFamily:"monospace"}}>
                {typeof r.len==="number"?r.len.toLocaleString():r.len} pb
              </span>
            </div>)}
            <Btn2 onClick={carregar} disabled={selIdx===null||loading} color={C.blue2}
              style={{width:"100%",padding:10,marginTop:10}}>
              {loading?<><Spin/>{status}</>:"📥 Carregar Registro"}
            </Btn2>
          </div>}
        </Card>
      </div>}

      {/* MODO MANUAL: UPLOAD */}
      {modo==="manual"&&!checkOk&&<div style={{maxWidth:720,margin:"32px auto",
        display:"flex",flexDirection:"column",gap:14}}>
        <Card title="① Arquivo de Entrada (.docx com a sequência)" accent={C.green2}>
          <input ref={fileRef} type="file" accept=".docx" style={{display:"none"}}
            onChange={e=>{if(e.target.files[0])uploadDocx(e.target.files[0]);}}/>
          <Btn2 onClick={()=>fileRef.current.click()} color={C.green2} disabled={loading}>
            {loading?<><Spin/>Processando…</>:"📂 Selecionar .docx"}
          </Btn2>
          {erro&&<div style={{color:C.red,fontSize:12,marginTop:8}}>⚠ {erro}</div>}
          {seqManual&&<div style={{marginTop:14,background:`rgba(${rgb(C.amber)},.06)`,
            border:`1px solid rgba(${rgb(C.amber)},.2)`,borderRadius:8,padding:14}}>
            <div style={{fontWeight:600,color:C.amber,marginBottom:6}}>
              📊 {seqManual.total_pb.toLocaleString()} pb detectados
            </div>
            <div style={{fontFamily:"monospace",fontSize:11,color:C.muted2,
              background:C.bg3,borderRadius:6,padding:"6px 10px",marginBottom:10,lineHeight:1.6}}>
              {seqManual.preview}…
            </div>
            <Btn2 onClick={confirmarManual} color={C.green2}>✅ Confirmar e Prosseguir</Btn2>
          </div>}
        </Card>
      </div>}

      {/* EDITOR PRINCIPAL */}
      {noEditor&&<div style={{display:"flex",flexDirection:"column",gap:14}}>

        {/* Info */}
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,
          padding:"10px 16px",display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <Tag color={C.blue}>{geneData.accession}</Tag>
          {geneData.organismo&&<Tag color={C.muted}>{geneData.organismo}</Tag>}
          <span style={{color:C.muted2,fontSize:12}}>{geneData.definicao?.slice(0,70)}</span>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <Tag color={C.green}>{totSeq.toLocaleString()} pb</Tag>
            <Tag color={C.amber}>{exons.length} éxons</Tag>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"}}>

          {/* ESQUERDA */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            <Card title="🗺 Mapa do Gene — Éxons (■) e Íntrons (□)" accent={C.muted2}>
              <BarraGene total={totSeq} exons={exons} marcadores={[marcLoc,marcStop]}/>
              <div style={{fontSize:11,color:C.muted,marginTop:6,display:"flex",gap:10,flexWrap:"wrap"}}>
                <span>{exons.reduce((s,e)=>s+(e.fim-e.inicio+1),0).toLocaleString()} pb codificantes</span>
                {marcStop&&<span style={{color:"#dc2626"}}>🔴 {marcStop.label}</span>}
                {marcLoc&&<span style={{color:"#7c3aed"}}>🟣 aa localizado</span>}
              </div>
            </Card>

            <Card title="📋 Intervalos de Éxons" accent={C.green}
              action={modo==="manual"&&<Btn2 small color={C.purple}
                onClick={()=>setShowModal(true)}>📋 Colar Features</Btn2>}>
              <TabelaExons exons={exons} setExons={setExons} totalSeq={totSeq}/>
            </Card>

            {modo==="auto"&&geneData.proteina_nascente&&<Card title="🧪 Sequências Proteicas" accent="#a78bfa">
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>
                  Proteína Nascente (preproprotein) — {geneData.proteina_nascente.length} aa
                </div>
                <textarea readOnly value={geneData.proteina_nascente} style={{width:"100%",
                  height:66,background:C.bg3,border:`1px solid ${C.border}`,borderRadius:6,
                  color:C.text,fontSize:11,fontFamily:"monospace",padding:"6px 10px",
                  resize:"none",lineHeight:1.5,outline:"none"}}/>
              </div>
              {geneData.proteina_madura_seq&&<div>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>
                  Proteína Madura (Mature Peptide) — {geneData.proteina_madura_seq.length} aa
                </div>
                <textarea readOnly value={geneData.proteina_madura_seq} style={{width:"100%",
                  height:66,background:C.bg3,border:`1px solid ${C.border}`,borderRadius:6,
                  color:C.text,fontSize:11,fontFamily:"monospace",padding:"6px 10px",
                  resize:"none",lineHeight:1.5,outline:"none"}}/>
              </div>}
            </Card>}
          </div>

          {/* DIREITA */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Painel A */}
            <Card title="🔬 Primeiros Códons" accent={C.green2}>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>
                ≥3 aminoácidos (1 ou 3 letras, vírgula/espaço)
              </div>
              <Input value={aasIn} onChange={setAasIn} mono placeholder="Met,Lys,Trp,Val,Thr,Phe"/>
              <div style={{display:"flex",gap:6,marginTop:8,marginBottom:10}}>
                <Btn2 onClick={()=>analisarCodons(aasIn)} color={C.green2} small>🔍 Analisar</Btn2>
                <Btn2 onClick={autoAas} color="#7c3aed" small
                  disabled={!geneData.proteina_nascente}>⚡ Auto (Preprotein)</Btn2>
              </div>
              {resAas&&<div style={{background:C.bg3,borderRadius:6,padding:"8px 10px",fontSize:11}}>
                {resAas.erro?<span style={{color:C.red}}>❌ {resAas.erro}</span>
                :resAas.encontrado?<>
                  <div style={{color:C.green,marginBottom:4}}>
                    ✅ {resAas.aas_fornecidos?.length} aminoácidos confirmados
                  </div>
                  {resAas.aas_fornecidos?.map((aa,i)=><div key={i}
                    style={{fontFamily:"monospace",color:C.muted2}}>
                    Códon {i+1}: {resAas.codons_reais?.[i]} → {aa}
                    {resAas.posicoes_gene?.[i]>0&&
                      <span style={{color:C.muted}}> (pos. {resAas.posicoes_gene[i].toLocaleString()})</span>}
                  </div>)}
                </>:<>
                  <div style={{color:C.amber,marginBottom:4}}>
                    ⚠ {resAas.matches?.filter(Boolean).length}/{resAas.matches?.length} correspondem
                  </div>
                  {resAas.aas_fornecidos?.map((aa,i)=><div key={i}
                    style={{fontFamily:"monospace",color:resAas.matches?.[i]?C.green:C.red}}>
                    {resAas.matches?.[i]?"✅":"❌"} {i+1}: {resAas.codons_reais?.[i]}→{resAas.aas_na_proteina?.[i]} ({aa})
                  </div>)}
                </>}
              </div>}
              {utrReg&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                <input type="checkbox" checked={utrOn} onChange={e=>setUtrOn(e.target.checked)}
                  id="utr" style={{accentColor:"#6699cc"}}/>
                <label htmlFor="utr" style={{fontSize:12,color:"#6699cc",cursor:"pointer"}}>
                  Isolar 5' UTR ({utrReg.len} nt) no Word
                </label>
              </div>}
            </Card>

            {/* Painel B */}
            <Card title="📍 Localizar Códon por nº do Aminoácido" accent={C.blue}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
                <span style={{color:C.muted,fontSize:12,whiteSpace:"nowrap"}}>Aminoácido nº:</span>
                <Input value={numAa} onChange={setNumAa} placeholder="25" width="80px" mono/>
                <Btn2 onClick={locCodon} color={C.blue2} small disabled={!numAa}>📍 Localizar</Btn2>
              </div>
              {resLoc&&<div style={{background:C.bg3,borderRadius:6,
                padding:"8px 10px",fontSize:11,fontFamily:"monospace"}}>
                {resLoc.erro?<span style={{color:C.red}}>❌ {resLoc.erro}</span>:<>
                  <span style={{color:"#7c3aed"}}>✅</span>
                  <span> aa {resLoc.numero_aa}: {resLoc.aminoacido} ({resLoc.codon})</span>
                  <div style={{color:C.muted2}}>
                    Posição: {resLoc.pos_inicio?.toLocaleString()}–{resLoc.pos_fim?.toLocaleString()} pb
                  </div>
                  <div style={{color:"#7c3aed",fontSize:10,marginTop:4}}>🟣 Grifado em roxo no Word</div>
                </>}
              </div>}
            </Card>

            {/* Painel C */}
            <Card title="🛑 Códon de Parada" accent={C.red}>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>
                Localiza TAA / TAG / TGA após a preprotein
              </div>
              <Btn2 onClick={locStop} color="#b91c1c" small
                disabled={!geneData.proteina_nascente}>⚡ Auto (Preprotein)</Btn2>
              {resStop&&<div style={{marginTop:8,background:C.bg3,borderRadius:6,
                padding:"8px 10px",fontSize:11,fontFamily:"monospace"}}>
                {resStop.erro?<span style={{color:C.red}}>❌ {resStop.erro}</span>
                :resStop.encontrado?<>
                  <span style={{color:C.red}}>✅ Stop: {resStop.codon}</span>
                  <div style={{color:C.muted2}}>Posição: {resStop.pos_inicio?.toLocaleString()}–{resStop.pos_fim?.toLocaleString()} pb</div>
                  <div style={{color:C.muted2}}>Após aa {resStop.n_aa_total} ({resStop.ultimos_aas?.join(" – ")})</div>
                  <div style={{color:"#cc0000",fontSize:10,marginTop:4}}>🔴 Grifado em vermelho no Word</div>
                </>:<span style={{color:C.amber}}>⚠ {resStop.aviso||"Não encontrado"}</span>}
              </div>}
            </Card>

            {/* Gerar */}
            <Card title="⚙ Gerar Documentos Word" accent={C.muted2}>
              <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:C.muted,fontSize:12}}>Caixa:</span>
                  <select value={caixa} onChange={e=>setCaixa(e.target.value)}
                    style={{background:C.bg3,border:`1px solid ${C.border}`,color:C.text,
                      borderRadius:6,padding:"4px 8px",fontSize:12,fontFamily:"inherit"}}>
                    <option value="minuscula">minúscula</option>
                    <option value="maiuscula">MAIÚSCULA</option>
                  </select>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:C.muted,fontSize:12}}>Cor íntrons:</span>
                  <input type="color" value={corBase} onChange={e=>setCorBase(e.target.value)}
                    style={{width:28,height:24,border:"none",background:"none"}}/>
                </div>
              </div>
              {erro&&<div style={{color:C.red,fontSize:12,marginBottom:8}}>⚠ {erro}</div>}
              <div style={{display:"flex",gap:8}}>
                <Btn2 onClick={()=>gerarDoc("completo")} disabled={!podeGerar||genDoc}
                  color="#1e3a5c" style={{flex:1,textAlign:"center"}}>
                  {genDoc?<Spin/>:"📄"} Completo
                </Btn2>
                <Btn2 onClick={()=>gerarDoc("somente_exons")} disabled={!podeGerar||genDoc}
                  color="#1a3a1a" style={{flex:1,textAlign:"center"}}>
                  {genDoc?<Spin/>:"🧬"} Somente Éxons
                </Btn2>
              </div>
              {!podeGerar&&<div style={{color:C.muted,fontSize:11,marginTop:6}}>
                {!geneData?.sequencia?"Carregue uma sequência primeiro":"Adicione ao menos um éxon"}
              </div>}
            </Card>
          </div>
        </div>
      </div>}
    </div>

    {/* MODAL: Colar Features */}
    {showModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",
      zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,
        padding:24,width:"100%",maxWidth:600}}>
        <div style={{fontWeight:700,marginBottom:12,color:C.purple}}>
          📋 Importar Éxons — Colar texto do GenBank Features
        </div>
        <textarea value={featText} onChange={e=>setFeatText(e.target.value)}
          placeholder={"Cole o texto da seção Features do GenBank:\n\nexon            5033..5152\n                     /gene=\"ALB\"\n                     /number=1\nexon            5830..5887\n                     /number=2"}
          style={{width:"100%",height:180,background:C.bg3,border:`1px solid ${C.border}`,
            borderRadius:6,color:C.text,fontSize:11,fontFamily:"monospace",
            padding:"8px 12px",resize:"vertical",lineHeight:1.55,outline:"none"}}/>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <Btn2 onClick={importarFeatures} color={C.purple}>✅ Importar Éxons</Btn2>
          <Btn2 onClick={()=>setShowModal(false)} color={C.bg4}>Cancelar</Btn2>
        </div>
      </div>
    </div>}
  </div>;
}

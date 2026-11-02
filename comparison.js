export function renderComparison(target,players,reports,a,b){
 const names=['technical','tactical','physical','psychological'];
 const profiles=[a,b].map(id=>{
  const rows=reports.filter(r=>r.player_id===id);
  const scores=names.map(k=>{const vals=rows.map(r=>Number(r.ratings?.[k])).filter(v=>v>=1&&v<=5);return vals.length?vals.reduce((x,y)=>x+y,0)/vals.length:null});
  return {name:players.find(p=>p.id===id)?.name||'Unknown',count:rows.length,scores};
 });
 const escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const colors=['#22ddc1','#edba5b'];
 const polygons=profiles.map((p,j)=>p.scores.every(x=>x!==null)?'<polygon points="'+p.scores.map((v,i)=>{const angle=i*Math.PI/2-Math.PI/2;return (150+v*22*Math.cos(angle))+','+(150+v*22*Math.sin(angle))}).join(' ')+'" fill="'+colors[j]+'33" stroke="'+colors[j]+'" stroke-width="3"/>':'').join('');
 const chart='<svg viewBox="0 0 300 300" role="img" aria-label="Scouting ratings radar" style="width:100%;max-width:380px">'+[1,2,3,4,5].map(i=>'<circle cx="150" cy="150" r="'+i*22+'" stroke="#34536a" fill="none"/>').join('')+names.map((n,i)=>{const a=i*Math.PI/2-Math.PI/2;return '<text x="'+(150+135*Math.cos(a))+'" y="'+(150+135*Math.sin(a))+'" fill="#bbd0df" font-size="11" text-anchor="middle">'+n+'</text>'}).join('')+polygons+'</svg>';
 target.innerHTML='<div class="dashboard-grid"><div class="panel"><h3>Observed ability radar</h3>'+chart+'</div><div class="panel"><h3>Independent scouting evidence</h3>'+profiles.map((p,i)=>'<h3 style="color:'+colors[i]+'">'+escape(p.name)+' · '+p.count+' reports</h3>'+names.map((n,j)=>'<div class="barline"><label>'+n+'</label><div class="track"><i style="width:'+((p.scores[j]||0)*20)+'%"></i></div><b>'+(p.scores[j]?.toFixed(1)??'—')+'</b></div>').join('')).join('')+'<p class="muted">Ratings are descriptive scout observations, not objective match data or transfer probabilities.</p></div></div>';
}
export function exportReports(players,reports){
 const rows=[['Player','Position','Opponent','Match date','Technical','Tactical','Physical','Psychological','Potential','Tactical fit','Recommendation','Notes']];
 reports.forEach(r=>{const p=players.find(x=>x.id===r.player_id);rows.push([p?.name,p?.position,r.opponent,r.match_date,...['technical','tactical','physical','psychological'].map(k=>r.ratings?.[k]),r.potential,r.tactical_fit,r.recommendation,r.notes])});
 const csv=rows.map(row=>row.map(v=>{let t=String(v??'');if(t.length&&'=+-@'.includes(t[0]))t="'"+t;return '"'+t.replaceAll('"','""')+'"'}).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='DSSI-scout-reports.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
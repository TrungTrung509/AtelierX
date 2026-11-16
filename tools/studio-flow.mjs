import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inside,sha} from './studio-base.mjs';
export const roles={
  research:['An','Nghiên cứu phom, họa tiết và nội dung','atelierx-tpm-0002'],
  designer:['Vy','Thiết kế phom áo','atelierx-designer-0003'],
  material:['Linh','Hoàn thiện màu và chất liệu','atelierx-backend-developer-0005'],
  visual:['Nhi','Dựng sản phẩm trong Sàn trưng bày','atelierx-frontend-developer-0006'],
  qa:['Khoa','Kiểm tra phom và sản phẩm','atelierx-qa-0004'],
  lead:['Minh','Điều phối và bàn giao','atelierx-team-leader-0001'],
};
export function taskTitle(order,role,name){return `${order} · ${roles[role][1]} · ${name}`}
export function createFlow(order,name,requestId,now=new Date().toISOString()){
  if(!/^ATEL-\d+$/.test(order)||!name||!requestId)throw Error('Cần mã ATEL, tên sản phẩm và requestId thật');
  return {version:9,orderId:order,name,requestId,createdAt:now,phase:'shape',shapeDeadlineAt:new Date(Date.parse(now)+15*60000).toISOString(),
    maxCandidateAttempts:2,candidateAttempts:[],events:[],tasks:Object.fromEntries(Object.entries(roles).map(([role,[person,,target]])=>[role,{person,target,title:taskTitle(order,role,name),ticketId:null,workItemId:null}]))};
}
export function recordCandidate(flow,key,now,sourceSelection=true){
  if(!flow.candidateAttempts.includes(key)){
    if(flow.candidateAttempts.length>=flow.maxCandidateAttempts)throw Error('Đã thử hai nguồn; Lead phải chốt phương án chuẩn bị mới, không thử nguồn tiếp tự động');
    if(sourceSelection&&Date.parse(now)>Date.parse(flow.shapeDeadlineAt))throw Error('Hết 15 phút chọn phom; Lead phải ghi phương án và ETA mới');
    flow.candidateAttempts.push(key);
  }
}
export function addEvent(flow,stage,manifest,file,now=new Date().toISOString()){
  const allowed=['shape','shape-review','surface','visual','qa-final','content'];
  if(!allowed.includes(stage)||manifest.orderId!==flow.orderId||!manifest.revision)throw Error('Manifest sai công đoạn/đơn/revision');
  if(!Array.isArray(manifest.artifacts)||!manifest.artifacts.length)throw Error('Manifest cần artifacts: [{path,sha256}]');
  for(const artifact of manifest.artifacts)if(sha(inside(artifact.path))!==artifact.sha256)throw Error('Artifact thiếu hoặc hash sai: '+artifact.path);
  if(stage==='shape-review'&&!['pass','return'].includes(manifest.decision))throw Error('shape-review cần pass hoặc return');
  if(stage==='qa-final'&&!['pass','return','fail'].includes(manifest.decision))throw Error('QA cuối cần quyết định');
  const has=s=>flow.events.some(e=>e.stage===s);
  if(stage==='surface'&&!flow.shapeApproved)throw Error('Chưa có phom được duyệt');
  if(stage==='visual'&&!has('surface'))throw Error('Chưa có bản màu/chất liệu chốt');
  if(stage==='qa-final'&&!has('visual'))throw Error('Chưa có viewer bàn giao');
  if(stage==='shape'){
    const key=manifest.baseId;
    if(key){
      recordCandidate(flow,key,now,true);
      const previous=flow.events.filter(e=>e.stage==='shape'&&e.baseId===key);
      if(previous.length>=2&&!previous.some(e=>e.id.endsWith(':'+sha(inside(file)))))throw Error('Nguồn đã có một bản thử và một correction');
    }else if(!manifest.garment?.sha256)throw Error('shape cần baseId hoặc garment.sha256');
  }
  const event={id:`${stage}:${manifest.revision}:${sha(inside(file))}`,stage,revision:manifest.revision,file,createdAt:now,...(stage==='shape'&&manifest.baseId?{baseId:manifest.baseId}:{})};
  if(!flow.events.some(e=>e.id===event.id))flow.events.push(event);
  if(stage==='shape')flow.shapeApproved=false;
  if(stage==='shape-review')flow.shapeApproved=manifest.decision==='pass';
  return event;
}
export function destinations(event,manifest){
  if(event.stage==='shape')return ['qa'];
  if(event.stage==='shape-review')return manifest.decision==='pass'?['material']:['designer'];
  if(event.stage==='surface')return ['visual'];
  if(event.stage==='visual')return ['qa'];
  if(event.stage==='qa-final')return manifest.decision==='pass'?['research','designer','material','visual','lead']:
    [['designer','material','visual'].includes(manifest.correctionOwner)?manifest.correctionOwner:'visual'];
  return ['visual'];
}
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(value,null,2)+'\n');fs.renameSync(file+'.tmp',file)}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const [command,order,...args]=process.argv.slice(2),value=k=>args.includes('--'+k)?args[args.indexOf('--'+k)+1]:undefined;
  if(!/^ATEL-\d+$/.test(order||''))throw Error('Cần mã đơn ATEL-N');
  const file=inside(`orders/${order}/studio-flow.json`);
  let flow;
  if(command==='init'){
    if(fs.existsSync(file))throw Error('Đơn đã có flow; không khởi tạo lại');
    flow=createFlow(order,value('name'),value('request'));write(file,flow);
  }else{
    flow=JSON.parse(fs.readFileSync(file,'utf8'));
    if(command==='bind'){
      const role=value('role');if(!roles[role]||!/^ATEL-\d+$/.test(value('ticket')||'')||!value('workitem'))throw Error('bind cần --role --ticket --workitem');
      Object.assign(flow.tasks[role],{ticketId:value('ticket'),workItemId:value('workitem')});write(file,flow);
    }else if(command==='handoff'){
      const manifestFile=value('manifest'),manifest=JSON.parse(fs.readFileSync(inside(manifestFile),'utf8'));
      const event=addEvent(flow,value('stage'),manifest,manifestFile);write(file,flow);console.log(JSON.stringify(event));
    }else if(command==='replan'){
      if(!value('reason'))throw Error('Cần --reason và phương án cụ thể');
      const minutes=Number(value('minutes')||15);
      if(!Number.isFinite(minutes)||minutes<1||minutes>60)throw Error('Thời gian chuẩn bị phải từ 1–60 phút');
      flow.preparationRounds||=[];
      flow.preparationRounds.push({endedAt:new Date().toISOString(),candidates:[...flow.candidateAttempts],reason:value('reason')});
      flow.candidateAttempts=[];
      flow.shapeDeadlineAt=new Date(Date.now()+minutes*60000).toISOString();
      flow.replan={reason:value('reason'),at:new Date().toISOString()};flow.phase='preparation';write(file,flow);
    }else if(command!=='status')throw Error('Lệnh: init, bind, handoff, status, replan');
  }
  console.log(JSON.stringify(flow,null,2));
}

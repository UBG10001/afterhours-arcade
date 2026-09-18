import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./dist/launcher.js',import.meta.url),'utf8');
function scenario({embedded=false,blocked=false,throws=false}={}) {
  const elements = new Map(), timers = new Map(), windowListeners = new Map(), messages = new Set();
  let timerId=0, opens=0, closes=0;
  class Element {
    constructor(tag) { this.tag=tag; this.children=[]; this.listeners=new Map(); this.contentWindow={}; this.classList={add(){},remove(){}}; }
    append(...items) { this.children.push(...items); }
    replaceChildren(...items) { this.children=items; }
    querySelector(selector) { if (!elements.has(selector)) elements.set(selector,new Element(selector)); return elements.get(selector); }
    addEventListener(name,fn) { this.listeners.set(name,fn); }
    click() { this.listeners.get('click')?.(); }
    focus() {} remove() { this.removed=true; }
  }
  const document = {documentElement:new Element('html'),body:new Element('body'),createElement:tag=>new Element(tag),querySelector:selector=>selector.startsWith('link')?{href:'data:image/svg+xml,icon'}:new Element(selector)};
  const popup = {document:{...document,head:new Element('head'),body:new Element('body')},closed:false,focus(){},close(){this.closed=true},addEventListener(name,fn){messages.add(fn)},removeEventListener(name,fn){messages.delete(fn)}};
  const window = {open(url,target){opens++;assert.equal(url,'about:blank');assert.equal(target,'_blank');if(throws)throw Error('blocked');return blocked?null:popup;},close(){closes++},addEventListener(name,fn){windowListeners.set(name,fn)},dispatchEvent(event){windowListeners.get(event.type)?.()}};
  window.self=window;window.top=embedded?{}:window;
  const location={href:'https://example.github.io/arcade/?test=1#game=snow-rider-3d',origin:'https://example.github.io'};
  vm.runInNewContext(source,{window,document,location,Event:class{constructor(type){this.type=type}},setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,delay});return id},clearTimeout:id=>timers.delete(id)});
  return {window,popup,elements,location,get opens(){return opens},get closes(){return closes},get frame(){return popup.document.body.children[0]},message(data){for(const fn of [...messages])fn(data)},ready(){this.message({origin:location.origin,source:this.frame.contentWindow,data:{type:'afterhours:ready'}})},run(delay){for(const [id,timer]of [...timers])if(timer.delay===delay){timers.delete(id);timer.fn()}}};
}

test('embedded arcade never launches another tab',()=>{const s=scenario({embedded:true});assert.equal(s.opens,0);assert.equal(s.window.afterhoursLauncherActive,undefined)});
test('blocked and throwing popup APIs keep a playable fallback',()=>{for(const options of [{blocked:true},{throws:true}]){const s=scenario(options);assert.match(s.elements.get('#launch-status').textContent,/blocked/);s.elements.get('#launch-here').click();assert.equal(s.window.afterhoursLauncherActive,false);assert.equal(s.closes,0)}});
test('iframe preserves the selected game, query, and player permissions',()=>{const s=scenario();assert.equal(s.frame.src,s.location.href);assert.equal(s.frame.allowFullscreen,true);assert.match(s.frame.allow,/fullscreen/);assert.equal(s.popup.opener,null);assert.equal(s.closes,0)});
test('untrusted messages cannot close the source tab',()=>{const s=scenario();s.message({origin:'https://other.invalid',source:s.frame.contentWindow,data:{type:'afterhours:ready'}});s.message({origin:s.location.origin,source:{},data:{type:'afterhours:ready'}});s.run(150);assert.equal(s.closes,0)});
test('source closes only once after its own framed arcade reports ready',()=>{const s=scenario();s.ready();s.ready();assert.equal(s.closes,0);s.run(150);assert.equal(s.closes,1);assert.match(s.elements.get('#launch-status').textContent,/close it manually/)});
test('failed or slow catalog never closes the original',()=>{const s=scenario();s.run(12000);assert.equal(s.closes,0);assert.match(s.elements.get('#launch-status').textContent,/stay open/)});
test('closing the new tab before readiness keeps the original open',()=>{const s=scenario();s.popup.closed=true;s.ready();s.run(150);assert.equal(s.closes,0)});
test('closing the new tab during handoff keeps the original open',()=>{const s=scenario();s.ready();s.popup.closed=true;s.run(150);assert.equal(s.closes,0)});
test('Play here cancels a pending close and closes the duplicate arcade',()=>{const s=scenario();s.ready();s.elements.get('#launch-here').click();s.run(150);s.ready();assert.equal(s.closes,0);assert.equal(s.popup.closed,true);assert.equal(s.window.afterhoursLauncherActive,false)});
test('repeated clicks reuse the new tab',()=>{const s=scenario();s.elements.get('#launch-open').click();assert.equal(s.opens,1);s.popup.closed=true;s.elements.get('#launch-open').click();assert.equal(s.opens,2)});

function switchSection(id) {
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  document.querySelector('.nav-tab[data-id="'+id+'"]').classList.add('active');
}

function setWire(id, on) {
  const el = document.getElementById(id); if(!el) return;
  el.classList.toggle('wire-on',  !!on);
  el.classList.toggle('wire-off', !on);
}
function setWireSel(id, on) {
  const el = document.getElementById(id); if(!el) return;
  el.classList.toggle('wire-sel-on',  !!on);
  el.classList.toggle('wire-sel-off', !on);
}
function setWireVcc(id, on) {
  const el = document.getElementById(id); if(!el) return;
  el.classList.toggle('wire-vcc-on',  !!on);
  el.classList.toggle('wire-vcc-off', !on);
}
function setNode(id, on) {
  const el = document.getElementById(id); if(!el) return;
  el.classList.toggle('node-on',  !!on);
  el.classList.toggle('node-off', !on);
}
function setToggle(id, v) { document.getElementById(id).classList.toggle('on', !!v); }
function setBadge(id, v) {
  const el = document.getElementById(id);
  el.textContent = v;
  el.classList.toggle('on', !!v);
}
function highlightRow(prefix, rows, key) {
  rows.forEach(r => document.getElementById(prefix+r).classList.remove('active'));
  document.getElementById(prefix+key).classList.add('active');
}

let invSel = 0;

function invFlip() { invSel ^= 1; invRender(); }

function invRender() {
  const S   = invSel;
  const out = S ^ 1;          

  setToggle('inv-togSel', S);
  setBadge('inv-badgeSel', S);

  setNode('inv-nodeSel', S);

  setWireVcc('inv-d0drop', 1);

  setWireSel('inv-selDown', S);

  setWire('inv-outWire', out);
  setNode('inv-outNode', out);

  highlightRow('inv-tr', ['0','1'], ''+S);
}

invRender(); 

const ha = { A:0, B:0 };

function haFlip(ch) {
  ha[ch] ^= 1;

  setToggle('sum-tog'+ch,   ha[ch]);
  setToggle('carry-tog'+ch, ha[ch]);
  setBadge('sum-badge'+ch,   ha[ch]);
  setBadge('carry-badge'+ch, ha[ch]);
  haRenderSum();
  haRenderCarry();
  haRenderTable();
}

function haRenderSum() {
  const {A, B} = ha;
  const notB = B ^ 1;

  setNode('sum-nodeB', B);
  setNode('sum-jctB', B);

  ['sum-d0h1','sum-d0v','sum-d0h2'].forEach(id => setWire(id, B));
  ['sum-d1h1','sum-d1v','sum-d1h2'].forEach(id => setWire(id, B));

  const nb = document.getElementById('sum-notBubble');
  nb.classList.toggle('on', !!notB);

  ['sum-d1v2','sum-d1h3'].forEach(id => setWire(id, notB));

  setWireSel('sum-selDown', A);
  setNode('sum-nodeA', A);

  const sum = A ^ B;
  setWire('sum-outWire', sum);
  setNode('sum-outNode', sum);
}

function haRenderCarry() {
  const {A, B} = ha;

  setNode('carry-nodeB', B);
  setWire('carry-d1v', B);
  setWire('carry-d1h', B);

  setWireSel('carry-selDown', A);
  setNode('carry-nodeA', A);

  const carry = A & B;
  setWire('carry-outWire', carry);
  setNode('carry-outNode', carry);
}

function haRenderTable() {
  const key = ''+ha.A+ha.B;

  ['ha-tr00','ha-tr01','ha-tr10','ha-tr11'].forEach(id =>
    document.getElementById(id).classList.remove('active'));
  document.getElementById('ha-tr'+key).classList.add('active');

  ['ha2-tr00','ha2-tr01','ha2-tr10','ha2-tr11'].forEach(id =>
    document.getElementById(id).classList.remove('active'));
  document.getElementById('ha2-tr'+key).classList.add('active');
}

haRenderSum();
haRenderCarry();
haRenderTable();
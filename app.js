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

/* ══════════════════════════════════════════════
   FULL ADDER  (shared state, drives both panels)
   ══════════════════════════════════════════ */
const fa = { A:0, B:0, Cin:0 };

function faFlip(ch) {
  fa[ch] ^= 1;
  // sync toggles on BOTH panels
  setToggle('fa-sum-tog'+ch,   fa[ch]);
  setToggle('fa-carry-tog'+ch, fa[ch]);
  setBadge('fa-sum-badge'+ch,   fa[ch]);
  setBadge('fa-carry-badge'+ch, fa[ch]);
  faRenderSum();
  faRenderCarry();
  faRenderTable();
}

/* ── SUM MUX panel ── */
function faRenderSum() {
  const {A, B, Cin} = fa;
  
  // Input nodes
  setNode('fa-sum-nodeB', B);
  setNode('fa-sum-nodeCin', Cin);
  setNode('fa-sum-nodeA', A);
  setNode('fa-sum-jctB', B);
  setNode('fa-sum-jctCin', Cin);

  // D0 = B XOR Cin
  const d0 = B ^ Cin;
  // B to XOR
  setWire('fa-sum-d0-bh', B);
  setWire('fa-sum-d0-bv', B);
  // Cin to XOR
  setWire('fa-sum-d0-cinh', Cin);
  setWire('fa-sum-d0-cinv', Cin);
  // XOR output to MUX D0
  setWire('fa-sum-d0-xorh', d0);
  setWire('fa-sum-d0-xorv', d0);
  setWire('fa-sum-d0-toporth', d0);

  // D1 = B XNOR Cin
  const d1 = (B ^ Cin) ^ 1;  // XNOR = NOT(XOR)
  // B to XNOR (tap)
  setWire('fa-sum-d1-bh', B);
  setWire('fa-sum-d1-bv', B);
  // Cin to XNOR (tap)
  setWire('fa-sum-d1-cinh', Cin);
  setWire('fa-sum-d1-cinv', Cin);
  // XNOR output to MUX D1
  setWire('fa-sum-d1-xnorh', d1);
  setWire('fa-sum-d1-xnorv', d1);
  setWire('fa-sum-d1-toporth', d1);

  // Select & output
  setWireSel('fa-sum-selDown', A);
  const sum = A ? d1 : d0;  // A=0 → D0, A=1 → D1
  setWire('fa-sum-outWire', sum);
  setNode('fa-sum-outNode', sum);
}

/* ── CARRY MUX panel ── */
function faRenderCarry() {
  const {A, B, Cin} = fa;
  
  // Input nodes
  setNode('fa-carry-nodeB', B);
  setNode('fa-carry-nodeCin', Cin);
  setNode('fa-carry-nodeA', A);
  setNode('fa-carry-jctB', B);
  setNode('fa-carry-jctCin', Cin);

  // D0 = B AND Cin
  const d0 = B & Cin;
  // B to AND
  setWire('fa-carry-d0-bh', B);
  setWire('fa-carry-d0-bv', B);
  // Cin to AND
  setWire('fa-carry-d0-cinh', Cin);
  setWire('fa-carry-d0-cinv', Cin);
  // AND output to MUX D0
  setWire('fa-carry-d0-andh', d0);
  setWire('fa-carry-d0-andv', d0);
  setWire('fa-carry-d0-toporth', d0);

  // D1 = B OR Cin
  const d1 = B | Cin;
  // B to OR (tap)
  setWire('fa-carry-d1-bh', B);
  setWire('fa-carry-d1-bv', B);
  // Cin to OR (tap)
  setWire('fa-carry-d1-cinh', Cin);
  setWire('fa-carry-d1-cinv', Cin);
  // OR output to MUX D1
  setWire('fa-carry-d1-orh', d1);
  setWire('fa-carry-d1-orv', d1);
  setWire('fa-carry-d1-toporth', d1);

  // Select & output
  setWireSel('fa-carry-selDown', A);
  const cout = A ? d1 : d0;  // A=0 → D0, A=1 → D1
  setWire('fa-carry-outWire', cout);
  setNode('fa-carry-outNode', cout);
}

/* ── shared truth table ── */
function faRenderTable() {
  const {A, B, Cin} = fa;
  
  // Compute outputs
  const sum = A ? ((B ^ Cin) ^ 1) : (B ^ Cin);
  const cout = A ? (B | Cin) : (B & Cin);
  
  const key = ''+A+B+Cin;
  
  // Highlight both tables
  ['fa-tr000','fa-tr001','fa-tr010','fa-tr011',
   'fa-tr100','fa-tr101','fa-tr110','fa-tr111'].forEach(id =>
    document.getElementById(id).classList.remove('active'));
  document.getElementById('fa-tr'+key).classList.add('active');
  
  ['fa2-tr000','fa2-tr001','fa2-tr010','fa2-tr011',
   'fa2-tr100','fa2-tr101','fa2-tr110','fa2-tr111'].forEach(id =>
    document.getElementById(id).classList.remove('active'));
  document.getElementById('fa2-tr'+key).classList.add('active');
}

/* initial paint */
faRenderSum();
faRenderCarry();
faRenderTable();
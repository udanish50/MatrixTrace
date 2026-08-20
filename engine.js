export function shape(A){return [A.length, A[0]?.length||0]}
export function zeros(r,c){return Array.from({length:r},()=>Array(c).fill(0))}
export function multiply(A,B){const [m,k]=shape(A), [k2,n]=shape(B); if(k!==k2) throw new Error(`Incompatible shapes ${m}×${k} and ${k2}×${n}`); const C=zeros(m,n); for(let i=0;i<m;i++) for(let t=0;t<k;t++){const a=A[i][t]; if(a===0) continue; for(let j=0;j<n;j++) C[i][j]+=a*B[t][j]} return C}
export function transpose(A){const [r,c]=shape(A); return Array.from({length:c},(_,j)=>Array.from({length:r},(_,i)=>A[i][j]))}
export function hadamard(A,B){const [r,c]=shape(A),[r2,c2]=shape(B); if(r!==r2||c!==c2) throw new Error('Hadamard shapes differ'); return A.map((row,i)=>row.map((v,j)=>v*B[i][j]))}
export function kron(A,B){const [ar,ac]=shape(A),[br,bc]=shape(B); return Array.from({length:ar*br},(_,i)=>Array.from({length:ac*bc},(_,j)=>A[Math.floor(i/br)][Math.floor(j/bc)]*B[i%br][j%bc]))}
export function sparsity(A){let z=0,n=0; for(const r of A) for(const v of r){n++; if(v===0) z++} return n?z/n:0}
export function nnz(A){return A.flat().filter(v=>v!==0).length}
export function classifyStructure(A){const [r,c]=shape(A); const sq=r===c; let diagonal=sq, upper=sq, lower=sq, symmetric=sq; let band=0; for(let i=0;i<r;i++) for(let j=0;j<c;j++){const v=A[i][j]; if(i!==j&&v!==0) diagonal=false; if(i>j&&v!==0) upper=false; if(i<j&&v!==0) lower=false; if(sq&&A[j]?.[i]!==v) symmetric=false; if(v!==0) band=Math.max(band,Math.abs(i-j));} return {diagonal,upper,lower,symmetric,bandwidth:band}}
export function memoryModel(A){const [r,c]=shape(A), non=nnz(A); return {denseBytes:r*c*8, csrBytes:non*12+(r+1)*4}}
export function traceCell(A,B,i,j){const [m,k]=shape(A),[k2,n]=shape(B); if(k!==k2||i<0||i>=m||j<0||j>=n) throw new Error('Bad cell'); const terms=[]; let sum=0; for(let t=0;t<k;t++){const p=A[i][t]*B[t][j]; terms.push({a:A[i][t],b:B[t][j],product:p,k:t}); sum+=p} return {terms,sum}}
export function estimateOps(A,B){const [m,k]=shape(A),[k2,n]=shape(B); if(k!==k2) throw new Error('Incompatible shapes'); const denseMult=m*k*n; let sparseMult=0; for(let i=0;i<m;i++) for(let t=0;t<k;t++) if(A[i][t]!==0) for(let j=0;j<n;j++) if(B[t][j]!==0) sparseMult++; return {denseMult,sparseMult,skipped:denseMult-sparseMult}}
export function normalizeRows(A){return A.map(r=>{const s=Math.sqrt(r.reduce((x,v)=>x+v*v,0))||1; return r.map(v=>v/s)})}
export function slice(A,r0,r1,c0,c1){return A.slice(r0,r1).map(r=>r.slice(c0,c1))}
export function parseMatrix(text){const A=text.trim().split(/\n+/).map(r=>r.trim().split(/[\s,]+/).filter(Boolean).map(Number)); if(!A.length||!A[0].length||A.some(r=>r.length!==A[0].length)||A.flat().some(Number.isNaN)) throw new Error('Use rows separated by lines and values by spaces or commas.'); return A}
export function format(A){return A.map(r=>r.map(v=>Number.isInteger(v)?String(v):Number(v.toFixed(4))).join('\t')).join('\n')}

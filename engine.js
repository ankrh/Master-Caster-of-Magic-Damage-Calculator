// --- Probability Engine ---
// Pure math functions with no DOM dependencies.

function binomCoeff(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n - k) k = n - k;
  let result = 1;
  for (let i = 0; i < k; i++) result = result * (n - i) / (i + 1);
  return result;
}

function binomialPMF(n, p) {
  const pmf = new Array(n + 1);
  for (let k = 0; k <= n; k++)
    pmf[k] = binomCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  return pmf;
}

// Compute damage distribution for a single figure's attack against a multi-figure target.
// Returns an array where dist[d] = probability of dealing exactly d damage.
// Handles overflow: when a hit kills a figure (damage >= hp), excess hits roll
// against the next figure with fresh defense rolls.
function singleAttackDmgDist(atkStr, toHit, defStr, toBlock, hp) {
  const hitsPMF = binomialPMF(atkStr, toHit);
  const blocksPMF = binomialPMF(defStr, toBlock);

  const chainDmg = new Array(atkStr + 1);
  chainDmg[0] = [1];

  for (let e = 1; e <= atkStr; e++) {
    chainDmg[e] = new Array(e + 1).fill(0);
    for (let b = 0; b <= defStr; b++) {
      const net = Math.max(e - b, 0);
      if (net < hp) {
        chainDmg[e][net] += blocksPMF[b];
      } else {
        const excess = net - hp;
        const sub = chainDmg[excess];
        for (let d = 0; d < sub.length; d++) {
          if (sub[d] < 1e-15) continue;
          chainDmg[e][hp + d] += blocksPMF[b] * sub[d];
        }
      }
    }
  }

  const dist = new Array(atkStr + 1).fill(0);
  for (let h = 0; h <= atkStr; h++) {
    if (hitsPMF[h] < 1e-15) continue;
    const sub = chainDmg[h];
    for (let d = 0; d < sub.length; d++) {
      if (sub[d] < 1e-15) continue;
      dist[d] += hitsPMF[h] * sub[d];
    }
  }
  return dist;
}

// Convolve two damage distributions, capping total damage at `cap`.
function convolveDists(a, b, cap) {
  const result = new Array(cap + 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    if (a[i] < 1e-15) continue;
    for (let j = 0; j < b.length; j++) {
      if (b[j] < 1e-15) continue;
      result[Math.min(i + j, cap)] += a[i] * b[j];
    }
  }
  return result;
}

// Compute total damage distribution for `atkFigs` figures each attacking with
// `atkStr` strength. Uses exponentiation-by-squaring for efficiency.
function calcTotalDamageDist(atkFigs, atkStr, toHit, defStr, toBlock, hp, cap) {
  const single = singleAttackDmgDist(atkStr, toHit, defStr, toBlock, hp);

  let result = [1];
  let base = single;
  let n = atkFigs;
  while (n > 0) {
    if (n & 1) result = convolveDists(result, base, cap);
    n >>= 1;
    if (n > 0) base = convolveDists(base, base, cap);
  }
  return result;
}

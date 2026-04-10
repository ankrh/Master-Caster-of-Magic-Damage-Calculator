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

// Compute resistance-based damage distribution (for Poison Touch, etc.).
// Each roll is an independent Bernoulli trial: fail → 1 damage.
// numRolls: total resistance rolls (attacking figures × strength per figure)
// pFail: probability of failing each roll (0 to 1)
// cap: maximum possible damage (target's remaining HP)
function calcResistDmgDist(numRolls, pFail, cap) {
  if (numRolls <= 0 || pFail <= 0) return [1];
  const pmf = binomialPMF(numRolls, Math.min(pFail, 1));
  const maxD = Math.min(numRolls, cap);
  const dist = new Array(maxD + 1).fill(0);
  for (let d = 0; d <= numRolls; d++) {
    dist[Math.min(d, maxD)] += pmf[d];
  }
  return dist;
}

// Compute life-steal damage distribution.
// Each attacking figure forces a single d10 roll on the target.
// effective_res = defRes + modifier (modifier is typically negative).
// If roll > effective_res: damage = roll - effective_res.
// If roll ≤ effective_res: no damage.
// Blocked by Death Immunity, Magic Immunity, effective_res ≥ 10 (checked by caller).
// Returns damage distribution array where dist[d] = P(exactly d total damage).
function calcLifeStealDmgDist(numFigs, defRes, modifier, cap) {
  if (numFigs <= 0) return [1];
  const effRes = defRes + modifier;
  if (effRes >= 10) return [1];

  // Single figure distribution: P(0) = max(0, effRes)/10, P(d) = 1/10 for d=1..(10-effRes)
  const maxSingleDmg = 10 - effRes;  // could be >10 if effRes < 0
  const single = new Array(maxSingleDmg + 1).fill(0);
  single[0] = Math.max(0, effRes) / 10;
  for (let d = 1; d <= maxSingleDmg; d++) {
    single[d] = 1 / 10;
  }

  // Convolve across all attacking figures
  let result = [1];
  let base = single;
  let n = numFigs;
  while (n > 0) {
    if (n & 1) result = convolveDists(result, base, cap);
    n >>= 1;
    if (n > 0) base = convolveDists(base, base, cap);
  }
  return result;
}

// Compute figure-kill damage distribution (for Stoning Touch, etc.).
// Each roll is an independent Bernoulli trial: fail → one figure killed (= defHP damage).
// numRolls: number of resistance rolls (one per attacking figure)
// pFail: probability of failing each roll (0 to 1)
// defHP: HP per defending figure (damage per kill)
// cap: maximum possible damage (target's remaining HP)
function calcFigureKillDmgDist(numRolls, pFail, defHP, cap) {
  if (numRolls <= 0 || pFail <= 0) return [1];
  const pmf = binomialPMF(numRolls, Math.min(pFail, 1));
  const dist = new Array(cap + 1).fill(0);
  for (let k = 0; k <= numRolls; k++) {
    const dmg = Math.min(k * defHP, cap);
    dist[dmg] += pmf[k];
  }
  return dist;
}

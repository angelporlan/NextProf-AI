export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

/**
 * Computes a line-by-line diff between two strings.
 * Uses a dynamic programming approach to find the Longest Common Subsequence (LCS).
 */
export function computeDiff(oldStr: string, newStr: string): DiffLine[] {
  // Normalize line endings
  const oldText = oldStr ? oldStr.replace(/\r\n/g, '\n') : '';
  const newText = newStr ? newStr.replace(/\r\n/g, '\n') : '';

  const oldLines = oldText ? oldText.split('\n') : [];
  const newLines = newText ? newText.split('\n') : [];

  const m = oldLines.length;
  const n = newLines.length;

  // Edge cases
  if (m === 0 && n === 0) return [];
  if (m === 0) {
    return newLines.map((line, idx) => ({
      type: 'added',
      value: line,
      newLineNumber: idx + 1,
    }));
  }
  if (n === 0) {
    return oldLines.map((line, idx) => ({
      type: 'removed',
      value: line,
      oldLineNumber: idx + 1,
    }));
  }

  // DP table for LCS length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to assemble the diff
  const diff: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.unshift({
        type: 'unchanged',
        value: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({
        type: 'added',
        value: newLines[j - 1],
        newLineNumber: j,
      });
      j--;
    } else {
      diff.unshift({
        type: 'removed',
        value: oldLines[i - 1],
        oldLineNumber: i,
      });
      i--;
    }
  }

  return diff;
}

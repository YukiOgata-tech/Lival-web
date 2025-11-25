// LaTeX変換テスト

const testText = `- 置換積分（u置換）
  - 形が \\(\\displaystyle f(g(x))\\,g'(x)\\) のとき、\\(u=g(x)\\) とおくと
    \\[
    \\int f(g(x))\\,g'(x)\\,dx=\\int f(u)\\,du
    \\]`;

let fixed = testText;

// パターン1: \(...\) 形式のインライン数式を $...$ に変換（シングルドル）
fixed = fixed.replace(/\\\((.*?)\\\)/g, (match, content) => `$${content}$`);

// パターン2: \[...\] 形式のブロック数式を $$...$$ に変換（ダブルドル）
fixed = fixed.replace(/\\\[([\s\S]*?)\\\]/g, (match, content) => `$$${content}$$`);

console.log('=== ORIGINAL ===');
console.log(testText);
console.log('\n=== FIXED ===');
console.log(fixed);

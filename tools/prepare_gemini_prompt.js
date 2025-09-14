#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const read = async (p) => {
  try { return await fs.readFile(p, 'utf8'); } catch { return null; }
};

const truncate = (s, max = 4000) => {
  if (!s) return '';
  return s.length > max ? s.slice(0, max) + `\n... [truncated ${s.length - max} chars]` : s;
};

const codeBlock = (filename, content) => {
  if (!content) return '';
  return `\n===== ${filename} =====\n\n\`\`\`\n${content}\n\`\`\`\n`;
};

const main = async () => {
  const cwd = process.cwd();
  const files = [
    'package.json',
    'vercel.json',
    'vite.config.js',
    'index.html',
    'src/main.jsx',
    'src/App.jsx',
  ];

  const parts = [];
  for (const f of files) {
    const p = path.join(cwd, f);
    const c = await read(p);
    if (c) parts.push(codeBlock(f, truncate(c)));
  }

  const prompt = `당신은 Vite+React 앱을 Vercel에 배포할 때 '빈 화면' 문제가 발생하는 원인을 진단하는 전문가입니다.\n\n요청:\n- 아래 제공하는 프로젝트 핵심 파일을 바탕으로, 브라우저에서 화면이 빈 상태로 보이는 이유를 추론하고 증상(네트워크/콘솔)을 통해 검증 포인트를 제시하세요.\n- 잘못된 라우팅(특히 routes로 모든 요청이 /index.html로 리라이트되어 정적 자산이 차단되는 케이스), 빌드/출력 설정, Vite base 경로, index.html 루트/엔트리 로딩, API 에러로 인한 런타임 중단 등을 우선 점검하세요.\n- 재현/확인 절차, 원인, 수정안, 체크리스트를 간결히 정리하세요.\n\n프로젝트 파일:\n${parts.join('\n')}\n`;

  const outDir = path.join(cwd, 'tools', '.generated');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'gemini_prompt.txt');
  await fs.writeFile(outPath, prompt, 'utf8');
  console.log(`Gemini 프롬프트가 생성되었습니다: ${outPath}`);
  console.log('예시 실행:');
  console.log('  gemini --model gemini-1.5-pro --input', outPath, '> tools/.generated/gemini_report.md');
};

main().catch((e) => {
  console.error('프롬프트 생성 실패:', e);
  process.exit(1);
});


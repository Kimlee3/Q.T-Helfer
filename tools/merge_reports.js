#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const read = async (p) => {
  try { return await fs.readFile(p, 'utf8'); } catch { return ''; }
};

const main = async () => {
  const cwd = process.cwd();
  const genDir = path.join(cwd, 'tools', '.generated');
  const localPath = path.join(genDir, 'local_report.md');
  const geminiPath = process.env.GEMINI_REPORT || path.join(genDir, 'gemini_report.md');
  const outPath = path.join(genDir, 'final_report.md');

  const local = await read(localPath);
  const gemini = await read(geminiPath);

  const common = [];
  const lowerLocal = local.toLowerCase();
  const lowerGem = gemini.toLowerCase();
  const maybe = (k) => lowerLocal.includes(k) && lowerGem.includes(k);
  if (maybe('rewrite') || maybe('rewrites') || maybe('routes')) {
    common.push('- 라우팅 설정 문제가 공통 의심됨 (routes/rewrites, 정적 자산 가로채기).');
  }
  if (maybe('vite')) common.push('- Vite 빌드/엔트리/베이스 경로 점검 필요.');
  if (maybe('vercel')) common.push('- Vercel 빌드/출력 디렉터리 설정 확인 필요.');
  if (maybe('blank') || maybe('빈 화면')) common.push('- 빈 화면 증상 재현 및 콘솔/네트워크 에러 확인.');

  const finalAdvice = [
    '- vercel.json에서 routes 대신 rewrites 사용, 정적 자산은 우선 서빙되도록 구성.',
    "- Vercel Build Command를 'npm run build', Output Directory를 'dist'로 설정.",
    "- vite.config.js의 base를 '/'로 두고, index.html이 루트 요소(id='root')와 엔트리(main.jsx)를 로드하는지 확인.",
    '- 배포 후 브라우저 개발자도구에서 /assets/*.js가 200 및 JS MIME으로 응답되는지 확인.',
  ];

  const report = [];
  report.push('# 통합 진단 보고서');
  report.push('');
  if (common.length) {
    report.push('**공통 소견**');
    report.push(...common);
    report.push('');
  }
  report.push('**로컬 진단 요약**');
  report.push(local || '- (비어있음)');
  report.push('');
  report.push('**Gemini 진단 요약**');
  report.push(gemini || '- (비어있음)');
  report.push('');
  report.push('**최종 권고**');
  report.push(...finalAdvice.map((l) => `- ${l}`));
  report.push('');

  await fs.mkdir(genDir, { recursive: true });
  await fs.writeFile(outPath, report.join('\n'), 'utf8');
  console.log('최종 보고서 생성:', outPath);
};

main().catch((e) => {
  console.error('머지 실패:', e);
  process.exit(1);
});


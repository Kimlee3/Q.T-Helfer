#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const readIfExists = async (p) => {
  try {
    return await fs.readFile(p, 'utf8');
  } catch {
    return null;
  }
};

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const cwd = process.cwd();
const repoRoot = cwd; // assume run from repo root

const file = (p) => path.join(repoRoot, p);

const findings = [];
const fixes = [];
const notes = [];

const push = (arr, text) => arr.push(`- ${text}`);

const main = async () => {
  const pkgPath = file('package.json');
  const vercelPath = file('vercel.json');
  const vitePath = file('vite.config.js');
  const indexHtmlPath = file('index.html');
  const distIndexPath = file('dist/index.html');

  const pkgJsonStr = await readIfExists(pkgPath);
  const vercelJsonStr = await readIfExists(vercelPath);
  const viteConfigStr = await readIfExists(vitePath);
  const indexHtmlStr = await readIfExists(indexHtmlPath);
  const distIndexHtmlStr = await readIfExists(distIndexPath);

  // Basic project checks
  if (!pkgJsonStr) push(findings, 'package.json 없음');
  else {
    const pkg = JSON.parse(pkgJsonStr);
    const hasVite = !!pkg.devDependencies?.vite || !!pkg.dependencies?.vite;
    const buildCmd = pkg.scripts?.build;
    if (!hasVite) push(findings, 'vite가 devDependencies에 없음');
    if (buildCmd !== 'vite build') {
      push(findings, `build 스크립트가 'vite build'가 아님: ${buildCmd ?? '정의되지 않음'}`);
      push(fixes, "package.json scripts.build를 'vite build'로 설정");
    }
  }

  // Vercel config
  if (!vercelJsonStr) {
    push(findings, 'vercel.json 없음');
    push(fixes, 'Vercel 프로젝트 설정에서 Output Directory를 dist로 설정');
  } else {
    try {
      const v = JSON.parse(vercelJsonStr);
      const usesRoutes = Array.isArray(v.routes);
      const usesRewrites = Array.isArray(v.rewrites);
      if (usesRoutes) {
        push(findings, 'vercel.json에서 routes 사용 중 (정적 자산까지 /index.html로 리라이트될 수 있음)');
        push(fixes, 'routes 대신 rewrites 사용으로 교체해 정적 파일은 그대로 서빙');
      }
      if (!usesRewrites) {
        push(notes, 'rewrites 설정이 없음: SPA 라우팅을 위해 rewrites 추가 권장');
      }
      if (v.outputDirectory !== 'dist') {
        push(findings, `outputDirectory가 dist가 아님: ${v.outputDirectory ?? '미설정'}`);
        push(fixes, "outputDirectory를 'dist'로 설정");
      }
      if (!v.buildCommand) {
        push(notes, 'buildCommand 미설정: Vercel 대시보드에서 npm run build로 자동인식되는지 확인');
      }
    } catch (e) {
      push(findings, `vercel.json 파싱 오류: ${e.message}`);
    }
  }

  // Vite config
  if (!viteConfigStr) {
    push(findings, 'vite.config.js 없음');
  } else {
    if (!/base:\s*['"]\/["']/.test(viteConfigStr)) {
      push(notes, "vite.config.js의 base가 '/'가 아님: Vercel 루트 배포 시 '/' 권장");
    }
  }

  // index.html checks
  if (!indexHtmlStr) {
    push(findings, 'index.html 없음');
  } else {
    if (!/id=["']root["']/.test(indexHtmlStr)) {
      push(findings, "index.html에 id='root' 요소 없음 (React 마운트 실패 가능)");
    }
    if (!/src\s*=\s*["']\/?src\/main\.(js|jsx|ts|tsx)["']/.test(indexHtmlStr)) {
      push(notes, 'index.html이 Vite 엔트리(main.jsx 등)를 로드하지 않음');
    }
  }

  // dist check
  if (!(await exists(file('dist')))) {
    push(notes, 'dist 폴더 없음: 빌드가 실행되지 않았거나 실패');
  } else if (!distIndexHtmlStr) {
    push(notes, 'dist/index.html 없음: 빌드 산출물 확인 필요');
  }

  // Output
  const report = [];
  report.push('# 로컬 진단 보고서');
  report.push('');
  report.push('**대상 경로**: ' + repoRoot);
  report.push('');
  if (findings.length) {
    report.push('**주요 이슈**');
    report.push(...findings);
    report.push('');
  } else {
    report.push('주요 이슈 없음으로 보임.');
  }
  if (fixes.length) {
    report.push('**권장 수정**');
    report.push(...fixes);
    report.push('');
  }
  if (notes.length) {
    report.push('**참고 사항**');
    report.push(...notes);
    report.push('');
  }
  // concise summary
  if (vercelJsonStr?.includes('"routes"')) {
    report.push('요약: routes가 정적 자산 요청까지 잡아 빈 화면 유발 가능. rewrites로 전환 필요.');
  }

  console.log(report.join('\n'));
};

main().catch((e) => {
  console.error('로컬 진단 도중 오류:', e);
  process.exit(1);
});


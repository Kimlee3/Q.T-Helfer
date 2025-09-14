#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
GEN_DIR="$ROOT_DIR/tools/.generated"
mkdir -p "$GEN_DIR"

echo "[1/3] 로컬 진단 실행"
node "$ROOT_DIR/tools/local_diagnose.js" | tee "$GEN_DIR/local_report.md" >/dev/null

echo "[2/3] Gemini 프롬프트 생성"
node "$ROOT_DIR/tools/prepare_gemini_prompt.js"

echo "이제 Gemini CLI를 실행해 주세요 (환경에 맞게 수정):"
echo "  gemini --model gemini-1.5-pro --input $GEN_DIR/gemini_prompt.txt > $GEN_DIR/gemini_report.md"
echo "실행 후, 아래 명령으로 최종 머지합니다:"
echo "  node tools/merge_reports.js"


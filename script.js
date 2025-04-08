// 3. 성경 구절 가져오기 함수 (API 버전으로 대체)
async function fetchBibleVerses(reference) {
    try {
        reference = reference.trim();
        if (!reference) throw new Error('검색할 구절을 입력해주세요.');

        // 1. m.ibibles.net API 형식에 맞게 파라미터 변환
        const convertToIBiblesFormat = (ref) => {
            return ref.replace(/\s+/g, '-')  // 공백 → 하이픈
                     .replace(/:/g, '-')     // 콜론 → 하이픈
                     .replace(/,(?!\s)/g, '/'); // 쉼표 → 슬래시 (다중 구절)
        };

        // 2. API 요청 URL 생성 (CORS 우회 프록시 사용)
        const apiUrl = `https://m.ibibles.net/quote10.htm?kor/${convertToIBiblesFormat(reference)}`;
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;

        // 3. 로딩 상태 표시
        bibleText.value = "성경 본문을 가져오는 중...";

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('API 요청 실패 (서버 응답 오류)');
        
        const html = await response.text();

        // 4. HTML에서 본문 추출 (파싱)
        const extractText = (html) => {
            const startMarker = "<font size=-1>";
            const endMarker = "</font>";
            const startIdx = html.indexOf(startMarker);
            
            if (startIdx === -1) throw new Error("본문 형식이 변경되었습니다");
            
            const endIdx = html.indexOf(endMarker, startIdx + startMarker.length);
            return html.slice(startIdx + startMarker.length, endIdx).trim();
        };

        const text = extractText(html);
        if (!text) throw new Error("해당 구절을 찾을 수 없습니다");

        return `📖 ${reference}\n${text}\n`;

    } catch (error) {
        console.error('API Error:', error);
        
        // 5. API 실패 시 대체 로직 (기존 JSON 파일 사용)
        try {
            const fallbackResult = await fetchBibleVersesFromFile(reference);
            return fallbackResult;
        } catch (fallbackError) {
            throw new Error(`본문 가져오기 실패: ${error.message} (대체 시도도 실패)`);
        }
    }
}

// 4. 본문 가져오기 버튼 이벤트 수정
fetchBtn.addEventListener('click', async () => {
    if (!bibleRef.value) {
        alert('먼저 본문 말씀을 입력해주세요!');
        return;
    }

    try {
        fetchBtn.disabled = true;
        loadingIndicator.style.display = 'inline-block';
        
        // 변경된 부분: 새 API 함수 사용
        const response = await fetchBibleVerses(bibleRef.value);
        bibleText.value = response;
        
    } catch (error) {
        bibleText.value = `오류: ${error.message}`;
        alert(error.message);
    } finally {
        fetchBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
});

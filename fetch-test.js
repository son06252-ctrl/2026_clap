import Papa from 'papaparse';

const csvText = `
,월,화,수 ,목,금 (문해력)
사전평가주간,5/11,5/12,5/13/2026 (설문1),"5/14/2026 (설문2, 사회)",5/15/2026 (문해력)
1교시,"연구원 2:00 학교 방문
기기 점검 및 사전 시험 절차 안내

사전 평가 시간 3-4차시 확보
결석생 ",,,,
2교시,,상담수업(6-5),,,
3교시,,상담수업(6-6),,,
4교시,,,,,
5교시,,,,,
6교시,,,,,
수업준비주간,5/18,5/19/2026 (육상경기),"5/20/2026 (육상경기, 정구부 훈련)",5/21/2026 (정구부 훈련),5/22/2026 (소체 참가)
1교시,"연구원 2:40에 학교로 방문
수업 학반 배정 안내 (CLAP; CLO)
수업 지도안 배부 및 수업별 워크샵 (1시간)

[담임 선생님]
* ppt 확인
* 각종 링크 학교에서 열리는지 확인
* 지도안 내용 숙지",,,,
2교시,,상담수업(6-5),흡연예방,상담수업(6-4),CPR
3교시,,상담수업(6-6),상담수업(6-3),상담수업(6-1),CPR
4교시,,,,,
5교시,,,상담수업(6-2),,
6교시,,,,,
프로젝트,5/25/2026 (대체공휴일),5/26,5/27,5/28,5/29
1교시(9:00-9:40),,6-3(1차시),6-1(3-4차시),6-5(3차시)6-4(3차시),6-2(5차시) 6-5(5차시)
`;

Papa.parse(csvText, {
  complete: (results) => {
    const data = results.data;
    const todayStr = "5/20";
    const classNum = "3";
    let foundCol = -1;
    let foundRowIndex = -1;

    for (let i = 0; i < data.length; i++) {
        if (!data[i] || data[i].length === 0) continue;
        for (let j = 1; j < data[i].length; j++) {
        const cell = data[i][j];
        if (typeof cell === 'string' && (cell.includes(todayStr) || cell.includes("05/20"))) {
            if (data[i][0] && (data[i][0].includes('주간') || data[i][0].includes('프로젝트'))) {
                foundCol = j;
                foundRowIndex = i;
                break;
            }
        }
        }
        if (foundCol !== -1) break;
    }
    
    console.log("Found:", foundRowIndex, foundCol, data[foundRowIndex] ? data[foundRowIndex][foundCol] : 'null');
  }
});

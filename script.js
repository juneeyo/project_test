document.addEventListener('DOMContentLoaded', () => {
    const noteArea = document.getElementById('noteArea');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const labelInput = document.getElementById('labelInput');
    const addLabelBtn = document.getElementById('addLabelBtn');
    const labelsList = document.getElementById('labelsList');
    const labelFilter = document.getElementById('labelFilter');

    let currentLabels = new Set();
    let savedNotes = JSON.parse(localStorage.getItem('savedNotes') || '[]');

    // 라벨 추가 기능
    addLabelBtn.addEventListener('click', () => {
        const labelText = labelInput.value.trim();
        if (labelText && !currentLabels.has(labelText)) {
            currentLabels.add(labelText);
            addLabelToUI(labelText);
            updateLabelFilter();
            labelInput.value = '';
        }
    });

    // 라벨 UI에 추가
    function addLabelToUI(labelText) {
        const labelElement = document.createElement('div');
        labelElement.className = 'label';
        labelElement.innerHTML = `
            ${labelText}
            <span class="remove-label">×</span>
        `;
        
        labelElement.querySelector('.remove-label').addEventListener('click', () => {
            currentLabels.delete(labelText);
            labelElement.remove();
            updateLabelFilter();
        });

        labelsList.appendChild(labelElement);
    }

    // 라벨 필터 업데이트
    function updateLabelFilter() {
        labelFilter.innerHTML = '<option value="">모든 메모</option>';
        currentLabels.forEach(label => {
            const option = document.createElement('option');
            option.value = label;
            option.textContent = label;
            labelFilter.appendChild(option);
        });
    }

    // 메모 저장
    saveBtn.addEventListener('click', () => {
        const note = {
            text: noteArea.value,
            labels: Array.from(currentLabels),
            timestamp: new Date().toISOString()
        };
        
        savedNotes.push(note);
        localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
        alert('메모가 성공적으로 저장되었습니다!');
    });

    // 메모 불러오기
    loadBtn.addEventListener('click', () => {
        const selectedLabel = labelFilter.value;
        const filteredNotes = selectedLabel 
            ? savedNotes.filter(note => note.labels.includes(selectedLabel))
            : savedNotes;

        if (filteredNotes.length > 0) {
            const latestNote = filteredNotes[filteredNotes.length - 1];
            noteArea.value = latestNote.text;
            currentLabels = new Set(latestNote.labels);
            updateLabelsUI();
            alert('메모가 성공적으로 불러와졌습니다!');
        } else {
            alert('저장된 메모가 없습니다!');
        }
    });

    // 라벨 UI 업데이트
    function updateLabelsUI() {
        labelsList.innerHTML = '';
        currentLabels.forEach(label => addLabelToUI(label));
        updateLabelFilter();
    }

    // 메모 지우기
    clearBtn.addEventListener('click', () => {
        if (confirm('메모를 지우시겠습니까?')) {
            noteArea.value = '';
            currentLabels.clear();
            updateLabelsUI();
        }
    });

    // 라벨 필터 변경 이벤트
    labelFilter.addEventListener('change', () => {
        const selectedLabel = labelFilter.value;
        const filteredNotes = selectedLabel 
            ? savedNotes.filter(note => note.labels.includes(selectedLabel))
            : savedNotes;

        if (filteredNotes.length > 0) {
            const latestNote = filteredNotes[filteredNotes.length - 1];
            noteArea.value = latestNote.text;
            currentLabels = new Set(latestNote.labels);
            updateLabelsUI();
        }
    });

    // 페이지 로드 시 저장된 메모 불러오기
    if (savedNotes.length > 0) {
        const latestNote = savedNotes[savedNotes.length - 1];
        noteArea.value = latestNote.text;
        currentLabels = new Set(latestNote.labels);
        updateLabelsUI();
    }
}); 
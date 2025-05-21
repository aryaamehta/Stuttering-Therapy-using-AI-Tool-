// Speech Recording Functionality
let mediaRecorder;
let audioChunks = [];
let audioContext;
let analyser;
let canvasCtx;
let isRecording = false;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize recording section
    const startRecordingBtns = document.querySelectorAll('.start-recording');
    startRecordingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.practice-tools').style.display = 'none';
            document.getElementById('recording-section').style.display = 'block';
            initRecording();
        });
    });

    // Recording controls
    const recordBtn = document.getElementById('record-btn');
    const stopBtn = document.getElementById('stop-btn');
    const visualizer = document.getElementById('visualizer');
    canvasCtx = visualizer.getContext('2d');

    recordBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);

    // Initialize other tool buttons
    document.querySelector('.start-reading').addEventListener('click', () => {
        alert('Reading exercises will be available after login.');
    });

    document.querySelector('.start-conversation').addEventListener('click', () => {
        alert('Conversation practice will be available after login.');
    });
});

async function initRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioChunks = [];
            
            // Here you would typically send the audio to your backend for analysis
            // For now, we'll simulate a response
            simulateAnalysisResponse();
        };
        
        visualize();
    } catch (error) {
        console.error('Error initializing recording:', error);
        alert('Could not access microphone. Please ensure you have granted microphone permissions.');
    }
}

function startRecording() {
    if (!mediaRecorder) return;
    
    mediaRecorder.start();
    isRecording = true;
    document.getElementById('record-btn').disabled = true;
    document.getElementById('stop-btn').disabled = false;
    
    document.getElementById('record-btn').innerHTML = '<i class="fas fa-microphone"></i> Recording...';
}

function stopRecording() {
    if (!mediaRecorder || !isRecording) return;
    
    mediaRecorder.stop();
    isRecording = false;
    document.getElementById('record-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    
    document.getElementById('record-btn').innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
}

function visualize() {
    if (!isRecording && !analyser) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const WIDTH = canvasCtx.canvas.width;
    const HEIGHT = canvasCtx.canvas.height;
    
    analyser.getByteTimeDomainData(dataArray);
    
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(74, 111, 165)';
    canvasCtx.beginPath();
    
    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;
        
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
    
    requestAnimationFrame(visualize);
}

function simulateAnalysisResponse() {
    // Simulate API call delay
    setTimeout(() => {
        const fluencyScore = Math.floor(Math.random() * 40) + 60;
        const wpm = Math.floor(Math.random() * 60) + 100;
        const stutterCount = Math.floor(Math.random() * 5);
        
        document.getElementById('fluency-score').textContent = `${fluencyScore}/100`;
        document.getElementById('wpm').textContent = wpm;
        document.getElementById('stutter-count').textContent = stutterCount;
        
        let feedback = '';
        if (fluencyScore > 80) {
            feedback = 'Excellent fluency! Your speech is very smooth with minimal interruptions.';
        } else if (fluencyScore > 60) {
            feedback = 'Good effort! Your speech is mostly fluent with some minor interruptions. Try to slow down slightly and focus on breathing between phrases.';
        } else {
            feedback = 'Keep practicing! Try to slow down your speech and focus on one word at a time. Breathing exercises may help with fluency.';
        }
        
        document.getElementById('feedback').innerHTML = `
            <h4>Feedback</h4>
            <p>${feedback}</p>
            <p>Suggested exercises:</p>
            <ul>
                <li>Prolonged speech technique</li>
                <li>Breathing exercises</li>
                <li>Slow reading practice</li>
            </ul>
        `;
    }, 1500);
}
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const wordCountDisplay = document.getElementById('word-count');
    const appContainer = document.getElementById('app');
    const resultsSection = document.getElementById('results-section');
    const moodNameEl = document.getElementById('mood-name');
    const moodDescEl = document.getElementById('mood-desc');
    const meterFill = document.getElementById('meter-fill');
    const playlistTracks = document.getElementById('playlist-tracks');
    const statusDot = document.querySelector('.status-indicator .dot');
    const statusText = document.querySelector('.status-indicator span');


    const visualPlayer = document.getElementById('visual-player');
    const vpArt = document.getElementById('vp-art');
    const vpTitle = document.getElementById('vp-title');
    const vpArtist = document.getElementById('vp-artist');
    const vpPlayIcon = document.getElementById('vp-play-icon');
    const vpPrevBtn = document.getElementById('vp-prev');
    const vpNextBtn = document.getElementById('vp-next');
    const vpPlayBtn = document.getElementById('vp-play');
    const vpSeekBar = document.getElementById('vp-seekbar');
    const vpTimeCurrent = document.getElementById('vp-time-current');
    const vpTimeTotal = document.getElementById('vp-time-total');


    const playBtn = document.querySelector('.playlist-actions .btn-icon');
    const playIcon = playBtn.querySelector('i');
    const audio = new Audio();
    audio.volume = 0.5;
    let isPlaying = false;
    let currentTrackIndex = 0;
    let currentTracks = [];
    let isFetching = false;

    function toggleTrackHighlight(isPlayingState, index = currentTrackIndex) {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach(el => el.classList.remove('playing'));
        if (trackItems[index] && isPlayingState) {
            trackItems[index].classList.add('playing');
        }
    }

    async function loadAndPlayTrack(index) {
        if (!currentTracks[index]) return;
        isFetching = true;
        playIcon.className = 'ph ph-spinner ph-spin';
        
        const track = currentTracks[index];
        if (!track.url) {
            try {
                const query = encodeURIComponent(`${track.title} ${track.artist}`);
                const res = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1&entity=song`);
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    track.url = data.results[0].previewUrl;
                    track.cover = data.results[0].artworkUrl100 || '';
                } else {
                    track.url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                    track.cover = '';
                }
            } catch (e) {
                track.url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                track.cover = '';
            }
        }
        
        audio.src = track.url;
        audio.play().catch(e => console.log('Audio playback prevented', e));
        
        playIcon.className = 'ph-bold ph-fill ph-pause';
        isPlaying = true;
        isFetching = false;
        toggleTrackHighlight(true, index);


        visualPlayer.classList.remove('hidden');
        vpTitle.textContent = track.title;
        vpArtist.textContent = track.artist;
        if (track.cover) {
            vpArt.src = track.cover;
            vpArt.style.background = 'transparent';
        } else {
            vpArt.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
            vpArt.style.background = track.art;
        }
        vpPlayIcon.className = 'ph-fill ph-pause';
        vpPrevBtn.disabled = index === 0;
        vpNextBtn.disabled = index === currentTracks.length - 1;
    }

    playBtn.addEventListener('click', async () => {
        if (isFetching || currentTracks.length === 0) return;
        
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'ph-bold ph-play';
            vpPlayIcon.className = 'ph-fill ph-play';
            isPlaying = false;
            toggleTrackHighlight(false, currentTrackIndex);
        } else {
            if (!audio.src || audio.src === window.location.href) {
                await loadAndPlayTrack(currentTrackIndex);
            } else {
                audio.play().catch(e => console.log('Audio playback prevented', e));
                playIcon.className = 'ph-bold ph-fill ph-pause';
                vpPlayIcon.className = 'ph-fill ph-pause';
                isPlaying = true;
                toggleTrackHighlight(true, currentTrackIndex);
            }
        }
    });

    audio.addEventListener('ended', () => {
        if (currentTrackIndex < currentTracks.length - 1) {
            currentTrackIndex++;
            loadAndPlayTrack(currentTrackIndex);
        } else {
            isPlaying = false;
            playIcon.className = 'ph-bold ph-play';
            vpPlayIcon.className = 'ph-fill ph-play';
            toggleTrackHighlight(false, currentTrackIndex);
            currentTrackIndex = 0;
            audio.src = '';
            visualPlayer.classList.add('hidden');
        }
    });


    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        vpSeekBar.max = audio.duration;
        vpSeekBar.value = audio.currentTime;
        
        const formatTime = (sec) => {
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };
        
        vpTimeCurrent.textContent = formatTime(audio.currentTime);
        vpTimeTotal.textContent = formatTime(audio.duration);
        
        const percent = (audio.currentTime / audio.duration) * 100;
        vpSeekBar.style.background = `linear-gradient(to right, #fff ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
    });

    vpSeekBar.addEventListener('input', () => {
        audio.currentTime = vpSeekBar.value;
    });

    vpPlayBtn.addEventListener('click', () => {
        if (!currentTracks[currentTrackIndex]) return;
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'ph-bold ph-play';
            vpPlayIcon.className = 'ph-fill ph-play';
            isPlaying = false;
            toggleTrackHighlight(false, currentTrackIndex);
        } else {
            if (!audio.src || audio.src === window.location.href) {
                loadAndPlayTrack(currentTrackIndex);
            } else {
                audio.play().catch(e => console.log('Audio playback prevented', e));
                playIcon.className = 'ph-bold ph-fill ph-pause';
                vpPlayIcon.className = 'ph-fill ph-pause';
                isPlaying = true;
                toggleTrackHighlight(true, currentTrackIndex);
            }
        }
    });

    vpPrevBtn.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadAndPlayTrack(currentTrackIndex);
        }
    });

    vpNextBtn.addEventListener('click', () => {
        if (currentTrackIndex < currentTracks.length - 1) {
            currentTrackIndex++;
            loadAndPlayTrack(currentTrackIndex);
        }
    });


    textInput.addEventListener('input', () => {
        const text = textInput.value.trim();
        const words = text ? text.split(/\s+/) : [];
        wordCountDisplay.textContent = `${words.length} word${words.length !== 1 ? 's' : ''}`;
        
        if (words.length > 2) {
            analyzeBtn.removeAttribute('disabled');
        } else {
            analyzeBtn.setAttribute('disabled', 'true');
        }
    });

    analyzeBtn.addEventListener('click', () => {
        analyzeText();
    });

    async function analyzeText() {
        resultsSection.style.display = 'block';
        setTimeout(() => resultsSection.classList.remove('hidden'), 50);
        
        if (isPlaying || audio.src) {
            audio.pause();
            audio.currentTime = 0;
            audio.src = '';
            isPlaying = false;
            playIcon.className = 'ph-bold ph-play';
            vpPlayIcon.className = 'ph-fill ph-play';
            toggleTrackHighlight(false);
            visualPlayer.classList.add('hidden');
        }
        
        const originalText = textInput.value;
        statusText.textContent = "Analyzing...";
        statusDot.style.background = "#ffb300";
        statusDot.style.boxShadow = "0 0 10px #ffb300";
        
        analyzeBtn.innerHTML = `<i class="ph ph-spinner ph-spin"></i><span>Processing</span>`;
        analyzeBtn.setAttribute('disabled', 'true');

        try {
            const moodData = await determineMood(originalText);
            updateUI(moodData);
            
            statusText.textContent = "Playlist Ready";
            statusDot.style.background = "#4caf50";
            statusDot.style.boxShadow = "0 0 10px #4caf50";
        } catch (error) {
            console.error("Analysis Failed:", error);
            statusText.textContent = "Analysis Failed";
            statusDot.style.background = "#f44336";
            statusDot.style.boxShadow = "0 0 10px #f44336";
            moodNameEl.textContent = "Error";
            moodDescEl.textContent = "Could not generate playlist. Please try again.";
        } finally {
            analyzeBtn.innerHTML = `<span>Analyze</span><i class="ph-bold ph-arrow-right"></i>`;
            analyzeBtn.removeAttribute('disabled');
        }
    }

    async function determineMood(text) {
        const prompt = `Analyze the sentiment of this text: "${text}". 
Respond ONLY with a valid JSON document with the following structure:
{
  "mood": "happy|sad|angry|relaxed|neutral",
  "confidence": <integer between 0-100>,
  "description": "<A short creative sentence describing the mood queueing up>",
  "tracks": [
    {
      "title": "<Song Title>",
      "artist": "<Artist Name>",
      "time": "<Duration roughly e.g. 3:45>"
    }
  ]
}
Make sure 'tracks' has exactly 10 well known songs that fit the mood. No markdown, just raw JSON.`;

        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const rawText = await response.text();
        
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Invalid output format from AI.");
        }
        
        const data = JSON.parse(jsonMatch[0]);
        
        data.tracks = data.tracks.map(track => {
             const hue1 = Math.floor(Math.random() * 360);
             const hue2 = Math.floor(Math.random() * 360);
             track.art = `linear-gradient(135deg, hsl(${hue1}, 80%, 50%), hsl(${hue2}, 80%, 40%))`;
             return track;
        });

        return data;
    }

    function updateUI(data) {
        appContainer.className = `mood-${data.mood}`;
        
        moodNameEl.textContent = data.mood;
        moodNameEl.style.color = getComputedStyle(document.documentElement).getPropertyValue(`--mood-${data.mood}-1`).trim() || '#fff';
        moodDescEl.textContent = data.description;
        
        setTimeout(() => {
            meterFill.style.width = `${data.confidence}%`;
        }, 100);

        currentTracks = data.tracks || [];
        currentTrackIndex = 0;
        
        playlistTracks.innerHTML = '';
        const tracks = currentTracks;
        currentTrackIndex = 0;
        
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'track-item';
            li.style.animationDelay = `${index * 0.15}s`;
            li.style.cursor = 'pointer';
            
            li.innerHTML = `
                <span class="track-number">${index + 1}</span>
                <div class="track-art-placeholder" style="background: ${track.art}"></div>
                <div class="track-info">
                    <div class="track-title">${track.title}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-duration">${track.time}</div>
            `;
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
                if (currentTrackIndex === index && isPlaying) {
                    audio.pause();
                    playIcon.className = 'ph-bold ph-play';
                    vpPlayIcon.className = 'ph-fill ph-play';
                    isPlaying = false;
                    toggleTrackHighlight(false, currentTrackIndex);
                } else {
                    currentTrackIndex = index;
                    loadAndPlayTrack(index);
                }
            });
            
            playlistTracks.appendChild(li);
        });
        
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    }
});

const voiceSelect = document.querySelector('#voiceSelect');
const playButton = document.querySelector('#playButton');
const textInput = document.querySelector('textarea');
const languageSelect = document.querySelector('#languageSelect');
const translatedBox = document.querySelector('#translatedBox');
const themeToggleButton = document.querySelector('#themeToggleButton');

// Array of supported languages with their ISO codes

const languages = [
  { code: 'en', name: 'English' },
  { code: 'iw', name: 'Hebrew' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
];

// Populate language select box

languages.forEach(({ code, name }) => {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = name;
  languageSelect.appendChild(option);
});

// Load available voices

let voices = [];
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = voices
    .map((voice, index) => {
      return `<option value="${index}">${voice.name} (${voice.lang})</option>`;
    })
    .join('');
}

// Trigger loading voices when they become available
let initialVoicesLoad = true;

if (initialVoicesLoad) {
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
  initialVoicesLoad = false;
}

// Translate text with serverless function
async function translateText(text, targetLang) {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    // {
    //     "data": {
    //       "translations": [
    //         {
    //           "translatedText": "שלום עולם",
    //           "detectedSourceLanguage": "en"
    //         }
    //       ]
    //     }
    //   }

    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation Error: ', error);
    alert('Failed to translate text');
    return text;
  }
}

// TTS

function playText(text, voiceIndex) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (voices[voiceIndex]) {
    utterance.voice = voices[voiceIndex];
  }
  speechSynthesis.speak(utterance);
}

// Play TTS

playButton.addEventListener('click', async () => {
  const text = textInput.value.trim();
  const targetLang = languageSelect.value;
  const selectedVoiceIndex = voiceSelect.value;

  if (!text) {
    alert('Please enter some text!');
    return;
  }

  try {
    // Translate text
    const translatedText = await translateText(text, targetLang);
    translatedBox.textContent = translatedText;
    // Play text
    playText(translatedText, selectedVoiceIndex);
  } catch (error) {
    console.error('Error during processing: ', error);
    alert('An error occurred');
  }
});

themeToggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    themeToggleButton.innerHTML = `
       <g
          fill="none"
          stroke="#888888"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path
            class="light-mode"
            fill-opacity="0"
            stroke-dasharray="36"
            stroke-dashoffset="36"
            d="M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5"
          >
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="1s"
              dur="0.5s"
              values="0;1"
            />
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.5s"
              values="36;0"
            />
          </path>
          <path
            stroke-dasharray="2"
            stroke-dashoffset="2"
            d="M12 19v1M19 12h1M12 5v-1M5 12h-1"
            opacity="0"
          >
            <animate
              fill="freeze"
              attributeName="d"
              begin="0.6s"
              dur="0.2s"
              values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
            />
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.6s"
              dur="0.2s"
              values="2;0"
            />
            <set
              fill="freeze"
              attributeName="opacity"
              begin="0.6s"
              to="1"
            />
            <animateTransform
              attributeName="transform"
              dur="30s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
          <path
            stroke-dasharray="2"
            stroke-dashoffset="2"
            d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"
            opacity="0"
          >
            <animate
              fill="freeze"
              attributeName="d"
              begin="0.8s"
              dur="0.2s"
              values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
            />
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.8s"
              dur="0.2s"
              values="2;0"
            />
            <set
              fill="freeze"
              attributeName="opacity"
              begin="0.8s"
              to="1"
            />
            <animateTransform
              attributeName="transform"
              dur="30s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
        </g>`;
  } else {
    localStorage.setItem('theme', 'light');
    themeToggleButton.innerHTML = `
   
        <path
          fill-opacity="0"
          d="M15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z"
          fill="#888888"
        >
          <animate
            id="lineMdSunnyFilledLoopToMoonFilledLoopTransition0"
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.6s;lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+6s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.2s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <path
          fill-opacity="0"
          d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.2s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <path
          fill-opacity="0"
          d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+0.4s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.8s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <path
          fill-opacity="0"
          d="M20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3.4s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.6s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <g
          fill="none"
          stroke="#888888"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <g>
            <path
              stroke-dasharray="2"
              stroke-dashoffset="4"
              d="M12 21v1M21 12h1M12 3v-1M3 12h-1"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.2s"
                values="4;2"
              />
            </path>
            <path
              stroke-dasharray="2"
              stroke-dashoffset="4"
              d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.2s"
                dur="0.2s"
                values="4;2"
              />
            </path>
            <set
              fill="freeze"
              attributeName="opacity"
              begin="0.5s"
              to="0"
            />
          </g>
          <path
            fill="#888888"
            d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
            opacity="0"
          >
            <set
              fill="freeze"
              attributeName="opacity"
              begin="0.5s"
              to="1"
            />
          </path>
        </g>
        <mask id="lineMdSunnyFilledLoopToMoonFilledLoopTransition1">
          <circle
            cx="12"
            cy="12"
            r="12"
            fill="#fff"
          />
          <circle
            cx="22"
            cy="2"
            r="3"
            fill="#fff"
          >
            <animate
              fill="freeze"
              attributeName="cx"
              begin="0.1s"
              dur="0.4s"
              values="22;18"
            />
            <animate
              fill="freeze"
              attributeName="cy"
              begin="0.1s"
              dur="0.4s"
              values="2;6"
            />
            <animate
              fill="freeze"
              attributeName="r"
              begin="0.1s"
              dur="0.4s"
              values="3;12"
            />
          </circle>
          <circle
            cx="22"
            cy="2"
            r="1"
          >
            <animate
              fill="freeze"
              attributeName="cx"
              begin="0.1s"
              dur="0.4s"
              values="22;18"
            />
            <animate
              fill="freeze"
              attributeName="cy"
              begin="0.1s"
              dur="0.4s"
              values="2;6"
            />
            <animate
              fill="freeze"
              attributeName="r"
              begin="0.1s"
              dur="0.4s"
              values="1;10"
            />
          </circle>
        </mask>
        <circle
          cx="12"
          cy="12"
          r="6"
          mask="url(#lineMdSunnyFilledLoopToMoonFilledLoopTransition1)"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="r"
            begin="0.1s"
            dur="0.4s"
            values="6;10"
          />
          <set
            fill="freeze"
            attributeName="opacity"
            begin="0.5s"
            to="0"
          />
        </circle>
   
    `;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  themeToggleButton.innerHTML = `
   
        <path
          fill-opacity="0"
          d="M15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z"
          fill="#888888"
        >
          <animate
            id="lineMdSunnyFilledLoopToMoonFilledLoopTransition0"
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.6s;lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+6s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.2s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <path
          fill-opacity="0"
          d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.2s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <path
          fill-opacity="0"
          d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+0.4s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+2.8s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <path
          fill-opacity="0"
          d="M20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+3.4s"
            dur="0.4s"
            values="0;1"
          />
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="lineMdSunnyFilledLoopToMoonFilledLoopTransition0.begin+5.6s"
            dur="0.4s"
            values="1;0"
          />
        </path>
        <g
          fill="none"
          stroke="#888888"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <g>
            <path
              stroke-dasharray="2"
              stroke-dashoffset="4"
              d="M12 21v1M21 12h1M12 3v-1M3 12h-1"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                dur="0.2s"
                values="4;2"
              />
            </path>
            <path
              stroke-dasharray="2"
              stroke-dashoffset="4"
              d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.2s"
                dur="0.2s"
                values="4;2"
              />
            </path>
            <set
              fill="freeze"
              attributeName="opacity"
              begin="0.5s"
              to="0"
            />
          </g>
          <path
            fill="#888888"
            d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
            opacity="0"
          >
            <set
              fill="freeze"
              attributeName="opacity"
              begin="0.5s"
              to="1"
            />
          </path>
        </g>
        <mask id="lineMdSunnyFilledLoopToMoonFilledLoopTransition1">
          <circle
            cx="12"
            cy="12"
            r="12"
            fill="#fff"
          />
          <circle
            cx="22"
            cy="2"
            r="3"
            fill="#fff"
          >
            <animate
              fill="freeze"
              attributeName="cx"
              begin="0.1s"
              dur="0.4s"
              values="22;18"
            />
            <animate
              fill="freeze"
              attributeName="cy"
              begin="0.1s"
              dur="0.4s"
              values="2;6"
            />
            <animate
              fill="freeze"
              attributeName="r"
              begin="0.1s"
              dur="0.4s"
              values="3;12"
            />
          </circle>
          <circle
            cx="22"
            cy="2"
            r="1"
          >
            <animate
              fill="freeze"
              attributeName="cx"
              begin="0.1s"
              dur="0.4s"
              values="22;18"
            />
            <animate
              fill="freeze"
              attributeName="cy"
              begin="0.1s"
              dur="0.4s"
              values="2;6"
            />
            <animate
              fill="freeze"
              attributeName="r"
              begin="0.1s"
              dur="0.4s"
              values="1;10"
            />
          </circle>
        </mask>
        <circle
          cx="12"
          cy="12"
          r="6"
          mask="url(#lineMdSunnyFilledLoopToMoonFilledLoopTransition1)"
          fill="#888888"
        >
          <animate
            fill="freeze"
            attributeName="r"
            begin="0.1s"
            dur="0.4s"
            values="6;10"
          />
          <set
            fill="freeze"
            attributeName="opacity"
            begin="0.5s"
            to="0"
          />
        </circle>
   
    `;
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggleButton.innerHTML = `
    <g
       fill="none"
       stroke="#888888"
       stroke-linecap="round"
       stroke-linejoin="round"
       stroke-width="2"
     >
       <path
         class="light-mode"
         fill-opacity="0"
         stroke-dasharray="36"
         stroke-dashoffset="36"
         d="M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5"
       >
         <animate
           fill="freeze"
           attributeName="fill-opacity"
           begin="1s"
           dur="0.5s"
           values="0;1"
         />
         <animate
           fill="freeze"
           attributeName="stroke-dashoffset"
           dur="0.5s"
           values="36;0"
         />
       </path>
       <path
         stroke-dasharray="2"
         stroke-dashoffset="2"
         d="M12 19v1M19 12h1M12 5v-1M5 12h-1"
         opacity="0"
       >
         <animate
           fill="freeze"
           attributeName="d"
           begin="0.6s"
           dur="0.2s"
           values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
         />
         <animate
           fill="freeze"
           attributeName="stroke-dashoffset"
           begin="0.6s"
           dur="0.2s"
           values="2;0"
         />
         <set
           fill="freeze"
           attributeName="opacity"
           begin="0.6s"
           to="1"
         />
         <animateTransform
           attributeName="transform"
           dur="30s"
           repeatCount="indefinite"
           type="rotate"
           values="0 12 12;360 12 12"
         />
       </path>
       <path
         stroke-dasharray="2"
         stroke-dashoffset="2"
         d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"
         opacity="0"
       >
         <animate
           fill="freeze"
           attributeName="d"
           begin="0.8s"
           dur="0.2s"
           values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
         />
         <animate
           fill="freeze"
           attributeName="stroke-dashoffset"
           begin="0.8s"
           dur="0.2s"
           values="2;0"
         />
         <set
           fill="freeze"
           attributeName="opacity"
           begin="0.8s"
           to="1"
         />
         <animateTransform
           attributeName="transform"
           dur="30s"
           repeatCount="indefinite"
           type="rotate"
           values="0 12 12;360 12 12"
         />
       </path>
     </g>`;
  }
});

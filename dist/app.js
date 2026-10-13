/**
 * BREACHMATRIX — Master Application Script
 * Features:
 * - Slide Deck Navigation (1:1 with business portfolio template)
 * - Seamless Mode Switching (Slide Deck vs Scroll Website)
 * - Keyboard Shortcuts & Touch Swipe Gestures
 * - Retro Tactical Web Audio API Sound FX
 * - Secure Dispatch Modal & Interactive Transmission
 */

// Application State
let currentSlideIndex = 0;
const totalSlides = 8;
let isScrollMode = true;
let audioEnabled = false;

// Audio Context (Web Audio API Synthesizer)
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playTacticalBlip(freq = 880, duration = 0.04, type = 'sine') {
  if (!audioEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Slide Navigation
function goToSlide(index) {
  if (index < 0 || index >= totalSlides) return;
  currentSlideIndex = index;

  if (isScrollMode) {
    // Scroll mode: smooth scroll to section
    const targetSec = document.getElementById(`scroll-sec-${index}`);
    if (targetSec) {
      targetSec.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // Deck mode: switch active slide
    const slides = document.querySelectorAll('.deck-slide');
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlideIndex);
    });

    // Update Counter
    const numDisplay = document.getElementById('current-slide-num');
    if (numDisplay) {
      numDisplay.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    // Update Thumbnails
    const thumbs = document.querySelectorAll('.thumb-btn');
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlideIndex);
    });

    // Update Top Nav
    const navLinks = document.querySelectorAll('.top-nav .nav-link');
    navLinks.forEach((link, i) => {
      link.classList.toggle('active', i === currentSlideIndex);
    });

    // Update Side Nav Doodle Encircle
    if (typeof updateSideNavActiveFromSlide === 'function') {
      updateSideNavActiveFromSlide(currentSlideIndex);
    }

    playTacticalBlip(980, 0.05, 'triangle');
  }
}

function nextSlide() {
  const next = (currentSlideIndex + 1) % totalSlides;
  goToSlide(next);
}

function prevSlide() {
  const prev = (currentSlideIndex - 1 + totalSlides) % totalSlides;
  goToSlide(prev);
}

// Mode Switching (Slide Deck <-> Continuous Scroll)
function toggleViewMode() {
  isScrollMode = !isScrollMode;
  document.body.classList.toggle('mode-scroll', isScrollMode);
  document.body.classList.toggle('mode-deck', !isScrollMode);

  const modeBtn = document.getElementById('view-mode-toggle');
  const modeLabel = document.getElementById('mode-label');

  if (isScrollMode) {
    modeBtn.classList.add('active');
    modeLabel.textContent = 'VIEW: SCROLL WEBSITE';
    // Jump to current slide section in scroll view
    const target = document.getElementById(`scroll-sec-${currentSlideIndex}`);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  } else {
    modeBtn.classList.remove('active');
    modeLabel.textContent = 'VIEW: SLIDE DECK';
    goToSlide(currentSlideIndex);
  }

  playTacticalBlip(1200, 0.08, 'sine');
}

// Sound Toggle
function toggleAudio() {
  initAudio();
  audioEnabled = !audioEnabled;
  const audioBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');

  if (audioEnabled) {
    audioBtn.classList.add('active');
    audioIcon.textContent = '⚡ AUDIO: ON';
    playTacticalBlip(880, 0.08, 'sine');
  } else {
    audioBtn.classList.remove('active');
    audioIcon.textContent = '⚡ AUDIO: OFF';
  }
}

// ============================================================================
// BREACHMATRIX AI ARCHITECT CHATBOT & WHATSAPP DISPATCH SYSTEM
// ============================================================================
const BREACHMATRIX_WA_PHONE = '15553216789';

let aiChatState = {
  step: 'greeting', // 'org', 'contact', 'solution', 'notes', 'complete'
  org: '',
  contact: '',
  solution: '',
  notes: '',
  initialized: false,
  isTyping: false
};

function escapeAIChatHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function openSecureDispatchModal(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const modal = document.getElementById('secure-modal');
  if (modal) {
    document.body.classList.add('chat-drawer-open');
    modal.classList.add('open');
    playTacticalBlip(1040, 0.07, 'square');
    if (!aiChatState.initialized) {
      initAIChat();
    }
  }
}

function closeSecureDispatchModal() {
  const modal = document.getElementById('secure-modal');
  if (modal) {
    document.body.classList.remove('chat-drawer-open');
    modal.classList.remove('open');
    playTacticalBlip(520, 0.05, 'sine');
  }
}

function switchDrawerTab(tab) {
  const chatView = document.getElementById('ai-chat-view');
  const formView = document.getElementById('ai-form-view');
  const tabBtnChat = document.getElementById('tab-btn-chat');
  const tabBtnForm = document.getElementById('tab-btn-form');

  if (tab === 'chat') {
    if (chatView) chatView.style.display = 'flex';
    if (formView) formView.style.display = 'none';
    tabBtnChat?.classList.add('active');
    tabBtnForm?.classList.remove('active');
  } else {
    if (chatView) chatView.style.display = 'none';
    if (formView) formView.style.display = 'flex';
    tabBtnChat?.classList.remove('active');
    tabBtnForm?.classList.add('active');

    // Sync collected values into form
    if (aiChatState.org && document.getElementById('org-input')) {
      document.getElementById('org-input').value = aiChatState.org;
    }
    if (aiChatState.contact && document.getElementById('email-input')) {
      document.getElementById('email-input').value = aiChatState.contact;
    }
    if (aiChatState.notes && document.getElementById('notes-input')) {
      document.getElementById('notes-input').value = aiChatState.notes;
    }
  }
  playTacticalBlip(800, 0.04, 'sine');
}

function getChatTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function initAIChat() {
  aiChatState = {
    step: 'initial',
    org: '',
    contact: '',
    solution: '',
    notes: '',
    initialized: true,
    isTyping: false
  };

  const container = document.getElementById('ai-messages-container');
  if (container) container.innerHTML = '';

  showTyping(true);
  setTimeout(() => {
    showTyping(false);
    renderBotMessage(
      `Hello! Welcome to **BreachMatrix**. Please choose an inquiry option below or type your message directly:`,
      [
        'Project & Solution Inquiry',
        'Direct Email Inquiry',
        'WhatsApp Engineering Desk'
      ]
    );
    const input = document.getElementById('ai-user-input');
    if (input) input.focus();
  }, 350);
}

function resetAIChat() {
  playTacticalBlip(640, 0.06, 'sawtooth');
  initAIChat();
}

function showTyping(show) {
  aiChatState.isTyping = show;
  const indicator = document.getElementById('ai-typing-indicator');
  if (indicator) {
    indicator.style.display = show ? 'flex' : 'none';
    scrollAIChatToBottom();
  }
}

function scrollAIChatToBottom() {
  const container = document.getElementById('ai-messages-container');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function renderBotMessage(markdownText, chips = [], withBrief = false) {
  const container = document.getElementById('ai-messages-container');
  if (!container) return;

  const timeStr = getChatTimestamp();
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg bot';

  let formatted = escapeAIChatHtml(markdownText)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  let briefHtml = '';
  if (withBrief) {
    briefHtml = `
      <div class="ai-brief-card">
        <div class="brief-header">
          <span class="brief-title">📋 SOLUTION BRIEF ASSEMBLED</span>
          <span class="brief-tag">READY FOR DISPATCH</span>
        </div>
        <div class="brief-row"><strong>🏢 Org:</strong> ${escapeAIChatHtml(aiChatState.org || 'Not Specified')}</div>
        <div class="brief-row"><strong>👤 Contact:</strong> ${escapeAIChatHtml(aiChatState.contact || 'Not Specified')}</div>
        <div class="brief-row"><strong>⚡ Solution:</strong> ${escapeAIChatHtml(aiChatState.solution || 'Custom Software Development')}</div>
        <div class="brief-row"><strong>🎯 Goals / Friction:</strong> ${escapeAIChatHtml(aiChatState.notes || 'Full Lifecycle Solutions')}</div>
        <div class="brief-actions">
          <button type="button" class="btn-wa-dispatch" onclick="dispatchBriefToWhatsApp()">
            <svg class="wa-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            DISPATCH VIA WHATSAPP (+1 555-321-6789) ➔
          </button>
          <button type="button" class="btn-wa-share" onclick="shareBriefViaWhatsApp()">
            📲 Share to Another WhatsApp Contact
          </button>
          <button type="button" class="btn-copy-brief" onclick="copyBriefText()">
            📋 Copy Brief Text to Clipboard
          </button>
        </div>
      </div>
    `;
  }

  msgDiv.innerHTML = `
    <div class="msg-bubble-wrap">
      <div class="msg-bubble">${formatted}${briefHtml}</div>
      <span class="msg-timestamp">${timeStr}</span>
    </div>
  `;

  container.appendChild(msgDiv);
  playTacticalBlip(1280, 0.05, 'sine');
  renderChipsInFlow(chips);
  scrollAIChatToBottom();
}

function renderChipsInFlow(chips) {
  const container = document.getElementById('ai-messages-container');
  if (!container) return;

  const existingPending = container.querySelectorAll('.chat-msg-options-pending');
  existingPending.forEach(el => el.remove());

  if (!chips || chips.length === 0) return;

  const timeStr = getChatTimestamp();
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'chat-msg bot chat-msg-options-pending';
  optionsDiv.innerHTML = `
    <div class="msg-bubble-wrap">
      <div class="ai-pills-card">
        ${chips.map(c => `
          <button type="button" class="ai-pill-btn" onclick="handleChipClick('${escapeAIChatHtml(c)}')">
            ${escapeAIChatHtml(c)}
          </button>
        `).join('')}
      </div>
      <span class="msg-timestamp">${timeStr}</span>
    </div>
  `;
  container.appendChild(optionsDiv);
}

function renderUserMessage(text) {
  const container = document.getElementById('ai-messages-container');
  if (!container) return;

  const existingPending = container.querySelectorAll('.chat-msg-options-pending');
  existingPending.forEach(el => el.remove());

  const timeStr = getChatTimestamp();
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg user';
  msgDiv.innerHTML = `
    <div class="msg-bubble-wrap">
      <div class="msg-bubble">${escapeAIChatHtml(text)}</div>
      <span class="msg-timestamp">${timeStr}</span>
    </div>
  `;

  container.appendChild(msgDiv);
  scrollAIChatToBottom();
}

function handleChipClick(chipText) {
  playTacticalBlip(980, 0.04, 'triangle');
  processUserMessage(chipText);
}

function handleAIChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('ai-user-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  processUserMessage(text);
}

function processUserMessage(rawText) {
  if (aiChatState.isTyping) return;
  renderUserMessage(rawText);
  showTyping(true);

  const text = rawText.trim();
  const lower = text.toLowerCase();

  setTimeout(() => {
    showTyping(false);

    // Global reset check
    if (lower === 'reset' || lower === 'restart' || lower === 'start over') {
      initAIChat();
      return;
    }

    if (aiChatState.step === 'initial') {
      if (lower.includes('project') || lower.includes('brief') || lower.includes('form') || lower.includes('solution')) {
        aiChatState.step = 'org';
        renderBotMessage(
          `Understood! To prepare your project inquiry, what is your company or organization name?`,
          ['Acme Innovations', 'Stealth Startup', 'Enterprise Partner', 'Personal / Independent']
        );
      } else if (lower.includes('phone') || lower.includes('whatsapp') || lower.includes('desk') || lower.includes('call')) {
        renderBotMessage(
          `Connecting directly to our WhatsApp engineering desk at +1 555-321-6789. You can also message us below:`,
          ['Project & Solution Inquiry', '↻ Start Over']
        );
        triggerDirectWhatsApp();
      } else if (lower.includes('email') || lower.includes('mail')) {
        aiChatState.step = 'contact';
        renderBotMessage(
          `Understood! Please provide your name and email address for our engineering team to follow up:`,
          ['Direct Lead (hello@mycompany.com)', 'Prefer WhatsApp Callback']
        );
      } else {
        // User typed an org name or custom message directly
        aiChatState.org = text;
        aiChatState.step = 'contact';
        renderBotMessage(
          `Understood! Connecting with **${aiChatState.org}**.\n\nWho will be our primary contact person? Please enter your **name and email or phone number**.`,
          ['Direct Lead (email@org.com)', 'Prefer WhatsApp Callback']
        );
      }
    } else if (aiChatState.step === 'org') {
      aiChatState.org = text;
      aiChatState.step = 'contact';
      renderBotMessage(
        `Understood! Connecting with **${aiChatState.org}**.\n\nWho will be our primary contact person? Please enter your **name and email or phone number**.`,
        ['Direct Lead (email@org.com)', 'Prefer WhatsApp Callback']
      );
    } else if (aiChatState.step === 'contact') {
      aiChatState.contact = text;
      aiChatState.step = 'solution';
      renderBotMessage(
        `Contact information stored: **${aiChatState.contact}**.\n\nWhat **core software solution or engagement model** is ${aiChatState.org} targeting?`,
        [
          '🛠️ Custom Software Product',
          '⚙️ Everyday Workflow Automation',
          '🧩 Problem-Solution Matching',
          '🔄 Continuous Development & Support'
        ]
      );
    } else if (aiChatState.step === 'solution') {
      aiChatState.solution = text;
      aiChatState.step = 'notes';
      renderBotMessage(
        `Requirement categorized under **${aiChatState.solution}**.\n\nWhat **specific everyday problems, workflow frictions, or project milestones** would you like us to solve?`,
        [
          'Eliminate manual repetitive bottlenecks',
          'Modernize legacy codebase & system friction',
          'Build rapid MVP for enterprise rollout',
          'Continuous dedicated engineering team'
        ]
      );
    } else if (aiChatState.step === 'notes') {
      aiChatState.notes = text;
      aiChatState.step = 'complete';
      renderBotMessage(
        `All details received! 🎯 Here is your project inquiry summary below.\n\nClick **Dispatch via WhatsApp** to transmit your brief directly to our team.`,
        ['💬 Send via WhatsApp Now', '🔄 Modify Details', '↻ Start Over'],
        true
      );
    } else {
      // Completed state or general conversational inquiry
      if (lower.includes('whatsapp') || lower.includes('send') || lower.includes('transmit')) {
        dispatchBriefToWhatsApp();
        renderBotMessage(
          `Opening WhatsApp with your solution brief. If the window did not open, click the button below:`,
          ['💬 Open WhatsApp Again', '↻ Restart Chat'],
          true
        );
      } else if (lower.includes('synapse') || lower.includes('flow')) {
        renderBotMessage(
          `**Synapse Flow** is BreachMatrix's adaptive workflow orchestration platform. It connects disparate legacy systems and eliminates day-to-day manual friction with real-time feedback loops.`,
          ['Dispatch via WhatsApp', 'Ask Another Question']
        );
      } else if (lower.includes('resolvex') || lower.includes('resolve')) {
        renderBotMessage(
          `**ResolveX** is our problem-solution matching engine. It diagnoses complex organizational bottlenecks and matches them to continuous, custom-engineered software solutions.`,
          ['Dispatch via WhatsApp', 'Ask Another Question']
        );
      } else if (lower.includes('modify') || lower.includes('edit')) {
        aiChatState.step = 'org';
        renderBotMessage(
          `Let's refine your brief. What is the updated **Organization Name**?`,
          [aiChatState.org || 'Acme Corp']
        );
      } else {
        renderBotMessage(
          `Your brief for **${aiChatState.org || 'your organization'}** is ready. Would you like to transmit it to our WhatsApp desk right now?`,
          ['💬 Send via WhatsApp Now', '↻ Start Over'],
          true
        );
      }
    }
  }, 650);
}

function generateWhatsAppMessage() {
  const org = aiChatState.org || document.getElementById('org-input')?.value || 'Confidential Client';
  const contact = aiChatState.contact || document.getElementById('email-input')?.value || 'Direct Inquirer';
  const solution = aiChatState.solution || document.getElementById('scope-input')?.value || 'Custom Software Product Development';
  const notes = aiChatState.notes || document.getElementById('notes-input')?.value || 'Inquiry regarding software products and continuous services.';

  return `*BREACHMATRIX SOLUTION DISPATCH*
━━━━━━━━━━━━━━━━━━━━━
🏢 *Organization:* ${org}
👤 *Contact:* ${contact}
⚡ *Required Solution:* ${solution}
🎯 *Everyday Friction & Goals:* ${notes}
━━━━━━━━━━━━━━━━━━━━━
_Dispatched via BreachMatrix AI Solution Architect_`;
}

function dispatchBriefToWhatsApp() {
  const msg = generateWhatsAppMessage();
  const url = `https://api.whatsapp.com/send?phone=${BREACHMATRIX_WA_PHONE}&text=${encodeURIComponent(msg)}`;
  playTacticalBlip(1760, 0.2, 'sine');
  window.open(url, '_blank');
}

function shareBriefViaWhatsApp() {
  const msg = generateWhatsAppMessage();
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  playTacticalBlip(1400, 0.15, 'triangle');
  window.open(url, '_blank');
}

function copyBriefText() {
  const msg = generateWhatsAppMessage();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg).then(() => {
      alert('✔ Solution Brief copied to clipboard! You can paste it into WhatsApp.');
      playTacticalBlip(1040, 0.1, 'sine');
    }).catch(() => {
      prompt('Copy your WhatsApp message:', msg);
    });
  } else {
    prompt('Copy your WhatsApp message:', msg);
  }
}

function triggerDirectWhatsApp(e) {
  if (e) e.stopPropagation();
  const msg = aiChatState.org 
    ? generateWhatsAppMessage()
    : `*BREACHMATRIX INQUIRY*\nHello! I would like to connect with your solution architects regarding custom software products and services.`;
  const url = `https://api.whatsapp.com/send?phone=${BREACHMATRIX_WA_PHONE}&text=${encodeURIComponent(msg)}`;
  playTacticalBlip(1760, 0.15, 'sine');
  window.open(url, '_blank');
}

// Quick Form Submission
function handleDispatchSubmit(e) {
  e.preventDefault();
  const org = document.getElementById('org-input')?.value || '';
  const email = document.getElementById('email-input')?.value || '';
  const scope = document.getElementById('scope-input')?.value || '';
  const notes = document.getElementById('notes-input')?.value || '';
  
  aiChatState.org = org;
  aiChatState.contact = email;
  aiChatState.solution = scope;
  aiChatState.notes = notes;

  const btn = document.getElementById('btn-submit-dispatch');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'CONNECTING TO WHATSAPP...';
  }
  playTacticalBlip(1400, 0.15, 'sawtooth');

  setTimeout(() => {
    dispatchBriefToWhatsApp();
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'TRANSMIT BRIEF VIA WHATSAPP ➔';
    }
  }, 500);
}

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
  // Ignore if user is typing in form inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    return;
  }

  if (!isScrollMode) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    }
  }

  if (e.key === 'Escape') {
    closeSecureDispatchModal();
  }
});

// Touch Swipe Detection for Slide Deck
let touchStartX = 0;
let touchEndX = 0;

window.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  if (isScrollMode) return;
  const threshold = 50;
  if (touchEndX < touchStartX - threshold) {
    nextSlide();
  } else if (touchEndX > touchStartX + threshold) {
    prevSlide();
  }
}

// ============================================================================
// SIDE NAV DOODLE ENCIRCLE ACTIVE INDICATOR
// ============================================================================
const slideToSectionMap = {
  0: 'cover',
  1: 'cover',
  2: 'about',
  3: 'recruit',
  4: 'works',
  5: 'service',
  6: 'works',
  7: 'contact'
};

function updateSideNavActive(sectionKey) {
  const panel = document.getElementById('staggered-menu-panel');
  if (!panel) return;
  const items = panel.querySelectorAll('.sm-panel-item');
  items.forEach(item => {
    const isCurrent = item.getAttribute('data-section') === sectionKey;
    if (isCurrent) {
      if (!item.classList.contains('active')) {
        item.classList.add('active');
        const path = item.querySelector('.sm-doodle-oval path');
        if (path) {
          path.style.strokeDashoffset = '1100';
          void path.getBoundingClientRect();
          path.style.strokeDashoffset = '0';
        }
      }
    } else {
      item.classList.remove('active');
      const path = item.querySelector('.sm-doodle-oval path');
      if (path) {
        path.style.strokeDashoffset = '1100';
      }
    }
  });
}

function updateSideNavActiveFromSlide(slideIdx) {
  const sectionKey = slideToSectionMap[slideIdx] || 'cover';
  updateSideNavActive(sectionKey);
}

function initPageActiveItem() {
  const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
  if (currentPath.includes('about')) {
    updateSideNavActive('about');
  } else if (currentPath.includes('works')) {
    updateSideNavActive('works');
  } else if (currentPath.includes('service')) {
    updateSideNavActive('service');
  } else if (currentPath.includes('recruit')) {
    updateSideNavActive('recruit');
  } else if (currentPath.includes('contact')) {
    updateSideNavActive('contact');
  } else {
    updateSideNavActiveFromSlide(currentSlideIndex);
  }
}

// Scroll Progress Spy for Scroll Mode
function updateScrollSpy() {
  if (!isScrollMode) return;

  // Active Nav Link Spy
  const sections = document.querySelectorAll('.scroll-section');
  if (!sections.length) return;

  sections.forEach((sec, idx) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
      currentSlideIndex = idx;
      const navLinks = document.querySelectorAll('.top-nav .nav-link');
      navLinks.forEach((link, i) => {
        link.classList.toggle('active', i === idx);
      });

      // Update Side Nav Active Doodle
      updateSideNavActiveFromSlide(idx);
    }
  });
}

window.addEventListener('scroll', updateScrollSpy);

// UI Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
  const modeBtn = document.getElementById('view-mode-toggle');
  if (modeBtn) modeBtn.addEventListener('click', toggleViewMode);

  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn) audioBtn.addEventListener('click', toggleAudio);

  // Close modal when clicking on backdrop
  const modal = document.getElementById('secure-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSecureDispatchModal();
    });
  }

  // Click on re-expand indicator badge to close chat and re-expand website
  const reexpandIndicator = document.getElementById('site-reexpand-indicator');
  if (reexpandIndicator) {
    reexpandIndicator.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSecureDispatchModal();
    });
  }

  // Interactive UI buttons sound effect on hover
  document.querySelectorAll('button, .index-item-card, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => playTacticalBlip(540, 0.03, 'sine'));
  });

  // Initialize scroll spy and page active item on load
  updateScrollSpy();
  if (typeof initPageActiveItem === 'function') {
    initPageActiveItem();
  }

  // Initialize GSAP Staggered Side Nav Bar
  initStaggeredMenu({
    position: 'right',
    colors: ['#181820', '#d4ff00'],
    accentColor: '#d4ff00',
    menuButtonColor: '#ffffff',
    openMenuButtonColor: '#d4ff00',
    changeMenuColorOnOpen: true,
    closeOnClickAway: true
  });
});

// ============================================================================
// STAGGERED SIDE NAV BAR (GSAP ANIMATION CONTROLLER)
// ============================================================================
function initStaggeredMenu({
  position = 'right',
  colors = ['#181820', '#d4ff00'],
  menuButtonColor = '#ffffff',
  openMenuButtonColor = '#d4ff00',
  accentColor = '#d4ff00',
  changeMenuColorOnOpen = true,
  closeOnClickAway = true
} = {}) {
  const wrapper = document.getElementById('staggered-menu-wrapper');
  if (!wrapper || typeof gsap === 'undefined') return;

  const panel = document.getElementById('staggered-menu-panel');
  const preContainer = document.getElementById('sm-prelayers');
  const toggleBtn = document.getElementById('sm-toggle-btn');
  const textInner = document.getElementById('sm-toggle-textInner');
  const icon = document.getElementById('sm-icon');
  const plusH = document.getElementById('sm-icon-plus-h');
  const plusV = document.getElementById('sm-icon-plus-v');

  if (!panel || !toggleBtn || !icon || !textInner) return;

  let isOpen = false;
  let isBusy = false;
  let openTimeline = null;
  let closeTween = null;
  let spinTween = null;
  let colorTween = null;
  let textCycleAnim = null;
  let itemEntranceTween = null;

  const backdrop = document.getElementById('sm-backdrop');
  const preLayers = preContainer ? Array.from(preContainer.querySelectorAll('.sm-prelayer')) : [];
  const offscreen = position === 'left' ? -100 : 100;

  // Initial GSAP Setup
  gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
  if (backdrop) {
    gsap.set(backdrop, { opacity: 0 });
  }
  if (preContainer) {
    gsap.set(preContainer, { xPercent: 0, opacity: 1 });
  }
  if (plusH) gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
  if (plusV) gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
  gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
  gsap.set(textInner, { yPercent: 0 });
  gsap.set(toggleBtn, { color: menuButtonColor });

  function buildOpenTimeline() {
    openTimeline?.kill();
    closeTween?.kill();
    itemEntranceTween?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const layerStates = preLayers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 120, rotate: 6, opacity: 0 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0, y: 12 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 20, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    // Smooth Backdrop Dimmer
    if (backdrop) {
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
    }

    // Cascading Layers with fluid power3 easing
    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.65, ease: 'power3.out' }, i * 0.08);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.08 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.09 : 0);
    const panelDuration = 0.7;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power3.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.2;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          stagger: { each: 0.06, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.5,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.05, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.45;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
            stagger: { each: 0.06, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.05
        );
      }
    }

    openTimeline = tl;
    return tl;
  }

  function playOpen() {
    if (isBusy) return;
    isBusy = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        isBusy = false;
      });
      tl.play(0);
    } else {
      isBusy = false;
    }
  }

  function playClose() {
    openTimeline?.kill();
    openTimeline = null;
    itemEntranceTween?.kill();

    const all = [...preLayers, panel];
    closeTween?.kill();

    if (backdrop) {
      gsap.to(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.inOut' });
    }

    closeTween = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.38,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 120, rotate: 6, opacity: 0 });
        }
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0, y: 12 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 20, opacity: 0 });
        isBusy = false;
      }
    });
  }

  function animateIcon(opening) {
    if (!icon) return;
    spinTween?.kill();
    if (opening) {
      spinTween = gsap.to(icon, { rotate: 225, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
    } else {
      spinTween = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }

  function animateColor(opening) {
    if (!toggleBtn) return;
    colorTween?.kill();
    if (changeMenuColorOnOpen) {
      const targetColor = opening ? openMenuButtonColor : menuButtonColor;
      colorTween = gsap.to(toggleBtn, {
        color: targetColor,
        delay: 0.18,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      gsap.set(toggleBtn, { color: menuButtonColor });
    }
  }

  function animateText(opening) {
    if (!textInner) return;
    textCycleAnim?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    textInner.innerHTML = seq.map(line => `<span class="sm-toggle-line">${line}</span>`).join('');

    gsap.set(textInner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnim = gsap.to(textInner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }

  function toggleMenu() {
    const target = !isOpen;
    isOpen = target;
    wrapper.setAttribute('data-open', target ? 'true' : '');
    if (!target) wrapper.removeAttribute('data-open');
    panel.setAttribute('aria-hidden', target ? 'false' : 'true');
    toggleBtn.setAttribute('aria-expanded', target ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', target ? 'Close menu' : 'Open menu');

    if (target) {
      document.documentElement.classList.add('menu-open-scroll-lock');
      document.body.classList.add('menu-open-scroll-lock');
      if (typeof initPageActiveItem === 'function') {
        initPageActiveItem();
      }
      playOpen();
    } else {
      document.documentElement.classList.remove('menu-open-scroll-lock');
      document.body.classList.remove('menu-open-scroll-lock');
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }

  function closeMenu() {
    if (isOpen) {
      isOpen = false;
      document.documentElement.classList.remove('menu-open-scroll-lock');
      document.body.classList.remove('menu-open-scroll-lock');
      wrapper.removeAttribute('data-open');
      panel.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open menu');
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  if (closeOnClickAway) {
    document.addEventListener('mousedown', (event) => {
      if (!isOpen) return;
      if (!panel.contains(event.target) && !toggleBtn.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Handle Menu link clicks with smooth scroll & reliable page redirection
  panel.querySelectorAll('.sm-panel-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      const slideIdx = item.getAttribute('data-slide');
      const sectionKey = item.getAttribute('data-section');
      const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

      if (sectionKey && typeof updateSideNavActive === 'function') {
        updateSideNavActive(sectionKey);
      }

      if (!href) return;

      const isIndex = currentPath === 'index.html' || currentPath === '' || currentPath.endsWith('/');

      // Case 1: Clicking COVER while on index.html
      if (isIndex && (href === 'index.html#scroll-sec-0' || href === '#scroll-sec-0' || href === 'index.html')) {
        e.preventDefault();
        closeMenu();
        const targetElement = document.getElementById('scroll-sec-0');
        if (targetElement) {
          if (document.body.classList.contains('mode-scroll')) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            if (typeof goToSlide === 'function') {
              goToSlide(0);
            }
          }
        }
        return;
      }

      // Case 2: Target is a separate page (about.html, works.html, service.html, recruit.html, contact.html)
      // or redirecting back to index.html from another page
      const targetBase = href.split('#')[0];
      if (targetBase && targetBase !== currentPath) {
        e.preventDefault();
        closeMenu();
        // Reliable direct navigation
        window.location.href = href;
        return;
      }

      // Case 3: In-page anchor hash scroll
      if (href.includes('#')) {
        const hash = '#' + href.split('#')[1];
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          e.preventDefault();
          closeMenu();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }

      // Case 4: Same page link click
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
}

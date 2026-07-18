import { getFolderQuizQuestions, QuizQuestion } from "./questionsData";

class QuizAudio {
  private ctx: AudioContext | null = null;

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Clean, professional clock tick
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
      
      gain.gain.setValueAtTime(0.18, now); // Audibly louder tick
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04); // quick snap decay
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Audio playTick error:", e);
    }
  }

  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Beautiful ascending major arpeggio with warm, bright bells
      // Notes: C5 (523.25 Hz), E5 (659.25 Hz), G5 (783.99 Hz), C6 (1046.50 Hz)
      const notes = [
        { freq: 523.25, delay: 0.0, dur: 0.65 },
        { freq: 659.25, delay: 0.08, dur: 0.65 },
        { freq: 783.99, delay: 0.16, dur: 0.75 },
        { freq: 1046.50, delay: 0.24, dur: 0.95 }
      ];
      
      notes.forEach(({ freq, delay, dur }) => {
        const start = now + delay;
        const osc1 = this.ctx!.createOscillator(); // Pure base
        const osc2 = this.ctx!.createOscillator(); // Warm harmonics
        const gain = this.ctx!.createGain();
        
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, start);
        
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.40, start + 0.03); // Premium louder attack
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx!.destination);
        
        osc1.start(start);
        osc2.start(start);
        osc1.stop(start + dur + 0.05);
        osc2.stop(start + dur + 0.05);
      });
    } catch (e) {
      console.warn("Audio playCorrect error:", e);
    }
  }

  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Professional, highly audible dual-tone warning buzzer (classic game show "wrong answer" vibe)
      // Uses frequencies perfectly optimized for all speakers (mobile, laptop, and monitors)
      const osc1 = this.ctx.createOscillator(); // Main body
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(320, now); // 320 Hz (highly audible mid frequency)
      osc1.frequency.linearRampToValueAtTime(240, now + 0.4); // Subtle downward pitch slide
      
      const osc2 = this.ctx.createOscillator(); // Harsh dissonant harmonic (perfect for warning alert)
      osc2.type = "square";
      osc2.frequency.setValueAtTime(220, now); // 220 Hz (dissonant relation to 320Hz)
      osc2.frequency.linearRampToValueAtTime(160, now + 0.4);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, now); // Allows clear mid-range punch, filters out high-pitch squeals

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.75, now + 0.03); // High impactful volume for guaranteed audibility
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45); // Clean, sharp decay
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio playWrong error:", e);
    }
  }
}

export class QuizEngine {
  private static audio = new QuizAudio();
  
  // Quiz states
  private static highestUnlockedFolder: number = 1;
  private static activeFolderId: number | null = null;
  private static questions: QuizQuestion[] = [];
  private static currentIndex: number = 0;
  private static score: number = 0;
  private static userAnswers: { [key: number]: number | null } = {}; // qIndex -> optionIndex
  private static timerSeconds: number = 20;
  private static timerInterval: any = null;
  private static isAnswered: boolean = false;

  static init() {
    // Load progress from localStorage
    const saved = localStorage.getItem("quiz_highest_unlocked_folder");
    if (saved) {
      this.highestUnlockedFolder = parseInt(saved, 10);
      if (isNaN(this.highestUnlockedFolder) || this.highestUnlockedFolder < 1) {
        this.highestUnlockedFolder = 1;
      }
    } else {
      this.highestUnlockedFolder = 1;
    }
    this.renderFolders();
  }

  static getHighestUnlocked() {
    return this.highestUnlockedFolder;
  }

  static unlockNextFolder(folderId: number) {
    if (folderId === this.highestUnlockedFolder) {
      this.highestUnlockedFolder = folderId + 1;
      localStorage.setItem("quiz_highest_unlocked_folder", this.highestUnlockedFolder.toString());
    }
  }

  static resetProgress() {
    this.highestUnlockedFolder = 1;
    localStorage.setItem("quiz_highest_unlocked_folder", "1");
    this.renderFolders();
  }

  static startFolder(folderId: number) {
    if (folderId > this.highestUnlockedFolder) {
      alert("দুঃখিত, এই কুইজ ধাপটি এখনো লক করা আছে!");
      return;
    }
    // Initialize Web Audio upon user action
    this.audio.init();

    this.activeFolderId = folderId;
    this.questions = getFolderQuizQuestions(folderId);
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = {};
    this.isAnswered = false;

    // Show quiz container, hide folder selection list
    const listEl = document.getElementById("quiz-folders-container");
    const playEl = document.getElementById("quiz-play-container");
    
    if (listEl) listEl.style.display = "none";
    if (playEl) playEl.style.display = "block";

    this.loadQuestion();
  }

  private static loadQuestion() {
    if (!this.questions || this.questions.length === 0) return;
    this.isAnswered = false;
    this.timerSeconds = 20;
    
    // Clear previous timer if any
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Set up Question view
    const q = this.questions[this.currentIndex];
    
    const progressText = document.getElementById("quiz-progress-text");
    const difficultyBadge = document.getElementById("quiz-difficulty-badge");
    const qText = document.getElementById("quiz-question-text");
    const optionsGrid = document.getElementById("quiz-options-grid");
    const explanationCard = document.getElementById("quiz-explanation-card");
    const nextBtn = document.getElementById("quiz-next-btn");
    const timerProgress = document.getElementById("quiz-timer-bar");
    const timerText = document.getElementById("quiz-timer-text");

    if (progressText) {
      progressText.innerText = `প্রশ্ন: ${this.currentIndex + 1} / 20`;
    }

    if (difficultyBadge) {
      let diffBangla = "সহজ";
      let diffColor = "#10B981"; // green
      if (q.difficulty === "medium") {
        diffBangla = "মধ্যম";
        diffColor = "#F59E0B"; // amber
      } else if (q.difficulty === "hard") {
        diffBangla = "জটিল";
        diffColor = "#EF4444"; // red
      }
      difficultyBadge.innerText = diffBangla;
      difficultyBadge.style.backgroundColor = diffColor + "15";
      difficultyBadge.style.color = diffColor;
      difficultyBadge.style.borderColor = diffColor + "30";
    }

    if (qText) {
      qText.innerText = q.question;
    }

    if (explanationCard) {
      explanationCard.style.display = "none";
    }

    if (nextBtn) {
      nextBtn.style.display = "none";
    }

    // Render options
    if (optionsGrid) {
      optionsGrid.innerHTML = "";
      const options = [q.option1, q.option2, q.option3, q.option4];
      options.forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-button";
        btn.id = `option-btn-${idx + 1}`;
        btn.style.cssText = `
          width: 100%;
          text-align: left;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #E2E8F0;
          background: white;
          color: #1E293B;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          outline: none;
        `;
        
        // Hover effects
        btn.onmouseover = () => {
          if (!this.isAnswered) {
            btn.style.borderColor = "#00BFA1";
            btn.style.background = "#F0FDF4";
          }
        };
        btn.onmouseout = () => {
          if (!this.isAnswered) {
            btn.style.borderColor = "#E2E8F0";
            btn.style.background = "white";
          }
        };

        // Option prefix
        const prefix = document.createElement("span");
        prefix.style.cssText = `
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #F1F5F9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
        `;
        const prefixMap = ["ক", "খ", "গ", "ঘ"];
        prefix.innerText = prefixMap[idx];
        btn.appendChild(prefix);

        const content = document.createElement("span");
        content.innerText = optText;
        content.style.flex = "1";
        btn.appendChild(content);

        btn.onclick = () => this.handleAnswerSelection(idx + 1);
        optionsGrid.appendChild(btn);
      });
    }

    // Reset Timer display
    if (timerProgress) {
      timerProgress.style.width = "100%";
      timerProgress.style.backgroundColor = "#00BFA1";
    }
    if (timerText) {
      timerText.innerText = `${this.timerSeconds}s`;
      timerText.style.color = "#475569";
    }

    // Start timer interval
    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (timerProgress) {
        const pct = (this.timerSeconds / 20) * 100;
        timerProgress.style.width = `${pct}%`;
        if (this.timerSeconds <= 5) {
          timerProgress.style.backgroundColor = "#EF4444"; // alert color
        } else if (this.timerSeconds <= 10) {
          timerProgress.style.backgroundColor = "#F59E0B"; // warning color
        }
      }

      if (timerText) {
        timerText.innerText = `${this.timerSeconds}s`;
        if (this.timerSeconds <= 5) {
          timerText.style.color = "#EF4444";
        }
      }

      // Play timer tick sound
      this.audio.playTick();

      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeOut();
      }
    }, 1000);
  }

  private static handleAnswerSelection(optionNum: number) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    
    // Stop timer countdown
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.userAnswers[this.currentIndex] = optionNum;
    const q = this.questions[this.currentIndex];
    const isCorrect = optionNum === q.correctAnswer;

    if (isCorrect) {
      this.score++;
      this.audio.playCorrect();
    } else {
      this.audio.playWrong();
    }

    this.revealAnswer(optionNum, q.correctAnswer);
  }

  private static handleTimeOut() {
    if (this.isAnswered) return;
    this.isAnswered = true;

    this.userAnswers[this.currentIndex] = null; // No answer
    const q = this.questions[this.currentIndex];

    this.audio.playWrong();
    this.revealAnswer(null, q.correctAnswer);
  }

  private static revealAnswer(selectedOption: number | null, correctOption: number) {
    const q = this.questions[this.currentIndex];

    // Style option buttons based on correctness
    for (let i = 1; i <= 4; i++) {
      const btn = document.getElementById(`option-btn-${i}`) as HTMLButtonElement;
      if (!btn) continue;
      btn.style.cursor = "default";

      const prefix = btn.firstChild as HTMLElement;

      if (i === correctOption) {
        // Correct option styling
        btn.style.borderColor = "#10B981";
        btn.style.background = "#DEF7EC";
        btn.style.color = "#03543F";
        if (prefix) {
          prefix.style.background = "#10B981";
          prefix.style.color = "white";
        }
        
        // Add checkmark symbol
        const check = document.createElement("span");
        check.innerText = "✓";
        check.style.cssText = "color: #10B981; font-weight: 800; font-size: 18px; margin-left: 8px;";
        btn.appendChild(check);
      } else if (selectedOption !== null && i === selectedOption) {
        // User selected incorrect option
        btn.style.borderColor = "#EF4444";
        btn.style.background = "#FDE8E8";
        btn.style.color = "#9B1C1C";
        if (prefix) {
          prefix.style.background = "#EF4444";
          prefix.style.color = "white";
        }

        // Add cross symbol
        const cross = document.createElement("span");
        cross.innerText = "✕";
        cross.style.cssText = "color: #EF4444; font-weight: 800; font-size: 16px; margin-left: 8px;";
        btn.appendChild(cross);
      } else {
        // Other options
        btn.style.borderColor = "#E2E8F0";
        btn.style.opacity = "0.6";
      }
    }

    // Reveal explanation card
    const explanationCard = document.getElementById("quiz-explanation-card");
    const explanationText = document.getElementById("quiz-explanation-text");
    if (explanationCard && explanationText) {
      explanationText.innerText = q.explanation || "এই প্রশ্নের কোনো ব্যাখ্যা নেই।";
      explanationCard.style.display = "block";
    }

    // Show next button
    const nextBtn = document.getElementById("quiz-next-btn") as HTMLButtonElement;
    if (nextBtn) {
      nextBtn.style.display = "block";
      if (this.currentIndex === 19) {
        nextBtn.innerText = "ফলাফল দেখুন 🏁";
      } else {
        nextBtn.innerText = "পরবর্তী প্রশ্ন →";
      }
    }
  }

  static nextQuestion() {
    if (this.currentIndex < 19) {
      this.currentIndex++;
      this.loadQuestion();
    } else {
      this.showResult();
    }
  }

  private static showResult() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Hide active play container
    const playEl = document.getElementById("quiz-play-container");
    const resultEl = document.getElementById("quiz-result-container");
    if (playEl) playEl.style.display = "none";
    if (resultEl) resultEl.style.display = "block";

    const scoreDisplay = document.getElementById("quiz-result-score");
    const percentageDisplay = document.getElementById("quiz-result-percentage");
    const feedbackTitle = document.getElementById("quiz-result-feedback-title");
    const feedbackMsg = document.getElementById("quiz-result-feedback-msg");
    const actionBtn = document.getElementById("quiz-result-action-btn");
    const resultStatusIcon = document.getElementById("quiz-result-status-icon");

    const percentage = Math.round((this.score / 20) * 100);
    const passed = percentage >= 80;

    if (scoreDisplay) {
      scoreDisplay.innerText = `${this.score} / ২০`;
    }
    if (percentageDisplay) {
      percentageDisplay.innerText = `প্রাপ্ত নম্বর: ${percentage}%`;
    }

    if (passed) {
      if (resultStatusIcon) {
        resultStatusIcon.innerText = "🎉";
        resultStatusIcon.style.animation = "wave-animation 1.5s infinite";
      }
      if (feedbackTitle) {
        feedbackTitle.innerText = "অভিনন্দন! আপনি উত্তীর্ণ হয়েছেন";
        feedbackTitle.style.color = "#10B981";
      }
      if (feedbackMsg) {
        feedbackMsg.innerText = `আপনি ৮০% বা তার বেশি নম্বর পেয়েছেন। ধাপ ${this.activeFolderId! + 1} সফলভাবে আনলক হয়েছে!`;
      }
      if (actionBtn) {
        actionBtn.innerText = "পরবর্তী ধাপ খেলুন 🔓";
        actionBtn.onclick = () => {
          this.startFolder(this.activeFolderId! + 1);
        };
      }

      // Unlock progress
      this.unlockNextFolder(this.activeFolderId!);
    } else {
      if (resultStatusIcon) {
        resultStatusIcon.innerText = "😢";
        resultStatusIcon.style.animation = "none";
      }
      if (feedbackTitle) {
        feedbackTitle.innerText = "দুঃখিত! আপনি উত্তীর্ণ হতে পারেননি";
        feedbackTitle.style.color = "#EF4444";
      }
      if (feedbackMsg) {
        feedbackMsg.innerText = `উত্তীর্ণ হওয়ার জন্য কমপক্ষে ৮০% (১৬টি সঠিক উত্তর) প্রয়োজন। পুনরায় চেষ্টা করে নিজের পারফরম্যান্স উন্নত করুন!`;
      }
      if (actionBtn) {
        actionBtn.innerText = "পুনরায় চেষ্টা করুন 🔄";
        actionBtn.onclick = () => {
          this.startFolder(this.activeFolderId!);
        };
      }
    }

    // Render summary list
    const summaryList = document.getElementById("quiz-result-summary-list");
    if (summaryList) {
      summaryList.innerHTML = "";
      this.questions.forEach((q, idx) => {
        const uAns = this.userAnswers[idx];
        const isCorrect = uAns === q.correctAnswer;
        
        const card = document.createElement("div");
        card.style.cssText = `
          padding: 14px;
          border-radius: 12px;
          background: ${isCorrect ? "#F0FDF4" : "#FDF2F2"};
          border: 1px solid ${isCorrect ? "#BBF7D0" : "#FCA5A5"};
          margin-bottom: 10px;
          text-align: left;
        `;

        const title = document.createElement("p");
        title.style.cssText = "font-weight: 750; font-size: 13.5px; margin: 0 0 6px 0; color: #1E293B;";
        title.innerText = `${idx + 1}. ${q.question}`;
        card.appendChild(title);

        const ansInfo = document.createElement("p");
        ansInfo.style.cssText = "font-size: 12px; font-weight: 600; margin: 0 0 4px 0;";
        const ansOptions = [q.option1, q.option2, q.option3, q.option4];
        
        if (uAns === null) {
          ansInfo.innerHTML = `❌ <span style="color:#EF4444">উত্তর দেওয়া হয়নি।</span> সঠিক উত্তর: <strong>${ansOptions[q.correctAnswer - 1]}</strong>`;
        } else if (isCorrect) {
          ansInfo.innerHTML = `✓ <span style="color:#10B981">সঠিক উত্তর দিয়েছেন:</span> <strong>${ansOptions[q.correctAnswer - 1]}</strong>`;
        } else {
          ansInfo.innerHTML = `❌ <span style="color:#EF4444">আপনার উত্তর: ${ansOptions[uAns - 1]}</span>। সঠিক উত্তর: <strong>${ansOptions[q.correctAnswer - 1]}</strong>`;
        }
        card.appendChild(ansInfo);

        if (q.explanation) {
          const exp = document.createElement("p");
          exp.style.cssText = "font-size: 11px; color: #475569; margin: 4px 0 0 0; border-top: 1px dashed rgba(0,0,0,0.06); padding-top: 4px;";
          exp.innerHTML = `<strong>ব্যাখ্যা:</strong> ${q.explanation}`;
          card.appendChild(exp);
        }

        summaryList.appendChild(card);
      });
    }

    this.renderFolders(); // Refresh folders view to reflect newly unlocked levels
  }

  static toBengaliNumber(num: number): string {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(d => {
      const parsed = parseInt(d, 10);
      return isNaN(parsed) ? d : bengaliDigits[parsed];
    }).join("");
  }

  static renderFolders() {
    const listContainer = document.getElementById("quiz-folders-grid");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    
    const maxFolders = Math.max(10, this.highestUnlockedFolder);
    for (let fId = 1; fId <= maxFolders; fId++) {
      const isUnlocked = fId <= this.highestUnlockedFolder;
      
      const card = document.createElement("div");
      card.className = "quiz-folder-card";
      card.style.cssText = `
        background: ${isUnlocked ? "white" : "#F8FAFC"};
        border: 1.5px solid ${isUnlocked ? "#E2E8F0" : "#E2E8F0"};
        border-radius: 18px;
        padding: 20px 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: ${isUnlocked ? "0 4px 10px rgba(0,0,0,0.02)" : "none"};
        cursor: ${isUnlocked ? "pointer" : "not-allowed"};
        opacity: ${isUnlocked ? "1" : "0.6"};
        transition: all 0.2s ease;
        position: relative;
        box-sizing: border-box;
      `;

      if (isUnlocked) {
        card.onmouseover = () => {
          card.style.transform = "translateY(-2px)";
          card.style.borderColor = "#00BFA1";
          card.style.boxShadow = "0 8px 20px rgba(0, 191, 161, 0.05)";
        };
        card.onmouseout = () => {
          card.style.transform = "translateY(0)";
          card.style.borderColor = "#E2E8F0";
          card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.02)";
        };
        card.onclick = () => this.startFolder(fId);
      }

      // Top corner badge for level difficulty
      let diffLabel = "সহজ";
      let diffColor = "#10B981";
      if (fId > 3 && fId <= 7) {
        diffLabel = "মধ্যম";
        diffColor = "#F59E0B";
      } else if (fId > 7) {
        diffLabel = "জটিল";
        diffColor = "#EF4444";
      }

      const diffBadge = document.createElement("span");
      diffBadge.style.cssText = `
        font-size: 10px;
        font-weight: 800;
        padding: 2px 8px;
        border-radius: 999px;
        background-color: ${diffColor}12;
        color: ${diffColor};
        border: 1px solid ${diffColor}25;
      `;
      diffBadge.innerText = diffLabel;
      card.appendChild(diffBadge);

      // Icon: unlocked vs locked folder/lock - changed to 🎯 and 🔒
      const iconContainer = document.createElement("div");
      iconContainer.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${isUnlocked ? "#E0FDF4" : "#F1F5F9"};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
      `;
      iconContainer.innerText = isUnlocked ? "🎯" : "🔒";
      card.appendChild(iconContainer);

      // Title & Progress info
      const infoContainer = document.createElement("div");
      infoContainer.style.cssText = "display: flex; flex-direction: column; gap: 4px;";
      
      const title = document.createElement("h4");
      title.style.cssText = "font-size: 15px; font-weight: 850; color: #0F172A; margin: 0;";
      const bNum = this.toBengaliNumber(fId);
      title.innerText = fId < 10 ? `ধাপ ০${bNum}` : `ধাপ ${bNum}`;
      infoContainer.appendChild(title);

      const subtitle = document.createElement("span");
      subtitle.style.cssText = "font-size: 11.5px; color: #64748B; font-weight: 600;";
      subtitle.innerText = isUnlocked ? "২০টি প্রশ্ন • ৮০% পাস" : "লক করা আছে";
      infoContainer.appendChild(subtitle);

      card.appendChild(infoContainer);

      // Active status indicator / button
      const actionIndicator = document.createElement("div");
      actionIndicator.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 800;
        text-align: center;
        box-sizing: border-box;
      `;
      if (isUnlocked) {
        if (fId < this.highestUnlockedFolder) {
          actionIndicator.innerText = "সম্পন্ন ✓";
          actionIndicator.style.background = "#DEF7EC";
          actionIndicator.style.color = "#03543F";
        } else {
          actionIndicator.innerText = "খেলুন ⚡";
          actionIndicator.style.background = "#00BFA1";
          actionIndicator.style.color = "white";
        }
      } else {
        actionIndicator.innerText = "লকড";
        actionIndicator.style.background = "#E2E8F0";
        actionIndicator.style.color = "#64748B";
      }
      card.appendChild(actionIndicator);

      listContainer.appendChild(card);
    }
  }

  static quitQuiz() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    // Go back to list of folders
    const listEl = document.getElementById("quiz-folders-container");
    const playEl = document.getElementById("quiz-play-container");
    const resultEl = document.getElementById("quiz-result-container");
    
    if (listEl) listEl.style.display = "block";
    if (playEl) playEl.style.display = "none";
    if (resultEl) resultEl.style.display = "none";

    this.renderFolders();
  }
}

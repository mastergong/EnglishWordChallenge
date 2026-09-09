You are a senior full-stack/frontend engineer, UX designer, English language-learning product designer, and vocabulary curriculum designer.



Build a complete production-ready web application called:



"English Word Challenge"



The application is a mobile-first English vocabulary quiz game.



Use the attached image as UI inspiration.



The application must work as a static website and must be deployable to GitHub Pages.



IMPORTANT:

Do not just provide sample code or a design mockup.

Actually create the complete project structure, source code, data files, configuration, tests, and GitHub Actions deployment workflow.



========================================================

1\. PRODUCT GOAL

========================================================



Create an English vocabulary learning game that combines:



\- Vocabulary quiz

\- Multiple choice questions

\- Countdown timer

\- English pronunciation

\- IPA pronunciation

\- Thai pronunciation guide

\- Thai meaning

\- Example sentences

\- CEFR difficulty

\- Adaptive learning

\- Spaced review

\- Daily Challenge

\- Streak

\- Score

\- Statistics

\- Weak-word review

\- Practice mode

\- Dark mode

\- Mobile-first UI



The application must feel like a modern mobile game, not a traditional dictionary.



========================================================

2\. TECHNOLOGY

========================================================



Use:



\- React

\- TypeScript

\- Vite

\- Tailwind CSS

\- React Router or HashRouter

\- LocalStorage

\- Web Speech API

\- Web Audio API if useful

\- GitHub Pages

\- GitHub Actions



Do NOT use:



\- Backend

\- Database

\- Firebase

\- Supabase

\- OpenAI API at runtime

\- Gemini API at runtime

\- Claude API at runtime



The application must work completely offline after the static files have loaded.



========================================================

3\. GITHUB PAGES

========================================================



The application must support deployment to:



https://USERNAME.github.io/REPOSITORY/



Use Vite configuration that supports a configurable base path.



Example:



base: '/english-word-challenge/'



Do not hard-code the repository name if it can be configured using an environment variable.



Create:



.github/workflows/deploy.yml



The workflow should:



1\. Checkout repository

2\. Setup Node.js

3\. Install dependencies

4\. Run validation

5\. Run tests

6\. Build project

7\. Deploy dist to GitHub Pages



The project must successfully run:



npm install

npm run dev



and:



npm run build



========================================================

4\. VOCABULARY DATABASE

========================================================



Create a vocabulary dataset containing approximately 3,000 English words.



The vocabulary should be:



"Oxford 3000-aligned"



IMPORTANT COPYRIGHT REQUIREMENT:



Do NOT copy Oxford Dictionary definitions, example sentences, explanations, audio files, or proprietary database content verbatim.



Use Oxford 3000 / Oxford Learner's Dictionaries / CEFR only as a reference for:



\- vocabulary selection

\- word importance

\- CEFR level

\- learner suitability



Generate original:



\- Thai meanings

\- example sentences

\- Thai example translations

\- Thai pronunciation guides



If external vocabulary data is available under a compatible open license, clearly record the source and license.



Do not claim that the dataset is an official Oxford dataset.



Call it:



"Oxford 3000-aligned vocabulary"



========================================================

5\. VOCABULARY SIZE

========================================================



Target:



3,000 words.



Distribution approximately:



A1 = 500

A2 = 500

B1 = 700

B2 = 700

C1 = 400

C2 = 200



However, prioritize accurate CEFR classification over exact numerical distribution.



If a word is normally classified at another CEFR level, keep its appropriate level.



The main learner focus should be A1-B2.



C1-C2 should be optional Advanced content.



========================================================

6\. VOCABULARY CATEGORIES

========================================================



Distribute words across categories:



Daily Life

Family

People

Home

Food

Shopping

Travel

Transport

School

Education

Work

Business

Finance

Technology

Internet

Communication

Health

Body

Emotions

Personality

Relationships

Nature

Environment

Weather

Animals

Places

Society

Culture

Entertainment

Sports

Science

Politics

Law

Academic

Common Verbs

Common Adjectives

Common Adverbs

Common Nouns

Phrasal Verbs

Useful Expressions



Avoid excessive duplication of semantically identical words.



========================================================

7\. WORD DATA MODEL

========================================================



Create:



src/types/word.ts



Use:



export type CEFRLevel =

&#x20; | "A1"

&#x20; | "A2"

&#x20; | "B1"

&#x20; | "B2"

&#x20; | "C1"

&#x20; | "C2";



export interface Word {

&#x20; id: number;

&#x20; word: string;

&#x20; meaningTh: string;

&#x20; meaningEn: string;

&#x20; ipa: string;

&#x20; phoneticThai: string;

&#x20; level: CEFRLevel;

&#x20; partOfSpeech: string;

&#x20; category: string;

&#x20; difficulty: number;

&#x20; example: string;

&#x20; exampleThai: string;

&#x20; synonyms?: string\[];

&#x20; tags?: string\[];

}



========================================================

8\. VOCABULARY QUALITY

========================================================



Every word should have:



\- Correct spelling

\- Correct part of speech

\- Correct CEFR level

\- Correct IPA

\- Natural English meaning

\- Natural Thai meaning

\- Natural example sentence

\- Correct Thai translation

\- Useful Thai pronunciation guide



Do not generate nonsense words.



Do not create fake IPA.



Do not use random syllable-based IPA generation.



If IPA cannot be verified confidently, flag the word for manual review instead of inventing IPA.



========================================================

9\. PRONUNCIATION

========================================================



Display:



Word:



achieve



IPA:



/əˈtʃiːv/



Thai pronunciation:



อะ-ชีฟ



Provide:



🔊 Listen



Use:



window.speechSynthesis



Prefer:



en-US



or:



en-GB



The user can select:



English (US)

English (UK)



Automatically select the best available English voice.



Do not use Thai speech synthesis for English pronunciation.



Thai phonetic spelling is only a learning aid.



IPA is the authoritative pronunciation representation.



========================================================

10\. VOCABULARY VALIDATION

========================================================



Create:



scripts/validateWords.ts



and:



src/utils/validateWords.ts



Validation must detect:



\- Duplicate words

\- Case-insensitive duplicates

\- Missing meaning

\- Missing IPA

\- Missing Thai pronunciation

\- Missing CEFR

\- Missing part of speech

\- Missing example

\- Missing Thai example

\- Invalid CEFR

\- Invalid difficulty

\- Empty fields

\- Invalid IDs



Example:



"Achieve"

"achieve"

"ACHIEVE"



must be considered the same word.



Run:



npm run validate-words



The build should fail if critical vocabulary errors exist.



========================================================

11\. VOCABULARY GENERATION TOOL

========================================================



Create a development-only vocabulary generation workflow.



Example:



scripts/generateWords.ts



Do NOT call AI APIs from the production browser.



AI may be used during development to help prepare vocabulary.



The final application must contain the generated vocabulary locally.



Support batch generation:



A1

A2

B1

B2

C1

C2



Do not generate all 3,000 words in one huge prompt if that causes output truncation.



Use batches.



For example:



batch-a1-001.json

batch-a1-002.json



etc.



Then merge into:



src/data/words.json



or:



src/data/words.ts



Create:



npm run build-vocabulary



which combines validated batches.



========================================================

12\. QUESTION TYPES

========================================================



Implement at least 5 question types.



TYPE 1:



English → Thai meaning



"What does this word mean?"



Example:



achieve



A. ลืม

B. บรรลุ / ประสบความสำเร็จ

C. ปฏิเสธ

D. ซ่อน



TYPE 2:



Thai → English



"คำว่า 'บรรลุ / ประสบความสำเร็จ' ภาษาอังกฤษคืออะไร?"



A. achieve

B. avoid

C. allow

D. appear



TYPE 3:



English → Example meaning



Choose the sentence that correctly represents the word.



TYPE 4:



Pronunciation



Choose the correct IPA.



TYPE 5:



Context



Complete the sentence.



Example:



"She worked hard to \_\_\_\_\_ her goal."



A. achieve

B. avoid

C. borrow

D. cancel



========================================================

13\. SMART DISTRACTORS

========================================================



Wrong answers must be intelligently generated.



Prefer distractors from:



\- same CEFR level

\- same part of speech

\- similar category

\- similar difficulty

\- occasionally semantically related words



Avoid obviously ridiculous answers.



Example:



For:



"achieve"



Do not use:



banana

computer

elephant



Instead use:



avoid

improve

complete



The correct answer position must be randomized.



Do not always put the correct answer in B.



========================================================

14\. QUIZ SCREEN

========================================================



Design a modern mobile quiz screen.



Example:



\--------------------------------



Question 3 / 10



Progress bar



&#x20;            ⏱ 5



&#x20;         ambiguous



&#x20;      /æmˈbɪɡ.ju.əs/



&#x20;            🔊



\--------------------------------



A. ชัดเจน



B. คลุมเครือ



C. รวดเร็ว



D. อันตราย



\--------------------------------



🔥 Streak 3



Score 350



\--------------------------------



Use large typography.



The word must be the visual focus.



========================================================

15\. COUNTDOWN

========================================================



Before each question:



3

2

1

GO!



Animate the countdown.



Allow:



3 seconds

5 seconds

10 seconds

15 seconds



Default:



5 seconds



Question timer must start only after GO.



When time expires:



TIME'S UP!



Highlight the correct answer.



Automatically continue after approximately 1-1.5 seconds.



Allow the user to disable automatic next question if appropriate.



========================================================

16\. ANSWER FEEDBACK

========================================================



Correct:



✓ Correct!



Wrong:



✗ Incorrect



Timeout:



⌛ Time's Up!



Show:



Correct Answer



Word



IPA



Thai meaning



Example



Do not immediately hide all educational information.



Use the answer feedback as a learning moment.



========================================================

17\. SCORE SYSTEM

========================================================



Base score:



Correct = 100 points



Time bonus:



0-50 points



Combo bonus:



Based on streak



Wrong:



0



Timeout:



0



Example:



Correct:

+100



Speed Bonus:

+35



Combo:

+20



Total:

+155



========================================================

18\. STREAK

========================================================



Implement:



🔥 3 Streak

🔥 5 Streak

🔥 10 Streak

🔥 20 Streak



Show streak animation.



Wrong answer resets streak.



========================================================

19\. GAME MODES

========================================================



Implement:



1\. Classic

10 questions



2\. Challenge

20 questions



3\. Endless

Continue until mistake



4\. Time Attack

Total time limit



5\. Practice

No countdown



6\. Adaptive

System automatically selects difficulty



7\. Daily Challenge

A fixed challenge for each day



========================================================

20\. ADAPTIVE LEARNING

========================================================



This is a major feature.



Track per word:



seenCount

correctCount

wrongCount

lastSeen

lastCorrect

lastWrong

averageResponseTime

mastery

nextReview



Example:



{

&#x20; wordId: 123,

&#x20; seenCount: 5,

&#x20; correctCount: 2,

&#x20; wrongCount: 3,

&#x20; mastery: 35,

&#x20; nextReview: "..."

}



Weak words should appear more frequently.



Strong words should appear less frequently.



========================================================

21\. SPACED REVIEW

========================================================



Implement a lightweight spaced repetition algorithm.



Example intervals:



Wrong:

10 minutes



Correct once:

1 day



Correct twice:

3 days



Correct three times:

7 days



Correct four times:

14 days



Correct five times:

30 days



Do not need a complex Anki implementation.



The objective is to make difficult vocabulary appear more often.



========================================================

22\. WEAK WORDS

========================================================



Create:



Weak Words



Show words that the user frequently gets wrong.



Example:



Need Review



❌ substantial

Wrong 4 times



❌ ambiguous

Wrong 3 times



⚠️ maintain

Wrong 2 times



Button:



Practice Weak Words



========================================================

23\. PRACTICE MODE

========================================================



Practice screen should show:



Word



IPA



Thai pronunciation



Meaning



Part of Speech



Example sentence



Thai translation



🔊 Listen



Buttons:



I Know This

Need More Practice



========================================================

24\. DAILY CHALLENGE

========================================================



Create a daily challenge.



Each day:



10 questions



The same date must generate the same question set for the same application version.



Use a deterministic seed based on:



YYYY-MM-DD



Example:



2026-09-08



Display:



Today's Challenge



10 Questions



Best Score



Daily Streak



========================================================

25\. DAILY STREAK

========================================================



Track:



Daily Streak



Example:



🔥 7 Days



If the user completes the Daily Challenge today:



streak +1



If they miss a day:



streak resets according to the chosen rule.



Do not require login.



Use LocalStorage.



========================================================

26\. RESULT SCREEN

========================================================



Display:



🎉 Great Job!



Score:

850



Correct:

8 / 10



Accuracy:

80%



Average Time:

2.4 sec



Best Streak:

5



Level:

B1



Then:



Words to Review



List incorrect words.



Each word should be clickable.



========================================================

27\. STATISTICS

========================================================



Create Statistics page.



Show:



Total Questions

Correct

Wrong

Accuracy

Best Score

Best Streak

Words Learned

Words Mastered



Show CEFR progress:



A1

A2

B1

B2

C1

C2



Example:



A1    90%

A2    82%

B1    71%

B2    60%

C1    40%

C2    20%



Show:



Strong Words



Weak Words



Recent Activity



========================================================

28\. HOME SCREEN

========================================================



Design:



English Word

Challenge



"ฝึกศัพท์อังกฤษให้เก่งขึ้น

วันละไม่กี่นาที"



Main button:



▶ START GAME



Level selector:



A1

A2

B1

B2

C1

C2



Also:



⚡ Adaptive



📅 Daily Challenge



📖 Practice



📊 Statistics



⚙️ Settings



========================================================

29\. LEVEL SYSTEM

========================================================



Levels:



A1

Beginner



A2

Elementary



B1

Intermediate



B2

Upper Intermediate



C1

Advanced



C2

Proficiency



Display short descriptions in Thai.



Example:



A1

"เริ่มต้น"



A2

"พื้นฐาน"



B1

"สื่อสารได้"



B2

"คล่องขึ้น"



C1

"ระดับสูง"



C2

"ขั้นเชี่ยวชาญ"



========================================================

30\. LEVEL UNLOCK

========================================================



Optionally implement level progression.



For example:



A1 unlocked initially.



To unlock A2:



Accuracy >= 70%



To unlock B1:



Accuracy >= 75%



To unlock B2:



Accuracy >= 80%



Advanced levels can be unlocked separately.



However, allow users to disable level lock from Settings.



========================================================

31\. SETTINGS

========================================================



Create Settings page.



Options:



Countdown:



3 sec

5 sec

10 sec

15 sec



Question count:



10

20

30



Sound:



ON/OFF



Speech:



ON/OFF



Voice:



English US

English UK



Auto pronunciation:



ON/OFF



Dark mode:



ON/OFF



Adaptive learning:



ON/OFF



========================================================

32\. DARK MODE

========================================================



Support:



Light

Dark

System



Persist setting in LocalStorage.



========================================================

33\. SOUND EFFECTS

========================================================



Create lightweight sound effects.



Countdown

GO

Correct

Wrong

Time Up

Level Up

Game Complete



Do not require external copyrighted audio.



Use Web Audio API where practical.



Allow Sound ON/OFF.



========================================================

34\. ACCESSIBILITY

========================================================



Implement:



ARIA labels

Keyboard navigation

Visible focus state

Accessible contrast

Screen reader friendly buttons

Large touch targets



Minimum touch target:



44px



========================================================

35\. RESPONSIVE DESIGN

========================================================



Mobile-first.



Must support:



320px

375px

390px

414px

768px

1024px

Desktop



No horizontal scrolling.



Quiz buttons must be easy to tap.



========================================================

36\. PERFORMANCE

========================================================



The application contains approximately 3,000 vocabulary records.



Optimize loading.



If necessary:



\- Split vocabulary by CEFR level

\- Lazy load vocabulary

\- Lazy load pages

\- Avoid unnecessary re-renders



The initial page should load quickly.



Do not load unnecessary libraries.



========================================================

37\. LOCAL STORAGE

========================================================



Store:



settings

statistics

gameHistory

wordProgress

wrongWords

learnedWords

dailyChallenge

dailyStreak

bestScore

bestStreak



Create:



src/utils/storage.ts



Use typed helper functions.



Handle corrupted LocalStorage gracefully.



If LocalStorage is invalid:



reset only corrupted data.



Do not crash the application.



========================================================

38\. PROJECT STRUCTURE

========================================================



Use:



src/

├── components/

│   ├── AnswerButton.tsx

│   ├── Countdown.tsx

│   ├── Timer.tsx

│   ├── ProgressBar.tsx

│   ├── QuizCard.tsx

│   ├── ScoreBoard.tsx

│   ├── StreakBadge.tsx

│   ├── PronunciationButton.tsx

│   ├── WordCard.tsx

│   ├── LevelSelector.tsx

│   └── ThemeToggle.tsx

│

├── pages/

│   ├── Home.tsx

│   ├── Game.tsx

│   ├── Result.tsx

│   ├── Practice.tsx

│   ├── Statistics.tsx

│   ├── DailyChallenge.tsx

│   └── Settings.tsx

│

├── data/

│   ├── words.json

│   └── categories.ts

│

├── hooks/

│   ├── useQuiz.ts

│   ├── useTimer.ts

│   ├── useSpeech.ts

│   ├── useStatistics.ts

│   ├── useAdaptiveLearning.ts

│   └── useDailyChallenge.ts

│

├── utils/

│   ├── questionGenerator.ts

│   ├── scoring.ts

│   ├── storage.ts

│   ├── random.ts

│   ├── adaptiveLearning.ts

│   ├── spacedRepetition.ts

│   └── validateWords.ts

│

├── types/

│   ├── word.ts

│   ├── game.ts

│   └── statistics.ts

│

├── App.tsx

├── main.tsx

└── index.css



scripts/

├── generateWords.ts

├── validateWords.ts

└── mergeVocabulary.ts



.github/

└── workflows/

&#x20;   └── deploy.yml



========================================================

39\. VOCABULARY DATA FILE

========================================================



Prefer JSON for the large vocabulary dataset:



src/data/words.json



Example:



\[

&#x20; {

&#x20;   "id": 1,

&#x20;   "word": "achieve",

&#x20;   "meaningTh": "บรรลุ / ประสบความสำเร็จ",

&#x20;   "meaningEn": "to successfully reach a goal",

&#x20;   "ipa": "/əˈtʃiːv/",

&#x20;   "phoneticThai": "อะ-ชีฟ",

&#x20;   "level": "B1",

&#x20;   "partOfSpeech": "verb",

&#x20;   "category": "Work",

&#x20;   "difficulty": 2,

&#x20;   "example": "She worked hard to achieve her goal.",

&#x20;   "exampleThai": "เธอทำงานหนักเพื่อบรรลุเป้าหมาย"

&#x20; }

]



========================================================

40\. IMPORTANT: WORD FORMS

========================================================



Handle word families intelligently.



For example:



achieve

achievement

achievable



These may appear separately only if they are useful learning targets.



Do not artificially generate every possible word form.



Prioritize common learner vocabulary.



========================================================

41\. PHRASAL VERBS

========================================================



Include useful phrasal verbs where appropriate.



Examples:



give up

look after

find out

take off

put off

carry on



Treat phrasal verbs as vocabulary entries.



Make sure IPA, meaning and examples are correct.



========================================================

42\. MULTIPLE MEANINGS

========================================================



Some English words have multiple meanings.



Example:



"issue"



Possible meanings:



ปัญหา

ประเด็น

ฉบับ

ออก/เผยแพร่



The dataset may contain:



primaryMeaning

secondaryMeanings



For quiz questions, use the meaning appropriate to the selected example.



========================================================

43\. CONTEXT-AWARE QUESTIONS

========================================================



When a word has multiple meanings, prefer context questions.



Example:



"The company issued a new report."



Question:



What does "issued" mean in this sentence?



This prevents ambiguity.



========================================================

44\. QUESTION DIFFICULTY

========================================================



difficulty:



1 = Very Easy

2 = Easy

3 = Medium

4 = Hard

5 = Very Hard



Difficulty should roughly correspond to:



A1 → 1

A2 → 1-2

B1 → 2-3

B2 → 3-4

C1 → 4

C2 → 5



But actual vocabulary difficulty takes priority.



========================================================

45\. GAME ALGORITHM

========================================================



Question selection should consider:



Selected CEFR

Word mastery

Recent questions

Wrong count

Review due date

Difficulty

Category diversity



Do not ask the same word repeatedly.



Within a 10-question game:



\- No duplicate target words

\- Avoid repeating the same category too many times

\- Balance question types



========================================================

46\. ADAPTIVE ALGORITHM

========================================================



Calculate approximate mastery:



mastery =



correct rate

\+

recent performance

\+

response speed

\+

number of successful reviews



Example:



mastery 0-30:

Very Weak



31-50:

Weak



51-70:

Learning



71-85:

Good



86-100:

Mastered



Weak words receive higher selection probability.



========================================================

47\. DAILY CHALLENGE ALGORITHM

========================================================



Use deterministic randomization.



The same date should produce the same questions.



Do NOT simply use Math.random().



Create:



seededRandom(seed)



Then:



generateDailyQuestions(date)



========================================================

48\. SECURITY

========================================================



There are no secrets in the frontend.



Do not include:



API keys

private tokens

credentials



Do not call AI APIs from the browser.



========================================================

49\. TESTING

========================================================



Use a lightweight testing setup.



Test:



question generation

answer randomization

timer

score

streak

adaptive learning

spaced repetition

daily challenge

LocalStorage

vocabulary validation



Important tests:



\- Correct answer is always one of the choices

\- Exactly one correct answer

\- No duplicate choices

\- No duplicate questions in one game

\- Correct answer position is randomized

\- Timer stops after answer

\- Timer stops after timeout

\- Score calculation is correct

\- Daily challenge is deterministic



========================================================

50\. ERROR HANDLING

========================================================



The application must not crash because of:



\- speech synthesis unavailable

\- LocalStorage unavailable

\- malformed vocabulary data

\- missing English voice

\- invalid settings



Use graceful fallbacks.



========================================================

51\. UI LANGUAGE

========================================================



Interface:



Thai + English



Examples:



Start Game

เริ่มเกม



Practice

ฝึกคำศัพท์



Statistics

สถิติ



Daily Challenge

โจทย์ประจำวัน



Correct

ถูกต้อง



Incorrect

ไม่ถูกต้อง



Time's Up

หมดเวลา



Need Review

ควรทบทวน



========================================================

52\. LEARNING EXPERIENCE

========================================================



The goal is not only to test users.



The application should teach.



After every wrong answer show:



Word

IPA

Thai pronunciation

Meaning

Example



And:



🔊 Listen



The user should be able to hear the word repeatedly.



========================================================

53\. HOME DASHBOARD

========================================================



Show:



🔥 Daily Streak



⭐ Best Score



📚 Words Learned



🎯 Accuracy



Then:



Today's Challenge



and:



Continue Learning



The "Continue Learning" button should prioritize weak/review words.



========================================================

54\. EMPTY STATE

========================================================



Handle cases where:



No statistics

No weak words

No daily challenge completed

No learned words



Show friendly messages.



Example:



"เริ่มเล่นเกมเพื่อสร้างสถิติของคุณ"



========================================================

55\. DATA SIZE

========================================================



Approximately 3,000 words.



Do not put all vocabulary inside React components.



Use data files.



If 3,000 records become too large for initial loading, split by level:



words-a1.json

words-a2.json

words-b1.json

words-b2.json

words-c1.json

words-c2.json



Lazy load them.



========================================================

56\. VOCABULARY SOURCE METADATA

========================================================



Create:



src/data/sources.ts



Explain:



"This vocabulary is Oxford 3000-aligned and intended for English learning. It is not an official Oxford dataset."



Do not claim Oxford endorsement.



Record source information and licensing where applicable.



========================================================

57\. NO COPYRIGHT INFRINGEMENT

========================================================



Do not copy:



Oxford definitions

Oxford example sentences

Oxford audio

Oxford dictionary articles



Create original educational content.



If exact Oxford 3000 membership needs to be reproduced, only do so if the user supplies a legally usable dataset or source.



Otherwise create an Oxford-3000-aligned vocabulary set based on common learner vocabulary and CEFR levels.



========================================================

58\. DESIGN

========================================================



Use modern mobile game design.



Visual characteristics:



\- Large cards

\- Rounded corners

\- Soft shadows

\- Smooth animations

\- Progress indicators

\- Large vocabulary text

\- Clear answer buttons

\- Friendly typography

\- Minimal clutter

\- Dark mode



The UI should feel:



Modern

Friendly

Educational

Game-like

Fast



Do not over-design.



========================================================

59\. ANIMATIONS

========================================================



Implement subtle animations:



Question entrance

Countdown scale

Correct answer

Wrong answer

Score increase

Streak

Level completion

Page transitions



Respect:



prefers-reduced-motion



========================================================

60\. FINAL VALIDATION

========================================================



Before considering the project complete, run:



npm install



npm run validate-words



npm test



npm run build



All must succeed.



Fix all:



TypeScript errors

Lint errors

Build errors

Runtime errors



========================================================

61\. FINAL DELIVERABLE

========================================================



Provide:



1\. Complete source code

2\. package.json

3\. Vite configuration

4\. Tailwind configuration if required

5\. TypeScript configuration

6\. 3,000-word vocabulary dataset

7\. Vocabulary validation scripts

8\. Question generator

9\. Adaptive learning

10\. Spaced repetition

11\. Daily Challenge

12\. Statistics

13\. LocalStorage

14\. SpeechSynthesis

15\. Sound effects

16\. Responsive UI

17\. Dark mode

18\. GitHub Actions

19\. README.md



README must explain:



\- Installation

\- Development

\- Build

\- Testing

\- Vocabulary validation

\- Vocabulary generation

\- Adding new words

\- Changing levels

\- GitHub Pages deployment

\- Changing repository name

\- Resetting LocalStorage



========================================================

62\. IMPLEMENTATION ORDER

========================================================



Do NOT try to output everything as one enormous response.



Implement in this order:



PHASE 1

Project setup



PHASE 2

TypeScript models



PHASE 3

Vocabulary system



PHASE 4

Vocabulary validation



PHASE 5

Question generator



PHASE 6

Quiz UI



PHASE 7

Countdown / Timer



PHASE 8

Scoring / Streak



PHASE 9

Speech / Pronunciation



PHASE 10

LocalStorage



PHASE 11

Adaptive Learning



PHASE 12

Spaced Repetition



PHASE 13

Practice



PHASE 14

Statistics



PHASE 15

Daily Challenge



PHASE 16

Settings / Dark Mode



PHASE 17

Responsive optimization



PHASE 18

Tests



PHASE 19

GitHub Pages deployment



PHASE 20

Final validation



========================================================

63\. VOCABULARY GENERATION STRATEGY

========================================================



For the 3,000 vocabulary dataset:



First create the candidate word list.



Then classify:



A1

A2

B1

B2

C1

C2



Then create:



Thai meaning

English learner-friendly meaning

IPA

Thai pronunciation

Part of speech

Category

Difficulty

Original example sentence

Thai translation



Then run validation.



Do not silently invent uncertain data.



Create a review report:



vocabulary-review.json



with:



\- uncertain IPA

\- uncertain CEFR

\- possible duplicate

\- possible spelling issue

\- missing information



========================================================

64\. QUALITY OVER QUANTITY

========================================================



3,000 accurate words are more important than exactly 3,000 records.



If a word cannot be verified confidently:



flag it for review.



Do not fabricate data just to reach 3,000.



========================================================

65\. FINAL UX

========================================================



The application should feel like:



"Duolingo-style vocabulary game"



but do NOT copy Duolingo's UI.



Use the attached reference image as inspiration for:



\- question card

\- countdown

\- multiple choices

\- visual simplicity



Create an original design.



========================================================

66\. SUCCESS CRITERIA

========================================================



The project is considered complete only when:



✓ Can run locally

✓ Can play quiz

✓ Countdown works

✓ Timer works

✓ Correct/wrong feedback works

✓ Score works

✓ Streak works

✓ Pronunciation works

✓ IPA displayed

✓ Thai pronunciation displayed

✓ CEFR levels work

✓ 3,000-word dataset exists or is split into validated datasets

✓ Vocabulary validation works

✓ Adaptive learning works

✓ Weak words work

✓ Practice works

✓ Statistics work

✓ Daily Challenge works

✓ LocalStorage works

✓ Dark mode works

✓ Mobile responsive

✓ GitHub Pages build works

✓ GitHub Actions works

✓ No API key required

✓ No backend required

✓ No runtime AI API required



Start implementing the project now.


import { useState, type ReactNode } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import type { AppSettings } from "../types/game";
import { loadSettings, resetAllProgress, resetLocalStorage, saveSettings } from "../utils/storage";
import { applyTheme } from "../utils/theme";

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      if (patch.theme) applyTheme(patch.theme);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Settings · ตั้งค่า</h1>

      <Group title="Challenge countdown">
        <Pills
          values={[3, 5, 10, 15]}
          value={settings.countdownSec}
          onChange={(countdownSec) => update({ countdownSec })}
          suffix=" sec"
        />
      </Group>

      <Group title="Question timer">
        <Pills
          values={[3, 5, 10, 15]}
          value={settings.questionTimeSec}
          onChange={(questionTimeSec) => update({ questionTimeSec })}
          suffix=" sec"
        />
      </Group>

      <Group title="Question count">
        <Pills
          values={[10, 20, 30, 40, 50]}
          value={settings.questionCount}
          onChange={(questionCount) => update({ questionCount })}
        />
      </Group>

      <Toggle label="Sound" on={settings.sound} onClick={() => update({ sound: !settings.sound })} />
      <Toggle label="Speech" on={settings.speech} onClick={() => update({ speech: !settings.speech })} />
      <Group title="Voice">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`min-h-11 rounded-2xl ${settings.voice === "en-US" ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"}`}
            onClick={() => update({ voice: "en-US" })}
          >
            English US
          </button>
          <button
            type="button"
            className={`min-h-11 rounded-2xl ${settings.voice === "en-GB" ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"}`}
            onClick={() => update({ voice: "en-GB" })}
          >
            English UK
          </button>
        </div>
      </Group>
      <Group title="ออกเสียงใน Classic">
        <p className="text-sm text-slate-500">
          อังกฤษหรือไทยอ่านตอนขึ้นคำถาม · ทั้งสองอ่านปุ่มที่กด ถ้าตอบผิดจะไม่อ่าน
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["en", "อังกฤษ"],
              ["th", "ไทย"],
              ["both", "ทั้งสอง"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`min-h-11 rounded-2xl text-sm font-semibold ${
                settings.quizSpeakLang === value ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"
              }`}
              onClick={() => update({ quizSpeakLang: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </Group>
      <Toggle
        label="Auto pronunciation"
        on={settings.autoPronounce}
        onClick={() => update({ autoPronounce: !settings.autoPronounce })}
      />
      <Toggle
        label="สะกดทีละตัวตอนฝึก (ไฟล์เสียงตัวอักษร)"
        on={settings.spellLetters}
        onClick={() => update({ spellLetters: !settings.spellLetters })}
      />
      <Group title="Dark mode">
        <ThemeToggle value={settings.theme} onChange={(theme) => update({ theme })} />
      </Group>
      <Toggle
        label="Adaptive learning"
        on={settings.adaptiveLearning}
        onClick={() => update({ adaptiveLearning: !settings.adaptiveLearning })}
      />
      <Toggle
        label="Level lock"
        on={settings.levelLock}
        onClick={() => update({ levelLock: !settings.levelLock })}
      />
      <Toggle
        label="Auto next question"
        on={settings.autoNext}
        onClick={() => update({ autoNext: !settings.autoNext })}
      />

      <Group title="วิธีส่งคำตอบ">
        <p className="text-sm text-slate-500">เลือกว่าจะยืนยันก่อนส่ง หรือแตะตัวเลือกแล้วส่งทันที</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            className={`min-h-12 rounded-2xl px-3 text-sm font-semibold ${
              settings.confirmSubmit ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"
            }`}
            onClick={() => update({ confirmSubmit: true })}
          >
            กด Submit ค่อยส่ง
          </button>
          <button
            type="button"
            className={`min-h-12 rounded-2xl px-3 text-sm font-semibold ${
              !settings.confirmSubmit ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"
            }`}
            onClick={() => update({ confirmSubmit: false })}
          >
            กดคำตอบแล้วส่งเลย
          </button>
        </div>
      </Group>

      <button
        type="button"
        className="min-h-12 w-full rounded-2xl bg-white/80 font-semibold dark:bg-white/10"
        onClick={() => {
          resetAllProgress();
          window.location.reload();
        }}
      >
        Reset progress
      </button>
      <button
        type="button"
        className="min-h-12 w-full rounded-2xl bg-rose-500 font-semibold text-white"
        onClick={() => {
          resetLocalStorage();
          window.location.reload();
        }}
      >
        Reset LocalStorage
      </button>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Pills<T extends number>({
  values,
  value,
  onChange,
  suffix = "",
}: {
  values: T[];
  value: T;
  onChange: (value: T) => void;
  suffix?: string;
}) {
  return (
    <div className={`grid gap-2 ${values.length >= 5 ? "grid-cols-5" : "grid-cols-4"}`}>
      {values.map((item) => (
        <button
          key={item}
          type="button"
          className={`min-h-11 rounded-2xl font-semibold ${
            item === value ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"
          }`}
          onClick={() => onChange(item)}
        >
          {item}
          {suffix}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-white/80 px-4 font-semibold dark:bg-white/10"
      aria-pressed={on}
    >
      {label}
      <span>{on ? "ON" : "OFF"}</span>
    </button>
  );
}

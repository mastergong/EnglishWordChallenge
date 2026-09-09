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
      <h1 className="font-game-display text-3xl font-black text-rose-600">ตั้งค่านุ่ม ๆ</h1>
      <p className="-mt-3 text-sm text-rose-400">ปรับให้เล่นสบายตามจังหวะของตัวเอง</p>

      <Group title="เวลานับถอยหลังก่อนเริ่ม">
        <Pills
          values={[3, 5, 10, 15]}
          value={settings.countdownSec}
          onChange={(countdownSec) => update({ countdownSec })}
          suffix=" sec"
        />
      </Group>

      <Group title="เวลาต่อข้อ">
        <Pills
          values={[3, 5, 10, 15]}
          value={settings.questionTimeSec}
          onChange={(questionTimeSec) => update({ questionTimeSec })}
          suffix=" sec"
        />
      </Group>

      <Group title="จำนวนข้อ">
        <Pills
          values={[10, 20, 30, 40, 50]}
          value={settings.questionCount}
          onChange={(questionCount) => update({ questionCount })}
        />
      </Group>

      <Toggle label="เสียงเอฟเฟกต์" on={settings.sound} onClick={() => update({ sound: !settings.sound })} />
      <Toggle label="อ่านออกเสียง" on={settings.speech} onClick={() => update({ speech: !settings.speech })} />
      <Group title="สำเนียง">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`min-h-11 rounded-2xl ${settings.voice === "en-US" ? "ui-chip-on" : "ui-chip"}`}
            onClick={() => update({ voice: "en-US" })}
          >
            English US
          </button>
          <button
            type="button"
            className={`min-h-11 rounded-2xl ${settings.voice === "en-GB" ? "ui-chip-on" : "ui-chip"}`}
            onClick={() => update({ voice: "en-GB" })}
          >
            English UK
          </button>
        </div>
      </Group>
      <Toggle
        label="อ่านคำให้อัตโนมัติ"
        on={settings.autoPronounce}
        onClick={() => update({ autoPronounce: !settings.autoPronounce })}
      />
      <Group title="โหมดมืด">
        <ThemeToggle value={settings.theme} onChange={(theme) => update({ theme })} />
      </Group>
      <Toggle
        label="ปรับความยากตามเรา"
        on={settings.adaptiveLearning}
        onClick={() => update({ adaptiveLearning: !settings.adaptiveLearning })}
      />
      <Toggle
        label="ล็อกเลเวลจนกว่าจะแม่น"
        on={settings.levelLock}
        onClick={() => update({ levelLock: !settings.levelLock })}
      />
      <Toggle
        label="ไปข้อถัดไปให้อัตโนมัติ"
        on={settings.autoNext}
        onClick={() => update({ autoNext: !settings.autoNext })}
      />

      <Group title="วิธีส่งคำตอบ">
        <p className="text-sm text-slate-500">เลือกว่าจะยืนยันก่อนส่ง หรือแตะตัวเลือกแล้วส่งทันที</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            className={`min-h-12 rounded-2xl px-3 text-sm font-semibold ${
              settings.confirmSubmit ? "ui-chip-on" : "ui-chip"
            }`}
            onClick={() => update({ confirmSubmit: true })}
          >
            กด Submit ค่อยส่ง
          </button>
          <button
            type="button"
            className={`min-h-12 rounded-2xl px-3 text-sm font-semibold ${
              !settings.confirmSubmit ? "ui-chip-on" : "ui-chip"
            }`}
            onClick={() => update({ confirmSubmit: false })}
          >
            กดคำตอบแล้วส่งเลย
          </button>
        </div>
      </Group>

      <button
        type="button"
        className="ui-card min-h-12 w-full font-semibold"
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
            item === value ? "ui-chip-on" : "ui-chip"
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
      className="ui-card flex min-h-12 w-full items-center justify-between px-4 font-semibold"
      aria-pressed={on}
    >
      {label}
      <span>{on ? "ON" : "OFF"}</span>
    </button>
  );
}

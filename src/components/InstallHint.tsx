import { useEffect, useState } from "react";

export function InstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const nav = window.navigator as Navigator & { standalone?: boolean };
    setStandalone(media.matches || Boolean(nav.standalone));

    function onPrompt(event: Event) {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone) return null;

  async function install() {
    if (!deferred) {
      setIosHint(true);
      return;
    }
    await deferred.prompt();
    setDeferred(null);
  }

  return (
    <section className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950 dark:border-blue-500/40 dark:bg-blue-950/40 dark:text-blue-100">
      <p className="font-bold">ใช้บนมือถือแบบแอป</p>
      <p className="mt-1 text-blue-800 dark:text-blue-200">
        เพิ่มไปที่หน้าจอหลัก จะเปิดเต็มจอ ไม่มีแถบเบราว์เซอร์
      </p>
      <button
        type="button"
        onClick={() => void install()}
        className="mt-3 flex min-h-11 w-full items-center justify-center rounded-2xl bg-blue-600 font-bold text-white"
      >
        {deferred ? "ติดตั้งแอป" : "วิธีเพิ่มไปหน้าจอหลัก"}
      </button>
      {iosHint || !deferred ? (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-blue-800 dark:text-blue-200">
          <li>iPhone: Safari → แชร์ → เพิ่มไปยังหน้าจอโฮม</li>
          <li>Android: เมนู Chrome → ติดตั้งแอป / เพิ่มไปยังหน้าจอหลัก</li>
        </ol>
      ) : null}
    </section>
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

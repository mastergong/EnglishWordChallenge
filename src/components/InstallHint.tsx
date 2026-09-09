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
    <section className="ui-card border border-rose-200 p-4 text-sm text-rose-900 dark:text-rose-50">
      <p className="font-bold">ใช้บนมือถือแบบแอป</p>
      <p className="mt-1 text-rose-700 dark:text-rose-100/80">
        เพิ่มไปที่หน้าจอหลัก จะเปิดเต็มจอ ไม่มีแถบเบราว์เซอร์
      </p>
      <button
        type="button"
        onClick={() => void install()}
        className="ui-go mt-3 flex min-h-11 w-full items-center justify-center"
      >
        {deferred ? "ติดตั้งแอป" : "วิธีเพิ่มไปหน้าจอหลัก"}
      </button>
      {iosHint || !deferred ? (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-rose-700 dark:text-rose-100/80">
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

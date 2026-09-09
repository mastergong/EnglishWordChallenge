import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Game } from "./pages/Game";
import { Result } from "./pages/Result";
import { Practice } from "./pages/Practice";
import { StatisticsPage } from "./pages/Statistics";
import { DailyChallenge } from "./pages/DailyChallenge";
import { Settings } from "./pages/Settings";
import { WordMap } from "./pages/WordMap";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/result" element={<Result />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/map" element={<WordMap />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/daily" element={<DailyChallenge />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

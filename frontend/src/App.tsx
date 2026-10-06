import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/AppShell";
import Feed from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Artist from "@/pages/Artist";
import Forum from "@/pages/Forum";
import ForumTopic from "@/pages/ForumTopic";
import Ranking from "@/pages/Ranking";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Feed />} />
          <Route path="/artista" element={<Artist />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumTopic />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/perfil" element={<Navigate to="/" replace />} />
          <Route path="/perfil/:username" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>
      <Toaster richColors />
    </>
  );
}
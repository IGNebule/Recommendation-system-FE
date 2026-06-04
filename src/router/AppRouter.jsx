import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import protectedAuth from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import DiscoverPage from "../pages/DiscoverPage";
import AboutPage from "../pages/AboutPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";

import GameDetailPage from "../pages/GameDetailPage";
import SearchPage from "../pages/SearchPage";
import GenrePage from "../pages/GenrePage";
import TagPage from "../pages/TagPage";
import PreferencesPage from "../pages/PreferencesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import SupportPage from "../pages/SupportPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/games/:appid" element={<GameDetailPage />} />

        <Route path="/search" element={<SearchPage />} />

        <Route path="/genres/:genre" element={<GenrePage />} />

        <Route path="/tags/:tag" element={<TagPage />} />

        <Route element={protectedAuth}>
          <Route path="/preferences" element={<PreferencesPage />} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRouter;

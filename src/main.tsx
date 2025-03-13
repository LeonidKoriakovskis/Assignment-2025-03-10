import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BasketballContextProvider } from "./pages/BasketballContextProvider";
import Loading from "./components/loading";



const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const PlayersPage = lazy(() => import('./pages/PlayersPage/PlayersPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage/TeamsPage'));
const LeaguesPage = lazy(() => import('./pages/LeaguesPage/LeaguesPage'));
const CountriesPage = lazy(() => import('./pages/CountriesPage/CountriesPage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage/PlayerPage'));
const TeamPage = lazy(() => import('./pages/TeamPage/TeamPage'));
const LeaguePage = lazy(() => import('./pages/LeaguePage/LeaguePage'));
const CountryPage = lazy(() => import('./pages/CountryPage/CountryPage'));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BasketballContextProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="project">
              <Route path="main" element={<MainPage />} />

              {/* Players */}
              <Route path="players" element={<PlayersPage />} />
              <Route path="players/:id" element={<PlayerPage />} />

              {/* Teams */}
              <Route path="teams" element={<TeamsPage />} />
              <Route path="teams/:id" element={<TeamPage />} />

              {/* Leagues */}
              <Route path="leagues" element={<LeaguesPage />} />
              <Route path="leagues/:id" element={<LeaguePage />} />

              {/* Countries */}
              <Route path="countries" element={<CountriesPage />} />
              <Route path="countries/:id" element={<CountryPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </BasketballContextProvider>
  </StrictMode>
);

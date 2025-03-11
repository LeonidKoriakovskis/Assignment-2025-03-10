import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainPage from './pages/MainPage/MainPage'
import PlayerPage from './pages/PlayerPage/PlayerPage'
import PlayersPage from './pages/PlayersPage/PlayersPage'
import TeamsPage from './pages/TeamsPage/TeamsPage'
import TeamPage from './pages/TeamPage/TeamPage'
import LeaguesPage from './pages/LeaguesPage/LeaguesPage'
import LeaguePage from './pages/LeaguePage/LeaguePage'
import CountriesPage from './pages/CountriesPage/CountriesPage'
import CountryPage from './pages/CountryPage/CountryPage'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='project'>
          <Route path='/main' element={<MainPage />}/>
          <Route path='players?_expand=team&_expand=country' element={<PlayersPage />}/>
          <Route path='players/:id?_expand=team&_expand=country' element={<PlayerPage />}/>

          <Route path='teams?_embed=players&_expand=country' element={<TeamsPage />}/>
          <Route path='teams/:id?_embed=players&_expand=country' element={<TeamPage />}/>

          <Route path='leagues?_embed=teams&_expand=country' element={<LeaguesPage />}/>
          <Route path='leagues/:id?_embed=teams&_expand=country' element={<LeaguePage />}/>

          <Route path='countries?_embed=leagues&_embed=teams&_embed=players' element={<CountriesPage />}/>
          <Route path='countries/:id?_embed=leagues&_embed=teams&_embed=players' element={<CountryPage />}/>
        
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import PlannerPage from './pages/PlannerPage';
import RecipesPage from './pages/RecipesPage.tsx';
import HealthCheck from './HealthCheck';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/planner" replace />} />
        <Route path="planner" element={<PlannerPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        
        {/* Health check for debugging connectivity */}
        <Route path="health" element={<HealthCheck />} />
      </Route>
    </Routes>
  );
}

export default App;

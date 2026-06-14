import { useMemo, useState } from "react";
import Home from "./components/Home.jsx";
import RegionImageSelect from "./components/RegionImageSelect.jsx";
import LandProfile from "./components/LandProfile.jsx";
import FarmSimulator from "./components/FarmSimulator.jsx";
import FinalReport from "./components/FinalReport.jsx";
import { regions } from "./data/regions.js";
import { createInitialFarmState } from "./utils/simulation.js";

const pages = {
  home: "home",
  select: "select",
  profile: "profile",
  simulator: "simulator",
  report: "report"
};

export default function App() {
  const [page, setPage] = useState(pages.home);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [farmState, setFarmState] = useState(null);

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === selectedRegionId),
    [selectedRegionId]
  );

  function handleSelectRegion(regionId) {
    setSelectedRegionId(regionId);
    setFarmState(createInitialFarmState(regions.find((region) => region.id === regionId)));
    setPage(pages.profile);
  }

  function restart() {
    setSelectedRegionId(null);
    setFarmState(null);
    setPage(pages.home);
  }

  return (
    <main className="app-shell">
      {page === pages.home && <Home onStart={() => setPage(pages.select)} />}
      {page === pages.select && (
        <RegionImageSelect
          regions={regions}
          onSelect={handleSelectRegion}
          onBack={() => setPage(pages.home)}
        />
      )}
      {page === pages.profile && selectedRegion && farmState && (
        <LandProfile
          region={selectedRegion}
          farmState={farmState}
          onBack={() => setPage(pages.select)}
          onStart={() => setPage(pages.simulator)}
        />
      )}
      {page === pages.simulator && selectedRegion && farmState && (
        <FarmSimulator
          region={selectedRegion}
          farmState={farmState}
          setFarmState={setFarmState}
          onBack={() => setPage(pages.profile)}
          onFinish={() => setPage(pages.report)}
        />
      )}
      {page === pages.report && selectedRegion && farmState && (
        <FinalReport
          region={selectedRegion}
          farmState={farmState}
          onRestart={restart}
          onChooseRegion={() => setPage(pages.select)}
        />
      )}
    </main>
  );
}

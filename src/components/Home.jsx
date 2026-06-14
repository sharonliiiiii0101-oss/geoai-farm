import { teachingGoals } from "../data/farmlandData.js";
import HeroSection from "./HeroSection.jsx";

export default function Home({ onStart }) {
  return (
    <section className="home-page">
      <HeroSection onStart={onStart} />

      <aside className="goal-panel" id="teaching-goals">
        <h2>教学目标</h2>
        <ul>
          {teachingGoals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

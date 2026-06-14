import heroImage from "../assets/hero/farmland-cover.png";

export default function HeroSection({ onStart }) {
  function scrollToGoals() {
    document.getElementById("teaching-goals")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="hero-section">
      <img className="hero-photo" src={heroImage} alt="蓝天白云下的金黄色农田" />
      <div className="hero-photo-shade" />
      <div className="geo-grid" aria-hidden="true" />
      <div className="geo-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero-content">
        <p className="hero-kicker"><span />中学地理课堂互动模拟器</p>
        <h1>
          <span>一田一策：</span>
          <span>耕地质量模拟</span>
          <span>经营平台</span>
        </h1>
        <p className="hero-subtitle">从一块耕地的经营，理解土壤肥力与粮食安全</p>

        <div className="hero-actions">
          <button className="primary-button hero-primary" onClick={onStart}>开始经营耕地</button>
          <button className="hero-secondary" onClick={scrollToGoals}>查看教学目标</button>
        </div>

        <div className="hero-highlights" aria-label="项目亮点">
          <article>
            <strong>7个典型区域</strong>
            <span>比较真实耕地景观</span>
          </article>
          <article>
            <strong>动态经营模拟</strong>
            <span>观察土地指标变化</span>
          </article>
          <article>
            <strong>粮食安全体验</strong>
            <span>理解保护耕地质量</span>
          </article>
        </div>
      </div>

      <div className="hero-field-lines" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}

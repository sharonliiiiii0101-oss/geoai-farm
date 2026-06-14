function CornSprite() {
  return (
    <>
      <span className="plant-stem" />
      <span className="corn-tassel" />
      <span className="leaf leaf-a" />
      <span className="leaf leaf-b" />
      <span className="leaf leaf-c" />
      <span className="leaf leaf-d" />
    </>
  );
}

function SoybeanSprite() {
  return (
    <>
      <span className="bean-stem" />
      <span className="round-leaf leaf-a" />
      <span className="round-leaf leaf-b" />
      <span className="round-leaf leaf-c" />
      <span className="round-leaf leaf-d" />
      <span className="round-leaf leaf-e" />
    </>
  );
}

function RiceSprite() {
  return (
    <>
      <span className="rice-blade blade-a" />
      <span className="rice-blade blade-b" />
      <span className="rice-blade blade-c" />
      <span className="rice-blade blade-d" />
      <span className="rice-blade blade-e" />
    </>
  );
}

function WheatSprite() {
  return (
    <>
      <span className="wheat-stem stem-a" />
      <span className="wheat-stem stem-b" />
      <span className="wheat-stem stem-c" />
    </>
  );
}

function CottonSprite() {
  return (
    <>
      <span className="bean-stem" />
      <span className="round-leaf leaf-a" />
      <span className="round-leaf leaf-b" />
      <span className="cotton-boll boll-a" />
      <span className="cotton-boll boll-b" />
      <span className="cotton-boll boll-c" />
    </>
  );
}

function PotatoSprite() {
  return (
    <>
      <span className="potato-leaf leaf-a" />
      <span className="potato-leaf leaf-b" />
      <span className="potato-leaf leaf-c" />
      <span className="potato-leaf leaf-d" />
    </>
  );
}

function RapeseedSprite() {
  return (
    <>
      <span className="plant-stem" />
      <span className="leaf leaf-a" />
      <span className="leaf leaf-b" />
      <span className="flower flower-a" />
      <span className="flower flower-b" />
      <span className="flower flower-c" />
    </>
  );
}

function TeaSprite() {
  return (
    <>
      <span className="tea-bush bush-a" />
      <span className="tea-bush bush-b" />
      <span className="tea-bush bush-c" />
    </>
  );
}

const spriteMap = {
  corn: CornSprite,
  soybean: SoybeanSprite,
  rice: RiceSprite,
  wheat: WheatSprite,
  cotton: CottonSprite,
  potato: PotatoSprite,
  rapeseed: RapeseedSprite,
  tea: TeaSprite
};

export default function PlantSprite({ cropId, health, x, y, scale, debug = false }) {
  const Sprite = spriteMap[cropId] ?? CornSprite;

  return (
    <span
      className={[
        "plant-sprite",
        `plant-crop-${cropId}`,
        `plant-health-${health}`,
        debug ? "plant-debug" : ""
      ].filter(Boolean).join(" ")}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        "--plant-scale": scale,
        "--plant-z": Math.round(y * 10)
      }}
    >
      <Sprite />
    </span>
  );
}

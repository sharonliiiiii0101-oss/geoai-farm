const huabei = {
  cropPolygons: [
    [
      { x: 2.6, y: 63.4 },
      { x: 95, y: 63.7 },
      { x: 95.8, y: 96.1 },
      { x: 2.9, y: 96.4 },
      { x: 2.6, y: 63 }
    ]
  ]
};

const loess = {
  cropPolygons: [
    [
      { x: 1, y: 73.6 },
      { x: 41, y: 67.6 },
      { x: 98.5, y: 72.8 },
      { x: 51.2, y: 88 },
      { x: 1, y: 74 }
    ]
  ]
};

const sichuan = {
  cropPolygons: [
    [
      { x: 1.7, y: 70.5 },
      { x: 97.8, y: 70.4 },
      { x: 97.7, y: 97.5 },
      { x: 2.5, y: 96.9 },
      { x: 1.6, y: 70.4 }
    ]
  ]
};

const songnen = {
  cropPolygons: [
    [
      { x: 2, y: 64.2 },
      { x: 98.6, y: 63.4 },
      { x: 98.8, y: 96.5 },
      { x: 98.8, y: 96.5 },
      { x: 1.9, y: 96.4 },
      { x: 2.3, y: 64.2 }
    ]
  ]
};

const xinjiang = {
  cropPolygons: [
    [
      { x: 2.8, y: 68 },
      { x: 96.9, y: 68.1 },
      { x: 97.3, y: 97.6 },
      { x: 3.2, y: 97.2 },
      { x: 2.8, y: 67.7 }
    ]
  ]
};

const yungui = {
  cropPolygons: [
    [
      { x: 2, y: 60.8 },
      { x: 98.2, y: 60.6 },
      { x: 98.6, y: 97.3 },
      { x: 3.7, y: 96.3 },
      { x: 2, y: 60.6 }
    ]
  ]
};

const yangtze = {
  cropPolygons: [
    [
      { x: 1.6, y: 79.1 },
      { x: 23.1, y: 69.2 },
      { x: 75.6, y: 69.2 },
      { x: 98.8, y: 83.3 },
      { x: 94.3, y: 91 },
      { x: 3.7, y: 90.6 },
      { x: 1.8, y: 78.8 }
    ]
  ]
};

export const cropAreaMasks = {
  huabei,
  songnen,
  yangtze,
  yangtze_plain: yangtze,
  loess,
  loess_plateau: loess,
  yungui,
  yungui_plateau: yungui,
  xinjiang,
  xinjiang_oasis: xinjiang,
  sichuan,
  sichuan_basin: sichuan
};

export const defaultCropAreaMask = huabei;

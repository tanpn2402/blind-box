const getImageSvgUrl = (
  num: number,
  color?: string,
  width = 50,
  height = 50
) => {
  const fontSizeSm = Math.min(width / 8, height / 6);
  const fontSizeLg = Math.min(width / 2, height / 2);

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${
    height ?? width
  }">
  <style>
    .funny-text {
      font-family: 'Comic Neue', Arial, sans-serif;
      fill: ${color};
    }
    .funny-text-sm {
      font-size: ${fontSizeSm}px;
    }
    .funny-text-lg {
      font-size: ${fontSizeLg}px;
    }
  </style>
  <rect width="100%" height="100%" fill="#f0f8ff"/>
  <text x="50%" y="25%" dominant-baseline="middle" text-anchor="middle" class="funny-text funny-text-sm">
    your gift box is
  </text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" class="funny-text funny-text-lg">
    ${num}
  </text>
</svg>`;
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  return URL.createObjectURL(svgBlob);
};

const getImageSvgSmallUrl = (
  num: number,
  color?: string,
  width = 50,
  height = 50
) => {
  const fontSize = Math.min(width / 2, height / 2);
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${
    height ?? width
  }">
  <style>
    .funny-text {
      font-family: 'Comic Neue', Arial, sans-serif;
      fill: ${color};
      font-size: ${fontSize}px;
    }
  </style>
  <rect width="100%" height="100%" fill="#f0f8ff"/>
  <text x="55%" y="55%" dominant-baseline="middle" text-anchor="middle" class="funny-text">
    ${num}
  </text>
</svg>`;
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  return URL.createObjectURL(svgBlob);
};

export { getImageSvgUrl, getImageSvgSmallUrl };

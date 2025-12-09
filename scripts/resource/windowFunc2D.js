const $windowFunc2D = (function () {
  const _getPreset = (preset) => {
    const presets = {
      rect: "1",
      cosine:
        "Math.cos((Math.PI * (x - (width - 1) / 2)) / width) * Math.cos((Math.PI * (y - (height - 1) / 2)) / height)",
      gaussian:
        "Math.exp(-((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / (2 * 1.5 ** 2))",
      chebyshev:
        "Math.exp(-Math.max(Math.abs(x - (width - 1) / 2), Math.abs(y - (height - 1) / 2)) / (2 * 1.5 ** 2))",
      manhattan:
        "Math.exp(-(Math.abs(x - (width - 1) / 2) + Math.abs(y - (height - 1) / 2)) / (2 * 1.5 ** 2))",
      cosineGaussian:
        "Math.sin(Math.exp(-((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / (2 * 2 ** 2))) ** 2",
      tangentGaussian:
        "Math.tan(Math.exp(-((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / (2 * 2 ** 2))) ** 2",
    };

    const choosenPreset = presets[preset];

    if (choosenPreset) return choosenPreset;
    else return false;
  };

  const _getWindowFunction = (width, height, equation) => {
    if (!Number.isInteger(width)) throw new Error("Width must be an integer");
    if (!Number.isInteger(height)) throw new Error("Height must be an integer");

    const sqSz = width * height;
    if (equation == null) throw new Error("Invalid equation input: " + equation);

    const trimmed = equation.replace(/\s/g, "");

    const kernel = new Float64Array(sqSz).fill(1);
    const cp = new Function("x", "y", "width", "height", "return " + trimmed);

    for (let y = 0; y < height; y++) {
      const yOffs = y * width;

      for (let x = 0; x < width; x++) {
        kernel[yOffs + x] *= cp(x, y, width, height);
      }
    }

    let sum = 0;
    for (let i = 0; i < sqSz; i++) {
      if (Number.isFinite(kernel[i])) sum += kernel[i];
    }

    for (let i = 0; i < sqSz; i++) kernel[i] /= sum;

    return kernel;
  };

  return {
    getPreset: _getPreset,
    getWindowFunction: _getWindowFunction,
  };
})();

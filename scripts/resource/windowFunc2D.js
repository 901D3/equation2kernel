const $windowFunc2D = (function () {
  const _getPreset = (preset) => {
    const presets = {
      rect: "1",
      gaussian:
        "Math.exp(-((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / (2 * 2 ** 2))",
      cauchy: "1 / (1 + ((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / 2 ** 2)",
      chebyshev:
        "Math.exp(-Math.max(Math.abs(x - (width - 1) / 2), Math.abs(y - (height - 1) / 2)) / (2 * 1.5 ** 2))",
      manhattan:
        "Math.exp(-(Math.abs(x - (width - 1) / 2) + Math.abs(y - (height - 1) / 2)) / (2 * 1.5 ** 2))",
      cosineGaussian:
        "Math.sin(Math.PI * Math.exp(-((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / (2 * 2 ** 2)))",
      cosineCauchy:
        "Math.sin(Math.PI * (1 / (1 + ((x - (width - 1) / 2) ** 2 + (y - (height - 1) / 2) ** 2) / 2 ** 2)))",
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

    const kernel = new Float64Array(sqSz);
    const cp = new Function("x", "y", "width", "height", "return " + trimmed);

    let sum = 0;
    for (let y = 0; y < height; y++) {
      const yOffs = y * width;

      for (let x = 0; x < width; x++) {
        const v = cp(x, y, width, height);
        if (v === 0) continue;

        kernel[yOffs + x] = v;
        sum += v;
      }
    }

    for (let i = 0; i < sqSz; i++) kernel[i] /= sum;

    return kernel;
  };

  return {
    getPreset: _getPreset,
    getWindowFunction: _getWindowFunction,
  };
})();

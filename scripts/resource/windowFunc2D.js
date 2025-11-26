const $windowFunc2D = (function () {
  const _getPreset = (preset) => {
    const presets = {
      rect: "1",
      ramp: "(y * width + x) / (width * height)",
      cosine:
        "Math.cos((Math.PI * (x - width / 2)) / width) * Math.cos((Math.PI * (y - height / 2)) / height)",
      gaussian: "Math.exp(-((x - width / 2) ** 2 + (y - height / 2) ** 2) / (2 * (1.5) ** 2))",
      chebyshev:
        "Math.exp(-Math.max(Math.abs(x - width / 2), Math.abs(y - height / 2)) / (2 * 1.5 ** 2))",
      manhattan:
        "Math.exp(-(Math.abs(x - width / 2) + Math.abs(y - height / 2)) / (2 * 1.5 ** 2))",
    };

    const choosenPreset = presets[preset];

    if (choosenPreset) {
      return choosenPreset;
    } else {
      return false;
    }
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

    return kernel;
  };

  return {
    getPreset: _getPreset,
    getWindowFunction: _getWindowFunction,
  };
})();

const SVG_NS = "http://www.w3.org/2000/svg";

function hash01(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + 17.113) * 43758.5453123;
  return value - Math.floor(value);
}

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function drawX(parent, cx, cy, size, color = "#cfd5dd") {
  const g = el("g", { stroke: color, "stroke-width": 1.2, "stroke-linecap": "round" });
  g.append(
    el("line", { x1: cx - size, y1: cy - size, x2: cx + size, y2: cy + size }),
    el("line", { x1: cx - size, y1: cy + size, x2: cx + size, y2: cy - size }),
  );
  parent.appendChild(g);
}

function drawCheck(parent, cx, cy, size, color) {
  const d = [
    `M ${cx - size * 0.9} ${cy}`,
    `L ${cx - size * 0.2} ${cy + size * 0.8}`,
    `L ${cx + size * 1.1} ${cy - size * 0.9}`,
  ].join(" ");
  parent.appendChild(
    el("path", {
      d,
      fill: "none",
      stroke: color,
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  );
}

function renderRewardHackingGraphic(container) {
  const variant = container.dataset.proteinguideRewardHacking || "predictor-extrapolation";

  const isPredictorExtrapolation = variant === "predictor-extrapolation";

  // Match the baseline schematic layout across both reward-hacking variants.
  const cols = 14;
  const rows = 10;
  const boxHeight = 24;
  const boxWidth = boxHeight * Math.SQRT2;
  const gapX = 18;
  const gapY = 18;
  const stepX = boxWidth + gapX;
  const stepY = boxHeight + gapY;
  const pad = 30;

  const width = pad * 2 + cols * boxWidth + (cols - 1) * gapX;
  const height = pad * 2 + rows * boxHeight + (rows - 1) * gapY;

  const trainingRegion = { x0: 4, x1: 9, y0: 2, y1: 7 };
  const shiftedRegion = { x0: 10, x1: 12, y0: 2, y1: 7 };
  const coreRegion = { x0: 5, x1: 9, y0: 3, y1: 6 };

  const ariaByVariant = {
    "predictor-extrapolation": "Reward hacking variation one. Blue checks mark realistic sequences in a central region while orange checks spread into areas with few blue checks, indicating predictor extrapolation.",
    "generator-shift": "Reward hacking variation two. The red box marks the assay training region. Shifted guided samples are highlighted with orange glow, and the cases with both blue and orange checks are circled in black.",
  };

  const svg = el("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    role: "img",
    "aria-label": ariaByVariant[variant] || ariaByVariant["predictor-extrapolation"],
    style: "width: 100%; height: auto; display: block;",
  });

  svg.appendChild(
    el("rect", {
      x: 0,
      y: 0,
      width,
      height,
      fill: "#fffdf7",
      rx: 12,
    }),
  );

  const edges = el("g", { stroke: "#d4d8dd", "stroke-width": 1.05 });
  const boxes = el("g");

  const cellX = (col) => pad + col * stepX;
  const cellY = (row) => pad + row * stepY;
  const centerX = (col) => cellX(col) + boxWidth / 2;
  const centerY = (row) => cellY(row) + boxHeight / 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (col + 1 < cols) {
        edges.appendChild(el("line", { x1: centerX(col), y1: centerY(row), x2: centerX(col + 1), y2: centerY(row) }));
      }
      if (row + 1 < rows) {
        edges.appendChild(el("line", { x1: centerX(col), y1: centerY(row), x2: centerX(col), y2: centerY(row + 1) }));
      }
    }
  }
  svg.appendChild(edges);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = cellX(col);
      const y = cellY(row);

      const inTraining = col >= trainingRegion.x0 && col <= trainingRegion.x1 && row >= trainingRegion.y0 && row <= trainingRegion.y1;
      const inShift = col >= shiftedRegion.x0 && col <= shiftedRegion.x1 && row >= shiftedRegion.y0 && row <= shiftedRegion.y1;

      let isBlue = false;
      let isOrange = false;
      let hasOutsideOrangeGlow = false;
      let circleBlueOrangeGlow = false;

      if (isPredictorExtrapolation) {
        // Build directly on the original schematic: realistic support concentrated in the red region.
        const realismScore = hash01(col + 3, row + 11);
        const fitnessScore = hash01(col + 17, row + 23);
        const inCore = col >= coreRegion.x0 && col <= coreRegion.x1 && row >= coreRegion.y0 && row <= coreRegion.y1;

        // Keep the baseline schematic behavior: realistic support concentrated in/near the red region.
        isBlue = (inTraining && realismScore > 0.12) || (!inTraining && realismScore > 0.992);

        const regionNX = (col - trainingRegion.x0) / (trainingRegion.x1 - trainingRegion.x0);
        const regionNY = (row - trainingRegion.y0) / (trainingRegion.y1 - trainingRegion.y0);
        const dx = regionNX - 0.72;
        const dy = regionNY - 0.52;
        const centerRightBias = Math.exp(-((dx * dx) / 0.05 + (dy * dy) / 0.07));
        const orangeThreshold = 0.74 - 0.52 * centerRightBias;
        const rightEdgeBias = Math.exp(-(((regionNX - 0.98) ** 2) / 0.02 + ((regionNY - 0.52) ** 2) / 0.15));

        const orangeInsideRegion =
          inTraining &&
          inCore &&
          isBlue &&
          (fitnessScore > orangeThreshold || (rightEdgeBias > 0.55 && fitnessScore > 0.48));

        // Reward-hacking twist: predictor false positives just outside the dashed red box.
        const orangeOutsideRegion =
          !inTraining &&
          col >= trainingRegion.x1 + 1 &&
          col <= Math.min(cols - 1, trainingRegion.x1 + 3) &&
          row >= trainingRegion.y0 &&
          row <= trainingRegion.y1 &&
          fitnessScore > 0.56;

        isOrange = orangeInsideRegion || orangeOutsideRegion;
        hasOutsideOrangeGlow = orangeOutsideRegion;
      } else {
        const realismNoise = hash01(col + 11, row + 7);
        const fitnessNoise = hash01(col + 23, row + 17);
        const blueBlob = Math.exp(-(((col - 6.3) ** 2) / 7 + ((row - 4.3) ** 2) / 3.8));

        // Increase realistic-support density so blue occupies much more of the map.
        isBlue = realismNoise > 0.6 || (blueBlob > 0.18 && realismNoise > 0.2);
        isBlue = isBlue || (inShift && realismNoise > 0.88);

        const inCoreTrain = inTraining && isBlue && fitnessNoise > 0.36;
        const shiftedHighScore = inShift && fitnessNoise > 0.28;
        isOrange = inCoreTrain || shiftedHighScore;
        hasOutsideOrangeGlow = shiftedHighScore;
        circleBlueOrangeGlow = shiftedHighScore && isBlue && isOrange;
      }

      if (hasOutsideOrangeGlow) {
        boxes.appendChild(
          el("rect", {
            x: x - 4.2,
            y: y - 4.2,
            width: boxWidth + 8.4,
            height: boxHeight + 8.4,
            fill: "#f2a23e",
            opacity: 0.5,
            rx: 5.5,
          }),
        );
      }

      boxes.appendChild(
        el("rect", {
          x,
          y,
          width: boxWidth,
          height: boxHeight,
          fill: "#ffffff",
          stroke: "#9ea7b2",
          "stroke-width": 1,
          rx: 2,
        }),
      );

      boxes.appendChild(
        el("line", {
          x1: x,
          y1: y + boxHeight,
          x2: x + boxWidth,
          y2: y,
          stroke: "#c5ccd4",
          "stroke-width": 1,
        }),
      );

      const upperLeftMark = { x: x + boxWidth * 0.32, y: y + boxHeight * 0.32 };
      const lowerRightMark = { x: x + boxWidth * 0.68, y: y + boxHeight * 0.68 };

      if (isBlue) {
        drawCheck(boxes, upperLeftMark.x, upperLeftMark.y, 2.9, "#2f6fd8");
      } else {
        drawX(boxes, upperLeftMark.x, upperLeftMark.y, 2.7);
      }

      if (isOrange) {
        drawCheck(boxes, lowerRightMark.x, lowerRightMark.y, 2.9, "#ea8c2f");
      } else {
        drawX(boxes, lowerRightMark.x, lowerRightMark.y, 2.7);
      }

      if (circleBlueOrangeGlow) {
        boxes.appendChild(
          el("ellipse", {
            cx: x + boxWidth / 2,
            cy: y + boxHeight / 2,
            rx: boxWidth * 0.66,
            ry: boxHeight * 0.94,
            fill: "none",
            stroke: "#111111",
            "stroke-width": 1.8,
          }),
        );
      }
    }
  }

  svg.appendChild(boxes);

  const regionOutline = (region, color) =>
    el("rect", {
      x: cellX(region.x0) - 9,
      y: cellY(region.y0) - 9,
      width: (region.x1 - region.x0 + 1) * stepX - gapX + 18,
      height: (region.y1 - region.y0 + 1) * stepY - gapY + 18,
      fill: "none",
      stroke: color,
      "stroke-width": 2.8,
      rx: 14,
      "stroke-dasharray": "8 6",
    });

  svg.appendChild(regionOutline(trainingRegion, "#d53b33"));

  // For generator-shift, we now highlight shifted false positives with glow + black circles
  // instead of a secondary dashed region.

  container.innerHTML = "";
  container.appendChild(svg);
}

document
  .querySelectorAll("[data-proteinguide-reward-hacking]")
  .forEach((container) => renderRewardHackingGraphic(container));

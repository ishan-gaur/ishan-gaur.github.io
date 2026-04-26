const SVG_NS = "http://www.w3.org/2000/svg";

function hash01(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + 41.217) * 43758.5453123;
  return value - Math.floor(value);
}

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function drawX(parent, cx, cy, size, color) {
  const g = el("g", { stroke: color, "stroke-width": 1.3, "stroke-linecap": "round" });
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
      "stroke-width": 2.2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  );
}

function renderGraphic(container) {
  const cols = Number(container.dataset.cols || 14);
  const rows = Number(container.dataset.rows || 10);

  const boxHeight = 24;
  const boxWidth = boxHeight * Math.SQRT2;
  const gapX = 18;
  const gapY = 18;
  const stepX = boxWidth + gapX;
  const stepY = boxHeight + gapY;
  const pad = 30;

  const width = pad * 2 + cols * boxWidth + (cols - 1) * gapX;
  const height = pad * 2 + rows * boxHeight + (rows - 1) * gapY;

  const region = { x0: 4, x1: 9, y0: 2, y1: 7 };
  const core = { x0: 5, x1: 9, y0: 3, y1: 6 };

  const svg = el("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    role: "img",
    "aria-label": "Grid of sequence nodes split diagonally from lower-left to upper-right. The upper-left triangle shows realistic proteins with orange checks or gray x marks. The lower-right triangle shows task-solving proteins with blue checks or gray x marks. A red outlined region marks the sampled neighborhood.",
    style: "width: 100%; height: auto; display: block;",
  });

  const bg = el("rect", {
    x: 0,
    y: 0,
    width,
    height,
    fill: "#fffdf7",
    rx: 14,
  });
  svg.appendChild(bg);

  const edges = el("g", { stroke: "#d4d8dd", "stroke-width": 1.1 });
  const boxes = el("g");

  const cellX = (col) => pad + col * stepX;
  const cellY = (row) => pad + row * stepY;
  const centerX = (col) => cellX(col) + boxWidth / 2;
  const centerY = (row) => cellY(row) + boxHeight / 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (col + 1 < cols) {
        edges.appendChild(
          el("line", {
            x1: centerX(col),
            y1: centerY(row),
            x2: centerX(col + 1),
            y2: centerY(row),
          }),
        );
      }
      if (row + 1 < rows) {
        edges.appendChild(
          el("line", {
            x1: centerX(col),
            y1: centerY(row),
            x2: centerX(col),
            y2: centerY(row + 1),
          }),
        );
      }
    }
  }

  svg.appendChild(edges);

  let hasBlue = false;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = cellX(col);
      const y = cellY(row);

      const inRegion = col >= region.x0 && col <= region.x1 && row >= region.y0 && row <= region.y1;
      const inCore = col >= core.x0 && col <= core.x1 && row >= core.y0 && row <= core.y1;
      const realismScore = hash01(col + 3, row + 11);
      const fitnessScore = hash01(col + 17, row + 23);

      // Slightly denser realistic proteins in the outlined sampling region.
      const isOrange = (inRegion && realismScore > 0.12) || (!inRegion && realismScore > 0.992);

      // Concentrate task-solving proteins toward the center-right of the outlined region.
      const regionNX = (col - region.x0) / (region.x1 - region.x0);
      const regionNY = (row - region.y0) / (region.y1 - region.y0);
      const dx = regionNX - 0.72;
      const dy = regionNY - 0.52;
      const centerRightBias = Math.exp(-((dx * dx) / 0.05 + (dy * dy) / 0.07));
      const blueThreshold = 0.74 - 0.52 * centerRightBias;

      // Add a slight right-edge hotspot so we visibly get a few more blues.
      const rightEdgeBias = Math.exp(-(((regionNX - 0.98) ** 2) / 0.02 + ((regionNY - 0.52) ** 2) / 0.15));
      const passesCoreBlueRule = fitnessScore > blueThreshold;
      const passesRightEdgeBonus = rightEdgeBias > 0.55 && fitnessScore > 0.48;
      const passesAnchorBonus = col === 8 && row === 6;

      const isBlue = inRegion && inCore && isOrange && (passesCoreBlueRule || passesRightEdgeBonus || passesAnchorBonus);

      if (isBlue) {
        hasBlue = true;
      }

      boxes.appendChild(
        el("rect", {
          x,
          y,
          width: boxWidth,
          height: boxHeight,
          fill: "#ffffff",
          stroke: "#9ea7b2",
          "stroke-width": 1.1,
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

      if (isOrange) {
        drawCheck(boxes, upperLeftMark.x, upperLeftMark.y, 2.9, "#ea8c2f");
      } else {
        drawX(boxes, upperLeftMark.x, upperLeftMark.y, 2.8, "#cfd5dd");
      }

      if (isBlue) {
        drawCheck(boxes, lowerRightMark.x, lowerRightMark.y, 3.1, "#2f6fd8");
      } else {
        drawX(boxes, lowerRightMark.x, lowerRightMark.y, 2.8, "#cfd5dd");
      }
    }
  }

  if (!hasBlue) {
    const col = Math.round(region.x0 + 0.72 * (region.x1 - region.x0));
    const row = Math.round(region.y0 + 0.52 * (region.y1 - region.y0));
    const x = cellX(col);
    const y = cellY(row);
    drawCheck(boxes, x + boxWidth * 0.32, y + boxHeight * 0.32, 2.9, "#ea8c2f");
    drawCheck(boxes, x + boxWidth * 0.68, y + boxHeight * 0.68, 3.1, "#2f6fd8");
  }

  svg.appendChild(boxes);

  const highlight = el("rect", {
    x: cellX(region.x0) - 12,
    y: cellY(region.y0) - 12,
    width: (region.x1 - region.x0 + 1) * stepX - gapX + 24,
    height: (region.y1 - region.y0 + 1) * stepY - gapY + 24,
    fill: "none",
    stroke: "#d53b33",
    "stroke-width": 3,
    rx: 18,
    "stroke-dasharray": "10 6",
  });

  svg.appendChild(highlight);

  container.innerHTML = "";
  container.appendChild(svg);
}

document.querySelectorAll("[data-proteinguide-graphic]").forEach(renderGraphic);

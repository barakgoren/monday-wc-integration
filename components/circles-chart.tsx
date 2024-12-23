/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

function darkenColor(color: string, amount: number): string {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00ff) - amount;
  let b = (num & 0x0000ff) - amount;

  r = r < 0 ? 0 : r;
  g = g < 0 ? 0 : g;
  b = b < 0 ? 0 : b;

  return (
    (usePound ? "#" : "") +
    ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
  );
}

const data = [
  { id: 1, projectName: "Zedix", hours: 258.85, color: "#4d4dff" },
  { id: 2, projectName: "OUT", hours: 30.5, color: "#007acc" },
  { id: 3, projectName: "Twigo", hours: 5.25, color: "#990099" },
  { id: 4, projectName: "SmartSend", hours: 15.5, color: "#00cc7a" },
  // Add more data here...
];

export default function CirclesChart() {
  const [positions, setPositions] = useState(
    data.map((d) => {
      return {
        id: d.id,
        left: Math.random() * (100 - d.hours),
        top: Math.random() * (100 - d.hours),
      };
    })
  );

  const handleMouseDown = (e: any, id: any) => {
    const element = e.target;

    const parent = element.parentElement;
    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = parseFloat(element.style.left);
    const initialTop = parseFloat(element.style.top);

    const allElements = parent.children;
    for (let i = 0; i < allElements.length; i++) {
      allElements[i].style.zIndex = "0";
    }
    element.style.zIndex = "1000";

    const handleMouseMove = (moveEvent: any) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const parentWidth = parent.offsetWidth;
      const parentHeight = parent.offsetHeight;

      const newLeft = Math.max(
        0,
        Math.min(
          100 - parseFloat(element.style.width),
          initialLeft + (deltaX / parentWidth) * 100
        )
      );
      const newTop = Math.max(
        0,
        Math.min(
          100 - parseFloat(element.style.height),
          initialTop + (deltaY / parentHeight) * 100
        )
      );

      setPositions((prevPositions) =>
        prevPositions.map((pos) =>
          pos.id === id ? { ...pos, left: newLeft, top: newTop } : pos
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const totalHours = data.reduce((acc, curr) => acc + curr.hours, 0);
  const gridSize = Math.ceil(Math.sqrt(data.length));
  const cellSize = 100 / gridSize;
  const maxCircleSize = 25; // Set a maximum size for the circles

  return (
    <div className="relative w-[95%] aspect-square">
      {data.map((d) => {
        const position = positions.find((pos) => pos.id === d.id) || {
          left: 0,
          top: 0,
        };
        const randomBackgroundColor = d.color;
        const randomBorderColor = darkenColor(randomBackgroundColor, 120);
        const widthAndHeight = Math.min(
          cellSize * (d.hours / totalHours) * gridSize,
          maxCircleSize
        ); // Adjust size based on hours and constrain to max size
        const adjustedWidthAndHeight = widthAndHeight + 30; // Adjusted size with the added 20%
        // Random number between adjustedWidthAndHeight and 100

        const randomPositionTop =
          Math.random() * (100 - adjustedWidthAndHeight + 1) +
          adjustedWidthAndHeight;

        const randomPositionLeft =
          Math.random() * (100 - adjustedWidthAndHeight + 1) +
          adjustedWidthAndHeight;
        if (position.left < 0) {
          position.left = randomPositionLeft - adjustedWidthAndHeight;
        }
        if (position.top < 0) {
          position.top = randomPositionTop - adjustedWidthAndHeight;
        }

        return (
          <div
            key={d.id}
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
              width: `${adjustedWidthAndHeight}%`,
              height: `${adjustedWidthAndHeight}%`,
              backgroundColor: randomBackgroundColor,
              border: `1px solid ${randomBorderColor}`,
              opacity: 0.8,
              position: "absolute",
              cursor: "grab",
            }}
            className="rounded-full flex flex-col items-center justify-center"
            onMouseDown={(e) => handleMouseDown(e, d.id)}
          >
            <p className="text-white">{d.projectName}</p>
            <p className="text-gray-300 text-xs font-light">{d.hours} hours</p>
          </div>
        );
      })}
    </div>
  );
}

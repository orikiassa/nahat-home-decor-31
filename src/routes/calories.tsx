import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import calorieAppHtml from "@/lib/calorie-app.html?raw";

export const Route = createFileRoute("/calories")({
  component: CaloriesPage,
  head: () => ({
    meta: [
      { title: "קלוריות · יומן אוכל" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" },
      { name: "color-scheme", content: "light dark" },
      { name: "theme-color", content: "#FFFFFF" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "קלוריות" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
  }),
});

/**
 * Served as a real app route (not a public/ static file) so it always goes
 * through the same request path as /about and /faq, regardless of how the
 * host serves static assets. The app itself is loaded from a same-origin
 * blob: URL rather than an iframe srcDoc, so its localStorage stays tied to
 * this site's real origin instead of an iframe's opaque "null" origin.
 */
function CaloriesPage() {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    const blob = new Blob([calorieAppHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const size = 180;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#FFE9DB");
    grad.addColorStop(0.55, "#FFD9CE");
    grad.addColorStop(1, "#FFC9D9");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#E2472F";
    ctx.lineWidth = size * 0.075;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.55);
    ctx.stroke();
    ctx.font = `700 ${size * 0.34}px ui-serif, Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#3A2620";
    ctx.fillText("קל", size / 2, size / 2 + size * 0.015);
    const href = canvas.toDataURL("image/png");
    const links: HTMLLinkElement[] = [];
    ["apple-touch-icon", "icon"].forEach((rel) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((link) => link.remove());
  }, []);

  if (!blobUrl) return null;

  return (
    <iframe
      title="יומן קלוריות"
      src={blobUrl}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100dvh", border: "none", display: "block" }}
    />
  );
}

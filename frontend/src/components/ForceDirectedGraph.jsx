import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3-force";
import { select } from "d3-selection";
import { drag } from "d3-drag";

const ForceDirectedGraph = ({
  nodes,
  links,
  width = 600,
  height = 400,
  onNodeClick,
}) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });

  useEffect(() => {
    if (!nodes || !links || nodes.length === 0) return;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    // Create a copy of nodes and links for D3 to mutate
    const nodesCopy = nodes.map((d) => ({ ...d }));
    const linksCopy = links.map((d) => ({ ...d }));

    // Create simulation with improved forces
    const simulation = d3
      .forceSimulation(nodesCopy)
      .force(
        "link",
        d3
          .forceLink(linksCopy)
          .id((d) => d.id)
          .distance(120)
          .strength(0.8)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create gradient definitions
    const defs = svg.append("defs");

    // Create gradients for nodes
    const gradient = defs
      .append("radialGradient")
      .attr("id", "nodeGradient")
      .attr("cx", "30%")
      .attr("cy", "30%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffffff")
      .attr("stop-opacity", 0.8);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 1);

    // Create arrow markers for directed links with improved styling
    defs
      .selectAll("marker")
      .data(["arrow"])
      .enter()
      .append("marker")
      .attr("id", (d) => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 35)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#4f46e5")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 1);

    // Create links with improved styling
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(linksCopy)
      .enter()
      .append("line")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 3)
      .attr("stroke-opacity", 0.7)
      .attr("marker-end", "url(#arrow)")
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Create node groups
    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodesCopy)
      .enter()
      .append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d);
      })
      .on("mouseover", (event, d) => {
        // Show tooltip
        const [x, y] = [event.pageX, event.pageY];
        setTooltip({
          show: true,
          x: x + 10,
          y: y - 10,
          content: d.title || d.id,
        });

        // Highlight node
        select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 28)
          .attr("stroke-width", 4);
      })
      .on("mouseout", (event) => {
        // Hide tooltip
        setTooltip({ show: false, x: 0, y: 0, content: "" });

        // Reset node
        select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 24)
          .attr("stroke-width", 3);
      });

    // Add shadow filter
    const filter = defs
      .append("filter")
      .attr("id", "shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter
      .append("feDropShadow")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("stdDeviation", 3)
      .attr("flood-color", "rgba(0,0,0,0.3)");

    // Add circles to nodes with improved styling
    node
      .append("circle")
      .attr("r", 24)
      .attr("fill", (d) => d.color || "url(#nodeGradient)")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .style("filter", "url(#shadow)");

    // Add text background for better readability
    node
      .append("rect")
      .attr("x", -25)
      .attr("y", 30)
      .attr("width", 50)
      .attr("height", 16)
      .attr("rx", 8)
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1);

    // Add labels to nodes with improved styling
    node
      .append("text")
      .text((d) => {
        const title = d.title || d.id;
        return title.length > 8 ? title.substring(0, 8) + "..." : title;
      })
      .attr("text-anchor", "middle")
      .attr("y", 42)
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .style("pointer-events", "none");

    // Add drag behavior
    const dragBehavior = drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(dragBehavior);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height, onNodeClick]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg"
      />

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <span className="inline-flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122"
              />
            </svg>
            <span>Click nodes to navigate</span>
          </span>
          <span className="mx-2">•</span>
          <span className="inline-flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span>Drag to rearrange</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForceDirectedGraph;

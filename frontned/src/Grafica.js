import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Grafica() {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 30,
        background: am5.Rectangle.new(root, {
          fill: am5.color(0xf3f6f4),
          fillOpacity: 1,
        }),
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {
      minorGridEnabled: true,
    });

    yRenderer.grid.template.set("visible", false);
    yRenderer.labels.template.setAll({
      fill: am5.color(0x5b5b5b),
      fontSize: 14,
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: yRenderer,
        paddingRight: 40,
        cellHeight: 50, 
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 60,
    });

    xRenderer.labels.template.setAll({
      fill: am5.color(0x1e1e1e),
      fontSize: 16,
      centerY: am5.p0,
      paddingTop: 10,
      oversizedBehavior: "none",
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 170,
        interval: 15,
        renderer: xRenderer,
      })
    );
   

    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Puntaje",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "puntaje",
        categoryYField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueX}",
          getFillFromSprite: false,
          background: am5.Rectangle.new(root, {
            fill: am5.color(0x79142f),
            fillOpacity: 0.95,
          }),
          label: {
            fill: am5.color(0xffffff),
          },
        }),
      })
    );

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 25,
      cornerRadiusTR: 25,
      maxHeight: 50,
      fillOpacity: 0.9,
      tooltipText: "{valueX}",
    });

    const circleTemplate = am5.Template.new({});

    series.bullets.push(function (root, series, dataItem) {
      const bulletContainer = am5.Container.new(root, {});
      bulletContainer.children.push(
        am5.Circle.new(root, { radius: 35 }, circleTemplate)
      );

      const maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 30 })
      );

      const imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle,
        })
      );

      imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 60,
          height: 60,
        })
      );

      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: bulletContainer,
      });
    });

    series.set("heatRules", [
      {
        dataField: "valueX",
        min: am5.color(0xd5aebb),
        max: am5.color(0x79142f),
        target: series.columns.template,
        key: "fill",
      },
      {
        dataField: "valueX",
        min: am5.color(0xf4f5f4),
        max: am5.color(0x79142f),
        target: circleTemplate,
        key: "fill",
      },
    ]);

    let currentlyHovered;

    function handleOut() {
      if (currentlyHovered) {
        const bullet = currentlyHovered.bullets[0];
        bullet.animate({
          key: "locationX",
          to: 0,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
        });
        currentlyHovered = null;
      }
    }

    series.columns.template.events.on("pointerover", function (e) {
      const dataItem = e.target.dataItem;
      if (dataItem && currentlyHovered !== dataItem) {
        handleOut();
        currentlyHovered = dataItem;
        const bullet = dataItem.bullets[0];
        bullet.animate({
          key: "locationX",
          to: 1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    });

    series.columns.template.events.on("pointerout", function () {
      handleOut();
    });

    const updateChart = (data) => {
      series.data.setAll(data);
      yAxis.data.setAll(data);
    };

    // Escuchar eventos de Socket.io
    socket.on("conexionInicial", updateChart);
    socket.on("puntajeActualizado", updateChart); // Aquí está el evento adicional

    return () => {
      root.dispose();
      socket.off("conexionInicial", updateChart);
      socket.off("puntajeActualizado", updateChart); // Limpiar el evento
    };
  }, []); // Este useEffect solo se ejecuta una vez al montarse el componente

  return (
    <div style={{ background: "#f4f5f4", minHeight: "100vh", paddingTop: "2rem" }}>
      <h2
        style={{
          textAlign: "center",
          color: "#8b1e3b",
          fontSize: "28px",
          marginBottom: "1rem",
          fontWeight: "800",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        <span style={{ fontSize: "34px", fontWeight: "900", display: "block" }}>
          DEMOSTRACIÓN DE PROYECTOS INTEGRADORES
        </span>
        <span
          style={{
            color: "#404040",
            fontSize: "26px",
            fontWeight: "600",
            display: "block",
          }}
        >
          del Área de Tecnologías de la Información
        </span>
      </h2>

      <div
        id="chartdiv"
        ref={chartRef}
        style={{
          width: "90%",
          height: "820px", // puedes aumentar si tienes más equipos
          margin: "0 auto",
          background: "#404040",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 10px 100px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}

// components/BatchStudentChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BatchStudentChart = ({ labels, data, fullLabels = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && labels && data && labels.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Number of Students',
              data: data,
              backgroundColor: '#00AEED',
              borderWidth: 0,
              borderRadius: 8,
              barPercentage: 0.7,
              categoryPercentage: 0.85,
              hoverBackgroundColor: '#424347',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#FFFFFF',
              titleColor: '#424347',
              bodyColor: '#6B7280',
              titleFont: { size: 11, weight: 'bold' },
              bodyFont: { size: 10 },
              padding: 10,
              borderColor: '#E5E7EB',
              borderWidth: 1,
              callbacks: {
                title: (tooltipItems) => {
                  const index = tooltipItems[0].dataIndex;
                  return fullLabels[index] || labels[index];
                },
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y + ' student' + (context.parsed.y !== 1 ? 's' : '');
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 174, 237, 0.08)',
                drawTicks: false,
              },
              ticks: {
                stepSize: 1,
                font: { size: 10, weight: '500' },
                color: '#9CA3AF',
                padding: 8,
              },
              border: {
                display: false
              },
              title: {
                display: true,
                text: 'Student Count',
                color: '#9CA3AF',
                font: { size: 9, weight: '500' },
                padding: { bottom: 10 }
              }
            },
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: { size: 10, weight: '500' },
                color: '#6B7280',
                padding: 8,
                maxRotation: 25,
                minRotation: 20
              },
              border: {
                display: false
              }
            }
          },
          layout: {
            padding: {
              top: 10,
              bottom: 10,
              left: 5,
              right: 5
            }
          },
          hover: {
            mode: 'index',
            intersect: false,
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, data, fullLabels]);

  if (!labels || labels.length === 0) {
    return <div className="h-full flex items-center justify-center text-xs text-gray-400">No data available</div>;
  }

  return <canvas ref={chartRef} />;
};

export default BatchStudentChart;
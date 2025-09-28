'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { LinearProgress, Chip, Alert, Button } from '@mui/material';
import {
  analyzeBundle,
  formatSize,
  shouldOptimizeBundle,
  generatePerformanceReport,
} from '@/shared/lib/performance/bundleAnalyzer';

/**
 * Компонент для отображения анализа производительности
 */
const PerformanceReport: React.FC = () => {
  const [analysis] = useState(analyzeBundle());
  const [showReport, setShowReport] = useState(false);

  const needsOptimization = shouldOptimizeBundle(analysis.totalSize);

  const getSizeColor = (size: number, maxSize: number) => {
    const percentage = (size / maxSize) * 100;
    if (percentage > 80) return 'error';
    if (percentage > 60) return 'warning';
    return 'success';
  };

  const getOptimizationStatus = () => {
    if (needsOptimization) {
      return <Chip label="Требуется оптимизация" color="error" />;
    }
    return <Chip label="Оптимизировано" color="success" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <Typography
            variant="h5"
            component="h2"
            className="flex items-center justify-between"
          >
            📊 Bundle Analysis
            {getOptimizationStatus()}
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatSize(analysis.totalSize)}
              </div>
              <div className="text-sm text-gray-600">Общий размер</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatSize(analysis.jsSize)}
              </div>
              <div className="text-sm text-gray-600">JavaScript</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatSize(analysis.cssSize)}
              </div>
              <div className="text-sm text-gray-600">CSS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatSize(analysis.imageSize)}
              </div>
              <div className="text-sm text-gray-600">Изображения</div>
            </div>
          </div>

          {needsOptimization && (
            <Alert severity="warning" className="mb-4">
              Размер bundle превышает рекомендуемый (2MB). Рекомендуется
              оптимизация.
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🎯 Самые большие chunks:</h3>
            {analysis.largestChunks.map((chunk, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{chunk.name}</span>
                  <span className="text-sm text-gray-600">
                    {formatSize(chunk.size)} ({chunk.percentage}%)
                  </span>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={chunk.percentage}
                  color={getSizeColor(chunk.size, analysis.totalSize)}
                  className="h-2"
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              variant="outlined"
              onClick={() => setShowReport(!showReport)}
              className="mb-4"
            >
              {showReport ? 'Скрыть' : 'Показать'} подробный отчет
            </Button>

            {showReport && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {generatePerformanceReport()}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Typography variant="h5" component="h2">
            💡 Рекомендации по оптимизации
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceReport;

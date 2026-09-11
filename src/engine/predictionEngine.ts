import { CoverageQuality, DeviceTelemetry } from '../types';

export class PredictionEngine {
  /**
   * Predict failure probability (0-1) and lead time in hours (48-72h horizon)
   * Fuses multi-sensor telemetry with CAMARA network intelligence
   */
  public predictFailureProbability(
    telemetry: DeviceTelemetry,
    batteryTrend: number,
    tempTrend: number,
    vibrationTrend: number,
    congestionPercent: number,
    coverageQuality: CoverageQuality
  ): {
    failureProbability: number;
    predictedHoursUntilFailure: number;
    confidence: number;
    contributingFactors: string[];
    factorScores: {
      batteryScore: number;
      tempScore: number;
      vibrationScore: number;
      signalScore: number;
      congestionPenalty: number;
      coveragePenalty: number;
      trendPenalty: number;
    };
  } {
    // 1. Base score from device health (0.0 to 1.0)
    const batteryScore = Math.max(0, Math.min(1, telemetry.battery_percent / 100));
    const tempScore = Math.max(0, Math.min(1, 1 - (telemetry.cpu_temp_celsius - 30) / 50));
    const vibrationScore = Math.max(0, Math.min(1, 1 - (telemetry.vibration_mms / 10)));
    const signalScore = Math.max(0, Math.min(1, (telemetry.signal_strength_dbm + 120) / 90));

    // 2. Trend penalties (rate of change per cycle/hour)
    const batteryPenalty = Math.max(0, -batteryTrend * 5.0);
    const tempPenalty = Math.max(0, tempTrend * 5.0);
    const vibPenalty = Math.max(0, vibrationTrend * 4.0);
    const totalTrendPenalty = batteryPenalty + tempPenalty + vibPenalty;

    // 3. CAMARA Network Risk (authoritative network intelligence)
    // High tower congestion (> 80%) impedes heartbeat telemetry and increases latency
    const congestionPenalty = (congestionPercent / 100) * 0.12;

    // Weak cellular coverage risks dropping offline into silent failure
    const coveragePenaltyMap: Record<CoverageQuality, number> = {
      excellent: 0.0,
      good: 0.05,
      fair: 0.15,
      poor: 0.25,
    };
    const coveragePenalty = coveragePenaltyMap[coverageQuality] || 0.05;

    // 4. Fusion
    const healthScore = (batteryScore + tempScore + vibrationScore + signalScore) / 4;
    const penaltyScore = totalTrendPenalty + congestionPenalty + coveragePenalty;

    let failureProb = Math.max(0, Math.min(0.99, (1 - healthScore) + penaltyScore));
    failureProb = +failureProb.toFixed(3);

    // 5. Predicted hours until catastrophic failure (48-72h predictive horizon)
    let predictedHours = 999;
    if (failureProb > 0.5) {
      if (batteryTrend < -0.05) {
        const hoursUntilEmpty = telemetry.battery_percent / (-batteryTrend * 10);
        predictedHours = Math.min(72, Math.max(12, hoursUntilEmpty * 0.85));
      } else {
        // Calculate based on probability curve
        // 0.5 -> 72h, 0.99 -> 16h
        predictedHours = 72 - (failureProb - 0.5) * 110;
        predictedHours = Math.max(14, Math.min(72, predictedHours));
      }
      predictedHours = +predictedHours.toFixed(1);
    }

    // 6. Confidence level
    const confidence = +Math.min(0.98, Math.max(0.65, failureProb * 1.18)).toFixed(2);

    // 7. Extract contributing factors
    const contributingFactors: string[] = [];
    if (telemetry.battery_percent < 25) contributingFactors.push(`Critical low battery (${telemetry.battery_percent}%)`);
    if (telemetry.cpu_temp_celsius > 62) contributingFactors.push(`Thermal runaway risk (${telemetry.cpu_temp_celsius}°C)`);
    if (telemetry.vibration_mms > 5.5) contributingFactors.push(`Abnormal mechanical vibration (${telemetry.vibration_mms} mm/s)`);
    if (congestionPercent > 80) contributingFactors.push(`CAMARA Tower Congestion (${congestionPercent}%)`);
    if (coverageQuality === 'fair' || coverageQuality === 'poor') contributingFactors.push(`CAMARA Low RF Coverage (${coverageQuality})`);
    if (batteryTrend < -0.1) contributingFactors.push(`Rapid battery discharge trend (${batteryTrend}/h)`);
    if (tempTrend > 0.15) contributingFactors.push(`Accelerating heat slope (+${tempTrend}°C/h)`);

    if (contributingFactors.length === 0) {
      contributingFactors.push('Nominal operating parameters');
    }

    return {
      failureProbability: failureProb,
      predictedHoursUntilFailure: predictedHours,
      confidence,
      contributingFactors,
      factorScores: {
        batteryScore: +batteryScore.toFixed(2),
        tempScore: +tempScore.toFixed(2),
        vibrationScore: +vibrationScore.toFixed(2),
        signalScore: +signalScore.toFixed(2),
        congestionPenalty: +congestionPenalty.toFixed(2),
        coveragePenalty: +coveragePenalty.toFixed(2),
        trendPenalty: +totalTrendPenalty.toFixed(2),
      },
    };
  }
}

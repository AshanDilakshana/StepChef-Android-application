import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { minutesToSeconds } from '../utils/timeUtils';

type TimerProps = {
  duration: number; // in minutes
  isActive: boolean;
  onComplete: () => void;
};

const Timer = ({ duration, isActive, onComplete }: TimerProps) => {
  const totalSeconds = minutesToSeconds(duration);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(totalSeconds);
    progressAnim.setValue(1);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          const pct = next / totalSeconds;
          Animated.timing(progressAnim, {
            toValue: pct,
            duration: 900,
            useNativeDriver: false,
          }).start();
          if (next <= 0) {
            clearInterval(intervalRef.current!);
            onComplete();
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const barColor = progressAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: ['#EF4444', '#F97316', '#22C55E'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: barColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  time: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 2,
    marginBottom: 10,
    fontVariant: ['tabular-nums'],
  },
  barBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 99,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 99,
  },
});

export default Timer;
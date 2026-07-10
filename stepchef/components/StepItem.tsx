import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Step } from '../utils/types';
import { formatDuration } from '../utils/timeUtils';
import Timer from './Timer';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type StepItemProps = {
  step: Step;
  index: number;
  readOnly?: boolean;
  isActive?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
};

const StepItem = ({
  step,
  index,
  readOnly = false,
  isActive = false,
  onStart,
  onPause,
  onComplete,
}: StepItemProps) => {
  const [expanded, setExpanded] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(true);
    }
  }, [isActive]);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(v => !v);
  };

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      {/* Header Row */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.titleRow} onPress={toggle} activeOpacity={0.7}>
          <View style={[styles.badge, isActive && styles.badgeActive]}>
            <Text style={styles.badgeText}>{index + 1}</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {step.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          {!readOnly && (
            <TouchableOpacity
              style={[styles.playBtn, isActive && styles.pauseBtn]}
              onPress={isActive ? onPause : onStart}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isActive ? 'pause' : 'play'}
                size={16}
                color="#fff"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggle} style={styles.chevron} activeOpacity={0.7}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.body}>
          {isActive && (
            <View style={styles.timerBox}>
              <Timer
                duration={step.duration}
                isActive={isActive}
                onComplete={onComplete ?? (() => {})}
              />
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Ingredients</Text>
            <Text style={styles.infoValue}>{step.ingredients || '—'}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="scale-outline" size={13} color="#F97316" />
              <Text style={styles.metaText}>
                {step.quantity || 1} {step.scale}
              </Text>
            </View>
            {step.duration > 0 && (
              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={13} color="#F97316" />
                <Text style={styles.metaText}>{formatDuration(step.duration)}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardActive: {
    borderColor: '#F97316',
    shadowColor: '#F97316',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeActive: { backgroundColor: '#EA580C' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  title: { fontSize: 15, fontWeight: '600', color: '#1F2937', flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseBtn: { backgroundColor: '#EA580C' },
  chevron: { padding: 4 },
  body: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, gap: 10 },
  timerBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#F97316', marginBottom: 4 },
  infoValue: { fontSize: 14, color: '#374151', lineHeight: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  metaText: { fontSize: 13, color: '#9A3412', fontWeight: '500' },
});

export default StepItem;
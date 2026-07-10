import React from 'react';
import { View, StyleSheet } from 'react-native';
import StepItem from './StepItem';
import { Step } from '../utils/types';

type StepListProps = {
  steps: Step[];
  readOnly?: boolean;
  activeStepId?: string;
  onStepStart?: (stepId: string) => void;
  onStepPause?: (stepId: string) => void;
  onStepComplete?: () => void;
};

const StepList = ({
  steps,
  readOnly = false,
  activeStepId,
  onStepStart,
  onStepPause,
  onStepComplete,
}: StepListProps) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <StepItem
          key={step.id}
          step={step}
          index={index}
          readOnly={readOnly}
          isActive={activeStepId === step.id}
          onStart={onStepStart ? () => onStepStart(step.id) : undefined}
          onPause={onStepPause ? () => onStepPause(step.id) : undefined}
          onComplete={onStepComplete}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 0 },
});

export default StepList;
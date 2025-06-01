import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import LottieView from 'lottie-react-native';

export enum BenchmarkStatus {
  COMPLETED = 'completed',
  EXECUTING = 'executing',
  FAILED = 'failed',
  INDISPONIBLE = 'indisponible',
  LOADING = 'loading',
  READY = 'ready',
  SAVING = 'saving',
}

const localStatusDescriptions = {
  [BenchmarkStatus.LOADING]: 'Iniciando Modelo ...',
  [BenchmarkStatus.READY]: 'Pronto para Executar',
  [BenchmarkStatus.INDISPONIBLE]: 'Falha ao Iniciar Modelo',
  [BenchmarkStatus.EXECUTING]: 'Executando',
  [BenchmarkStatus.SAVING]: 'Salvando Benchmark',
  [BenchmarkStatus.COMPLETED]: 'Concluído',
  [BenchmarkStatus.FAILED]: 'Ocorreu uma Falha',
};

const backendStatusDescriptions = {
  [BenchmarkStatus.LOADING]: 'Verificando Servidor',
  [BenchmarkStatus.READY]: 'Pronto para Executar',
  [BenchmarkStatus.INDISPONIBLE]: 'Falha na Comunicação com Servidor',
  [BenchmarkStatus.EXECUTING]: 'Executando',
  [BenchmarkStatus.SAVING]: 'Salvando Benchmark',
  [BenchmarkStatus.COMPLETED]: 'Concluído',
  [BenchmarkStatus.FAILED]: 'Ocorreu uma Falha',
};

interface BenchmarkCardProps {
  type: 'local' | 'backend';
  status: BenchmarkStatus;
  currentStep: number;
  stepsTotal: number;
  onButtonPress: () => void;
}

const BenchmarkCard = ({
  type,
  status,
  currentStep,
  stepsTotal,
  onButtonPress,
}: BenchmarkCardProps) => {
  const isLocalBenchmark = type === 'local';

  const isExecuting = status === BenchmarkStatus.EXECUTING;

  const primaryColor = isLocalBenchmark ? '#1f940f' : '#2c64e7';
  const secondaryColor = isLocalBenchmark ? '#5ab94d' : '#6895ff';
  const backgroundColor = isLocalBenchmark ? '#b7e0b5' : '#adc5fc';

  const title = isLocalBenchmark
    ? 'Processamento Local'
    : 'Processamento Backend';

  const statusDescription = isLocalBenchmark
    ? localStatusDescriptions[status]
    : backendStatusDescriptions[status];

  const showStepsDetails = [
    BenchmarkStatus.EXECUTING,
    BenchmarkStatus.COMPLETED,
  ].includes(status);
  const stepsDetails = '(' + currentStep + ' de ' + stepsTotal + ')';

  const isButtonEnabled = [
    BenchmarkStatus.READY,
    BenchmarkStatus.COMPLETED,
    BenchmarkStatus.FAILED,
  ].includes(status);

  return (
    <View style={[styles.cardContainer, {backgroundColor}]}>
      <View style={styles.cardDetailsWrapper}>
        <Text style={[styles.cardTitle, {color: primaryColor}]}>{title}</Text>
        <Text>
          Status: {statusDescription} {showStepsDetails && stepsDetails}
        </Text>

        <Pressable
          disabled={!isButtonEnabled}
          onPress={onButtonPress}
          style={[
            styles.buttonContainer,
            {backgroundColor: isButtonEnabled ? primaryColor : secondaryColor},
          ]}>
          <Text style={styles.buttonText}>Executar</Text>
        </Pressable>
      </View>
      <View style={styles.cardInfoWrapper}>
        <LottieView
          autoPlay
          source={require('../assets/lotties/processing.json')}
          style={styles.cardLottieAnimation}
          speed={isExecuting ? 1.5 : 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 8,
  },
  cardDetailsWrapper: {
    flex: 3,
    paddingBlock: 12,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingInline: 10,
    paddingBlock: 4,
    borderRadius: 8,
    gap: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardInfoWrapper: {
    alignItems: 'center',
  },
  cardLottieAnimation: {
    height: 76,
    width: 76,
  },
});

export default BenchmarkCard;

import React, {useCallback, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {SafeAreaView} from 'react-native-safe-area-context';

import useBenchmark from '../hooks/useBenchmark';
import usePredictModel from '../hooks/usePredictModel';
import useTestDataset from '../hooks/useTestDataset';

import {BenchmarkRecord, ExecutionEnvironment} from '../services/benchmark';
import {getImageInference} from '../services/predict';
import {saveStorageBenchmark} from '../utils/storage';

import BenchmarkCard, {BenchmarkStatus} from '../components/BenchmarkCard';
import {setBaseUrl} from '../constants/api';
import {memory, model, os} from '../constants/device';

const EXECUTION_TESTS_NUMBER = 35000;

const Benchmark = () => {
  const {isLoaded, getImageUri} = useTestDataset();
  const {getLocalImageInference, state} = usePredictModel();
  const {benchmarks, isSyncing, updateStatus, updateStep, triggerSync} =
    useBenchmark();

  const onModelStatusChange = useCallback(() => {
    if (isLoaded && state === 'loaded') {
      updateStatus('local', BenchmarkStatus.READY);
    }
    if (state === 'error') {
      updateStatus('local', BenchmarkStatus.INDISPONIBLE);
    }
  }, [isLoaded, state]);

  const handleTestExecution = async (environment: ExecutionEnvironment) => {
    const benchmarkRecords: BenchmarkRecord[] = [];
    const isLocalBenchmark = environment === 'local';

    activateKeepAwake();

    updateStatus(environment, BenchmarkStatus.EXECUTING);
    updateStep(environment, 0);

    const handleImageInference = isLocalBenchmark
      ? getLocalImageInference
      : getImageInference;

    try {
      for (let i = 1; i <= EXECUTION_TESTS_NUMBER; i++) {
        const imgId = Math.floor(Math.random() * 112) + 1;
      const imgUri = getImageUri(imgId);

      const fileName = imgUri.split('/').pop()!;

      const initialBattery = (await DeviceInfo.getBatteryLevel()).toFixed(2);

      const startTimestamp = Date.now();
      const detectedObjects = await handleImageInference(imgUri);
      const endTimestamp = Date.now();

      const finalBattery = (await DeviceInfo.getBatteryLevel()).toFixed(2);

      const elapsedTime = endTimestamp - startTimestamp;

        updateStep(environment, i);

        const record = {
          fileName,
          detectedObjects,
          initialBattery,
          finalBattery,
          startTimestamp,
          endTimestamp,
          elapsedTime,
        };
        benchmarkRecords.push(record);
      }

      updateStatus(environment, BenchmarkStatus.SAVING);

      await saveStorageBenchmark(benchmarkRecords, environment);
      await triggerSync();

      updateStatus(environment, BenchmarkStatus.COMPLETED);
    } catch (err) {
      updateStatus(environment, BenchmarkStatus.FAILED);
    }

    deactivateKeepAwake();
  };

  useEffect(onModelStatusChange, [onModelStatusChange]);

  return (
    <SafeAreaView style={styles.screenWrapper}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>YumLensAI Benchmark</Text>
        {isSyncing && <Text style={styles.headerSync}>Syncing ...</Text>}
      </View>

      <View style={styles.deviceInfoSection}>
        <Text style={styles.sectionTitle}>Informações do Dispositivo</Text>
        <View style={styles.deviceInfoTable}>
          <View style={styles.deviceInfoLine}>
            <Text>Modelo do Dispositivo</Text>
            <Text>{model}</Text>
          </View>
          <View style={styles.deviceInfoLine}>
            <Text>Sistema Operacional</Text>
            <Text>{os}</Text>
          </View>
          <View style={styles.deviceInfoLine}>
            <Text>Memória RAM</Text>
            <Text>{memory}</Text>
          </View>
          <View style={styles.deviceInfoLine}>
            <Text>Endereço IP do Backend</Text>
            <TextInput
              placeholder="192.168.0.1"
              placeholderTextColor="blue"
              cursorColor="orangered"
              onEndEditing={event => {
                setBaseUrl(event.nativeEvent.text);
                triggerSync();
              }}
              style={styles.deviceInfoLineInput}
            />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Benchmark</Text>
        <BenchmarkCard
          type="local"
          status={benchmarks.local.status}
          currentStep={benchmarks.local.step}
          stepsTotal={EXECUTION_TESTS_NUMBER}
          onButtonPress={() => handleTestExecution('local')}
        />
        <BenchmarkCard
          type="backend"
          status={benchmarks.backend.status}
          currentStep={benchmarks.backend.step}
          stepsTotal={EXECUTION_TESTS_NUMBER}
          onButtonPress={() => handleTestExecution('backend')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBlock: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#200a5e',
  },
  headerSync: {
    fontSize: 12,
    color: 'green',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  deviceInfoSection: {
    marginBottom: 12,
  },
  deviceInfoTable: {
    gap: 12,
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#ffe2d0',
  },
  deviceInfoLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceInfoLineInput: {
    padding: 0,
    color: 'black',
  },
});

export default Benchmark;

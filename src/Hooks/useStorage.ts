import MMKVStorage, { useMMKVStorage } from 'react-native-mmkv-storage';

const MMKV = new MMKVStorage.Loader().initialize();

type StorageKeys = 'theme' | 'colour';
type DispatchStorage<T> = [T, (value: T | ((prevValue: T) => T)) => void];

const useStorage = <T>(key: StorageKeys, defaultValue: T): DispatchStorage<T> => {
	const [value, setValue] = useMMKVStorage(key, MMKV, defaultValue);
	return [value, setValue];
};

export default useStorage;

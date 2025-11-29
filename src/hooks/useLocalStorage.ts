import { useEffect, useState } from "react";

type UseLocalStorageOptions<T> = {
  key: string;
  initialValue: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
};

const defaultSerializer = <T>(value: T): string => JSON.stringify(value);
const defaultDeserializer = <T>(value: string): T => JSON.parse(value) as T;

export const useLocalStorage = <T>({
  key,
  initialValue,
  serializer = defaultSerializer,
  deserializer = defaultDeserializer,
}: UseLocalStorageOptions<T>) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, serializer(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(deserializer(event.newValue));
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, deserializer]);

  return [storedValue, setValue] as const;
};

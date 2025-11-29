import { useEffect, useRef, useState, useCallback } from "react";

type UseSocketOptions = {
  url: string;
  onMessage?: (event: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnect?: boolean;
};

type SocketState = "connecting" | "open" | "closed" | "error";

export const useSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnect = true,
}: UseSocketOptions) => {
  const [socketState, setSocketState] = useState<SocketState>("connecting");
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(reconnect);
  // const connectRef = useRef<(() => void) | null>(null);

  const connect = () => {
    console.log("connect useCallback");
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setSocketState("connecting");
      const ws = new WebSocket(url);

      ws.onopen = (event) => {
        setSocketState("open");
        reconnectAttemptsRef.current = 0;
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        setLastMessage(event);
        onMessage?.(event);
      };

      ws.onclose = (event) => {
        setSocketState("closed");
        onClose?.(event);

        // if (shouldReconnectRef.current && reconnectAttemptsRef.current < reconnectAttempts) {
        //   reconnectAttemptsRef.current += 1;
        //   // Exponential backoff: delay = initialDelay * (2 ^ (attempt - 1))
        //   const delay = initialReconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);
        //   console.log("Reconnecting in", delay, "ms");
        //   reconnectTimeoutRef.current = setTimeout(() => {
        //     connectRef.current?.();
        //   }, delay);
        // }
      };

      ws.onerror = (event) => {
        setSocketState("error");
        onError?.(event);
      };

      socketRef.current = ws;
    } catch (error) {
      setSocketState("error");
      console.error("WebSocket connection error:", error);
    }
  };

  // Store connect function in ref so it can be called from within the closure
  // useEffect(() => {
  //   connectRef.current = connect;
  // }, [connect]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setSocketState("closed");
  }, []);

  const sendMessage = useCallback((data: string | ArrayBuffer | Blob) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    socketState,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    isConnected: socketState === "open",
  };
};

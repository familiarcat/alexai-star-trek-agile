// Socket Manager for AlexAI - Handles websocket connections gracefully
// Ships Computer socket coordination protocols

export class SocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3; // Reduced from default to prevent spam
  private reconnectDelay = 5000; // 5 seconds
  private isIntentionallyDisconnected = false;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Don't try to connect if we're in fallback mode or already connected
        if (this.isInFallbackMode() || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
          resolve();
          return;
        }

        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('🔗 Socket connected to Ships Computer');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.emit(data.type || 'message', data);
          } catch (error) {
            console.warn('⚠️ Failed to parse socket message:', error);
          }
        };

        this.socket.onclose = (event) => {
          if (!this.isIntentionallyDisconnected && this.reconnectAttempts < this.maxReconnectAttempts) {
            console.log(`🔄 Socket disconnected, attempting reconnect ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`);
            this.scheduleReconnect();
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('🚫 Max reconnection attempts reached, switching to fallback mode');
            this.emit('max_reconnection_attempts', { message: 'Switched to offline mode' });
          }
        };

        this.socket.onerror = (error) => {
          console.warn('⚠️ Socket error:', error);
          reject(error);
        };

        // Connection timeout
        setTimeout(() => {
          if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            console.log('🕒 Socket connection timeout, using fallback mode');
            this.socket.close();
            resolve(); // Resolve anyway to continue with fallback
          }
        }, 3000);

      } catch (error) {
        console.warn('⚠️ Socket connection failed, using fallback mode:', error);
        resolve(); // Still resolve to allow fallback operation
      }
    });
  }

  private scheduleReconnect(): void {
    setTimeout(() => {
      if (!this.isIntentionallyDisconnected) {
        this.reconnectAttempts++;
        this.connect().catch(() => {
          console.warn('🔄 Reconnection attempt failed');
        });
      }
    }, this.reconnectDelay);
  }

  private isInFallbackMode(): boolean {
    // Check if we should use fallback mode (no socket connection needed)
    return process.env.NODE_ENV === 'development' || 
           process.env.NEXT_PUBLIC_APP_ENV === 'local' ||
           !this.url.includes('wss://');
  }

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.log('📡 Socket not connected, message queued for fallback processing');
      // In a real implementation, you might queue messages here
      this.emit('fallback_send', data);
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.warn('⚠️ Error in socket event listener:', error);
        }
      });
    }
  }

  disconnect(): void {
    this.isIntentionallyDisconnected = true;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  getStatus(): 'connected' | 'connecting' | 'disconnected' | 'fallback' {
    if (this.isInFallbackMode()) return 'fallback';
    if (!this.socket) return 'disconnected';
    
    switch (this.socket.readyState) {
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CONNECTING: return 'connecting';
      default: return 'disconnected';
    }
  }
}

// Ships Computer Socket Manager - Singleton instance
export const shipsComputerSocket = new SocketManager(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001/socket'
);

// Auto-initialize with graceful fallback
if (typeof window !== 'undefined') {
  shipsComputerSocket.connect().catch(() => {
    console.log('🖥️ Ships Computer operating in offline mode');
  });
}

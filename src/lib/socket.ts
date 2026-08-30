import { io, type Socket } from 'socket.io-client';
import type { Delivery } from '../app/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL && process.env.NEXT_PUBLIC_SOCKET_URL !== 'http://localhost:5000'
  ? process.env.NEXT_PUBLIC_SOCKET_URL
  : '';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): Socket | null {
    if (!SOCKET_URL) {
      console.info('📡 Socket not configured; live delivery updates are disabled.');
      return null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('🟢 Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToRetailerDeliveries(
    retailerId: string,
    callback: (delivery: Delivery) => void
  ) {
    if (!this.socket) return;

    this.socket.emit('subscribe-retailer', retailerId);
    this.socket.on('delivery-update', callback);
    console.log(`📡 Subscribed to retailer ${retailerId} updates`);
  }

  unsubscribe() {
    if (this.socket) {
      this.socket.off('delivery-update');
      console.log('📡 Unsubscribed from updates');
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
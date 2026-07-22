export interface Booking {
  id: string;
  name: string;
  contact: string;
  service: '입주청소' | '이사청소';
  address: string;
  houseSize: number; // in pyeong (평)
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:MM
  notes?: string;
  status: '예약대기' | '예약완료' | '진행중' | '완료' | '취소';
  adminMemo?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

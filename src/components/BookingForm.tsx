import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { Clipboard, Calendar, Clock, Home, BadgeCheck, Loader2 } from 'lucide-react';

interface BookingFormProps {
  onSuccess: (bookingId: string) => void;
  initialService?: '입주청소' | '이사청소';
}

export default function BookingForm({ onSuccess, initialService = '입주청소' }: BookingFormProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [service, setService] = useState<'입주청소' | '이사청소'>(initialService);
  const [address, setAddress] = useState('');
  const [houseSize, setHouseSize] = useState<number>(24); // default 24 pyeong
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Rate calculation
  const getRatePerPyeong = () => {
    return service === '입주청소' ? 12000 : 13000;
  };
  const estimatedPrice = houseSize * getRatePerPyeong();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Client-side validations
    if (!name.trim()) {
      setErrorMsg('이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }
    const cleanContact = contact.replace(/[^0-9-]/g, '');
    if (cleanContact.length < 9) {
      setErrorMsg('올바른 연락처를 입력해주세요.');
      setIsLoading(false);
      return;
    }
    if (address.trim().length < 5) {
      setErrorMsg('상세 주소를 입력해주세요 (최소 5자).');
      setIsLoading(false);
      return;
    }
    if (!preferredDate) {
      setErrorMsg('희망 날짜를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create document reference with a new auto-generated ID
      const bookingsColRef = collection(db, 'bookings');
      const newDocRef = doc(bookingsColRef);
      const bookingId = newDocRef.id;

      const user = auth.currentUser;
      const timestamp = new Date().toISOString();

      // Create payload adhering strictly to the firebase-blueprint schema
      const bookingPayload = {
        name: name.trim(),
        contact: cleanContact,
        service,
        address: address.trim(),
        houseSize,
        preferredDate,
        preferredTime,
        notes: notes.trim(),
        status: '예약대기',
        adminMemo: '',
        createdAt: timestamp,
        updatedAt: timestamp,
        ...(user ? { userId: user.uid } : {})
      };

      // 2. Write document to Firestore
      await setDoc(newDocRef, bookingPayload);

      // Trigger success callback
      onSuccess(bookingId);
    } catch (err) {
      console.error('Error saving booking:', err);
      setErrorMsg('예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      try {
        handleFirestoreError(err, OperationType.WRITE, 'bookings');
      } catch (e) {
        // Log is handled
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="booking-form-card" className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Form Header */}
      <div className="bg-slate-900 px-6 py-8 text-white relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full blur-2xl"></div>
        <h3 className="text-xl font-bold">실시간 청소 예약 신청</h3>
        <p className="text-slate-400 text-xs mt-1">
          간단한 입력만으로 예약을 진행할 수 있습니다. 작성 후 예약 완료 시 상세 상담이 진행됩니다.
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {errorMsg}
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">고객명 *</label>
          <input
            id="input-name"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">연락처 *</label>
          <input
            id="input-contact"
            type="tel"
            placeholder="010-1234-5678"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Service Toggle */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">서비스 구분 *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              id="btn-service-movein"
              type="button"
              onClick={() => setService('입주청소')}
              className={`py-2 px-4 rounded-lg font-medium text-sm border transition-all flex items-center justify-center gap-1.5 ${
                service === '입주청소'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              입주청소
            </button>
            <button
              id="btn-service-moveout"
              type="button"
              onClick={() => setService('이사청소')}
              className={`py-2 px-4 rounded-lg font-medium text-sm border transition-all flex items-center justify-center gap-1.5 ${
                service === '이사청소'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clipboard className="w-4 h-4" />
              이사청소
            </button>
          </div>
        </div>

        {/* House Size & Live Price Estimate */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-semibold text-slate-700">평수 (Size) *</label>
            <span className="text-xs text-slate-500">{houseSize}평 (약 {Math.round(houseSize * 3.3)}㎡)</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              id="input-size-slider"
              type="range"
              min="10"
              max="100"
              step="1"
              value={houseSize}
              onChange={(e) => setHouseSize(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <input
              id="input-size-number"
              type="number"
              min="10"
              max="100"
              value={houseSize}
              onChange={(e) => setHouseSize(Math.max(10, Math.min(100, Number(e.target.value))))}
              className="w-16 px-2 py-1 text-center text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">청소 주소 *</label>
          <input
            id="input-address"
            type="text"
            placeholder="상세 주소를 입력하세요 (동, 호수 포함)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">희망 날짜 *</label>
            <div className="relative">
              <input
                id="input-date"
                type="date"
                value={preferredDate}
                min={new Date().toISOString().split('T')[0]} // Prevents selecting past dates
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="w-full pl-3 pr-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">희망 시간 *</label>
            <select
              id="input-time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="08:00">08:00 (오전)</option>
              <option value="09:00">09:00 (오전)</option>
              <option value="10:00">10:00 (오전)</option>
              <option value="11:00">11:00 (오전)</option>
              <option value="13:00">13:00 (오후)</option>
              <option value="14:00">14:00 (오후)</option>
              <option value="15:00">15:00 (오후)</option>
              <option value="16:00">16:00 (오후)</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">추가 요청사항 (선택)</label>
          <textarea
            id="input-notes"
            rows={3}
            placeholder="반려동물 여부, 붙박이장 추가 등 특이사항을 적어주세요."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          ></textarea>
        </div>

        {/* Live Estimate Cost Alert */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">실시간 예상 견적</p>
            <p className="text-xs text-slate-400 mt-0.5">평당 단가: {getRatePerPyeong().toLocaleString()}원</p>
          </div>
          <p className="text-xl font-extrabold text-blue-600">
            {estimatedPrice.toLocaleString()}원
          </p>
        </div>

        {/* Submit button */}
        <button
          id="btn-submit-booking"
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              예약 신청 중...
            </>
          ) : (
            <>
              <BadgeCheck className="w-5 h-5" />
              예약 완료하기
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-400 leading-normal">
          예약 신청 직후에는 비용 결제가 발생하지 않습니다.<br />
          청소 담당 매니저가 직접 전화를 드린 후, 견적 확정 및 예약 일정이 완료됩니다.
        </p>
      </form>
    </div>
  );
}

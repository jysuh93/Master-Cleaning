import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Booking } from '../types';
import { 
  Search, Calendar as CalendarIcon, Edit3, Trash2, CheckCircle, 
  XCircle, FileSpreadsheet, Send, MessageSquare, List, RefreshCw, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form State for Editing
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editService, setEditService] = useState<'입주청소' | '이사청소'>('입주청소');
  const [editAddress, setEditAddress] = useState('');
  const [editSize, setEditSize] = useState<number>(24);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState<Booking['status']>('예약대기');
  const [editAdminMemo, setEditAdminMemo] = useState('');

  // 1. Listen for real-time bookings from Firestore
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
      });
      setBookings(list);
    }, (error) => {
      setErrorMsg('데이터를 수신하는 도중 오류가 발생했습니다.');
      try {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      } catch (e) {
        // Logging completed
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter and search logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.contact.includes(searchQuery) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;
    const matchesDate = dateFilter === '' ? true : b.preferredDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Action: Trigger Editing Mode
  const startEditing = (b: Booking) => {
    setEditingBooking(b);
    setEditName(b.name);
    setEditContact(b.contact);
    setEditService(b.service);
    setEditAddress(b.address);
    setEditSize(b.houseSize);
    setEditDate(b.preferredDate);
    setEditTime(b.preferredTime);
    setEditStatus(b.status);
    setEditAdminMemo(b.adminMemo || '');
  };

  // Action: Save Booking Edits
  const saveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const docRef = doc(db, 'bookings', editingBooking.id);
      await updateDoc(docRef, {
        name: editName,
        contact: editContact,
        service: editService,
        address: editAddress,
        houseSize: editSize,
        preferredDate: editDate,
        preferredTime: editTime,
        status: editStatus,
        adminMemo: editAdminMemo,
        updatedAt: new Date().toISOString()
      });
      setEditingBooking(null);
    } catch (err) {
      console.error('Failed to update booking:', err);
      alert('예약 수정에 실패했습니다.');
    }
  };

  // Action: Quick Status Update
  const updateStatus = async (id: string, newStatus: Booking['status']) => {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  // Action: Cancel Booking
  const cancelBooking = async (id: string) => {
    if (confirm('이 예약을 취소 상태로 변경하시겠습니까?')) {
      await updateStatus(id, '취소');
    }
  };

  // Action: Delete Booking
  const deleteBooking = async (id: string) => {
    if (confirm('이 예약 데이터를 완전히 삭제하시겠습니까? 되돌릴 수 없습니다.')) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch (err) {
        console.error('Failed to delete booking:', err);
        alert('삭제 권한이 없거나 오류가 발생했습니다.');
      }
    }
  };

  // Action: Download Excel (CSV Format)
  const downloadCSV = () => {
    if (bookings.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    const headers = ['예약번호', '고객명', '연락처', '서비스', '평수', '주소', '예약날짜', '예약시간', '상태', '고객요청', '관리자메모', '생성일'];
    const rows = bookings.map(b => [
      b.id,
      b.name,
      b.contact,
      b.service,
      `${b.houseSize}평`,
      `"${b.address.replace(/"/g, '""')}"`,
      b.preferredDate,
      b.preferredTime,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${(b.adminMemo || '').replace(/"/g, '""')}"`,
      b.createdAt
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Master_Cleaning_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Action: Simulate sending SMS
  const sendSimulatedSMS = (b: Booking) => {
    setSmsStatus(b.id);
    setTimeout(() => {
      alert(`[SMS 발송 성공]
수신인: ${b.name} (${b.contact})
내용: "안녕하세요, Master Cleaning입니다. 신청해주신 ${b.preferredDate} ${b.preferredTime} [${b.service}]의 예약 상태가 [${b.status}]로 처리되었습니다. 감사합니다."`);
      setSmsStatus(null);
    }, 800);
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Padding for starting day of the week
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.preferredDate === dateStr);
  };

  return (
    <div id="admin-dashboard-container" className="space-y-6">
      {/* Top Header metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <p className="text-xs text-slate-500 font-medium">전체 예약</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{bookings.length}건</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <p className="text-xs text-yellow-600 font-medium">예약 대기</p>
          <p className="text-2xl font-extrabold text-yellow-500 mt-2">
            {bookings.filter(b => b.status === '예약대기').length}건
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <p className="text-xs text-blue-600 font-medium">예약 완료</p>
          <p className="text-2xl font-extrabold text-blue-500 mt-2">
            {bookings.filter(b => b.status === '예약완료').length}건
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <p className="text-xs text-emerald-600 font-medium">진행 / 완료</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-2">
            {bookings.filter(b => b.status === '진행중' || b.status === '완료').length}건
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1 flex flex-col justify-between">
          <p className="text-xs text-slate-500 font-medium">취소 건수</p>
          <p className="text-2xl font-extrabold text-slate-400 mt-2">
            {bookings.filter(b => b.status === '취소').length}건
          </p>
        </div>
      </div>

      {/* Control panel & Actions */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Searches & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search query */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="admin-search-input"
              type="text"
              placeholder="예약번호, 이름, 주소, 연락처 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status filter */}
          <select
            id="admin-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">모든 예약 상태</option>
            <option value="예약대기">예약대기</option>
            <option value="예약완료">예약완료</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
            <option value="취소">취소</option>
          </select>

          {/* Date Filter */}
          <input
            id="admin-date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {dateFilter && (
            <button
              id="admin-clear-date"
              onClick={() => setDateFilter('')}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              날짜 초기화
            </button>
          )}
        </div>

        {/* View mode toggle & excel */}
        <div className="flex items-center gap-3">
          <div className="border border-slate-200 rounded-lg p-0.5 flex bg-slate-50">
            <button
              id="btn-view-list"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              리스트 뷰
            </button>
            <button
              id="btn-view-calendar"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              캘린더 뷰
            </button>
          </div>

          <button
            id="btn-excel-download"
            onClick={downloadCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* Main Content Area: List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">예약번호 / 신청일</th>
                  <th className="py-3 px-4">고객 정보</th>
                  <th className="py-3 px-4">예약 상세</th>
                  <th className="py-3 px-4">희망 일정</th>
                  <th className="py-3 px-4">상태</th>
                  <th className="py-3 px-4 text-center">관리자 조치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      검색 조건에 부합하는 예약 내역이 존재하지 않습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* ID and CreatedAt */}
                      <td className="py-4 px-4">
                        <span className="text-xs font-mono font-bold text-slate-400">#{b.id.substring(0, 8)}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{b.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{b.contact}</div>
                      </td>

                      {/* Service Details */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                          b.service === '입주청소' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {b.service}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">{b.houseSize}평</div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{b.address}</div>
                        {b.notes && (
                          <div className="mt-1 text-xs text-slate-400 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                            요청: {b.notes}
                          </div>
                        )}
                        {b.adminMemo && (
                          <div className="mt-1 text-xs text-blue-600 bg-blue-50/50 p-1.5 rounded border border-blue-100">
                            메모: {b.adminMemo}
                          </div>
                        )}
                      </td>

                      {/* Scheduled Date & Time */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{b.preferredDate}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{b.preferredTime}</div>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === '예약대기' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          b.status === '예약완료' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          b.status === '진행중' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                          b.status === '완료' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Quick change buttons */}
                          {b.status === '예약대기' && (
                            <button
                              id={`btn-confirm-${b.id}`}
                              onClick={() => updateStatus(b.id, '예약완료')}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="예약 완료로 처리"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              확정
                            </button>
                          )}
                          {b.status === '예약완료' && (
                            <button
                              id={`btn-start-${b.id}`}
                              onClick={() => updateStatus(b.id, '진행중')}
                              className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="작업 진행 처리"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              시작
                            </button>
                          )}
                          {b.status === '진행중' && (
                            <button
                              id={`btn-complete-${b.id}`}
                              onClick={() => updateStatus(b.id, '완료')}
                              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="청소 완료 처리"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              완료
                            </button>
                          )}

                          {/* SMS Simulation */}
                          <button
                            id={`btn-sms-${b.id}`}
                            onClick={() => sendSimulatedSMS(b)}
                            className="text-slate-600 hover:text-blue-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                            title="SMS 알림 발송"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          {/* Edit Details */}
                          <button
                            id={`btn-edit-${b.id}`}
                            onClick={() => startEditing(b)}
                            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                            title="예약 수정"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Cancel (only if not already canceled/completed) */}
                          {b.status !== '완료' && b.status !== '취소' && (
                            <button
                              id={`btn-cancel-${b.id}`}
                              onClick={() => cancelBooking(b.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="예약 취소"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            id={`btn-delete-${b.id}`}
                            onClick={() => deleteBooking(b.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Content Area: Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-slate-900">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월 예약 현황
            </h4>
            <div className="flex items-center gap-2">
              <button
                id="btn-prev-month"
                onClick={() => changeMonth(-1)}
                className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium"
              >
                이전달
              </button>
              <button
                id="btn-today"
                onClick={() => setCurrentMonth(new Date())}
                className="px-2.5 py-1 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                오늘
              </button>
              <button
                id="btn-next-month"
                onClick={() => changeMonth(1)}
                className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium"
              >
                다음달
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((wd, idx) => (
              <div key={idx} className="text-center font-bold text-xs text-slate-400 uppercase tracking-wider py-2">
                {wd}
              </div>
            ))}
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-slate-50/50 rounded-lg h-28 border border-slate-100"></div>;
              }

              const dayBookings = getBookingsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div 
                  key={day.toISOString()} 
                  onClick={() => {
                    setDateFilter(day.toISOString().split('T')[0]);
                    setViewMode('list');
                  }}
                  className={`bg-white hover:bg-blue-50/30 rounded-lg p-2 h-28 border transition-all cursor-pointer flex flex-col justify-between ${
                    isToday ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-slate-200'
                  }`}
                >
                  <span className={`text-xs font-bold ${
                    isToday ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-slate-800'
                  }`}>
                    {day.getDate()}
                  </span>

                  {/* Booking tags in calendar day block */}
                  <div className="space-y-1 overflow-y-auto max-h-[70px] mt-1 scrollbar-none">
                    {dayBookings.slice(0, 3).map(db => (
                      <div 
                        key={db.id} 
                        className={`text-[9px] font-bold px-1 py-0.5 rounded truncate ${
                          db.status === '예약대기' ? 'bg-amber-100 text-amber-800' :
                          db.status === '예약완료' ? 'bg-blue-100 text-blue-800' :
                          db.status === '진행중' ? 'bg-cyan-100 text-cyan-800' :
                          db.status === '완료' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-500 line-through'
                        }`}
                      >
                        {db.name.substring(0, 2)} ({db.preferredTime})
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-[8px] text-center text-slate-400 font-bold">
                        +{dayBookings.length - 3}건 더 있음
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Editing Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold">예약 상세 편집 및 정보 수정</h3>
                <p className="text-slate-400 text-xs">예약번호: {editingBooking.id}</p>
              </div>
              <button 
                id="btn-close-modal"
                onClick={() => setEditingBooking(null)} 
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={saveEdits} className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">고객명</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">연락처</label>
                  <input
                    id="edit-contact"
                    type="text"
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">서비스 종류</label>
                  <select
                    id="edit-service"
                    value={editService}
                    onChange={(e) => setEditService(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="입주청소">입주청소</option>
                    <option value="이사청소">이사청소</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">평수</label>
                  <input
                    id="edit-size"
                    type="number"
                    value={editSize}
                    onChange={(e) => setEditSize(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">청소 주소</label>
                <input
                  id="edit-address"
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">희망 날짜</label>
                  <input
                    id="edit-date"
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">희망 시간</label>
                  <select
                    id="edit-time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">예약 상태</label>
                <select
                  id="edit-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="예약대기">예약대기</option>
                  <option value="예약완료">예약완료</option>
                  <option value="진행중">진행중</option>
                  <option value="완료">완료</option>
                  <option value="취소">취소</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">관리자 조치 메모</label>
                <textarea
                  id="edit-admin-memo"
                  rows={3}
                  value={editAdminMemo}
                  onChange={(e) => setEditAdminMemo(e.target.value)}
                  placeholder="예약 상담 대화 내역, 추가 결제 금액, 작업 매니저 배정 현황 등을 입력하세요."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  id="btn-cancel-edit"
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  취소
                </button>
                <button
                  id="btn-save-edit"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow"
                >
                  변경사항 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

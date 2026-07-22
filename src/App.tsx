import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import ReviewSection from './components/ReviewSection';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import { 
  Phone, Mail, MapPin, Sparkles, CheckCircle2, ClipboardCheck, 
  Calendar, Check, ArrowDown, ExternalLink, HelpCircle 
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [activeService, setActiveService] = useState<'입주청소' | '이사청소'>('입주청소');
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Smooth scroll handler
  const handleScrollTo = (elementId: string) => {
    if (isAdminView) {
      setIsAdminView(false); // return to home before scrolling
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = (id: string) => {
    setCreatedBookingId(id);
    handleScrollTo('reservation-section');
  };

  const handleSelectService = (type: '입주청소' | '이사청소') => {
    setActiveService(type);
    handleScrollTo('reservation-section');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Navbar navigation panel */}
      <Navbar 
        isAdminView={isAdminView} 
        onToggleAdminView={setIsAdminView} 
        onScrollTo={handleScrollTo} 
      />

      {/* Main Render Switcher */}
      {isAdminView ? (
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">예약 관리 시스템 (Admin Dashboard)</h2>
              <p className="text-slate-500 text-xs mt-0.5">실시간으로 고객들의 입주/이사 청소 예약을 조율하고 상태를 승인할 수 있습니다.</p>
            </div>
            <button
              id="btn-return-home"
              onClick={() => setIsAdminView(false)}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              홈페이지로 돌아가기 &rarr;
            </button>
          </div>
          <AdminDashboard />
        </main>
      ) : (
        <main className="flex-grow">
          
          {/* Section 1: Hero Banner */}
          <section id="hero-section" className="relative bg-slate-900 text-white py-24 sm:py-32 overflow-hidden">
            {/* Visual background accents */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80" 
                alt="Professional Cleaning" 
                className="w-full h-full object-cover opacity-20 filter blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/65"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-400 bg-blue-500/10 rounded-full mb-6 border border-blue-400/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  당신은 입주만 준비하세요, 청소는 저희가 완성합니다.
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
                  새로운 공간의 첫인상,<br />
                  <span className="text-blue-400">깨끗함</span>에서 시작됩니다.
                </h1>
                <p className="mt-6 text-lg text-slate-300 leading-relaxed">
                  입주청소와 이사청소는 단순히 먼지를 제거하는 작업이 아닙니다. 
                  새로운 공간에서 건강하고 쾌적한 삶을 시작할 수 있도록, 
                  <strong> Master Cleaning</strong>이 전문가의 숙련된 손길로 완벽하게 마무리합니다.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    id="btn-hero-booking"
                    onClick={() => handleScrollTo('reservation-section')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base active:scale-95"
                  >
                    지금 예약하기
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </button>
                  <button
                    id="btn-hero-services"
                    onClick={() => handleScrollTo('services-section')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-3.5 px-6 rounded-xl border border-slate-700 transition-colors text-sm"
                  >
                    서비스 범위 알아보기
                  </button>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-800 pt-8 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>예약 만족도 높은 프리미엄 서비스</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>원하는 날짜와 시간 조율 가능</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>영유아 안심 친환경 세제 사용</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>전문 자격 교육 수료 크루 방문</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Services description list */}
          <Services onSelectService={handleSelectService} />

          {/* Section 3: Why us 4 pillars */}
          <WhyUs />

          {/* Section 4: Before & After comparison slider */}
          <BeforeAfterSlider />

          {/* Section 5: Real customer reviews */}
          <ReviewSection />

          {/* Section 6: Booking Reservation panel */}
          <section id="reservation-section" className="py-20 bg-slate-50 border-t border-slate-100 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Side Instructions & Flow Tracker */}
                <div className="lg:col-span-5 space-y-8">
                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      Simple Process
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                      예약만 하세요.<br />
                      깨끗함은 저희가 책임집니다.
                    </h2>
                    <p className="mt-4 text-slate-500 leading-relaxed text-sm">
                      원하시는 청소 서비스 종류, 희망 일정을 폼에 맞추어 기입하시면 
                      담당 매니저가 연락을 드려 청소 세부 조율을 마친 후 실시간 확정됩니다.
                    </p>
                  </div>

                  {/* Booking Step-by-Step Flow card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-6">
                    <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">실시간 청소 예약 절차</h4>
                    
                    <div className="relative pl-8 space-y-6">
                      {/* Vertical line indicator */}
                      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-blue-100"></div>

                      {/* Step 1 */}
                      <div className="relative">
                        <div className="absolute -left-8 w-7.5 h-7.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center border-4 border-white shadow-sm">1</div>
                        <h5 className="font-bold text-slate-950 text-sm">서비스 정보 선택</h5>
                        <p className="text-xs text-slate-500 mt-1">입주청소와 이사청소 중 구분을 선택하고 평수를 정합니다.</p>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <div className="absolute -left-8 w-7.5 h-7.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center border-4 border-white shadow-sm">2</div>
                        <h5 className="font-bold text-slate-950 text-sm">희망 날짜 및 시간 조율</h5>
                        <p className="text-xs text-slate-500 mt-1">예약이 가능한 달력 날짜와 상세 시간대를 선택합니다.</p>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <div className="absolute -left-8 w-7.5 h-7.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center border-4 border-white shadow-sm">3</div>
                        <h5 className="font-bold text-slate-950 text-sm">신청 접수 및 상담원 콜백</h5>
                        <p className="text-xs text-slate-500 mt-1">접수가 접수되면 24시간 이내 담당 매니저가 직접 전화를 드려 추가 세부 가이드를 완료합니다.</p>
                      </div>

                      {/* Step 4 */}
                      <div className="relative">
                        <div className="absolute -left-8 w-7.5 h-7.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center border-4 border-white shadow-sm">4</div>
                        <h5 className="font-bold text-slate-950 text-sm">전문 매니저 정시 방문</h5>
                        <p className="text-xs text-slate-500 mt-1">전문 고압 스팀기 등 전문 도구를 챙겨 방문하여 반짝이게 마무리합니다.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reservation Form render OR Success panel */}
                <div className="lg:col-span-7">
                  {createdBookingId ? (
                    /* High-fidelity Booking Completed Card */
                    <div id="booking-success-card" className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold text-slate-900">예약 신청이 접수되었습니다!</h3>
                        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                          감사합니다. 입력하신 정보로 실시간 예약 대기 요청이 처리되었습니다. 
                          담당 매니저가 전화연락을 드려 추가 세부 요금 확정 및 상세 조율을 도울 예정입니다.
                        </p>
                      </div>

                      {/* Unique Booking Tracking Card */}
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-left max-w-md mx-auto space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-500">예약 추적 번호 (Booking ID)</span>
                          <span className="font-mono text-blue-600 font-bold">#{createdBookingId.substring(0, 10)}</span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                          <span>상태: <strong>예약 대기 (관리자 확인 중)</strong></span>
                        </div>
                        <div className="text-[11px] text-slate-400 leading-normal border-t border-slate-200/60 pt-2">
                          이 ID 번호를 보관하시거나 캡처해주시면, 추후 담당 매니저 통화 시 즉각 빠른 대조 확인이 가능합니다.
                        </div>
                      </div>

                      <div className="flex justify-center gap-4">
                        <button
                          id="btn-book-another"
                          onClick={() => setCreatedBookingId(null)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-colors shadow"
                        >
                          새로 예약하기
                        </button>
                        <button
                          id="btn-scroll-top"
                          onClick={() => handleScrollTo('hero-section')}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors"
                        >
                          메인 화면으로
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* The main booking input form card */
                    <BookingForm 
                      onSuccess={handleBookingSuccess} 
                      initialService={activeService} 
                    />
                  )}
                </div>

              </div>

            </div>
          </section>

          {/* Section 7: Contact section */}
          <section id="contact-section" className="py-20 bg-slate-900 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Contact Card details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Master Cleaning 고객센터
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                      연중무휴 실시간 상담 및 현장 방문 견적 상담이 가능합니다. 
                      전화 또는 메일로 연락주시면 청소 마스터 매니저가 직각 친절하고 상세하게 답변드리겠습니다.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Phone */}
                    <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">전화 상담 및 현장 견적 문의</p>
                        <p className="text-lg font-bold text-white">(323) 123-4567</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">제휴 및 이메일 서류 문의</p>
                        <p className="text-sm font-bold text-white">info@cleanproservices.com</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">본사 위치 안내</p>
                        <p className="text-sm font-bold text-white">서울특별시 마포구 백범로 31, 비즈타워 7층</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Map/Building visual representation */}
                <div className="h-[300px] rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" 
                    alt="Master Cleaning Tower" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="inline-block bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">본사 직영 빌딩</span>
                    <h4 className="text-sm font-bold text-white mt-1">Master Cleaning Tower</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">최첨단 청소 살균 트레이닝 센터 및 R&D 본사 통합 운영</p>
                  </div>
                </div>

              </div>

            </div>
          </section>

        </main>
      )}

      {/* Premium Footer section */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-900 pb-8">
            {/* Brand details */}
            <div className="text-center md:text-left">
              <p className="font-extrabold text-sm text-slate-300">MASTER CLEANING</p>
              <p className="text-[10px] text-slate-500 mt-1">새로운 공간, 완벽한 시작의 파트너. 마스터 클리닝은 프리미엄 위생 케어를 제공합니다.</p>
            </div>
            
            {/* Shortcuts */}
            <div className="flex gap-4 font-semibold text-[11px] text-slate-400">
              <button onClick={() => handleScrollTo('hero-section')} className="hover:text-white transition-colors">홈</button>
              <button onClick={() => handleScrollTo('services-section')} className="hover:text-white transition-colors">서비스</button>
              <button onClick={() => handleScrollTo('why-us-section')} className="hover:text-white transition-colors">왜마스터인가</button>
              <button onClick={() => handleScrollTo('before-after-section')} className="hover:text-white transition-colors">전후비교</button>
              <button onClick={() => handleScrollTo('reservation-section')} className="hover:text-white transition-colors">실시간예약</button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Master Cleaning. All rights reserved. 사업자등록번호: 120-11-23456 | 대표: 홍길동</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">이용약관</a>
              <a href="#" className="hover:text-white font-semibold">개인정보처리방침</a>
              <a href="#" className="hover:text-white">고객의소리</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

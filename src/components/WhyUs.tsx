import React from 'react';
import { Sparkles, ShieldCheck, Clock, Leaf, PiggyBank, ZoomIn } from 'lucide-react';

export default function WhyUs() {
  const whyUsItems = [
    {
      icon: <ZoomIn className="w-6 h-6 text-blue-600" />,
      title: "디테일까지 완벽하게",
      description: "눈에 띄는 바닥 먼지 뿐만 아니라 전등갓 내부 분리 세척, 창틀 틈새 미세먼지, 문틀, 몰딩 라인, 배수구 고온 멸균 소독까지 놓치기 쉬운 틈새까지 완벽 클리닝합니다.",
      details: ["주방 오븐/싱크 상하부장 깊은 안쪽 스팀 살균", "창틀/문틀 먼지 및 창유리 세정", "전등 내부 분리세척", "욕실 배수망 탈거 살균 탈취"]
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "약속한 시간 정확히 방문",
      description: "청소 스케줄 당일 예약된 시간에 완벽히 매니저가 도착하여 약속된 작업 가이드 시간 안에 신속하고 정확하게 오염을 세척하고 점검을 진행합니다.",
      details: ["체계적인 청소 프로세스로 정시 방문 정시 퇴실", "진행 현황 문자 알림 전송", "전문 팀 단위 신속 작업"]
    },
    {
      icon: <Leaf className="w-6 h-6 text-blue-600" />,
      title: "아이/반려동물 안심 친환경 청소",
      description: "화학 독성 성분이 강한 락스 대신 영유아 및 강아지, 고양이 피부나 호흡기에 무해한 최고급 친환경 전용 중성 세제와 전용 스팀기를 사용하여 물때와 묵은때를 안전하게 중화합니다.",
      details: ["친환경 에코라벨 인증 클리너 활용", "스팀을 통한 잔류 살충 작용", "유해 잔여 성분 0% 안심 보장"]
    },
    {
      icon: <PiggyBank className="w-6 h-6 text-blue-600" />,
      title: "추가 비용 걱정 NO (투명한 사전 견적)",
      description: "작업 범위, 평수, 오염 현황에 맞추어 예약 전 정확한 표준 요금 가이드라인을 투명하게 안내드립니다. 현장 방문 후 임의로 요금을 과도하게 늘리거나 부풀리는 추가 청구가 없습니다.",
      details: ["전체 요금의 실시간 확인 및 동의", "불합리한 가구 오염 트집 요구 없음", "표준 정찰제 기반 안내"]
    }
  ];

  return (
    <div id="why-us-section" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            True Professionalism
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            왜 Master Cleaning인가?
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed text-sm sm:text-base">
            인증 받은 고성능 살균 장비와 체계적인 위생 안전 교육을 통과한 직영팀이 
            단 한 번뿐인 이삿날의 기쁨을 완성해 드립니다. 신뢰할 수 있는 수치와 행동으로 결과물을 증명합니다.
          </p>
        </div>

        {/* 4 Pillars Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {whyUsItems.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 flex items-start gap-4 hover:border-blue-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                
                {/* Minor items checklist */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Stat metrics */}
        <div className="mt-16 bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-400">98.4%</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">예약 고객 만족 비율</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-400">12,400+</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">누적 클리닝 완료 세대</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-400">100%</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">직영 살균 교육 수강 매니저</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-400">0원</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">예약 후 불필요한 사후 추가 요금</p>
          </div>
        </div>

      </div>
    </div>
  );
}

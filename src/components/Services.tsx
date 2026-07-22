import React from 'react';
import { Home, Sparkles, Check, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceType: '입주청소' | '이사청소') => void;
}

export default function Services({ onSelectService }: ServicesProps) {
  const moveInScope = [
    '주방 싱크대 상/하부장 먼지 및 찌든 때 제거',
    '욕실 천장, 벽면 타일 물때 및 백시멘트 제거',
    '유리창 먼지 세척 및 창틀 미세 오염 클리닝',
    '방, 거실 몰딩, 콘센트, 스위치 먼지 클리닝',
    '붙박이장, 신발장 등 수납장 내부 먼지 흡입',
    '베란다 바닥 고압 물세척 및 배수구 살균',
    '전체 전등갓 분리 후 내부 세척 및 조립',
    '바닥 기계 세척 및 미세 가루 완전 청소'
  ];

  const moveOutScope = [
    '기존 짐 배치 자국 오염 및 벽지 먼지 제거',
    '주방 환풍기 후드 기름때 분리 고온 스팀 세척',
    '욕실 변기, 세면대, 배수구 요석 및 세균 소독',
    '창틀 및 베란다 창 가득 쌓인 누적 찌든 때 세정',
    '수납 공간 분리 탈거 후 내부 미세먼지 집중 포집',
    '바닥 왁스 잔여물 및 생활 얼룩 정밀 제거',
    '신발장 가구 냄새 및 찌든 먼지 안심 케어',
    '실내 살균 탈취 서비스로 쾌적한 전실 조성'
  ];

  return (
    <div id="services-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Our Premium Services
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            공간의 시작과 마무리를 다르게 만듭니다
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            단순히 먼지만 터는 청소가 아닌, 고객님의 가족이 건강하고 쾌적하게 
            머무를 수 있도록 전문 교육을 수료한 마스터 매니저가 맞춤 클리닝을 약속합니다.
          </p>
        </div>

        {/* Services Dual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Move-in Cleaning */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white mb-6">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">입주청소 (Move-In Cleaning)</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                신축 빌라, 아파트, 오피스텔 등 새집 입주 전에 발생하는 미세먼지, 공사 분진 가루, 시멘트 잔여물을 꼼꼼하게 분리 제거하여 기분 좋은 새 시작을 보장합니다.
              </p>

              {/* Working Scope List */}
              <div className="mt-6 border-t border-slate-200/60 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">정밀 케어 범위</h4>
                <ul className="space-y-2.5">
                  {moveInScope.map((scope, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                      <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span>{scope}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <button
                id="btn-select-movein"
                onClick={() => onSelectService('입주청소')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow"
              >
                입주청소 견적 확인 및 예약
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Move-out Cleaning */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">이사청소 (Move-Out Cleaning)</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                전 거주자의 흔적, 오랫동안 찌들어 굳어버린 주방 기름때와 환풍기 오염, 욕실 구석 세균까지 멸균 스팀 클리닝으로 완벽하게 살균하여 새 아파트처럼 복원시킵니다.
              </p>

              {/* Working Scope List */}
              <div className="mt-6 border-t border-slate-200/60 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">정밀 케어 범위</h4>
                <ul className="space-y-2.5">
                  {moveOutScope.map((scope, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span>{scope}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <button
                id="btn-select-moveout"
                onClick={() => onSelectService('이사청소')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow"
              >
                이사청소 견적 확인 및 예약
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

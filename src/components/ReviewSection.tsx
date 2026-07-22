import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

export default function ReviewSection() {
  const reviews = [
    {
      stars: 5,
      title: "정말 새집처럼 바뀌었습니다.",
      content: "새로 지은 아파트 입주 청소를 신청했는데, 창틀 먼지는 말할 것도 없고 타일 구석구석 메트 가루와 하얀 분진이 완전히 말끔히 지워졌어요. 가전가구 빌트인 장 내부까지 다 열어서 청소 완료하시고 소독까지 해 주셔서 기분 좋게 옷장 수납 바로 끝냈습니다. 강력 추천해요!",
      author: "김지영 님",
      location: "마포 프레스티지 자이",
      serviceType: "입주청소"
    },
    {
      stars: 5,
      title: "예약도 쉽고 시간도 정확했어요.",
      content: "이삿날 정신 없을 뻔 했는데 전용 가이드 시스템 덕분에 예약이 너무 간편했고요. 담당 매니저 분들이 정확하게 9시 정시에 방문해 주셔서 깜짝 놀랐습니다. 싱크대 밑이나 세탁실 배수망 구석 등 직접 보기 두려운 오염 지역까지 꼼꼼하게 살균 소독 스팀 처리하셔서 새집처럼 쾌적해졌어요.",
      author: "박민수 님",
      location: "서초 그랑자이",
      serviceType: "이사청소"
    },
    {
      stars: 5,
      title: "다음에도 꼭 이용할 예정입니다.",
      content: "아이가 피부가 약해 약품 아토피 우려 때문에 친환경 세제 청소 업체를 정말 필사적으로 서칭했었는데, 마스터 클리닝은 예약 설명부터 직접 수입한 에코 세제 활용을 약속하셔서 안심했습니다. 청소 끝난 뒤 독한 세제 냄새 대신 은은한 향만 돌고, 바닥 촉감도 너무 부드러워서 대만족합니다.",
      author: "윤설아 님",
      location: "분당 파크뷰",
      serviceType: "입주청소"
    }
  ];

  return (
    <div id="reviews-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Customers
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            고객님들이 직접 평가하는 마스터 클리닝
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            언제나 고객님의 건강과 만족을 최우선으로 생각합니다. 
            진심을 담은 프리미엄 케어 서비스를 직접 느껴보세요.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between shadow-sm relative hover:shadow-md transition-shadow">
              <div>
                {/* Gold Stars */}
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(rev.stars)].map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-blue-100 absolute top-6 right-6" />

                <h3 className="text-lg font-bold text-slate-900 mb-3">{rev.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">{rev.content}</p>
              </div>

              {/* Author Footer */}
              <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{rev.author}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{rev.location}</p>
                </div>
                <span className="inline-block bg-blue-50 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-full">
                  {rev.serviceType}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

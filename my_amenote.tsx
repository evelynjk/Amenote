import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  Share2,
  Image as ImageIcon,
  Check,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Target,
  X,
  Download
} from 'lucide-react';

// ============================================================================
// 1. 미니멀 라인 십자가 아이콘 (시계 아이콘과 두께감/디자인 통일)
// ============================================================================
const CrossIcon = ({ className = 'w-4 h-4', strokeWidth = 1.75 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3v18" />
    <path d="M7 8h10" />
  </svg>
);

// ============================================================================
// 2. 마음상태별 성경 구절 + 160자 이내 자연스러운 기도문 데이터베이스
// ============================================================================
const MOOD_PRAYER_DATA = {
  감사: [
    {
      verse: '범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',
      reference: '데살로니가전서 5:18',
      prayer:
        '선하신 주님, 오늘 허락하신 평범한 일상과 작은 숨결까지 모두 은혜임을 고백합니다. 당연하게 여겼던 모든 순간이 주님의 선물임을 깨닫게 하시고, 감사의 시선으로 하루를 따뜻하게 채우게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다',
      reference: '시편 136:1',
      prayer:
        '변함없는 사랑으로 제 걸음을 지켜주시는 하나님, 삶의 크고 작은 일들 속에서 주님의 세밀한 손길을 발견하게 하소서. 받은 은혜를 기억하며 기쁨으로 하루를 살아가게 하옵소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  회개: [
    {
      verse: '만일 우리가 우리 죄를 자백하면 그는 미쁘시고 의로우사 우리 죄를 사하시며',
      reference: '요한일서 1:9',
      prayer:
        '거룩하신 주님, 제 욕심과 고집을 앞세웠던 연약함을 솔직히 내려놓습니다. 상하고 통회하는 심령을 긍휼히 여기시고, 정결한 마음을 새롭게 창조하사 다시 주님의 빛 가운데 걷게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '하나님이여 내 속에 정한 마음을 창조하시고 내 안에 정직한 영을 새롭게 하소서',
      reference: '시편 51:10',
      prayer:
        '자비로우신 하나님, 무심코 내뱉은 말과 부족했던 사랑을 용서하여 주소서. 어제의 실수에 머물지 않게 하시고, 십자가의 은혜를 힘입어 오늘 주님 뜻대로 다시 시작할 용기를 주소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  믿음: [
    {
      verse: '믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니',
      reference: '히브리서 11:1',
      prayer:
        '신실하신 하나님, 눈앞의 막막한 현실보다 크신 주님을 신뢰합니다. 흔들리는 생각과 의심을 내려놓고, 보이지 않는 곳에서도 여전히 일하시는 주님의 신실한 약속을 굳게 붙들게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라',
      reference: '잠언 3:5',
      prayer:
        '전능하신 주님, 제 짧은 계산과 염려를 내려놓고 범사에 주님을 인정하며 나아갑니다. 주님께서 친히 길을 지도하실 것을 믿사오니, 담대한 믿음으로 오늘의 한 걸음을 내딛게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  좌절: [
    {
      verse: '여호와는 마음이 상한 자를 가까이 하시고 충심으로 통회하는 자를 구원하시는도다',
      reference: '시편 34:18',
      prayer:
        '위로의 하나님, 뜻대로 풀리지 않아 지치고 무너진 마음을 주님께 드립니다. 상한 심령을 가까이 찾아오시는 주님께서 주저앉은 제 손을 붙들어 일으키시고, 다시 일어설 새 힘을 부어주소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '우리가 사방으로 욱여쌈을 당하여도 싸이지 아니하며 답답한 일을 당하여도 낙심하지 아니하며',
      reference: '고린도후서 4:8',
      prayer:
        '선하신 주님, 답답한 현실 앞에서 무거워진 제 삶의 짐을 주님 발 앞에 내려놓습니다. 어두운 밤 뒤에 반드시 새벽이 찾아오듯, 이 고단한 시간도 주님의 선한 회복으로 인도하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  평안: [
    {
      verse: '평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라',
      reference: '요한복음 14:27',
      prayer:
        '평강의 왕이신 주님, 분주함 속에 요동치는 제 마음을 주님께 맡깁니다. 세상이 줄 수 없는 참된 평안으로 제 생각과 감정을 지켜주시고, 주님 품에서 온전한 쉼과 안식을 누리게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라',
      reference: '빌립보서 4:6',
      prayer:
        '잔잔한 물가로 인도하시는 주님, 내일에 대한 불안과 마음의 파도를 잠잠하게 하소서. 모든 염려를 감사함으로 기도로 바꾸어 주님께서 주시는 깊은 평강을 온전히 경험하게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  지혜: [
    {
      verse: '너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라',
      reference: '야고보서 1:5',
      prayer:
        '지혜의 근원이신 주님, 중요한 선택과 결정 앞에서 하늘의 명철을 구합니다. 제 감정이나 편견에 치우치지 않게 하시고, 무엇이 옳고 선한 길인지 밝히 분별하는 맑은 눈을 열어주소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라',
      reference: '잠언 16:9',
      prayer:
        '선한 목자 되시는 하나님, 오늘 제가 계획하고 내딛는 모든 걸음에 주님의 지혜를 더하소서. 제 뜻보다 주님의 인도하심을 앞세우며, 주님 보시기에 합당한 길로 나아가게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  위로: [
    {
      verse: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라',
      reference: '마태복음 11:28',
      prayer:
        '따뜻한 하나님, 오늘 하루 묵묵히 버텨내며 수고하고 지친 제 영혼을 품어주소서. 누구에게도 말하지 못한 마음의 무게를 다정히 어루만져 주시고, 다시 살아갈 새 힘과 온기를 허락하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라',
      reference: '이사야 41:10',
      prayer:
        '언제나 곁에 계시는 주님, 외롭고 고단한 순간에도 저를 홀로 두지 않으심을 믿습니다. 주님의 오른손으로 저를 굳세게 붙들어 주시고, 다정한 위로 속에서 참된 쉼을 회복하게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ],
  소망: [
    {
      verse: '너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라',
      reference: '예레미야 29:11',
      prayer:
        '소망의 하나님, 불확실한 내일 앞에서도 저를 향한 주님의 선한 계획을 바라봅니다. 환경에 흔들리지 않는 단단한 희망을 품게 하시고, 오늘도 기쁨과 기대함으로 믿음의 길을 걷게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요',
      reference: '이사야 40:31',
      prayer:
        '새 일을 행하시는 주님, 메마른 광야 끝에서도 새 길을 내시는 주님을 의지합니다. 주님을 앙망하는 자에게 독수리 같은 새 힘을 부어주셔서, 오늘 심는 기도가 아름다운 열매 맺게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ]
};

const QUICK_HASHTAGS = ['감사', '회개', '믿음', '좌절', '평안', '지혜', '위로', '소망'];

// 기계적인 반복 문구 없이 주제에 맞춰 자연스럽고 진심 어린 첫 문장으로 시작하는 160자 이내 기도문 생성
const buildCustomVerseAndPrayer = (topic, variantSeed = 0) => {
  const cleanTopic = topic.trim().replace(/[.!?]+$/, '');

  if (/합격|시험|입시|수능|자격증|공부|대학/.test(cleanTopic)) {
    const prayers = [
      '주님, 그동안 흘린 땀방울과 성실한 노력을 기억하사 마음의 평안을 주소서. 긴장감은 거두시고 배운 모든 것이 밝히 기억나게 하시며, 준비한 실력을 후회 없이 발휘하도록 지혜를 부어주소서. 예수님 이름으로 기도합니다. 아멘.',
      '지혜의 근원이신 하나님, 중요한 결실을 앞둔 이 걸음을 친히 붙들어 주소서. 두려움 대신 평강으로 마음을 지켜주시고, 모든 과정 위에 선한 손길을 더하사 가장 복된 문이 열리게 인도하소서. 예수님 이름으로 기도합니다. 아멘.'
    ];
    return {
      verse: '강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라',
      reference: '여호수아 1:9',
      prayer: prayers[variantSeed % prayers.length].slice(0, 160)
    };
  }

  if (/미팅|면접|인터뷰|발표|회의|대화/.test(cleanTopic)) {
    const prayers = [
      '지혜와 화평의 주님, 중요한 만남과 대화의 자리에 함께하여 주소서. 긴장된 마음을 부드럽게 하시고 꼭 필요한 지혜로운 말을 허락하사, 서로의 마음이 열리며 선한 결실로 이어지게 하소서. 예수님 이름으로 기도합니다. 아멘.',
      '선한 목자 되시는 하나님, 오늘 마주하는 자리에서 주님의 명철로 입술을 주관하소서. 준비한 생각들이 조리 있게 전달되게 하시고, 만나는 모든 이의 마음을 움직이시어 좋은 결과를 얻게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    ];
    return {
      verse: '지혜로운 자의 마음은 그의 입을 슬기롭게 하고 또 그의 입술에 지식을 더하느니라',
      reference: '잠언 16:23',
      prayer: prayers[variantSeed % prayers.length].slice(0, 160)
    };
  }

  if (/건강|치유|회복|아픔|병원|수술|치료/.test(cleanTopic)) {
    const prayers = [
      '치유의 하나님, 연약해진 육신과 지친 마음을 주님의 권능의 손길로 어루만져 주소서. 모든 아픔과 염려를 깨끗이 씻어주시고, 날마다 새 힘을 회복하여 감사와 기쁨으로 살아가게 하소서. 예수님 이름으로 기도합니다. 아멘.',
      '생명의 주인이신 주님, 회복을 간구하는 이 시간 주님의 따뜻한 위로와 평강을 부어주소서. 치료의 광선을 비추시어 막힌 곳을 뚫어주시고, 강건함으로 다시 일어나 주님을 찬양하게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    ];
    return {
      verse: '내 영혼아 여호와를 송축하며 그의 모든 은택을 잊지 말지어다 그가 네 모든 병을 고치시며',
      reference: '시편 103:2-3',
      prayer: prayers[variantSeed % prayers.length].slice(0, 160)
    };
  }

  if (/가족|부모|자녀|아이|남편|아내|가정|사랑/.test(cleanTopic)) {
    const prayers = [
      '사랑의 하나님, 소중한 우리 가정을 주님의 은혜의 울타리로 지켜주소서. 서로를 향한 이해와 따뜻한 배려가 넘치게 하시고, 어떤 상황 속에서도 믿음 안에서 하나 되어 평안을 누리게 하소서. 예수님 이름으로 기도합니다. 아멘.',
      '은혜로우신 주님, 사랑하는 이들의 걸음마다 동행하사 영육 간에 강건함을 허락하소서. 삶의 자리마다 주님의 선하신 보호하심이 머물게 하시고, 날마다 감사가 피어나는 가정 되게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    ];
    return {
      verse: '오직 나와 내 집은 여호와를 섬기겠노라',
      reference: '여호수아 24:15',
      prayer: prayers[variantSeed % prayers.length].slice(0, 160)
    };
  }

  if (/여행|출국|귀국|안전|길|이사|운전|한국/.test(cleanTopic)) {
    const prayers = [
      '눈동자같이 지키시는 하나님, 오가는 모든 길과 머무는 자리마다 안전함으로 보호하여 주소서. 예기치 못한 위험에서 지켜주시고, 맑은 날씨와 평안한 여정을 허락하사 기쁨으로 마치게 하소서. 예수님 이름으로 기도합니다. 아멘.',
      '선한 인도자 되시는 주님, 새로운 발걸음을 내딛는 이 여정 위에 주님의 평강을 더하소서. 출입을 영원까지 지키시는 약속을 의지하오니, 모든 과정이 순적하게 풀리며 감사가 넘치게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    ];
    return {
      verse: '여호와께서 너의 출입을 지금부터 영원까지 지키시리로다',
      reference: '시편 121:8',
      prayer: prayers[variantSeed % prayers.length].slice(0, 160)
    };
  }

  if (/직장|취업|일|사업|프로젝트|이직/.test(cleanTopic)) {
    const prayers = [
      '능력 주시는 하나님, 맡겨진 일터와 사명의 자리에서 지혜와 성실함으로 행하게 하소서. 막힌 길은 열어주시고 함께하는 이들과 화목하게 하사, 수고의 땀방울마다 아름다운 열매를 맺게 하소서. 예수님 이름으로 기도합니다. 아멘.',
      '신실하신 주님, 새로운 기회와 도전을 앞둔 이 걸음을 선한 길로 인도하여 주소서. 염려 대신 담대한 믿음을 주시고, 주님께서 예비하신 가장 합당한 자리에서 빛과 소금의 역할을 감당하게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    ];
    return {
      verse: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
      reference: '빌립보서 4:13',
      prayer: prayers[variantSeed % prayers.length].slice(0, 160)
    };
  }

  const defaultPrayers = [
    '신실하신 하나님, 간절히 바라는 마음의 소원을 주님께 아뢰며 나아갑니다. 제 뜻보다 선하신 주님의 계획을 신뢰하오니, 모든 과정에 지혜와 평강을 부어주시고 아름다운 열매로 인도하소서. 예수님 이름으로 기도합니다. 아멘.',
    '은혜의 주님, 오늘도 주님의 도우심을 구하며 믿음으로 한 걸음을 내딛습니다. 불안한 마음은 평안으로 덮어주시고, 닫힌 문은 여시며 주님의 선하신 뜻이 제 삶 가운데 온전히 이루어지게 하소서. 예수님 이름으로 기도합니다. 아멘.',
    '선하신 목자 되시는 하나님, 제 삶의 크고 작은 걸음마다 친히 동행하여 주소서. 흔들리지 않는 믿음과 하늘의 명철을 허락하사, 주님께서 예비하신 가장 복되고 선한 길로 인도받게 하소서. 예수님 이름으로 기도합니다. 아멘.'
  ];

  return {
    verse: '너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라',
    reference: '잠언 16:3',
    prayer: defaultPrayers[variantSeed % defaultPrayers.length].slice(0, 160)
  };
};

// ============================================================================
// 3. 날짜 및 포맷 유틸리티
// ============================================================================
const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${m}월 ${d}일 (${days[date.getDay()]})`;
};

const formatShortDayMonth = (dateStr) => {
  const [, m, d] = dateStr.split('-');
  return `${d}/${m}`;
};

const getCurrentTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// ============================================================================
// 4. 메인 App 컴포넌트 (my Amenote)
// ============================================================================
export default function App() {
  const todayStr = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState('records'); // 'records' | 'prayer'
  const [calendarMode, setCalendarMode] = useState('week'); // 'week' | 'month'
  const [monthCursor, setMonthCursor] = useState(() => {
    const [y, m] = todayStr.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  // 오늘의 기록 데이터 (최신순 상단 표시)
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('amenote_entries_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 말씀과 기도 히스토리 (날짜/시간별 영구 보관)
  const [prayerHistory, setPrayerHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('amenote_prayer_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // D-Day 데이터 (최대 3개, 각 8자 제한)
  const [ddays, setDdays] = useState(() => {
    try {
      const saved = localStorage.getItem('amenote_ddays_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 기록 입력 및 인라인 편집 상태
  const [inputText, setInputText] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editEntryText, setEditEntryText] = useState('');

  // 이미지 확대 모달 상태 (다운로드 / 삭제 / 닫기)
  const [lightboxEntry, setLightboxEntry] = useState(null);

  // 기도 탭 입력 및 편집 상태
  const [prayerTopicInput, setPrayerTopicInput] = useState('');
  const [prayerVariantCount, setPrayerVariantCount] = useState(0);
  const [editingPrayerId, setEditingPrayerId] = useState(null);
  const [editPrayerVerse, setEditPrayerVerse] = useState('');
  const [editPrayerRef, setEditPrayerRef] = useState('');
  const [editPrayerText, setEditPrayerText] = useState('');

  // D-Day 모달 상태
  const [isDdayModalOpen, setIsDdayModalOpen] = useState(false);
  const [editingDdayId, setEditingDdayId] = useState(null);
  const [ddayTitleInput, setDdayTitleInput] = useState('');
  const [ddayDateInput, setDdayDateInput] = useState(todayStr);

  // 토스트 및 이미지 공유 생성 상태
  const [toast, setToast] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('amenote_entries_v2', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('amenote_prayer_history_v2', JSON.stringify(prayerHistory));
  }, [prayerHistory]);

  useEffect(() => {
    localStorage.setItem('amenote_ddays_v2', JSON.stringify(ddays));
  }, [ddays]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ============================================================================
  // 클라이언트 측 이미지 자동 압축 (최대 너비 800px / JPEG 70%)
  // ============================================================================
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setPendingImage(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ============================================================================
  // 오늘의 기록 CRUD (새 메시지가 항상 맨 위에 위치)
  // ============================================================================
  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !pendingImage) return;

    const newEntry = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: selectedDate,
      time: getCurrentTimeString(),
      type: 'note',
      text: inputText.trim(),
      image: pendingImage
    };

    setEntries((prev) => [newEntry, ...prev]);
    setInputText('');
    setPendingImage(null);
  };

  const startEditingEntry = (entry) => {
    setEditingEntryId(entry.id);
    setEditEntryText(entry.text || '');
  };

  const saveEntryEdit = (id) => {
    setEntries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, text: editEntryText.trim() } : item
      )
    );
    setEditingEntryId(null);
    setEditEntryText('');
    showToast('기록이 수정되었습니다');
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    if (editingEntryId === id) setEditingEntryId(null);
    showToast('기록이 삭제되었습니다');
  };

  // 이미지 확대 팝업 내 다운로드 및 사진 삭제
  const handleDownloadLightboxImage = () => {
    if (!lightboxEntry?.image) return;
    const link = document.createElement('a');
    link.href = lightboxEntry.image;
    link.download = `my_Amenote_${lightboxEntry.date}_${lightboxEntry.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('사진이 다운로드되었습니다');
  };

  const handleDeleteLightboxImage = () => {
    if (!lightboxEntry) return;
    const targetId = lightboxEntry.id;
    setEntries((prev) =>
      prev
        .map((item) => {
          if (item.id !== targetId) return item;
          if (!item.text || !item.text.trim()) return null;
          return { ...item, image: null };
        })
        .filter(Boolean)
    );
    setLightboxEntry(null);
    showToast('이미지가 삭제되었습니다');
  };

  // ============================================================================
  // 말씀과 기도 CRUD 및 오늘의 기록 연동
  // ============================================================================
  const handleGeneratePrayer = (moodTag = null) => {
    const nextSeed = prayerVariantCount + 1;
    setPrayerVariantCount(nextSeed);

    let titleLabel = '';
    let generated = null;

    if (moodTag && MOOD_PRAYER_DATA[moodTag]) {
      const pool = MOOD_PRAYER_DATA[moodTag];
      generated = pool[nextSeed % pool.length];
      titleLabel = `#${moodTag}`;
    } else {
      const topic = prayerTopicInput.trim();
      if (!topic) return;
      generated = buildCustomVerseAndPrayer(topic, nextSeed);
      titleLabel = topic;
      setPrayerTopicInput('');
    }

    const newPrayer = {
      id: `pray-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: selectedDate,
      time: getCurrentTimeString(),
      title: titleLabel,
      verse: generated.verse,
      reference: generated.reference,
      text: generated.prayer.slice(0, 160)
    };

    setPrayerHistory((prev) => [newPrayer, ...prev]);
  };

  const startEditingPrayer = (item) => {
    setEditingPrayerId(item.id);
    setEditPrayerVerse(item.verse || '');
    setEditPrayerRef(item.reference || '');
    setEditPrayerText(item.text || '');
  };

  const savePrayerEdit = (id) => {
    const trimmedText = editPrayerText.trim().slice(0, 160);
    if (!trimmedText) return;
    setPrayerHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              verse: editPrayerVerse.trim(),
              reference: editPrayerRef.trim(),
              text: trimmedText
            }
          : item
      )
    );
    setEditingPrayerId(null);
    showToast('기도문이 수정되었습니다');
  };

  const deletePrayerHistoryItem = (id) => {
    setPrayerHistory((prev) => prev.filter((item) => item.id !== id));
    if (editingPrayerId === id) setEditingPrayerId(null);
    showToast('기도문이 삭제되었습니다');
  };

  // 기도문을 오늘의 기록으로 전송 (말씀 바로 뒤에 성경 출처 배치, 본문 정체 서체)
  const exportPrayerToTimeline = (prayerItem) => {
    if (!prayerItem?.text) return;
    const verseWithRef = prayerItem.verse
      ? prayerItem.reference
        ? `"${prayerItem.verse}" (${prayerItem.reference})`
        : `"${prayerItem.verse}"`
      : '';

    const newEntry = {
      id: `prayer-rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: selectedDate,
      time: prayerItem.time || getCurrentTimeString(),
      type: 'prayer',
      verseLine: verseWithRef,
      text: prayerItem.text,
      image: null
    };

    setEntries((prev) => [newEntry, ...prev]);
    showToast('오늘의 기록에 담겼습니다');
  };

  // ============================================================================
  // D-Day 계산, 빠른 날짜순 정렬 & 목표 날짜 기록 자동 연동
  // ============================================================================
  const getDdayDiffDays = (targetDateStr) => {
    const [ty, tm, td] = targetDateStr.split('-').map(Number);
    const [sy, sm, sd] = selectedDate.split('-').map(Number);
    const target = new Date(ty, tm - 1, td);
    const base = new Date(sy, sm - 1, sd);
    return Math.round((target - base) / (1000 * 60 * 60 * 24));
  };

  const sortedDdays = useMemo(() => {
    return [...ddays].sort((a, b) => {
      const diffA = getDdayDiffDays(a.date);
      const diffB = getDdayDiffDays(b.date);
      const isUpcomingA = diffA >= 0;
      const isUpcomingB = diffB >= 0;
      if (isUpcomingA && !isUpcomingB) return -1;
      if (!isUpcomingA && isUpcomingB) return 1;
      if (isUpcomingA && isUpcomingB) return diffA - diffB;
      return diffB - diffA;
    });
  }, [ddays, selectedDate]);

  const formatSingleDdayLabel = (item) => {
    if (!item || !item.date) return '';
    const diffDays = getDdayDiffDays(item.date);
    const shortTitle = (item.title || '').slice(0, 8);
    if (diffDays === 0) return `D-Day ${shortTitle}`;
    if (diffDays > 0) return `D-${diffDays} ${shortTitle}`;
    return `D+${Math.abs(diffDays)} ${shortTitle}`;
  };

  const openDdayModal = (targetItem = null) => {
    if (targetItem) {
      setEditingDdayId(targetItem.id);
      setDdayTitleInput((targetItem.title || '').slice(0, 8));
      setDdayDateInput(targetItem.date);
    } else {
      setEditingDdayId(null);
      setDdayTitleInput('');
      setDdayDateInput(selectedDate || todayStr);
    }
    setIsDdayModalOpen(true);
  };

  const saveDday = (e) => {
    e.preventDefault();
    if (!ddayTitleInput.trim() || !ddayDateInput) return;

    const cleanTitle = ddayTitleInput.trim().slice(0, 8);
    const targetDate = ddayDateInput;
    const milestoneText = `${formatShortDayMonth(targetDate)} ${cleanTitle}`;

    if (editingDdayId) {
      setDdays((prev) =>
        prev.map((d) =>
          d.id === editingDdayId ? { ...d, title: cleanTitle, date: targetDate } : d
        )
      );
      setEntries((prev) =>
        prev.map((ent) =>
          ent.id === `dday-milestone-${editingDdayId}`
            ? { ...ent, date: targetDate, text: milestoneText }
            : ent
        )
      );
      showToast('디데이가 수정되었습니다');
    } else {
      if (ddays.length >= 3) {
        showToast('디데이는 최대 3개까지 등록할 수 있습니다');
        return;
      }
      const newId = `${Date.now()}`;
      setDdays((prev) => [...prev, { id: newId, title: cleanTitle, date: targetDate }]);
      setEntries((prev) => [
        {
          id: `dday-milestone-${newId}`,
          date: targetDate,
          time: 'D-Day',
          type: 'dday',
          text: milestoneText,
          image: null
        },
        ...prev
      ]);
      showToast('디데이와 목표 날짜 기록이 추가되었습니다');
    }

    setEditingDdayId(null);
    setDdayTitleInput('');
    setDdayDateInput(todayStr);
    setIsDdayModalOpen(false);
  };

  const removeDday = (id) => {
    setDdays((prev) => prev.filter((d) => d.id !== id));
    setEntries((prev) => prev.filter((ent) => ent.id !== `dday-milestone-${id}`));
    if (editingDdayId === id) {
      setEditingDdayId(null);
      setDdayTitleInput('');
    }
    showToast('디데이가 삭제되었습니다');
  };

  // ============================================================================
  // 선택 날짜 데이터 및 캘린더 계산
  // ============================================================================
  const dailyEntries = useMemo(
    () => entries.filter((item) => item.date === selectedDate),
    [entries, selectedDate]
  );

  const dailyPrayers = useMemo(
    () => prayerHistory.filter((item) => item.date === selectedDate),
    [prayerHistory, selectedDate]
  );

  const datesWithContent = useMemo(() => {
    const set = new Set();
    entries.forEach((e) => set.add(e.date));
    ddays.forEach((d) => set.add(d.date));
    return set;
  }, [entries, ddays]);

  const weekDays = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const base = new Date(y, m - 1, d);
    const sunday = new Date(y, m - 1, d - base.getDay());
    return Array.from({ length: 7 }, (_, i) =>
      formatDateKey(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i))
    );
  }, [selectedDate]);

  const monthDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) {
      cells.push(formatDateKey(new Date(year, month, d)));
    }
    return cells;
  }, [monthCursor]);

  // ============================================================================
  // 상단 공유 버튼: 첨부 사진까지 포함한 오늘의 기록 전체 PNG 생성/저장/공유
  // ============================================================================
  const handleShareDailyImage = async () => {
    if (dailyEntries.length === 0) {
      showToast('공유할 오늘의 기록이 없습니다');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const canvasWidth = 760;
      const paddingX = 44;
      const paddingTop = 44;
      const timeColWidth = 64;
      const cardWidth = canvasWidth - paddingX * 2 - timeColWidth;
      const cardInnerWidth = cardWidth - 36;

      const measureCanvas = document.createElement('canvas');
      const mCtx = measureCanvas.getContext('2d');

      const wrapText = (ctx, text, maxW) => {
        const lines = [];
        const paragraphs = text.split('\n');
        paragraphs.forEach((para) => {
          if (para === '') {
            lines.push('');
            return;
          }
          let line = '';
          for (let i = 0; i < para.length; i++) {
            const ch = para[i];
            const test = line + ch;
            if (ctx.measureText(test).width > maxW && line.length > 0) {
              lines.push(line);
              line = ch;
            } else {
              line = test;
            }
          }
          if (line) lines.push(line);
        });
        return lines;
      };

      // 첨부 이미지 미리 로드
      const loadedImages = {};
      await Promise.all(
        dailyEntries.map(
          (item) =>
            new Promise((resolve) => {
              if (!item.image) return resolve();
              const img = new Image();
              img.onload = () => {
                loadedImages[item.id] = img;
                resolve();
              };
              img.onerror = () => resolve();
              img.src = item.image;
            })
        )
      );

      let totalHeight = paddingTop + 96;

      const layoutItems = dailyEntries.map((item) => {
        const img = loadedImages[item.id];
        let drawImgW = 0;
        let drawImgH = 0;
        if (img) {
          drawImgW = cardInnerWidth;
          drawImgH = Math.min(340, Math.round((img.height / img.width) * drawImgW));
        }

        mCtx.font = '500 16px "Pretendard", "Noto Sans KR", sans-serif';
        const verseLines = item.verseLine ? wrapText(mCtx, item.verseLine, cardInnerWidth - 14) : [];

        mCtx.font = '400 17px "Pretendard", "Noto Sans KR", sans-serif';
        const textLines = item.text ? wrapText(mCtx, item.text, cardInnerWidth) : [];

        let cardH = 32;
        if (img) cardH += drawImgH + (verseLines.length > 0 || textLines.length > 0 ? 14 : 0);
        if (verseLines.length > 0) cardH += verseLines.length * 24 + (textLines.length > 0 ? 12 : 0);
        if (textLines.length > 0) cardH += textLines.length * 26;

        totalHeight += cardH + 16;
        return { item, img, drawImgW, drawImgH, verseLines, textLines, cardH };
      });

      totalHeight += 54;

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');

      // 배경
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, canvasWidth, totalHeight);

      // 상단 헤더
      let cursorY = paddingTop;
      ctx.fillStyle = '#3D352E';
      ctx.font = '500 26px "Pretendard", "Noto Sans KR", sans-serif';
      ctx.fillText('my Amenote', paddingX, cursorY + 24);

      ctx.fillStyle = '#8C7F70';
      ctx.font = '400 13px "Pretendard", "Noto Sans KR", sans-serif';
      ctx.fillText('my day. my story. my prayer.', paddingX, cursorY + 46);

      const ddaySummary = sortedDdays.map((d) => formatSingleDdayLabel(d)).join(' · ');
      const dateHeader = ddaySummary
        ? `${formatDisplayDate(selectedDate)}   |   ${ddaySummary}`
        : formatDisplayDate(selectedDate);

      ctx.fillStyle = '#5C4F42';
      ctx.font = '600 14px "Pretendard", "Noto Sans KR", sans-serif';
      ctx.fillText(dateHeader, paddingX, cursorY + 76);

      cursorY += 96;

      layoutItems.forEach(({ item, img, drawImgW, drawImgH, verseLines, textLines, cardH }) => {
        // 좌측 시간
        ctx.fillStyle = '#8C7F70';
        ctx.font = '500 13px "Pretendard", "Noto Sans KR", sans-serif';
        ctx.fillText(item.time, paddingX, cursorY + 24);

        // 우측 카드
        const cardX = paddingX + timeColWidth;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#EAE5DC';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cardX, cursorY, cardWidth, cardH, 16);
        ctx.fill();
        ctx.stroke();

        let innerY = cursorY + 16;
        const innerX = cardX + 18;

        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(innerX, innerY, drawImgW, drawImgH, 10);
          ctx.clip();
          ctx.drawImage(img, innerX, innerY, drawImgW, drawImgH);
          ctx.restore();
          innerY += drawImgH + 14;
        }

        if (verseLines.length > 0) {
          ctx.fillStyle = '#8C6D53';
          ctx.fillRect(innerX, innerY + 2, 2.5, verseLines.length * 24 - 4);
          ctx.fillStyle = '#5C4F42';
          ctx.font = '500 15px "Pretendard", "Noto Sans KR", sans-serif';
          verseLines.forEach((line) => {
            ctx.fillText(line, innerX + 12, innerY + 16);
            innerY += 24;
          });
          innerY += 12;
        }

        if (textLines.length > 0) {
          ctx.fillStyle = '#3D352E';
          ctx.font = '400 17px "Pretendard", "Noto Sans KR", sans-serif';
          textLines.forEach((line) => {
            ctx.fillText(line, innerX, innerY + 18);
            innerY += 26;
          });
        }

        cursorY += cardH + 16;
      });

      // 푸터
      ctx.fillStyle = '#9E9488';
      ctx.font = '400 12px "Pretendard", "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('my Amenote · my day. my story. my prayer.', canvasWidth / 2, totalHeight - 20);
      ctx.textAlign = 'left';

      const dataUrl = canvas.toDataURL('image/png');
      const fileName = `my_Amenote_${selectedDate}.png`;

      if (navigator.canShare && navigator.share) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `my Amenote (${selectedDate})`
            });
            showToast('오늘의 기록 이미지가 공유되었습니다');
            setIsGeneratingImage(false);
            return;
          }
        } catch {
          // 공유 취소 또는 미지원 시 다운로드 폴백
        }
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('오늘의 기록 이미지가 저장되었습니다');
    } catch {
      showToast('이미지 생성 중 오류가 발생했습니다');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3D352E] font-sans pb-16 selection:bg-[#E8DFD3]">
      <div className="max-w-xl mx-auto px-4 pt-6">
        {/* ================================================================== */}
        {/* 1. 상단 브랜드 헤더 (단정한 미디엄 서체) & 컨트롤                  */}
        {/* ================================================================== */}
        <header className="mb-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-[#3D352E] leading-tight">
                my Amenote
              </h1>
              <p className="text-xs font-normal text-[#8C7F70] mt-0.5 tracking-normal">
                my day. my story. my prayer.
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* 주간 / 월간 캘린더 토글 */}
              <div className="flex bg-[#F1ECE4] p-0.5 rounded-full border border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => setCalendarMode('week')}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    calendarMode === 'week'
                      ? 'bg-white text-[#3D352E] font-medium shadow-2xs'
                      : 'text-[#8C7F70]'
                  }`}
                >
                  주간
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMode('month')}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    calendarMode === 'month'
                      ? 'bg-white text-[#3D352E] font-medium shadow-2xs'
                      : 'text-[#8C7F70]'
                  }`}
                >
                  월간
                </button>
              </div>

              {/* D-Day 설정 버튼 */}
              <button
                type="button"
                onClick={() => openDdayModal()}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EAE5DC] rounded-full text-[#5C4F42] hover:bg-[#F5F0E8] transition-colors"
              >
                D-Day
              </button>

              {/* 오늘의 기록 전체 이미지 공유 버튼 */}
              <button
                type="button"
                onClick={handleShareDailyImage}
                disabled={isGeneratingImage}
                title="오늘의 기록 전체 이미지 저장 및 공유"
                className="p-2 bg-white border border-[#EAE5DC] rounded-full text-[#5C4F42] hover:bg-[#F5F0E8] disabled:opacity-50 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* 선택 날짜 & 빠른 날짜순 D-Day 뱃지 (최대 3건, 8자 제한) */}
          <div className="flex items-center justify-between gap-1.5 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-semibold text-[#3D352E] whitespace-nowrap">
                {formatDisplayDate(selectedDate)}
              </span>
              {selectedDate !== todayStr && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(todayStr);
                    const [y, m] = todayStr.split('-').map(Number);
                    setMonthCursor(new Date(y, m - 1, 1));
                  }}
                  className="px-2 py-0.5 rounded-full bg-[#EFECE6] text-[#8C6D53] text-[10.5px] font-medium hover:bg-[#E4DDD2] transition whitespace-nowrap"
                >
                  오늘로
                </button>
              )}
            </div>

            {sortedDdays.length > 0 && (
              <div className="flex items-center justify-end gap-1 min-w-0 overflow-x-auto">
                {sortedDdays.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#EAE5DC] text-[#8C6D53] hover:border-[#C7B9A7] transition text-[10.5px] font-medium whitespace-nowrap"
                  >
                    <Target className="w-2.5 h-2.5 text-[#8C6D53] shrink-0" strokeWidth={1.75} />
                    <span>{formatSingleDdayLabel(item)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ================================================================== */}
        {/* 2. 주간 / 월간 캘린더                                              */}
        {/* ================================================================== */}
        <section className="bg-white border border-[#EAE5DC] rounded-2xl p-3.5 mb-4 shadow-2xs">
          {calendarMode === 'week' ? (
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((dateStr, idx) => {
                const isSelected = dateStr === selectedDate;
                const dayNum = Number(dateStr.split('-')[2]);
                const hasDot = datesWithContent.has(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className="flex flex-col items-center py-1.5 rounded-xl transition-colors"
                  >
                    <span className="text-[11px] text-[#9C8F80] mb-1">{dayNames[idx]}</span>
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#7A634C] text-white font-semibold'
                          : 'text-[#3D352E] hover:bg-[#F5F0E8]'
                      }`}
                    >
                      {dayNum}
                    </span>
                    <span
                      className={`w-1 h-1 rounded-full mt-1 ${
                        hasDot ? 'bg-[#8C745A]' : 'bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between px-2 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setMonthCursor(
                      new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1)
                    )
                  }
                  className="p-1 text-[#8C7F70] hover:text-[#3D352E]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-[#3D352E]">
                  {monthCursor.getFullYear()}년 {monthCursor.getMonth() + 1}월
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setMonthCursor(
                      new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1)
                    )
                  }
                  className="p-1 text-[#8C7F70] hover:text-[#3D352E]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {dayNames.map((d) => (
                  <span key={d} className="text-[11px] text-[#9C8F80]">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {monthDays.map((dateStr, idx) => {
                  if (!dateStr) return <div key={`empty-${idx}`} />;
                  const isSelected = dateStr === selectedDate;
                  const dayNum = Number(dateStr.split('-')[2]);
                  const hasDot = datesWithContent.has(dateStr);

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className="flex flex-col items-center py-1"
                    >
                      <span
                        className={`w-8 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#7A634C] text-white font-semibold'
                            : 'text-[#3D352E] hover:bg-[#F5F0E8]'
                        }`}
                      >
                        {dayNum}
                      </span>
                      <span
                        className={`w-1 h-1 rounded-full mt-0.5 ${
                          hasDot ? 'bg-[#8C745A]' : 'bg-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* 3. 듀얼 탭 네비게이션 (오늘의 기록 / 말씀과 기도)                   */}
        {/* ================================================================== */}
        <nav className="grid grid-cols-2 bg-[#F1ECE4] p-1 rounded-2xl border border-[#EAE5DC] mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'records'
                ? 'bg-white text-[#3D352E] shadow-2xs font-semibold'
                : 'text-[#8C7F70] hover:text-[#5C4F42]'
            }`}
          >
            <Clock className="w-4 h-4" strokeWidth={1.75} />
            <span>오늘의 기록</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prayer')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'prayer'
                ? 'bg-white text-[#3D352E] shadow-2xs font-semibold'
                : 'text-[#8C7F70] hover:text-[#5C4F42]'
            }`}
          >
            <CrossIcon className="w-4 h-4" strokeWidth={1.75} />
            <span>말씀과 기도</span>
          </button>
        </nav>

        {/* ================================================================== */}
        {/* 4. TAB 1: 오늘의 기록 (최신 기록 최상단 정렬)                       */}
        {/* ================================================================== */}
        {activeTab === 'records' && (
          <main>
            {/* 한 줄 미니멀 입력바 */}
            <form
              onSubmit={handleAddEntry}
              className="bg-white border border-[#EAE5DC] rounded-2xl px-3.5 py-2 mb-4 shadow-2xs"
            >
              {pendingImage && (
                <div className="relative inline-block mb-2 mt-1">
                  <img
                    src={pendingImage}
                    alt="첨부 미리보기"
                    className="h-20 w-auto rounded-lg object-cover border border-[#EAE5DC]"
                  />
                  <button
                    type="button"
                    onClick={() => setPendingImage(null)}
                    className="absolute -top-1.5 -right-1.5 bg-[#3D352E] text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="지금 떠오르는 생각이나 일정을 남겨보세요..."
                  className="flex-1 text-sm bg-transparent text-[#3D352E] placeholder-[#B0A699] focus:outline-none py-1.5"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="사진 첨부"
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#EAE5DC] text-[#7A634C] hover:bg-[#F5F0E8] transition-colors shrink-0"
                >
                  <ImageIcon className="w-4 h-4" strokeWidth={1.75} />
                </button>

                <button
                  type="submit"
                  title="기록 저장"
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#EAE5DC] text-[#7A634C] hover:bg-[#F5F0E8] transition-colors shrink-0"
                >
                  <Check className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </form>

            {/* 시간순 컴팩트 카드 리스트 (최신순 상단) */}
            {dailyEntries.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#A69B8D]">
                이 날에 남겨진 첫 번째 기록을 적어보세요.
              </div>
            ) : (
              <div className="space-y-2.5">
                {dailyEntries.map((entry) => {
                  const isEditing = editingEntryId === entry.id;

                  return (
                    <div key={entry.id} className="flex items-start gap-2.5">
                      <span className="text-[11px] text-[#9C8F80] pt-2.5 w-11 shrink-0 text-right font-medium tabular-nums">
                        {entry.time}
                      </span>

                      <div className="flex-1 bg-white border border-[#EAE5DC] rounded-2xl px-3.5 py-2.5 shadow-2xs">
                        {/* 사진 상단 배치 (더블클릭 시 다운로드/삭제 팝업 오픈) */}
                        {entry.image && (
                          <img
                            src={entry.image}
                            alt="첨부 이미지"
                            onDoubleClick={() => setLightboxEntry(entry)}
                            title="더블클릭하여 크게 보기 및 다운로드"
                            className="w-full max-h-72 object-cover rounded-xl mb-2 border border-[#F0ECE3] cursor-pointer"
                          />
                        )}

                        {isEditing ? (
                          <div className="space-y-2">
                            <textarea
                              value={editEntryText}
                              onChange={(e) => setEditEntryText(e.target.value)}
                              rows={3}
                              className="w-full text-sm text-[#3D352E] bg-[#FAF8F5] border border-[#DFD8CC] rounded-xl p-2 focus:outline-none"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingEntryId(null)}
                                className="px-2.5 py-1 text-xs text-[#8C7F70] hover:text-[#3D352E]"
                              >
                                취소
                              </button>
                              <button
                                type="button"
                                onClick={() => saveEntryEdit(entry.id)}
                                className="px-3 py-1 text-xs bg-[#7A634C] text-white rounded-lg"
                              >
                                저장
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* 말씀 구절 + 바로 뒤 출처 */}
                            {entry.verseLine && (
                              <div className="border-l-2 border-[#7A634C] pl-2.5 mb-2 text-xs text-[#5C4F42] leading-relaxed">
                                {entry.verseLine}
                              </div>
                            )}

                            {/* 본문 & 우측 하단 인라인 수정·삭제 아이콘 정렬 */}
                            <div className="flex items-end justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                {entry.text && (
                                  <p className="text-sm text-[#3D352E] not-italic leading-relaxed whitespace-pre-wrap break-words">
                                    {entry.text}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditingEntry(entry)}
                                  title="수정"
                                  className="text-[#B0A699] hover:text-[#7A634C] transition-colors p-0.5"
                                >
                                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteEntry(entry.id)}
                                  title="삭제"
                                  className="text-[#B0A699] hover:text-[#B85C5C] transition-colors p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* ================================================================== */}
        {/* 5. TAB 2: 말씀과 기도                                              */}
        {/* ================================================================== */}
        {activeTab === 'prayer' && (
          <main>
            <div className="bg-white border border-[#EAE5DC] rounded-2xl p-4 mb-4 shadow-2xs">
              <label className="block text-xs font-semibold text-[#5C4F42] mb-2">
                기도 제목을 넣어주세요.
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={prayerTopicInput}
                  onChange={(e) => setPrayerTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGeneratePrayer();
                    }
                  }}
                  placeholder="예: OO의 대학 합격 기도, 내일 인터뷰 잘 보도록"
                  className="flex-1 text-xs bg-[#FAF8F5] border border-[#EAE5DC] rounded-xl px-3 py-2.5 text-[#3D352E] placeholder-[#B0A699] focus:outline-none focus:border-[#C8B9A6]"
                />
                <button
                  type="button"
                  onClick={() => handleGeneratePrayer()}
                  className="px-3 py-2.5 bg-[#7A634C] text-white text-xs font-medium rounded-xl hover:bg-[#66523E] transition-colors shrink-0"
                >
                  당신을 위한 기도문
                </button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#F3EFE8]">
                <p className="text-[11px] text-[#8C7F70] mb-2">오늘 마음 상태로 기도하기</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_HASHTAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleGeneratePrayer(tag)}
                      className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE5DC] rounded-full text-xs text-[#6E5D4F] hover:bg-[#F1ECE4] hover:border-[#D5C9B8] transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {dailyPrayers.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white/60 border border-dashed border-[#DFD8CE] rounded-2xl">
                <p className="text-sm text-[#7C7368]">이 날에 생성된 기도문이 없습니다.</p>
                <p className="text-xs text-[#A89F94] mt-1">
                  위 입력창에 기도 제목을 적거나 마음상태 해시태그를 눌러보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dailyPrayers.map((prayerItem) => {
                  const isEditingPrayer = editingPrayerId === prayerItem.id;

                  return (
                    <div key={prayerItem.id} className="flex items-start gap-2.5">
                      <div className="w-11 pt-3 text-right shrink-0">
                        <span className="text-[11px] font-medium text-[#9C8F80] tabular-nums">
                          {prayerItem.time}
                        </span>
                      </div>

                      <article className="flex-1 bg-white border border-[#EAE5DC] rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-semibold text-[#8C6D53] shrink-0">
                              당신을 위한 기도문
                            </span>
                            <span className="text-[#D5CCC0]">·</span>
                            <span className="text-xs text-[#7C7368] truncate">
                              {prayerItem.title}
                            </span>
                          </div>

                          {!isEditingPrayer && (
                            <button
                              type="button"
                              onClick={() => exportPrayerToTimeline(prayerItem)}
                              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#EAE5DC] bg-[#FAF8F5] text-[#8C6D53] hover:bg-[#8C6D53] hover:text-white text-xs font-medium transition"
                            >
                              <Plus className="w-3 h-3" strokeWidth={2} />
                              <span>기록에 넣기</span>
                            </button>
                          )}
                        </div>

                        {isEditingPrayer ? (
                          <div className="space-y-2">
                            <div className="space-y-1.5 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE5DC]">
                              <input
                                type="text"
                                value={editPrayerVerse}
                                onChange={(e) => setEditPrayerVerse(e.target.value)}
                                placeholder="성경 말씀"
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#D8CEC0] bg-white text-[#3D352E] focus:outline-none"
                              />
                              <input
                                type="text"
                                value={editPrayerRef}
                                onChange={(e) => setEditPrayerRef(e.target.value)}
                                placeholder="성경 출처 (예: 잠언 16:3)"
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#D8CEC0] bg-white text-[#8C6D53] focus:outline-none"
                              />
                            </div>

                            <div>
                              <textarea
                                rows={3}
                                maxLength={160}
                                value={editPrayerText}
                                onChange={(e) => setEditPrayerText(e.target.value)}
                                className="w-full p-2.5 text-sm rounded-xl border border-[#D8CEC0] bg-[#FAF8F5] text-[#3D352E] focus:outline-none leading-relaxed"
                              />
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10.5px] text-[#7C7368]">
                                  {editPrayerText.length}/160자
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingPrayerId(null)}
                                    className="px-2.5 py-1 rounded-lg text-xs text-[#7C7368] hover:bg-[#FAF8F5] border border-[#EAE5DC]"
                                  >
                                    취소
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => savePrayerEdit(prayerItem.id)}
                                    className="px-2.5 py-1 rounded-lg text-xs bg-[#7A634C] text-white font-medium"
                                  >
                                    저장
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            {prayerItem.verse && (
                              <div className="bg-[#FAF8F5] border border-[#F0ECE4] rounded-xl px-3 py-2 text-xs text-[#3D352E] leading-relaxed">
                                <span>&ldquo;{prayerItem.verse}&rdquo;</span>
                                {prayerItem.reference && (
                                  <span className="font-semibold text-[#8C6D53] ml-1.5">
                                    ({prayerItem.reference})
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-end justify-between gap-2">
                              <div className="flex-1 min-w-0 border-l-2 border-[#7A634C] pl-3 py-0.5">
                                <p className="text-sm text-[#3D352E] not-italic leading-relaxed whitespace-pre-line">
                                  {prayerItem.text}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 ml-auto shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditingPrayer(prayerItem)}
                                  title="기도문 수정"
                                  className="p-0.5 text-[#B0A699] hover:text-[#7A634C] transition"
                                >
                                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deletePrayerHistoryItem(prayerItem.id)}
                                  title="기도문 삭제"
                                  className="p-0.5 text-[#B0A699] hover:text-[#B85C5C] transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </article>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 첨부 이미지 확대 팝업 (상단 아이콘 전용 다운로드 / 삭제 / 닫기)        */}
      {/* ==================================================================== */}
      {lightboxEntry && (
        <div
          onClick={() => setLightboxEntry(null)}
          className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4"
        >
          {/* 상단 우측 아이콘 전용 버튼 바 */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl flex items-center justify-end gap-2 mb-3"
          >
            <button
              type="button"
              onClick={handleDownloadLightboxImage}
              title="사진 다운로드"
              aria-label="사진 다운로드"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition"
            >
              <Download className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleDeleteLightboxImage}
              title="사진 삭제"
              aria-label="사진 삭제"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-[#B85C5C]/80 text-white transition"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => setLightboxEntry(null)}
              title="닫기"
              aria-label="닫기"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <img
            onClick={(e) => e.stopPropagation()}
            src={lightboxEntry.image}
            alt="확대 이미지"
            className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* D-Day 설정 모달 (최대 3개, 각 8자 제한, 빠른 날짜순 정렬)            */}
      {/* ==================================================================== */}
      {isDdayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DC] rounded-2xl w-full max-w-sm p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#3D352E]">D-Day 설정</h3>
                <p className="text-[11px] text-[#8C7F70] mt-0.5">
                  최대 3개, 각 8자 이내로 등록할 수 있습니다 ({ddays.length}/3)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDdayModalOpen(false);
                  setEditingDdayId(null);
                }}
                className="p-1 text-[#8C7F70] hover:text-[#3D352E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sortedDdays.length > 0 && (
              <div className="space-y-1.5">
                {sortedDdays.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs ${
                      editingDdayId === item.id
                        ? 'border-[#7A634C] bg-[#FAF8F5]'
                        : 'border-[#EAE5DC] bg-[#FAF8F5]/60'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[#7A634C]">
                        {formatSingleDdayLabel(item)}
                      </span>
                      <span className="block text-[10.5px] text-[#8C7F70]">{item.date}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openDdayModal(item)}
                        title="수정"
                        className="p-1 rounded-lg text-[#8C7F70] hover:text-[#3D352E] hover:bg-white transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDday(item.id)}
                        title="삭제"
                        className="p-1 rounded-lg text-[#8C7F70] hover:text-[#B85C5C] hover:bg-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(editingDdayId || ddays.length < 3) && (
              <form onSubmit={saveDday} className="space-y-3 pt-2 border-t border-[#F0ECE4]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#3D352E]">
                    {editingDdayId ? '디데이 수정' : '새 디데이 추가'}
                  </span>
                  {editingDdayId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDdayId(null);
                        setDdayTitleInput('');
                        setDdayDateInput(todayStr);
                      }}
                      className="text-[11px] text-[#8C7F70] hover:underline"
                    >
                      새로 추가하기
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-[#8C7F70]">목표 제목 (최대 8자)</label>
                    <span className="text-[10.5px] text-[#8C7F70]">
                      {ddayTitleInput.length}/8
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={ddayTitleInput}
                    onChange={(e) => setDdayTitleInput(e.target.value.slice(0, 8))}
                    placeholder="예: 한국가는날!"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] text-xs text-[#3D352E] focus:outline-none focus:border-[#7A634C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8C7F70] mb-1">목표 날짜</label>
                  <input
                    type="date"
                    required
                    value={ddayDateInput}
                    onChange={(e) => setDdayDateInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] text-xs text-[#3D352E] focus:outline-none focus:border-[#7A634C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#7A634C] text-white text-xs font-medium rounded-xl hover:bg-[#66523E] transition-colors"
                >
                  {editingDdayId ? '수정 완료' : 'D-Day 추가하기'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3D352E] text-white text-xs px-4 py-2.5 rounded-full shadow-md z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
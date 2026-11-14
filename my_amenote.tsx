import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
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
  Download,
  LogOut,
  Mail,
  Lock,
  User
} from 'lucide-react';

// ============================================================================
// 0. Supabase 클라이언트 초기화
// ============================================================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const isSupabaseConfigured =
  SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ============================================================================
// 1. 미니멀 라인 십자가 아이콘
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
// 2. 다양화된 마음상태별 성경 구절 및 기도문 데이터베이스
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
    },
    {
      verse: '감사로 제사를 드리는 자가 나를 영화롭게 하나니',
      reference: '시편 50:23',
      prayer:
        '은혜로우신 주님, 불평과 아쉬움보다 먼저 주님이 베푸신 선한 것들을 헤아리게 하소서. 제 입술에 감사의 고백이 마르지 않게 하시고, 그 감사가 주변의 마음까지 밝히는 통로가 되게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '내 영혼아 여호와를 송축하며 그의 모든 은택을 잊지 말지어다',
      reference: '시편 103:2',
      prayer:
        '신실하신 하나님, 지나온 시간마다 붙들어 주신 주님의 손길을 잊지 않게 하소서. 오늘 마주하는 작은 기쁨에도 깊이 감사하며, 주님 한 분만으로 만족하는 하루를 살게 하소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '그러므로 너희가 회개하고 돌이켜 너희 죄 없이 함을 받으라',
      reference: '사도행전 3:19',
      prayer:
        '긍휼의 주님, 주님보다 세상을 더 의지하고 조급해했던 제 마음을 돌이킵니다. 숨겨진 연약함까지 주의 보혈로 깨끗이 씻어주시고, 주님 기뻐하시는 정직한 걸음으로 회복시켜 주소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '여호와여 나의 입에 파수꾼을 세우시고 내 입술의 문을 지키소서',
      reference: '시편 141:3',
      prayer:
        '정결하신 하나님, 제 생각과 입술이 악에 기울지 않도록 친히 파수꾼이 되어 주소서. 상처 주는 말과 헛된 마음을 버리게 하시고, 온유하고 진실한 성품으로 새롭게 빚어 주소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '할 수 있거든이 무슨 말이냐 믿는 자에게는 능히 하지 못할 일이 없느니라',
      reference: '마가복음 9:23',
      prayer:
        '능력의 주님, 제 작은 믿음의 연약함을 불쌍히 여기시고 의심을 거두어 주소서. 상황을 바라보며 작아지지 않게 하시고, 약속을 반드시 이루시는 주님을 의지하여 담대히 나아가게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '오직 의인은 믿음으로 말미암아 살리라',
      reference: '로마서 1:17',
      prayer:
        '살아계신 하나님, 눈에 보이는 조건이 아니라 변치 않는 주의 말씀을 붙들고 살아가게 하소서. 흔들리는 바람 속에서도 뿌리 깊은 나무처럼 주님 안에 굳게 서는 하루가 되게 하소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '내 영혼아 네가 어찌하여 낙심하며 어찌하여 내 속에서 불안해 하는가 너는 하나님께 소망을 두라',
      reference: '시편 42:5',
      prayer:
        '소망의 주님, 한계에 부딪혀 작아진 제 영혼을 불쌍히 여겨 주소서. 제 힘으로는 한 걸음도 내딛기 어려운 이 순간, 주님께 소망을 두게 하시고 다시 숨 쉴 힘과 용기를 허락하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '피곤한 자에게는 능력을 주시며 무능한 자에게는 힘을 더하시나니',
      reference: '이사야 40:29',
      prayer:
        '새 힘을 주시는 하나님, 지치고 무력해진 제 마음과 어깨 위에 주님의 능력을 부어주소서. 넘어져도 아주 엎드러지지 않게 붙들어 주시고, 주의 손길로 다시 일어서는 은혜를 주소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '주께서 심지가 견고한 자를 평강하고 평강하도록 지키시리니 이는 그가 주를 신뢰함이니이다',
      reference: '이사야 26:3',
      prayer:
        '신실하신 주님, 흩어지는 생각과 조급한 마음을 주님께 고정하게 하소서. 환경의 소란함 속에서도 주님을 신뢰함으로 흔들리지 않는 깊은 평강을 누리게 하여 주소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '내가 평안히 눕고 자기도 하리니 나를 안전히 살게 하시는 이는 오직 여호와이시니이다',
      reference: '시편 4:8',
      prayer:
        '보호자 되시는 하나님, 오늘 하루의 모든 수고와 걱정을 주님 손에 온전히 맡깁니다. 근심 없이 평안히 쉬게 하시고, 내일을 살아갈 맑은 정신과 고요한 마음을 허락하소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '여호와를 경외하는 것이 지혜의 근본이요 거룩하신 자를 아는 것이 명철이니라',
      reference: '잠언 9:10',
      prayer:
        '명철의 하나님, 복잡한 문제 앞에서 조급히 판단하지 않고 먼저 주님의 뜻을 구하게 하소서. 선과 악을 분별하는 지혜를 주시고, 말과 행동마다 덕을 세우는 사람이 되게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다',
      reference: '시편 119:105',
      prayer:
        '진리의 주님, 한 치 앞도 알 수 없는 길 위에서 주의 말씀으로 제 발걸음을 비추어 주소서. 어리석은 선택을 피하게 하시고, 주님이 기뻐하시는 가장 선한 방향으로 인도하소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '우리의 모든 환난 중에서 우리를 위로하사',
      reference: '고린도후서 1:4',
      prayer:
        '모든 위로의 하나님, 남몰래 삼킨 눈물과 아픈 마음을 주님께서 다 아심을 믿습니다. 주의 세미한 음성으로 제 심령을 싸매어 주시고, 받은 위로로 다른 이도 품을 수 있게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '여호와는 나의 목자시니 내게 부족함이 없으리로다',
      reference: '시편 23:1',
      prayer:
        '선한 목자 되시는 주님, 메마르고 지친 제 영혼을 푸른 풀밭과 쉴 만한 물가로 인도하소서. 주님 곁에 머무는 이 시간 모든 서러움과 피곤함이 씻어지고 새 생명으로 채워지게 하소서. 예수님 이름으로 기도합니다. 아멘.'
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
    },
    {
      verse: '소망의 하나님이 모든 기쁨과 평강을 믿음 안에서 너희에게 충만하게 하사',
      reference: '로마서 15:13',
      prayer:
        '희망의 주님, 막혀 보이는 현실 너머에 예비하신 주님의 선한 때를 기대합니다. 성령의 능력으로 제 안에 기쁨과 소망이 넘치게 하시고, 오늘의 작은 순종이 복된 내일로 이어지게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    },
    {
      verse: '보라 내가 새 일을 행하리니 이제 나타낼 것이라',
      reference: '이사야 43:19',
      prayer:
        '창조주 하나님, 지나간 아쉬움에 매이지 않고 주님이 행하실 새 일을 바라봅니다. 광야에 길을 내시는 주님의 능력을 신뢰하오니, 기대하는 마음으로 오늘을 성실히 살아가게 하소서. 예수님 이름으로 기도합니다. 아멘.'
    }
  ]
};

const QUICK_HASHTAGS = ['감사', '회개', '믿음', '좌절', '평안', '지혜', '위로', '소망'];

// ============================================================================
// 3. 주제 맞춤형 구체적 기도문 & 다양한 성경 말씀 생성 엔진
// ============================================================================
const buildCustomVerseAndPrayer = (topic, variantSeed = 0) => {
  const cleanTopic = topic.trim().replace(/[.!?]+$/, '');

  // 주제명에서 '기도', '하기', '하도록' 등 끝맺음 단어를 자연스럽게 정제하여 기도문 문맥에 녹임
  const subjectCore = cleanTopic
    .replace(/\s*(기도|기도문|제목)$/g, '')
    .trim();

  // 1) 말, 언어, 입술, 비난, 화냄 관련 주제
  if (/말|입술|욕|비난|험담|화내|짜증|분노|언어|대답|표현/.test(cleanTopic)) {
    const verses = [
      {
        verse: '여호와여 나의 입에 파수꾼을 세우시고 내 입술의 문을 지키소서',
        reference: '시편 141:3'
      },
      {
        verse: '무릇 더러운 말은 너희 입 밖에도 내지 말고 오직 덕을 세우는 데 소용되는 대로 선한 말을 하여',
        reference: '에베소서 4:29'
      },
      {
        verse: '유순한 대답은 분노를 쉬게 하여도 과격한 말은 노를 격동하느니라',
        reference: '잠언 15:1'
      },
      {
        verse: '내 입의 말과 마음의 묵상이 주님 앞에 열납되기를 원하나이다',
        reference: '시편 19:14'
      }
    ];
    const prayers = [
      `주님, 제 생각과 감정이 나쁘게 흐르지 않도록 붙들어 주소서. 순간의 감정으로 나쁜 말이나 상처 주는 말을 입에 담지 않게 하시고, 언제나 온유하고 덕을 세우는 선한 말만 흘려보내게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
      `거룩하신 하나님, 제 입술에 파수꾼을 세워 주소서. '${subjectCore}'의 제목처럼, 악하고 거친 말이 입 밖으로 나오지 않게 하시고, 마음의 묵상부터 정결하게 다스려 주셔서 듣는 이에게 평안을 전하게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
      `온유하신 주님, 조급함과 분노가 올라올 때마다 제 입술의 문을 지켜 주소서. 나쁜 말이나 원망을 입에 담지 않게 하시고, 지혜롭고 따뜻한 언어로 주님의 성품을 닮아가게 하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 2) 용서, 관계, 화해, 미움 관련 주제
  if (/용서|화해|미움|관계|갈등|오해|친구|동료|이웃|사람/.test(cleanTopic)) {
    const verses = [
      {
        verse: '서로 친절하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라',
        reference: '에베소서 4:32'
      },
      {
        verse: '모든 겸손과 온유로 하고 오래 참음으로 사랑 가운데서 서로 용납하고',
        reference: '에베소서 4:2'
      },
      {
        verse: '할 수 있거든 너희로서는 모든 사람과 더불어 화목하라',
        reference: '로마서 12:18'
      }
    ];
    const prayers = [
      `사랑의 주님, '${subjectCore}'의 문제를 주님 앞에 내어놓습니다. 제 힘으로는 품기 어려운 마음과 서운함을 녹여주시고, 주님이 저를 먼저 용서하신 것처럼 상대방을 이해하고 화목할 수 있는 넓은 마음을 주소서. 예수님 이름으로 기도합니다. 아멘.`,
      `화평의 하나님, 어그러진 관계와 오해 속에 주님의 치유를 부어주소서. 미움이나 원망이 제 마음에 뿌리내리지 않게 하시고, 겸손과 온유함으로 먼저 손을 내밀 수 있는 용기를 허락하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 3) 시험, 합격, 공부, 입시 관련 주제
  if (/합격|시험|입시|수능|자격증|공부|대학|성적/.test(cleanTopic)) {
    const verses = [
      {
        verse: '강하고 담대하라 두려하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라',
        reference: '여호수아 1:9'
      },
      {
        verse: '내가 네게 지혜로운 길을 가르쳤으며 정직한 길로 너를 인도하였은즉',
        reference: '잠언 4:11'
      },
      {
        verse: '여호와를 경외하는 자에게는 견고한 의뢰가 있나니 그 자녀들에게 피난처가 있으리라',
        reference: '잠언 14:26'
      }
    ];
    const prayers = [
      `주님, '${subjectCore}'의 과정을 친히 붙들어 주소서. 그동안 성실히 준비한 노력들이 헛되지 않게 하시고, 시험의 순간마다 긴장감은 거두시며 배운 모든 것이 밝히 기억나도록 지혜와 평안을 부어주소서. 예수님 이름으로 기도합니다. 아멘.`,
      `지혜의 근원이신 하나님, 중요한 결실을 앞둔 이 걸음 위에 함께하여 주소서. 두려움이나 조급함 대신 담대한 마음을 주시고, 최선의 실력을 후회 없이 발휘하여 가장 선한 열매를 맺게 하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 4) 미팅, 면접, 발표, 대화 관련 주제
  if (/미팅|면접|인터뷰|발표|회의/.test(cleanTopic)) {
    const verses = [
      {
        verse: '지혜로운 자의 마음은 그의 입을 슬기롭게 하고 또 그의 입술에 지식을 더하느니라',
        reference: '잠언 16:23'
      },
      {
        verse: '그 때에 너희에게 할 말을 주시리니 말하는 이는 너희가 아니라 너희 속에서 말씀하시는 이 곧 너희 아버지의 성령이시니라',
        reference: '마태복음 10:19-20'
      },
      {
        verse: '너희 말을 항상 은혜 가운데서 소금으로 맛을 냄과 같이 하라 그리하면 각 사람에게 마땅히 대답할 것을 알리라',
        reference: '골로새서 4:6'
      }
    ];
    const prayers = [
      `지혜와 화평의 주님, '${subjectCore}'의 자리에 함께하여 주소서. 긴장된 마음을 부드럽게 하시고 꼭 필요한 지혜로운 말을 허락하사, 준비한 생각들이 조리 있게 전달되며 선한 결실로 이어지게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
      `선한 목자 되시는 하나님, 오늘 마주하는 만남과 대화 속에서 주님의 명철로 입술을 주관하소서. 상대방의 마음을 여는 진실함과 지혜를 주셔서 모든 과정이 순적하게 풀리게 하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 5) 건강, 치유, 회복, 아픔 관련 주제
  if (/건강|치유|회복|아픔|병원|수술|치료|통증|잠|불면/.test(cleanTopic)) {
    const verses = [
      {
        verse: '내 영혼아 여호와를 송축하며 그의 모든 은택을 잊지 말지어다 그가 네 모든 병을 고치시며',
        reference: '시편 103:2-3'
      },
      {
        verse: '여호와여 주는 나의 찬송이시오니 나를 고치소서 그리하시면 내가 낫겠나이다',
        reference: '예레미야 17:14'
      },
      {
        verse: '내 이름으로 경외하는 너희에게는 공의로운 해가 떠올라서 치료하는 광선을 비추리니',
        reference: '말라기 4:2'
      }
    ];
    const prayers = [
      `치유의 하나님, '${subjectCore}'의 간구를 주님께 드립니다. 연약해진 육신과 지친 마음을 주님의 권능의 손길로 어루만져 주시고, 모든 아픔과 불편함을 깨끗이 씻어주사 온전한 강건함을 회복하게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
      `생명의 주인이신 주님, 회복을 구하는 이 시간 치료의 광선을 비추어 주소서. 밤낮으로 평안한 쉼을 주시고 막힌 곳을 뚫어주시어, 다시 건강한 몸과 마음으로 주님을 찬양하게 하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 6) 가족, 부모, 자녀, 가정 관련 주제
  if (/가족|부모|자녀|아이|딸|아들|남편|아내|가정|엄마|아빠/.test(cleanTopic)) {
    const verses = [
      {
        verse: '오직 나와 내 집은 여호와를 섬기겠노라',
        reference: '여호수아 24:15'
      },
      {
        verse: '여호와께서 집을 세우지 아니하시면 세우는 자의 수고가 헛되며',
        reference: '시편 127:1'
      },
      {
        verse: '주 예수를 믿으라 그리하면 너와 네 집이 구원을 받으리라',
        reference: '사도행전 16:31'
      }
    ];
    const prayers = [
      `사랑의 하나님, '${subjectCore}'을 위해 간절히 기도합니다. 사랑하는 가족의 걸음마다 주님의 은혜의 울타리로 지켜주시고, 서로를 향한 따뜻한 이해와 배려가 넘치며 영육 간에 강건함을 누리게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
      `은혜로우신 주님, 우리 가정의 주인이 되어 주소서. 각자의 삶의 자리마다 주님의 선하신 보호하심이 머물게 하시고, 어떤 상황 속에서도 믿음 안에서 하나 되어 감사가 피어나는 가정 되게 하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 7) 여행, 출국, 귀국, 안전, 운전 관련 주제
  if (/여행|출국|귀국|안전|길|이사|운전|한국|비행/.test(cleanTopic)) {
    const verses = [
      {
        verse: '여호와께서 너의 출입을 지금부터 영원까지 지키시리로다',
        reference: '시편 121:8'
      },
      {
        verse: '그가 너를 위하여 그의 천사들을 명령하사 네 모든 길에서 너를 지키게 하심이라',
        reference: '시편 91:11'
      },
      {
        verse: '보라 내가 너와 함께 있어 네가 어디로 가든지 너를 지키며 너를 이끌어 이 땅으로 돌아오게 할지라',
        reference: '창세기 28:15'
      }
    ];
    const prayers = [
      `눈동자같이 지키시는 하나님, '${subjectCore}'의 모든 여정 위에 안전함으로 함께하여 주소서. 오가는 길과 머무는 자리마다 예기치 못한 위험에서 보호해 주시고, 평안하고 기쁜 발걸음이 되게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
      `선한 인도자 되시는 주님, 출입을 영원까지 지키시는 약속을 의지합니다. 모든 일정과 이동이 순적하게 풀리게 하시고, 함께하는 이들과 안전하고 복된 시간을 누리도록 인도하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 8) 직장, 취업, 일, 사업, 재정 관련 주제
  if (/직장|취업|일|사업|프로젝트|이직|재정|돈|경제|물질/.test(cleanTopic)) {
    const verses = [
      {
        verse: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
        reference: '빌립보서 4:13'
      },
      {
        verse: '네 손이 수고한 대로 먹을 것이라 네가 복되고 형통하리로다',
        reference: '시편 128:2'
      },
      {
        verse: '나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라',
        reference: '빌립보서 4:19'
      }
    ];
    const prayers = [
      `능력 주시는 하나님, '${subjectCore}'의 문제를 주님 손에 맡겨드립니다. 맡겨진 자리에서 지혜와 성실함으로 행하게 하시고, 막힌 길은 열어주시며 모든 필요와 쓸 것을 선하게 채워주소서. 예수님 이름으로 기도합니다. 아멘.`,
      `신실하신 주님, 일터와 삶의 자리에서 지치지 않도록 새 힘을 부어주소서. 염려 대신 담대한 믿음을 주시고, 수고의 땀방울마다 정직하고 아름다운 열매를 맺도록 인도하소서. 예수님 이름으로 기도합니다. 아멘.`
    ];
    const pickedVerse = verses[variantSeed % verses.length];
    return {
      verse: pickedVerse.verse,
      reference: pickedVerse.reference,
      prayer: prayers[variantSeed % prayers.length]
    };
  }

  // 9) 그 외 일반 사용자 입력 주제: 입력한 주제 문구를 기도문 안에 직접 녹여 구체화 + 다양한 말씀 순환
  const generalVerses = [
    {
      verse: '너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라',
      reference: '잠언 16:3'
    },
    {
      verse: '구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니',
      reference: '마태복음 7:7'
    },
    {
      verse: '네 길을 여호와께 맡기라 그를 의지하면 그가 이루시고',
      reference: '시편 37:5'
    },
    {
      verse: '너는 내게 부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 네게 보이리라',
      reference: '예레미야 33:3'
    },
    {
      verse: '무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라',
      reference: '마가복음 11:24'
    },
    {
      verse: '여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다',
      reference: '시편 37:4'
    }
  ];

  const generalPrayers = [
    `신실하신 하나님, '${subjectCore}'의 제목을 가지고 주님 앞에 간절히 나아갑니다. 제 뜻과 생각보다 선하신 주님의 손길을 의지하오니, 이 일 가운데 세밀하게 개입하여 주시고 가장 합당한 길과 평안으로 응답하여 주소서. 예수님 이름으로 기도합니다. 아멘.`,
    `은혜의 주님, 오늘 제 마음속 가장 깊은 바람인 '${subjectCore}'을 주님께 아룁니다. 흔들리는 마음은 붙들어 주시고, 제 힘으로 할 수 없는 부분마다 주님의 지혜와 도우심을 더하사 선한 열매로 맺어지게 하소서. 예수님 이름으로 기도합니다. 아멘.`,
    `선하신 목자 되시는 하나님, '${subjectCore}'을 향한 제 간구를 들으시고 응답하여 주소서. 조급함이나 불안을 내려놓고 주님의 때를 신뢰하며 한 걸음씩 순종하게 하시고, 주님이 이루실 선한 일을 기쁨으로 보게 하소서. 예수님 이름으로 기도합니다. 아멘.`
  ];

  const pickedGeneralVerse = generalVerses[variantSeed % generalVerses.length];

  return {
    verse: pickedGeneralVerse.verse,
    reference: pickedGeneralVerse.reference,
    prayer: generalPrayers[variantSeed % generalPrayers.length]
  };
};

// ============================================================================
// 4. 유틸리티 함수
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
// 5. 메인 App 컴포넌트
// ============================================================================
export default function App() {
  // 인증 및 모달 상태
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const todayStr = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState('records');
  const [calendarMode, setCalendarMode] = useState('week');
  const [monthCursor, setMonthCursor] = useState(() => {
    const [y, m] = todayStr.split('-').map(Number);
    return new Date(y, m - 1, 1);
  });

  // 데이터 상태 (비로그인 시 localStorage 사용, 로그인 시 Supabase 클라우드 연동)
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('amenote_v1_entries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [prayerHistory, setPrayerHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('amenote_v1_prayer_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ddays, setDdays] = useState(() => {
    try {
      const saved = localStorage.getItem('amenote_v1_ddays');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputText, setInputText] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editEntryText, setEditEntryText] = useState('');

  const [lightboxEntry, setLightboxEntry] = useState(null);

  const [prayerTopicInput, setPrayerTopicInput] = useState('');
  const [prayerVariantCount, setPrayerVariantCount] = useState(() =>
    Math.floor(Math.random() * 10)
  );
  const [editingPrayerId, setEditingPrayerId] = useState(null);
  const [editPrayerVerse, setEditPrayerVerse] = useState('');
  const [editPrayerRef, setEditPrayerRef] = useState('');
  const [editPrayerText, setEditPrayerText] = useState('');

  const [isDdayModalOpen, setIsDdayModalOpen] = useState(false);
  const [editingDdayId, setEditingDdayId] = useState(null);
  const [ddayTitleInput, setDdayTitleInput] = useState('');
  const [ddayDateInput, setDdayDateInput] = useState(todayStr);

  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ============================================================================
  // Supabase 인증 감지 (설정이 연결된 경우에만 동작)
  // ============================================================================
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로그인 상태일 때는 클라우드 데이터 불러오기, 비로그인일 때는 로컬 저장소 유지
  useEffect(() => {
    if (!supabase || !session) return;

    async function loadCloudData() {
      const { data: entData } = await supabase
        .from('amenote_entries')
        .select('*')
        .order('created_at', { ascending: false });
      if (entData) {
        setEntries(
          entData.map((e) => ({
            id: e.id,
            date: e.date,
            time: e.time,
            type: e.type,
            text: e.text,
            image: e.image,
            verseLine: e.verse_line
          }))
        );
      }

      const { data: prayData } = await supabase
        .from('amenote_prayers')
        .select('*')
        .order('created_at', { ascending: false });
      if (prayData) {
        setPrayerHistory(
          prayData.map((p) => ({
            id: p.id,
            date: p.date,
            time: p.time,
            title: p.title,
            verse: p.verse,
            reference: p.reference,
            text: p.text
          }))
        );
      }

      const { data: ddayData } = await supabase.from('amenote_ddays').select('*');
      if (ddayData) {
        setDdays(
          ddayData.map((d) => ({
            id: d.id,
            title: d.title,
            date: d.date
          }))
        );
      }
    }

    loadCloudData();
  }, [session]);

  // 비로그인 상태일 때 localStorage 동기화
  useEffect(() => {
    if (session) return;
    try {
      localStorage.setItem('amenote_v1_entries', JSON.stringify(entries));
    } catch {
      // 용량 초과 방지
    }
  }, [entries, session]);

  useEffect(() => {
    if (session) return;
    try {
      localStorage.setItem('amenote_v1_prayer_history', JSON.stringify(prayerHistory));
    } catch {
      // ignore
    }
  }, [prayerHistory, session]);

  useEffect(() => {
    if (session) return;
    try {
      localStorage.setItem('amenote_v1_ddays', JSON.stringify(ddays));
    } catch {
      // ignore
    }
  }, [ddays, session]);

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    if (!supabase) {
      showToast('Supabase 키 설정 후 구글 로그인이 활성화됩니다');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      showToast('구글 로그인 오류: ' + error.message);
    }
  };

  // 이메일 로그인/회원가입 핸들러
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!supabase) {
      showToast('Supabase 키 설정 후 로그인이 활성화됩니다');
      return;
    }
    if (!emailInput || !passwordInput) return;

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: emailInput,
        password: passwordInput
      });
      if (error) {
        showToast(error.message);
      } else {
        showToast('회원가입 완료! 이제 로그인해 주세요.');
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput
      });
      if (error) {
        showToast('로그인 실패: 이메일과 비밀번호를 확인해주세요.');
      } else {
        setIsAuthModalOpen(false);
        showToast('클라우드 계정에 로그인되었습니다');
      }
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setIsAuthModalOpen(false);
    // 로그아웃 후 로컬 저장소 데이터 복원
    try {
      setEntries(JSON.parse(localStorage.getItem('amenote_v1_entries') || '[]'));
      setPrayerHistory(JSON.parse(localStorage.getItem('amenote_v1_prayer_history') || '[]'));
      setDdays(JSON.parse(localStorage.getItem('amenote_v1_ddays') || '[]'));
    } catch {
      setEntries([]);
      setPrayerHistory([]);
      setDdays([]);
    }
    showToast('로그아웃 되었습니다');
  };

  // ============================================================================
  // 수정사항 2: 앱 링크 주소 공유하기
  // ============================================================================
  const handleShareAppLink = async () => {
    const appUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'my Amenote',
          text: 'my day. my story. my prayer.',
          url: appUrl
        });
        return;
      } catch {
        // 사용자가 공유 창을 닫은 경우 클립보드 복사로 이어짐
      }
    }

    try {
      await navigator.clipboard.writeText(appUrl);
      showToast('앱 링크 주소가 복사되었습니다');
    } catch {
      showToast(appUrl);
    }
  };

  // ============================================================================
  // 입력창 자동 높이 조절
  // ============================================================================
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [inputText]);

  // ============================================================================
  // 이미지 압축
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
  // 오늘의 기록 CRUD (로그인 시 클라우드 / 비로그인 시 로컬 자동 분기)
  // ============================================================================
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !pendingImage) return;

    const baseItem = {
      date: selectedDate,
      time: getCurrentTimeString(),
      type: 'note',
      text: inputText.trim(),
      image: pendingImage
    };

    if (supabase && session) {
      const { data, error } = await supabase
        .from('amenote_entries')
        .insert([{ ...baseItem, user_id: session.user.id }])
        .select()
        .single();

      if (error) {
        showToast('클라우드 저장 오류');
        return;
      }
      setEntries((prev) => [{ ...baseItem, id: data.id }, ...prev]);
    } else {
      setEntries((prev) => [{ ...baseItem, id: Date.now() }, ...prev]);
    }

    setInputText('');
    setPendingImage(null);
  };

  const startEditingEntry = (entry) => {
    setEditingEntryId(entry.id);
    setEditEntryText(entry.text || '');
  };

  const saveEntryEdit = async (id) => {
    const updatedText = editEntryText.trim();

    if (supabase && session) {
      const { error } = await supabase
        .from('amenote_entries')
        .update({ text: updatedText })
        .eq('id', id);
      if (error) {
        showToast('수정 실패');
        return;
      }
    }

    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: updatedText } : item))
    );
    setEditingEntryId(null);
    setEditEntryText('');
    showToast('기록이 수정되었습니다');
  };

  const deleteEntry = async (id) => {
    if (supabase && session) {
      const { error } = await supabase.from('amenote_entries').delete().eq('id', id);
      if (error) {
        showToast('삭제 실패');
        return;
      }
    }

    setEntries((prev) => prev.filter((item) => item.id !== id));
    if (editingEntryId === id) setEditingEntryId(null);
    showToast('기록이 삭제되었습니다');
  };

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

  const handleDeleteLightboxImage = async () => {
    if (!lightboxEntry) return;
    const targetId = lightboxEntry.id;
    const target = entries.find((e) => e.id === targetId);
    if (!target) return;

    if (!target.text || !target.text.trim()) {
      await deleteEntry(targetId);
    } else {
      if (supabase && session) {
        await supabase.from('amenote_entries').update({ image: null }).eq('id', targetId);
      }
      setEntries((prev) =>
        prev.map((item) => (item.id === targetId ? { ...item, image: null } : item))
      );
    }
    setLightboxEntry(null);
    showToast('이미지가 삭제되었습니다');
  };

  // ============================================================================
  // 말씀과 기도 CRUD
  // ============================================================================
  const handleGeneratePrayer = async (moodTag = null) => {
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

    const basePrayer = {
      date: selectedDate,
      time: getCurrentTimeString(),
      title: titleLabel,
      verse: generated.verse,
      reference: generated.reference,
      text: generated.prayer
    };

    if (supabase && session) {
      const { data, error } = await supabase
        .from('amenote_prayers')
        .insert([{ ...basePrayer, user_id: session.user.id }])
        .select()
        .single();

      if (error) {
        showToast('기도문 저장 오류');
        return;
      }
      setPrayerHistory((prev) => [{ ...basePrayer, id: data.id }, ...prev]);
    } else {
      setPrayerHistory((prev) => [{ ...basePrayer, id: Date.now() }, ...prev]);
    }
  };

  const startEditingPrayer = (item) => {
    setEditingPrayerId(item.id);
    setEditPrayerVerse(item.verse || '');
    setEditPrayerRef(item.reference || '');
    setEditPrayerText(item.text || '');
  };

  const savePrayerEdit = async (id) => {
    const trimmedText = editPrayerText.trim();
    if (!trimmedText) return;

    const updates = {
      verse: editPrayerVerse.trim(),
      reference: editPrayerRef.trim(),
      text: trimmedText
    };

    if (supabase && session) {
      const { error } = await supabase.from('amenote_prayers').update(updates).eq('id', id);
      if (error) {
        showToast('수정 실패');
        return;
      }
    }

    setPrayerHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setEditingPrayerId(null);
    showToast('기도문이 수정되었습니다');
  };

  const deletePrayerHistoryItem = async (id) => {
    if (supabase && session) {
      const { error } = await supabase.from('amenote_prayers').delete().eq('id', id);
      if (error) {
        showToast('삭제 실패');
        return;
      }
    }

    setPrayerHistory((prev) => prev.filter((item) => item.id !== id));
    if (editingPrayerId === id) setEditingPrayerId(null);
    showToast('기도문이 삭제되었습니다');
  };

  const exportPrayerToTimeline = async (prayerItem) => {
    if (!prayerItem?.text) return;
    const verseWithRef = prayerItem.verse
      ? prayerItem.reference
        ? `"${prayerItem.verse}" (${prayerItem.reference})`
        : `"${prayerItem.verse}"`
      : '';

    const baseEntry = {
      date: selectedDate,
      time: prayerItem.time || getCurrentTimeString(),
      type: 'prayer',
      verseLine: verseWithRef,
      text: prayerItem.text,
      image: null
    };

    if (supabase && session) {
      const { data, error } = await supabase
        .from('amenote_entries')
        .insert([
          {
            user_id: session.user.id,
            date: baseEntry.date,
            time: baseEntry.time,
            type: baseEntry.type,
            verse_line: baseEntry.verseLine,
            text: baseEntry.text,
            image: null
          }
        ])
        .select()
        .single();

      if (error) {
        showToast('기록 전송 실패');
        return;
      }
      setEntries((prev) => [{ ...baseEntry, id: data.id }, ...prev]);
    } else {
      setEntries((prev) => [{ ...baseEntry, id: Date.now() }, ...prev]);
    }

    showToast('오늘의 기록에 담겼습니다');
  };

  // ============================================================================
  // D-Day 계산 및 CRUD
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

  const saveDday = async (e) => {
    e.preventDefault();
    if (!ddayTitleInput.trim() || !ddayDateInput) return;

    const cleanTitle = ddayTitleInput.trim().slice(0, 8);
    const targetDate = ddayDateInput;
    const milestoneText = `${formatShortDayMonth(targetDate)} ${cleanTitle}`;

    if (editingDdayId) {
      if (supabase && session) {
        const { error } = await supabase
          .from('amenote_ddays')
          .update({ title: cleanTitle, date: targetDate })
          .eq('id', editingDdayId);
        if (error) {
          showToast('디데이 수정 실패');
          return;
        }
      }

      setDdays((prev) =>
        prev.map((d) =>
          d.id === editingDdayId ? { ...d, title: cleanTitle, date: targetDate } : d
        )
      );
      showToast('디데이가 수정되었습니다');
    } else {
      if (ddays.length >= 3) {
        showToast('디데이는 최대 3개까지 등록할 수 있습니다');
        return;
      }

      if (supabase && session) {
        const { data, error } = await supabase
          .from('amenote_ddays')
          .insert([{ user_id: session.user.id, title: cleanTitle, date: targetDate }])
          .select()
          .single();

        if (error) {
          showToast('디데이 추가 실패');
          return;
        }

        const { data: entryData } = await supabase
          .from('amenote_entries')
          .insert([
            {
              user_id: session.user.id,
              date: targetDate,
              time: 'D-Day',
              type: 'dday',
              text: milestoneText,
              image: null
            }
          ])
          .select()
          .single();

        setDdays((prev) => [...prev, { id: data.id, title: data.title, date: data.date }]);
        if (entryData) {
          setEntries((prev) => [
            {
              id: entryData.id,
              date: targetDate,
              time: 'D-Day',
              type: 'dday',
              text: milestoneText,
              image: null
            },
            ...prev
          ]);
        }
      } else {
        const newId = Date.now();
        setDdays((prev) => [...prev, { id: newId, title: cleanTitle, date: targetDate }]);
        setEntries((prev) => [
          {
            id: newId + 1,
            date: targetDate,
            time: 'D-Day',
            type: 'dday',
            text: milestoneText,
            image: null
          },
          ...prev
        ]);
      }

      showToast('디데이와 목표 날짜 기록이 추가되었습니다');
    }

    setEditingDdayId(null);
    setDdayTitleInput('');
    setDdayDateInput(todayStr);
    setIsDdayModalOpen(false);
  };

  const removeDday = async (id) => {
    if (supabase && session) {
      const { error } = await supabase.from('amenote_ddays').delete().eq('id', id);
      if (error) {
        showToast('삭제 실패');
        return;
      }
    }

    setDdays((prev) => prev.filter((d) => d.id !== id));
    if (editingDdayId === id) {
      setEditingDdayId(null);
      setDdayTitleInput('');
    }
    showToast('디데이가 삭제되었습니다');
  };

  // ============================================================================
  // 날짜 데이터 및 캘린더 계산
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

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // ============================================================================
  // 렌더링 (비로그인 시에도 즉시 메인 화면 노출)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3D352E] font-sans pb-16 selection:bg-[#E8DFD3]">
      <div className="max-w-xl mx-auto px-4 pt-6">
        {/* 상단 헤더 & 미니 로그인/공유 컨트롤 */}
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

              <button
                type="button"
                onClick={() => openDdayModal()}
                className="px-3 py-1.5 text-xs font-medium bg-white border border-[#EAE5DC] rounded-full text-[#5C4F42] hover:bg-[#F5F0E8] transition-colors"
              >
                D-Day
              </button>

              {/* 수정사항 2: 앱 링크 주소 공유 버튼 */}
              <button
                type="button"
                onClick={handleShareAppLink}
                title="앱 링크 주소 공유하기"
                className="p-2 bg-white border border-[#EAE5DC] rounded-full text-[#5C4F42] hover:bg-[#F5F0E8] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>

              {/* 수정사항 1: 상단 구석 조그만 로그인 / 계정 버튼 */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                title={session ? `${session.user.email} (클라우드 연동됨)` : '클라우드 로그인'}
                className={`p-2 border rounded-full transition-colors ${
                  session
                    ? 'bg-[#7A634C] border-[#7A634C] text-white'
                    : 'bg-white border-[#EAE5DC] text-[#5C4F42] hover:bg-[#F5F0E8]'
                }`}
              >
                <User className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </div>

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

        {/* 캘린더 영역 */}
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

        {/* 탭 네비게이션 */}
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

        {/* TAB 1: 오늘의 기록 */}
        {activeTab === 'records' && (
          <main>
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

              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="지금 떠오르는 생각이나 일정을 남겨보세요..."
                  className="flex-1 text-sm bg-transparent text-[#3D352E] placeholder-[#B0A699] focus:outline-none py-1.5 resize-none leading-relaxed overflow-y-auto"
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
                            {entry.verseLine && (
                              <div className="border-l-2 border-[#7A634C] pl-2.5 mb-2 text-xs text-[#5C4F42] leading-relaxed">
                                {entry.verseLine}
                              </div>
                            )}

                            {/* 수정사항 3: 기도문 및 본문이 오른쪽 끝까지 일직선으로 꽉 차게 정렬되도록 구조 개선 */}
                            {entry.text && (
                              <p className="w-full text-sm text-[#3D352E] not-italic leading-relaxed whitespace-pre-wrap break-words">
                                {entry.text}
                              </p>
                            )}

                            <div className="flex items-center justify-end gap-1.5 mt-1.5">
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
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* TAB 2: 말씀과 기도 */}
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
                  placeholder="예: 나쁜 말을 하지 않게 기도, OO의 대학 합격"
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
                                value={editPrayerText}
                                onChange={(e) => setEditPrayerText(e.target.value)}
                                className="w-full p-2.5 text-sm rounded-xl border border-[#D8CEC0] bg-[#FAF8F5] text-[#3D352E] focus:outline-none leading-relaxed"
                              />
                              <div className="flex items-center justify-end gap-1 mt-1">
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

                            <div>
                              <div className="w-full border-l-2 border-[#7A634C] pl-3 py-0.5">
                                <p className="text-sm text-[#3D352E] not-italic leading-relaxed whitespace-pre-line">
                                  {prayerItem.text}
                                </p>
                              </div>

                              <div className="flex items-center justify-end gap-1.5 mt-1.5">
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

      {/* 수정사항 1: 상단 작은 아이콘 클릭 시 열리는 클라우드 로그인/구글 로그인 모달 */}
      {isAuthModalOpen && (
        <div
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#EAE5DC] rounded-3xl w-full max-w-sm p-6 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#3D352E]">클라우드 동기화 계정</h3>
                <p className="text-xs text-[#8C7F70] mt-0.5">
                  로그인하면 맥북과 아이폰에서 기록이 실시간 연동됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 text-[#8C7F70] hover:text-[#3D352E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {session ? (
              <div className="space-y-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] text-xs space-y-1">
                  <span className="text-[#8C7F70] block">현재 연동된 계정</span>
                  <span className="font-semibold text-[#3D352E] block">{session.user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-[#E5C9C9] bg-[#FAF0F0] text-[#B85C5C] text-xs font-medium hover:bg-[#F5E2E2] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Google 로그인 버튼 */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl border border-[#EAE5DC] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#3D352E] transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                    />
                  </svg>
                  <span>Google 계정으로 계속하기</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#F0ECE4]"></div>
                  <span className="flex-shrink mx-2 text-[10.5px] text-[#B0A699]">또는 이메일로</span>
                  <div className="flex-grow border-t border-[#F0ECE4]"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-2.5">
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-3.5 h-3.5 text-[#B0A699]" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="이메일 주소"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] text-xs text-[#3D352E] focus:outline-none focus:border-[#7A634C]"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-3.5 h-3.5 text-[#B0A699]" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="비밀번호"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE5DC] bg-[#FAF8F5] text-xs text-[#3D352E] focus:outline-none focus:border-[#7A634C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#7A634C] text-white text-xs font-medium rounded-xl hover:bg-[#66523E] transition-colors"
                  >
                    {isSignUp ? '무료 계정 만들기' : '이메일로 로그인'}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[11px] text-[#8C6D53] hover:underline"
                  >
                    {isSignUp
                      ? '이미 계정이 있으신가요? 로그인하기'
                      : '계정이 없으신가요? 무료 회원가입'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 이미지 확대 모달 */}
      {lightboxEntry && (
        <div
          onClick={() => setLightboxEntry(null)}
          className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl flex items-center justify-end gap-2 mb-3"
          >
            <button
              type="button"
              onClick={handleDownloadLightboxImage}
              title="사진 다운로드"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition"
            >
              <Download className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleDeleteLightboxImage}
              title="사진 삭제"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-[#B85C5C]/80 text-white transition"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => setLightboxEntry(null)}
              title="닫기"
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

      {/* D-Day 설정 모달 */}
      {isDdayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE5DC] rounded-2xl w-full max-w-sm p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#3D352E]">D-Day 설정</h3>
                <p className="text-[11px] text-[#8C7F70] mt-0.5">
                  최대 3개, 각 8자 이내 ({ddays.length}/3)
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
                    <span className="text-[10.5px] text-[#8C7F70]">{ddayTitleInput.length}/8</span>
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#3D352E] text-white text-xs px-4 py-2.5 rounded-full shadow-md z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

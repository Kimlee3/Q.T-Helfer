const BOOK_CONTEXT = {
  창세기: {
    de: 'Genesis',
    type: { ko: '율법서 / 시작의 이야기', de: 'Tora / Ursprungserzählung' },
    setting: {
      ko: '창조, 타락, 언약, 족장들의 이야기를 통해 하나님이 세상을 어떻게 시작하시고 한 사람과 한 가정을 통해 구원의 흐름을 여시는지 보여줍니다.',
      de: 'Genesis erzählt von Schöpfung, Fall, Bund und den Erzvätern. Das Buch zeigt, wie Gott den Anfang setzt und durch eine Familie seine Heilsgeschichte eröffnet.',
    },
    lens: {
      ko: '“하나님이 무엇을 시작하시는가, 사람은 어떻게 응답하거나 실패하는가”를 보며 읽어보세요.',
      de: 'Achte darauf, was Gott beginnt und wie Menschen darauf antworten oder daran scheitern.',
    },
  },
  출애굽기: {
    de: 'Exodus',
    type: { ko: '구원과 언약의 이야기', de: 'Befreiung und Bund' },
    setting: {
      ko: '이스라엘이 애굽의 종살이에서 구원받고, 광야에서 하나님의 백성으로 세워지는 과정을 담고 있습니다.',
      de: 'Exodus beschreibt die Befreiung Israels aus Ägypten und wie das Volk in der Wüste als Gottes Bundesvolk geformt wird.',
    },
    lens: {
      ko: '구원, 예배, 순종, 하나님의 임재라는 흐름을 따라 읽으면 본문이 더 선명해집니다.',
      de: 'Lies den Text entlang der Themen Rettung, Anbetung, Gehorsam und Gottes Gegenwart.',
    },
  },
  시편: {
    de: 'Psalmen',
    type: { ko: '기도와 찬양의 시', de: 'Gebete und Lieder' },
    setting: {
      ko: '기쁨, 두려움, 분노, 회개, 신뢰를 하나님 앞에 숨기지 않고 가져가는 기도문 모음입니다.',
      de: 'Die Psalmen bringen Freude, Angst, Zorn, Umkehr und Vertrauen offen vor Gott.',
    },
    lens: {
      ko: '본문의 감정을 먼저 찾고, 그 감정이 하나님께 어떻게 향하는지 살펴보세요.',
      de: 'Suche zuerst die Emotion des Psalms und beobachte, wie sie sich Gott zuwendet.',
    },
  },
  잠언: {
    de: 'Sprüche',
    type: { ko: '지혜문학', de: 'Weisheitsliteratur' },
    setting: {
      ko: '일상, 말, 돈, 관계, 성품 속에서 하나님을 경외하는 지혜가 어떻게 드러나는지 알려줍니다.',
      de: 'Die Sprüche zeigen, wie Gottesfurcht im Alltag, in Worten, Geld, Beziehungen und Charakter sichtbar wird.',
    },
    lens: {
      ko: '오늘 내 말과 선택, 습관에 바로 적용할 한 문장을 찾아보세요.',
      de: 'Suche einen Satz, der heute direkt auf Worte, Entscheidungen oder Gewohnheiten anwendbar ist.',
    },
  },
  이사야: {
    de: 'Jesaja',
    type: { ko: '예언서', de: 'Prophetie' },
    setting: {
      ko: '심판과 회복, 거룩하신 하나님, 장차 오실 구원과 메시아의 소망을 함께 보여주는 큰 예언서입니다.',
      de: 'Jesaja verbindet Gericht und Wiederherstellung, Gottes Heiligkeit und die Hoffnung auf den kommenden Retter.',
    },
    lens: {
      ko: '죄를 드러내는 말씀과 회복을 약속하는 말씀을 함께 붙잡아 보세요.',
      de: 'Halte Gerichtsworte und Verheißungen der Wiederherstellung zusammen.',
    },
  },
  마태복음: {
    de: 'Matthäus',
    type: { ko: '복음서', de: 'Evangelium' },
    setting: {
      ko: '예수님을 약속된 왕과 메시아로 소개하며, 하나님 나라의 삶과 제자도를 강조합니다.',
      de: 'Matthäus stellt Jesus als verheißenen König und Messias vor und betont Reich Gottes und Nachfolge.',
    },
    lens: {
      ko: '예수님이 어떤 왕으로 드러나는지, 제자는 어떻게 살아야 하는지에 주목해보세요.',
      de: 'Achte darauf, was für ein König Jesus ist und wie Nachfolge konkret aussieht.',
    },
  },
  마가복음: {
    de: 'Markus',
    type: { ko: '복음서', de: 'Evangelium' },
    setting: {
      ko: '빠른 전개 속에서 예수님의 권위, 고난, 섬김을 선명하게 보여줍니다.',
      de: 'Markus zeigt in schnellem Tempo Jesu Autorität, Leiden und dienende Hingabe.',
    },
    lens: {
      ko: '예수님이 무엇을 행하시는지, 그 행동이 어떤 믿음의 반응을 부르는지 보세요.',
      de: 'Beobachte, was Jesus tut und welche Antwort des Glaubens dadurch gerufen wird.',
    },
  },
  누가복음: {
    de: 'Lukas',
    type: { ko: '복음서', de: 'Evangelium' },
    setting: {
      ko: '소외된 사람, 가난한 사람, 이방인에게까지 임하는 하나님의 자비와 구원을 강조합니다.',
      de: 'Lukas betont Gottes Barmherzigkeit und Rettung für Arme, Ausgegrenzte und Menschen außerhalb Israels.',
    },
    lens: {
      ko: '예수님의 시선이 누구에게 머무는지, 그 자비가 내 삶을 어떻게 바꾸는지 묵상해보세요.',
      de: 'Achte darauf, wem Jesu Blick gilt und wie seine Barmherzigkeit dein Leben verändert.',
    },
  },
  요한복음: {
    de: 'Johannes',
    type: { ko: '복음서', de: 'Evangelium' },
    setting: {
      ko: '예수님이 하나님의 아들이며 생명의 근원이심을 깊은 대화와 표적을 통해 증언합니다.',
      de: 'Johannes bezeugt durch Zeichen und Gespräche, dass Jesus Gottes Sohn und Quelle des Lebens ist.',
    },
    lens: {
      ko: '본문이 예수님을 누구라고 증언하는지, 그분을 믿는다는 것이 무엇인지 질문해보세요.',
      de: 'Frage, wer Jesus in diesem Text ist und was Glauben an ihn konkret bedeutet.',
    },
  },
  사도행전: {
    de: 'Apostelgeschichte',
    type: { ko: '교회의 시작과 선교', de: 'Anfang der Kirche und Mission' },
    setting: {
      ko: '성령께서 교회를 세우시고 복음이 예루살렘에서 땅끝을 향해 확장되는 이야기를 담고 있습니다.',
      de: 'Die Apostelgeschichte zeigt, wie der Heilige Geist die Kirche baut und das Evangelium sich ausbreitet.',
    },
    lens: {
      ko: '성령의 인도, 공동체의 순종, 복음의 확장을 중심으로 읽어보세요.',
      de: 'Lies mit Blick auf die Führung des Geistes, den Gehorsam der Gemeinde und die Ausbreitung des Evangeliums.',
    },
  },
  로마서: {
    de: 'Römer',
    type: { ko: '복음의 핵심을 설명하는 서신', de: 'Brief über das Zentrum des Evangeliums' },
    setting: {
      ko: '죄, 은혜, 믿음, 의롭다 하심, 성령 안에서의 새 삶을 체계적으로 풀어내는 바울의 편지입니다.',
      de: 'Römer entfaltet Sünde, Gnade, Glauben, Rechtfertigung und das neue Leben im Geist.',
    },
    lens: {
      ko: '하나님이 그리스도 안에서 무엇을 이루셨는지, 그래서 나는 어떻게 살아야 하는지 연결해보세요.',
      de: 'Verbinde, was Gott in Christus getan hat, mit der Frage, wie du nun leben sollst.',
    },
  },
};

const DEFAULT_CONTEXT = {
  ko: {
    type: '성경 본문',
    setting: '이 본문이 속한 책의 큰 흐름을 먼저 보고, 오늘 읽는 구절이 그 흐름 안에서 어떤 역할을 하는지 살펴보세요.',
    lens: '반복되는 단어, 명령, 약속, 하나님이 하시는 일, 사람이 보이는 반응을 천천히 표시하며 읽어보세요.',
  },
  de: {
    type: 'Bibeltext',
    setting: 'Betrachte zuerst den größeren Zusammenhang des biblischen Buches und frage, welche Rolle der heutige Abschnitt darin spielt.',
    lens: 'Achte langsam auf wiederholte Wörter, Gebote, Verheißungen, Gottes Handeln und menschliche Reaktionen.',
  },
};

const BOOK_NAMES = Object.keys(BOOK_CONTEXT).sort((a, b) => b.length - a.length);

function parseReference(reference = '') {
  const normalized = String(reference || '').trim().replace(/\s+/g, ' ');
  const bookName = BOOK_NAMES.find((name) => normalized.includes(name));
  if (!bookName) {
    return null;
  }

  const afterBook = normalized.slice(normalized.indexOf(bookName) + bookName.length);
  const passageMatch = afterBook.match(/(\d+)\s*(?:장|:)\s*(\d+)(?:\s*(?:-|~|–)\s*(\d+))?/);
  if (!passageMatch) {
    return { bookName, chapter: null, startVerse: null, endVerse: null };
  }

  const chapter = Number.parseInt(passageMatch[1], 10);
  const startVerse = Number.parseInt(passageMatch[2], 10);
  const endVerse = passageMatch[3] ? Number.parseInt(passageMatch[3], 10) : startVerse;

  return {
    bookName,
    chapter: Number.isNaN(chapter) ? null : chapter,
    startVerse: Number.isNaN(startVerse) ? null : startVerse,
    endVerse: Number.isNaN(endVerse) ? null : endVerse,
  };
}

function formatReferenceLabel(parsed, locale = 'ko') {
  if (!parsed?.bookName) {
    return locale === 'de' ? 'Aktueller Bibelabschnitt' : '현재 본문';
  }

  const bookLabel = locale === 'de' ? (BOOK_CONTEXT[parsed.bookName]?.de || parsed.bookName) : parsed.bookName;
  if (!parsed.chapter || !parsed.startVerse) {
    return bookLabel;
  }

  const verseRange =
    parsed.startVerse === parsed.endVerse
      ? `${parsed.chapter}:${parsed.startVerse}`
      : `${parsed.chapter}:${parsed.startVerse}-${parsed.endVerse}`;

  return `${bookLabel} ${verseRange}`;
}

function detectPassageThemes(reference = '', passageText = '', locale = 'ko') {
  const source = `${reference}\n${passageText}`.toLowerCase();
  const themes = [];

  const pushTheme = (ko, de) => {
    themes.push(locale === 'de' ? de : ko);
  };

  if (/(믿음|은혜|의롭|복음|구원|grace|glaube|rettung)/.test(source)) {
    pushTheme('복음과 구원의 흐름이 또렷합니다.', 'Die Linie von Evangelium und Rettung tritt deutlich hervor.');
  }
  if (/(기도|부르짖|찬양|감사|gebet|lob|dank)/.test(source)) {
    pushTheme('기도와 찬양의 정서가 본문 중심에 있습니다.', 'Gebet und Lob stehen im Zentrum dieses Abschnitts.');
  }
  if (/(순종|명령|행하|지키|gebot|gehorsam|tun)/.test(source)) {
    pushTheme('읽는 사람의 순종과 반응을 요구하는 본문입니다.', 'Dieser Abschnitt fordert Gehorsam und konkrete Reaktion heraus.');
  }
  if (/(위로|소망|평안|회복|trost|hoffnung|frieden|heilung)/.test(source)) {
    pushTheme('위로와 회복, 소망의 결이 강하게 느껴집니다.', 'Trost, Heilung und Hoffnung praegen diesen Text stark.');
  }
  if (/(죄|회개|심판|경고|sünde|umkehr|gericht|warnung)/.test(source)) {
    pushTheme('죄를 드러내고 돌아섬을 촉구하는 긴장이 있습니다.', 'Der Text entlarvt Sünde und ruft zur Umkehr.');
  }
  if (/(예수|그리스도|주님|jesus|christus|herr)/.test(source)) {
    pushTheme('예수 그리스도가 누구신지 드러내는 데 초점이 있습니다.', 'Der Abschnitt richtet den Blick darauf, wer Jesus Christus ist.');
  }
  if (/(성령|하나님 나라|교회|geist|reich|gemeinde)/.test(source)) {
    pushTheme('성령의 역사와 하나님 나라의 확장이 배경에 깔려 있습니다.', 'Das Wirken des Geistes und die Ausbreitung von Gottes Reich bilden den Hintergrund.');
  }

  return themes.slice(0, 2);
}

function detectReadingLens(reference = '', passageText = '', locale = 'ko') {
  const source = `${reference}\n${passageText}`.toLowerCase();

  if (/(누구|나는|그는|예수|jesus|christus|herr)/.test(source)) {
    return locale === 'de'
      ? 'Frage beim Lesen zuerst, was dieser Abschnitt über Gott oder Christus offenlegt.'
      : '먼저 이 본문이 하나님과 예수 그리스도를 어떻게 드러내는지 질문하며 읽어보세요.';
  }

  if (/(하라|말라|하라\.|하지|gebt|sollt|tut|nicht)/.test(source)) {
    return locale === 'de'
      ? 'Achte darauf, welche konkrete Haltung oder Handlung heute von dir gefordert wird.'
      : '오늘 내 태도와 행동에서 무엇을 바꾸라고 하는지 구체적으로 붙잡아 보세요.';
  }

  if (/(두려워|위로|소망|평안|trost|hoffnung|frieden)/.test(source)) {
    return locale === 'de'
      ? 'Lies den Text als Zuspruch hinein in Angst, Erschöpfung oder Unsicherheit.'
      : '두려움이나 지침 속에 주시는 위로와 소망의 문장에 표시를 해보세요.';
  }

  return locale === 'de'
    ? 'Achte langsam auf wiederholte Wörter, Verbindungen und die Bewegung des Abschnitts.'
    : '반복되는 단어와 문장 흐름을 따라가며, 본문이 어디로 마음을 이끄는지 천천히 살펴보세요.';
}

export function getScriptureContext(reference = '', passageText = '', locale = 'ko') {
  const parsed = parseReference(reference);
  const bookName = parsed?.bookName || BOOK_NAMES.find((name) => reference.includes(name));
  const context = bookName ? BOOK_CONTEXT[bookName] : null;
  const lang = locale === 'de' ? 'de' : 'ko';
  const themes = detectPassageThemes(reference, passageText, lang);
  const dynamicLens = detectReadingLens(reference, passageText, lang);

  if (!context) {
    return {
      book: formatReferenceLabel(parsed, lang),
      type: DEFAULT_CONTEXT[lang].type,
      setting: [DEFAULT_CONTEXT[lang].setting, ...themes].filter(Boolean).join(' '),
      lens: dynamicLens || DEFAULT_CONTEXT[lang].lens,
    };
  }

  const baseSetting = context.setting[lang];
  const chapterHint =
    parsed?.chapter && parsed?.startVerse
      ? lang === 'de'
        ? ` Heute liegt der Fokus auf ${formatReferenceLabel(parsed, lang)}.`
        : ` 오늘 읽는 범위는 ${formatReferenceLabel(parsed, lang)}입니다.`
      : '';

  return {
    book: formatReferenceLabel(parsed || { bookName }, lang),
    type: context.type[lang],
    setting: [baseSetting, chapterHint.trim(), ...themes].filter(Boolean).join(' '),
    lens: dynamicLens || context.lens[lang],
  };
}

(() => {
  const tamilAndHindiBlockedWords = [
    "watha", "otha", "oththa", "thevdiya", "thevidiya", "devidiya", "devadiya", "thayoli", "thaayoli",
    "sunni", "sunnia", "sunniya", "sunnipayal", "sunni paya", "sunni paiya", "sunni paiyan",
    "soothu", "sootha", "soothula", "sothu", "sotha", "sothula",
    "punda", "pundai", "pundaya", "punday", "pundaiya", "pundamavan", "pundamavane", "punda paya", "punda paiya", "punda paiyan", "punda mavane", "punda mavanae",
    "poolu", "poola", "poolai", "pulu", "pula", "poolu paya", "poola paya", "poolu paiyan",
    "kundi", "kundhi", "kundy", "kundiya", "kundila", "kundiku", "kundikku", "kundi paya", "kundi paiyan", "kundi mavane",
    "mayiru", "mayir", "mayire", "mayira", "mayirudi", "mayiruda", "mayiru paya", "mayiru paiya", "mayiru paiyan",
    "potta", "pottai", "pottaya", "pottaiya", "pottai paya", "pottai paiyan",
    "porikki", "porukki", "porikkiya", "porukkiya", "porikki paya", "porukki paya", "porikki paiyan", "porukki paiyan",
    "naaye", "naai", "naayi", "naaye paya", "naai paya", "panni", "panniya", "panni paya", "panni paiyan",
    "eruma", "erumai", "eruma maadu", "erumai maadu", "eruma paya", "erumai paya",
    "loosu", "loosu paya", "loosu paiyan", "kirukku", "kirukkan", "kirukki", "paithiyam", "paithiyakaran", "paithiyakaari",
    "muttaal", "muttaal paya", "muttaal paiyan", "mokka", "mokkaya", "mokka paya", "mokka paiyan",
    "chut", "choot", "chuthiya", "chutiya", "chutiyapa", "chutiyapanti", "chutiyapan", "chutiye", "chuth", "chutya",
    "gaand", "gand", "gandu", "gaanduu", "gandoo", "gaandfat", "gaand mara", "gaandmar", "gaand mar", "gaandmara",
    "bhenchod", "behenchod", "bhenchodd", "behenchodd", "bhenchodh", "behenchodh", "bhenchood", "behenchood", "bhenchoddi", "behenchoddi",
    "madarchod", "madarchodd", "madarchodh", "madarchood", "madarchodi", "madarchode",
    "randi", "rand", "randwa", "randwaa", "randiya", "bhosdika", "bhosdike", "bhosdiki", "bhosda", "bhosdi", "bhosdiwala", "bhosad", "bhosadi", "bhosadike", "bhosadika",
    "lavda", "lauda", "lawda", "loda", "lavde", "laude", "lawde", "lode", "lavdebaaz", "lund", "lodu", "lundbaaz", "lundfakir",
    "chodu", "chod", "chodna", "chodta", "chodunga", "chodam", "chodumal", "chodumalai",
    "harami", "haraami", "haramzada", "haramzade", "haramkhor", "haramzadi", "kamina", "kamine", "kameena", "kaminey", "kameenapan",
    "kutte", "kutta", "kuttiya", "kutti", "kutteya", "kutta sala", "saala", "sala", "saale", "sale", "saali", "sali",
    "nalayak", "nikamma", "nikammi", "nikamme", "bakchod", "bakchodi", "bakchodiya", "bakchodiyan", "jhantu", "jhant", "jhantuya", "jhantoo",
    "chhapri", "chapri", "chhapriya", "ullu", "ullu ka pattha", "gadhe", "gadha", "gadhi", "gadha sala", "suar", "suar ka baccha", "suar ki aulaad",
    "besharam", "beshram", "manhoos", "ghatiya", "ghatiyapan",
    "maa ki chut", "ma ki chut", "madar ki chut", "bhen ki chut", "behen ki chut", "teri maa", "teri behen", "teri bahan",
    "chutiya sala", "chutiya saala", "bakchod sala", "bakchod saala", "harami sala", "harami saala", "kamine sala", "kamine saala", "kutte sala", "kutte saala",
    "maa chod", "maa choda", "maa chodne", "maa chodne wala", "behen choda", "behen chodne", "bhen choda", "bhen chodne"
  ];

  window.BeepitRegionalBlockedWords = tamilAndHindiBlockedWords;
})();
(() => {
  const defaults = {
    enabled: true,
    replacementCharacter: "#",
    blockedWords: [
      "fuck", "fucks", "fucked", "fucking", "fucker", "fuckers", "fuckface", "fuckfaces", "fuckhead", "fuckheads", "fuckwit", "fuckwits", "fuckup", "fuckups", "fuckwad", "fuckwads", "fuckboy", "fuckboys", "fuckass", "fuckasses", "fuckoff", "fuckoffs", "motherfuck", "motherfucker", "motherfuckers", "motherfucking",
      "shit", "shits", "shitty", "shitting", "shithead", "shitheads", "shitface", "shitfaces", "shitbag", "shitbags", "shitshow", "shitshows", "shitstorm", "shitstorms", "bullshit", "bullshits", "bullshitting", "horseshit", "apeshit", "shitwit", "shitwits", "shitbrain", "shitbrains", "shitforbrains",
      "bitch", "bitches", "bitchy", "bitching", "bitchass", "bitchface", "bitchfaces", "sonofabitch",
      "ass", "asses", "asshole", "assholes", "asshat", "asshats", "asshead", "assheads", "assface", "assfaces", "asswipe", "asswipes", "assclown", "assclowns", "assbag", "assbags", "asslick", "asslicker", "asslickers", "asskisser", "asskissers", "assmonkey", "assmonkeys", "assmunch", "assmuncher", "assmunchers", "assmaster", "assmasters", "asswad", "asswads", "asswhole",
      "cunt", "cunts", "cuntface", "cuntfaces", "cunthead", "cuntheads",
      "dick", "dicks", "dickhead", "dickheads", "dickface", "dickfaces", "dickwad", "dickwads", "dickweed", "dickweeds", "dickless", "dickbag", "dickbags", "dickhole", "dickholes", "dickbrain", "dickbrains", "dickshit", "dickshits",
      "piss", "pisses", "pissed", "pissing", "pisser", "pissers", "pisshead", "pissheads", "pissoff", "pissedoff", "pissbrain",
      "cock", "cocks", "cocksucker", "cocksuckers", "cocksucking", "cockhead", "cockheads", "cockface", "cockfaces", "cockass", "cockshit",
      "pussy", "pussies", "pussyass", "pussyhole", "prick", "pricks", "prickhead", "prickheads", "twat", "twats", "twatwaffle", "twatwaffles", "wank", "wanker", "wankers", "wanking", "whore", "whores", "whoring", "slut", "sluts", "slutty", "slag", "skank", "skanks", "skankass",
      "bastard", "bastards", "douche", "douches", "douchebag", "douchebags", "douchey", "dipshit", "dipshits", "dumbass", "dumbasses", "dumbfuck", "dumbfucks", "dumbfucker", "dumbfuckers", "dumbshit", "dumbshits", "jackass", "jackasses", "jackoff", "jackoffs", "jerkoff", "jerkoffs", "jerkass", "jerkasses", "smartass", "smartasses", "badass", "badasses", "fatass", "fatasses", "hardass", "hardasses", "kickass", "butthead", "buttheads", "buttface", "buttfaces", "butthole", "buttholes", "buttfuck", "buttfucker", "buttfuckers", "buttfucking", "scumbag", "scumbags", "turd", "turds", "turdface", "turdhead",
      "damn", "damns", "dammit", "damnit", "goddamn", "goddamned", "goddammit", "hell", "crap", "crappy", "craps", "bloody", "bollocks", "bollock", "bugger", "buggered", "buggering", "buggers",
      "arse", "arses", "arsehole", "arseholes", "arsewipe", "arsewipes", "wanker", "wankers", "wanking", "tosser", "tossers", "tosspot", "tosspots", "knob", "knobs", "knobhead", "knobheads", "prat", "prats", "git", "gits", "minger", "mingers", "munter", "munters", "sod", "sods", "sodoff", "shag", "shagged", "shagging",
      "horny", "hornier", "horniness", "boner", "boners", "blowjob", "blowjobs", "handjob", "handjobs", "rimjob", "rimjobs", "hump", "humped", "humping", "screw", "screwed", "screwing", "screwy", "bang", "banged", "banging", "dildo", "dildos", "tit", "tits", "titty", "titties", "boob", "boobs", "booby", "ballsack", "ballsacks", "nutsack", "nutsacks", "nutjob", "nutjobs", "cum", "cums", "cumming", "jizz", "jizzed", "jizzing", "clit", "clits",
      "fuk", "fukk", "fuked", "fuking", "fukin", "fukkin", "fuckin", "shyt", "shiit", "shii", "bich", "biatch", "bish", "pussi", "pussay", "pusey", "assh0le", "assho1e", "a55hole", "a55", "d1ck", "d!ck", "dck", "c0ck", "c0cksucker", "pu55y", "p!ss", "p1ss"
    ]
  };

  function getSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(defaults, (stored) => resolve({ ...defaults, ...stored }));
    });
  }

  function saveSettings(settings) {
    return new Promise((resolve) => chrome.storage.local.set(settings, resolve));
  }

  window.BeepitSettings = { defaults, getSettings, saveSettings };
})();

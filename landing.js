let CITY_SUPPORT = {
  "\u043c\u043e\u0441\u043a\u0432\u0430": { id: 213, slug: "moscow", label: "\u041c\u043e\u0441\u043a\u0432\u0430", supportsMetro: true },
  "moscow": { id: 213, slug: "moscow", label: "\u041c\u043e\u0441\u043a\u0432\u0430", supportsMetro: true },
  "\u0441\u0430\u043d\u043a\u0442-\u043f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433": { id: 2, slug: "saint-petersburg", label: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", supportsMetro: true },
  "\u0441\u0430\u043d\u043a\u0442 \u043f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433": { id: 2, slug: "saint-petersburg", label: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", supportsMetro: true },
  "\u043f\u0438\u0442\u0435\u0440": { id: 2, slug: "saint-petersburg", label: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", supportsMetro: true },
  "\u0441\u043f\u0431": { id: 2, slug: "saint-petersburg", label: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", supportsMetro: true },
  "saint-petersburg": { id: 2, slug: "saint-petersburg", label: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", supportsMetro: true },
  "saint petersburg": { id: 2, slug: "saint-petersburg", label: "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", supportsMetro: true },
  "\u0430\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u044c": { id: 37, slug: "astrahan", label: "\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u044c", supportsMetro: false },
  "astrakhan": { id: 37, slug: "astrahan", label: "\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u044c", supportsMetro: false },
  "astrahan": { id: 37, slug: "astrahan", label: "\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u044c", supportsMetro: false },
  "\u0430\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a": { id: 20, slug: "arkhangelsk", label: "\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a", supportsMetro: false },
  "arkhangelsk": { id: 20, slug: "arkhangelsk", label: "\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a", supportsMetro: false }
};
let CITY_OPTIONS = ["\u041c\u043e\u0441\u043a\u0432\u0430", "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", "\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u044c", "\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a"];
let ACTIVE_CITY_INPUT = null;
let speechRecognition = null;
let speechActive = false;

const QUESTIONS = [
  ["work_goal", "Р”Р»СЏ С‡РµРіРѕ С‚С‹ СЃРµР№С‡Р°СЃ РёС‰РµС€СЊ СЃРјРµРЅС‹?", "РћРїСЂРµРґРµР»Рё РіР»Р°РІРЅС‹Р№ РјРѕС‚РёРІ", "single", ["РџРѕРґСЂР°Р±РѕС‚РєР°", "РћСЃРЅРѕРІРЅРѕР№ РґРѕС…РѕРґ", "Р’СЂРµРјРµРЅРЅР°СЏ СЂР°Р±РѕС‚Р°", "РР·СѓС‡Р°СЋ РІР°СЂРёР°РЅС‚С‹"]],
  ["city", "РР· РєР°РєРѕРіРѕ С‚С‹ РіРѕСЂРѕРґР°?", "РќР°РїРёС€Рё РіРѕСЂРѕРґ С‚Р°Рє, РєР°Рє С‚РµР±Рµ СѓРґРѕР±РЅРѕ. РќР°РїСЂРёРјРµСЂ: РњРѕСЃРєРІР°", "text"],
  ["metro", "РљР°РєРёРµ СЃС‚Р°РЅС†РёРё РјРµС‚СЂРѕ С‚РµР±Рµ СѓРґРѕР±РЅРµРµ РІСЃРµРіРѕ?", "РќРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ. РњРѕР¶РЅРѕ РїРµСЂРµС‡РёСЃР»РёС‚СЊ 1-3 СЃС‚Р°РЅС†РёРё С‡РµСЂРµР· Р·Р°РїСЏС‚СѓСЋ", "text_optional"],
  ["shifts_week", "РЎРєРѕР»СЊРєРѕ СЃРјРµРЅ РІ РЅРµРґРµР»СЋ РєРѕРјС„РѕСЂС‚РЅРѕ?", "Р’С‹Р±РµСЂРµРј СЂРёС‚Рј Р±РµР· РїРµСЂРµРіСЂСѓР·Р°", "single", ["1-2", "3-4", "5+"]],
  ["age_group", "РўРІРѕР№ РІРѕР·СЂР°СЃС‚РЅРѕР№ РґРёР°РїР°Р·РѕРЅ?", "Р­С‚Рѕ РїРѕРјРѕРіР°РµС‚ С‚РѕС‡РЅРµРµ РїРѕРґРѕР±СЂР°С‚СЊ С„РѕСЂРјР°С‚ РІС…РѕРґР° Рё СЃР»РѕР¶РЅРѕСЃС‚СЊ СЃС‚Р°СЂС‚Р°", "single", ["18-24", "25-34", "35-44", "45-54", "55+"]],
  ["physical", "РљР°РєР°СЏ С„РёР·РЅР°РіСЂСѓР·РєР° РєРѕРјС„РѕСЂС‚РЅР°?", "РћС‚ Р»РµРіРєРёС… СЂРѕР»РµР№ РґРѕ Р°РєС‚РёРІРЅС‹С… СЃРјРµРЅ", "single", ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"]],
  ["standing", "РљР°Рє РѕС‚РЅРѕСЃРёС€СЊСЃСЏ Рє СЂР°Р±РѕС‚Рµ РЅР° РЅРѕРіР°С…?", "Р•СЃС‚СЊ СЂРѕР»Рё РЅР° РЅРѕРіР°С… РІРµСЃСЊ РґРµРЅСЊ, Р° РµСЃС‚СЊ Р±РѕР»РµРµ СЃРїРѕРєРѕР№РЅС‹Рµ С„РѕСЂРјР°С‚С‹", "single", ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹", "РќСѓР¶РЅР° СЃРёРґСЏС‡Р°СЏ"]],
  ["outdoor", "Р“РѕС‚РѕРІ(Р°) СЂР°Р±РѕС‚Р°С‚СЊ РЅР° СѓР»РёС†Рµ?", "Р­С‚Рѕ РІР°Р¶РЅРѕ РґР»СЏ РєСѓСЂСЊРµСЂСЃРєРёС… Рё СѓР»РёС‡РЅС‹С… Р·Р°РґР°С‡", "single", ["Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ", "РўРѕР»СЊРєРѕ РІ С‚РµРїР»С‹Р№ СЃРµР·РѕРЅ", "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"]],
  ["heavy_weight", "РљРѕРјС„РѕСЂС‚РЅРѕ СЂРµРіСѓР»СЏСЂРЅРѕ РїРµСЂРµРЅРѕСЃРёС‚СЊ 15-20 РєРі?", "РЎРєР»Р°РґС‹ Рё С‡Р°СЃС‚СЊ СЃР±РѕСЂРєРё Р±С‹РІР°СЋС‚ С„РёР·РёС‡РµСЃРєРё Р°РєС‚РёРІРЅС‹РјРё", "single", ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°", "Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°"]],
  ["digital", "РљР°Рє С‚РµР±Рµ СЂР°Р±РѕС‚Р° СЃ РїСЂРёР»РѕР¶РµРЅРёСЏРјРё Рё С‚РµСЂРјРёРЅР°Р»РѕРј?", "Р­С‚Рѕ РІР»РёСЏРµС‚ РЅР° СЃР±РѕСЂРєСѓ, РєР°СЃСЃСѓ Рё С‡Р°СЃС‚СЊ СЃРєР»Р°РґСЃРєРёС… СЂРѕР»РµР№", "single", ["РЈРІРµСЂРµРЅРЅРѕ", "РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ"]],
  ["communication", "РќР°СЃРєРѕР»СЊРєРѕ РєРѕРјС„РѕСЂС‚РЅРѕ РѕР±С‰Р°С‚СЊСЃСЏ СЃ РєР»РёРµРЅС‚Р°РјРё?", "Р Р°Р·РґРµР»РёРј СЂРѕР»Рё РЅР° С„СЂРѕРЅС‚ Рё Р±СЌРє", "single", ["Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ"]],
  ["pay_model", "РљР°Рє С‚РµР±Рµ СЃРґРµР»СЊРЅР°СЏ РѕРїР»Р°С‚Р°?", "Р’ РЅРµРєРѕС‚РѕСЂС‹С… СЂРѕР»СЏС… РґРѕС…РѕРґ СЃРёР»СЊРЅРµРµ Р·Р°РІРёСЃРёС‚ РѕС‚ С‚РµРјРїР° Рё РѕР±СЉРµРјР° Р·Р°РґР°С‡", "single", ["Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј", "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ"]],
  ["pay_priority", "Р§С‚Рѕ СЃРµР№С‡Р°СЃ РІР°Р¶РЅРµРµ РІСЃРµРіРѕ?", "Р’С‹Р±РµСЂРµРј РјРµР¶РґСѓ СЃС‚Р°Р±РёР»СЊРЅРѕСЃС‚СЊСЋ, РґРѕС…РѕРґРѕРј Рё РєРѕРјС„РѕСЂС‚РѕРј", "single", ["РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ", "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°", "РљРѕРјС„РѕСЂС‚ Рё РјРµРЅСЊС€Рµ СЃС‚СЂРµСЃСЃР°"]],
  ["skills", "Р“РґРµ СѓР¶Рµ РµСЃС‚СЊ РѕРїС‹С‚?", "Р’С‹Р±РµСЂРё РґРѕ 4 РЅР°РїСЂР°РІР»РµРЅРёР№", "multi", ["РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ", "Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", "РљР°СЃСЃР°", "РљСѓС…РЅСЏ", "Р‘Р°СЂРёСЃС‚Р°", "РљСѓСЂСЊРµСЂ", "РљР»Р°РґРѕРІС‰РёРє", "РњРµСЂС‡РµРЅРґР°Р№Р·РµСЂ", "РџСЂРѕРјРѕСѓС‚РµСЂ", "РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№", "РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё", "РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ/С…РѕСЃС‚РµСЃ"]],
  ["experience_details", "Р Р°СЃСЃРєР°Р¶РёС‚Рµ РїРѕРґСЂРѕР±РЅРµРµ Рѕ СЃРІРѕРµРј СЂРµР»РµРІР°РЅС‚РЅРѕРј РѕРїС‹С‚Рµ", "Р—РґРµСЃСЊ РјРѕР¶РЅРѕ РѕС‚РІРµС‚РёС‚СЊ С‚РµРєСЃС‚РѕРј РёР»Рё РіРѕР»РѕСЃРѕРј: РіРґРµ СЂР°Р±РѕС‚Р°Р»(Р°), С‡С‚Рѕ РґРµР»Р°Р»(Р°), СЃ С‡РµРј С‡СѓРІСЃС‚РІСѓРµС‚Рµ СЃРµР±СЏ СѓРІРµСЂРµРЅРЅРѕ", "text_voice_optional"],
  ["interests", "РљР°РєРёРµ РЅР°РїСЂР°РІР»РµРЅРёСЏ С…РѕС‡РµС€СЊ РїРѕРїСЂРѕР±РѕРІР°С‚СЊ?", "РўРѕР¶Рµ РґРѕ 4 РІР°СЂРёР°РЅС‚РѕРІ", "multi", ["РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ", "Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", "РљР°СЃСЃР°", "РљСѓС…РЅСЏ", "Р‘Р°СЂРёСЃС‚Р°", "РљСѓСЂСЊРµСЂ", "РљР»Р°РґРѕРІС‰РёРє", "РњРµСЂС‡РµРЅРґР°Р№Р·РµСЂ", "РџСЂРѕРјРѕСѓС‚РµСЂ", "РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№", "РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё", "РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ/С…РѕСЃС‚РµСЃ"]],
  ["training_ready", "Р“РѕС‚РѕРІ(Р°) РїСЂРѕР№С‚Рё РєРѕСЂРѕС‚РєРѕРµ РѕР±СѓС‡РµРЅРёРµ 1-2 С‡Р°СЃР°?", "Р­С‚Рѕ РѕС‚РєСЂС‹РІР°РµС‚ Р±РѕР»СЊС€Рµ СЂРѕР»РµР№ Рё РёРЅРѕРіРґР° РїРѕРґРЅРёРјР°РµС‚ СЃС‚Р°РІРєСѓ", "single", ["Р”Р°, РµСЃР»Рё СЌС‚Рѕ РґР°СЃС‚ Р±РѕР»СЊС€Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚РµР№", "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕР±СѓС‡РµРЅРёРµ РєРѕСЂРѕС‚РєРѕРµ", "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ Р±РµР· РѕР±СѓС‡РµРЅРёСЏ"]]
];

const ROLES = [
  { code: "kitchen", role: "РљСѓС…РѕРЅРЅС‹Р№ СЂР°Р±РѕС‚РЅРёРє/РїРѕРІР°СЂ", family: "РљСѓС…РЅСЏ", pay: 5000, tags: ["РџСЂРѕС„РЅР°РІС‹Рє", "РљРѕРјР°РЅРґР°", "Р РѕСЃС‚"], skills: ["РљСѓС…РЅСЏ"], fit: { physical: ["РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ"], communication: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ", "Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё"] } },
  { code: "collector", role: "РЎР±РѕСЂС‰РёРє Р·Р°РєР°Р·РѕРІ", family: "РЎР±РѕСЂРєР° Рё РґР°СЂРєСЃС‚РѕСЂ", pay: 4700, tags: ["РўРµСЂРјРёРЅР°Р»", "РўРµРјРї", "РўРѕС‡РЅРѕСЃС‚СЊ"], skills: ["РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ", "РљР»Р°РґРѕРІС‰РёРє"], fit: { physical: ["РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РЈРІРµСЂРµРЅРЅРѕ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], communication: ["Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], pay_model: ["РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј", "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ"], cleaning: ["РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ", "Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё"] } },
  { code: "cashier", role: "РљР°СЃСЃРёСЂ", family: "Р РёС‚РµР№Р»", pay: 4300, tags: ["Р¤СЂРѕРЅС‚", "РўРµСЂРјРёРЅР°Р»", "РќРѕРІРёС‡РєРё"], skills: ["РљР°СЃСЃР°"], fit: { physical: ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РЈРІРµСЂРµРЅРЅРѕ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], communication: ["Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё", "РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ"] } },
  { code: "rtz", role: "Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂР°/РјРµСЂС‡РµРЅРґР°Р№Р·РµСЂ", family: "РўРѕСЂРіРѕРІС‹Р№ Р·Р°Р»", pay: 4100, tags: ["РџРѕСЂСЏРґРѕРє", "РџР»Р°РЅРѕРіСЂР°РјРјР°", "РЎРїРѕРєРѕР№РЅС‹Р№ С‚РµРјРї"], skills: ["Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", "РњРµСЂС‡РµРЅРґР°Р№Р·РµСЂ"], fit: { physical: ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ"], communication: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ", "Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё"] } },
  { code: "barista", role: "Р‘Р°СЂРёСЃС‚Р°", family: "РљРѕС„Рµ Рё СЃРµСЂРІРёСЃ", pay: 4800, tags: ["РЎРµСЂРІРёСЃ", "РўРµРјРї", "РћР±СѓС‡РµРЅРёРµ"], skills: ["Р‘Р°СЂРёСЃС‚Р°"], fit: { physical: ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "РЈРІРµСЂРµРЅРЅРѕ"], communication: ["Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ", "Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё"] } },
  { code: "courier", role: "РљСѓСЂСЊРµСЂ", family: "Р”РѕСЃС‚Р°РІРєР°", pay: 5600, tags: ["Р”РІРёР¶РµРЅРёРµ", "РЎРґРµР»СЊРЅРѕСЃС‚СЊ", "РЈР»РёС†Р°"], skills: ["РљСѓСЂСЊРµСЂ"], fit: { physical: ["РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє"], outdoor: ["Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ", "РўРѕР»СЊРєРѕ РІ С‚РµРїР»С‹Р№ СЃРµР·РѕРЅ"], heavy_weight: ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "РЈРІРµСЂРµРЅРЅРѕ"], communication: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ"], pay_model: ["Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё", "РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ"] } },
  { code: "warehouse", role: "РљР»Р°РґРѕРІС‰РёРє", family: "РЎРєР»Р°Рґ", pay: 4900, tags: ["РЎРєР»Р°Рґ", "РўРµРјРї", "РўРѕС‡РЅРѕСЃС‚СЊ"], skills: ["РљР»Р°РґРѕРІС‰РёРє", "РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ"], fit: { physical: ["РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["РќРѕСЂРјР°Р»СЊРЅРѕ", "РЈРІРµСЂРµРЅРЅРѕ"], communication: ["Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё", "РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ"] } },
  { code: "promoter", role: "РџСЂРѕРјРѕСѓС‚РµСЂ", family: "РџСЂРѕРјРѕ Рё СЃРѕР±С‹С‚РёСЏ", pay: 3900, tags: ["РљРѕРјРјСѓРЅРёРєР°С†РёСЏ", "Р›РµРіРєРёР№ РІС…РѕРґ", "Р“РёР±РєРѕСЃС‚СЊ"], skills: ["РџСЂРѕРјРѕСѓС‚РµСЂ", "РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ/С…РѕСЃС‚РµСЃ"], fit: { physical: ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РўРѕР»СЊРєРѕ РІ С‚РµРїР»С‹Р№ СЃРµР·РѕРЅ", "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°"], digital: ["Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], communication: ["Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј"], cleaning: ["Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё", "РўРѕР»СЊРєРѕ Р·Р°Р» РёР»Рё РѕС„РёСЃ"] } },
  { code: "cleaner_indoor", role: "РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№", family: "РљР»РёРЅРёРЅРі", pay: 3900, tags: ["cleaner", "РџСЂРѕСЃС‚РѕР№ РІС…РѕРґ", "Р‘РµР· С†РёС„СЂС‹"], skills: ["РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№"], fit: { physical: ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹"], outdoor: ["РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"], heavy_weight: ["Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ"], communication: ["Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ"], cleaning: ["Р”Р°, СЌС‚Рѕ РѕРє"] } },
  { code: "cleaner_outdoor", role: "РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё", family: "РљР»РёРЅРёРЅРі", pay: 4700, tags: ["cleaner", "cold_conditions", "heavy_weight"], skills: ["РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё"], fit: { physical: ["РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"], standing: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє"], outdoor: ["Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ", "РўРѕР»СЊРєРѕ РІ С‚РµРїР»С‹Р№ СЃРµР·РѕРЅ"], heavy_weight: ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°"], digital: ["Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ"], communication: ["Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ"], pay_model: ["РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ"], cleaning: ["Р”Р°, СЌС‚Рѕ РѕРє"] } }
];

const STATE = { i: 0, answers: {}, selected: [], badges: [], score: { physical: 50, communication: 50, digital: 50, stability: 50, learning: 50 } };
const UI = {
  startBtn: document.getElementById("startBtn"),
  quiz: document.getElementById("quizSection"),
  result: document.getElementById("resultSection"),
  title: document.getElementById("questionTitle"),
  hint: document.getElementById("questionHint"),
  options: document.getElementById("options"),
  inputWrap: document.getElementById("inputWrap"),
  textAnswer: document.getElementById("textAnswer"),
  textNextBtn: document.getElementById("textNextBtn"),
skipTextBtn: document.getElementById("skipTextBtn"),
  voiceControls: document.getElementById("voiceControls"),
  voiceBtn: document.getElementById("voiceBtn"),
  voiceStatus: document.getElementById("voiceStatus"),
  cityAutocomplete: document.getElementById("cityAutocomplete"),
  badges: document.getElementById("badges"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  multiActions: document.getElementById("multiActions"),
  doneMultiBtn: document.getElementById("doneMultiBtn"),
  profileName: document.getElementById("profileName"),
  profileDesc: document.getElementById("profileDesc"),
  metroSummary: document.getElementById("metroSummary"),
  incomeForecast: document.getElementById("incomeForecast"),
  trainReadiness: document.getElementById("trainReadiness"),
  topScore: document.getElementById("topScore"),
  recommendations: document.getElementById("recommendations"),
  realShifts: document.getElementById("realShifts"),
  familyFit: document.getElementById("familyFit"),
  fallbackBox: document.getElementById("fallbackBox"),
  editLocationBtn: document.getElementById("editLocationBtn"),
  locationEditor: document.getElementById("locationEditor"),
  resultCityInput: document.getElementById("resultCityInput"),
  resultCityAutocomplete: document.getElementById("resultCityAutocomplete"),
  resultMetroInput: document.getElementById("resultMetroInput"),
  resultMetroHint: document.getElementById("resultMetroHint"),
  saveLocationBtn: document.getElementById("saveLocationBtn"),
  cancelLocationBtn: document.getElementById("cancelLocationBtn"),
  restartBtn: document.getElementById("restartBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  radar: document.getElementById("radar")
};

UI.startBtn.addEventListener("click", startQuiz);
UI.doneMultiBtn.addEventListener("click", submitMulti);
UI.textNextBtn.addEventListener("click", submitText);
UI.skipTextBtn?.addEventListener("click", skipTextQuestion);
UI.textAnswer.addEventListener("keydown", (e) => { if (e.key === "Enter") submitText(); });
UI.textAnswer.addEventListener("input", () => handleCityInput(UI.textAnswer, UI.cityAutocomplete));
UI.textAnswer.addEventListener("focus", () => handleCityInput(UI.textAnswer, UI.cityAutocomplete));
UI.voiceBtn?.addEventListener("click", toggleVoiceInput);
UI.editLocationBtn?.addEventListener("click", openLocationEditor);
UI.saveLocationBtn?.addEventListener("click", applyLocationChanges);
UI.cancelLocationBtn?.addEventListener("click", closeLocationEditor);
UI.resultCityInput?.addEventListener("input", syncLocationEditorState);
UI.resultCityInput?.addEventListener("input", () => handleCityInput(UI.resultCityInput, UI.resultCityAutocomplete));
UI.resultCityInput?.addEventListener("focus", () => handleCityInput(UI.resultCityInput, UI.resultCityAutocomplete));
UI.restartBtn.addEventListener("click", () => window.location.reload());
UI.downloadBtn.addEventListener("click", downloadProfile);
document.addEventListener("click", handleOutsideAutocompleteClick);

loadCitiesConfig();

function startQuiz() {
  resetState();
  UI.result.classList.add("hidden");
  UI.recommendations.innerHTML = "";
  UI.realShifts.innerHTML = "";
  UI.familyFit.innerHTML = "";
  UI.fallbackBox.innerHTML = "";
  UI.fallbackBox.classList.add("hidden");
  UI.quiz.classList.remove("hidden");
  closeLocationEditor();
  UI.quiz.scrollIntoView({ behavior: "smooth", block: "start" });
  render();
}

function resetState() {
  STATE.i = 0;
  STATE.answers = {};
  STATE.selected = [];
  STATE.badges = [];
  STATE.score = {
    physical: 50,
    communication: 50,
    digital: 50,
    stability: 50,
    learning: 50
  };
  if (UI.textAnswer) UI.textAnswer.value = "";
  if (UI.resultCityInput) UI.resultCityInput.value = "";
  if (UI.resultMetroInput) UI.resultMetroInput.value = "";
  hideAutocomplete(UI.cityAutocomplete);
  hideAutocomplete(UI.resultCityAutocomplete);
  UI.inputWrap?.classList.add("hidden");
  UI.multiActions?.classList.add("hidden");
  UI.voiceControls?.classList.add("hidden");
  UI.skipTextBtn?.classList.add("hidden");
  stopVoiceInput();
  UI.metroSummary?.classList.add("hidden");
  if (UI.metroSummary) UI.metroSummary.textContent = "";
}

function render() {
  const [id, text, hint, type, options] = QUESTIONS[STATE.i];
  STATE.selected = [];
  UI.title.textContent = text;
  UI.hint.textContent = hint;
  UI.progressText.textContent = `${STATE.i + 1}/${QUESTIONS.length}`;
  UI.progressBar.style.width = `${((STATE.i + 1) / QUESTIONS.length) * 100}%`;
  UI.badges.innerHTML = STATE.badges.map((x) => `<span class="badge">${x}</span>`).join("");
  UI.options.innerHTML = "";
  UI.inputWrap.classList.add("hidden");
  UI.multiActions.classList.add("hidden");
  UI.voiceControls?.classList.add("hidden");
  UI.skipTextBtn?.classList.add("hidden");
  if (type === "single") options.forEach((o) => UI.options.appendChild(makeOption(o, () => answerSingle(id, o))));
  if (type === "multi") { options.forEach((o) => UI.options.appendChild(makeOption(o, () => toggleMulti(o)))); UI.multiActions.classList.remove("hidden"); }
  if (type === "text" || type === "text_optional" || type === "text_voice_optional") {
    UI.inputWrap.classList.remove("hidden");
    ACTIVE_CITY_INPUT = id === "city" ? UI.textAnswer : null;
    hideAutocomplete(UI.cityAutocomplete);
    UI.textAnswer.placeholder = getTextPlaceholder(id);
    UI.textAnswer.value = STATE.answers[id] || "";
    configureVoiceControls(type);
    if (type === "text_optional" || type === "text_voice_optional") {
      UI.skipTextBtn?.classList.remove("hidden");
    }
    setTimeout(() => UI.textAnswer.focus(), 50);
  }
}

function makeOption(text, handler) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "option";
  b.textContent = text;
  b.addEventListener("click", handler);
  return b;
}

function toggleMulti(option) {
  const node = [...UI.options.querySelectorAll(".option")].find((x) => x.textContent === option);
  if (STATE.selected.includes(option)) {
    STATE.selected = STATE.selected.filter((x) => x !== option);
    if (node) node.classList.remove("selected");
    return;
  }
  if (STATE.selected.length >= 4) return;
  STATE.selected.push(option);
  if (node) node.classList.add("selected");
}

function answerSingle(id, answer) {
  STATE.answers[id] = answer;
  adaptScore(id, answer);
  grantBadge(id, answer);
  next();
}

function submitText() {
  const [id, , , type] = QUESTIONS[STATE.i];
  const value = UI.textAnswer.value.trim();
  if (!value && type !== "text_optional" && type !== "text_voice_optional") return;
  STATE.answers[id] = value;
  if (id === "city") {
    addBadge(`Город: ${getCityMeta(value)?.label || value}`);
  }
  if (id === "metro" && value) addBadge("Есть ориентир по метро");
  if (id === "experience_details" && value) addBadge("Есть подробный опыт");
  next();
}

function skipTextQuestion() {
  const [id] = QUESTIONS[STATE.i];
  STATE.answers[id] = "";
  next();
}
function submitMulti() {
  const [id] = QUESTIONS[STATE.i];
  if (!STATE.selected.length) return;
  STATE.answers[id] = [...STATE.selected];
  if (id === "skills") addBadge("Р•СЃС‚СЊ Р±Р°Р·Р° РЅР°РІС‹РєРѕРІ");
  if (id === "interests" && STATE.selected.length >= 3) addBadge("РћС‚РєСЂС‹С‚(Р°) Рє РЅРѕРІС‹Рј СЂРѕР»СЏРј");
  next();
}

function next() {
  STATE.i += 1;
  while (STATE.i < QUESTIONS.length && shouldSkipQuestion(QUESTIONS[STATE.i][0])) STATE.i += 1;
  if (STATE.i < QUESTIONS.length) return render();
  finish();
}

function shouldSkipQuestion(id) {
  if (id !== "metro") return false;
  const cityMeta = getCityMeta(STATE.answers.city || "");
  return !cityMeta?.supportsMetro;
}

function adaptScore(id, answer) {
  if (id === "physical") STATE.score.physical = answer === "Р›РµРіРєР°СЏ" ? 25 : answer === "РЎСЂРµРґРЅСЏСЏ" ? 60 : 90;
  if (id === "communication") STATE.score.communication = answer === "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ" ? 90 : answer === "РќРѕСЂРјР°Р»СЊРЅРѕ" ? 60 : 20;
  if (id === "digital") STATE.score.digital = answer === "РЈРІРµСЂРµРЅРЅРѕ" ? 90 : answer === "РќРѕСЂРјР°Р»СЊРЅРѕ" ? 60 : 30;
  if (id === "pay_priority") STATE.score.stability = answer === "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ" ? 90 : answer === "РљРѕРјС„РѕСЂС‚ Рё РјРµРЅСЊС€Рµ СЃС‚СЂРµСЃСЃР°" ? 75 : 40;
  if (id === "training_ready") STATE.score.learning = answer === "Р”Р°, РµСЃР»Рё СЌС‚Рѕ РґР°СЃС‚ Р±РѕР»СЊС€Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚РµР№" ? 90 : answer === "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕР±СѓС‡РµРЅРёРµ РєРѕСЂРѕС‚РєРѕРµ" ? 60 : 30;
}

function grantBadge(id, answer) {
  if (id === "digital" && answer === "РЈРІРµСЂРµРЅРЅРѕ") addBadge("Р¦РёС„СЂРѕРІРѕР№ РїСЂРѕС„Рё");
  if (id === "communication" && answer === "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ") addBadge("РЎРёР»СЊРЅР°СЏ РєРѕРјРјСѓРЅРёРєР°С†РёСЏ");
  if (id === "outdoor" && answer === "Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ") addBadge("Р“РѕС‚РѕРІ(Р°) Рє РїРѕР»РµРІС‹Рј Р·Р°РґР°С‡Р°Рј");
  if (id === "physical" && answer === "РўСЏР¶РµР»Р°СЏ") addBadge("Р’С‹СЃРѕРєР°СЏ РІС‹РЅРѕСЃР»РёРІРѕСЃС‚СЊ");
  if (id === "training_ready" && answer === "Р”Р°, РµСЃР»Рё СЌС‚Рѕ РґР°СЃС‚ Р±РѕР»СЊС€Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚РµР№") addBadge("РћСЂРёРµРЅС‚РёСЂ РЅР° СЂРѕСЃС‚");
}

function addBadge(text) { if (!STATE.badges.includes(text)) STATE.badges.push(text); }

function finish() {
  const ranked = normalizeCleaning(rankRoles());
  const top = ranked.slice(0, 3);
  const profile = detectProfile();
  const avgPay = Math.round(top.reduce((s, x) => s + x.pay, 0) / Math.max(1, top.length));
  UI.quiz.classList.add("hidden");
  UI.result.classList.remove("hidden");
  UI.profileName.textContent = profile.title;
  UI.profileDesc.textContent = profile.desc;
  syncLocationEditorFields();
  renderMetroSummary();
  UI.incomeForecast.textContent = `${avgPay * 4} - ${(avgPay + 900) * 4} в‚Ѕ`;
  UI.trainReadiness.textContent = `${STATE.score.learning}/100`;
  UI.topScore.textContent = `${top[0]?.score || 0}%`;
  UI.recommendations.innerHTML = `<h3>РўРѕРї-3 РїСЂРѕС„РµСЃСЃРёРё РґР»СЏ С‚РµР±СЏ</h3>${top.map((x) => `<div class="rec-card"><h4>${x.role} - match ${x.score}%</h4><p><strong>РЎРµРјРµР№СЃС‚РІРѕ:</strong> ${x.family} | <strong>РћСЂРёРµРЅС‚РёСЂ РїРѕ СЃС‚Р°РІРєРµ:</strong> ${x.pay} в‚Ѕ Р·Р° СЃРјРµРЅСѓ</p><div>${x.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div></div>`).join("")}`;
  renderFamilies(ranked);
  renderFallback(top);
  drawRadar();
  renderRealShifts(top);
  UI.result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openLocationEditor() {
  syncLocationEditorFields();
  syncLocationEditorState();
  ACTIVE_CITY_INPUT = UI.resultCityInput;
  UI.locationEditor?.classList.remove("hidden");
}

function closeLocationEditor() {
  hideAutocomplete(UI.resultCityAutocomplete);
  UI.locationEditor?.classList.add("hidden");
}

function syncLocationEditorFields() {
  if (UI.resultCityInput) UI.resultCityInput.value = STATE.answers.city || "";
  if (UI.resultMetroInput) UI.resultMetroInput.value = STATE.answers.metro || "";
}

function syncLocationEditorState() {
  if (!UI.resultCityInput || !UI.resultMetroInput || !UI.resultMetroHint) return;
  const cityMeta = getCityMeta(UI.resultCityInput.value || "");
  const supportsMetro = Boolean(cityMeta?.supportsMetro);
  UI.resultMetroInput.disabled = !supportsMetro;
  UI.resultMetroInput.placeholder = supportsMetro
    ? "РњРµС‚СЂРѕ, РЅР°РїСЂРёРјРµСЂ: Р‘РµР»РѕСЂСѓСЃСЃРєР°СЏ, РЎР°РІРµР»РѕРІСЃРєР°СЏ"
    : "Р”Р»СЏ СЌС‚РѕРіРѕ РіРѕСЂРѕРґР° РјРµС‚СЂРѕ РЅРµ РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ";
  UI.resultMetroHint.textContent = supportsMetro
    ? "РњРµС‚СЂРѕ РјРѕР¶РЅРѕ РЅРµ СѓРєР°Р·С‹РІР°С‚СЊ."
    : "Р”Р»СЏ СЌС‚РѕРіРѕ РіРѕСЂРѕРґР° РјС‹ РёС‰РµРј СЃРјРµРЅС‹ Р±РµР· РїСЂРёРІСЏР·РєРё Рє РјРµС‚СЂРѕ.";
  if (!supportsMetro) UI.resultMetroInput.value = "";
}

async function applyLocationChanges() {
  const city = (UI.resultCityInput?.value || "").trim();
  if (!city) return;
  const cityMeta = getCityMeta(city);
  const metro = cityMeta?.supportsMetro ? (UI.resultMetroInput?.value || "").trim() : "";
  STATE.answers.city = city;
  STATE.answers.metro = metro;
  renderMetroSummary();
  closeLocationEditor();
  await renderRealShifts(normalizeCleaning(rankRoles()).slice(0, 3));
}

function detectProfile() {
  if (STATE.answers.pay_model === "Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ" || STATE.answers.pay_priority === "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°") return { title: "РћС…РѕС‚РЅРёРє Р·Р° РІС‹СЃРѕРєРёРј РґРѕС…РѕРґРѕРј", desc: "РўРµР±Рµ Р±Р»РёР¶Рµ СЃРјРµРЅС‹, РіРґРµ РјРѕР¶РЅРѕ СѓСЃРєРѕСЂРёС‚СЊСЃСЏ, РІР·СЏС‚СЊ Р±РѕР»СЊС€Рµ РѕР±СЉРµРјР° Рё Р·Р° СЃС‡РµС‚ СЌС‚РѕРіРѕ Р·Р°СЂР°Р±Р°С‚С‹РІР°С‚СЊ Р·Р°РјРµС‚РЅРѕ РІС‹С€Рµ СЃСЂРµРґРЅРµРіРѕ." };
  if (STATE.answers.communication === "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ") return { title: "РњР°СЃС‚РµСЂ СЃРїРѕРєРѕР№РЅРѕРіРѕ РїРѕСЂСЏРґРєР°", desc: "РўРµР±Рµ РєРѕРјС„РѕСЂС‚РЅРµРµ СЂРѕР»Рё Р±РµР· Р»РёС€РЅРµРіРѕ РєРѕРЅС‚Р°РєС‚Р° СЃ РєР»РёРµРЅС‚Р°РјРё, РіРґРµ РІР°Р¶РЅС‹ С‚РѕС‡РЅРѕСЃС‚СЊ, Р°РєРєСѓСЂР°С‚РЅРѕСЃС‚СЊ Рё РїСЂРµРґСЃРєР°Р·СѓРµРјС‹Р№ СЂРёС‚Рј." };
  if (STATE.answers.training_ready === "Р”Р°, РµСЃР»Рё СЌС‚Рѕ РґР°СЃС‚ Р±РѕР»СЊС€Рµ РІРѕР·РјРѕР¶РЅРѕСЃС‚РµР№" && (STATE.answers.interests || []).length >= 2) return { title: "РЈРЅРёРІРµСЂСЃР°Р» СЃ РїРѕС‚РµРЅС†РёР°Р»РѕРј СЂРѕСЃС‚Р°", desc: "РўС‹ РѕС‚РєСЂС‹С‚(Р°) Рє РЅРѕРІРѕРјСѓ, РіРѕС‚РѕРІ(Р°) РїСЂРѕР№С‚Рё РєРѕСЂРѕС‚РєРѕРµ РѕР±СѓС‡РµРЅРёРµ Рё РїРѕСЃС‚РµРїРµРЅРЅРѕ РѕС‚РєСЂС‹РІР°С‚СЊ Р±РѕР»РµРµ СЃРёР»СЊРЅС‹Рµ Рё РґРѕС…РѕРґРЅС‹Рµ СЂРѕР»Рё." };
  return { title: "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїРѕРјРѕС‰РЅРёРє РІ СЂРёС‚РµР№Р»Рµ", desc: "РўРµР±Рµ РїРѕРґС…РѕРґСЏС‚ РїРѕРЅСЏС‚РЅС‹Рµ СЃРјРµРЅС‹ СЃ СѓРјРµСЂРµРЅРЅРѕР№ РЅР°РіСЂСѓР·РєРѕР№, РїСЂРѕР·СЂР°С‡РЅРѕР№ СЃС‚Р°РІРєРѕР№ Рё Р±С‹СЃС‚СЂС‹Рј РІС…РѕРґРѕРј Р±РµР· Р»РёС€РЅРµРіРѕ СЃС‚СЂРµСЃСЃР°." };
}

function rankRoles() {
  const skills = new Set(STATE.answers.skills || []);
  const interests = new Set(STATE.answers.interests || []);
  const weighted = ROLES.map((r) => {
    let rawScore = 22;
    ["physical", "standing", "outdoor", "heavy_weight", "digital", "communication", "pay_model"].forEach((key) => {
      const answer = STATE.answers[key];
      const matches = (r.fit[key] || []).includes(answer);
      rawScore += matches ? ({ physical: 14, standing: 10, outdoor: 10, heavy_weight: 10, digital: 12, communication: 12, pay_model: 9 })[key] : 0;
    });
    r.skills.forEach((s) => {
      if (skills.has(s)) rawScore += 10;
      if (interests.has(s)) rawScore += 8;
    });
    if (STATE.answers.pay_priority === "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°" && r.pay >= 5000) rawScore += 10;
    if (STATE.answers.pay_priority === "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ" && r.pay <= 5000) rawScore += 8;
    if (STATE.answers.work_goal === "РћСЃРЅРѕРІРЅРѕР№ РґРѕС…РѕРґ" && r.pay >= 4700) rawScore += 6;
    if (STATE.answers.work_goal === "РџРѕРґСЂР°Р±РѕС‚РєР°" && r.pay >= 4300) rawScore += 4;
    if (STATE.answers.outdoor === "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё" && ["courier", "cleaner_outdoor"].includes(r.code)) rawScore -= 18;
    if (STATE.answers.standing === "РќСѓР¶РЅР° СЃРёРґСЏС‡Р°СЏ" && ["courier", "cleaner_outdoor", "warehouse", "collector"].includes(r.code)) rawScore -= 16;
    if (STATE.answers.communication === "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ" && ["cleaner_indoor", "warehouse"].includes(r.code)) rawScore -= 6;
    return { ...r, rawScore };
  });

  const rawValues = weighted.map((x) => x.rawScore);
  const minRaw = Math.min(...rawValues);
  const maxRaw = Math.max(...rawValues);

  return weighted
    .map((r) => ({
      ...r,
      score: normalizeRoleScore(r.rawScore, minRaw, maxRaw)
    }))
    .sort((a, b) => b.score - a.score);
}

function normalizeRoleScore(value, min, max) {
  if (max <= min) return 74;
  const ratio = (value - min) / (max - min);
  return Math.max(28, Math.min(98, Math.round(28 + Math.pow(ratio, 1.18) * 68)));
}

function normalizeCleaning(list) {
  const out = [...list];
  const isCleaning = (x) => x.tags.includes("cleaner");
  if (isCleaning(out[0])) {
    const idx = out.findIndex((x) => !isCleaning(x));
    if (idx > 0) [out[0], out[idx]] = [out[idx], out[0]];
  }
  const topScore = out[0]?.score || 0;
  return out.map((x) => isCleaning(x) ? { ...x, score: Math.min(x.score, Math.max(1, topScore - 1)) } : x).sort((a, b) => b.score - a.score);
}

function renderFamilies(ranked) {
  const familyMap = {};
  ranked.forEach((x) => { familyMap[x.family] ||= []; familyMap[x.family].push(x.score); });
  const rows = Object.entries(familyMap)
    .map(([family, scores]) => {
      const avg = scores.reduce((s, x) => s + x, 0) / scores.length;
      const max = Math.max(...scores);
      return { family, fit: Math.round(avg * 0.7 + max * 0.3) };
    })
    .sort((a, b) => b.fit - a.fit);
  UI.familyFit.innerHTML = `<h3>РљР°С‚Р°Р»РѕРі РїСЂРѕС„РµСЃСЃРёР№ РЎРјРµРЅС‹: С‚РІРѕР№ СѓСЂРѕРІРµРЅСЊ СЃРѕРІРїР°РґРµРЅРёСЏ</h3>${rows.map((x) => `<div class="rec-card"><p><strong>${x.family}</strong> - ${x.fit}%</p><div class="progress"><span style="width:${x.fit}%"></span></div></div>`).join("")}`;
}

function renderFallback(top) {
  if (top.some((x) => x.score >= 62)) { UI.fallbackBox.classList.add("hidden"); UI.fallbackBox.innerHTML = ""; return; }
  const wl = (STATE.answers.interests || []).slice(0, 3);
  UI.fallbackBox.classList.remove("hidden");
  UI.fallbackBox.classList.add("fallback");
  UI.fallbackBox.innerHTML = `<h3>РџР»Р°РЅ Р‘: РµСЃР»Рё СЃРёР»СЊРЅС‹С… СЃРѕРІРїР°РґРµРЅРёР№ РјР°Р»Рѕ</h3><p>РЎРµР№С‡Р°СЃ РїРѕРґ С‚РІРѕР№ РїСЂРѕС„РёР»СЊ РјР°Р»Рѕ СЂРѕР»РµР№ СЃ РІС‹СЃРѕРєРёРј РјР°С‚С‡РµРј. Р­С‚Рѕ РЅРµ РѕС‚РєР°Р·, Р° СЃРёРіРЅР°Р», С‡С‚Рѕ СЃС‚РѕРёС‚ Р»РёР±Рѕ СЂР°СЃС€РёСЂРёС‚СЊ С„РёР»СЊС‚СЂС‹, Р»РёР±Рѕ РїРѕРґРїРёСЃР°С‚СЊ С‚РµР±СЏ РЅР° РЅСѓР¶РЅС‹Рµ РЅР°РїСЂР°РІР»РµРЅРёСЏ.</p><p><strong>Р§С‚Рѕ РёРјРµРµС‚ СЃРјС‹СЃР» РѕС‚СЃР»РµР¶РёРІР°С‚СЊ:</strong> ${wl.length ? wl.join(", ") : "РљР°СЃСЃР°, РІС‹РєР»Р°РґРєР° С‚РѕРІР°СЂР°, СЃР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ"}.</p>`;
}

async function renderRealShifts(topRoles) {
  const city = (STATE.answers.city || "").trim();
  UI.realShifts.innerHTML = `<h3>Р РµР°Р»СЊРЅС‹Рµ СЃРјРµРЅС‹ РІ С‚РІРѕРµРј РіРѕСЂРѕРґРµ</h3><p class="inline-note">РС‰Сѓ РїСѓР±Р»РёС‡РЅС‹Рµ СЃРјРµРЅС‹ РЅР° Р·Р°РІС‚СЂР° Рё РїРѕСЃР»РµР·Р°РІС‚СЂР°...</p>`;
  try {
    const dates = upcomingDates();
    const res = await fetch(`/api/shifts?city=${encodeURIComponent(city)}&dates=${dates.join(",")}`);
    const data = await res.json();
    if (!res.ok || !(data.shifts || []).length) {
      UI.realShifts.innerHTML = `<h3>Р РµР°Р»СЊРЅС‹Рµ СЃРјРµРЅС‹ РІ С‚РІРѕРµРј РіРѕСЂРѕРґРµ</h3><p class="inline-note">${data.message || "РџРѕРєР° РЅРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ РїСѓР±Р»РёС‡РЅС‹Рµ СЃРјРµРЅС‹ РґР»СЏ СЌС‚РѕРіРѕ РіРѕСЂРѕРґР°."}</p>`;
      return;
    }
    const ranked = rankPublicShifts(data.shifts, topRoles).slice(0, 3);
    const rangeNote = data.extendedRange
      ? `РџСѓР±Р»РёС‡РЅР°СЏ РІРёС‚СЂРёРЅР° РЎРјРµРЅС‹ РЅР° ${data.cityLabel || city}. РќР° Р·Р°РІС‚СЂР° Рё РїРѕСЃР»РµР·Р°РІС‚СЂР° РїРѕРґС…РѕРґСЏС‰РёС… СЃРјРµРЅ РЅРµ РЅР°С€Р»РѕСЃСЊ, РїРѕСЌС‚РѕРјСѓ СЏ СЂР°СЃС€РёСЂРёР» РїРѕРёСЃРє РµС‰Рµ РЅР° РЅРµСЃРєРѕР»СЊРєРѕ Р±Р»РёР¶Р°Р№С€РёС… РґРЅРµР№.`
      : `РџСѓР±Р»РёС‡РЅР°СЏ РІРёС‚СЂРёРЅР° РЎРјРµРЅС‹ РЅР° ${data.cityLabel || city}. РќРёР¶Рµ 2-3 СЃР°РјС‹Рµ Р±Р»РёР·РєРёРµ РїРѕ РїСЂРѕС„РёР»СЋ СЃРјРµРЅС‹.`;
    UI.realShifts.innerHTML = `<h3>Р РµР°Р»СЊРЅС‹Рµ СЃРјРµРЅС‹ РІ С‚РІРѕРµРј РіРѕСЂРѕРґРµ</h3><p class="inline-note">${rangeNote}</p>${ranked.map((x) => `<div class="rec-card"><h4>${escapeHtml(x.title)} - fit ${x.match}%</h4>${renderShiftLinkBadge(x)}<p><strong>РљРѕРіРґР°:</strong> ${escapeHtml(x.dateLabel || x.date)}${x.time ? `, ${escapeHtml(x.time)}` : ""}</p><p><strong>Р“РґРµ:</strong> ${escapeHtml(x.address || "РђРґСЂРµСЃ СѓС‚РѕС‡РЅСЏРµС‚СЃСЏ")}</p><p><strong>РћРїР»Р°С‚Р°:</strong> ${escapeHtml(x.payText || "РЎС‚Р°РІРєР° РЅР° РІРёС‚СЂРёРЅРµ")}</p><p class="inline-note">${escapeHtml(x.why)}</p>${renderShiftLink(x)}</div>`).join("")}`;
  } catch {
    UI.realShifts.innerHTML = `<h3>Р РµР°Р»СЊРЅС‹Рµ СЃРјРµРЅС‹ РІ С‚РІРѕРµРј РіРѕСЂРѕРґРµ</h3><p class="inline-note">РџСЂРѕС„РёР»СЊ СѓР¶Рµ РіРѕС‚РѕРІ. Р‘Р»РѕРє СЃ СЂРµР°Р»СЊРЅС‹РјРё СЃРјРµРЅР°РјРё РЅРµРґРѕСЃС‚СѓРїРµРЅ Р»РѕРєР°Р»СЊРЅРѕ РёР»Рё РЅРµ РѕС‚РІРµС‚РёР» РІРѕРІСЂРµРјСЏ.</p>`;
  }
}

function rankPublicShifts(shifts, topRoles) {
  const topCodes = topRoles.map((x) => x.code);
  return shifts.map((s) => {
    const code = inferRoleCode(s.title);
    let match = 48;
    if (topCodes.includes(code)) match += 28;
    if (s.payAmount >= 5000 && STATE.answers.pay_priority === "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°") match += 8;
    if (STATE.answers.communication === "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ" && ["collector", "warehouse", "cleaner_indoor", "cleaner_outdoor"].includes(code)) match += 7;
    if (STATE.answers.digital === "РЈРІРµСЂРµРЅРЅРѕ" && ["collector", "cashier"].includes(code)) match += 5;
    if (STATE.answers.outdoor === "Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ" && ["courier", "cleaner_outdoor", "promoter"].includes(code)) match += 4;
    if (matchesMetro(s.address, STATE.answers.metro)) match += 12;
    return { ...s, match: Math.max(1, Math.min(99, match)), why: explainShift(code) };
  }).sort((a, b) => b.match - a.match);
}

function explainShift(code) {
  return {
    kitchen: "РџРѕРґС…РѕРґРёС‚ РїРѕ СЃРѕС‡РµС‚Р°РЅРёСЋ РїРѕРЅСЏС‚РЅРѕР№ РєСѓС…РЅРё, СѓРјРµСЂРµРЅРЅРѕР№ РЅР°РіСЂСѓР·РєРё Рё С„РёРєСЃРёСЂРѕРІР°РЅРЅРѕР№ СЃС‚Р°РІРєРё.",
    collector: "РЎРёР»СЊРЅРѕРµ СЃРѕРІРїР°РґРµРЅРёРµ РїРѕ С‚РµРјРїСѓ, С‚РѕС‡РЅРѕСЃС‚Рё Рё РіРѕС‚РѕРІРЅРѕСЃС‚Рё СЂР°Р±РѕС‚Р°С‚СЊ СЃ С‚РµСЂРјРёРЅР°Р»РѕРј.",
    cashier: "РҐРѕСЂРѕС€Рѕ СЃРѕРІРїР°РґР°РµС‚ СЃ РєРѕРјС„РѕСЂС‚РѕРј Рє РѕР±С‰РµРЅРёСЋ Рё Р±Р°Р·РѕРІРѕР№ С†РёС„СЂРѕРІРѕР№ РЅР°РіСЂСѓР·РєРµ.",
    rtz: "РџРѕРґС…РѕРґРёС‚ РїРѕРґ СЃРїРѕРєРѕР№РЅС‹Р№ РјР°РіР°Р·РёРЅРЅС‹Р№ СЂРёС‚Рј Рё СѓРјРµСЂРµРЅРЅСѓСЋ С„РёР·РЅР°РіСЂСѓР·РєСѓ.",
    barista: "РџРѕРґС…РѕРґРёС‚ РїРѕ СЃРµСЂРІРёСЃРЅРѕР№ СЂРѕР»Рё Рё РіРѕС‚РѕРІРЅРѕСЃС‚Рё Р±С‹СЃС‚СЂРѕ РІС…РѕРґРёС‚СЊ РІ РЅРѕРІС‹Рµ С„РѕСЂРјР°С‚С‹.",
    courier: "РЎРѕРІРїР°РґР°РµС‚ СЃ РґРёРЅР°РјРёС‡РЅС‹Рј С„РѕСЂРјР°С‚РѕРј Рё РѕСЂРёРµРЅС‚Р°С†РёРµР№ РЅР° Р±РѕР»РµРµ РІС‹СЃРѕРєРёР№ РґРѕС…РѕРґ.",
    warehouse: "РҐРѕСЂРѕС€РёР№ РјР°С‚С‡ РїРѕ СЃРєР»Р°РґСѓ, РїРѕСЂСЏРґРєСѓ Рё СЂР°Р±РѕС‚Рµ Р±РµР· Р»РёС€РЅРµР№ РєРѕРјРјСѓРЅРёРєР°С†РёРё.",
    cleaner_indoor: "РџРѕРґС…РѕРґРёС‚ РїРѕ РїСЂРѕСЃС‚РѕРјСѓ РІС…РѕРґСѓ Рё РЅРёР·РєРѕРјСѓ СѓСЂРѕРІРЅСЋ С†РёС„СЂРѕРІРѕР№ РЅР°РіСЂСѓР·РєРё.",
    cleaner_outdoor: "РЎРѕРІРїР°РґР°РµС‚ СЃ СѓР»РёС‡РЅС‹Рј С„РѕСЂРјР°С‚РѕРј Рё Р±РѕР»РµРµ С„РёР·РёС‡РµСЃРєРё Р°РєС‚РёРІРЅС‹РјРё Р·Р°РґР°С‡Р°РјРё.",
    promoter: "РЎРѕРІРїР°РґР°РµС‚ СЃ РІС‹СЃРѕРєРѕР№ РєРѕРјРјСѓРЅРёРєР°С†РёРµР№ Рё РіРёР±РєРёРј С„РѕСЂРјР°С‚РѕРј РІС‹С…РѕРґР°."
  }[code] || "Р­С‚Р° СЃРјРµРЅР° Р±Р»РёР¶Рµ РІСЃРµРіРѕ Рє С‚РІРѕРµРјСѓ РїСЂРѕС„РёР»СЋ РїРѕ С‚РёРїСѓ Р·Р°РґР°С‡ Рё С„РѕСЂРјР°С‚Сѓ СЂР°Р±РѕС‚С‹.";
}

function inferRoleCode(title) {
  const t = (title || "").toLowerCase();
  if (/РїРѕРІР°СЂ|РєСѓС…РѕРЅ|РєСѓС…РЅ/.test(t)) return "kitchen";
  if (/СЃР±РѕСЂС‰|РєРѕРјРїР»РµРєС‚РѕРІ/.test(t)) return "collector";
  if (/РєР°СЃСЃ/.test(t)) return "cashier";
  if (/РјРµСЂС‡РµРЅ|РІС‹РєР»Р°Рґ/.test(t)) return "rtz";
  if (/Р±Р°СЂРёСЃС‚Р°|РєРѕС„Рµ/.test(t)) return "barista";
  if (/РєСѓСЂСЊРµСЂ|РґРѕСЃС‚Р°РІ/.test(t)) return "courier";
  if (/РєР»Р°РґРѕРІ|СЃРєР»Р°Рґ/.test(t)) return "warehouse";
  if (/С‚РµСЂСЂРёС‚РѕСЂ/.test(t)) return "cleaner_outdoor";
  if (/СѓР±РѕСЂРє|РєР»РёРЅРёРЅРі|РјРѕР№С‰/.test(t)) return "cleaner_indoor";
  if (/РїСЂРѕРјРѕ|С…РѕСЃС‚РµСЃ|РєРѕРЅСЃСѓР»СЊС‚Р°РЅС‚/.test(t)) return "promoter";
  return "rtz";
}

function drawRadar() {
  const c = UI.radar, ctx = c.getContext("2d"), labels = ["Р¤РёР·РёРєР°", "РћР±С‰РµРЅРёРµ", "Р¦РёС„СЂР°", "РЎС‚Р°Р±РёР»СЊРЅРѕСЃС‚СЊ", "РћР±СѓС‡РµРЅРёРµ"], vals = [STATE.score.physical, STATE.score.communication, STATE.score.digital, STATE.score.stability, STATE.score.learning], cx = 160, cy = 130, r = 90, step = (Math.PI * 2) / labels.length;
  ctx.clearRect(0, 0, c.width, c.height); ctx.strokeStyle = "#dbe4ee"; ctx.fillStyle = "#5b6b7a"; ctx.font = '13px "Segoe UI", sans-serif';
  for (let ring = 1; ring <= 4; ring += 1) { ctx.beginPath(); for (let i = 0; i < labels.length; i += 1) { const a = -Math.PI / 2 + i * step, x = cx + Math.cos(a) * (r * ring / 4), y = cy + Math.sin(a) * (r * ring / 4); if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.stroke(); }
  labels.forEach((label, i) => { const a = -Math.PI / 2 + i * step; ctx.fillText(label, cx + Math.cos(a) * (r + 18) - 24, cy + Math.sin(a) * (r + 18)); });
  ctx.beginPath(); vals.forEach((v, i) => { const a = -Math.PI / 2 + i * step, x = cx + Math.cos(a) * (r * v / 100), y = cy + Math.sin(a) * (r * v / 100); if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.closePath(); ctx.fillStyle = "rgba(15, 118, 110, 0.25)"; ctx.strokeStyle = "#0f766e"; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
}

function downloadProfile() {
  const payload = {
    generatedAt: new Date().toISOString(),
    answers: STATE.answers,
    badges: STATE.badges,
    experience: {
      details: String(STATE.answers.experience_details || "").trim(),
      hasDetails: Boolean(String(STATE.answers.experience_details || "").trim())
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "smena-profile.json"; a.click(); URL.revokeObjectURL(url);
}

function renderMetroSummary() {
  const metro = String(STATE.answers.metro || "").trim();
  if (!metro) {
    UI.metroSummary.classList.add("hidden");
    UI.metroSummary.classList.remove("metro-summary");
    UI.metroSummary.textContent = "";
    return;
  }
  UI.metroSummary.classList.remove("hidden");
  UI.metroSummary.classList.add("metro-summary");
  UI.metroSummary.textContent = `РС‰РµРј СЃРјРµРЅС‹ СЂСЏРґРѕРј СЃ РјРµС‚СЂРѕ: ${metro}`;
}

function normalizeCity(city) {
  return decodeMojibake(String(city || ""))
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/^г\.\s*/g, "")
    .replace(/^город\s+/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeMojibake(value) {
  const text = String(value || "");
  if (!/[ÐÑРС]/.test(text)) return text;
  try {
    const decoded = decodeURIComponent(escape(text));
    return scoreCyrillic(decoded) > scoreCyrillic(text) ? decoded : text;
  } catch {
    return text;
  }
}

function scoreCyrillic(value) {
  return (String(value || "").match(/[А-Яа-яЁё]/g) || []).length;
}

function getCityMeta(city) {
  const normalized = normalizeCity(city);
  if (!normalized) return null;
  if (CITY_SUPPORT[normalized]) return CITY_SUPPORT[normalized];

  const compact = normalized.replace(/\s+/g, "");
  const foundAlias = Object.keys(CITY_SUPPORT).find((alias) => {
    const compactAlias = alias.replace(/\s+/g, "");
    return alias.includes(normalized) || normalized.includes(alias) || compactAlias === compact;
  });
  return foundAlias ? CITY_SUPPORT[foundAlias] : null;
}
function upcomingDates() { const n = new Date(), out = []; for (let d = 1; d <= 2; d += 1) { const x = new Date(n); x.setDate(n.getDate() + d); out.push(x.toISOString().slice(0, 10)); } return out; }
function escapeHtml(x) { return String(x || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

function matchesMetro(address, metroRaw) {
  if (!address || !metroRaw) return false;
  const haystack = String(address).toLowerCase().replace(/С‘/g, "Рµ");
  return metroRaw
    .split(",")
    .map((x) => x.trim().toLowerCase().replace(/С‘/g, "Рµ"))
    .filter(Boolean)
    .some((station) => haystack.includes(station));
}

async function loadCitiesConfig() {
  try {
    const cities = await fetchCitiesPayload();
    const map = {};
    const labels = new Set();
    cities.forEach((city) => {
      const label = decodeMojibake(city.label || city.city_name_ru || city.city_name_en || city.city_slug || "");
      if (label) labels.add(label);
      (city.aliases || []).forEach((alias) => {
        map[normalizeCity(alias)] = {
          id: city.id || city.location_id,
          slug: city.slug || city.city_slug,
          label,
          supportsMetro: Boolean(city.supportsMetro ?? city.supports_metro)
        };
      });
    });
    if (Object.keys(map).length) CITY_SUPPORT = map;
    if (labels.size) CITY_OPTIONS = Array.from(labels).sort((a, b) => a.localeCompare(b, "ru"));
    renderCitySuggestions();
  } catch {
    renderCitySuggestions();
  }
}

async function fetchCitiesPayload() {
  const apiResponse = await fetch("/api/cities");
  if (apiResponse.ok) {
    const payload = await apiResponse.json();
    if ((payload.cities || []).length) return payload.cities;
  }

  const staticResponse = await fetch("/data/cities.generated.json");
  if (!staticResponse.ok) throw new Error("City config unavailable");
  return await staticResponse.json();
}

function renderCitySuggestions() {
  // Suggestions are rendered on input for better browser consistency
}

function getTextPlaceholder(id) {
  if (id === "city") return "Р’РІРµРґРёС‚Рµ РіРѕСЂРѕРґ";
  if (id === "metro") return "РќР°РїСЂРёРјРµСЂ: Р‘РµР»РѕСЂСѓСЃСЃРєР°СЏ, РЎР°РІРµР»РѕРІСЃРєР°СЏ";
  if (id === "experience_details") return "РќР°РїСЂРёРјРµСЂ: 2 РіРѕРґР° РІ СЂРёС‚РµР№Р»Рµ, СѓРјРµСЋ СЂР°Р±РѕС‚Р°С‚СЊ СЃ РєР°СЃСЃРѕР№, РІС‹РєР»Р°РґРєРѕР№ Рё РєР»РёРµРЅС‚Р°РјРё";
  return "";
}

function configureVoiceControls(type) {
  if (!UI.voiceControls || !UI.voiceBtn || !UI.voiceStatus) return;
  if (type !== "text_voice_optional") {
    UI.voiceControls.classList.add("hidden");
    stopVoiceInput();
    return;
  }
  UI.voiceControls.classList.remove("hidden");
  const supported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  UI.voiceBtn.disabled = !supported;
  UI.voiceStatus.textContent = supported
    ? "РњРѕР¶РЅРѕ РЅР°РїРёСЃР°С‚СЊ РѕС‚РІРµС‚ РёР»Рё РЅР°РґРёРєС‚РѕРІР°С‚СЊ РµРіРѕ РіРѕР»РѕСЃРѕРј"
    : "Р’ СЌС‚РѕРј Р±СЂР°СѓР·РµСЂРµ РіРѕР»РѕСЃРѕРІРѕР№ РІРІРѕРґ РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚СЃСЏ. РњРѕР¶РЅРѕ РѕС‚РІРµС‚РёС‚СЊ С‚РµРєСЃС‚РѕРј.";
  if (!supported) return;
  initVoiceRecognition();
}

function initVoiceRecognition() {
  if (speechRecognition || !(window.SpeechRecognition || window.webkitSpeechRecognition)) return;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRecognition = new Recognition();
  speechRecognition.lang = "ru-RU";
  speechRecognition.interimResults = true;
  speechRecognition.continuous = false;

  speechRecognition.onstart = () => {
    speechActive = true;
    UI.voiceControls?.classList.add("is-recording");
    if (UI.voiceBtn) UI.voiceBtn.textContent = "РћСЃС‚Р°РЅРѕРІРёС‚СЊ Р·Р°РїРёСЃСЊ";
    if (UI.voiceStatus) UI.voiceStatus.textContent = "РЎР»СѓС€Р°СЋ... РјРѕР¶РЅРѕ РіРѕРІРѕСЂРёС‚СЊ СЃРІРѕР±РѕРґРЅРѕ";
  };

  speechRecognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join(" ")
      .trim();
    if (UI.textAnswer && transcript) UI.textAnswer.value = transcript;
  };

  speechRecognition.onend = () => {
    speechActive = false;
    UI.voiceControls?.classList.remove("is-recording");
    if (UI.voiceBtn) UI.voiceBtn.textContent = "Р“РѕР»РѕСЃРѕРІРѕР№ РѕС‚РІРµС‚";
    if (UI.voiceStatus) UI.voiceStatus.textContent = "РњРѕР¶РЅРѕ РїРѕРґРїСЂР°РІРёС‚СЊ С‚РµРєСЃС‚ РІСЂСѓС‡РЅСѓСЋ Рё РїСЂРѕРґРѕР»Р¶РёС‚СЊ";
  };

  speechRecognition.onerror = () => {
    speechActive = false;
    UI.voiceControls?.classList.remove("is-recording");
    if (UI.voiceBtn) UI.voiceBtn.textContent = "Р“РѕР»РѕСЃРѕРІРѕР№ РѕС‚РІРµС‚";
    if (UI.voiceStatus) UI.voiceStatus.textContent = "РќРµ СѓРґР°Р»РѕСЃСЊ СЂР°СЃРїРѕР·РЅР°С‚СЊ РіРѕР»РѕСЃ. РњРѕР¶РЅРѕ РѕС‚РІРµС‚РёС‚СЊ С‚РµРєСЃС‚РѕРј.";
  };
}

function toggleVoiceInput() {
  if (!speechRecognition) {
    initVoiceRecognition();
    if (!speechRecognition) return;
  }
  if (speechActive) {
    speechRecognition.stop();
    return;
  }
  speechRecognition.start();
}

function stopVoiceInput() {
  if (speechRecognition && speechActive) speechRecognition.stop();
  speechActive = false;
  UI.voiceControls?.classList.remove("is-recording");
  if (UI.voiceBtn) UI.voiceBtn.textContent = "Р“РѕР»РѕСЃРѕРІРѕР№ РѕС‚РІРµС‚";
}

function handleCityInput(input, box) {
  if (!input || !box) return;
  ACTIVE_CITY_INPUT = input;
  const query = normalizeCity(input.value || "");
  if (!query) {
    hideAutocomplete(box);
    return;
  }

  const matches = CITY_OPTIONS
    .filter((label) => normalizeCity(label).includes(query))
    .slice(0, 6);

  if (!matches.length) {
    box.innerHTML = `<div class="autocomplete-empty">Р“РѕСЂРѕРґ РЅРµ РЅР°Р№РґРµРЅ РІ РґРѕСЃС‚СѓРїРЅРѕРј СЃРїРёСЃРєРµ</div>`;
    box.classList.remove("hidden");
    return;
  }

  box.innerHTML = matches
    .map((label) => `<button type="button" class="autocomplete-item" data-city="${escapeHtml(label)}">${escapeHtml(label)}</button>`)
    .join("");
  box.classList.remove("hidden");
  box.querySelectorAll(".autocomplete-item").forEach((button) => {
    button.addEventListener("click", () => selectCitySuggestion(labelFromDataset(button), input, box));
  });
}

function selectCitySuggestion(label, input, box) {
  input.value = label;
  hideAutocomplete(box);
  if (input === UI.resultCityInput) syncLocationEditorState();
}

function labelFromDataset(node) {
  return node.getAttribute("data-city") || "";
}

function hideAutocomplete(box) {
  if (!box) return;
  box.classList.add("hidden");
  box.innerHTML = "";
}

function handleOutsideAutocompleteClick(event) {
  const insideQuizInput = event.target.closest(".suggest-input");
  if (!insideQuizInput) {
    hideAutocomplete(UI.cityAutocomplete);
    hideAutocomplete(UI.resultCityAutocomplete);
  }
}

function renderShiftLink(shift) {
  if (shift.isDirectUrl && shift.url) {
    return `<a class="shift-link shift-cta" href="${shift.url}" target="_blank" rel="noreferrer">РћС‚РєСЂС‹С‚СЊ СЃРјРµРЅСѓ</a>`;
  }
  if (shift.listUrl) {
    return `<a class="shift-link shift-cta" href="${shift.listUrl}" target="_blank" rel="noreferrer">РћС‚РєСЂС‹С‚СЊ СЃРїРёСЃРѕРє СЃРјРµРЅ РЅР° СЌС‚Сѓ РґР°С‚Сѓ</a>`;
  }
  return "";
}

function renderShiftLinkBadge(shift) {
  const label = shift.isDirectUrl ? "РџСЂСЏРјР°СЏ СЃСЃС‹Р»РєР°" : "РЎСЃС‹Р»РєР° РЅР° СЃРїРёСЃРѕРє СЃРјРµРЅ";
  const cls = shift.isDirectUrl ? "tag tag-direct" : "tag tag-list";
  const href = shift.isDirectUrl ? shift.url : shift.listUrl;
  if (href) {
    return `<div><a class="${cls} shift-pill-link" href="${href}" target="_blank" rel="noreferrer">${label}</a></div>`;
  }
  return `<div><span class="${cls}">${label}</span></div>`;
}






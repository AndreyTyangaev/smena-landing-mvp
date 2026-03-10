const questions = [
  { id: "work_goal", text: "Р”Р»СЏ С‡РµРіРѕ С‚С‹ СЃРµР№С‡Р°СЃ РёС‰РµС€СЊ СЃРјРµРЅС‹?", hint: "РћРїСЂРµРґРµР»Рё РіР»Р°РІРЅС‹Р№ РјРѕС‚РёРІ", options: ["РџРѕРґСЂР°Р±РѕС‚РєР°", "РћСЃРЅРѕРІРЅРѕР№ РґРѕС…РѕРґ", "Р’СЂРµРјРµРЅРЅР°СЏ СЂР°Р±РѕС‚Р°", "РР·СѓС‡Р°СЋ РІР°СЂРёР°РЅС‚С‹"] },
  { id: "city", text: "РР· РєР°РєРѕРіРѕ С‚С‹ РіРѕСЂРѕРґР°?", hint: "РџРѕРґР±РµСЂРµРј РЅР°РїСЂР°РІР»РµРЅРёСЏ СЃ СѓС‡РµС‚РѕРј СЂРµРіРёРѕРЅР°", options: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі", "РљР°Р·Р°РЅСЊ", "Р•РєР°С‚РµСЂРёРЅР±СѓСЂРі", "Р”СЂСѓРіРѕР№ РіРѕСЂРѕРґ"] },
  { id: "shifts_week", text: "РЎРєРѕР»СЊРєРѕ СЃРјРµРЅ РІ РЅРµРґРµР»СЋ РєРѕРјС„РѕСЂС‚РЅРѕ?", hint: "РќСѓР¶РµРЅ СЂРµР°Р»РёСЃС‚РёС‡РЅС‹Р№ СЂРёС‚Рј", options: ["1-2", "3-4", "5+"] },
  { id: "age_group", text: "РўРІРѕР№ РІРѕР·СЂР°СЃС‚РЅРѕР№ РґРёР°РїР°Р·РѕРЅ?", hint: "РќСѓР¶РЅРѕ РґР»СЏ Р°РґР°РїС‚Р°С†РёРё СЃР»РѕР¶РЅРѕСЃС‚Рё Рё РѕРЅР±РѕСЂРґРёРЅРіР°", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
  { id: "physical", text: "РљР°РєР°СЏ С„РёР·РЅР°РіСЂСѓР·РєР° РєРѕРјС„РѕСЂС‚РЅР°?", hint: "РЎРІРµСЂРёРј СЃ СЂРѕР»СЏРјРё РїРѕ С‚СЏР¶РµСЃС‚Рё", options: ["Р›РµРіРєР°СЏ", "РЎСЂРµРґРЅСЏСЏ", "РўСЏР¶РµР»Р°СЏ"] },
  { id: "standing", text: "РљР°Рє РѕС‚РЅРѕСЃРёС€СЊСЃСЏ Рє СЂР°Р±РѕС‚Рµ РЅР° РЅРѕРіР°С…?", hint: "РЈС‡РёС‚С‹РІР°РµРј СЃС‚РѕСЏС‡РёРµ Рё СЃРјРµС€Р°РЅРЅС‹Рµ СЃРјРµРЅС‹", options: ["Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹", "РќСѓР¶РЅР° СЃРёРґСЏС‡Р°СЏ"] },
  { id: "outdoor", text: "Р“РѕС‚РѕРІ(Р°) СЂР°Р±РѕС‚Р°С‚СЊ РЅР° СѓР»РёС†Рµ РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ?", hint: "Р’Р°Р¶РЅРѕ РґР»СЏ С‚РµСЂСЂРёС‚РѕСЂРёРё Рё РєСѓСЂСЊРµСЂСЃРєРёС… Р·Р°РґР°С‡", options: ["Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ", "РўРѕР»СЊРєРѕ РІ С‚РµРїР»С‹Р№ СЃРµР·РѕРЅ", "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё"] },
  { id: "heavy_weight", text: "РљРѕРјС„РѕСЂС‚РЅРѕ СЂРµРіСѓР»СЏСЂРЅРѕ РїРµСЂРµРЅРѕСЃРёС‚СЊ 15-20 РєРі?", hint: "РќСѓР¶РЅРѕ РґР»СЏ С‡Р°СЃС‚Рё СЃРєР»Р°РґСЃРєРёС… Рё СѓР»РёС‡РЅС‹С… СЂРѕР»РµР№", options: ["Р”Р°, РѕРє", "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°", "Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°"] },
  { id: "digital", text: "РљР°Рє С‚РµР±Рµ СЂР°Р±РѕС‚Р° СЃ РїСЂРёР»РѕР¶РµРЅРёСЏРјРё/С‚РµСЂРјРёРЅР°Р»РѕРј?", hint: "РћРїСЂРµРґРµР»СЏРµС‚ С†РёС„СЂРѕРІСѓСЋ СЃР»РѕР¶РЅРѕСЃС‚СЊ СЂРѕР»РµР№", options: ["РЈРІРµСЂРµРЅРЅРѕ", "РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ"] },
  { id: "communication", text: "РќР°СЃРєРѕР»СЊРєРѕ РєРѕРјС„РѕСЂС‚РЅРѕ РѕР±С‰Р°С‚СЊСЃСЏ СЃ РєР»РёРµРЅС‚Р°РјРё?", hint: "Р Р°Р·РґРµР»СЏРµРј С„СЂРѕРЅС‚- Рё Р±СЌРє-РїРѕР·РёС†РёРё", options: ["Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ", "РќРѕСЂРјР°Р»СЊРЅРѕ", "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ"] },
  { id: "pay_model", text: "РљР°Рє С‚РµР±Рµ СЃРґРµР»СЊРЅР°СЏ РѕРїР»Р°С‚Р° (Р·Р°РІРёСЃРёС‚ РѕС‚ РѕР±СЉРµРјР°)?", hint: "Р­С‚Рѕ РІР»РёСЏРµС‚ РЅР° С„РѕСЂРјР°С‚ РїСЂРµРґР»РѕР¶РµРЅРёР№", options: ["Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ", "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј", "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ"] },
  { id: "pay_priority", text: "Р§С‚Рѕ СЃРµР№С‡Р°СЃ РІР°Р¶РЅРµРµ РІСЃРµРіРѕ?", hint: "Р‘Р°Р»Р°РЅСЃ РґРѕС…РѕРґР°, СЃС‚Р°Р±РёР»СЊРЅРѕСЃС‚Рё Рё РєРѕРјС„РѕСЂС‚Р°", options: ["РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ", "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°", "РљРѕРјС„РѕСЂС‚ Рё РјРµРЅСЊС€Рµ СЃС‚СЂРµСЃСЃР°"] },
  { id: "cleaning", text: "Р“РѕС‚РѕРІ(Р°) Рє Р·Р°РґР°С‡Р°Рј СѓР±РѕСЂРєРё РїРѕРјРµС‰РµРЅРёР№/СЃР°РЅСѓР·Р»РѕРІ?", hint: "Р’Р°Р¶РЅРѕ РґР»СЏ cleaner-СЃРµРјРµР№СЃС‚РІР°", options: ["Р”Р°, СЌС‚Рѕ РѕРє", "РўРѕР»СЊРєРѕ Р·Р°Р»/РѕС„РёСЃ", "Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё"] },
  { id: "skills", text: "Р“РґРµ СѓР¶Рµ РµСЃС‚СЊ РѕРїС‹С‚? (РІС‹Р±РµСЂРё РґРѕ 4)", hint: "Р­С‚Рѕ РѕСЃРЅРѕРІР° skills-РІРµРєС‚РѕСЂР°", multi: true, minSelected: 2, options: ["РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ", "Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", "РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№", "РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё", "РљР°СЃСЃР°", "РљСѓС…РЅСЏ", "Р‘Р°СЂРёСЃС‚Р°", "РљСѓСЂСЊРµСЂ", "РљР»Р°РґРѕРІС‰РёРє", "РњРµСЂС‡РµРЅРґР°Р№Р·РµСЂ", "РџСЂРѕРјРѕСѓС‚РµСЂ", "РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ/С…РѕСЃС‚РµСЃ"] },
  { id: "interests", text: "РљР°РєРёРµ РЅР°РїСЂР°РІР»РµРЅРёСЏ С…РѕС‡РµС€СЊ РїРѕРїСЂРѕР±РѕРІР°С‚СЊ? (РґРѕ 4)", hint: "РЎРёРіРЅР°Р» РґР»СЏ Р·Р°РїСѓСЃРєР° РЅРѕРІС‹С… РїСЂРѕС„РµСЃСЃРёР№", multi: true, minSelected: 2, options: ["РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ", "Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", "РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№", "РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё", "РљР°СЃСЃР°", "РљСѓС…РЅСЏ", "Р‘Р°СЂРёСЃС‚Р°", "РљСѓСЂСЊРµСЂ", "РљР»Р°РґРѕРІС‰РёРє", "РњРµСЂС‡РµРЅРґР°Р№Р·РµСЂ", "РџСЂРѕРјРѕСѓС‚РµСЂ", "РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ/С…РѕСЃС‚РµСЃ"] },
  { id: "training_ready", text: "Р“РѕС‚РѕРІ(Р°) РїСЂРѕР№С‚Рё РєРѕСЂРѕС‚РєРѕРµ РѕР±СѓС‡РµРЅРёРµ 1-2 С‡Р°СЃР°?", hint: "РќСѓР¶РЅРѕ РґР»СЏ СЂРѕР»РµР№ СЃ training_required", options: ["Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°", "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕС‡РµРЅСЊ РєРѕСЂРѕС‚РєРѕ", "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ Р±РµР· РѕР±СѓС‡РµРЅРёСЏ"] }
];

const rolesCatalog = [
  { role: "РЎР±РѕСЂС‰РёРє Р·Р°РєР°Р·РѕРІ", family: "РЎР±РѕСЂРєР°", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі", "РљР°Р·Р°РЅСЊ"], intensity: "РўСЏР¶РµР»Р°СЏ", standing: "Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", outdoor: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё", heavy: "Р”Р°, РѕРє", digital: "РќРѕСЂРјР°Р»СЊРЅРѕ", communication: "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", payModel: "Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ", cleaning: "РўРѕР»СЊРєРѕ Р·Р°Р»/РѕС„РёСЃ", training: "Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°", skills: ["РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ", "РљР»Р°РґРѕРІС‰РёРє"], pay: 5200, tags: ["collector", "РўРµСЂРјРёРЅР°Р»", "РЎРґРµР»СЊРЅР°СЏ"] },
  { role: "Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", family: "РўРѕСЂРіРѕРІС‹Р№ Р·Р°Р»", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі", "Р•РєР°С‚РµСЂРёРЅР±СѓСЂРі"], intensity: "РЎСЂРµРґРЅСЏСЏ", standing: "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹", outdoor: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё", heavy: "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°", digital: "РќРѕСЂРјР°Р»СЊРЅРѕ", communication: "РќРѕСЂРјР°Р»СЊРЅРѕ", payModel: "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", cleaning: "РўРѕР»СЊРєРѕ Р·Р°Р»/РѕС„РёСЃ", training: "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕС‡РµРЅСЊ РєРѕСЂРѕС‚РєРѕ", skills: ["Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ", "РњРµСЂС‡РµРЅРґР°Р№Р·РµСЂ"], pay: 4300, tags: ["rtz", "РџР»Р°РЅРѕРіСЂР°РјРјР°", "Р¤РёРєСЃ"] },
  { role: "РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№", family: "РљР»РёРЅРёРЅРі", city: ["РњРѕСЃРєРІР°", "РљР°Р·Р°РЅСЊ", "Р•РєР°С‚РµСЂРёРЅР±СѓСЂРі"], intensity: "РЎСЂРµРґРЅСЏСЏ", standing: "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹", outdoor: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё", heavy: "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°", digital: "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ", communication: "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", payModel: "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", cleaning: "Р”Р°, СЌС‚Рѕ РѕРє", training: "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕС‡РµРЅСЊ РєРѕСЂРѕС‚РєРѕ", skills: ["РЈР±РѕСЂРєР° РїРѕРјРµС‰РµРЅРёР№"], pay: 3900, tags: ["cleaner", "РџСЂРѕСЃС‚РѕР№ РІС…РѕРґ", "Р‘РµР· С†РёС„СЂС‹"] },
  { role: "РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё", family: "РљР»РёРЅРёРЅРі", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі"], intensity: "РўСЏР¶РµР»Р°СЏ", standing: "Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", outdoor: "Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ", heavy: "Р”Р°, РѕРє", digital: "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ", communication: "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", payModel: "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", cleaning: "Р”Р°, СЌС‚Рѕ РѕРє", training: "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕС‡РµРЅСЊ РєРѕСЂРѕС‚РєРѕ", skills: ["РЈР±РѕСЂРєР° С‚РµСЂСЂРёС‚РѕСЂРёРё"], pay: 4700, tags: ["cleaner", "cold_conditions", "heavy_weight"] },
  { role: "РљР°СЃСЃРёСЂ", family: "РўРѕСЂРіРѕРІС‹Р№ Р·Р°Р»", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі", "РљР°Р·Р°РЅСЊ", "Р•РєР°С‚РµСЂРёРЅР±СѓСЂРі"], intensity: "Р›РµРіРєР°СЏ", standing: "РўРѕР»СЊРєРѕ С‡Р°СЃС‚СЊ СЃРјРµРЅС‹", outdoor: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё", heavy: "Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°", digital: "РќРѕСЂРјР°Р»СЊРЅРѕ", communication: "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ", payModel: "РўРѕР»СЊРєРѕ С„РёРєСЃ Р·Р° СЃРјРµРЅСѓ", cleaning: "РўРѕР»СЊРєРѕ Р·Р°Р»/РѕС„РёСЃ", training: "Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°", skills: ["РљР°СЃСЃР°"], pay: 4400, tags: ["РљР»РёРµРЅС‚С‹", "РЎС‚Р°Р±РёР»СЊРЅРѕСЃС‚СЊ", "РћР±СѓС‡РµРЅРёРµ"] },
  { role: "РљСѓС…РѕРЅРЅС‹Р№ СЂР°Р±РѕС‚РЅРёРє/РїРѕРІР°СЂ", family: "РљСѓС…РЅСЏ", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі"], intensity: "РЎСЂРµРґРЅСЏСЏ", standing: "Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", outdoor: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё", heavy: "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°", digital: "Р›СѓС‡С€Рµ РїРѕРїСЂРѕС‰Рµ", communication: "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", payModel: "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј", cleaning: "Р”Р°, СЌС‚Рѕ РѕРє", training: "Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°", skills: ["РљСѓС…РЅСЏ"], pay: 5000, tags: ["РџСЂРѕС„РЅР°РІС‹Рє", "РљРѕРјР°РЅРґР°", "Р РѕСЃС‚"] },
  { role: "Р‘Р°СЂРёСЃС‚Р°", family: "HoReCa", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі"], intensity: "РЎСЂРµРґРЅСЏСЏ", standing: "Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", outdoor: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ РІ РїРѕРјРµС‰РµРЅРёРё", heavy: "Р›СѓС‡С€Рµ Р±РµР· С‚СЏР¶РµР»РѕРіРѕ РІРµСЃР°", digital: "РЈРІРµСЂРµРЅРЅРѕ", communication: "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ", payModel: "РћРє, РµСЃР»Рё РµСЃС‚СЊ РјРёРЅРёРјСѓРј", cleaning: "РўРѕР»СЊРєРѕ Р·Р°Р»/РѕС„РёСЃ", training: "Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°", skills: ["Р‘Р°СЂРёСЃС‚Р°"], pay: 5600, tags: ["РЎРµСЂРІРёСЃ", "РџСЂРµРјРёР°Р»СЊРЅС‹Рµ С‚РѕС‡РєРё", "Р РѕСЃС‚ РґРѕС…РѕРґР°"] },
  { role: "РљСѓСЂСЊРµСЂ", family: "Р›РѕРіРёСЃС‚РёРєР°", city: ["РњРѕСЃРєРІР°", "РЎР°РЅРєС‚-РџРµС‚РµСЂР±СѓСЂРі", "РљР°Р·Р°РЅСЊ", "Р•РєР°С‚РµСЂРёРЅР±СѓСЂРі"], intensity: "РўСЏР¶РµР»Р°СЏ", standing: "Р’СЃСЋ СЃРјРµРЅСѓ РѕРє", outdoor: "Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ", heavy: "РўРѕР»СЊРєРѕ РёРЅРѕРіРґР°", digital: "РќРѕСЂРјР°Р»СЊРЅРѕ", communication: "РќРѕСЂРјР°Р»СЊРЅРѕ", payModel: "Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ", cleaning: "Р›СѓС‡С€Рµ Р±РµР· СѓР±РѕСЂРєРё", training: "РџСЂРµРґРїРѕС‡РёС‚Р°СЋ Р±РµР· РѕР±СѓС‡РµРЅРёСЏ", skills: ["РљСѓСЂСЊРµСЂ"], pay: 6000, tags: ["РЎРґРµР»СЊРЅР°СЏ", "РЈР»РёС†Р°", "РњР°РєСЃРёРјСѓРј РґРѕС…РѕРґР°"] }
];

const profileMap = [
  { key: "stable_retail", title: "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїРѕРјРѕС‰РЅРёРє РІ С‚РѕСЂРіРѕРІР»Рµ", when: (a) => a.pay_priority === "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ" && a.physical !== "РўСЏР¶РµР»Р°СЏ", desc: "РўРµР±Рµ РїРѕРґС…РѕРґСЏС‚ СЂРѕР»Рё СЃ РїРѕРЅСЏС‚РЅС‹Рј СЂРёС‚РјРѕРј, СѓРјРµСЂРµРЅРЅРѕР№ РЅР°РіСЂСѓР·РєРѕР№ Рё С„РёРєСЃРёСЂРѕРІР°РЅРЅС‹Рј Р·Р°СЂР°Р±РѕС‚РєРѕРј." },
  { key: "dynamic_earner", title: "РћС…РѕС‚РЅРёРє Р·Р° Р·Р°СЂР°Р±РѕС‚РєРѕРј", when: (a) => a.pay_model === "Р›СЋР±Р»СЋ СЃРґРµР»СЊРЅСѓСЋ" || a.pay_priority === "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°", desc: "РўС‹ РіРѕС‚РѕРІ(Р°) Рє РґРёРЅР°РјРёС‡РЅС‹Рј СЃРјРµРЅР°Рј, РіРґРµ РґРѕС…РѕРґ СЂР°СЃС‚РµС‚ РІРјРµСЃС‚Рµ СЃ С‚РµРјРїРѕРј Рё РѕР±СЉРµРјРѕРј Р·Р°РґР°С‡." },
  { key: "quiet_operator", title: "РњР°СЃС‚РµСЂ СЃРїРѕРєРѕР№РЅРѕРіРѕ РїРѕСЂСЏРґРєР°", when: (a) => a.communication === "Р›СѓС‡С€Рµ Р±РµР· РѕР±С‰РµРЅРёСЏ", desc: "РўРµР±Рµ РєРѕРјС„РѕСЂС‚РЅРµРµ Р±СЌРє-С„РѕСЂРјР°С‚С‹, РіРґРµ РІР°Р¶РЅС‹ Р°РєРєСѓСЂР°С‚РЅРѕСЃС‚СЊ, С‚РµРјРї Рё РјРµРЅСЊС€Рµ РєР»РёРµРЅС‚СЃРєРѕРіРѕ РєРѕРЅС‚Р°РєС‚Р°." },
  { key: "growth_track", title: "РџРѕС‚РµРЅС†РёР°Р» Р±С‹СЃС‚СЂРѕРіРѕ СЂРѕСЃС‚Р°", when: (a) => a.training_ready === "Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°" && (a.interests || []).length >= 2, desc: "РўС‹ РіРѕС‚РѕРІ(Р°) СѓС‡РёС‚СЊСЃСЏ Рё СЂР°СЃС€РёСЂСЏС‚СЊ РїСЂРѕС„РЅР°РІС‹РєРё, С‡С‚РѕР±С‹ РѕС‚РєСЂС‹РІР°С‚СЊ Р±РѕР»РµРµ РѕРїР»Р°С‡РёРІР°РµРјС‹Рµ СЂРѕР»Рё." }
];

const state = { index: 0, answers: {}, badges: [], selected: [], score: { physical: 50, communication: 50, digital: 50, stability: 50, learning: 50 } };
const ui = {
  startBtn: document.getElementById("startBtn"), learnBtn: document.getElementById("learnBtn"), quizSection: document.getElementById("quizSection"), resultSection: document.getElementById("resultSection"),
  title: document.getElementById("questionTitle"), hint: document.getElementById("questionHint"), options: document.getElementById("options"), badges: document.getElementById("badges"),
  progressText: document.getElementById("progressText"), progressBar: document.getElementById("progressBar"), multiActions: document.getElementById("multiActions"), doneMultiBtn: document.getElementById("doneMultiBtn"),
  profileName: document.getElementById("profileName"), profileDesc: document.getElementById("profileDesc"), incomeForecast: document.getElementById("incomeForecast"), trainReadiness: document.getElementById("trainReadiness"),
  topScore: document.getElementById("topScore"), recommendations: document.getElementById("recommendations"), familyFit: document.getElementById("familyFit"), fallbackBox: document.getElementById("fallbackBox"),
  restartBtn: document.getElementById("restartBtn"), downloadBtn: document.getElementById("downloadBtn"), radar: document.getElementById("radar")
};

ui.startBtn.addEventListener("click", () => { ui.quizSection.classList.remove("hidden"); ui.quizSection.scrollIntoView({ behavior: "smooth", block: "start" }); renderQuestion(); });
if (ui.learnBtn) { ui.learnBtn.addEventListener("click", () => { const about = document.getElementById("about"); if (about) about.scrollIntoView({ behavior: "smooth" }); }); }
ui.restartBtn.addEventListener("click", () => window.location.reload());
ui.downloadBtn.addEventListener("click", downloadProfile);
ui.doneMultiBtn.addEventListener("click", submitMulti);

function renderQuestion() {
  const q = questions[state.index];
  state.selected = [];
  ui.title.textContent = q.text;
  ui.hint.textContent = q.hint;
  ui.progressText.textContent = `${state.index + 1}/${questions.length}`;
  ui.progressBar.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  ui.options.innerHTML = "";
  if (q.multi) { ui.multiActions.classList.remove("hidden"); ui.doneMultiBtn.textContent = `Р“РѕС‚РѕРІРѕ (РјРёРЅРёРјСѓРј ${q.minSelected})`; } else { ui.multiActions.classList.add("hidden"); }

  q.options.forEach((option) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = option;
    b.addEventListener("click", () => q.multi ? toggleMulti(option, b) : submitSingle(q.id, option));
    ui.options.appendChild(b);
  });

  ui.badges.innerHTML = state.badges.map((b) => `<span class="badge">${b}</span>`).join("");
}

function toggleMulti(option, btn) {
  if (state.selected.includes(option)) {
    state.selected = state.selected.filter((x) => x !== option);
    btn.classList.remove("selected");
  } else if (state.selected.length < 4) {
    state.selected.push(option);
    btn.classList.add("selected");
  }
}

function submitSingle(id, answer) {
  state.answers[id] = answer;
  adaptScore(id, answer);
  nextStep();
}

function submitMulti() {
  const q = questions[state.index];
  if (state.selected.length < q.minSelected) return;
  state.answers[q.id] = [...state.selected];
  if (q.id === "skills" || q.id === "interests") grantBadge("РСЃСЃР»РµРґРѕРІР°С‚РµР»СЊ РїСЂРѕС„РµСЃСЃРёР№");
  if (q.id === "interests" && state.selected.length >= 3) grantBadge("РћС‚РєСЂС‹С‚(Р°) РЅРѕРІРѕРјСѓ");
  nextStep();
}

function nextStep() {
  state.index += 1;
  if (state.index < questions.length) renderQuestion(); else finish();
}

function adaptScore(id, answer) {
  if (id === "physical") state.score.physical = answer === "Р›РµРіРєР°СЏ" ? 25 : answer === "РЎСЂРµРґРЅСЏСЏ" ? 60 : 90;
  if (id === "communication") state.score.communication = answer === "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ" ? 90 : answer === "РќРѕСЂРјР°Р»СЊРЅРѕ" ? 60 : 20;
  if (id === "digital") state.score.digital = answer === "РЈРІРµСЂРµРЅРЅРѕ" ? 90 : answer === "РќРѕСЂРјР°Р»СЊРЅРѕ" ? 60 : 30;
  if (id === "pay_priority") state.score.stability = answer === "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ" ? 90 : answer === "РљРѕРјС„РѕСЂС‚ Рё РјРµРЅСЊС€Рµ СЃС‚СЂРµСЃСЃР°" ? 70 : 40;
  if (id === "training_ready") state.score.learning = answer === "Р”Р°, РѕСЃРѕР±РµРЅРЅРѕ РµСЃР»Рё СЌС‚Рѕ РґР°РµС‚ СЂРѕСЃС‚ РґРѕС…РѕРґР°" ? 90 : answer === "РўРѕР»СЊРєРѕ РµСЃР»Рё РѕС‡РµРЅСЊ РєРѕСЂРѕС‚РєРѕ" ? 60 : 30;
  if (id === "digital" && answer === "РЈРІРµСЂРµРЅРЅРѕ") grantBadge("Р¦РёС„СЂРѕРІРѕР№ РїСЂРѕС„Рё");
  if (id === "outdoor" && answer === "Р”Р°, РІ Р»СЋР±СѓСЋ РїРѕРіРѕРґСѓ") grantBadge("Р“РѕС‚РѕРІ(Р°) Рє РїРѕР»РµРІС‹Рј Р·Р°РґР°С‡Р°Рј");
}

function grantBadge(text) { if (!state.badges.includes(text)) state.badges.push(text); }

function finish() {
  const profile = detectProfile();
  const ranked = enforceTopRule(rankRoles(state.answers));
  const top = ranked.slice(0, 3);

  ui.quizSection.classList.add("hidden");
  ui.resultSection.classList.remove("hidden");
  ui.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

  ui.profileName.textContent = profile.title;
  ui.profileDesc.textContent = profile.desc;
  const avg = top.length ? Math.round(top.reduce((s, r) => s + r.pay, 0) / top.length) : 4200;
  ui.incomeForecast.textContent = `${avg * 4} - ${(avg + 900) * 4} в‚Ѕ`;
  ui.trainReadiness.textContent = `${state.score.learning}/100`;
  ui.topScore.textContent = `${top[0] ? top[0].score : 0}%`;

  renderRecommendations(top);
  renderFamilyFit(ranked);
  renderFallback(top);
  drawRadar();
}

function enforceTopRule(ranked) {
  if (!ranked.length) return ranked;

  const reordered = [...ranked];
  const isCleaning = (role) => Array.isArray(role.tags) && role.tags.includes("cleaner");

  if (isCleaning(reordered[0])) {
    const fallbackIdx = reordered.findIndex((r) => !isCleaning(r));
    if (fallbackIdx > 0) {
      const first = reordered[0];
      reordered[0] = reordered[fallbackIdx];
      reordered[fallbackIdx] = first;
    }
  }

  const topScore = reordered[0]?.score ?? 0;
  if (topScore <= 0) return reordered;

  // Cleaning roles must always have a strictly lower score than top-1.
  return reordered.map((role) => {
    if (!isCleaning(role)) return role;
    return { ...role, score: Math.min(role.score, Math.max(0, topScore - 1)) };
  });
}
function detectProfile() {
  for (const p of profileMap) if (p.when(state.answers)) return p;
  return { key: "balanced_explorer", title: "РЎР±Р°Р»Р°РЅСЃРёСЂРѕРІР°РЅРЅС‹Р№ РёСЃСЃР»РµРґРѕРІР°С‚РµР»СЊ", desc: "РўС‹ РІС‹Р±РёСЂР°РµС€СЊ РєРѕРјС„РѕСЂС‚РЅС‹Р№ СЃС‚Р°СЂС‚ Рё РїРѕСЃС‚РµРїРµРЅРЅРѕ РѕС‚РєСЂС‹РІР°РµС€СЊ РїРѕРґС…РѕРґСЏС‰РёРµ РїСЂРѕС„РµСЃСЃРёРё РїРѕ РјРµСЂРµ РѕРїС‹С‚Р°." };
}

function rankRoles(a) {
  const userSkills = new Set(a.skills || []);
  const userInterests = new Set(a.interests || []);

  return rolesCatalog
    .map((r) => {
      let score = 15;
      if (r.city.includes(a.city)) score += 10;
      if (r.intensity === a.physical) score += 11;
      if (r.standing === a.standing) score += 9;
      if (r.outdoor === a.outdoor) score += 8;
      if (r.heavy === a.heavy_weight) score += 8;
      if (r.digital === a.digital) score += 10;
      if (r.communication === a.communication) score += 10;
      if (r.payModel === a.pay_model) score += 8;
      if (r.cleaning === a.cleaning) score += 6;
      if (r.training === a.training_ready) score += 5;

      for (const s of r.skills) {
        if (userSkills.has(s)) score += 7;
        if (userInterests.has(s)) score += 5;
      }

      if (a.pay_priority === "РњР°РєСЃРёРјСѓРј Р·Р°СЂР°Р±РѕС‚РєР°" && r.pay >= 5200) score += 8;
      if (a.pay_priority === "РЎС‚Р°Р±РёР»СЊРЅС‹Р№ РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Р№ РґРѕС…РѕРґ" && r.pay <= 4600) score += 6;
      if (a.pay_priority === "РљРѕРјС„РѕСЂС‚ Рё РјРµРЅСЊС€Рµ СЃС‚СЂРµСЃСЃР°" && r.communication !== "Р›СЋР±Р»СЋ РѕР±С‰Р°С‚СЊСЃСЏ") score += 6;

      return { ...r, score: Math.min(100, score) };
    })
    .sort((x, y) => y.score - x.score);
}

function renderRecommendations(items) {
  ui.recommendations.innerHTML = `
    <h3>РўРѕРї-3 РїСЂРѕС„РµСЃСЃРёРё РґР»СЏ С‚РµР±СЏ</h3>
    ${items.map((it) => `
      <div class="rec-card">
        <h4>${it.role} - match ${it.score}%</h4>
        <p><strong>РЎРµРјРµР№СЃС‚РІРѕ:</strong> ${it.family} | <strong>РћСЂРёРµРЅС‚РёСЂ РїРѕ СЃС‚Р°РІРєРµ:</strong> ${it.pay} в‚Ѕ Р·Р° СЃРјРµРЅСѓ</p>
        <div>${it.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    `).join("")}
  `;
}

function renderFamilyFit(ranked) {
  const map = {};
  ranked.forEach((r) => {
    if (!map[r.family]) map[r.family] = [];
    map[r.family].push(r.score);
  });
  const rows = Object.entries(map)
    .map(([family, arr]) => ({ family, fit: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) }))
    .sort((a, b) => b.fit - a.fit);

  ui.familyFit.innerHTML = `
    <h3>РљР°С‚Р°Р»РѕРі РїСЂРѕС„РµСЃСЃРёР№ РЎРјРµРЅС‹: С‚РІРѕР№ СѓСЂРѕРІРµРЅСЊ СЃРѕРІРїР°РґРµРЅРёСЏ</h3>
    ${rows.map((r) => `
      <div class="rec-card">
        <p><strong>${r.family}</strong> - ${r.fit}%</p>
        <div class="progress"><span style="width:${r.fit}%"></span></div>
      </div>
    `).join("")}
  `;
}

function renderFallback(top) {
  if (top.some((x) => x.score >= 62)) {
    ui.fallbackBox.classList.add("hidden");
    return;
  }

  const wl = (state.answers.interests || []).slice(0, 3);
  ui.fallbackBox.classList.remove("hidden");
  ui.fallbackBox.classList.add("fallback");
  ui.fallbackBox.innerHTML = `
    <h3>РџР»Р°РЅ Р‘: РµСЃР»Рё СЃРёР»СЊРЅС‹С… СЃРѕРІРїР°РґРµРЅРёР№ РјР°Р»Рѕ</h3>
    <p>РЎРµР№С‡Р°СЃ Сѓ РїСЂРѕС„РёР»СЏ РјР°Р»Рѕ СЂРѕР»РµР№ РІС‹С€Рµ РїРѕСЂРѕРіР° 62%. Р­С‚Рѕ РЅРѕСЂРјР°Р»СЊРЅР°СЏ СЂС‹РЅРѕС‡РЅР°СЏ СЃРёС‚СѓР°С†РёСЏ.</p>
    <p><strong>РЈРјРЅС‹Р№ РІРёС€Р»РёСЃС‚:</strong> ${wl.length ? wl.join(", ") : "РљР°СЃСЃР°, Р’С‹РєР»Р°РґРєР° С‚РѕРІР°СЂРѕРІ, РЎР±РѕСЂРєР° Р·Р°РєР°Р·РѕРІ"}.</p>
  `;
}

function drawRadar() {
  const c = ui.radar;
  const ctx = c.getContext("2d");
  const labels = ["Р¤РёР·РёРєР°", "РћР±С‰РµРЅРёРµ", "Р¦РёС„СЂР°", "РЎС‚Р°Р±РёР»СЊРЅРѕСЃС‚СЊ", "РћР±СѓС‡РµРЅРёРµ"];
  const vals = [state.score.physical, state.score.communication, state.score.digital, state.score.stability, state.score.learning];
  const cx = 160;
  const cy = 130;
  const r = 90;
  const angle = (Math.PI * 2) / labels.length;

  ctx.clearRect(0, 0, c.width, c.height);

  for (let level = 1; level <= 5; level++) {
    ctx.beginPath();
    for (let i = 0; i < labels.length; i++) {
      const rr = (r / 5) * level;
      const x = cx + rr * Math.cos(-Math.PI / 2 + i * angle);
      const y = cy + rr * Math.sin(-Math.PI / 2 + i * angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#dbe4ee";
    ctx.stroke();
  }

  labels.forEach((label, i) => {
    const x = cx + (r + 16) * Math.cos(-Math.PI / 2 + i * angle);
    const y = cy + (r + 16) * Math.sin(-Math.PI / 2 + i * angle);
    ctx.fillStyle = "#334155";
    ctx.font = "12px Segoe UI";
    ctx.fillText(label, x - 24, y);
  });

  ctx.beginPath();
  vals.forEach((v, i) => {
    const rr = (v / 100) * r;
    const x = cx + rr * Math.cos(-Math.PI / 2 + i * angle);
    const y = cy + rr * Math.sin(-Math.PI / 2 + i * angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 118, 110, 0.25)";
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function downloadProfile() {
  const payload = {
    profile: state.answers,
    game_score: state.score,
    badges: state.badges,
    saved_at: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smena-profile.json";
  a.click();
  URL.revokeObjectURL(url);
}
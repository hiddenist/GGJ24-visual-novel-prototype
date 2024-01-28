const lang = {
    "What's your name?": {
        en: "What's your name?",
        pt: "Qual é o seu nome?",
        jp: "お名前は何ですか？",
    },
    "Start (button)": {
        en: "Start",
        pt: "Começar",
        jp: "スタート",
    },
    "Next (button)": {
        en: "Next",
        pt: "Próximo",
        jp: "次",
    },
    "Back (button)": {
        en: "Back",
        pt: "Voltar",
        jp: "戻る",
    },
}


export const defaultLang = navigator.languages[0]?.split("-")[0] as keyof typeof lang[keyof typeof lang] ?? "en";

export const t = (key: keyof typeof lang, langCode: keyof typeof lang[keyof typeof lang] = defaultLang) => {
    return lang[key][langCode] ?? Object.values(lang[key])[0];
};

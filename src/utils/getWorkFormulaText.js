/**
 * 与えられたworkFormulaオブジェクトに基づいて、楽器の略称とその数を表すテキストを生成します。
 * 
 * @param {Object} workFormula - 各楽器の演奏人数を表すオブジェクト。
 * 
 * @returns {string} 楽器の略称と演奏人数を組み合わせた文字列。複数のセクションは「 — 」で区切られ、各セクション内では楽器ごとのテキストがカンマで区切られます。
 * 例: "Fl. 2, Ob. 1 — Hrn. 4, Trp. 3 — Timp. 1"
 */
export const getWorkFormulaText = (workFormula) => {
  const instrumentAbbreviations = [
    [
      { keyName: "flute", abbreviation: "Fl." },
      { keyName: "oboe", abbreviation: "Ob." },
      { keyName: "clarinet", abbreviation: "Cl." },
      { keyName: "bassoon", abbreviation: "Bsn." }
    ], [
      { keyName: "horn", abbreviation: "Hrn." },
      { keyName: "trumpet", abbreviation: "Trp." },
      { keyName: "trombone", abbreviation: "Trb." },
      { keyName: "tuba", abbreviation: "Tub." }
    ], [
      { keyName: "timpani", abbreviation: "Timp." },
      { keyName: "percussion", abbreviation: "Perc." }
    ], [
      { keyName: "harp", abbreviation: "Hrp." },
      { keyName: "keyboard", abbreviation: "Kybd." }
    ], [
      { keyName: "str", abbreviation: "Str." }
    ]
  ];

  const workFormulaText = instrumentAbbreviations
    .map(section => section.map(({ keyName, abbreviation }) => {
      if (workFormula[keyName]) {
        if (keyName === "str") {
          return "Strings";
        } else {
          return `${abbreviation} ${workFormula[keyName]}`;
        }
      } else {
        return null;
      }
    }))
    .map(section => section.filter(text => text !== null))
    .filter(section => section.some(text => text))
    .map(section => section.join(", "))
    .join(" — ");

  return workFormulaText;
};

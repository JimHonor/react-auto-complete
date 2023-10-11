// String

const insertTextAt = (source = "", text = "", at = 0) => {
  const beforeAt = source.slice(0, at);
  const afterAt = source.slice(at);
  return beforeAt + text + afterAt;
};

// DOM

export const getCaretAt = (event) => event.target.selectionStart;

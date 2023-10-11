import { useRef, useState, useEffect } from "react";
import { getCaretAt } from "./utils";

export const useAutoComplete = (initialData = [], trigger = "#") => {
  //
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focusAt, setFocusAt] = useState(0);
  const [data, setData] = useState(initialData);

  const [caretAt, setCaretAt] = useState(0);

  const inputRef = useRef(null);

  const valueBeforeOpen = useRef("");

  const PATTERN_TRIGGER_OPEN = /(?<!\S)#\w*$/gm;

  const handleChange = (event) => {
    if (!inputRef.current) {
      inputRef.current = event.target;
    }

    // HANDLE VALUE CHANGE
    const newValue = event.target.value;
    setValue(newValue);

    // HANDLE OPEN
    const { open, keyword } = handleCaretMove(event, newValue);

    // HANDLE KEYWORD CHANGE WHEN OPEN
    // HANDLE DATA
    if (open) {
      handleDataChange(keyword);
    }
  };

  const handleCaretMove = (event, value) => {
    const newCaretAt = getCaretAt(event);
    setCaretAt(newCaretAt);
    const textBeforeNewCaret = value.slice(0, newCaretAt);
    const match = textBeforeNewCaret.match(PATTERN_TRIGGER_OPEN);
    let open, keyword;
    if (match) {
      open = true;
      keyword = match[0].slice(1);

      // get position of trigger
      const position = textBeforeNewCaret.length - keyword.length;
      // setCaretAt(position);
    } else {
      open = false;
    }
    setOpen(open);
    return { open, keyword };
  };

  const handleDataChange = (keyword = "") => {
    let newData;
    if (keyword === "") {
      newData = initialData;
    } else {
      newData = initialData.filter((d) => d.includes(keyword));
    }
    setData(newData);
  };

  const handleSubmit = (selectedText = "") => {
    // get index of trigger before caret
    // get chars before trigger
    // - get chars before caret
    // - find chars like "#xxx"
    // - get length of "xxx"
    // - charsBeforeCaret.slice(0, charsBeforeCaret.length - "xxx".length)
    // get chars after caret
    // sum: chars before trigger + selected text + chars after caret
    const charsBeforeCaret = value.slice(0, caretAt);
    const charsAfterTriggerAndBeforeCaret =
      charsBeforeCaret.match(PATTERN_TRIGGER_OPEN)[0];
    const charsBeforeTrigger = charsBeforeCaret.slice(
      0,
      charsBeforeCaret.length - charsAfterTriggerAndBeforeCaret.length
    );
    const charsAfterCaret = value.slice(caretAt);
    const newValue = charsBeforeTrigger + selectedText + charsAfterCaret;

    setValue(newValue);
    setOpen(false);

    const triggerIndex = charsBeforeTrigger.length;
    setFocusAt(triggerIndex + selectedText.length);
    setSelectedIndex(0);
  };

  const handleItemClick = (index) => {
    setSelectedIndex(index);
    handleSubmit(data[index]);
  };

  const handleInputKeyup = (event) => {
    const { key } = event;
    const KEYS = {
      ENTER: "Enter",
      ARROW_UP: "ArrowUp",
      ARROW_DOWN: "ArrowDown",
      ARROW_LEFT: "ArrowLeft",
      ARROW_RIGHT: "ArrowRight",
      BACKSPACE: "Backspace",
      ESCAPE: "Escape",
    };

    const ARROW_KEYS = [
      KEYS.ARROW_UP,
      KEYS.ARROW_RIGHT,
      KEYS.ARROW_DOWN,
      KEYS.ARROW_LEFT,
    ];
    if (ARROW_KEYS.includes(key)) {
      const { open, keyword } = handleCaretMove(event, value);
      if (open) {
        handleDataChange(keyword);

        if (key === KEYS.ARROW_UP || KEYS.ARROW_DOWN) {
          event.preventDefault();
        }
      }
    }

    if (!open) return;

    if (key === KEYS.ENTER) {
      event.preventDefault();

      handleSubmit(data[selectedIndex]);
      return;
    }

    if (key === KEYS.ARROW_DOWN) {
      event.preventDefault();

      const isLastItem = selectedIndex === data.length - 1;
      if (isLastItem) {
        setSelectedIndex(0);
      } else {
        setSelectedIndex((prev) => prev + 1);
      }
      return;
    }

    if (key === KEYS.ARROW_UP) {
      event.preventDefault();

      const isFirstItem = selectedIndex === 0;
      if (isFirstItem) {
        setSelectedIndex(data.length - 1);
      } else {
        setSelectedIndex((prev) => prev - 1);
      }
      return;
    }

    if (key === KEYS.ESCAPE) {
      setOpen(false);
      return;
    }
  };

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.addEventListener("keydown", handleInputKeydown);
  //   }

  //   return () => {
  //     inputRef.current.removeEventListener("keydown", handleInputKeydown);
  //   };
  // }, [selectedIndex, data]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(focusAt, focusAt);
    }
  }, [focusAt]);

  return {
    value,
    data,
    open,
    selectedIndex,
    handleChange,
    handleItemClick,
    handleInputKeyup,
  };
};

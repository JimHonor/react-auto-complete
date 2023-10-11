import { useEffect } from "react";
import { useRef, useState } from "react";

export default function App() {
  return (
    <>
      <TextField />
    </>
  );
}

const suggestions = ["aaa", "bbb", "ccc", "aaa, bbb", "a", "aa"];

const TextField = () => {
  const { value, data, open, selectedIndex, handleChange, handleItemClick } =
    useSuggestion(suggestions);

  return (
    <div>
      <textarea
        className="p-4 outline-none"
        rows="10"
        value={value}
        onChange={handleChange}
      ></textarea>
      {open && data.length > 0 && (
        <ul className="border border-gray-500 border-solid rounded">
          {data.map((s, index) => (
            <li
              className="p-2 cursor-pointer hover:bg-gray-500"
              style={{
                backgroundColor: index === selectedIndex ? "#6b7280" : "",
              }}
              key={index}
              onClick={() => handleItemClick(index)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

//

const useSuggestion = (initialData = [], trigger = "#") => {
  //
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [caretAt, setCaretAt] = useState(0);
  const [focusAt, setFocusAt] = useState(0);
  const [data, setData] = useState(initialData);

  const inputRef = useRef(null);

  const valueBeforeOpen = useRef("");

  const handleChange = (event) => {
    if (!inputRef.current) {
      inputRef.current = event.target;
    }

    // HANDLE TRIGGER INPUT
    const input = event.nativeEvent.data;
    if (input === trigger) {
      setOpen(true);
      const caretAt = event.target.selectionStart;
      setCaretAt(caretAt);
      valueBeforeOpen.current = event.target.value;

      // HANDLE KEYWORD CHANGE
      setData(initialData);
    }

    //
    const newValue = event.target.value;
    setValue(newValue);

    // HANDLE KEYWORD CHANGE
    if (open) {
      const keyword = getKeyword(newValue);
      console.log("CHANGE", keyword);
      //
      let newData;
      if (keyword === "") {
        newData = initialData;
      } else {
        newData = initialData.filter((d) => d.includes(keyword));
      }
      setData(newData);
    }
  };

  const getKeyword = (value = "") => {
    const offset = value.length - valueBeforeOpen.current.length;
    return value.slice(caretAt, caretAt + offset);
  };

  const handleSubmit = (text = "") => {
    const newValue = insertTextAt(valueBeforeOpen.current, text, caretAt);
    setValue(newValue);
    setOpen(false);
    setFocusAt(caretAt + text.length);
    setSelectedIndex(0);
  };

  const handleItemClick = (index) => {
    setSelectedIndex(index);
    handleSubmit(data[index]);
  };

  const handleInputKeydown = (event) => {
    if (!open) return;

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

    if (key === KEYS.ARROW_RIGHT) {
      const isLastChar = getCaretAt(event) === value.length;
      if (!isLastChar) {
        setOpen(false);
      }
      return;
    }

    if (key === KEYS.ARROW_LEFT || key === KEYS.ESCAPE) {
      setOpen(false);
      return;
    }

    if (key === KEYS.BACKSPACE) {
      console.log("BACKSPACE", getKeyword(value));
      // setOpen(false);
      return;
    }
  };

  useEffect(() => {
    if (inputRef.current && open) {
      inputRef.current.addEventListener("keydown", handleInputKeydown);
    }

    return () => {
      inputRef.current.removeEventListener("keydown", handleInputKeydown);
    };
  }, [open, selectedIndex, data]);

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
  };
};

// utils
const insertTextAt = (source = "", text = "", at = 0) => {
  const textBefore = source.slice(0, at);
  const textAfter = source.slice(at);
  return textBefore + text + textAfter;
};

const getCaretAt = (event) => event.target.selectionStart;

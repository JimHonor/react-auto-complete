import { useAutoComplete } from "@src/lib/useAutoComplete";

const suggestions = ["aaa", "bbb", "ccc", "aaa, bbb", "a", "aa"];

export default function TextareaPlus() {
  const {
    value,
    data,
    open,
    selectedIndex,
    handleChange,
    handleItemClick,
    handleInputKeyup,
  } = useAutoComplete(suggestions);

  return (
    <div>
      <textarea
        className="p-4 outline-none"
        rows="10"
        value={value}
        onChange={handleChange}
        onKeyUp={handleInputKeyup}
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
}

import { useEffect, useState } from "react";

const useType = (string, type) => {
  // type as in true or false type the string
  const [strProgress, setStrProgress] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = string[count];
      setStrProgress(strProgress + nextIndex);
      const incCount = count < string.length - 1 ? count + 1 : count;
      setCount(incCount);
    }, 10);
  }, [count]);

  return type ? strProgress : string;
};

export default useType;

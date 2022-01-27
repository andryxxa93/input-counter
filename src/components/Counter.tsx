import { FunctionComponent, useEffect, useState } from "react";

const Counter: FunctionComponent = () => {
  const [sum, setCount] = useState(0);
  const [time, setTime] = useState(1);
  const [number, setNumber] = useState(0);
  const [start, setStart] = useState(false);
  const [startedTime, setStartedTime] = useState<null | number>(null);

  useEffect(() => {
    if (number === sum) {
      setStart(false);
    }
    const temp = sum / ( time * (29.4 * 24 * 60 * 60 * 10));
    const timer = (time && sum) && setInterval(() => {
      setNumber(prev => +(prev + temp).toFixed(2))
    }, 100);

    if (startedTime) {
      const timeCorrect = (Date.now() - startedTime!) / 100;
      if (timeCorrect * temp !== number) {
        setNumber(+(timeCorrect * temp).toFixed(2));
      }
    }
    document.title = number.toString();
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [start, number])
 
  const startHandler = () => {
    setStartedTime(Date.now())
    setNumber(0);
    setStart(true)
  }

  return (
    <div className="container">
      <input value={sum} onChange={(e) => setCount(+e.target.value)}/>
      <input value={time} onChange={(e) => setTime(+e.target.value)}/>
      <div>
          {number}
      </div>
      <button onClick={startHandler}>
        Start
      </button>
    </div>
  );
}
 
export default Counter;
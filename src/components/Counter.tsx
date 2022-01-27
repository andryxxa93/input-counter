import { FunctionComponent, useEffect, useState } from "react";
import { Radio, RadioChangeEvent, Input, Row, Col, Button, Typography, Space } from 'antd';

import './counter.scss'

const Counter: FunctionComponent = () => {
  const { Title } = Typography;

  const [sum, setCount] = useState(0);
  const [time, setTime] = useState(1);
  const [number, setNumber] = useState(0);
  const [start, setStart] = useState(false);
  const [startedTime, setStartedTime] = useState<null | number>(null);
  const [timeValue, setTimeValue] = useState('month');

  useEffect(() => {
    if (!start) {
      return 
    }
    let timeCountValue = 0;
    switch (timeValue) {
      case 'year':
        timeCountValue = 12 * 29.4 * 24;
        break
      case 'month':
        timeCountValue = 29.4 * 24
        break
      case 'day':
        timeCountValue = 24
    }
    const increment = sum / ( time * (timeCountValue * 60 * 60 * 10));
    const timer = (time && sum) && setInterval(() => {
      setNumber(prev => +(prev + increment).toFixed(2))
    }, 100);

    if (startedTime) {
      const timeCorrect = (Date.now() - startedTime!) / 100;
      if (+(timeCorrect * increment).toFixed(2) !== number) {
        setNumber(+(timeCorrect * increment).toFixed(2));
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

  const onChangeTimeValue = (e: RadioChangeEvent) => {
    setTimeValue(e.target?.value);
  };

  return (
    <div className="counter">
      <div className="counter__inputs">
        <Input.Group size="large">
          <Row gutter={8}>
            <Col span={12}>
              <Input onChange={(e) => setCount(+e.target.value)} value={sum} />
            </Col>
            <Col span={3}>
              <Input value={time} onChange={(e) => setTime(+e.target.value)}/>
            </Col>
            <Col>
            <Radio.Group size="large" buttonStyle="solid" onChange={onChangeTimeValue} defaultValue="month">
                <Radio.Button value="year">Year</Radio.Button>
                <Radio.Button value="month">Month</Radio.Button>
                <Radio.Button value="day">Day</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </Input.Group>
      </div>
      <Title>
          {number}
      </Title>
      <Space>
        <Button size="large" type="primary" onClick={startHandler}>Start</Button>
        <Button size="large" type="default" onClick={() => setStart(false)}>Stop</Button>
      </Space>
    </div>
  );
}
 
export default Counter;
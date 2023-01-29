import { useEffect, useRef, useState } from "react";
import styles from "../styles/MainScreen.module.css";
import OrdersTest from "./OrdersTest";

export default function OrdersTimeline({ openOrders, countOfTimeUp }: { openOrders: OrderDetails[]; countOfTimeUp: number }) {
  const containerRef = useRef<HTMLInputElement | null>(null);

  const widthOfTimeUpContainer = countOfTimeUp * 190;
  const [width, setWidth] = useState(0);

  const numberOfOrders = openOrders.length;
  const remainingSpace = width - numberOfOrders * 190;
  //   const remaingSpaceAsPercentage = (remainingSpace / width) * 100;

  //   console.log("reamining", remaingSpaceAsPercentage);

  const [gapsInPixels, setGapsInPixels] = useState<number[]>([]);

  console.log(gapsInPixels);

  useEffect(() => {
    let gapTime: number[] = [];

    const intervalID = setInterval(() => {
      let totalTime = 0;
      openOrders.forEach((order, index) => {
        // const timeOrderPlaced = new Date(order.timeOrderPlaced!);
        const timeNow = new Date().getTime();

        const timeInterval = Math.floor((timeNow - order.timeOrderPlaced!) / 1000);
        if (index === 0) {
          gapTime.push(timeInterval);
          totalTime = timeInterval;
        } else {
          gapTime.push(timeInterval - totalTime);
          totalTime += timeInterval - totalTime;
        }
      });
      //   gapTime.push(600 - totalTime); Dont need to calculate final gap?

      const gapTimeAsPercentage = gapTime.map((gap) => (gap / 600) * 100);
      const gapAsPixels = gapTimeAsPercentage.map((gapTime) => (remainingSpace * gapTime) / 100);

      setGapsInPixels([...gapAsPixels]);

      gapTime = [];
    }, 2000);

    return () => clearInterval(intervalID);
  }, [openOrders, remainingSpace]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current?.clientWidth) {
        setWidth(containerRef.current.clientWidth);
      }
    };
    if (containerRef.current?.clientWidth) {
      setWidth(containerRef.current.clientWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [widthOfTimeUpContainer]);

  console.log(gapsInPixels);
  let gap = 0;

  const newOpenOrders = openOrders.map((orders, index) => {
    if (index === 0) {
      gap += gapsInPixels[index];
    } else {
      gap += gapsInPixels[index] + 190;
    }

    return { ...orders, gapInPixels: gap };
  });

  console.log(newOpenOrders);

  return (
    <div ref={containerRef} className={styles["open-orders-wrapper"]}>
      <div>{newOpenOrders && newOpenOrders.map((order) => <OrdersTest key={order.orderId} order={order} />)}</div>
      <span className={styles["test"]}>{/* {width}:{remainingSpace} */}</span>
    </div>
  );
}
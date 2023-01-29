import styles from "../styles/MainScreen.module.css";

import { useContext, useState } from "react";
import { stationContext } from "../context/StationContext";
import Items from "./Items";
import Stopwatch from "./Stopwatch";
import Timer from "./Timer";

interface orderDetailsWithGap extends OrderDetails {
  gapInPixels: number;
}

export default function OrdersTest({ order }: { order: orderDetailsWithGap }) {
  const { selectedStation } = useContext(stationContext);

  const [isShowStopWatch, setIsShowStopWatch] = useState(false);

  

  // Sorts the order to display a particular stations items at the top
  order.orderItemDetails.sort((a, b) => {
    return Number(b.station === selectedStation) - Number(a.station === selectedStation);
  });

  const finishTime = new Date(order.timeOrderPlaced! + 600000);

  return (
    <div className={styles["single-order-test"]} style={{ left: order.gapInPixels }}>
      {!isShowStopWatch && <Timer setIsShowStopWatch={setIsShowStopWatch} finishTime={finishTime} />}
      {isShowStopWatch && <Stopwatch startTime={finishTime} />}
      <span>
        Table {order.tableNumber}
        <span> - {order.server}</span>
      </span>

      {order &&
        order.orderItemDetails.map((item) => {
          return (
            <div key={item.itemId}>
              <Items item={item} />
            </div>
          );
        })}
      <button className={styles["ready-button"]}>Order up</button>
    </div>
  );
}